import hashlib
import json
from types import SimpleNamespace

import pytest
from django.test import RequestFactory

from omero_analysis import data_query_provenance as provenance
from omero_analysis.data_query import DataQueryBroker, authorize_query_source, make_result_token
from omero_analysis.errors import InvalidToken, PermissionDenied, RemoteQueryFailed
from omero_analysis.tokens import make_context_token
from omero_analysis import views

from .conftest import FakeAnnotation, FakeConnection, FakeObject

CSV = b"id,area\n1,10.5\n"


class Map:
    def __init__(self, identifier, values):
        self.identifier, self.values = identifier, values
    def getId(self):
        return self.identifier
    def getNs(self):
        return provenance.NAMESPACE
    def getValue(self):
        return list(self.values.items())


class Connection(FakeConnection):
    def __init__(self, obj):
        super().__init__(obj)
        self.sequence = 1000
        self.created_all = []
        self.current_group = obj.group_id
        self.unreadable_file = False
    def getEventContext(self):
        return SimpleNamespace(groupId=self.current_group)
    def getObject(self, kind, identifier):
        if kind == "OriginalFile" and self.unreadable_file:
            return None
        return super().getObject(kind, identifier)
    def createFileAnnfromLocalFile(self, path, mimetype, ns, desc):
        from pathlib import Path
        self.sequence += 1
        item = FakeAnnotation(self.sequence, Path(path).name, Path(path).read_bytes(), ns)
        item.file.mimetype = mimetype
        self.created_all.append(item)
        return item
    def deleteObjects(self, kind, identifiers, wait=True):
        super().deleteObjects(kind, identifiers, wait)
        for item in list(self.obj.linked):
            if item.getId() in identifiers:
                self.obj.unlinkAnnotation(item)


@pytest.fixture
def query_case(monkeypatch, settings, tmp_path):
    settings.OMERO_ANALYSIS_MAX_UPLOAD_BYTES = 1024 * 1024
    settings.OMERO_ANALYSIS_DATA_QUERY_STATE_DIR = str(tmp_path / "locks")
    settings.OMERO_ANALYSIS_DATA_QUERY_AUDIT_FILE = str(tmp_path / "audit.jsonl")
    annotation = FakeAnnotation(11, "measurements.csv", b"id,area\n1,10.5\n")
    obj = FakeObject(annotations=[annotation])
    conn = Connection(obj)
    request = RequestFactory().post("/api/data-source/11/query/", data=json.dumps({
        "sql": "SELECT * FROM data WHERE area > $minimum",
        "parameters": {"minimum": {"type": "float", "value": 1.0}}}), content_type="application/json")
    request.session = SimpleNamespace(session_key="query-session")
    token, _ = make_context_token(request, conn, "Image", 1, obj, ["data_query"])
    request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = token
    result = {"columns": [{"name": "id", "type": "INTEGER"}, {"name": "area", "type": "DOUBLE"}],
              "row_count": 1, "byte_count": len(CSV), "preview": [[1, 10.5]],
              "source_sha256": hashlib.sha256(annotation.data).hexdigest(),
              "sql_sha256": "b" * 64, "duration_ms": 3, "cache_status": "miss",
              "execution": {"schema": "result_provenance_v1", "result_sha256": hashlib.sha256(CSV).hexdigest(),
                            "schema_digest": "c" * 64, "versions": {"worker": "0.2.0"},
                            "limits": {"max_result_rows": 100000}, "executed_at": "2026-09-08T12:00:00Z"}}
    monkeypatch.setattr(DataQueryBroker, "query", lambda *args, **kwargs: (dict(result), "res_" + "a" * 64))
    class Response:
        closed = False
        def iter_content(self, **kwargs):
            yield CSV
        def close(self):
            self.closed = True
    response = Response()
    monkeypatch.setattr(DataQueryBroker, "download", lambda *args, **kwargs: response)
    monkeypatch.setattr(provenance, "_create_map", lambda conn, values: Map(2000, values))
    output = views.data_source_query(request, 11, conn=conn)
    assert output.status_code == 200, output.content
    payload = json.loads(output.content)
    saving = {"result_token": payload["result_token"], "receipt": payload["provenance_receipt"]}
    return request, conn, saving, response, result


def test_verified_csv_full_recipe_and_idempotent_save(query_case, settings):
    request, conn, payload, response, _ = query_case
    result = provenance.promote_result(request, conn, payload)
    assert not result["reused"] and response.closed
    assert len(conn.obj.linked) == 3
    assert conn.created_all[0].data == CSV
    recipe = json.loads(conn.created_all[1].data)
    assert recipe["sql"].startswith("SELECT * FROM data")
    assert recipe["parameters"]["minimum"]["value"] == 1.0
    assert recipe["source"]["file_id"] == 111
    assert "session" not in recipe and "result_token_sha256" not in recipe
    repeated = provenance.promote_result(request, conn, payload)
    assert repeated["reused"] and len(conn.created_all) == 2
    text = open(settings.OMERO_ANALYSIS_DATA_QUERY_AUDIT_FILE, encoding="utf-8").read()
    assert "SELECT" not in text and "minimum" not in text
    assert payload["receipt"] not in text and payload["result_token"] not in text
    assert "promotion_saved" in text


