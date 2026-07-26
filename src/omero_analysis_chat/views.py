import json
import logging
from functools import wraps
from pathlib import Path
from urllib.parse import quote

from django.http import FileResponse, Http404, HttpResponseBadRequest, JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET, require_POST, require_http_methods

try:
    from omeroweb.decorators import ConnCleaningHttpResponse
    from omeroweb.webclient.decorators import login_required
except ImportError:
    from django.http import StreamingHttpResponse as ConnCleaningHttpResponse

    def login_required(*_args, **_kwargs):
        def decorator(function):
            return function

        return decorator

from .errors import AnalysisChatError
from .services import (
    can_annotate,
    checked_download,
    checked_project_snapshot_download,
    get_context_object,
    get_direct_attachment,
    list_attachment_dicts,
    object_context,
    upload_project_snapshot_annotation,
    upload_result_annotation,
)
from .tokens import make_context_token, validate_context_token

logger = logging.getLogger(__name__)
RUNTIME_ROOT = (
    Path(__file__).resolve().parent
    / "static"
    / "omero_analysis_chat"
    / "pyodide"
)


def api_errors(function):
    @wraps(function)
    def wrapped(*args, **kwargs):
        try:
            return function(*args, **kwargs)
        except AnalysisChatError as exc:
            return JsonResponse(
                {"error": {"code": exc.code, "message": str(exc)}},
                status=exc.status,
            )
        except Exception:
            logger.exception("Unhandled OMERO Analysis Chat error")
            return JsonResponse(
                {"error": {"code": "internal_error", "message": "The operation failed"}},
                status=500,
            )

    return wrapped


@require_GET
def runtime_asset(request, asset_path, **kwargs):
    """Serve only vendored Pyodide files with CORS for the opaque sandbox."""
    candidate = (RUNTIME_ROOT / asset_path).resolve(strict=False)
    try:
        candidate.relative_to(RUNTIME_ROOT.resolve())
    except ValueError as exc:
        raise Http404 from exc
    if not candidate.is_file():
        raise Http404
    content_types = {
        ".mjs": "text/javascript",
        ".js": "text/javascript",
        ".wasm": "application/wasm",
        ".json": "application/json",
        ".zip": "application/zip",
        ".whl": "application/zip",
    }
    response = FileResponse(
        candidate.open("rb"),
        content_type=content_types.get(candidate.suffix.lower(), "application/octet-stream"),
    )
    response["Access-Control-Allow-Origin"] = "*"
    response["Cross-Origin-Resource-Policy"] = "cross-origin"
    response["Cache-Control"] = "public, max-age=31536000, immutable"
    response["X-Content-Type-Options"] = "nosniff"
    return response


@login_required(setGroupContext=True)
def chat(request, conn=None, **kwargs):
    context = None
    object_type = request.GET.get("type")
    object_id = request.GET.get("id")
    if object_type or object_id:
        try:
            object_type, object_id, obj = get_context_object(conn, object_type, object_id)
            selected = []
            seen = set()
            for value in request.GET.getlist("data_annotation"):
                _, info = get_direct_attachment(obj, value)
                if info.annotation_id not in seen:
                    selected.append(info.to_dict())
                    seen.add(info.annotation_id)
            context = {
                **object_context(object_type, object_id, obj, conn),
                "selected_attachments": selected,
            }
        except AnalysisChatError as exc:
            return HttpResponseBadRequest(str(exc))
    return render(request, "omero_analysis_chat/chat.html", {"context": context})


@login_required(setGroupContext=True)
def panel(request, object_type, object_id, conn=None, **kwargs):
    object_type, object_id, obj = get_context_object(conn, object_type, object_id)
    return render(
        request,
        "omero_analysis_chat/panel.html",
        {"context": object_context(object_type, object_id, obj, conn)},
    )


