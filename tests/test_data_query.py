from types import SimpleNamespace

import pytest
from django.test import RequestFactory, override_settings

from omero_analysis.data_query import (
    ChunkReader,
    DataQueryBroker,
    make_result_token,
    opaque_references,
    query_policy,
    source_format,
    validate_result_token,
)
from omero_analysis.errors import InvalidToken, RemoteQueryFailed, UnsupportedMedia
from omero_analysis.tokens import make_context_token, validate_context_token

from .conftest import FakeAnnotation, FakeConnection, FakeObject


def _request():
    request = RequestFactory().get("/")
    request.session = SimpleNamespace(session_key="query-session")
    return request


def _claims(request, conn, obj):
    token, _ = make_context_token(
        request, conn, "Image", 1, obj, ["data_query"]
    )
    request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = token
    return validate_context_token(request, conn, "data_query", "Image", 1, obj)


def test_supported_formats_and_threshold_policy(settings):
    info = SimpleNamespace(name="measurements.sqlite3", size=100)
    settings.OMERO_ANALYSIS_REMOTE_QUERY_THRESHOLD_BYTES = 100
    assert source_format(info.name) == "sqlite"
    assert query_policy(info, True)["default_mode"] == "remote"
    settings.OMERO_ANALYSIS_REMOTE_QUERY_THRESHOLD_BYTES = 0
    assert query_policy(info, True)["allowed_modes"] == ["remote"]
    assert query_policy(info, False)["allowed_modes"] == []
    with pytest.raises(UnsupportedMedia):
        source_format("generic.parquet")


def test_capabilities_expose_server_owned_query_policy(settings):
    settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_URL = ""
    settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_TOKEN = ""
    settings.OMERO_ANALYSIS_REMOTE_QUERY_THRESHOLD_BYTES = 104857600
    settings.OMERO_ANALYSIS_DATA_QUERY_RESULT_TTL_SECONDS = 600
    capabilities = DataQueryBroker().capabilities()
    assert capabilities["ready"] is False
    assert capabilities["threshold_bytes"] == 104857600
    assert capabilities["result_ttl_seconds"] == 600


def test_chunk_reader_is_bounded_and_reports_remaining_length():
    reader = ChunkReader(iter([b"abc", b"def"]), 6)
    assert reader.len == 6
    assert reader.read(2) == b"ab"
    assert reader.len == 4
    assert reader.read() == b"cdef"
    assert reader.read() == b""


def test_failed_source_upload_closes_chunk_generator(monkeypatch, settings):
    settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_URL = "http://worker.invalid"
    settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_TOKEN = "test-only"
    closed = []
    def chunks():
        try:
            yield b"a" * 100
            yield b"b" * 100
        finally:
            closed.append(True)
    broker = DataQueryBroker()
    def request(method, path, **kwargs):
        if path.endswith("resolve"):
            return {"cached": False}
        kwargs["data"].read(1024)
        raise RuntimeError("Interrupted upload")
    monkeypatch.setattr(broker, "_request", request)
    annotation = SimpleNamespace(getFileInChunks=chunks)
    info = SimpleNamespace(name="source.csv", size=200, mimetype="text/csv")
    with pytest.raises(RuntimeError, match="Interrupted upload"):
        broker._source(annotation, info, "scope", "source")
    assert closed == [True]
    broker.session.close()


def test_truncated_source_does_not_leave_multipart_encoder_spinning():
    reader = ChunkReader(iter([b"short"]), 10)
    with pytest.raises(RemoteQueryFailed, match="declared size"):
        reader.read(10)
    reader.close()


