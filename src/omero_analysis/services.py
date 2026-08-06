import mimetypes
import json
import re
import tempfile
import zipfile
from dataclasses import asdict, dataclass
from pathlib import Path

from .errors import (
    AttachmentNotFound,
    FileTooLarge,
    InvalidObject,
    ObjectNotFound,
    PermissionDenied,
    UnsupportedMedia,
)
from .settings import (
    allowed_result_extensions,
    max_download_bytes,
    max_notebook_bytes,
    max_notebook_cells,
    max_upload_bytes,
)

SUPPORTED_OBJECT_TYPES = ("Image", "Dataset", "Plate", "Screen")
RESULT_NAMESPACE = "nl.bioimaging.analysis.result.v1"
WORKSPACE_NAMESPACE = "nl.bioimaging.analysis.workspace.v1"
LEGACY_RESULT_NAMESPACES = {"nl.bioimaging.analysis-chat.result"}
PIPELINE_NAMESPACE = "nl.bioimaging.analysis.pipeline.v1"
NOTEBOOK_NAMESPACE = "nl.bioimaging.analysis.notebook.v1"
LEGACY_NOTEBOOK_NAMESPACES = {
    "nl.bioimaging.jupyter.notebook",
    "nl.bioimaging.omero-jupyterlite.notebook.v1",
}
INPUT_EXTENSIONS = {
    ".csv",
    ".tsv",
    ".json",
    ".xlsx",
    ".xls",
    ".parquet",
    ".npy",
    ".npz",
    ".duckdb",
    ".sqlite",
    ".sqlite3",
}
RESULT_MIMETYPES = {
    ".csv": {"text/csv", "application/csv", "text/plain"},
    ".tsv": {"text/tab-separated-values", "text/plain"},
    ".json": {"application/json", "text/json", "text/plain"},
    ".xlsx": {"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
    ".xls": {"application/vnd.ms-excel", "application/octet-stream"},
    ".parquet": {"application/vnd.apache.parquet", "application/octet-stream"},
    ".npy": {"application/octet-stream", "application/x-npy"},
    ".npz": {"application/octet-stream", "application/x-npz"},
    ".duckdb": {"application/octet-stream", "application/vnd.duckdb"},
    ".sqlite": {"application/octet-stream", "application/vnd.sqlite3"},
    ".sqlite3": {"application/octet-stream", "application/vnd.sqlite3"},
    ".png": {"image/png"},
    ".svg": {"image/svg+xml"},
    ".pdf": {"application/pdf"},
    ".txt": {"text/plain"},
    ".md": {"text/markdown", "text/plain"},
}


def _plain(value):
    if value is None:
        return None
    if hasattr(value, "val"):
        value = value.val
    if hasattr(value, "isoformat"):
        return value.isoformat()
    return value


def canonical_object_type(value):
    canonical = str(value or "").strip().capitalize()
    if canonical not in SUPPORTED_OBJECT_TYPES:
        raise InvalidObject("Object type must be Image, Dataset, Plate, or Screen")
    return canonical


def canonical_object_id(value):
    try:
        object_id = int(value)
    except (TypeError, ValueError) as exc:
        raise InvalidObject("Object ID must be a positive integer") from exc
    if object_id <= 0:
        raise InvalidObject("Object ID must be a positive integer")
    return object_id


def get_context_object(conn, object_type, object_id):
    object_type = canonical_object_type(object_type)
    object_id = canonical_object_id(object_id)
    obj = conn.getObject(object_type, object_id)
    if obj is None:
        raise ObjectNotFound("The selected object does not exist or is not readable")
    return object_type, object_id, obj


def object_group_id(obj):
    try:
        return int(obj.getDetails().getGroup().getId())
    except AttributeError:
        return int(obj.getDetails().group.id.val)


def can_annotate(obj):
    return bool(_plain(obj.canAnnotate()))


def _is_file_annotation(annotation):
    file_protocol = all(
        hasattr(annotation, attribute)
        for attribute in ("getId", "getFile", "getFileInChunks")
    )
    if not file_protocol:
        return False
    try:
        from omero.gateway import FileAnnotationWrapper

        return isinstance(annotation, FileAnnotationWrapper) or file_protocol
    except ImportError:
        return file_protocol


@dataclass(frozen=True)
class AttachmentInfo:
    annotation_id: int
    file_id: int
    name: str
    mimetype: str
    size: int
    namespace: str | None
    kind: str
    supported: bool
    object_type: str | None = None
    object_id: int | None = None
    object_name: str | None = None
    direct: bool = True

    def to_dict(self):
        return asdict(self)


def safe_filename(name):
    name = Path(str(name or "").replace("\\", "/")).name
    name = re.sub(r"[\x00-\x1f\x7f]", "", name).strip()
    if not name or name in {".", ".."}:
        raise UnsupportedMedia("A valid filename is required")
    if len(name) > 255:
        raise UnsupportedMedia("Filename is longer than 255 characters")
    return name


def attachment_info(annotation, obj=None, direct=True):
    original = annotation.getFile()
    name = safe_filename(_plain(original.getName()))
    namespace = _plain(annotation.getNs()) if hasattr(annotation, "getNs") else None
    extension = Path(name).suffix.lower()
    kind = (
        "workspace"
        if namespace == WORKSPACE_NAMESPACE
        else "pipeline"
        if namespace == PIPELINE_NAMESPACE
        else "notebook"
        if (
            namespace == NOTEBOOK_NAMESPACE
            or namespace in LEGACY_NOTEBOOK_NAMESPACES
            or extension == ".ipynb"
        )
        else "result"
        if namespace == RESULT_NAMESPACE or namespace in LEGACY_RESULT_NAMESPACES
        else "attachment"
    )
    return AttachmentInfo(
        annotation_id=int(annotation.getId()),
        file_id=int(original.getId()),
        name=name,
        mimetype=str(_plain(original.getMimetype()) or "application/octet-stream"),
        size=int(_plain(original.getSize()) or 0),
        namespace=namespace,
        kind=kind,
        # Analysis result tables and databases are valid inputs for a later
        # analysis. Preserve their provenance kind without hiding them from
        # the input picker.
        supported=kind in {"attachment", "result"} and extension in INPUT_EXTENSIONS,
        object_type=_object_type(obj) if obj is not None else None,
        object_id=(
            int(obj.getId())
            if obj is not None and callable(getattr(obj, "getId", None))
            else int(getattr(obj, "object_id"))
            if obj is not None and getattr(obj, "object_id", None) is not None
            else None
        ),
        object_name=(
            str(_plain(obj.getName()))
            if obj is not None and callable(getattr(obj, "getName", None))
            else None
        ),
        direct=direct,
    )


def direct_file_annotations(obj):
    values = []
    for annotation in obj.listAnnotations():
        if _is_file_annotation(annotation):
            values.append((annotation, attachment_info(annotation, obj=obj)))
    values.sort(key=lambda pair: (pair[1].name.lower(), pair[1].annotation_id))
    return values


def list_attachment_dicts(obj):
    return [info.to_dict() for _, info in direct_file_annotations(obj)]


def attachment_scope_objects(obj):
    """Yield the selected object and immediate readable data children.

    Dataset children are Images and Screen children are Plates. This mirrors
    the OMERO.web hierarchy without recursively walking every WellSample in a
    high-content Plate.
    """
    yield obj, True
    if _object_type(obj) not in {"Dataset", "Screen"}:
        return
    children = getattr(obj, "listChildren", None)
    if not callable(children):
        return
    try:
        for child in children():
            if _object_type(child) in SUPPORTED_OBJECT_TYPES:
                yield child, False
    except (AttributeError, TypeError, NotImplementedError):
        return


def scoped_file_annotations(obj):
    values = []
    seen = set()
    for target, direct in attachment_scope_objects(obj):
        for annotation, _ in direct_file_annotations(target):
            info = attachment_info(annotation, obj=target, direct=direct)
            if info.annotation_id in seen:
                continue
            seen.add(info.annotation_id)
            values.append((annotation, info))
    values.sort(key=lambda pair: (
        not pair[1].direct,
        (pair[1].object_name or "").lower(),
        pair[1].name.lower(),
        pair[1].annotation_id,
    ))
    return values


def get_scoped_attachment(obj, annotation_id):
    annotation_id = canonical_object_id(annotation_id)
    for annotation, info in scoped_file_annotations(obj):
        if info.annotation_id == annotation_id:
            return annotation, info
    raise AttachmentNotFound(
        "The FileAnnotation is not linked to the selected object or an immediate child"
    )


def get_direct_attachment(obj, annotation_id):
    annotation_id = canonical_object_id(annotation_id)
    for annotation, info in direct_file_annotations(obj):
        if info.annotation_id == annotation_id:
            return annotation, info
    raise AttachmentNotFound(
        "The FileAnnotation is not linked directly to the selected object"
    )


def object_context(object_type, object_id, obj, conn=None):
    try:
        user_id = int(conn.getUserId()) if conn is not None else 0
    except (AttributeError, TypeError, ValueError):
        user_id = 0
    attachments = list_attachment_dicts(obj)
    scoped_attachments = [
        info.to_dict() for _, info in scoped_file_annotations(obj)
    ]
    return {
        "object_type": object_type,
        "object_id": int(object_id),
        "name": str(_plain(obj.getName())),
        "user_id": user_id,
        "group_id": object_group_id(obj),
        "can_annotate": can_annotate(obj),
        "max_snapshot_bytes": max_upload_bytes(),
        "attachments": attachments,
        "workspace_snapshots": [
            attachment for attachment in attachments if attachment["kind"] == "workspace"
        ],
        "pipeline_templates": [
            attachment for attachment in attachments if attachment["kind"] == "pipeline"
        ],
        "notebooks": [
            attachment for attachment in attachments if attachment["kind"] == "notebook"
        ],
        "supported_attachments": [
            attachment for attachment in scoped_attachments if attachment["supported"]
        ],
    }


def _object_type(value):
    for attribute in ("OMERO_CLASS", "_obj_type"):
        candidate = getattr(value, attribute, None)
        if candidate:
            return str(candidate).split(".")[-1].replace("Wrapper", "")
    name = value.__class__.__name__.replace("Wrapper", "")
    return name.removeprefix("BlitzGateway")


def _hierarchy_item(value):
    value_type = _object_type(value)
    try:
        name = str(_plain(value.getName()))
    except AttributeError:
        name = value_type
    return {
        "type": value_type,
        "id": int(value.getId()),
        "name": name,
        "supported": value_type in SUPPORTED_OBJECT_TYPES,
    }


def object_hierarchy(object_type, object_id, obj):
    """Return readable immediate relations without using webclient internals."""
    parents = []
    children = []
    seen = set()

    def add(target, collection):
        if target is None:
            return
        item = _hierarchy_item(target)
        key = (item["type"], item["id"])
        if key not in seen:
            seen.add(key)
            collection.append(item)

    for method_name in ("listParents",):
        method = getattr(obj, method_name, None)
        if callable(method):
            try:
                for value in method():
                    add(value, parents)
            except (AttributeError, TypeError):
                pass
    parent = getattr(obj, "getParent", None)
    if callable(parent):
        try:
            add(parent(), parents)
        except (AttributeError, TypeError):
            pass
    children_method = getattr(obj, "listChildren", None)
    if callable(children_method):
        try:
            for value in children_method():
                add(value, children)
        except (AttributeError, TypeError):
            pass
    return {
        "current": {
            "type": object_type,
            "id": int(object_id),
            "name": str(_plain(obj.getName())),
            "supported": True,
        },
        "parents": parents,
        "children": children,
    }


def checked_download(obj, annotation_id):
    annotation, info = get_scoped_attachment(obj, annotation_id)
    if not info.supported:
        raise UnsupportedMedia(f"{info.name} is not a supported analysis input")
    if info.size > max_download_bytes():
        raise FileTooLarge(
            f"Attachment is {info.size} bytes; the limit is {max_download_bytes()}"
        )
    return annotation, info


def checked_workspace_snapshot_download(obj, annotation_id):
    annotation, info = get_direct_attachment(obj, annotation_id)
    if info.kind != "workspace":
        raise UnsupportedMedia(f"{info.name} is not an Analysis workspace snapshot")
    if info.size > max_download_bytes():
        raise FileTooLarge(
            f"Snapshot is {info.size} bytes; the limit is {max_download_bytes()}"
        )
    return annotation, info


def checked_pipeline_download(obj, annotation_id):
    annotation, info = get_direct_attachment(obj, annotation_id)
    if info.kind != "pipeline":
        raise UnsupportedMedia(f"{info.name} is not an Analysis pipeline template")
    if info.size > max_download_bytes():
        raise FileTooLarge(
            f"Pipeline is {info.size} bytes; the limit is {max_download_bytes()}"
        )
    return annotation, info


def checked_notebook_download(obj, annotation_id):
    annotation, info = get_direct_attachment(obj, annotation_id)
    if info.kind != "notebook":
        raise UnsupportedMedia(f"{info.name} is not an Analysis notebook")
    if info.size > max_notebook_bytes():
        raise FileTooLarge(
            f"Notebook is {info.size} bytes; the limit is {max_notebook_bytes()}"
        )
    return annotation, info


def validate_result(uploaded_file):
    if uploaded_file is None:
        raise UnsupportedMedia("Multipart field 'file' is required")
    if int(uploaded_file.size) > max_upload_bytes():
        raise FileTooLarge(
            f"Result is {uploaded_file.size} bytes; the limit is {max_upload_bytes()}"
        )
    filename = safe_filename(uploaded_file.name)
    extension = Path(filename).suffix.lower()
    if extension not in allowed_result_extensions():
        raise UnsupportedMedia(f"Result extension {extension or '(none)'} is not enabled")
    allowed = RESULT_MIMETYPES.get(extension)
    if not allowed:
        raise UnsupportedMedia(f"Result extension {extension or '(none)'} is not allowed")
    supplied = (uploaded_file.content_type or "").lower().split(";", 1)[0].strip()
    if supplied and supplied not in allowed:
        raise UnsupportedMedia(f"MIME type {supplied} is not allowed for {extension}")
    canonical = next(iter(sorted(allowed - {"application/octet-stream"})), None)
    return filename, supplied or canonical or mimetypes.guess_type(filename)[0] or "application/octet-stream"


def validate_workspace_snapshot(uploaded_file):
    if uploaded_file is None:
        raise UnsupportedMedia("Multipart field 'file' is required")
    if int(uploaded_file.size) > max_upload_bytes():
        raise FileTooLarge(
            f"Workspace snapshot is {uploaded_file.size} bytes; the limit is {max_upload_bytes()}"
        )
    filename = safe_filename(uploaded_file.name)
    if not filename.lower().endswith(".oa-workspace.zip"):
        raise UnsupportedMedia("Workspace snapshots must use the .oa-workspace.zip extension")
    supplied = (uploaded_file.content_type or "").lower().split(";", 1)[0].strip()
    if supplied and supplied not in {
        "application/zip",
        "application/octet-stream",
        "application/x-zip-compressed",
    }:
        raise UnsupportedMedia(f"MIME type {supplied} is not allowed for a workspace snapshot")
    position = uploaded_file.tell() if hasattr(uploaded_file, "tell") else 0
    signature = uploaded_file.read(4)
    if hasattr(uploaded_file, "seek"):
        uploaded_file.seek(position)
    if signature not in {b"PK\x03\x04", b"PK\x05\x06"}:
        raise UnsupportedMedia("Workspace snapshot is not a valid ZIP stream")
    try:
        with zipfile.ZipFile(uploaded_file) as archive:
            names = archive.namelist()
            if "workspace.json" not in names:
                raise UnsupportedMedia("Workspace snapshot must contain workspace.json")
            if len(names) > 50000:
                raise UnsupportedMedia("Workspace snapshot contains too many entries")
            manifest = json.loads(archive.read("workspace.json"))
    except UnsupportedMedia:
        raise
    except (zipfile.BadZipFile, KeyError, ValueError, UnicodeDecodeError) as exc:
        raise UnsupportedMedia("Workspace snapshot is not a valid Analysis archive") from exc
    finally:
        if hasattr(uploaded_file, "seek"):
            uploaded_file.seek(position)
    if not isinstance(manifest, dict) or manifest.get("format") != WORKSPACE_NAMESPACE:
        raise UnsupportedMedia("Unsupported workspace snapshot format")
    return filename, "application/zip"


def validate_pipeline_template(uploaded_file):
    if uploaded_file is None:
        raise UnsupportedMedia("Multipart field 'file' is required")
    if int(uploaded_file.size) > min(max_upload_bytes(), 4 * 1024 * 1024):
        raise FileTooLarge("Pipeline templates are limited to 4 MiB")
    filename = safe_filename(uploaded_file.name)
    if not filename.lower().endswith(".oa-pipeline.json"):
        raise UnsupportedMedia("Pipeline templates must use .oa-pipeline.json")
    position = uploaded_file.tell() if hasattr(uploaded_file, "tell") else 0
    try:
        payload = json.load(uploaded_file)
    except (ValueError, UnicodeDecodeError) as exc:
        raise UnsupportedMedia("Pipeline template must contain valid JSON") from exc
    finally:
        if hasattr(uploaded_file, "seek"):
            uploaded_file.seek(position)
    if payload.get("format") != PIPELINE_NAMESPACE:
        raise UnsupportedMedia("Unsupported pipeline template format")
    return filename, "application/json"


def validate_notebook(uploaded_file):
    if uploaded_file is None:
        raise UnsupportedMedia("Multipart field 'file' is required")
    if int(uploaded_file.size) > max_notebook_bytes():
        raise FileTooLarge(
            f"Notebook is {uploaded_file.size} bytes; the limit is {max_notebook_bytes()}"
        )
    filename = safe_filename(uploaded_file.name)
    if not filename.lower().endswith(".ipynb"):
        raise UnsupportedMedia("Notebooks must use the .ipynb extension")
    position = uploaded_file.tell() if hasattr(uploaded_file, "tell") else 0
    try:
        payload = json.load(uploaded_file)
    except (ValueError, UnicodeDecodeError) as exc:
        raise UnsupportedMedia("Notebook must contain valid JSON") from exc
    finally:
        if hasattr(uploaded_file, "seek"):
            uploaded_file.seek(position)
    if not isinstance(payload, dict) or payload.get("nbformat") != 4:
        raise UnsupportedMedia("Only nbformat 4 notebooks are supported")
    cells = payload.get("cells")
    if not isinstance(cells, list) or len(cells) > max_notebook_cells():
        raise UnsupportedMedia(
            f"Notebook must contain at most {max_notebook_cells()} cells"
        )
    for cell in cells:
        if not isinstance(cell, dict) or cell.get("cell_type") not in {
            "code",
            "markdown",
            "raw",
        }:
            raise UnsupportedMedia("Notebook contains an invalid cell")
        source = cell.get("source", "")
        if not isinstance(source, (str, list)) or (
            isinstance(source, list)
            and not all(isinstance(line, str) for line in source)
        ):
            raise UnsupportedMedia("Notebook cell source must be text")
    metadata = payload.get("metadata") or {}
    language = str((metadata.get("language_info") or {}).get("name") or "python").lower()
    kernel = str((metadata.get("kernelspec") or {}).get("language") or "python").lower()
    if language not in {"python", "python3"} or kernel not in {"python", "python3"}:
        raise UnsupportedMedia("Only Python notebooks are supported")
    return filename, "application/x-ipynb+json"


def _upload_annotation(conn, obj, uploaded_file, validator, namespace, description):
    if not can_annotate(obj):
        raise PermissionDenied("The active user cannot annotate the selected object")
    filename, mimetype = validator(uploaded_file)
    annotation = None
    with tempfile.TemporaryDirectory(prefix="omero-analysis-") as temp_dir:
        local_path = Path(temp_dir) / filename
        with local_path.open("wb") as handle:
            for chunk in uploaded_file.chunks():
                handle.write(chunk)
        try:
            annotation = conn.createFileAnnfromLocalFile(
                str(local_path),
                mimetype=mimetype,
                ns=namespace,
                desc=description,
            )
            obj.linkAnnotation(annotation)
        except Exception:
            if annotation is not None:
                try:
                    conn.deleteObjects("Annotation", [annotation.getId()], wait=True)
                except Exception:
                    pass
            raise
    return attachment_info(annotation).to_dict()


def upload_result_annotation(conn, obj, uploaded_file):
    return _upload_annotation(
        conn,
        obj,
        uploaded_file,
        validate_result,
        RESULT_NAMESPACE,
        "Created in OMERO Analysis",
    )


def upload_workspace_snapshot_annotation(conn, obj, uploaded_file):
    return _upload_annotation(
        conn,
        obj,
        uploaded_file,
        validate_workspace_snapshot,
        WORKSPACE_NAMESPACE,
        "Portable OMERO Analysis workspace snapshot",
    )


def upload_pipeline_annotation(conn, obj, uploaded_file):
    return _upload_annotation(
        conn,
        obj,
        uploaded_file,
        validate_pipeline_template,
        PIPELINE_NAMESPACE,
        "Reusable OMERO Analysis pipeline template",
    )


def upload_notebook_annotation(conn, obj, uploaded_file):
    return _upload_annotation(
        conn,
        obj,
        uploaded_file,
        validate_notebook,
        NOTEBOOK_NAMESPACE,
        "OMERO Analysis notebook",
    )
