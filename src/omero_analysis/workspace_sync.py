"""Managed OMERO library mirrors for browser-local Analysis workspaces."""

from __future__ import annotations

import hashlib
import io
import json
import re
import tempfile
from datetime import datetime, timezone
from pathlib import Path

from django.core import signing

from .errors import (
    AttachmentNotFound,
    FileTooLarge,
    InvalidObject,
    PermissionDenied,
    UnsupportedMedia,
)
from .services import can_annotate, object_group_id, safe_filename, validate_notebook
from .settings import (
    context_ttl_seconds,
    max_png_pixels,
    max_sync_changed_bytes,
    max_sync_items,
    max_upload_bytes,
)

SYNC_NAMESPACE = "nl.bioimaging.analysis.sync.v1"
SYNC_MANIFEST_NAMESPACE = "nl.bioimaging.analysis.sync.manifest.v1"
INVENTORY_SCHEMA = "nl.bioimaging.analysis.sync.inventory.v1"
PLAN_SCHEMA = "nl.bioimaging.analysis.sync.plan.v1"
STATUS_SCHEMA = "nl.bioimaging.analysis.sync.status.v1"
MANIFEST_SCHEMA = "nl.bioimaging.analysis.sync.manifest.v1"
PROJECT_NAME = "+AnalysisWorkspaces"
MANAGED_DATASET_DESCRIPTION = (
    "Managed mirror of an OMERO Analysis browser workspace. "
    "Unmanaged content is never modified by synchronization."
)
PLAN_SALT = "omero-analysis-workspace-sync-plan-v1"
ITEM_KINDS = {
    "png-image",
    "result",
    "template-input",
    "chat-json",
    "chat-markdown",
    "method",
    "method-python",
    "pipeline",
    "notebook",
}
LIBRARY_KINDS = {"method", "pipeline", "notebook"}
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")


def _plain(value):
    if value is None:
        return None
    return getattr(value, "val", value)


def _user_id(conn):
    try:
        return int(conn.getUserId())
    except (AttributeError, TypeError, ValueError):
        return 0


def _canonical_json(value):
    return (json.dumps(
        value,
        sort_keys=True,
        ensure_ascii=False,
        indent=2,
        separators=(",", ": "),
    ) + "\n").encode("utf-8")


def _digest(value):
    return hashlib.sha256(_canonical_json(value)).hexdigest()


def _workspace_id(value):
    value = str(value or "")
    if not re.fullmatch(r"[-\w]{1,128}", value):
        raise InvalidObject("Workspace ID is invalid")
    return value


def _map_values(annotation):
    if not hasattr(annotation, "getValue"):
        return {}
    try:
        return {str(_plain(key)): str(_plain(value)) for key, value in annotation.getValue()}
    except (TypeError, ValueError):
        return {}


def _annotations(obj):
    try:
        return list(obj.listAnnotations())
    except (AttributeError, TypeError):
        return []


def _marker(obj, role=None, match=None):
    for annotation in _annotations(obj):
        if str(_plain(getattr(annotation, "getNs", lambda: None)())) != SYNC_NAMESPACE:
            continue
        values = _map_values(annotation)
        if (
            (not role or values.get("role") == role)
            and all(values.get(key) == str(value) for key, value in (match or {}).items())
        ):
            return annotation, values
    return None, {}


def _set_marker(conn, obj, values, role, match=None):
    annotation, current = _marker(obj, role, match)
    payload = {**current, **{key: str(value) for key, value in values.items()}, "role": role}
    pairs = sorted(payload.items())
    if annotation is None:
        from omero.gateway import MapAnnotationWrapper

        annotation = MapAnnotationWrapper(conn)
        annotation.setNs(SYNC_NAMESPACE)
        annotation.setValue(pairs)
        annotation.save()
        obj.linkAnnotation(annotation)
    else:
        annotation.setValue(pairs)
        annotation.save()
    return annotation


def _delete(conn, object_type, object_id):
    conn.deleteObjects(object_type, [int(object_id)], wait=True)


def _file_bytes(annotation, limit=max_upload_bytes):
    data = bytearray()
    for chunk in annotation.getFileInChunks():
        data.extend(chunk)
        if len(data) > limit():
            raise FileTooLarge("Managed library file exceeds the configured limit")
    return bytes(data)