def test_opaque_references_and_encrypted_result_token_are_context_bound(monkeypatch):
    annotation = FakeAnnotation(11, "measurements.duckdb", b"database")
    obj = FakeObject(annotations=[annotation])
    conn = FakeConnection(obj)
    request = _request()
    claims = _claims(request, conn, obj)
    info = SimpleNamespace(
        annotation_id=11,
        file_id=111,
        size=8,
        name="measurements.duckdb",
    )
    scope, source_ref = opaque_references(request, conn, claims, info)
    assert len(scope) == len(source_ref) == 43
    assert "11" not in source_ref

    token = make_result_token(request, conn, claims, info, "res_secret")
    assert "res_secret" not in token
    assert validate_result_token(request, conn, token, obj, info)["result_id"] == "res_secret"
    with pytest.raises(InvalidToken):
        validate_result_token(request, conn, token[:-1] + "A", obj, info)
    other = SimpleNamespace(**{**info.__dict__, "file_id": 999})
    with pytest.raises(InvalidToken):
        validate_result_token(request, conn, token, obj, other)
    monkeypatch.setattr(
        "omero_analysis.data_query.data_query_result_ttl_seconds", lambda: -1
    )
    with pytest.raises(InvalidToken):
        validate_result_token(request, conn, token, obj, info)


class Response:
    def __init__(self, payload, ok=True):
        self.payload = payload
        self.ok = ok
        self.headers = {}

    def json(self):
        return self.payload

    def raise_for_status(self):
        if not self.ok:
            raise RuntimeError("failed")


class Session:
    def __init__(self):
        self.calls = []

    def get(self, url, timeout):
        self.calls.append(("GET", url, {}))
        return Response({"status": "ready"})

    def request(self, method, url, **kwargs):
        self.calls.append((method, url, kwargs))
        if url.endswith("/v1/capabilities"):
            return Response({"formats": ["duckdb", "sqlite", "csv"], "limits": {}})
        if url.endswith("/sources/resolve"):
            return Response({"cached": True, "source": {"source_id": "src_private"}})
        if url.endswith("/schema"):
            return Response({
                "source_id": "src_private",
                "format": "duckdb",
                "schema_digest": "schema",
                "tables": [],
            })
        return Response({
            "result_id": "res_private",
            "preview": [[1]],
            "row_count": 1,
            "byte_count": 2,
        })


@override_settings(
    OMERO_ANALYSIS_DATA_QUERY_WORKER_URL="http://worker:8000",
    OMERO_ANALYSIS_DATA_QUERY_WORKER_TOKEN="secret-token",
)
def test_broker_strips_worker_identifiers_and_uses_bearer_header():
    session = Session()
    broker = DataQueryBroker(session=session)
    annotation = FakeAnnotation(11, "measurements.duckdb", b"database")
    info = SimpleNamespace(
        name="measurements.duckdb", size=8, mimetype="application/octet-stream"
    )
    schema = broker.schema(annotation, info, "opaque-scope", "opaque-source")
    result, result_id = broker.query(
        annotation,
        info,
        "opaque-scope",
        "opaque-source",
        {"sql": "SELECT 1", "parameters": {}},
    )
    assert "source_id" not in schema
    assert "result_id" not in result
    assert result_id == "res_private"
    assert all(
        call[2].get("headers", {}).get("Authorization") == "Bearer secret-token"
        for call in session.calls
        if "/v1/" in call[1]
    )


@override_settings(
    OMERO_ANALYSIS_DATA_QUERY_WORKER_URL="http://worker:8000",
    OMERO_ANALYSIS_DATA_QUERY_WORKER_TOKEN="secret-token",
    OMERO_ANALYSIS_DATA_QUERY_REQUEST_TIMEOUT_SECONDS=330,
)
def test_broker_uses_configured_request_timeout():
    session = Session()
    broker = DataQueryBroker(session=session)
    annotation = FakeAnnotation(11, "measurements.duckdb", b"database")
    info = SimpleNamespace(
        name="measurements.duckdb", size=8, mimetype="application/octet-stream"
    )
    broker.query(
        annotation,
        info,
        "opaque-scope",
        "opaque-source",
        {"sql": "SELECT 1", "parameters": {}},
    )
    query_call = next(call for call in session.calls if call[1].endswith("/query"))
    assert query_call[2]["timeout"] == 330
