from datetime import timedelta

from django.core import signing
from django.utils import timezone

from .errors import InvalidToken
from .services import object_group_id
from .settings import context_ttl_seconds

SALT = "omero-analysis-context-v1"


def _session_key(request):
    return str(getattr(getattr(request, "session", None), "session_key", "") or "")


def _user_id(conn):
    try:
        return int(conn.getUserId())
    except (AttributeError, TypeError, ValueError):
        return 0


def make_context_token(request, conn, object_type, object_id, obj, operations):
    issued = timezone.now()
    claims = {
        "version": 1,
        "user_id": _user_id(conn),
        "group_id": object_group_id(obj),
        "session_key": _session_key(request),
        "object_type": object_type,
        "object_id": int(object_id),
        "operations": list(operations),
    }
    token = signing.dumps(claims, salt=SALT, compress=True)
    return token, issued + timedelta(seconds=context_ttl_seconds())


def validate_context_token(
    request,
    conn,
    operation,
    object_type=None,
    object_id=None,
    obj=None,
):
    token = request.headers.get("X-OMERO-Analysis-Context", "")
    try:
        claims = signing.loads(
            token,
            salt=SALT,
            max_age=context_ttl_seconds(),
        )
    except signing.BadSignature as exc:
        raise InvalidToken("The analysis context is missing, invalid, or expired") from exc
    if claims.get("version") != 1 or operation not in claims.get("operations", []):
        raise InvalidToken("The analysis context does not permit this operation")
    if claims.get("user_id") != _user_id(conn):
        raise InvalidToken("The analysis context belongs to another user")
    if claims.get("session_key") != _session_key(request):
        raise InvalidToken("The analysis context belongs to another session")
    if object_type and claims.get("object_type") != object_type:
        raise InvalidToken("The analysis context belongs to another object")
    if object_id and claims.get("object_id") != int(object_id):
        raise InvalidToken("The analysis context belongs to another object")
    if obj is not None and claims.get("group_id") != object_group_id(obj):
        raise InvalidToken("The active OMERO group has changed")
    return claims

