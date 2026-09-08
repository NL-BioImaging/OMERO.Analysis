"""Private stdin/stdout control protocol for the disposable power-cut VM.

Setup output contains ephemeral test receipts. The controller captures it in
memory; only redacted verdicts are written to evidence.
"""
import hashlib
import json
import os
from pathlib import Path
import sys
import tempfile
import time
from types import SimpleNamespace
import uuid


def main():
    data = json.load(sys.stdin)
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "omeroweb.settings")
    import django
    django.setup()
    from django.test import RequestFactory
    from omero.gateway import BlitzGateway, DatasetWrapper
    from omero.model import ExperimenterGroupI, DatasetI, PermissionsI
    from omero.rtypes import rstring, rbool
    from omero_analysis import data_query_recovery as recovery
    from omero_analysis.data_query import DataQueryBroker, authorize_query_source, make_result_token
    from omero_analysis.data_query_provenance import make_receipt, promote_result, promotion_lock
    from omero_analysis.tokens import make_context_token

    conn = BlitzGateway("root", data["password"], host="omeroserver", port=4064)
    assert conn.connect(), "Disposable OMERO is not ready"
    prefix = data.get("prefix") or "powercut-" + uuid.uuid4().hex
    request = RequestFactory().post("/query/")
    request.session = SimpleNamespace(session_key=prefix)
    try:
        if data["mode"] == "ready":
            conn.getUserId()
            print('{"status":"ready"}')
            return
        if data["mode"] == "setup":
            group = ExperimenterGroupI()
            group.name = rstring(prefix)
            group.ldap = rbool(False)
            group.details.permissions = PermissionsI("rwra--")
            group_id = conn.getAdminService().createGroup(group)
            conn.setGroupForSession(group_id)
            obj = DatasetWrapper(conn, DatasetI())
            obj.setName(prefix)
            obj.save()
            with tempfile.TemporaryDirectory() as tmp:
                path = Path(tmp) / "source.csv"
                path.write_bytes(b"id,name\n1,alpha\n2,beta\n")
                annotation = conn.createFileAnnfromLocalFile(str(path), mimetype="text/csv", ns=prefix)
                obj.linkAnnotation(annotation)
            token, _ = make_context_token(request, conn, "Dataset", obj.getId(), obj, ["data_query"])
            request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = token
            claims, _, source, info, scope, ref = authorize_query_source(request, conn, annotation_id=annotation.getId())
            query = {"sql": "SELECT * FROM data ORDER BY id", "parameters": {}}
            result, identifier = DataQueryBroker().query(source, info, scope, ref, query)
            result_token = make_result_token(request, conn, claims, info, identifier)
            receipt = make_receipt(request, conn, claims, info, result_token, query, result)
            # Private output, consumed by the orchestrator without logging it.
            print(json.dumps({"prefix": prefix, "group": group_id, "dataset": obj.getId(),
                              "context_token": token, "source": annotation.getId(),
                              "payload": {"result_token": result_token, "receipt": receipt}}))
            return
        conn.setGroupForSession(data["group"])
        request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = data["context_token"]
        if data["mode"] == "pause":
            def pause(point):
                if point != data["point"]:
                    return
                marker = recovery.state_directory() / "gate.barrier"
                with marker.open("w") as handle:
                    handle.write(point)
                    handle.flush()
                    os.fsync(handle.fileno())
                recovery._sync_directory(marker.parent)
                while True:
                    time.sleep(.2)
            recovery.checkpoint = pause
            promote_result(request, conn, data["payload"])
            raise AssertionError("Power-cut barrier was not reached")
        if data["mode"] == "recover":
            saved = promote_result(request, conn, data["payload"])
            expected_reuse = data["point"] in ("summary:linked", "complete:recorded")
            assert saved["reused"] == expected_reuse
            assert promote_result(request, conn, data["payload"])["reused"]
            key = hashlib.sha256(data["payload"]["receipt"].encode()).hexdigest()
            with promotion_lock(key):
                journal = recovery.PromotionJournal(key)
                assert recovery.reconcile(conn, journal, apply=True)["state"] == "complete"
            obj = conn.getObject("Dataset", data["dataset"])
            assert len(list(obj.listAnnotations())) == 4, "Expected source plus exactly three promotion annotations"
            assert not list(recovery.state_directory().glob("staging-" + journal.value["operation"] + "-*"))
            print(json.dumps({"point": data["point"], "status": "passed", "reused": saved["reused"]}))
        if data["mode"] == "cleanup":
            obj = conn.getObject("Dataset", data["dataset"])
            if obj:
                conn.deleteObjects("Annotation", [a.getId() for a in obj.listAnnotations()], wait=True)
                conn.deleteObjects("Dataset", [obj.getId()], wait=True)
            print('{"status":"cleaned"}')
    finally:
        conn.close()


if __name__ == "__main__":
    main()
