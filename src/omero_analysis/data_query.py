"""OMERO-authorized broker for the OMERO-agnostic DataQueryWorker."""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import re
from pathlib import Path
from typing import Any

import requests
from cryptography.fernet import Fernet, InvalidToken as InvalidFernetToken
from django.conf import settings as django_settings
from requests_toolbelt import MultipartEncoder

from .errors import InvalidToken, RemoteQueryFailed, RemoteQueryUnavailable, UnsupportedMedia
from .services import object_group_id, get_context_object, get_scoped_attachment
from .tokens import validate_context_token
from .data_query_audit import correlation_id
from .settings import (
    data_query_request_timeout_seconds,
    data_query_result_ttl_seconds,
    data_query_source_upload_timeout_seconds,
    data_query_worker_token,
    data_query_worker_url,
    remote_query_threshold_bytes,
)

SUPPORTED_FORMATS = {
    ".duckdb": "duckdb",
    ".sqlite": "sqlite",
    ".sqlite3": "sqlite",
    ".csv": "csv",
}
CAPABILITY = "omero-data-query-v1"


class ChunkReader:
    """Bounded file-like adapter over the OMERO chunk iterator."""

    def __init__(self, chunks: Any, size: int) -> None:
        self._chunks = iter(chunks)
        self._buffer = b""
        self._remaining = size

    @property
    def len(self) -> int:
        return self._remaining

    def read(self, size: int = -1) -> bytes:
        if self._remaining <= 0:
            return b""
        target = self._remaining if size is None or size < 0 else min(size, self._remaining)
        while len(self._buffer) < target:
            try:
                self._buffer += bytes(next(self._chunks))
            except StopIteration:
                break
        value, self._buffer = self._buffer[:target], self._buffer[target:]
        self._remaining -= len(value)
        return value


def source_format(name: str) -> str:
    value = SUPPORTED_FORMATS.get(Path(name).suffix.lower())
    if value is None:
        raise UnsupportedMedia(
            "Remote queries support DuckDB, SQLite, and CSV attachments"
        )
    return value


def query_policy(info: Any, worker_ready: bool) -> dict[str, Any]:
    try:
        format_name = source_format(info.name)
    except UnsupportedMedia:
        return {}
    threshold = remote_query_threshold_bytes()
    forced = threshold == 0
    default_mode = "remote" if forced or info.size >= threshold else "local"
    allowed = ["remote"] if forced else ["local", "remote"]
    if not worker_ready:
        allowed = [mode for mode in allowed if mode != "remote"]
    reason = (
        "remote-required-by-policy"
        if forced
        else "size-at-or-above-threshold"
        if info.size >= threshold
        else "below-threshold"
    )
    return {
        "query_format": format_name,
        "default_mode": default_mode,
        "allowed_modes": allowed,
        "threshold_bytes": threshold,
        "threshold_reason": reason,
        "worker_ready": worker_ready,
    }


