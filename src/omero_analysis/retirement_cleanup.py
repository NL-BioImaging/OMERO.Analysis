"""Backed-up, owner-scoped retirement of managed Analysis content.

This is an administrator maintenance operation, never a request/startup hook.
No object is selected by its name. Immutable blobs are retained if they could
still back an OMERO in-place OriginalFile; live indexes and archives are migrated.
"""
from __future__ import annotations

from contextlib import ExitStack
import io
import json
from pathlib import Path

from .managed_omero import plain
from .retired_content import (
    RETIRED_FILE_NAMESPACES, SETTINGS_NAMESPACE, migrate_workspace_archive,
    validate_notebook_archive,
)
from .retirement_plan import (
    PAYLOAD_NAMESPACE, RETIRED_KINDS, SETTINGS_SCHEMA, STORAGE_SCHEMA,
    SYNC_SCHEMA, assert_same_identity, canonical, checked_path,
    exclusive_settings_parent, migrate_item_manifest, sha256, verify_backup,
)

SNAPSHOT_NAMESPACE = "nl.bioimaging.analysis.workspace.v1"
SYNC_NAMESPACE = "nl.bioimaging.analysis.sync.v1"
STATE_NAMESPACE = "nl.bioimaging.analysis.workspace.state.v1"


def state_record(data, expected):
    """Authenticate the journal before using its identity or payload."""
    import re
    from django.core import signing
    from .omero_state import STATE_SALT
    record = signing.loads(data.decode("utf-8"), salt=STATE_SALT)
    if (not isinstance(record, dict) or record.get("schema") != STATE_NAMESPACE
            or record.get("userId") != expected["ownerId"]
            or record.get("groupId") != expected["groupId"]
            or not isinstance(record.get("generation"), int)
            or not isinstance(record.get("payload"), dict)
            or not re.fullmatch(r"workspaces/[-\w]{1,128}/(?:lifecycle|pending-cleanup|cleanup|manifest)\.json",
                                str(record.get("path", "")))):
        raise ValueError("Signed Analysis state crosses its identity or path boundary")
    payload = record["payload"]
    if payload.get("userId", record["userId"]) != record["userId"] or payload.get("groupId", record["groupId"]) != record["groupId"]:
        raise ValueError("Signed Analysis state payload crosses its identity boundary")
    return record


def migrate_state_record(data, expected, replacements=None):
    """Keep lifecycle/cleanup journals intact; sanitize only managed manifests."""
    from django.core import signing
    from .omero_state import STATE_SALT
    record = state_record(data, expected)
    payload = record["payload"]
    if payload.get("schema") not in {SYNC_SCHEMA, STORAGE_SCHEMA}:
        return data
    migrated = migrate_item_manifest(payload, replacements)
    if migrated == payload:
        return data
    record = {**record, "payload": migrated, "generation": record["generation"] + 1}
    return signing.dumps(record, salt=STATE_SALT, compress=True).encode("utf-8")
MAX_BACKUP_FILE = 512 * 1024 * 1024


def identity(obj):
    details = obj.getDetails()
    return {
        "annotationId": int(obj.getId()),
        "ownerId": int(details.getOwner().getId()),
        "groupId": int(details.getGroup().getId()),
        "namespace": str(obj.getNs()),
    }


def file_bytes(annotation):
    if int(plain(annotation.getFile().getSize())) > MAX_BACKUP_FILE:
        raise ValueError("Managed retirement file exceeds the 512 MiB limit")
    data = bytearray()
    for chunk in annotation.getFileInChunks():
        data.extend(chunk)
        if len(data) > MAX_BACKUP_FILE:
            raise ValueError("Managed retirement file exceeds the 512 MiB limit")
    return bytes(data)


def links_for(conn, ids):
    from omero.sys import ParametersI
    result = []
    for kind in ("Image", "Dataset", "Project", "Screen", "Plate", "Well", "Annotation"):
        for offset in range(0, len(ids), 200):
            params = ParametersI().addIds(ids[offset:offset + 200])
            rows = conn.getQueryService().projection(
                f"select l.parent.id, l.child.id from {kind}AnnotationLink l where l.child.id in (:ids)",
                params, conn.SERVICE_OPTS,
            )
            result.extend({"parentType": kind, "parentId": int(plain(row[0])),
                           "annotationId": int(plain(row[1]))} for row in rows)
    return result


