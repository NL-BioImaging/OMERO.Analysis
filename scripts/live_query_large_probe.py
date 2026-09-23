"""10M query/download/promotion through real OMERO in a private web process."""
import hashlib
import json
import os
from pathlib import Path
import sys
import time
from types import SimpleNamespace
import uuid


def main():
    data = json.load(sys.stdin)
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
    from omero_analysis.data_query_provenance import make_receipt, promote_result
    from omero_analysis.tokens import make_context_token

    settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_URL = data["worker_url"]
    settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_TOKEN = data["worker_token"]
    settings.OMERO_ANALYSIS_DATA_QUERY_REQUEST_TIMEOUT_SECONDS = 930
    settings.OMERO_ANALYSIS_DATA_QUERY_SOURCE_UPLOAD_TIMEOUT_SECONDS = 1800
    settings.OMERO_ANALYSIS_DATA_QUERY_RESULT_TTL_SECONDS = 3600
    settings.OMERO_ANALYSIS_DATA_QUERY_PROMOTION_MAX_BYTES = 2 * 1024**3
    prefix = "dqw-large-" + uuid.uuid4().hex[:12]
    settings.OMERO_ANALYSIS_DATA_QUERY_STATE_DIR = str(recovery.state_directory() / prefix)
    conn = BlitzGateway("root", data["password"], host="omeroserver", port=4064)
    assert conn.connect()
    datasets, source_files = [], []
    try:
        group = ExperimenterGroupI()
        group.name = rstring(prefix)
        group.ldap = rbool(False)
        group.details.permissions = PermissionsI("rwra--")
        group_id = conn.getAdminService().createGroup(group)
        conn.setGroupForSession(group_id)
        for fmt in ("duckdb", "sqlite", "csv"):
            obj = DatasetWrapper(conn, DatasetI())
            obj.setName(prefix + "-" + fmt)
            obj.save()
            datasets.append(obj.getId())
            path = Path(data["fixtures"]) / ("dataquery-benchmark." + fmt)
            # Use the same chunked upload function; test source ownership is
            # tracked by this fixture's finally block, outside promotion journals.
            class Tracker:
                def intent(self, role, kind):
                    return prefix + "-source-" + role
                def remember(self, role, identifier):
                    if role.endswith("_file"):
                        source_files.append(identifier)
            source = recovery.upload_annotation(conn, path, "application/octet-stream", prefix, Tracker(), fmt)
            obj.linkAnnotation(source)
            request = RequestFactory().post("/query/")
            request.session = SimpleNamespace(session_key=prefix)
            context_token, _ = make_context_token(request, conn, "Dataset", obj.getId(), obj, ["data_query"])
            request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = context_token
            claims, _, annotation, info, scope, reference = authorize_query_source(request, conn, annotation_id=source.getId())
            table = "data" if fmt == "csv" else "measurements"
            query = {"sql": f"SELECT * FROM {table} ORDER BY row_id", "parameters": {}}
            started = time.monotonic()
            broker = DataQueryBroker()
            result, identifier = broker.query(annotation, info, scope, reference, query)
            assert result["row_count"] == 10_000_000
            query_seconds = time.monotonic() - started
            digest, byte_count, lines = hashlib.sha256(), 0, 0
            with broker.download(identifier) as response:
                for chunk in response.iter_content(1024 * 1024):
                    digest.update(chunk)
                    byte_count += len(chunk)
                    lines += chunk.count(b"\n")
            assert lines == 10_000_001 and byte_count == result["byte_count"]
            assert digest.hexdigest() == result["execution"]["result_sha256"]
            result_token = make_result_token(request, conn, claims, info, identifier)
            receipt = make_receipt(request, conn, claims, info, result_token, query, result)
            start_save = time.monotonic()
            saved = promote_result(request, conn, {"result_token": result_token, "receipt": receipt})
            save_seconds = time.monotonic() - start_save
            assert promote_result(request, conn, {"result_token": result_token, "receipt": receipt})["reused"]
            # Reuse validates both persisted CSV and JSON bytes against the signed completion.
            print(json.dumps({"format": fmt, "status": "passed", "rows": lines - 1,
                              "bytes": byte_count, "sha256": digest.hexdigest(), "query_seconds": query_seconds,
                              "save_seconds": save_seconds, "total_seconds": time.monotonic() - started,
                              "saved": saved}), flush=True)
            broker.session.close()
    finally:
        for identifier in datasets:
            obj = conn.getObject("Dataset", identifier)
            if obj:
                ids = [a.getId() for a in obj.listAnnotations()]
                if ids:
                    conn.deleteObjects("Annotation", ids, wait=True)
                conn.deleteObjects("Dataset", [identifier], wait=True)
        for identifier in source_files:
            if conn.getObject("OriginalFile", identifier):
                conn.deleteObjects("OriginalFile", [identifier], wait=True)
        conn.close()


if __name__ == "__main__":
    main()
