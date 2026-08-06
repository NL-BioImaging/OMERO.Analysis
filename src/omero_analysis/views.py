import json
import logging
import secrets
import uuid
from functools import wraps
from pathlib import Path
from urllib.parse import quote

from django.conf import settings
from django.http import (
    FileResponse,
    Http404,
    HttpResponse,
    HttpResponseBadRequest,
    JsonResponse,
)
from django.shortcuts import render
from django.urls import reverse
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

from .errors import AnalysisError
from .integrations import zarr_viewer_status
from .managed_omero import marker as managed_marker, plain as managed_plain
from .services import (
    can_annotate,
    checked_download,
    checked_notebook_download,
    checked_workspace_snapshot_download,
    checked_pipeline_download,
    get_context_object,
    get_direct_attachment,
    get_scoped_attachment,
    list_attachment_dicts,
    object_hierarchy,
    object_context,
    upload_notebook_annotation,
    upload_workspace_snapshot_annotation,
    upload_result_annotation,
    upload_pipeline_annotation,
)
from .tokens import make_context_token, validate_context_token
from .settings_store import SETTINGS_NAMESPACE, load_settings, save_settings
from .settings import integrated_data_analysis
from .workspace_sync import (
    SYNC_NAMESPACE,
    apply_sync,
    library_annotation,
    library_datasets,
    plan_sync,
    remove_sync,
    resolve_workspace_dataset,
    sync_status,
    validate_inventory,
)

logger = logging.getLogger(__name__)
WORKFLOW_SKILLS_CONSUMER = "omero-analysis"
PANEL_OBJECT_TYPES = {"Image", "Dataset", "Plate", "Screen", "Project", "Well"}
MULTI_SOURCE_TYPES = {"Image", "Plate"}
MAX_PANEL_SELECTION = 100
EMBEDDED_HOSTS = {"biomero"}
RUNTIME_ROOT = (
    Path(__file__).resolve().parent
    / "static"
    / "omero_analysis"
    / "pyodide"
)


def _embedded_host(request):
    values = request.GET.getlist("embedded")
    if not values:
        return ""
    if len(values) != 1 or values[0] not in EMBEDDED_HOSTS:
        raise ValueError("Unsupported embedded Analysis host")
    return values[0]


def api_errors(function):
    @wraps(function)
    def wrapped(*args, **kwargs):
        try:
            return function(*args, **kwargs)
        except AnalysisError as exc:
            return JsonResponse(
                {"error": {"code": exc.code, "message": str(exc)}},
                status=exc.status,
            )
        except Exception:
            request_id = uuid.uuid4().hex[:12]
            logger.exception("Unhandled OMERO Analysis error request_id=%s", request_id)
            response = JsonResponse(
                {
                    "error": {
                        "code": "internal_error",
                        "message": "The operation failed",
                        "request_id": request_id,
                    }
                },
                status=500,
            )
            response["X-OMERO-Analysis-Request-ID"] = request_id
            return response

    return wrapped


def _panel_context_object(conn, object_type, object_id):
    canonical = str(object_type or "").strip().capitalize()
    if canonical not in PANEL_OBJECT_TYPES:
        from .errors import InvalidObject

        raise InvalidObject("The selected OMERO object is not supported by Analysis")
    try:
        canonical_id = int(object_id)
    except (TypeError, ValueError) as exc:
        from .errors import InvalidObject

        raise InvalidObject("Object ID must be a positive integer") from exc
    if canonical_id <= 0:
        from .errors import InvalidObject

        raise InvalidObject("Object ID must be a positive integer")
    obj = conn.getObject(canonical, canonical_id)
    if obj is None:
        from .errors import ObjectNotFound

        raise ObjectNotFound("The selected object does not exist or is not readable")
    return canonical, canonical_id, obj


