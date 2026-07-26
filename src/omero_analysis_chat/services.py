import mimetypes
import re
import tempfile
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
from .settings import allowed_result_extensions, max_download_bytes, max_upload_bytes

SUPPORTED_OBJECT_TYPES = ("Image", "Dataset", "Plate", "Screen")
RESULT_NAMESPACE = "nl.bioimaging.analysis-chat.result"
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


def attachment_info(annotation):
    original = annotation.getFile()
    name = safe_filename(_plain(original.getName()))
    namespace = _plain(annotation.getNs()) if hasattr(annotation, "getNs") else None
    extension = Path(name).suffix.lower()
    return AttachmentInfo(
        annotation_id=int(annotation.getId()),
        file_id=int(original.getId()),
        name=name,
        mimetype=str(_plain(original.getMimetype()) or "application/octet-stream"),
        size=int(_plain(original.getSize()) or 0),
        namespace=namespace,
        kind="result" if namespace == RESULT_NAMESPACE else "attachment",
        supported=extension in INPUT_EXTENSIONS,
    )


def direct_file_annotations(obj):
    values = []
    for annotation in obj.listAnnotations():
        if _is_file_annotation(annotation):
            values.append((annotation, attachment_info(annotation)))
    values.sort(key=lambda pair: (pair[1].name.lower(), pair[1].annotation_id))
    return values


def list_attachment_dicts(obj):
    return [info.to_dict() for _, info in direct_file_annotations(obj)]


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
    return {
        "object_type": object_type,
        "object_id": int(object_id),
        "name": str(_plain(obj.getName())),
        "user_id": user_id,
        "group_id": object_group_id(obj),
        "can_annotate": can_annotate(obj),
        "attachments": list_attachment_dicts(obj),
    }


def checked_download(obj, annotation_id):
    annotation, info = get_direct_attachment(obj, annotation_id)
    if not info.supported:
        raise UnsupportedMedia(f"{info.name} is not a supported analysis input")
    if info.size > max_download_bytes():
        raise FileTooLarge(
            f"Attachment is {info.size} bytes; the limit is {max_download_bytes()}"
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


def upload_result_annotation(conn, obj, uploaded_file):
    if not can_annotate(obj):
        raise PermissionDenied("The active user cannot annotate the selected object")
    filename, mimetype = validate_result(uploaded_file)
    annotation = None
    with tempfile.TemporaryDirectory(prefix="omero-analysis-chat-") as temp_dir:
        local_path = Path(temp_dir) / filename
        with local_path.open("wb") as handle:
            for chunk in uploaded_file.chunks():
                handle.write(chunk)
        try:
            annotation = conn.createFileAnnfromLocalFile(
                str(local_path),
                mimetype=mimetype,
                ns=RESULT_NAMESPACE,
                desc="Created in OMERO Analysis Chat",
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