@require_POST
@login_required(setGroupContext=True)
@api_errors
def context_token(request, conn=None, **kwargs):
    try:
        payload = json.loads(request.body or b"{}")
    except json.JSONDecodeError as exc:
        from .errors import InvalidObject

        raise InvalidObject("Request body must be valid JSON") from exc
    object_type, object_id, obj = get_context_object(
        conn, payload.get("object_type"), payload.get("object_id")
    )
    operations = ["context", "list", "download", "snapshot_download"]
    if can_annotate(obj):
        operations.extend(["upload", "snapshot_upload"])
    token, expires_at = make_context_token(
        request, conn, object_type, object_id, obj, operations
    )
    return JsonResponse(
        {
            "context_token": token,
            "expires_at": expires_at.isoformat(),
            "object_type": object_type,
            "object_id": object_id,
            "operations": operations,
        }
    )


@require_GET
@login_required(setGroupContext=True)
@api_errors
def context(request, object_type, object_id, conn=None, **kwargs):
    object_type, object_id, obj = get_context_object(conn, object_type, object_id)
    validate_context_token(request, conn, "context", object_type, object_id, obj)
    return JsonResponse(object_context(object_type, object_id, obj, conn))


@require_GET
@login_required(setGroupContext=True)
@api_errors
def attachments(request, object_type, object_id, conn=None, **kwargs):
    object_type, object_id, obj = get_context_object(conn, object_type, object_id)
    validate_context_token(request, conn, "list", object_type, object_id, obj)
    return JsonResponse({"attachments": list_attachment_dicts(obj)})


@require_GET
@login_required(setGroupContext=True, doConnectionCleanup=False)
@api_errors
def download_attachment(request, annotation_id, conn=None, **kwargs):
    claims = validate_context_token(request, conn, "download")
    _, _, obj = get_context_object(
        conn, claims["object_type"], claims["object_id"]
    )
    validate_context_token(
        request,
        conn,
        "download",
        claims["object_type"],
        claims["object_id"],
        obj,
    )
    annotation, info = checked_download(obj, annotation_id)
    response = ConnCleaningHttpResponse(
        annotation.getFileInChunks(), content_type=info.mimetype
    )
    response.conn = conn
    response["Content-Length"] = str(info.size)
    response["Content-Disposition"] = (
        "attachment; filename*=UTF-8''" + quote(info.name, safe="")
    )
    response["Cache-Control"] = "private, no-store"
    response["X-Content-Type-Options"] = "nosniff"
    return response


@require_POST
@login_required(setGroupContext=True)
@api_errors
def upload_result(request, object_type, object_id, conn=None, **kwargs):
    object_type, object_id, obj = get_context_object(conn, object_type, object_id)
    validate_context_token(request, conn, "upload", object_type, object_id, obj)
    result = upload_result_annotation(conn, obj, request.FILES.get("file"))
    return JsonResponse({"attachment": result}, status=201)


@require_http_methods(["GET", "POST"])
@login_required(setGroupContext=True)
@api_errors
def project_snapshots(request, object_type, object_id, conn=None, **kwargs):
    object_type, object_id, obj = get_context_object(conn, object_type, object_id)
    if request.method == "GET":
        validate_context_token(request, conn, "list", object_type, object_id, obj)
        values = [
            value for value in list_attachment_dicts(obj) if value["kind"] == "project"
        ]
        return JsonResponse({"snapshots": values})
    validate_context_token(request, conn, "snapshot_upload", object_type, object_id, obj)
    result = upload_project_snapshot_annotation(conn, obj, request.FILES.get("file"))
    return JsonResponse({"snapshot": result}, status=201)


@require_GET
@login_required(setGroupContext=True, doConnectionCleanup=False)
@api_errors
def download_project_snapshot(request, annotation_id, conn=None, **kwargs):
    claims = validate_context_token(request, conn, "snapshot_download")
    _, _, obj = get_context_object(
        conn, claims["object_type"], claims["object_id"]
    )
    validate_context_token(
        request,
        conn,
        "snapshot_download",
        claims["object_type"],
        claims["object_id"],
        obj,
    )
    annotation, info = checked_project_snapshot_download(obj, annotation_id)
    response = ConnCleaningHttpResponse(
        annotation.getFileInChunks(), content_type=info.mimetype
    )
    response.conn = conn
    response["Content-Length"] = str(info.size)
    response["Content-Disposition"] = (
        "attachment; filename*=UTF-8''" + quote(info.name, safe="")
    )
    response["Cache-Control"] = "private, no-store"
    response["X-Content-Type-Options"] = "nosniff"
    return response