def _file_info(annotation):
    original = annotation.getFile()
    return {
        "annotation_id": int(annotation.getId()),
        "file_id": int(original.getId()),
        "name": str(_plain(original.getName())),
        "size": int(_plain(original.getSize()) or 0),
        "mimetype": str(_plain(original.getMimetype()) or "application/octet-stream"),
        "namespace": str(_plain(annotation.getNs()) or ""),
    }


def _owner_id(obj):
    try:
        return int(obj.getDetails().getOwner().getId())
    except (AttributeError, TypeError, ValueError):
        return None


def _owned_projects(conn):
    try:
        return list(conn.getObjects("Project", opts={"owner": _user_id(conn)}))
    except (AttributeError, TypeError):
        return []


def _managed_project(conn, group_id, create=False):
    for project in _owned_projects(conn):
        _, marker = _marker(project, "project")
        if (
            marker.get("owner_user_id") == str(_user_id(conn))
            and marker.get("group_id") == str(group_id)
        ):
            return project
    if not create:
        return None
    from omero.gateway import ProjectWrapper
    from omero.model import ProjectI

    # Container wrappers do not instantiate an OMERO model object themselves
    # (unlike Annotation wrappers), so they must wrap a new model explicitly.
    project = ProjectWrapper(conn, ProjectI())
    project.setName(PROJECT_NAME)
    project.setDescription(
        "Private, managed OMERO Analysis workspace library. "
        "Content is updated only by explicit synchronization."
    )
    project.save()
    _set_marker(conn, project, {
        "owner_user_id": _user_id(conn),
        "group_id": group_id,
        "schema": MANIFEST_SCHEMA,
    }, "project")
    return project


def _project_datasets(project):
    try:
        return list(project.listChildren())
    except (AttributeError, TypeError):
        return []


def _managed_dataset(project, workspace_id):
    if project is None:
        return None
    for dataset in _project_datasets(project):
        _, marker = _marker(dataset, "dataset")
        if marker.get("workspace_id") == workspace_id:
            return dataset
    return None


def _dataset_name(inventory, project=None):
    workspace = inventory["workspace"]
    base = (
        f"{workspace['sourceObjectType']}-{workspace['sourceObjectId']} "
        f"\u2014 {workspace['sourceObjectName']}"
    )
    if project is not None:
        for dataset in _project_datasets(project):
            if str(_plain(dataset.getName())) != base:
                continue
            _, marker = _marker(dataset, "dataset")
            if marker.get("workspace_id") != workspace["id"]:
                return f"{base} \u2014 {workspace['id'][:8]}"
    return base


def _create_dataset(conn, project, inventory):
    from omero.gateway import DatasetWrapper
    from omero.model import DatasetI, ProjectDatasetLinkI

    desired_name = _dataset_name(inventory, project)
    # Clean up an unlinked Dataset from an interrupted pre-marker creation.
    # The exact application description makes this narrower than name-based
    # discovery and it is never used to adopt an existing Dataset.
    try:
        owned = conn.getObjects("Dataset", opts={"owner": _user_id(conn)})
        for candidate in owned:
            if (
                str(_plain(candidate.getName())) == desired_name
                and str(_plain(candidate.getDescription())) == MANAGED_DATASET_DESCRIPTION
                and not list(candidate.listParents())
                and not _marker(candidate, "dataset")[1]
            ):
                _delete(conn, "Dataset", candidate.getId())
    except (AttributeError, TypeError):
        pass

    dataset = DatasetWrapper(conn, DatasetI())
    dataset.setName(desired_name)
    dataset.setDescription(MANAGED_DATASET_DESCRIPTION)
    dataset.save()
    try:
        _set_marker(conn, dataset, {
            "workspace_id": inventory["workspace"]["id"],
            "workspace_name": inventory["workspace"]["name"],
            "source_object_type": inventory["workspace"]["sourceObjectType"],
            "source_object_id": inventory["workspace"]["sourceObjectId"],
            "source_object_name": inventory["workspace"]["sourceObjectName"],
        }, "dataset")
        link = ProjectDatasetLinkI()
        link.setParent(project._obj.__class__(project._obj.id, False))
        link.setChild(dataset._obj.__class__(dataset._obj.id, False))
        conn.getUpdateService().saveObject(link, conn.SERVICE_OPTS)
    except Exception:
        try:
            _delete(conn, "Dataset", dataset.getId())
        except Exception:
            pass
        raise
    return dataset