def _selected_source_objects(request, conn, object_type, object_id, obj):
    raw_ids = request.GET.getlist("selection_id")
    if not raw_ids:
        return []
    if object_type not in MULTI_SOURCE_TYPES:
        from .errors import InvalidObject

        raise InvalidObject("Multiple selection is supported for Images and Plates")
    values = []
    for raw in raw_ids:
        try:
            value = int(raw)
        except (TypeError, ValueError) as exc:
            from .errors import InvalidObject

            raise InvalidObject("Selection IDs must be positive integers") from exc
        if value <= 0:
            from .errors import InvalidObject

            raise InvalidObject("Selection IDs must be positive integers")
        if value not in values:
            values.append(value)
    if object_id not in values:
        values.insert(0, object_id)
    if len(values) > MAX_PANEL_SELECTION:
        from .errors import InvalidObject

        raise InvalidObject(
            f"Select no more than {MAX_PANEL_SELECTION} Images or Plates"
        )
    selected = []
    for value in values:
        candidate = obj if value == object_id else conn.getObject(object_type, value)
        if candidate is None:
            from .errors import ObjectNotFound

            raise ObjectNotFound("A selected object does not exist or is not readable")
        selected.append({
            "type": object_type,
            "id": value,
            "name": str(managed_plain(candidate.getName())),
            "supported": True,
        })
    return selected


@require_GET
def runtime_asset(request, asset_path, **kwargs):
    """Serve only vendored Pyodide files with CORS for the opaque sandbox."""
    candidate = (RUNTIME_ROOT / asset_path).resolve(strict=False)
    try:
        relative = candidate.relative_to(RUNTIME_ROOT.resolve())
    except ValueError as exc:
        raise Http404 from exc
    # Editable/source builds keep Pyodide beside this module. In a deployed
    # OMERO.web image the large, generated runtime may instead exist only in
    # STATIC_ROOT after collectstatic. Support both without exposing arbitrary
    # collected static files through this public, CORS-enabled endpoint.
    if not candidate.is_file():
        static_root = str(getattr(settings, "STATIC_ROOT", "") or "").strip()
        if static_root:
            collected_root = (
                Path(static_root)
                / "omero_analysis"
                / "pyodide"
            ).resolve(strict=False)
            collected_candidate = (collected_root / relative).resolve(strict=False)
            try:
                collected_candidate.relative_to(collected_root)
            except ValueError as exc:
                raise Http404 from exc
            candidate = collected_candidate
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


@require_GET
def runtime_sandbox(request, **kwargs):
    """Opaque iframe host whose policy permits only the vendored Python runtime."""
    response = render(request, "omero_analysis/runtime_sandbox.html")
    origin = f"{request.scheme}://{request.get_host()}"
    response["Content-Security-Policy"] = (
        "default-src 'none'; "
        f"script-src 'unsafe-inline' 'wasm-unsafe-eval' blob: {origin}; "
        f"connect-src {origin}; "
        "img-src data: blob:; style-src 'unsafe-inline'; worker-src blob:; "
        "object-src 'none'; base-uri 'none'; form-action 'none'"
    )
    response["Cache-Control"] = "no-store"
    response["Referrer-Policy"] = "no-referrer"
    return response


@require_GET
@login_required(ignore_login_fail=True)
def session_keepalive(request, conn=None, **kwargs):
    """Refresh the browser session and ping the connected OMERO server."""
    request.session.modified = True
    return HttpResponse("OK", content_type="text/plain")


