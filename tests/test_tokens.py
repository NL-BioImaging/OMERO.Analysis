from types import SimpleNamespace

import pytest
from django.test import RequestFactory

from omero_analysis_chat.errors import InvalidToken
from omero_analysis_chat.tokens import make_context_token, validate_context_token

from .conftest import FakeConnection, FakeObject


def request_with_session(method="post", token=None):
    request = getattr(RequestFactory(), method)("/")
    request.session = SimpleNamespace(session_key="session-a")
    if token:
        request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = token
    return request


def test_context_is_bound_to_user_session_group_object_and_operation():
    obj = FakeObject(group_id=5)
    conn = FakeConnection(obj, user_id=8)
    token, _ = make_context_token(
        request_with_session(), conn, "Image", 1, obj, ["download"]
    )
    request = request_with_session("get", token)
    claims = validate_context_token(request, conn, "download", "Image", 1, obj)
    assert claims["group_id"] == 5
    with pytest.raises(InvalidToken):
        validate_context_token(request, conn, "upload", "Image", 1, obj)
    with pytest.raises(InvalidToken):
        validate_context_token(request, FakeConnection(obj, user_id=9), "download")
    other_session = request_with_session("get", token)
    other_session.session.session_key = "session-b"
    with pytest.raises(InvalidToken):
        validate_context_token(other_session, conn, "download")
    obj.group_id = 6
    with pytest.raises(InvalidToken):
        validate_context_token(request, conn, "download", "Image", 1, obj)


def test_missing_token_is_rejected():
    with pytest.raises(InvalidToken):
        validate_context_token(
            request_with_session("get"), FakeConnection(), "download"
        )