def _manifest_annotation(dataset):
    candidates = []
    for annotation in _annotations(dataset):
        if not hasattr(annotation, "getFile"):
            continue
        if str(_plain(annotation.getNs()) or "") == SYNC_MANIFEST_NAMESPACE:
            candidates.append(annotation)
    candidates.sort(key=lambda item: int(item.getId()), reverse=True)
    return candidates[0] if candidates else None


def _read_manifest(dataset):
    annotation = _manifest_annotation(dataset) if dataset is not None else None
    if annotation is None:
        return None, None
    try:
        manifest = json.loads(_file_bytes(annotation))
    except (ValueError, UnicodeDecodeError):
        raise UnsupportedMedia("The managed Dataset has a corrupt synchronization manifest")
    if not isinstance(manifest, dict) or manifest.get("schema") != MANIFEST_SCHEMA:
        raise UnsupportedMedia("The managed Dataset has an unsupported synchronization manifest")
    return annotation, manifest


def _remote_items(manifest):
    return {
        str(item.get("key")): item
        for item in (manifest or {}).get("items", [])
        if isinstance(item, dict) and item.get("key")
    }


def validate_inventory(payload, workspace_id, source_type, source_id, obj, conn):
    if not isinstance(payload, dict) or payload.get("schema") != INVENTORY_SCHEMA:
        raise UnsupportedMedia("Unsupported synchronization inventory")
    workspace = payload.get("workspace")
    items = payload.get("items")
    if not isinstance(workspace, dict) or not isinstance(items, list):
        raise InvalidObject("Synchronization inventory is incomplete")
    workspace_id = _workspace_id(workspace_id)
    if workspace.get("id") != workspace_id:
        raise InvalidObject("The inventory belongs to another Workspace")
    expected = {
        "sourceObjectType": source_type,
        "sourceObjectId": int(source_id),
        "userId": _user_id(conn),
        "groupId": object_group_id(obj),
    }
    for key, value in expected.items():
        if workspace.get(key) != value:
            raise PermissionDenied("The inventory does not belong to this OMERO context")
    if len(items) > max_sync_items():
        raise FileTooLarge(f"Synchronization is limited to {max_sync_items()} items")
    keys = set()
    total = 0
    for item in items:
        if not isinstance(item, dict):
            raise InvalidObject("Synchronization item is invalid")
        key = str(item.get("key") or "")
        if not key or len(key) > 256 or key in keys:
            raise InvalidObject("Synchronization item keys must be unique")
        keys.add(key)
        if item.get("kind") not in ITEM_KINDS:
            raise UnsupportedMedia(f"Unsupported synchronization item kind: {item.get('kind')}")
        safe_filename(item.get("name"))
        size = item.get("size")
        if not isinstance(size, int) or size < 0 or size > max_upload_bytes():
            raise FileTooLarge("Synchronization item exceeds the configured per-item limit")
        total += size
        if not SHA256_RE.fullmatch(str(item.get("sha256") or "")):
            raise InvalidObject("Synchronization item SHA-256 is invalid")
        if not isinstance(item.get("metadata"), dict):
            raise InvalidObject("Synchronization item metadata is invalid")
    unsigned = {
        "schema": payload["schema"],
        "workspace": workspace,
        "items": items,
    }
    if payload.get("digest") != _digest(unsigned):
        raise InvalidObject("Synchronization inventory digest does not match its content")
    return payload


def _session_key(request):
    return str(getattr(getattr(request, "session", None), "session_key", "") or "")


def _plan_claims(request, conn, obj, inventory, plan):
    return {
        "version": 1,
        "user_id": _user_id(conn),
        "group_id": object_group_id(obj),
        "session_key": _session_key(request),
        "source_object_type": inventory["workspace"]["sourceObjectType"],
        "source_object_id": inventory["workspace"]["sourceObjectId"],
        "workspace_id": inventory["workspace"]["id"],
        "inventory_digest": inventory["digest"],
        "remote_revision": plan["remoteRevision"],
        "upload_keys": plan["uploadKeys"],
    }