def test_modified_saved_recipe_is_not_reused(query_case):
    request, conn, payload, _, _ = query_case
    provenance.promote_result(request, conn, payload)
    conn.created_all[1].data = b'{"sql":"modified"}'
    repeated = provenance.promote_result(request, conn, payload)
    assert not repeated["reused"]
    assert len(conn.created_all) == 4


def test_download_stream_closes_response_and_audits_exact_bytes(query_case, settings):
    request, conn, payload, response, _ = query_case
    download_request = RequestFactory().get("/download/")
    download_request.session = request.session
    response.headers = {"Content-Length": str(len(CSV))}
    result = views.data_query_result_download(download_request, payload["result_token"], conn=conn)
    assert b"".join(result.streaming_content) == CSV
    assert response.closed
    with open(settings.OMERO_ANALYSIS_DATA_QUERY_AUDIT_FILE, encoding="utf-8") as handle:
        events = [json.loads(line) for line in handle]
    transfer = next(event for event in events if event["event"] == "download_transfer")
    assert transfer["result_sha256"] == hashlib.sha256(CSV).hexdigest()
    assert transfer["byte_count"] == len(CSV)


@pytest.mark.parametrize("change", ["receipt", "token", "session", "user", "group", "unlink", "file", "permission"])
def test_promotion_reauthorizes_and_tampering_creates_nothing(query_case, change):
    request, conn, payload, _, _ = query_case
    if change == "receipt":
        payload["receipt"] = payload["receipt"][:-4] + "xxxx"
    elif change == "token":
        payload["result_token"] = "invalid"
    elif change == "session":
        request.session.session_key = "other-session"
    elif change == "user":
        conn.user_id += 1
    elif change == "group":
        conn.current_group += 1
    elif change == "unlink":
        conn.obj.annotations = []
    elif change == "file":
        conn.unreadable_file = True
    elif change == "permission":
        conn.obj.can_annotate_value = False
    with pytest.raises(Exception):
        provenance.promote_result(request, conn, payload)
    assert not conn.created_all and not conn.obj.linked


def test_checksum_mismatch_closes_stream_and_creates_nothing(query_case):
    request, conn, payload, response, _ = query_case
    response.iter_content = lambda **kwargs: iter([b"id,area\n2,10.5\n"])
    with pytest.raises(RemoteQueryFailed, match="checksum"):
        provenance.promote_result(request, conn, payload)
    assert response.closed and not conn.created_all


def test_permission_change_during_transfer_is_rechecked(query_case):
    request, conn, payload, response, _ = query_case
    def chunks(**kwargs):
        yield CSV
        conn.obj.can_annotate_value = False
    response.iter_content = chunks
    with pytest.raises(PermissionDenied):
        provenance.promote_result(request, conn, payload)
    assert not conn.created_all


def test_failed_link_cleans_up_all_created_annotations(query_case):
    request, conn, payload, _, _ = query_case
    calls = 0
    link = conn.obj.linkAnnotation
    def fail(annotation):
        nonlocal calls
        calls += 1
        if calls == 2:
            raise RuntimeError("fixture failure")
        link(annotation)
    conn.obj.linkAnnotation = fail
    with pytest.raises(RuntimeError):
        provenance.promote_result(request, conn, payload)
    assert not conn.obj.linked
    assert {ids[0] for _, ids, _ in conn.deleted} == {1001, 1002, 2000}


def test_expired_receipt_requires_rerun(query_case, monkeypatch):
    request, conn, payload, _, _ = query_case
    monkeypatch.setattr(provenance, "data_query_result_ttl_seconds", lambda: -1)
    with pytest.raises(InvalidToken, match="rerun"):
        provenance.promote_result(request, conn, payload)
    assert not conn.created_all


def test_old_worker_does_not_issue_receipt(query_case):
    request, conn, _, _, result = query_case
    result.pop("execution")
    claims, _, _, info, _, _ = authorize_query_source(request, conn, annotation_id=11)
    assert provenance.make_receipt(request, conn, claims, info, "token", {"sql": "SELECT 1"}, result) is None


def test_tls_settings_apply_to_health_and_worker_requests(settings):
    settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_URL = "https://worker:8443"
    settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_TOKEN = "fixture-token"
    settings.OMERO_ANALYSIS_DATA_QUERY_CA_FILE = "ca.pem"
    settings.OMERO_ANALYSIS_DATA_QUERY_CLIENT_CERT_FILE = "client.pem"
    settings.OMERO_ANALYSIS_DATA_QUERY_CLIENT_KEY_FILE = "key.pem"
    broker = DataQueryBroker()
    assert broker.session.verify == "ca.pem" and broker.session.cert == ("client.pem", "key.pem")
    settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_URL = "http://worker"
    with pytest.raises(Exception, match="HTTPS"):
        DataQueryBroker()
