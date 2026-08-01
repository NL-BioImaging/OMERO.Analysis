import json
from types import SimpleNamespace

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import RequestFactory

from omero_analysis import views
from omero_analysis.tokens import make_context_token

from .conftest import FakeAnnotation, FakeConnection, FakeObject
from .test_services import workspace_archive


def with_session(request):
    request.session = SimpleNamespace(session_key="test-session")
    return request


def token_for(conn, obj, operations):
    request = with_session(RequestFactory().post("/"))
    token, _ = make_context_token(request, conn, "Image", 1, obj, operations)
    return token


def test_unexpected_api_error_has_safe_request_id():
    @views.api_errors
    def failing(_request):
        raise RuntimeError("sensitive detail")

    response = failing(RequestFactory().get("/api/failing/"))
    body = json.loads(response.content)
    assert response.status_code == 500
    assert body["error"]["message"] == "The operation failed"
    assert len(body["error"]["request_id"]) == 12
    assert response["X-OMERO-Analysis-Request-ID"] == body["error"]["request_id"]
    assert b"sensitive detail" not in response.content


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
        "workspace_download",
        "pipeline_download",
        "notebook_download",
        "hierarchy",
        "library_list",
        "library_download",
        "settings_read",
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


def test_runtime_sandbox_has_an_isolated_boot_policy():
    request = RequestFactory().get("/omero_analysis/runtime-sandbox/")
    response = views.runtime_sandbox(request)
    policy = response["Content-Security-Policy"]
    assert response.status_code == 200
    assert "worker-src blob:" in policy
    assert "connect-src http://testserver" in policy
    assert "default-src 'none'" in policy
    assert b'oa-bootstrap' in response.content


def test_session_keepalive_marks_the_browser_session_for_renewal():
    request = with_session(RequestFactory().get("/api/session/keepalive/"))
    response = views.session_keepalive(request, conn=FakeConnection(FakeObject()))
    assert response.status_code == 200
    assert request.session.modified is True


def test_workspace_snapshot_list_upload_and_download_are_separate_from_inputs():
    snapshot = FakeAnnotation(
        21,
        "analysis.oa-workspace.zip",
        b"PK\x03\x04snapshot",
        namespace="nl.bioimaging.analysis.workspace.v1",
    )
    obj = FakeObject(annotations=[snapshot])
    conn = FakeConnection(obj)

    list_token = token_for(conn, obj, ["list"])
    request = with_session(RequestFactory().get("/"))
    request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = list_token
    response = views.workspace_snapshots(request, "Image", 1, conn=conn)
    body = json.loads(response.content)
    assert body["snapshots"][0]["kind"] == "workspace"
    assert body["snapshots"][0]["supported"] is False

    download_token = token_for(conn, obj, ["workspace_download"])
    request = with_session(RequestFactory().get("/"))
    request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = download_token
    response = views.download_workspace_snapshot(request, 21, conn=conn)
    assert response.status_code == 200
    assert b"".join(response.streaming_content) == b"PK\x03\x04snapshot"

    upload_token = token_for(conn, obj, ["workspace_upload"])
    request = with_session(
        RequestFactory().post(
            "/",
            data={
                "file": SimpleUploadedFile(
                    "saved.oa-workspace.zip",
                    workspace_archive(),
                    content_type="application/zip",
                )
            },
        )
    )
    request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = upload_token
    response = views.workspace_snapshots(request, "Image", 1, conn=conn)
    assert response.status_code == 201


def test_chat_bootstrap_accepts_only_attached_workspace_snapshot():
    snapshot = FakeAnnotation(
        21,
        "analysis.oa-workspace.zip",
        b"PK\x03\x04snapshot",
        namespace="nl.bioimaging.analysis.workspace.v1",
    )
    obj = FakeObject(annotations=[snapshot])
    request = with_session(
        RequestFactory().get(
            "/?type=Image&id=1&workspace_annotation=21"
        )
    )
    response = views.chat(request, conn=FakeConnection(obj))
    assert response.status_code == 200
    assert b'"selected_workspace_snapshot"' in response.content
    assert b'"annotation_id": 21' in response.content
    assert response["Content-Security-Policy"].startswith("default-src 'self'")
    assert "connect-src 'self' https:" in response["Content-Security-Policy"]
    assert "aumc-aicode" not in response["Content-Security-Policy"]


def test_notebook_upload_download_and_bootstrap_selection():
    payload = json.dumps({
        "nbformat": 4,
        "nbformat_minor": 5,
        "metadata": {"kernelspec": {"language": "python"}},
        "cells": [],
    }).encode()
    notebook = FakeAnnotation(
        31,
        "analysis.ipynb",
        payload,
        namespace="nl.bioimaging.analysis.notebook.v1",
    )
    obj = FakeObject(annotations=[notebook])
    conn = FakeConnection(obj)

    request = with_session(RequestFactory().get(
        "/?tab=notebook&type=Image&id=1&notebook_annotation=31"
    ))
    response = views.chat(request, conn=conn)
    assert response.status_code == 200
    assert b'"selected_notebook"' in response.content
    assert b'"annotation_id": 31' in response.content

    token = token_for(conn, obj, ["notebook_download"])
    request = with_session(RequestFactory().get("/"))
    request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = token
    response = views.download_notebook(request, 31, conn=conn)
    assert response.status_code == 200
    assert b"".join(response.streaming_content) == payload

    token = token_for(conn, obj, ["notebook_upload"])
    request = with_session(RequestFactory().post("/", data={
        "file": SimpleUploadedFile(
            "uploaded.ipynb", payload, content_type="application/x-ipynb+json"
        )
    }))
    request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = token
    response = views.upload_notebook(request, "Image", 1, conn=conn)
    assert response.status_code == 201
    assert json.loads(response.content)["notebook"]["kind"] == "notebook"