def sync_status(conn, obj, workspace_id):
    workspace_id = _workspace_id(workspace_id)
    project = _managed_project(conn, object_group_id(obj))
    dataset = _managed_dataset(project, workspace_id)
    annotation, manifest = _read_manifest(dataset)
    return {
        "schema": STATUS_SCHEMA,
        "canSync": can_annotate(obj),
        "reason": "" if can_annotate(obj) else "You cannot annotate the selected OMERO object.",
        "linked": dataset is not None,
        "projectId": int(project.getId()) if project is not None else None,
        "projectName": str(_plain(project.getName())) if project is not None else PROJECT_NAME,
        "datasetId": int(dataset.getId()) if dataset is not None else None,
        "datasetName": str(_plain(dataset.getName())) if dataset is not None else None,
        "manifestAnnotationId": int(annotation.getId()) if annotation is not None else None,
        "remoteRevision": int((manifest or {}).get("revision") or 0),
        "inventoryDigest": str((manifest or {}).get("inventory_digest") or ""),
        "itemCount": len((manifest or {}).get("items") or []),
        "lastSyncedAt": (manifest or {}).get("updated_at"),
    }


def plan_sync(request, conn, obj, inventory):
    if not can_annotate(obj):
        raise PermissionDenied("The selected OMERO object cannot be synchronized")
    project = _managed_project(conn, object_group_id(obj))
    dataset = _managed_dataset(project, inventory["workspace"]["id"])
    _, manifest = _read_manifest(dataset)
    remote = _remote_items(manifest)
    upload_keys = []
    create = update = unchanged = 0
    for item in inventory["items"]:
        prior = remote.get(item["key"])
        if prior is None:
            create += 1
            upload_keys.append(item["key"])
        elif prior.get("sha256") == item["sha256"] and prior.get("kind") == item["kind"]:
            unchanged += 1
        else:
            update += 1
            upload_keys.append(item["key"])
    delete = len(set(remote) - {item["key"] for item in inventory["items"]})
    upload_bytes = sum(
        item["size"] for item in inventory["items"] if item["key"] in upload_keys
    )
    if upload_bytes > max_sync_changed_bytes():
        raise FileTooLarge(
            f"Changed synchronization payload is {upload_bytes} bytes; "
            f"the limit is {max_sync_changed_bytes()}"
        )
    plan = {
        "schema": PLAN_SCHEMA,
        "planToken": "",
        "projectName": PROJECT_NAME,
        "datasetName": _dataset_name(inventory, project),
        "uploadKeys": upload_keys,
        "create": create,
        "update": update,
        "delete": delete,
        "unchanged": unchanged,
        "uploadBytes": upload_bytes,
        "remoteRevision": int((manifest or {}).get("revision") or 0),
    }
    plan["planToken"] = signing.dumps(
        _plan_claims(request, conn, obj, inventory, plan),
        salt=PLAN_SALT,
        compress=True,
    )
    return plan


def _validate_plan_token(request, conn, obj, inventory, token):
    try:
        claims = signing.loads(token, salt=PLAN_SALT, max_age=context_ttl_seconds())
    except signing.BadSignature as exc:
        raise PermissionDenied("Synchronization plan is missing, invalid, or expired") from exc
    expected = {
        "version": 1,
        "user_id": _user_id(conn),
        "group_id": object_group_id(obj),
        "session_key": _session_key(request),
        "source_object_type": inventory["workspace"]["sourceObjectType"],
        "source_object_id": inventory["workspace"]["sourceObjectId"],
        "workspace_id": inventory["workspace"]["id"],
        "inventory_digest": inventory["digest"],
    }
    if any(claims.get(key) != value for key, value in expected.items()):
        raise PermissionDenied("Synchronization plan belongs to another context")
    return claims


