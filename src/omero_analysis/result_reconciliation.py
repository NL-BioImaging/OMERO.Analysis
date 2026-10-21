"""Deletion propagation for manifest-managed results; never infer deletion on API failure."""
from datetime import datetime, timezone
from .errors import AnalysisError


def result_deletions(conn, dataset, manifest):
    from . import workspace_sync as ws
    records = {r["key"]: r for r in (manifest or {}).get("external_deletions", [])}
    if dataset is None:
        return list(records.values())
    owner = ws._owner_id(dataset)
    if owner is not None and owner != ws._user_id(conn):
        return list(records.values())  # A collaborator cannot certify another owner's deletion.
    items = ws._remote_items(manifest)
    timestamp = datetime.now(timezone.utc).isoformat()
    for key, item in items.items():
        if key in records or item.get("kind") not in {"result", "png-image"}:
            continue
        sources = (item.get("metadata") or {}).get("sources") or []
        file_ids = sorted({s["fileId"] for s in sources if s.get("fileId")})
        if not file_ids:  # Non-result infrastructure and unsupported legacy records.
            continue
        asset = ws._remote_object(conn, item.get("remote") or {})
        # Exceptions, permission errors and network failures propagate. They must
        # never be turned into deletion records or trigger reattachment.
        removed = asset is None
        retired = all(s.get("deletedAt") for s in sources)
        if asset is not None and not retired:
            if item["kind"] == "png-image":
                removed = not any(p.getId() == dataset.getId() for p in asset.listParents())
            else:
                linked = bool(ws._annotation_parent_links(dataset, asset))
                if not linked:
                    image_ids = {i.get("remote", {}).get("object_id") for i in items.values()
                                 if i.get("kind") == "png-image"}
                    for link in asset.getParentLinks("Image"):
                        image = link.getParent()
                        if image.getId() in image_ids and any(p.getId() == dataset.getId() for p in image.listParents()):
                            linked = True
                            break
                removed = not linked
        if removed:
            records[key] = {"key": key, "fileIds": file_ids, "deletedAt": timestamp}
    return list(records.values())


def reject_deleted_results(inventory, deletions):
    by_key = {r["key"]: r for r in deletions}
    ids = {value for r in deletions for value in r["fileIds"]}
    for item in inventory["items"]:
        if item.get("kind") not in {"result", "png-image"}:
            continue
        sources = (item.get("metadata") or {}).get("sources") or []
        if any(s.get("fileId") in ids for s in sources) or (item["key"] in by_key and not sources):
            error = AnalysisError("Results were removed in OMERO. Refresh synchronization before saving; deleted results will not be recreated.")
            error.code = "results_removed"
            error.status = 409
            raise error
