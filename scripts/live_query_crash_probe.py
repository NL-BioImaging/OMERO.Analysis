"""Run inside a web container; SIGKILL only private child processes.

Credentials/receipts travel over stdin. Artifacts are uniquely scoped to synthetic
data; the regular web process and user sessions are not restarted.
"""
import hashlib
import io
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import tempfile
from types import SimpleNamespace
import uuid


def main():
    credentials = json.load(sys.stdin)
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "omeroweb.settings")
    import django
    django.setup()
    from django.conf import settings
    from django.test import RequestFactory
    from omero.gateway import BlitzGateway, DatasetWrapper
    from omero.model import ExperimenterGroupI, DatasetI, PermissionsI
    from omero.rtypes import rstring, rbool
    from omero_analysis import data_query_recovery as recovery
    from omero_analysis.data_query import DataQueryBroker, authorize_query_source, make_result_token
    from omero_analysis.data_query_provenance import make_receipt, promote_result, promotion_lock
    from omero_analysis.tokens import make_context_token

    if credentials.get("state"):
        settings.OMERO_ANALYSIS_DATA_QUERY_STATE_DIR = credentials["state"]
    conn = BlitzGateway("root", credentials["password"], host=credentials.get("host", "omeroserver"), port=4064)
    assert conn.connect()
    datasets = []
    request = RequestFactory().post("/query/")
    prefix = credentials.get("prefix") or "dqw-crash-" + uuid.uuid4().hex[:12]
    if "point" not in credentials:
        settings.OMERO_ANALYSIS_DATA_QUERY_STATE_DIR = str(recovery.state_directory() / prefix)
    request.session = SimpleNamespace(session_key=prefix)
    try:
        if "point" in credentials:
            conn.setGroupForSession(credentials["group"])
            request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = credentials["context_token"]
            def crash(name):
                if name == credentials["point"]:
                    os.kill(os.getpid(), signal.SIGKILL)
            recovery.checkpoint = crash
            promote_result(request, conn, credentials["payload"])
            raise AssertionError("Requested crash point was not reached")
        group = ExperimenterGroupI()
        group.name = rstring(prefix)
        group.ldap = rbool(False)
        group.details.permissions = PermissionsI("rwra--")
        group_id = conn.getAdminService().createGroup(group)
        conn.setGroupForSession(group_id)
        obj = DatasetWrapper(conn, DatasetI())
        obj.setName(prefix)
        obj.save()
        datasets.append(obj.getId())
        state = recovery.state_directory()
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "source.csv"
            path.write_bytes(b"id,name\n1,alpha\n2,beta\n")
            source = conn.createFileAnnfromLocalFile(str(path), mimetype="text/csv", ns=prefix)
            obj.linkAnnotation(source)
        token, _ = make_context_token(request, conn, "Dataset", obj.getId(), obj, ["data_query"])
        request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = token
        claims, _, annotation, info, scope, ref = authorize_query_source(request, conn, annotation_id=source.getId())
        points = ["csv_file:created", "csv_file:recorded", "csv_file:chunk", "csv_file:uploaded",
                  "csv:created", "csv:recorded", "recipe_file:created", "recipe_file:chunk",
                  "recipe_file:uploaded", "recipe:created", "recipe:recorded", "summary:created",
                  "summary:recorded", "csv:linked", "recipe:linked", "summary:linked", "complete:recorded",
                  "cleanup:Annotation", "cleanup:OriginalFile", "operator:reconcile"]
        points = credentials.get("points") or points
        outcomes = []
        for point in points:
            broker = DataQueryBroker()
            query = {"sql": "SELECT * FROM data ORDER BY id", "parameters": {}}
            result, identifier = broker.query(annotation, info, scope, ref, query)
            result_token = make_result_token(request, conn, claims, info, identifier)
            receipt = make_receipt(request, conn, claims, info, result_token, query, result)
            payload = {"result_token": result_token, "receipt": receipt}
            sequence = (["summary:created", point] if point == "cleanup:Annotation" else
                        ["csv_file:uploaded", point] if point == "cleanup:OriginalFile" else
                        ["csv:created"] if point == "operator:reconcile" else [point])
            for crash_point in sequence:
                child = subprocess.run([sys.executable, __file__], input=json.dumps({**credentials,
                    "point": crash_point, "group": group_id, "prefix": prefix, "state": str(state),
                    "context_token": token, "payload": payload}), text=True, capture_output=True)
                assert child.returncode == -signal.SIGKILL, (crash_point, child.returncode, child.stderr[-2000:])
            if point == "operator:reconcile":
                from django.core.management import call_command
                from unittest.mock import patch
                receipt_hash = hashlib.sha256(receipt.encode()).hexdigest()
                # Exercise the actual command with private in-memory password input.
                with patch('getpass.getpass', return_value=credentials['password']):
                    output = io.StringIO()
                    call_command('reconcile_query_promotions', host=credentials.get('host', 'omeroserver'),
                                 username='root', receipt_sha256=receipt_hash, stdout=output)
                    assert '"state": "incomplete"' in output.getvalue()
                    assert recovery.PromotionJournal(receipt_hash).value['state'] == 'pending'
                    output = io.StringIO()
                    call_command('reconcile_query_promotions', host=credentials.get('host', 'omeroserver'),
                                 username='root', receipt_sha256=receipt_hash, apply=True, stdout=output)
                    assert '"state": "cleaned"' in output.getvalue()
            saved = promote_result(request, conn, payload)
            assert saved["reused"] == (point in ("summary:linked", "complete:recorded")), (point, saved)
            assert promote_result(request, conn, payload)["reused"]
            journal = recovery.PromotionJournal(hashlib.sha256(receipt.encode()).hexdigest())
            with promotion_lock(journal.value["receipt_sha256"]):
                assert recovery.reconcile(conn, journal, apply=True)["state"] == "complete"
            outcomes.append({"point": point, "killed": "SIGKILL", "status": "passed"})
            print(json.dumps(outcomes[-1]), flush=True)
            broker.session.close()
        print(json.dumps({"event": "verdict", "status": "passed", "cases": len(outcomes)}), flush=True)
    finally:
        if "point" not in credentials:
            # Include unlinked files from interrupted uploads by reconciling pending journals first.
            for path in recovery.state_directory().glob("*.json"):
                journal = recovery.PromotionJournal(path.stem)
                with promotion_lock(path.stem):
                    recovery.reconcile(conn, journal, apply=True)
            for identifier in datasets:
                dataset = conn.getObject("Dataset", identifier)
                if dataset:
                    ids = [a.getId() for a in dataset.listAnnotations()]
                    if ids:
                        conn.deleteObjects("Annotation", ids, wait=True)
                    conn.deleteObjects("Dataset", [identifier], wait=True)
        conn.close()


if __name__ == "__main__":
    main()