def settings_parent(obj, kind, marker):
    annotations = list(obj.listAnnotations())
    return {
        "objectType": kind, "objectId": int(obj.getId()),
        "ownerId": int(obj.getDetails().getOwner().getId()),
        "groupId": int(obj.getDetails().getGroup().getId()),
        "name": str(obj.getName()), "description": str(obj.getDescription() or ""),
        "settingsMarker": dict(marker.getValue()),
        "annotationIds": [int(a.getId()) for a in annotations],
        "childDatasetIds": [int(c.getId()) for c in obj.listChildren()] if kind == "Project" else [],
        "imageIds": [int(c.getId()) for c in obj.listChildren()] if kind == "Dataset" else [],
        "contentsChecked": True,
    }


def _save_backup(directory, data, number):
    name = f"content-{number:06d}.bin"
    path = directory / name
    with path.open("xb") as output:
        output.write(data)
    return {"backup": name, "size": len(data), "sha256": sha256(data)}


def prepare_cleanup(conn, directory, dataset_id=None):
    """Inventory and back up all affected content before any live mutation."""
    import zipfile
    if not conn.isAdmin():
        raise PermissionError("Analysis retirement requires an OMERO administrator")
    directory = Path(directory).absolute()
    directory.mkdir(mode=0o700, parents=True, exist_ok=False)
    conn.SERVICE_OPTS.setOmeroGroup(-1)
    annotations = {}
    content = {}
    markers = {}
    for ns in sorted(RETIRED_FILE_NAMESPACES | {SNAPSHOT_NAMESPACE, SYNC_SCHEMA, STATE_NAMESPACE}):
        for obj in conn.getObjects("FileAnnotation", attributes={"ns": ns}):
            annotations[int(obj.getId())] = obj
    for ns in (SETTINGS_NAMESPACE, SYNC_NAMESPACE):
        for obj in conn.getObjects("MapAnnotation", attributes={"ns": ns}):
            values = dict(obj.getValue())
            if ns == SETTINGS_NAMESPACE or values.get("item_kind") in RETIRED_KINDS:
                markers[int(obj.getId())] = obj
    if dataset_id is not None:
        scoped_links = links_for(conn, list(annotations) + list(markers))
        direct = {l["annotationId"] for l in scoped_links
                  if l["parentType"] == "Dataset" and l["parentId"] == dataset_id}
        external = {l["annotationId"] for l in scoped_links if l["parentType"] != "Annotation"
                    and (l["parentType"], l["parentId"]) != ("Dataset", dataset_id)}
        selected = direct - external
        for key, obj in annotations.items():
            if obj.getNs() == STATE_NAMESPACE:
                record = state_record(file_bytes(obj), identity(obj))
                if record["payload"].get("datasetId") == dataset_id:
                    selected.add(key)
        annotations = {key: value for key, value in annotations.items() if key in selected}
        markers = {key: value for key, value in markers.items() if key in selected}
    # Older assistant exports use the general payload namespace. Require an
    # explicit retired item kind and matching owner/group before targeting it.
    for obj in list(annotations.values()):
        if obj.getNs() != SYNC_SCHEMA:
            continue
        value = json.loads(file_bytes(obj))
        for item in value.get("items", []):
            remote = item.get("remote") or {}
            if item.get("kind") not in RETIRED_KINDS or remote.get("object_type") != "Annotation":
                continue
            target = conn.getObject("FileAnnotation", int(remote["object_id"]))
            if target is None:
                continue
            source_id, target_id = identity(obj), identity(target)
            if target_id["namespace"] not in RETIRED_FILE_NAMESPACES | {PAYLOAD_NAMESPACE}:
                raise ValueError("A retired manifest entry references unrelated content")
            if any(source_id[k] != target_id[k] for k in ("ownerId", "groupId")):
                raise ValueError("A retired manifest entry crosses an owner/group boundary")
            annotations[int(target.getId())] = target
    initial_links = links_for(conn, list(annotations) + list(markers))
    for link in initial_links:
        if link["parentType"] == "Annotation" and link["annotationId"] in markers:
            marker = markers[link["annotationId"]]
            if dict(marker.getValue()).get("item_kind") not in RETIRED_KINDS:
                continue
            target = conn.getObject("FileAnnotation", link["parentId"])
            if target is not None and target.getNs() == PAYLOAD_NAMESPACE:
                marker_id, target_id = identity(marker), identity(target)
                if all(marker_id[k] == target_id[k] for k in ("ownerId", "groupId")):
                    annotations[int(target.getId())] = target
    links = links_for(conn, list(annotations) + list(markers))
    if dataset_id is not None:
        direct = {l["annotationId"] for l in links if l["parentType"] == "Dataset" and l["parentId"] == dataset_id}
        # Do not mutate a shared annotation through a restricted acceptance scope.
        external = {l["annotationId"] for l in links if l["parentType"] != "Annotation"
                    and (l["parentType"], l["parentId"]) != ("Dataset", dataset_id)}
        selected = direct - external
        for key, obj in annotations.items():
            if obj.getNs() == STATE_NAMESPACE:
                record = state_record(file_bytes(obj), identity(obj))
                if record["payload"].get("datasetId") == dataset_id:
                    selected.add(key)
        annotations = {key: value for key, value in annotations.items() if key in selected}
        markers = {key: value for key, value in markers.items() if key in selected}
        links = [link for link in links if link["annotationId"] in selected]
    report = {
        "schema": "nl.bioimaging.analysis.retirement.v3",
        "datasetId": dataset_id, "files": [], "markers": [], "parents": [],
        "links": links, "durable": [], "complete": False,
    }
    for key, obj in sorted(annotations.items()):
        data = file_bytes(obj)
        original = obj.getFile()
        entry = {**identity(obj), **_save_backup(directory, data, len(report["files"])),
                 "fileId": int(original.getId()), "name": str(plain(original.getName())),
                 "mimetype": str(plain(original.getMimetype()) or "application/octet-stream"),
                 "description": str(obj.getDescription() or "")}
        content[key] = data
        if obj.getNs() == SNAPSHOT_NAMESPACE:
            try:
                with zipfile.ZipFile(io.BytesIO(data)) as archive:
                    validate_notebook_archive(archive)
                entry["action"] = "preserve"
            except Exception:
                replacement = migrate_workspace_archive(data)
                entry["action"] = "rewrite-snapshot"
                entry["replacement"] = _save_backup(directory, replacement, 100000 + len(report["files"]))
        elif obj.getNs() == STATE_NAMESPACE:
            migrated = migrate_state_record(data, entry)
            entry["action"] = "rewrite-state" if migrated != data else "check-state"
        elif obj.getNs() == SYNC_SCHEMA:
            migrated = migrate_item_manifest(json.loads(data))
            entry["action"] = "rewrite-manifest" if migrated != json.loads(data) else "check-manifest"
        else:
            entry["action"] = "delete"
        report["files"].append(entry)
    for obj in markers.values():
        report["markers"].append({**identity(obj), "values": list(obj.getValue())})
    # A retained result can legitimately mention an old method/chat ID. Only
    # actual remote references protect an annotation; provenance is retained.
    deleting = {e["annotationId"] for e in report["files"] if e["action"] == "delete"}
    for entry in report["files"]:
        if entry["namespace"] != SYNC_SCHEMA:
            continue
        value = json.loads(content[entry["annotationId"]])
        for item in value.get("items", []):
            ref = item.get("remote") or {}
            if item.get("kind") not in RETIRED_KINDS and ref.get("object_type") == "Annotation" and ref.get("object_id") in deleting:
                raise ValueError("A retained result/input references content selected for retirement")
    if dataset_id is None:
        for link in links:
            marker = markers.get(link["annotationId"])
            if marker is None or marker.getNs() != SETTINGS_NAMESPACE or link["parentType"] not in {"Dataset", "Project"}:
                continue
            obj = conn.getObject(link["parentType"], link["parentId"])
            if obj is not None and (
                int(obj.getDetails().getOwner().getId()) == identity(marker)["ownerId"]
                and int(obj.getDetails().getGroup().getId()) == identity(marker)["groupId"]
            ):
                report["parents"].append(settings_parent(obj, link["parentType"], marker))
    _backup_durable(report, directory)
    report["complete"] = True
    (directory / "inventory.json").write_bytes(canonical(report))
    return report


