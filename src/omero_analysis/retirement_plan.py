"""Conservative, content-addressed planning for notebook-only retirement."""
from __future__ import annotations

from copy import deepcopy
import hashlib
import json
from pathlib import Path

from .errors import UnsupportedMedia
from .retired_content import RETIRED_FILE_NAMESPACES, STORAGE_VERSION

RETIRED_KINDS = frozenset({
    "method", "method-python", "pipeline", "chat-json", "chat-markdown",
    "chat-text", "assistant-record", "ai-settings", "encrypted-settings",
    "user-skill", "custom-skill",
})
SYNC_SCHEMA = "nl.bioimaging.analysis.sync.manifest.v1"
STORAGE_SCHEMA = "nl.bioimaging.analysis.storage.workspace.v1"
SETTINGS_SCHEMA = "nl.bioimaging.analysis.storage.settings.v1"
PAYLOAD_NAMESPACE = "nl.bioimaging.analysis.payload.v1"


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def canonical(value):
    return (json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")


def migrate_item_manifest(value, replacements=None):
    """Preserve every result/input/notebook, including legacy-origin results.

    replacements maps stable Annotation IDs to verified new file/blob details.
    It never infers obsolescence from a path, filename, methodId, or chatId.
    """
    if not isinstance(value, dict) or value.get("schema") not in {SYNC_SCHEMA, STORAGE_SCHEMA}:
        raise UnsupportedMedia("Not a managed Analysis synchronization manifest")
    if not isinstance(value.get("items"), list) or not all(isinstance(x, dict) for x in value["items"]):
        raise UnsupportedMedia("Invalid managed Analysis item inventory")
    result = deepcopy(value)
    result["items"] = [item for item in result["items"] if item.get("kind") not in RETIRED_KINDS]
    for item in result["items"]:
        remote = item.get("remote") or {}
        replacement = (replacements or {}).get(str(remote.get("object_id")))
        if remote.get("object_type") != "Annotation" or not replacement:
            continue
        content_changed = (item.get("sha256") != replacement["sha256"]
                           or item.get("size") != replacement["size"]
                           or remote.get("file_id") != replacement["fileId"])
        item.update({key: replacement[key] for key in ("sha256", "size")})
        remote["file_id"] = replacement["fileId"]
        if replacement.get("blob"):
            if "blob" in item:
                item["blob"] = deepcopy(replacement["blob"])
            if isinstance(item.get("storage"), dict):
                item["storage"]["blob"] = deepcopy(replacement["blob"])
        metadata = item.get("metadata")
        if content_changed and isinstance(metadata, dict):
            metadata.pop("stateDigest", None)
    changed = result != value or result.get("storageVersion") != STORAGE_VERSION
    if changed:
        result["storageVersion"] = STORAGE_VERSION
        # Force a fresh digest calculation on the next current-client sync.
        for key in ("inventory_digest", "content_inventory_digest", "inventoryDigest", "contentInventoryDigest"):
            result.pop(key, None)
        if result["schema"] == SYNC_SCHEMA:
            result["revision"] = int(result.get("revision") or 0) + 1
    return result


def removable_payload(item, annotation):
    """A manifest reference alone cannot authorize deleting unrelated content."""
    remote = item.get("remote") or {}
    return (
        item.get("kind") in RETIRED_KINDS
        and remote.get("object_type") == "Annotation"
        and int(remote.get("object_id") or 0) == int(annotation["annotationId"])
        and annotation["namespace"] in RETIRED_FILE_NAMESPACES | {PAYLOAD_NAMESPACE}
    )


def exclusive_settings_parent(parent, removable_annotations, removable_children):
    """Only marked, owner/group-matched, exclusively obsolete containers qualify."""
    if parent.get("objectType") not in {"Project", "Dataset"}:
        return False
    marker = parent.get("settingsMarker") or {}
    if marker.get("schema") != "nl.bioimaging.analysis.settings.bundle.v1":
        return False
    if marker.get("role") not in ({"project"} if parent["objectType"] == "Project" else {"skills", "ai-settings"}):
        return False
    if str(marker.get("owner_user_id")) != str(parent.get("ownerId")):
        return False
    if marker.get("group_id") is not None and str(marker["group_id"]) != str(parent.get("groupId")):
        return False
    if not parent.get("contentsChecked") or parent.get("imageIds"):
        return False
    if any(item not in removable_annotations for item in parent.get("annotationIds", [])):
        return False
    return all(item in removable_children for item in parent.get("childDatasetIds", []))


def checked_path(root, relative):
    """Resolve within an exact backup/storage root, rejecting every symlink hop."""
    root = Path(root).absolute()
    candidate = Path(relative)
    if candidate.is_absolute() or ".." in candidate.parts:
        raise ValueError("Path escapes its Analysis root")
    path = root / candidate
    for current in [root, *(root / Path(*candidate.parts[:i]) for i in range(1, len(candidate.parts) + 1))]:
        if current.is_symlink():
            raise ValueError("Analysis cleanup does not follow symlinks")
    path.resolve().relative_to(root.resolve())
    return path


def verify_backup(root, entry):
    path = checked_path(root, entry["backup"])
    data = path.read_bytes()
    if len(data) != entry["size"] or sha256(data) != entry["sha256"]:
        raise ValueError("Retirement backup is incomplete or changed")
    return data


def assert_same_identity(actual, expected):
    for key in ("annotationId", "ownerId", "groupId", "namespace"):
        if actual.get(key) != expected.get(key):
            raise ValueError(f"Retirement target changed its {key}; inventory again")
