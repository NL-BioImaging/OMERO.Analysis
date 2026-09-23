"""Durable, source-scoped uploads adopted by managed Analysis workspaces.

Browser uploads are written to the user's group-mapped ``.analysis`` store
before an OMERO FileAnnotation is created.  A staging record is single-use and
is adopted idempotently into one managed workspace Dataset.  The durable blob
is retained because an in-place OriginalFile may point at it.
"""

from __future__ import annotations

import hashlib
import uuid
from datetime import datetime, timezone
from pathlib import Path

from .errors import AnalysisError, AttachmentNotFound, InvalidObject, PermissionDenied
from .inplace_annotations import create_file_annotation
from .inplace_storage import storage_for
from .managed_omero import annotations as object_annotations, plain, user_id
from .services import (
    attachment_info,
    can_annotate,
    object_group_id,
    validate_result,
)
from .settings import max_upload_bytes
from .sync_lock import storage_lock
from .workspace_access import require_workspace_access


STAGED_INPUT_NAMESPACE = "nl.bioimaging.analysis.input.v1"
STAGING_SCHEMA = "nl.bioimaging.analysis.staged-attachment.v1"
STAGING_DIR = Path("staged-attachments")


def _unavailable(detail):
    error = AnalysisError(
        "Durable attachment staging is unavailable: " + str(detail)
    )
    error.code = "attachment_staging_unavailable"
    error.status = 503
    return error


def _source_type(obj):
    value = getattr(obj, "OMERO_CLASS", None)
    if value:
        return str(value).split(".")[-1]
    return obj.__class__.__name__.replace("Wrapper", "").removeprefix("BlitzGateway")


def _record_path(staging_id):
    try:
        value = str(uuid.UUID(str(staging_id)))
    except (TypeError, ValueError, AttributeError) as exc:
        raise InvalidObject("Staged attachment ID is invalid") from exc
    return STAGING_DIR / f"{value}.json"


def _storage(conn, obj, *, initialize=True):
    capability, storage = storage_for(
        object_group_id(obj), user_id(conn), initialize=initialize
    )
    if storage is None:
        raise _unavailable(capability.detail)
    return capability, storage


def _public(record):
    return {
        "staging_id": record["stagingId"],
        "name": record["name"],
        "mimetype": record["mimetype"],
        "size": record["size"],
        "sha256": record["sha256"],
        "created_at": record["createdAt"],
        "state": record["state"],
        "workspace_id": record.get("workspaceId"),
        "annotation_id": record.get("annotationId"),
        "storage_mode": record.get("storageMode"),
    }


def _authorized_record(conn, obj, staging_id, storage=None):
    storage = storage or _storage(conn, obj, initialize=False)[1]
    path = _record_path(staging_id)
    record = storage.read_json(path)
    if not isinstance(record, dict) or record.get("schema") != STAGING_SCHEMA:
        raise AttachmentNotFound("The staged attachment is unavailable")
    expected = {
        "userId": user_id(conn),
        "groupId": object_group_id(obj),
        "sourceObjectType": _source_type(obj),
        "sourceObjectId": int(obj.getId()),
    }
    if any(record.get(key) != value for key, value in expected.items()):
        raise PermissionDenied("The staged attachment belongs to another context")
    return path, record