def _backup_durable(report, directory):
    from .inplace_storage import storage_capability
    roots = {}
    for group in sorted({e["groupId"] for e in report["files"] + report["markers"]}):
        capability = storage_capability(group, initialize=False)
        if capability.ready:
            roots.setdefault(str(Path(capability.mapped_root) / ".analysis"), set()).add(group)
    owners = {e["ownerId"] for e in report["files"] + report["markers"]}
    for root_text, groups in roots.items():
        root = Path(root_text)
        for owner in sorted(owners):
            user = checked_path(root, f"users/{owner}")
            if not user.is_dir():
                continue
            for folder in ("workspaces", "settings", "pending", "history"):
                base = checked_path(root, f"users/{owner}/{folder}")
                if not base.exists():
                    continue
                for path in sorted(base.rglob("*.json")):
                    path = checked_path(root, path.relative_to(root))
                    data = path.read_bytes()
                    value = json.loads(data)
                    if not isinstance(value, dict):
                        continue
                    if value.get("userId", owner) != owner:
                        raise ValueError("Durable metadata crosses its owner boundary")
                    if value.get("groupId") is not None and value["groupId"] not in groups:
                        continue
                    dataset = value.get("datasetId")
                    if report["datasetId"] is not None:
                        if dataset is None and folder == "workspaces":
                            manifest_path = path.parent / "manifest.json"
                            if manifest_path.exists():
                                dataset = json.loads(manifest_path.read_bytes()).get("datasetId")
                        if dataset != report["datasetId"]:
                            continue
                    entry = {"root": root_text, "path": path.relative_to(root).as_posix(),
                             "ownerId": owner, **_save_backup(directory, data, 200000 + len(report["durable"]))}
                    report["durable"].append(entry)
                    # Back up managed browse copies that could be overwritten.
                    # Snapshot/retired blobs are immutable and retained, never GC'd.
                    if path.name == "browse.json":
                        for relative in value.get("files", []):
                            target = checked_path(root, relative)
                            if not target.is_file():
                                continue
                            if len(target.parts) < 3 or not target.relative_to(root).parts[0].endswith(f"--{owner}"):
                                raise ValueError("Browsing index crosses its owner boundary")
                            report["durable"].append({
                                "root": root_text, "path": relative, "ownerId": owner, "browse": True,
                                **_save_backup(directory, target.read_bytes(), 200000 + len(report["durable"])),
                            })


