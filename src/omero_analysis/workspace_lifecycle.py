"""Durable workspace lifecycle and retryable, narrowly scoped cleanup."""
from datetime import datetime, timezone
from pathlib import Path

from .errors import AnalysisError, InvalidObject, PermissionDenied
from .inplace_storage import storage_for
from .managed_omero import user_id
from .services import can_annotate, object_group_id
from .sync_lock import serialized_sync


def conflict(message):
    error = AnalysisError(message)
    error.code, error.status = "workspace_conflict", 409
    raise error


def state_for(conn, obj, workspace_id):
    from .workspace_sync import _workspace_id
    wid = _workspace_id(workspace_id)
    _, storage = storage_for(object_group_id(obj), user_id(conn), initialize=False)
    state = storage.read_json(Path("workspaces") / wid / "lifecycle.json") if storage else None
    return storage, state or {"state": "active", "revision": 0}


def require_active(conn, obj, inventory):
    _, state = state_for(conn, obj, inventory["workspace"]["id"])
    if state["state"] != "active":
        conflict("This workspace is in Trash or was purged. Refresh workspace management.")
    if inventory["workspace"].get("lifecycleRevision", 0) != state["revision"]:
        conflict("Workspace lifecycle changed in another tab. Refresh before saving.")


@serialized_sync
def change_lifecycle(conn, obj, workspace_id, action, expected_revision):
    from . import workspace_sync as ws
    if not can_annotate(obj):
        raise PermissionDenied("You cannot change this workspace")
    storage, state = state_for(conn, obj, workspace_id)
    if storage is None:
        raise InvalidObject("Workspace lifecycle requires configured durable Analysis storage")
    if action not in {"trash", "restore", "purge"}:
        raise InvalidObject("Unknown workspace action")
    if type(expected_revision) is not int or expected_revision != state["revision"]:
        conflict("Workspace changed. Refresh and review its current state.")
    if state["state"] == "purged":
        conflict("This workspace was permanently removed")
    if action == "purge" and state["state"] not in {"trashed", "purging"}:
        conflict("Move the workspace to Trash before permanently removing it")
    target = {"trash": "trashed", "restore": "active", "purge": "purging"}[action]
    if action == "restore" and state["state"] == "purging":
        conflict("Cleanup has started. Retry cleanup before changing this workspace")
    dataset = ws._managed_dataset(ws._managed_project(conn, object_group_id(obj)), workspace_id)
    if dataset is not None:
        _, identity = ws._marker(dataset, "dataset")
        if int(identity.get("source_object_id", 0)) != obj.getId():
            raise PermissionDenied("Workspace belongs to a different source")
        if identity.get("source_object_type") != getattr(obj, "OMERO_CLASS", identity.get("source_object_type")):
            raise PermissionDenied("Workspace belongs to a different source type")
        if ws.sync_status(conn, obj, workspace_id).get("pendingOrderCount", 0):
            conflict("Wait for pending imports to finish before changing workspace lifecycle")
    if dataset is None and action != "purge":
        conflict("The synchronized workspace is unavailable; its browser copy is preserved")
    state = {**state, "state": target, "revision": state["revision"] + (target != state["state"]),
             "changedAt": datetime.now(timezone.utc).isoformat(), "changedBy": user_id(conn)}
    storage.write_json(Path("workspaces") / workspace_id / "lifecycle.json", state)
    if dataset is not None:
        ws._set_marker(conn, dataset, {"lifecycle": target, "lifecycle_revision": state["revision"]}, "dataset")
        # Marker writes change update events. Never cascade stale annotation
        # wrappers back into OMERO when renaming the container afterwards.
        dataset = conn.getObject("Dataset", dataset.getId())
        name = str(ws._plain(dataset.getName()))
        plain_name = name.removeprefix("[Trash] ")
        dataset.setName("[Trash] " + plain_name if target != "active" else plain_name)
        dataset.save()
    if action == "purge":
        result = purge_workspace(conn, obj, workspace_id)
        if result["complete"]:
            state["state"] = "purged"
            storage.write_json(Path("workspaces") / workspace_id / "lifecycle.json", state)
        return {**ws.sync_status(conn, obj, workspace_id), "cleanup": result}
    manifest = storage.read_json(storage.workspace_manifest_path(workspace_id))
    if manifest:
        manifest["lifecycle"] = target
        manifest["datasetName"] = str(ws._plain(dataset.getName()))
        storage.write_json(storage.workspace_manifest_path(workspace_id), manifest)
        storage.publish_workspace(manifest, ws._username(conn))
    return ws.sync_status(conn, obj, workspace_id)


def _shared(conn, obj, object_type, object_id, dataset_id, managed_images, managed_annotations=()):
    """Fail closed on lookup errors; only application-owned links are disposable."""
    if object_type == "Image":
        if any(parent.getId() != dataset_id for parent in obj.listParents()):
            return True
        from . import workspace_sync as ws
        # Keep an Image if another application/user has annotated it. Some
        # annotation kinds are dependent graph nodes during OMERO deletion.
        for annotation in getattr(obj, "listAnnotations", lambda: [])():
            if (annotation.getId() not in managed_annotations and
                    str(ws._plain(annotation.getNs()) or "") != ws.SYNC_NAMESPACE):
                return True
        return False
    if object_type == "Annotation":
        for kind in ("Project", "Dataset", "Image", "Screen", "Plate", "Well", "PlateAcquisition"):
            for link in obj.getParentLinks(kind):
                parent_id = link.getParent().getId()
                if not (kind == "Dataset" and parent_id == dataset_id or
                        kind == "Image" and parent_id in managed_images):
                    return True
    return False


