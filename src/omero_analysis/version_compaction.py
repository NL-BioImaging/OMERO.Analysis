"""Find provably managed orphan versions; current and shared objects stay protected."""
import hashlib
import io
import json
import re
import zipfile


def obsolete_versions(conn, dataset, manifest):
    from . import workspace_sync as ws
    if dataset is None or not manifest or ws._owner_id(dataset) != ws._user_id(conn):
        return []
    workspace_id = manifest.get("workspace", {}).get("id")
    if not workspace_id:
        return []
    current = {int(item["remote"]["object_id"]) for item in manifest.get("items", [])
               if item.get("remote", {}).get("object_type") == "Annotation"}
    notebook_keys = {item["key"] for item in manifest.get("items", []) if item.get("kind") == "notebook"}
    unload = getattr(dataset, "unloadAnnotationLinks", None)
    if callable(unload): unload()
    refs = []
    for annotation in ws._annotations(dataset):
        namespace = str(ws._plain(getattr(annotation, "getNs", lambda: None)()) or "")
        identifier = int(annotation.getId())
        if identifier in current or ws._owner_id(annotation) != ws._user_id(conn):
            continue
        if namespace == ws.SYNC_MANIFEST_NAMESPACE:
            # Keep the canonical highest revision, including an equal-content retry.
            data = ws._file_bytes(annotation)
            try: candidate = json.loads(data)
            except (ValueError, UnicodeError): continue
            if (candidate.get("schema") == ws.MANIFEST_SCHEMA and candidate.get("workspace", {}).get("id") == workspace_id
                    and int(candidate.get("revision", 0)) < int(manifest.get("revision", 0))):
                refs.append(("Annotation", identifier))
            continue
        if namespace not in {ws.WORKSPACE_SNAPSHOT_NAMESPACE, ws._item_namespace("notebook")}:
            continue
        description = str(ws._plain(getattr(annotation, "getDescription", lambda: None)()) or "")
        match = re.fullmatch(r"OMERO Analysis synchronized item (.+)\. Operation ([a-f0-9]{64})\.", description)
        if not match: continue
        key, operation = match.groups()
        if key not in notebook_keys and key != f"workspace-snapshot:{workspace_id}":
            continue
        data = ws._file_bytes(annotation)
        operation_matches = ws._operation_identity(workspace_id, {"key": key, "sha256": hashlib.sha256(data).hexdigest()}) == operation
        if not operation_matches and namespace != ws.WORKSPACE_SNAPSHOT_NAMESPACE:
            continue
        if namespace == ws.WORKSPACE_SNAPSHOT_NAMESPACE:
            # The operation digest binds bytes to this workspace; do not unpack an
            # arbitrary archive merely because its filename resembles a snapshot.
            try:
                archive = zipfile.ZipFile(io.BytesIO(data))
                entry = archive.getinfo("workspace.json")
                if entry.file_size > 64 * 1024 * 1024: continue
                snapshot = json.loads(archive.read(entry))
            except (ValueError, KeyError, UnicodeError, zipfile.BadZipFile): continue
            identity = snapshot.get("workspace", {})
            expected = manifest.get("workspace", {})
            if (identity.get("id") != workspace_id or identity.get("userId") != ws._user_id(conn)
                    or identity.get("groupId") != expected.get("groupId")
                    or identity.get("objectType") != expected.get("sourceObjectType")
                    or identity.get("objectId") != expected.get("sourceObjectId")): continue
            # Retirement migration legitimately rewrites legacy archives without
            # preserving their original operation digest; exact owned workspace
            # identity is required for these migrated versions.
        refs.append(("Annotation", identifier))
    return refs