def _owner_connection(admin, entry):
    user = admin.getObject("Experimenter", entry["ownerId"])
    group = admin.getObject("ExperimenterGroup", entry["groupId"])
    if user is None or group is None:
        raise ValueError("Retirement owner/group is unavailable")
    conn = admin.suConn(user.getOmeName(), group=group.getName(), ttl=600000)
    if conn is None:
        raise ValueError("Could not open an owner-scoped maintenance session")
    if int(conn.getUserId()) != entry["ownerId"]:
        conn.close()
        raise ValueError("Maintenance session changed owner")
    conn.SERVICE_OPTS.setOmeroGroup(entry["groupId"])
    return conn


def apply_cleanup(admin, directory):
    """Recheck every backup and target under sync locks, then retire in order."""
    from .inplace_storage import storage_for
    from .omero_state import OmeroStateStorage
    from .sync_lock import storage_lock
    directory = Path(directory).absolute()
    report = json.loads((directory / "inventory.json").read_bytes())
    if not admin.isAdmin() or report.get("schema") != "nl.bioimaging.analysis.retirement.v3" or not report.get("complete"):
        raise ValueError("A complete administrator retirement backup is required")
    admin.SERVICE_OPTS.setOmeroGroup(-1)
    content = {entry["annotationId"]: verify_backup(directory, entry) for entry in report["files"]}
    for entry in report["files"]:
        if entry.get("replacement"):
            verify_backup(directory, entry["replacement"])
    for entry in report["durable"]:
        verify_backup(directory, entry)
    outcome = {"snapshots": 0, "manifests": 0, "annotations": 0, "parents": 0, "durable": 0,
               "immutableBlobsRetained": True, "completed": False}
    with ExitStack() as stack:
        clients, stores = {}, {}
        for entry in report["files"] + report["markers"]:
            key = (entry["ownerId"], entry["groupId"])
            if key in clients:
                continue
            conn = _owner_connection(admin, entry)
            stack.callback(conn.close)
            clients[key] = conn
            _, store = storage_for(entry["groupId"], entry["ownerId"], initialize=False)
            if store is None:
                parent = next((link for link in report["links"] if link["annotationId"] == entry["annotationId"]
                               and link["parentType"] in {"Dataset", "Project", "Image", "Screen", "Plate"}), None)
                source = (conn.getObject(parent["parentType"], parent["parentId"]) if parent
                          else conn.getObject("Annotation", entry["annotationId"]))
                if source is None:
                    raise ValueError("Managed content changed before maintenance locking")
                store = OmeroStateStorage(conn, source)
            stores[key] = store
            stack.enter_context(storage_lock(store))
        # Complete preflight before changing any live content.
        for entry in report["files"]:
            conn = clients[(entry["ownerId"], entry["groupId"])]
            obj = conn.getObject("FileAnnotation", entry["annotationId"])
            if obj is None:
                raise ValueError("Managed content changed since backup; prepare a new backup")
            assert_same_identity(identity(obj), entry)
            if sha256(file_bytes(obj)) != entry["sha256"]:
                raise ValueError("Managed content changed since backup; prepare a new backup")
        for entry in report["durable"]:
            path = checked_path(entry["root"], entry["path"])
            if not path.is_file() or sha256(path.read_bytes()) != entry["sha256"]:
                raise ValueError("Durable content changed since backup; prepare a new backup")
        for entry in report["markers"]:
            conn = clients[(entry["ownerId"], entry["groupId"])]
            obj = conn.getObject("MapAnnotation", entry["annotationId"])
            if obj is None:
                raise ValueError("Managed marker changed since backup")
            assert_same_identity(identity(obj), entry)
            if [list(pair) for pair in obj.getValue()] != entry["values"]:
                raise ValueError("Managed marker changed since backup")
        replacements = {}
        for entry in report["files"]:
            if entry["namespace"] != SNAPSHOT_NAMESPACE:
                continue
            conn = clients[(entry["ownerId"], entry["groupId"])]
            store = stores[(entry["ownerId"], entry["groupId"])]
            data = verify_backup(directory, entry["replacement"]) if entry.get("replacement") else content[entry["annotationId"]]
            file_id = entry["fileId"]
            if entry["action"] == "rewrite-snapshot":
                file_id = _replace_file(conn, entry, data)
                outcome["snapshots"] += 1
            replacement = {"fileId": file_id, "sha256": sha256(data), "size": len(data)}
            if hasattr(store, "store_blob"):
                replacement["blob"] = store.store_blob(data, entry["name"])
            replacements[str(entry["annotationId"])] = replacement
        for entry in report["files"]:
            if entry["namespace"] != SYNC_SCHEMA:
                continue
            before = json.loads(content[entry["annotationId"]])
            after = migrate_item_manifest(before, replacements)
            if after != before:
                _replace_file(clients[(entry["ownerId"], entry["groupId"])], entry, canonical(after))
                outcome["manifests"] += 1
        for entry in report["files"]:
            if entry["namespace"] != STATE_NAMESPACE:
                continue
            before = content[entry["annotationId"]]
            after = migrate_state_record(before, entry, replacements)
            if after != before:
                _replace_file(clients[(entry["ownerId"], entry["groupId"])], entry, after)
                outcome["manifests"] += 1
        _apply_durable(report, directory, replacements, stores, outcome)
        for entry in report["files"]:
            if entry["action"] == "delete":
                conn = clients[(entry["ownerId"], entry["groupId"])]
                conn.deleteObjects("Annotation", [entry["annotationId"]], wait=True)
                outcome["annotations"] += 1
        removable = {e["annotationId"] for e in report["files"] if e["action"] == "delete"} | {e["annotationId"] for e in report["markers"]}
        children = set()
        for parent in sorted(report["parents"], key=lambda item: item["objectType"] == "Project"):
            if not exclusive_settings_parent(parent, removable, children):
                continue
            conn = clients[(parent["ownerId"], parent["groupId"])]
            obj = conn.getObject(parent["objectType"], parent["objectId"])
            if obj is None:
                continue
            remaining_annotations = list(obj.listAnnotations())
            if any(int(a.getId()) not in removable for a in remaining_annotations):
                continue
            if list(obj.listChildren()):
                continue
            conn.deleteObjects(parent["objectType"], [parent["objectId"]], wait=True)
            if parent["objectType"] == "Dataset":
                children.add(parent["objectId"])
            outcome["parents"] += 1
        for entry in report["markers"]:
            conn = clients[(entry["ownerId"], entry["groupId"])]
            obj = conn.getObject("MapAnnotation", entry["annotationId"])
            if obj is None:
                continue
            assert_same_identity(identity(obj), entry)
            if [list(pair) for pair in obj.getValue()] != entry["values"]:
                raise ValueError("Managed marker changed during cleanup")
            conn.deleteObjects("Annotation", [entry["annotationId"]], wait=True)
            outcome["annotations"] += 1
        outcome["completed"] = True
    (directory / "applied.json").write_bytes(canonical(outcome))
    return outcome