class DataQueryBroker:
    def __init__(self, session: requests.Session | None = None, request_id: str | None = None) -> None:
        self.url = data_query_worker_url()
        self.token = data_query_worker_token()
        self.session = session or requests.Session()
        self.request_id = correlation_id(request_id)
        ca = _secret_setting("DATA_QUERY_CA_FILE")
        cert = _secret_setting("DATA_QUERY_CLIENT_CERT_FILE")
        key = _secret_setting("DATA_QUERY_CLIENT_KEY_FILE")
        if bool(cert) != bool(key):
            raise RemoteQueryUnavailable("Both worker client certificate and key are required")
        if (ca or cert) and not self.url.startswith("https://"):
            raise RemoteQueryUnavailable("Worker TLS configuration requires an HTTPS URL")
        self.session.verify = ca or True
        if cert:
            self.session.cert = (cert, key)

    @property
    def configured(self) -> bool:
        return bool(self.url and self.token)

    def capabilities(self) -> dict[str, Any]:
        threshold = remote_query_threshold_bytes()
        unavailable = {
            "available": bool(self.configured),
            "ready": False,
            "capability": CAPABILITY,
            "formats": ["duckdb", "sqlite", "csv"],
            "threshold_bytes": threshold,
            "result_ttl_seconds": data_query_result_ttl_seconds(),
        }
        if not self.configured:
            return unavailable
        try:
            health = self.session.get(f"{self.url}/health/ready", timeout=3)
            try:
                health.raise_for_status()
            finally:
                _close(health)
            payload = self._request("GET", "/v1/capabilities", timeout=5)
        except (requests.RequestException, RemoteQueryFailed, RemoteQueryUnavailable):
            return unavailable
        return {
            "available": True,
            "ready": True,
            "capability": CAPABILITY,
            "formats": payload.get("formats", []),
            "limits": payload.get("limits", {}),
            "parameter_style": payload.get("parameter_style", "$name"),
            "csv_table": payload.get("csv_table", "data"),
            "threshold_bytes": threshold,
            "result_ttl_seconds": data_query_result_ttl_seconds(),
            "features": {"result_promotion_v1": bool(
                payload.get("features", {}).get("result_provenance_v1"))},
        }

    def schema(
        self, annotation: Any, info: Any, scope: str, source_ref: str
    ) -> dict[str, Any]:
        source = self._source(annotation, info, scope, source_ref)
        payload = self._request(
            "GET", f"/v1/sources/{source['source_id']}/schema"
        )
        return {key: value for key, value in payload.items() if key != "source_id"}

    def query(
        self,
        annotation: Any,
        info: Any,
        scope: str,
        source_ref: str,
        payload: dict[str, Any],
    ) -> tuple[dict[str, Any], str]:
        if set(payload) - {"sql", "parameters"}:
            raise RemoteQueryFailed("Remote query request contains unsupported fields")
        source = self._source(annotation, info, scope, source_ref)
        result = self._request(
            "POST",
            f"/v1/sources/{source['source_id']}/query",
            json=payload,
        )
        result_id = str(result.pop("result_id"))
        return result, result_id

    def download(self, result_id: str) -> requests.Response:
        return self._stream("GET", f"/v1/results/{result_id}/download")

    def _source(
        self, annotation: Any, info: Any, scope: str, source_ref: str
    ) -> dict[str, Any]:
        format_name = source_format(info.name)
        resolve = {
            "scope_id": scope,
            "source_ref": source_ref,
            "format": format_name,
            "size": info.size,
        }
        digest = getattr(info, "expected_sha256", None)
        if digest:
            resolve["expected_sha256"] = digest
        cached = self._request("POST", "/v1/sources/resolve", json=resolve)
        if cached.get("cached") and isinstance(cached.get("source"), dict):
            return cached["source"]
        reader = ChunkReader(annotation.getFileInChunks(), info.size)
        encoder = MultipartEncoder(
            fields={
                "scope_id": scope,
                "source_ref": source_ref,
                "format": format_name,
                "size": str(info.size),
                "file": (info.name, reader, info.mimetype),
                **({"expected_sha256": digest} if digest else {}),
            }
        )
        return self._request(
            "POST",
            "/v1/sources",
            data=encoder,
            headers={"Content-Type": encoder.content_type},
            timeout=data_query_source_upload_timeout_seconds(),
        )

    def _request(self, method: str, path: str, **kwargs: Any) -> dict[str, Any]:
        response = self._stream(method, path, **kwargs)
        try:
            value = response.json()
        except ValueError as exc:
            raise RemoteQueryFailed(
                "The data query worker returned an invalid response"
            ) from exc
        finally:
            _close(response)
        if not isinstance(value, dict):
            raise RemoteQueryFailed("The data query worker returned an invalid response")
        return value

    def _stream(self, method: str, path: str, **kwargs: Any) -> requests.Response:
        if not self.configured:
            raise RemoteQueryUnavailable(
                "The remote data query worker is not configured"
            )
        headers = {
            "Authorization": f"Bearer {self.token}",
            "X-Request-ID": self.request_id,
            **kwargs.pop("headers", {}),
        }
        try:
            response = self.session.request(
                method,
                f"{self.url}{path}",
                headers=headers,
                timeout=kwargs.pop("timeout", data_query_request_timeout_seconds()),
                stream=True,
                **kwargs,
            )
        except requests.RequestException as exc:
            raise RemoteQueryUnavailable(
                "The remote data query worker is unavailable"
            ) from exc
        if not response.ok:
            error = {}
            try:
                error = response.json()
                message = str(error.get("message") or error.get("detail") or "")
            except (ValueError, AttributeError):
                message = ""
            finally:
                _close(response)
            failure = RemoteQueryFailed(message or "Remote query failed")
            failure.worker_code = str(error.get("code") or "") if isinstance(error, dict) else ""
            failure.request_id = self.request_id
            failure.worker_status = response.status_code if hasattr(response, "status_code") else None
            raise failure
        return response