@login_required(setGroupContext=True)
def analysis(request, conn=None, **kwargs):
    try:
        embedded_host = _embedded_host(request)
    except ValueError as exc:
        return HttpResponseBadRequest(str(exc))
    context = None
    object_type = request.GET.get("type")
    object_id = request.GET.get("id")
    if object_type or object_id:
        try:
            object_type, object_id, obj = get_context_object(conn, object_type, object_id)
            selected_objects = _selected_source_objects(
                request, conn, object_type, object_id, obj
            )
            selected = []
            seen = set()
            for value in request.GET.getlist("data_annotation"):
                _, info = get_scoped_attachment(obj, value)
                if info.annotation_id not in seen:
                    selected.append(info.to_dict())
                    seen.add(info.annotation_id)
            selected_workspace_snapshot = None
            snapshot_value = request.GET.get("workspace_annotation")
            if snapshot_value:
                _, snapshot_info = get_direct_attachment(obj, snapshot_value)
                if snapshot_info.kind != "workspace":
                    from .errors import UnsupportedMedia

                    raise UnsupportedMedia(
                        "The selected FileAnnotation is not an Analysis workspace"
                    )
                selected_workspace_snapshot = snapshot_info.to_dict()
            context = {
                **object_context(object_type, object_id, obj, conn),
                "selected_attachments": selected,
                "selected_workspace_snapshot": selected_workspace_snapshot,
                "selected_notebook": None,
            }
            if len(selected_objects) > 1:
                context.update({
                    "name": (
                        f"{len(selected_objects)} selected "
                        f"{object_type}{'s' if len(selected_objects) != 1 else ''}"
                    ),
                    "selected_objects": selected_objects,
                })
            notebook_value = request.GET.get("notebook_annotation")
            if notebook_value:
                _, notebook_info = get_direct_attachment(obj, notebook_value)
                if notebook_info.kind != "notebook":
                    from .errors import UnsupportedMedia

                    raise UnsupportedMedia(
                        "The selected FileAnnotation is not an Analysis notebook"
                    )
                context["selected_notebook"] = notebook_info.to_dict()
        except AnalysisError as exc:
            return HttpResponseBadRequest(str(exc))
    style_nonce = secrets.token_urlsafe(18)
    response = render(
        request,
        "omero_analysis/analysis.html",
        {
            "context": context,
            "keepalive_interval": max(
                0, int(getattr(settings, "PING_INTERVAL", 60000))
            ),
            "style_nonce": style_nonce,
            "embedded_host": embedded_host,
        },
    )
    response["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self'; "
        f"style-src 'self' 'nonce-{style_nonce}'; "
        "img-src 'self' data: blob:; "
        "connect-src 'self' https: http://localhost:* http://127.0.0.1:*; "
        "worker-src blob:; "
        "frame-src 'self' blob:; "
        "object-src 'none'; base-uri 'self'; form-action 'self'; "
        "frame-ancestors 'self'"
    )
    response["X-Frame-Options"] = "SAMEORIGIN"
    response["Referrer-Policy"] = "same-origin"
    return response


def _panel_library_datasets(conn, obj, allowed_kinds=None):
    kinds = (
        ("method", "Methods"),
        ("pipeline", "Pipelines"),
        ("notebook", "Notebooks"),
    )
    datasets = []
    allowed = set(allowed_kinds or (kind for kind, _label in kinds))
    for dataset in library_datasets(conn, obj):
        groups = [
            {
                "kind": kind,
                "label": label,
                "items": [
                    item for item in dataset["items"] if item["kind"] == kind
                ],
            }
            for kind, label in kinds
            if kind in allowed
        ]
        visible_groups = [group for group in groups if group["items"]]
        if not visible_groups:
            continue
        visible_items = [
            item for group in visible_groups for item in group["items"]
        ]
        datasets.append({
            **dataset,
            "items": visible_items,
            "groups": visible_groups,
        })
    return datasets


def _workspace_panel_summary(conn, obj, values):
    workspace_id = str(values.get("workspace_id") or "")
    selected = next(
        (
            dataset for dataset in library_datasets(conn, obj)
            if dataset["workspaceId"] == workspace_id
        ),
        None,
    )
    source_type = str(
        values.get("source_object_type") or
        (selected or {}).get("sourceObjectType") or ""
    ).capitalize()
    try:
        source_id = int(
            values.get("source_object_id") or
            (selected or {}).get("sourceObjectId") or 0
        )
    except (TypeError, ValueError):
        source_id = 0
    items = list((selected or {}).get("items") or [])
    snapshot = (selected or {}).get("snapshot") or {}
    counts = {
        kind: len([item for item in items if item.get("kind") == kind])
        for kind in ("method", "pipeline", "notebook")
    }
    return {
        "workspace_id": workspace_id,
        "workspace_name": str(
            values.get("workspace_name") or
            (selected or {}).get("workspaceName") or "Analysis Workspace"
        ),
        "dataset_name": str((selected or {}).get("datasetName") or ""),
        "source_type": source_type,
        "source_id": source_id,
        "source_name": str(
            values.get("source_object_name") or
            (selected or {}).get("sourceObjectName") or ""
        ),
        "revision": int((selected or {}).get("revision") or 0),
        "updated_at": str((selected or {}).get("updatedAt") or ""),
        "has_snapshot": bool((selected or {}).get("snapshot")),
        "snapshot_annotation_id": int(snapshot.get("annotationId") or 0) or None,
        "counts": counts,
        "can_resume": source_type in {"Image", "Dataset", "Plate", "Screen"}
        and source_id > 0,
    }