def _replace_file(conn, entry, data):
    obj = conn.getObject("FileAnnotation", entry["annotationId"])
    assert_same_identity(identity(obj), entry)
    original = conn.createOriginalFileFromFileObj(io.BytesIO(data), "/", entry["name"], len(data), entry["mimetype"])
    obj.setFile(original)
    obj.save()
    if sha256(file_bytes(obj)) != sha256(data):
        raise ValueError("Rewritten Analysis annotation failed readback verification")
    return int(original.getId())


def _apply_durable(report, directory, replacements, stores, outcome):
    """Remove retired live indexes; preserve immutable OMERO import sources."""
    retired_hashes = {e["sha256"] for e in report["files"] if e["action"] == "delete"}
    retained_hashes, old_snapshot_hashes = set(), set()
    for entry in report["files"] + report["durable"]:
        if entry.get("namespace") != SYNC_SCHEMA and (entry.get("browse") or not entry.get("path", "").endswith(".json")):
            continue
        try:
            value = json.loads(verify_backup(directory, entry))
        except (ValueError, UnicodeError):
            continue
        for item in value.get("items", []):
            digest = item.get("sha256") or (item.get("blob") or {}).get("sha256")
            if item.get("kind") == "workspace-snapshot":
                old_snapshot_hashes.add(digest)
            elif item.get("kind") not in RETIRED_KINDS:
                retained_hashes.add(digest)
            elif digest:
                retired_hashes.add(digest)
    snapshot_bytes = {}
    for entry in report["files"]:
        if entry.get("replacement"):
            snapshot_bytes[entry["sha256"]] = verify_backup(directory, entry["replacement"])
    removed_browse = set()
    for entry in report["durable"]:
        if not entry.get("browse"):
            continue
        path = checked_path(entry["root"], entry["path"])
        if entry["sha256"] in retained_hashes:
            continue
        if entry["sha256"] in old_snapshot_hashes and entry["sha256"] not in snapshot_bytes:
            snapshot_bytes[entry["sha256"]] = migrate_workspace_archive(verify_backup(directory, entry))
        if entry["sha256"] in snapshot_bytes:
            data = snapshot_bytes[entry["sha256"]]
            if sha256(data) != entry["sha256"]:
                temporary = path.with_name(path.name + ".retirement.tmp")
                with temporary.open("xb") as output:
                    output.write(data)
                temporary.replace(path)
                outcome["durable"] += 1
        elif entry["sha256"] in retired_hashes:
            path.unlink()
            removed_browse.add((entry["root"], entry["path"]))
            outcome["durable"] += 1
    for entry in report["durable"]:
        if entry.get("browse"):
            continue
        path = checked_path(entry["root"], entry["path"])
        before = json.loads(verify_backup(directory, entry))
        after = before
        schema = before.get("schema")
        if schema == SETTINGS_SCHEMA:
            path.unlink()
            outcome["durable"] += 1
            continue
        if schema in {SYNC_SCHEMA, STORAGE_SCHEMA}:
            after = migrate_item_manifest(before, replacements)
        elif schema == "nl.bioimaging.analysis.storage.pending.v1":
            after = migrate_item_manifest({**before, "schema": STORAGE_SCHEMA}, replacements)
            after["schema"] = schema
        elif path.name == "browse.json" and isinstance(before.get("files"), list):
            after = {**before, "files": [f for f in before["files"] if (entry["root"], f) not in removed_browse]}
        if after != before:
            temporary = path.with_name(path.name + ".retirement.tmp")
            if temporary.exists():
                raise ValueError("A previous retirement write needs review")
            temporary.write_bytes(canonical(after))
            temporary.replace(path)
            outcome["durable"] += 1
