"""Authorized access to the exact bytes referenced by recovery snapshots."""
import hashlib
from pathlib import Path

from .errors import AttachmentNotFound, UnsupportedMedia, PermissionDenied
from .services import object_group_id
from .workspace_lifecycle import state_for


def result_payload(conn, obj, workspace_id, key):
    from . import workspace_sync as ws
    storage, state = state_for(conn, obj, workspace_id)
    if state["state"] in {"purging", "purged"}:
        raise AttachmentNotFound("Workspace results were permanently removed")
    dataset = ws._managed_dataset(ws._managed_project(conn, object_group_id(obj)), workspace_id)
    if dataset is None:
        raise AttachmentNotFound("The synchronized workspace is unavailable")
    _, identity = ws._marker(dataset, "dataset")
    if (int(identity.get("source_object_id", 0)) != obj.getId() or
            identity.get("source_object_type") != getattr(obj, "OMERO_CLASS", None)):
        raise PermissionDenied("This result belongs to a different source")
    _, manifest = ws._read_manifest(dataset)
    item = ws._remote_items(manifest).get(key)
    if not item or item.get("kind") not in {"result", "png-image"}:
        raise AttachmentNotFound("Result is not in this workspace manifest")
    remote = item.get("remote", {})
    kind = remote.get("object_type")
    asset = conn.getObject("FileAnnotation" if kind == "Annotation" else kind, remote.get("object_id"))
    if asset is None or object_group_id(asset) != object_group_id(obj):
        raise AttachmentNotFound("Result is no longer readable in this group")
    if kind == "Annotation":
        original = conn.getObject("OriginalFile", asset.getFile().getId())
        if original is None or object_group_id(original) != object_group_id(obj):
            raise AttachmentNotFound("The result OriginalFile is no longer readable in this group")
    if kind == "Image":
        linked = any(parent.getId() == dataset.getId() for parent in asset.listParents())
    else:
        linked = any(link.getParent().getId() == dataset.getId() for link in asset.getParentLinks("Dataset"))
        if not linked:
            managed_images = {entry["remote"]["object_id"] for entry in ws._remote_items(manifest).values()
                              if entry.get("remote", {}).get("object_type") == "Image"}
            for link in asset.getParentLinks("Image"):
                parent = link.getParent()
                if parent.getId() in managed_images and any(p.getId() == dataset.getId() for p in parent.listParents()):
                    linked = True
                    break
    if not linked:
        raise AttachmentNotFound("Result was unlinked from this workspace")
    blob = (item.get("storage") or {}).get("blob") or {}
    if storage and blob.get("relativePath"):
        path = storage._ensure_inside(storage.analysis_root / Path(blob["relativePath"]))
        if not path.resolve().is_relative_to((storage.user_root / "blobs").resolve()):
            raise PermissionDenied("Result bytes are outside this user's canonical blob storage")
        handle = path.open("rb")
        try:
            digest = hashlib.sha256()
            size = 0
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                size += len(chunk)
                digest.update(chunk)
            if size != item["size"] or digest.hexdigest() != item["sha256"]:
                raise UnsupportedMedia("Saved result checksum does not match its manifest")
            handle.seek(0)
            return item, handle, None
        except Exception:
            handle.close()
            raise
    if kind == "Annotation":
        # The browser verifies the declared size and digest while restoring.
        return item, None, asset.getFileInChunks()
    raise AttachmentNotFound("Original result bytes are unavailable; retain the browser copy")