def _configure_panel_context(conn, obj, context):
    # An explicit multi-selection is always a new source set, even when its
    # first Image is itself a synchronized result from an older Workspace.
    if context.get("selection_count", 0) > 1:
        context["panel_kind"] = "source"
        context["analysis_library_datasets"] = _panel_library_datasets(conn, obj)
        return context

    _, sync_values = managed_marker(obj, SYNC_NAMESPACE)
    _, settings_values = managed_marker(obj, SETTINGS_NAMESPACE)
    sync_role = sync_values.get("role")
    settings_role = settings_values.get("role")
    object_type = context["object_type"]

    if settings_role in {"project", "ai-settings", "skills"}:
        context["panel_kind"] = "settings"
        context["managed_role"] = settings_role
        if settings_role == "ai-settings":
            context["managed_title"] = "AI Settings"
            context["managed_message"] = (
                "This managed Dataset stores encrypted Analysis provider settings. "
                "Open Analysis Settings to view or change profiles."
            )
            context["managed_count"] = settings_values.get("profile_count")
        elif settings_role == "skills":
            context["managed_title"] = "Skills"
            context["managed_message"] = (
                "This managed Dataset stores user-added Analysis skills. "
                "Skills are restored automatically and edited from Analysis Settings."
            )
            context["managed_count"] = settings_values.get("skill_count")
        else:
            context["managed_title"] = "Analysis Settings"
            context["managed_message"] = (
                "This managed Project contains private AI settings and user skills. "
                "Its contents are maintained automatically by OMERO.Analysis."
            )
        return context

    if sync_role == "project":
        context["panel_kind"] = "workspace-library"
        context["analysis_library_datasets"] = _panel_library_datasets(conn, obj)
        return context

    if sync_role in {"dataset", "content-item", "item"}:
        context["panel_kind"] = "workspace" if sync_role == "dataset" else "result"
        context["workspace_summary"] = _workspace_panel_summary(conn, obj, sync_values)
        context["result_kind"] = str(sync_values.get("item_kind") or "result")
        context["result_name"] = str(
            sync_values.get("canonical_name") or context["name"]
        )
        return context

    if object_type in {"Image", "Dataset", "Plate", "Screen"}:
        context["panel_kind"] = "source"
        context["analysis_library_datasets"] = _panel_library_datasets(conn, obj)
        return context

    context["panel_kind"] = "guidance"
    context["managed_title"] = (
        "Select the parent Plate" if object_type == "Well" else "Select an analysis source"
    )
    context["managed_message"] = (
        "Analysis Workspaces start from a Dataset, Screen, Plate, Image, or a "
        "selection of Images or Plates."
    )
    return context


def _launch_context(request, conn, object_type, object_id):
    object_type, object_id, obj = _panel_context_object(
        conn, object_type, object_id
    )
    context = object_context(object_type, object_id, obj, conn)
    selected_objects = _selected_source_objects(
        request, conn, object_type, object_id, obj
    )
    if len(selected_objects) > 1:
        context.update({
            "name": f"{len(selected_objects)} selected {object_type}s",
            "selected_objects": selected_objects,
            "selection_ids": [item["id"] for item in selected_objects],
            "selection_count": len(selected_objects),
        })
    _configure_panel_context(conn, obj, context)
    return context


@require_GET
@login_required(setGroupContext=True)
@api_errors
def launch_context(request, object_type, object_id, conn=None, **kwargs):
    """Expose the same launch contract used by the OMERO.web middle pane."""
    return JsonResponse(_launch_context(
        request, conn, object_type, object_id
    ))


@login_required(setGroupContext=True)
def panel(request, object_type, object_id, conn=None, **kwargs):
    context = _launch_context(request, conn, object_type, object_id)
    return render(
        request,
        "omero_analysis/panel.html",
        {
            "context": context,
            "integrated_data_analysis": integrated_data_analysis(),
        },
    )


def _workflow_skill_catalog():
    try:
        from biomero_workflow_skills import WorkflowSkillCatalog
    except ImportError:
        return None

    return WorkflowSkillCatalog(
        package_url=_workflow_skill_package_url
    )


def _workflow_skill_package_url(workflow_key, skill_name):
    return reverse(
        "omero_analysis_workflow_skill",
        kwargs={"workflow_key": workflow_key, "skill_name": skill_name},
    )