def _validate_payload(item, uploaded):
    data = b"".join(uploaded.chunks())
    if len(data) != item["size"]:
        raise InvalidObject(f"Uploaded size does not match inventory for {item['key']}")
    if hashlib.sha256(data).hexdigest() != item["sha256"]:
        raise InvalidObject(f"Uploaded SHA-256 does not match inventory for {item['key']}")
    if item["kind"] == "notebook":
        class Upload:
            name = item["name"]
            size = len(data)
            content_type = item["mimetype"]

            def __init__(self):
                self._stream = io.BytesIO(data)

            def read(self, *args):
                return self._stream.read(*args)

            def tell(self):
                return self._stream.tell()

            def seek(self, *args):
                return self._stream.seek(*args)

        validate_notebook(Upload())
    elif item["kind"] in {"method", "pipeline", "chat-json"}:
        try:
            value = json.loads(data)
        except (ValueError, UnicodeDecodeError) as exc:
            raise UnsupportedMedia(f"{item['name']} must contain valid JSON") from exc
        if item["kind"] == "method":
            method = value.get("method") if isinstance(value, dict) else None
            if (
                not isinstance(value, dict)
                or value.get("schema") != "nl.bioimaging.analysis.method.v1"
                or not isinstance(method, dict)
                or not isinstance(method.get("versions"), list)
                or not method["versions"]
                or any(
                    not isinstance(version, dict)
                    or not isinstance(version.get("code"), str)
                    or not isinstance(version.get("version"), int)
                    for version in method["versions"]
                )
            ):
                raise UnsupportedMedia("Method bundle has an unsupported schema")
        elif item["kind"] == "pipeline":
            pipeline = value.get("pipeline") if isinstance(value, dict) else None
            if (
                not isinstance(value, dict)
                or value.get("schema") != "nl.bioimaging.analysis.pipeline.v1"
                or not isinstance(pipeline, dict)
                or not isinstance(pipeline.get("steps"), list)
                or any(
                    not isinstance(step, dict)
                    or not isinstance(step.get("methodId"), str)
                    or not isinstance(step.get("methodVersion"), int)
                    for step in pipeline["steps"]
                )
            ):
                raise UnsupportedMedia("Pipeline bundle has an unsupported schema")
        elif (
            not isinstance(value, dict)
            or value.get("schema") != "nl.bioimaging.analysis.chat.v1"
        ):
            raise UnsupportedMedia("Chat bundle has an unsupported schema")
    elif item["kind"] in {"method-python", "chat-markdown"}:
        try:
            data.decode("utf-8")
        except UnicodeDecodeError as exc:
            raise UnsupportedMedia(f"{item['name']} must be UTF-8 text") from exc
    return data


def _item_namespace(kind):
    return {
        "chat-json": "nl.bioimaging.analysis.chat.v1",
        "chat-markdown": "nl.bioimaging.analysis.chat.v1",
        "method": "nl.bioimaging.analysis.method.v1",
        "method-python": "nl.bioimaging.analysis.method.v1",
        "pipeline": "nl.bioimaging.analysis.pipeline.v1",
        "notebook": "nl.bioimaging.analysis.notebook.v1",
        "template-input": "nl.bioimaging.analysis.template.v1",
    }.get(kind, "nl.bioimaging.analysis.result.v1")


def _upload_bytes(conn, dataset, item, data):
    with tempfile.TemporaryDirectory(prefix="omero-analysis-sync-") as temp_dir:
        path = Path(temp_dir) / safe_filename(item["name"])
        path.write_bytes(data)
        annotation = conn.createFileAnnfromLocalFile(
            str(path),
            mimetype=item["mimetype"],
            ns=_item_namespace(item["kind"]),
            desc=f"OMERO Analysis synchronized item {item['key']}",
        )
        dataset.linkAnnotation(annotation)
    return annotation