def opaque_references(
    request: Any, conn: Any, claims: dict[str, Any], info: Any
) -> tuple[str, str]:
    key = hashlib.sha256(
        (str(django_settings.SECRET_KEY) + "\0data-query-refs-v1").encode()
    ).digest()
    session_key = str(
        getattr(getattr(request, "session", None), "session_key", "") or ""
    )
    scope_material = (
        f"{conn.getUserId()}:{claims['group_id']}:{session_key}:"
        f"{claims['object_type']}:{claims['object_id']}"
    )
    source_material = (
        f"{scope_material}:{info.annotation_id}:{info.file_id}:"
        f"{info.size}:{info.name}"
    )
    revision = getattr(info, "source_revision", "")
    if revision:
        source_material += f":{revision}"
    return _opaque(key, scope_material), _opaque(key, source_material)


def _opaque(key: bytes, value: str) -> str:
    return (
        base64.urlsafe_b64encode(hmac.new(key, value.encode(), hashlib.sha256).digest())
        .decode()
        .rstrip("=")
    )


def make_result_token(
    request: Any,
    conn: Any,
    claims: dict[str, Any],
    info: Any,
    result_id: str,
) -> str:
    payload = {
        "v": 1,
        "user": int(conn.getUserId()),
        "group": claims["group_id"],
        "session": str(getattr(request.session, "session_key", "") or ""),
        "object_type": claims["object_type"],
        "object_id": claims["object_id"],
        "annotation_id": info.annotation_id,
        "file_id": info.file_id,
        "result_id": result_id,
        "source_revision": getattr(info, "source_revision", ""),
        "source_size": getattr(info, "size", None),
        "source_name": getattr(info, "name", None),
    }
    return _fernet().encrypt(
        json.dumps(payload, separators=(",", ":")).encode()
    ).decode()


def validate_result_token(
    request: Any, conn: Any, token: str, obj: Any, info: Any
) -> dict[str, Any]:
    try:
        payload = json.loads(
            _fernet().decrypt(
                token.encode(), ttl=data_query_result_ttl_seconds()
            )
        )
    except (InvalidFernetToken, ValueError, json.JSONDecodeError) as exc:
        raise InvalidToken(
            "The data query result token is invalid or expired"
        ) from exc
    expected = {
        "v": 1,
        "user": int(conn.getUserId()),
        "group": object_group_id(obj),
        "session": str(getattr(request.session, "session_key", "") or ""),
        "annotation_id": info.annotation_id,
        "file_id": info.file_id,
    }
    if not isinstance(payload, dict) or any(payload.get(key) != value for key, value in expected.items()):
        raise InvalidToken(
            "The data query result token is not valid for this context"
        )
    if payload.get("source_revision") and payload["source_revision"] != getattr(info, "source_revision", ""):
        raise InvalidToken("The query source changed; rerun the query")
    if ((payload.get("source_size") is not None and payload["source_size"] != getattr(info, "size", None)) or
            (payload.get("source_name") is not None and payload["source_name"] != getattr(info, "name", None))):
        raise InvalidToken("The query source changed; rerun the query")
    return payload


def result_token_claims(token: str) -> dict[str, Any]:
    try:
        value = json.loads(
            _fernet().decrypt(
                token.encode(), ttl=data_query_result_ttl_seconds()
            )
        )
    except (InvalidFernetToken, ValueError, json.JSONDecodeError) as exc:
        raise InvalidToken(
            "The data query result token is invalid or expired"
        ) from exc
    if not isinstance(value, dict):
        raise InvalidToken("The data query result token is invalid")
    return value