def _current_workflow_skill_urls(payload):
    """Replace transport-specific package URLs restored from the shared cache."""
    for entry in payload.get("workflows") or []:
        source = entry.get("source", {})
        for skill in entry.get("skills", []):
            workflow_key = (
                skill.get("source_key")
                or skill.get("workflow_key")
                or source.get("source_key")
                or source.get("workflow_key")
            )
            skill_name = skill.get("name")
            if workflow_key and skill_name:
                skill["package_url"] = _workflow_skill_package_url(
                    workflow_key,
                    skill_name,
                )
    # Retain an empty field temporarily for older clients, but never expose
    # [APPLICATIONS] discovery. Application-owned skills use named providers.
    payload["applications"] = []
    return payload


def _workflow_skill_error(exc):
    logger.warning("BIOMERO measurement skill catalog request failed: %s", exc)
    return JsonResponse(
        {
            "error": {
                "code": "workflow_skills_unavailable",
                "message": str(exc),
            }
        },
        status=503,
    )


@require_GET
@login_required(setGroupContext=True)
def workflow_skills(request, conn=None, **kwargs):
    try:
        catalog = _workflow_skill_catalog()
        if catalog is None:
            return JsonResponse(
                {
                    "schema": "nl.bioimaging.biomero-workflow-skills.v1",
                    "generated_at": "",
                    "consumer": WORKFLOW_SKILLS_CONSUMER,
                    "config_hash": "",
                    "workflows": [],
                    "applications": [],
                    "diagnostics": [
                        {
                            "level": "info",
                            "code": "provider-not-installed",
                            "message": "BIOMERO.WorkflowSkills is not installed",
                        }
                    ],
                    "service_status": {"available": False},
                }
            )
        payload = _current_workflow_skill_urls(
            catalog.get_catalog(WORKFLOW_SKILLS_CONSUMER).to_dict()
        )
        payload["service_status"] = catalog.status()
        return JsonResponse(payload)
    except Exception as exc:
        return _workflow_skill_error(exc)


@require_GET
@login_required(setGroupContext=True)
def zarr_viewer_integration(request, conn=None, **kwargs):
    return JsonResponse(zarr_viewer_status())


@require_GET
@login_required(setGroupContext=True)
def workflow_skill_package(
    request, workflow_key, skill_name, conn=None, **kwargs
):
    try:
        catalog = _workflow_skill_catalog()
        if catalog is None:
            raise RuntimeError("BIOMERO.WorkflowSkills is not installed")
        package = catalog.get_package(
            workflow_key,
            skill_name,
            WORKFLOW_SKILLS_CONSUMER,
        )
        return JsonResponse(package.to_dict())
    except Exception as exc:
        return _workflow_skill_error(exc)