def _import_png(conn, dataset, item, data):
    try:
        import numpy
        from PIL import Image, ImageFile
    except ImportError as exc:
        raise UnsupportedMedia("PNG synchronization requires Pillow and NumPy") from exc
    Image.MAX_IMAGE_PIXELS = max_png_pixels()
    ImageFile.LOAD_TRUNCATED_IMAGES = False
    try:
        with Image.open(io.BytesIO(data)) as source:
            if source.format != "PNG":
                raise UnsupportedMedia(f"{item['name']} is not a PNG image")
            width, height = source.size
            if width * height > max_png_pixels():
                raise FileTooLarge(f"{item['name']} exceeds the PNG pixel limit")
            conversion = ""
            if source.mode == "RGBA":
                canvas = Image.new("RGBA", source.size, (0, 0, 0, 255))
                source = Image.alpha_composite(canvas, source).convert("RGB")
                conversion = "RGBA composited onto black"
            elif source.mode not in {"L", "RGB"}:
                source = source.convert("RGB")
                conversion = "converted to RGB"
            array = numpy.asarray(source)
    except (UnsupportedMedia, FileTooLarge):
        raise
    except Exception as exc:
        raise UnsupportedMedia(f"{item['name']} is not a valid safe PNG") from exc
    if array.ndim == 2:
        planes = (array,)
        channels = 1
    else:
        planes = tuple(array[:, :, channel] for channel in range(3))
        channels = 3
    description = (
        f"OMERO Analysis synchronized item {item['key']}. "
        f"Source SHA-256 {item['sha256']}."
    )
    if conversion:
        description += f" Conversion: {conversion}."
    image = conn.createImageFromNumpySeq(
        iter(planes),
        item["name"],
        sizeZ=1,
        sizeC=channels,
        sizeT=1,
        description=description,
        dataset=dataset,
        channelList=["Gray"] if channels == 1 else ["Red", "Green", "Blue"],
    )
    return image


def _remote_ref(obj, item):
    if item["kind"] == "png-image":
        return {"object_type": "Image", "object_id": int(obj.getId())}
    info = _file_info(obj)
    return {
        "object_type": "Annotation",
        "object_id": info["annotation_id"],
        "file_id": info["file_id"],
    }


def _item_marker_values(workspace_id, item):
    return {
        "workspace_id": workspace_id,
        "item_key": item["key"],
        "item_kind": item["kind"],
        "sha256": item["sha256"],
    }


def _manifest_for(inventory, revision, remote_items):
    return {
        "schema": MANIFEST_SCHEMA,
        "revision": revision,
        "workspace": inventory["workspace"],
        "inventory_digest": inventory["digest"],
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "items": remote_items,
    }


def _write_manifest(conn, dataset, manifest):
    data = _canonical_json(manifest)
    item = {
        "name": ".oa-sync.json",
        "mimetype": "application/json",
        "kind": "result",
        "key": "manifest",
    }
    with tempfile.TemporaryDirectory(prefix="omero-analysis-sync-") as temp_dir:
        path = Path(temp_dir) / ".oa-sync.json"
        path.write_bytes(data)
        annotation = conn.createFileAnnfromLocalFile(
            str(path),
            mimetype=item["mimetype"],
            ns=SYNC_MANIFEST_NAMESPACE,
            desc="Canonical OMERO Analysis synchronization manifest",
        )
        dataset.linkAnnotation(annotation)
    return annotation


def _delete_ref(conn, ref):
    object_type = ref.get("object_type")
    object_id = ref.get("object_id")
    if object_type in {"Image", "Annotation"} and object_id:
        _delete(conn, object_type, object_id)


