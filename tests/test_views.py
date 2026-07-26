import json
from types import SimpleNamespace

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import RequestFactory

from omero_analysis_chat import views
from omero_analysis_chat.tokens import make_context_token

from .conftest import FakeAnnotation, FakeConnection, FakeObject


def with_session(request):
    request.session = SimpleNamespace(session_key="test-session")
    return request


def token_for(conn, obj, operations):
    request = with_session(RequestFactory().post("/"))
    token, _ = make_context_token(request, conn, "Image", 1, obj, operations)
    return token


def test_context_token_reports_permissions():
    obj = FakeObject(can_annotate=False)
    conn = FakeConnection(obj)
    request = with_session(
        RequestFactory().post(
            "/api/context-token/",
            data=json.dumps({"object_type": "Image", "object_id": 1}),
            content_type="application/json",
        )
    )
    response = views.context_token(request, conn=conn)
    body = json.loads(response.content)
    assert response.status_code == 200
    assert body["operations"] == [
        "context",
        "list",
        "download",
        "snapshot_download",
    ]


def test_download_checks_direct_link_and_returns_private_stream():
    obj = FakeObject(annotations=[FakeAnnotation(11, "data.csv", b"a\n1\n")])
    conn = FakeConnection(obj)
    token = token_for(conn, obj, ["download"])
    request = with_session(RequestFactory().get("/"))
    request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = token
    response = views.download_attachment(request, annotation_id=11, conn=conn)
    assert response.status_code == 200
    assert response["Cache-Control"] == "private, no-store"
    assert b"".join(response.streaming_content) == b"a\n1\n"


def test_runtime_assets_reject_traversal():
    request = RequestFactory().get("/")
    try:
        views.runtime_asset(request, "../LICENSE")
    except Exception as exc:
        from django.http import Http404

        assert isinstance(exc, Http404)
    else:
        raise AssertionError("Traversal was not rejected")


def test_project_snapshot_list_upload_and_download_are_separate_from_inputs():
    snapshot = FakeAnnotation(
        21,
        "analysis.oac.zip",
        b"PK\x03\x04snapshot",
        namespace="nl.bioimaging.analysis-chat.project.v1",
    )
    obj = FakeObject(annotations=[snapshot])
    conn = FakeConnection(obj)

    list_token = token_for(conn, obj, ["list"])
    request = with_session(RequestFactory().get("/"))
    request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = list_token
    response = views.project_snapshots(request, "Image", 1, conn=conn)
    body = json.loads(response.content)
    assert body["snapshots"][0]["kind"] == "project"
    assert body["snapshots"][0]["supported"] is False

    download_token = token_for(conn, obj, ["snapshot_download"])
    request = with_session(RequestFactory().get("/"))
    request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = download_token
    response = views.download_project_snapshot(request, 21, conn=conn)
    assert response.status_code == 200
    assert b"".join(response.streaming_content) == b"PK\x03\x04snapshot"

    upload_token = token_for(conn, obj, ["snapshot_upload"])
    request = with_session(
        RequestFactory().post(
            "/",
            data={
                "file": SimpleUploadedFile(
                    "saved.oac.zip",
                    b"PK\x03\x04data",
                    content_type="application/zip",
                )
            },
        )
    )
    request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = upload_token
    response = views.project_snapshots(request, "Image", 1, conn=conn)
    assert response.status_code == 201