def stage_attachment(conn, obj, uploaded_file):
    """Persist a supported upload without creating or linking an OMERO object."""
    require_workspace_access(conn, obj)
    filename, mimetype = validate_result(uploaded_file)
    _, storage = _storage(conn, obj)
    total = 0

    def bounded_chunks():
        nonlocal total
        for chunk in uploaded_file.chunks():
            total += len(chunk)
            if total > max_upload_bytes():
                from .errors import FileTooLarge

                raise FileTooLarge("Attachment exceeds the configured upload limit")
            yield chunk

    stored = storage.store_blob_chunks(bounded_chunks(), filename)
    if stored["size"] != total:
        # Defensive invariant: a storage implementation must account for every byte.
        from .errors import FileTooLarge

        raise FileTooLarge("Attachment storage size verification failed")
    staging_id = str(uuid.uuid4())
    record = {
        "schema": STAGING_SCHEMA,
        "stagingId": staging_id,
        "state": "staged",
        "userId": user_id(conn),
        "groupId": object_group_id(obj),
        "sourceObjectType": _source_type(obj),
        "sourceObjectId": int(obj.getId()),
        "name": filename,
        "mimetype": mimetype,
        "size": total,
        "sha256": stored["sha256"],
        "blob": stored,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    storage.write_json(_record_path(staging_id), record)
    return _public(record)


def list_staged_attachments(conn, obj):
    """List pending uploads for this exact user, group and source object."""
    try:
        _, storage = _storage(conn, obj, initialize=False)
    except AnalysisError:
        return []
    root = storage.user_root / STAGING_DIR
    if not root.is_dir() or root.is_symlink():
        return []
    values = []
    for path in sorted(root.glob("*.json")):
        try:
            _, record = _authorized_record(conn, obj, path.stem, storage)
        except AnalysisError:
            continue
        if record.get("state") == "staged":
            values.append(_public(record))
    return values


def assign_staged_attachments(conn, obj, workspace_id, staging_ids):
    """Bind selected pending uploads to the launch's existing workspace ID."""
    from .workspace_sync import _workspace_id

    workspace_id = _workspace_id(workspace_id)
    if not isinstance(staging_ids, list) or not staging_ids or not all(
        isinstance(value, str) for value in staging_ids
    ):
        raise InvalidObject("Select at least one staged attachment")
    _, storage = _storage(conn, obj, initialize=False)
    assigned = []
    with storage_lock(storage):
        for staging_id in dict.fromkeys(staging_ids):
            path, record = _authorized_record(conn, obj, staging_id, storage)
            intended_workspace = record.get("intendedWorkspaceId")
            if intended_workspace and intended_workspace != workspace_id:
                raise PermissionDenied(
                    "The staged attachment was already assigned to another workspace"
                )
            if record.get("state") != "staged":
                if record.get("workspaceId") != workspace_id:
                    raise PermissionDenied(
                        "The staged attachment was already assigned to another workspace"
                    )
            else:
                record["intendedWorkspaceId"] = workspace_id
                record["assignedAt"] = datetime.now(timezone.utc).isoformat()
                storage.write_json(path, record)
            assigned.append(staging_id)
    return assigned


def assigned_staging_ids(conn, obj, workspace_id):
    """Recover a BIOMERO-embedded launch without new host-side parameters."""
    from .workspace_sync import _workspace_id

    workspace_id = _workspace_id(workspace_id)
    try:
        _, storage = _storage(conn, obj, initialize=False)
    except AnalysisError:
        return []
    root = storage.user_root / STAGING_DIR
    if not root.is_dir() or root.is_symlink():
        return []
    values = []
    for path in sorted(root.glob("*.json")):
        try:
            _, record = _authorized_record(conn, obj, path.stem, storage)
        except AnalysisError:
            continue
        if (
            record.get("state") == "staged"
            and record.get("intendedWorkspaceId") == workspace_id
        ):
            values.append(record["stagingId"])
    return values


def delete_workspace_staging_records(storage, workspace_id):
    """Forget staging metadata after the managed Dataset was fully purged."""
    root = storage.user_root / STAGING_DIR
    if not root.is_dir() or root.is_symlink():
        return 0
    deleted = 0
    for path in root.glob("*.json"):
        try:
            record = storage.read_json(path.relative_to(storage.user_root))
        except (OSError, ValueError):
            continue
        if not isinstance(record, dict) or record.get("schema") != STAGING_SCHEMA:
            continue
        if workspace_id not in {
            record.get("workspaceId"), record.get("intendedWorkspaceId")
        }:
            continue
        storage.delete_json(path.relative_to(storage.user_root))
        deleted += 1
    return deleted


def _description(staging_id):
    return f"OMERO Analysis staged input {staging_id}"


def _existing(dataset, staging_id):
    description = _description(staging_id)
    for annotation in object_annotations(dataset):
        if not hasattr(annotation, "getFile"):
            continue
        namespace = str(plain(getattr(annotation, "getNs", lambda: None)()) or "")
        marker = str(plain(getattr(annotation, "getDescription", lambda: None)()) or "")
        if namespace == STAGED_INPUT_NAMESPACE and marker == description:
            return annotation
    return None


def _linked_annotation(dataset, annotation_id):
    if not annotation_id:
        return None
    for annotation in object_annotations(dataset):
        if not hasattr(annotation, "getFile"):
            continue
        if int(annotation.getId()) != int(annotation_id):
            continue
        namespace = str(plain(getattr(annotation, "getNs", lambda: None)()) or "")
        if namespace == STAGED_INPUT_NAMESPACE:
            return annotation
    return None


def adopt_staged_attachment(conn, source, workspace_id, staging_id, workspace_name=None):
    """Create/link one workspace FileAnnotation, recovering interrupted retries."""
    from .workspace_sync import _workspace_id

    workspace_id = _workspace_id(workspace_id)
    _, storage = _storage(conn, source, initialize=False)
    with storage_lock(storage):
        return _adopt_staged_attachment_locked(
            conn, source, workspace_id, staging_id, workspace_name, storage
        )


def _adopt_staged_attachment_locked(
    conn, source, workspace_id, staging_id, workspace_name, storage
):
    record_path, record = _authorized_record(conn, source, staging_id, storage)
    adopted_workspace = record.get("workspaceId")
    if adopted_workspace and adopted_workspace != workspace_id:
        raise PermissionDenied("The staged attachment was already assigned to another workspace")
    intended_workspace = record.get("intendedWorkspaceId")
    if intended_workspace and intended_workspace != workspace_id:
        raise PermissionDenied("The staged attachment was assigned to another workspace")

    from .workspace_sync import ensure_workspace_destination

    dataset = ensure_workspace_destination(
        conn, source, workspace_id, workspace_name=workspace_name
    )
    if not can_annotate(dataset):
        raise PermissionDenied("The active user cannot annotate the workspace")

    annotation = _linked_annotation(dataset, record.get("annotationId"))
    if annotation is None:
        annotation = _existing(dataset, staging_id)
    storage_mode = record.get("storageMode")
    if annotation is None:
        blob = record.get("blob") or {}
        relative = blob.get("relativePath")
        if not isinstance(relative, str):
            raise InvalidObject("The staged attachment has no durable blob")
        path = storage._ensure_inside(storage.analysis_root / relative)
        if not path.is_file() or path.is_symlink():
            raise InvalidObject("The staged attachment blob is unavailable")
        verifier = hashlib.sha256()
        with path.open("rb") as stream:
            for chunk in iter(lambda: stream.read(1024 * 1024), b""):
                verifier.update(chunk)
        digest = verifier.hexdigest()
        if digest != record.get("sha256") or path.stat().st_size != record.get("size"):
            raise InvalidObject("The staged attachment blob failed verification")
        annotation, storage_mode, _ = create_file_annotation(
            conn,
            path,
            mimetype=record["mimetype"],
            namespace=STAGED_INPUT_NAMESPACE,
            description=_description(staging_id),
        )
        try:
            dataset.linkAnnotation(annotation)
        except Exception:
            try:
                conn.deleteObjects("Annotation", [annotation.getId()], wait=True)
            except Exception:
                pass
            raise

    record.update({
        "state": "adopted",
        "workspaceId": workspace_id,
        "datasetId": int(dataset.getId()),
        "annotationId": int(annotation.getId()),
        "storageMode": storage_mode or "unknown",
        "adoptedAt": datetime.now(timezone.utc).isoformat(),
    })
    storage.write_json(record_path, record)
    value = attachment_info(annotation, obj=dataset).to_dict()
    value.update({
        "workspace_id": workspace_id,
        "staging_id": staging_id,
        "storage_mode": record["storageMode"],
    })
    return value


def workspace_input_attachment(conn, source, annotation_id):
    """Resolve a staged input only inside this user's matching workspace library."""
    from .workspace_sync import _managed_project, _marker, _project_datasets

    project = _managed_project(conn, object_group_id(source))
    source_type, source_id = _source_type(source), int(source.getId())
    for dataset in _project_datasets(project) if project is not None else []:
        _, identity = _marker(dataset, "dataset")
        if (
            identity.get("source_object_type") != source_type
            or int(identity.get("source_object_id", 0)) != source_id
        ):
            continue
        for annotation in object_annotations(dataset):
            if not hasattr(annotation, "getFile") or int(annotation.getId()) != int(annotation_id):
                continue
            namespace = str(plain(getattr(annotation, "getNs", lambda: None)()) or "")
            if namespace != STAGED_INPUT_NAMESPACE:
                break
            return annotation, attachment_info(annotation, obj=dataset, direct=True)
    raise AttachmentNotFound("The workspace input is unavailable")