def _fernet() -> Fernet:
    digest = hashlib.sha256(
        (str(django_settings.SECRET_KEY) + "\0data-query-results-v1").encode()
    ).digest()
    return Fernet(base64.urlsafe_b64encode(digest))


def _close(response):
    close = getattr(response, "close", None)
    if close:
        close()


def _secret_setting(name):
    return str(getattr(django_settings, "OMERO_ANALYSIS_" + name, "") or
               __import__("os").environ.get("OMERO_ANALYSIS_" + name, "")).strip()


def authorize_query_source(request, conn, annotation_id=None, result_token=None):
    """Re-resolve the authorized parent, attachment and OriginalFile on every operation."""
    from types import SimpleNamespace
    from .services import _plain
    from .errors import PermissionDenied

    claims = result_token_claims(result_token) if result_token else validate_context_token(
        request, conn, "data_query")
    request.data_query_audit = {"user_id": int(conn.getUserId()),
                               "group_id": claims.get("group_id", claims.get("group")),
                               "object_type": claims.get("object_type"), "object_id": claims.get("object_id")}
    _, _, obj = get_context_object(conn, claims.get("object_type"), claims.get("object_id"))
    if not result_token:
        validate_context_token(request, conn, "data_query", claims["object_type"],
                               claims["object_id"], obj)
    event_context = getattr(conn, "getEventContext", None)
    if event_context and int(event_context().groupId) != object_group_id(obj):
        raise InvalidToken("The active OMERO group has changed")
    # OMERO session membership may lag an administrator's removal. Query the
    # current membership rows rather than relying only on the session cache.
    if hasattr(conn, "getQueryService"):
        from omero.sys import ParametersI
        memberships = conn.getQueryService().projection(
            "SELECT m.parent.id, m.parent.name FROM GroupExperimenterMap m WHERE m.child.id = :user "
            "AND (m.parent.id = :group OR m.parent.name IN ('system', 'user'))",
            ParametersI().addLong("user", int(conn.getUserId())).addLong("group", object_group_id(obj)))
        current_groups = {int(_plain(row[0])) for row in memberships}
        current_roles = {str(_plain(row[1])) for row in memberships}
        if "user" not in current_roles or (object_group_id(obj) not in current_groups and "system" not in current_roles):
            raise PermissionDenied("The active user's group access has been revoked")
    annotation, info = get_scoped_attachment(obj, claims.get("annotation_id") if result_token else annotation_id)
    request.data_query_audit.update(annotation_id=info.annotation_id, file_id=info.file_id)
    original = conn.getObject("OriginalFile", info.file_id)
    if original is None:
        raise PermissionDenied("The source file is no longer readable")
    native = getattr(original, "_obj", original)
    digest = str(_plain(getattr(native, "getHash", lambda: None)()) or "")
    hasher = getattr(native, "getHasher", lambda: None)()
    if hasher is not None and hasattr(hasher, "isLoaded") and not hasher.isLoaded():
        hasher = conn.getQueryService().get("ChecksumAlgorithm", int(_plain(hasher.getId())))
    algorithm = str(_plain(getattr(hasher, "getValue", lambda: hasher)()) or "").upper()
    details = getattr(original, "getDetails", lambda: None)()
    event = getattr(details, "getUpdateEvent", lambda: None)()
    revision = str(_plain(getattr(event, "getId", lambda: None)()) or "")
    current_size = int(_plain(original.getSize()))
    current_name = str(_plain(original.getName()))
    info = SimpleNamespace(**{**info.to_dict(), "size": current_size, "name": current_name},
                           source_revision=f"{algorithm}:{digest}:{revision}" if digest or revision else "",
                           expected_sha256=digest.lower() if algorithm in {"SHA-256", "SHA256", "SHA2-256"}
                           and re.fullmatch(r"[a-fA-F0-9]{64}", digest) else None)
    if result_token:
        claims = validate_result_token(request, conn, result_token, obj, info)
    scope, source_ref = opaque_references(request, conn, {
        **claims, "group_id": object_group_id(obj)}, info)
    return claims, obj, annotation, info, scope, source_ref