def apply_sync(request, conn, obj, inventory, plan_token, payload_keys, uploads):
    if not can_annotate(obj):
        raise PermissionDenied("The selected OMERO object cannot be synchronized")
    claims = _validate_plan_token(request, conn, obj, inventory, plan_token)
    if list(payload_keys) != list(claims.get("upload_keys") or []):
        raise InvalidObject("Uploaded synchronization keys do not match the plan")
    if len(uploads) != len(payload_keys):
        raise InvalidObject("Every changed synchronization item must be uploaded once")
    by_key = {item["key"]: item for item in inventory["items"]}
    payload = {
        key: _validate_payload(by_key[key], uploaded)
        for key, uploaded in zip(payload_keys, uploads)
        if key in by_key
    }
    if len(payload) != len(payload_keys):
        raise InvalidObject("Synchronization payload contains an unknown item")

    project = _managed_project(conn, object_group_id(obj), create=True)
    dataset = _managed_dataset(project, inventory["workspace"]["id"])
    dataset_created = dataset is None
    if dataset is None:
        dataset = _create_dataset(conn, project, inventory)
    else:
        desired_name = _dataset_name(inventory, project)
        if str(_plain(dataset.getName())) != desired_name:
            dataset.setName(desired_name)
            dataset.save()
        _set_marker(conn, dataset, {
            "workspace_id": inventory["workspace"]["id"],
            "workspace_name": inventory["workspace"]["name"],
            "source_object_type": inventory["workspace"]["sourceObjectType"],
            "source_object_id": inventory["workspace"]["sourceObjectId"],
            "source_object_name": inventory["workspace"]["sourceObjectName"],
        }, "dataset")
    old_manifest_annotation, old_manifest = _read_manifest(dataset)
    old_items = _remote_items(old_manifest)

    # A changed remote mirror between plan and apply requires a fresh upload plan.
    if int((old_manifest or {}).get("revision") or 0) != int(claims["remote_revision"]):
        from .errors import AnalysisError

        conflict = AnalysisError("The remote mirror changed; create a fresh synchronization plan")
        conflict.code = "sync_replan_required"
        conflict.status = 409
        raise conflict

    staged = []
    new_items = []
    try:
        for item in inventory["items"]:
            prior = old_items.get(item["key"])
            if item["key"] not in payload and prior is not None:
                new_items.append({**item, "remote": prior["remote"]})
                continue
            if item["kind"] == "png-image":
                remote_obj = _import_png(conn, dataset, item, payload[item["key"]])
                object_type = "Image"
            else:
                remote_obj = _upload_bytes(conn, dataset, item, payload[item["key"]])
                object_type = "Annotation"
            staged.append((object_type, int(remote_obj.getId())))
            # OMERO permits annotations on Images, but annotations themselves
            # cannot be the parent of another MapAnnotation. FileAnnotations
            # are identified by their namespace/description and the canonical
            # sync manifest instead.
            if object_type == "Image":
                _set_marker(
                    conn,
                    remote_obj,
                    _item_marker_values(inventory["workspace"]["id"], item),
                    "item",
                )
            remote = _remote_ref(remote_obj, item)
            new_items.append({**item, "remote": remote})
        revision = int((old_manifest or {}).get("revision") or 0) + 1
        manifest = _manifest_for(inventory, revision, new_items)
        manifest_annotation = _write_manifest(conn, dataset, manifest)
        staged.append(("Annotation", int(manifest_annotation.getId())))
        _set_marker(conn, obj, {
            "workspace_id": inventory["workspace"]["id"],
            "project_id": project.getId(),
            "dataset_id": dataset.getId(),
        }, "source-link", {"workspace_id": inventory["workspace"]["id"]})
    except Exception:
        for object_type, object_id in reversed(staged):
            try:
                _delete(conn, object_type, object_id)
            except Exception:
                pass
        if dataset_created:
            try:
                _delete(conn, "Dataset", dataset.getId())
            except Exception:
                pass
        raise

    new_keys = {item["key"] for item in new_items}
    new_by_key = {item["key"]: item for item in new_items}
    for key, prior in old_items.items():
        replacement = new_by_key.get(key)
        if key not in new_keys or replacement["remote"] != prior.get("remote"):
            try:
                _delete_ref(conn, prior.get("remote") or {})
            except Exception:
                pass
    if old_manifest_annotation is not None:
        try:
            _delete(conn, "Annotation", old_manifest_annotation.getId())
        except Exception:
            pass
    return sync_status(conn, obj, inventory["workspace"]["id"])