def cleanup_replaced(conn, obj, workspace_id, dataset, refs, revision):
    """Journal replaced objects before removal; retry without losing old targets."""
    from . import workspace_sync as ws
    storage, _ = state_for(conn, obj, workspace_id)
    if storage is None:
        # Keeping superseded objects is safer than unjournalled deletion.
        return
    path = Path("workspaces") / workspace_id / "pending-cleanup.json"
    journal = storage.read_json(path) or {"pending": [], "errors": []}
    journal["pending"] = [list(ref) for ref in sorted(set(map(tuple, journal["pending"])) | set(refs))]
    journal["revision"] = revision
    storage.write_json(path, journal)
    _, manifest = ws._read_manifest(conn.getObject("Dataset", dataset.getId()))
    active = {(item["remote"]["object_type"], item["remote"]["object_id"])
              for item in ws._remote_items(manifest).values() if item.get("remote")}
    journal["errors"] = []
    for ref in list(journal["pending"]):
        kind, identifier = ref
        try:
            if tuple(ref) not in active:
                remote = conn.getObject(kind, identifier)
                # Companions of any surviving Image remain protected.
                if remote is not None and not _shared(conn, remote, kind, identifier, dataset.getId(), set()):
                    ws._delete(conn, kind, identifier)
            journal["pending"].remove(ref)
        except Exception as exc:
            journal["errors"].append({"type": kind, "id": identifier, "reason": type(exc).__name__})
        storage.write_json(path, journal)


@serialized_sync
def purge_workspace(conn, obj, workspace_id):
    from . import workspace_sync as ws
    if not can_annotate(obj):
        raise PermissionDenied("You cannot remove this workspace")
    storage, _ = state_for(conn, obj, workspace_id)
    dataset = ws._managed_dataset(ws._managed_project(conn, object_group_id(obj)), workspace_id)
    path = Path("workspaces") / workspace_id / "cleanup.json"
    if storage is None:
        raise InvalidObject("Permanent cleanup requires durable Analysis storage for its retry journal")
    journal = storage.read_json(path)
    if journal and dataset is None:
        dataset = conn.getObject("Dataset", journal["datasetId"])
    if not journal:
        if dataset is None:
            return {"complete": True, "removed": 0, "dataset_deleted": False, "preserved_unmanaged": 0, "errors": []}
        _, manifest = ws._read_manifest(dataset)
        refs = {(str(item["remote"]["object_type"]), int(item["remote"]["object_id"]))
                for item in ws._remote_items(manifest).values() if item.get("remote", {}).get("object_id")}
        # Retain manifest and markers until payload cleanup completes.
        journal = {"datasetId": dataset.getId(), "pending": [list(ref) for ref in sorted(refs)],
                   "done": [], "preserved": [], "errors": []}
    def save():
        if storage:
            storage.write_json(path, journal)
    save()
    journal["errors"] = []
    images = set()
    annotations = {ref[1] for ref in journal["pending"] + journal["done"] if ref[0] == "Annotation"}
    for ref in journal["pending"] + journal["done"]:
        if ref[0] == "Image":
            image = conn.getObject("Image", ref[1])
            if image is not None and not _shared(conn, image, "Image", ref[1], journal["datasetId"], set(), annotations):
                images.add(ref[1])
    # Check companions before deleting Images, whose links establish their ownership.
    for ref in sorted(list(journal["pending"]), key=lambda ref: ref[0] == "Image"):
        kind, identifier = ref
        try:
            remote = conn.getObject("Annotation" if kind == "Annotation" else kind, identifier)
            if remote is not None:
                if _shared(conn, remote, kind, identifier, journal["datasetId"], images, annotations):
                    journal["preserved"].append(ref)
                else:
                    ws._delete(conn, kind, identifier)
            journal["pending"].remove(ref)
            journal["done"].append(ref)
        except Exception as exc:
            journal["errors"].append({"type": kind, "id": identifier, "reason": type(exc).__name__})
        save()
    if not journal["pending"] and dataset is not None:
        try:
            fresh = conn.getObject("Dataset", journal["datasetId"])
            if fresh is not None:
                for annotation in ws._annotations(fresh):
                    namespace = str(ws._plain(annotation.getNs()) or "")
                    values = ws._map_values(annotation)
                    if namespace == ws.SYNC_MANIFEST_NAMESPACE or (namespace == ws.SYNC_NAMESPACE and
                            values.get("workspace_id") == workspace_id):
                        if not _shared(conn, annotation, "Annotation", annotation.getId(), journal["datasetId"], set()):
                            ws._delete(conn, "Annotation", annotation.getId())
                # Fresh wrappers and typed identities prevent stale-cache/id-collision errors.
                fresh = conn.getObject("Dataset", journal["datasetId"])
                unmanaged = len(ws._annotations(fresh)) + len(list(fresh.listChildren()))
                journal["unmanaged"] = unmanaged
                if not unmanaged:
                    ws._delete(conn, "Dataset", journal["datasetId"])
                    journal["datasetDeleted"] = True
            marker, _ = ws._marker(obj, "source-link", {"workspace_id": workspace_id})
            if marker:
                ws._delete(conn, "Annotation", marker.getId())
        except Exception as exc:
            journal["errors"].append({"type": "metadata", "reason": type(exc).__name__})
    complete = not journal["pending"] and not journal["errors"]
    journal["complete"] = complete
    save()
    if complete and storage:
        storage.remove_workspace_view(workspace_id)
        storage.delete_json(storage.workspace_manifest_path(workspace_id))
        storage.prune_empty_directories()
    return {"complete": complete, "removed": len(journal["done"]) - len(journal["preserved"]),
            "dataset_deleted": bool(journal.get("datasetDeleted")),
            "preserved_unmanaged": journal.get("unmanaged", 0), "errors": journal["errors"]}