@require_POST
@login_required(setGroupContext=True)
def refresh_workflow_skills(request, conn=None, **kwargs):
    if conn is None or not bool(conn.isAdmin()):
        return JsonResponse(
            {
                "error": {
                    "code": "permission_denied",
                    "message": "Only OMERO administrators can refresh measurement skills",
                }
            },
            status=403,
        )
    try:
        catalog = _workflow_skill_catalog()
        if catalog is None:
            raise RuntimeError("BIOMERO.WorkflowSkills is not installed")
        catalog.refresh()
        return JsonResponse(
            {
                "refreshed": True,
                "catalog": _current_workflow_skill_urls(
                    catalog.get_catalog(
                        WORKFLOW_SKILLS_CONSUMER
                    ).to_dict()
                ),
            }
        )
    except Exception as exc:
        return _workflow_skill_error(exc)


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
    operations = [
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
    if can_annotate(obj):
        operations.extend(
            [
                "upload",
                "workspace_upload",
                "pipeline_upload",
                "notebook_upload",
                "sync_plan",
                "sync_apply",
                "sync_remove",
                "settings_sync",
            ]
        )
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
    context = object_context(object_type, object_id, obj, conn)
    return JsonResponse({"attachments": context["supported_attachments"]})


@require_GET
@login_required(setGroupContext=True)
@api_errors
def hierarchy(request, object_type, object_id, conn=None, **kwargs):
    object_type, object_id, obj = get_context_object(conn, object_type, object_id)
    validate_context_token(request, conn, "hierarchy", object_type, object_id, obj)
    return JsonResponse(object_hierarchy(object_type, object_id, obj))


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
def workspace_snapshots(request, object_type, object_id, conn=None, **kwargs):
    object_type, object_id, obj = get_context_object(conn, object_type, object_id)
    if request.method == "GET":
        validate_context_token(request, conn, "list", object_type, object_id, obj)
        values = [
            value for value in list_attachment_dicts(obj) if value["kind"] == "workspace"
        ]
        return JsonResponse({"snapshots": values})
    validate_context_token(request, conn, "workspace_upload", object_type, object_id, obj)
    result = upload_workspace_snapshot_annotation(conn, obj, request.FILES.get("file"))
    return JsonResponse({"snapshot": result}, status=201)


@require_GET
@login_required(setGroupContext=True, doConnectionCleanup=False)
@api_errors
def download_workspace_snapshot(request, annotation_id, conn=None, **kwargs):
    claims = validate_context_token(request, conn, "workspace_download")
    _, _, obj = get_context_object(
        conn, claims["object_type"], claims["object_id"]
    )
    validate_context_token(
        request,
        conn,
        "workspace_download",
        claims["object_type"],
        claims["object_id"],
        obj,
    )
    annotation, info = checked_workspace_snapshot_download(obj, annotation_id)
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


@require_http_methods(["GET", "POST"])
@login_required(setGroupContext=True)
@api_errors
def pipeline_templates(request, object_type, object_id, conn=None, **kwargs):
    object_type, object_id, obj = get_context_object(conn, object_type, object_id)
    if request.method == "GET":
        validate_context_token(request, conn, "list", object_type, object_id, obj)
        values = [
            value for value in list_attachment_dicts(obj) if value["kind"] == "pipeline"
        ]
        return JsonResponse({"pipelines": values})
    validate_context_token(request, conn, "pipeline_upload", object_type, object_id, obj)
    result = upload_pipeline_annotation(conn, obj, request.FILES.get("file"))
    return JsonResponse({"pipeline": result}, status=201)


@require_GET
@login_required(setGroupContext=True, doConnectionCleanup=False)
@api_errors
def download_pipeline_template(request, annotation_id, conn=None, **kwargs):
    claims = validate_context_token(request, conn, "pipeline_download")
    _, _, obj = get_context_object(conn, claims["object_type"], claims["object_id"])
    validate_context_token(
        request,
        conn,
        "pipeline_download",
        claims["object_type"],
        claims["object_id"],
        obj,
    )
    annotation, info = checked_pipeline_download(obj, annotation_id)
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
def upload_notebook(request, object_type, object_id, conn=None, **kwargs):
    object_type, object_id, obj = get_context_object(conn, object_type, object_id)
    validate_context_token(
        request, conn, "notebook_upload", object_type, object_id, obj
    )
    notebook = upload_notebook_annotation(conn, obj, request.FILES.get("file"))
    return JsonResponse({"notebook": notebook}, status=201)


@require_GET
@login_required(setGroupContext=True, doConnectionCleanup=False)
@api_errors
def download_notebook(request, annotation_id, conn=None, **kwargs):
    claims = validate_context_token(request, conn, "notebook_download")
    _, _, obj = get_context_object(conn, claims["object_type"], claims["object_id"])
    validate_context_token(
        request,
        conn,
        "notebook_download",
        claims["object_type"],
        claims["object_id"],
        obj,
    )
    annotation, info = checked_notebook_download(obj, annotation_id)
    response = ConnCleaningHttpResponse(
        annotation.getFileInChunks(), content_type="application/x-ipynb+json"
    )
    response.conn = conn
    response["Content-Length"] = str(info.size)
    response["Content-Disposition"] = (
        "attachment; filename*=UTF-8''" + quote(info.name, safe="")
    )
    response["Cache-Control"] = "private, no-store"
    response["X-Content-Type-Options"] = "nosniff"
    return response


def _sync_context(request, conn, operation, object_type, object_id):
    object_type, object_id, obj = get_context_object(conn, object_type, object_id)
    validate_context_token(request, conn, operation, object_type, object_id, obj)
    return object_type, object_id, obj


@require_GET
@login_required(setGroupContext=True)
@api_errors
def workspace_sync_status(
    request, object_type, object_id, workspace_id, conn=None, **kwargs
):
    _, _, obj = _sync_context(
        request, conn, "context", object_type, object_id
    )
    return JsonResponse(sync_status(conn, obj, workspace_id))


@require_POST
@login_required(setGroupContext=True)
@api_errors
def workspace_sync_plan(
    request, object_type, object_id, workspace_id, conn=None, **kwargs
):
    object_type, object_id, obj = _sync_context(
        request, conn, "sync_plan", object_type, object_id
    )
    try:
        payload = json.loads(request.body or b"{}")
    except json.JSONDecodeError as exc:
        from .errors import InvalidObject

        raise InvalidObject("Request body must be valid JSON") from exc
    inventory = validate_inventory(
        payload, workspace_id, object_type, object_id, obj, conn
    )
    return JsonResponse(plan_sync(request, conn, obj, inventory))


@require_POST
@login_required(setGroupContext=True)
@api_errors
def workspace_sync_apply(
    request, object_type, object_id, workspace_id, conn=None, **kwargs
):
    object_type, object_id, obj = _sync_context(
        request, conn, "sync_apply", object_type, object_id
    )
    try:
        inventory_payload = json.loads(request.POST.get("inventory") or "{}")
        payload_keys = json.loads(request.POST.get("payload_keys") or "[]")
    except json.JSONDecodeError as exc:
        from .errors import InvalidObject

        raise InvalidObject("Synchronization multipart metadata must be valid JSON") from exc
    if not isinstance(payload_keys, list) or not all(
        isinstance(key, str) for key in payload_keys
    ):
        from .errors import InvalidObject

        raise InvalidObject("Synchronization payload keys are invalid")
    inventory = validate_inventory(
        inventory_payload, workspace_id, object_type, object_id, obj, conn
    )
    result = apply_sync(
        request,
        conn,
        obj,
        inventory,
        request.POST.get("plan_token") or "",
        payload_keys,
        request.FILES.getlist("payloads"),
    )
    return JsonResponse(result)


@require_http_methods(["DELETE"])
@login_required(setGroupContext=True)
@api_errors
def workspace_sync_remove(
    request, object_type, object_id, workspace_id, conn=None, **kwargs
):
    _, _, obj = _sync_context(
        request, conn, "sync_remove", object_type, object_id
    )
    return JsonResponse(remove_sync(conn, obj, workspace_id))


@require_GET
@login_required(setGroupContext=True)
@api_errors
def workspace_library(request, object_type, object_id, conn=None, **kwargs):
    _, _, obj = _sync_context(
        request, conn, "library_list", object_type, object_id
    )
    return JsonResponse({"datasets": library_datasets(conn, obj)})


@require_GET
@login_required(setGroupContext=True)
@api_errors
def workspace_dataset(request, dataset_id, conn=None, **kwargs):
    return JsonResponse(resolve_workspace_dataset(conn, dataset_id))


@require_GET
@login_required(setGroupContext=True, doConnectionCleanup=False)
@api_errors
def workspace_library_download(request, annotation_id, conn=None, **kwargs):
    claims = validate_context_token(request, conn, "library_download")
    _, _, obj = get_context_object(
        conn, claims["object_type"], claims["object_id"]
    )
    validate_context_token(
        request,
        conn,
        "library_download",
        claims["object_type"],
        claims["object_id"],
        obj,
    )
    annotation, item = library_annotation(conn, obj, annotation_id)
    response = ConnCleaningHttpResponse(
        annotation.getFileInChunks(), content_type=item["mimetype"]
    )
    response.conn = conn
    response["Content-Length"] = str(item["size"])
    response["Content-Disposition"] = (
        "attachment; filename*=UTF-8''" + quote(item["name"], safe="")
    )
    response["Cache-Control"] = "private, no-store"
    response["X-Content-Type-Options"] = "nosniff"
    return response


@require_http_methods(["GET", "POST"])
@login_required(setGroupContext=True)
@api_errors
def analysis_settings(request, object_type, object_id, conn=None, **kwargs):
    operation = "settings_read" if request.method == "GET" else "settings_sync"
    _, _, obj = _sync_context(
        request, conn, operation, object_type, object_id
    )
    from .services import object_group_id

    group_id = object_group_id(obj)
    if request.method == "GET":
        return JsonResponse(load_settings(conn, group_id))
    try:
        payload = json.loads(request.body or b"{}")
    except json.JSONDecodeError as exc:
        from .errors import InvalidObject

        raise InvalidObject("Settings request body must be valid JSON") from exc
    return JsonResponse(save_settings(conn, group_id, payload), status=201)