def remove_sync(conn, obj, workspace_id):
    if not can_annotate(obj):
        raise PermissionDenied("The selected OMERO object cannot be synchronized")
    workspace_id = _workspace_id(workspace_id)
    project = _managed_project(conn, object_group_id(obj))
    dataset = _managed_dataset(project, workspace_id)
    if dataset is None:
        return {"removed": 0, "dataset_deleted": False, "preserved_unmanaged": 0}
    manifest_annotation, manifest = _read_manifest(dataset)
    removed = 0
    for item in _remote_items(manifest).values():
        try:
            _delete_ref(conn, item.get("remote") or {})
            removed += 1
        except Exception:
            pass
    if manifest_annotation is not None:
        try:
            _delete(conn, "Annotation", manifest_annotation.getId())
            removed += 1
        except Exception:
            pass
    marker_annotation, _ = _marker(dataset, "dataset")
    if marker_annotation is not None:
        try:
            _delete(conn, "Annotation", marker_annotation.getId())
        except Exception:
            pass
    source_marker, marker_values = _marker(
        obj, "source-link", {"workspace_id": workspace_id}
    )
    if source_marker is not None and marker_values.get("workspace_id") == workspace_id:
        try:
            _delete(conn, "Annotation", source_marker.getId())
        except Exception:
            pass
    managed_ids = {
        int((item.get("remote") or {}).get("object_id"))
        for item in _remote_items(manifest).values()
        if (item.get("remote") or {}).get("object_id")
    }
    remaining_annotations = [
        annotation for annotation in _annotations(dataset)
        if int(annotation.getId()) not in managed_ids
        and annotation is not marker_annotation
        and annotation is not manifest_annotation
    ]
    try:
        remaining_images = [
            image for image in dataset.listChildren()
            if int(image.getId()) not in managed_ids
        ]
    except (AttributeError, TypeError):
        remaining_images = []
    unmanaged = len(remaining_annotations) + len(remaining_images)
    deleted = False
    if unmanaged == 0:
        try:
            _delete(conn, "Dataset", dataset.getId())
            deleted = True
        except Exception:
            deleted = False
    return {
        "removed": removed,
        "dataset_deleted": deleted,
        "preserved_unmanaged": unmanaged,
    }


def library_datasets(conn, obj):
    project = _managed_project(conn, object_group_id(obj))
    if project is None:
        return []
    datasets = []
    for dataset in _project_datasets(project):
        _, marker = _marker(dataset, "dataset")
        if not marker:
            continue
        _, manifest = _read_manifest(dataset)
        if manifest is None:
            continue
        items = []
        for item in manifest.get("items") or []:
            if item.get("kind") not in LIBRARY_KINDS:
                continue
            remote = item.get("remote") or {}
            if remote.get("object_type") != "Annotation":
                continue
            metadata = item.get("metadata") or {}
            items.append({
                "key": item["key"],
                "kind": item["kind"],
                "name": item["name"],
                "description": str(metadata.get("description") or ""),
                "version": int(metadata.get("currentVersion") or metadata.get("version") or 1),
                "sha256": item["sha256"],
                "size": item["size"],
                "annotationId": int(remote["object_id"]),
                "mimetype": item["mimetype"],
                "requiredCapabilities": list(metadata.get("requiredCapabilities") or []),
                "requiredFormats": list(metadata.get("requiredFormats") or []),
                "dependencies": list(metadata.get("dependencies") or []),
            })
        workspace = manifest.get("workspace") or {}
        datasets.append({
            "projectId": int(project.getId()),
            "datasetId": int(dataset.getId()),
            "datasetName": str(_plain(dataset.getName())),
            "workspaceId": str(workspace.get("id") or ""),
            "workspaceName": str(workspace.get("name") or ""),
            "sourceObjectType": str(workspace.get("sourceObjectType") or ""),
            "sourceObjectId": int(workspace.get("sourceObjectId") or 0),
            "sourceObjectName": str(workspace.get("sourceObjectName") or ""),
            "revision": int(manifest.get("revision") or 0),
            "updatedAt": str(manifest.get("updated_at") or ""),
            "items": items,
        })
    datasets.sort(key=lambda entry: (entry["datasetName"].lower(), entry["datasetId"]))
    return datasets


def library_annotation(conn, obj, annotation_id):
    annotation_id = int(annotation_id)
    for dataset in library_datasets(conn, obj):
        for item in dataset["items"]:
            if item["annotationId"] != annotation_id:
                continue
            annotation = conn.getObject("FileAnnotation", annotation_id)
            if annotation is None:
                break
            data = _file_bytes(annotation)
            if hashlib.sha256(data).hexdigest() != item["sha256"]:
                raise UnsupportedMedia("Library item SHA-256 does not match its manifest")
            return annotation, item
    raise AttachmentNotFound("The library item is not in your current-group Analysis library")
