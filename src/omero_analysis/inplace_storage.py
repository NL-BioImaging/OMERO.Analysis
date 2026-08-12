"""Optional BIOMERO importer integration and durable ``.analysis`` storage.

The imports in this module are deliberately lazy.  OMERO.Analysis remains usable
without OMERO.biomero or BIOMERO.importer; callers receive a stable capability
result and continue through the existing OMERO FileAnnotation implementation.
"""

from __future__ import annotations

import hashlib
import inspect
import json
import os
import tempfile
import threading
import uuid
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from importlib import import_module, metadata
from pathlib import Path

from packaging.specifiers import SpecifierSet
from packaging.version import InvalidVersion, Version


OMERO_BIOMERO_RANGE = SpecifierSet(">=1.6,<2")
IMPORTER_RANGE = SpecifierSet(">=1.4,<2")
ORDER_NAMESPACE = uuid.UUID("c82d8c66-7cf5-4db0-a445-a54f53b49008")
_TRACKER_INITIALIZATION_LOCK = threading.Lock()
_TRACKER_INITIALIZED_DB_URL = None


@dataclass(frozen=True)
class StorageCapability:
    mode: str = "legacy"
    ready: bool = False
    failure_code: str = "importer_disabled"
    detail: str = "Importer-backed storage is disabled"
    omero_biomero_version: str | None = None
    biomero_importer_version: str | None = None
    mapped_root: str | None = None
    group_name: str | None = None

    def public(self):
        value = asdict(self)
        return {
            "mode": value.pop("mode"),
            "ready": value.pop("ready"),
            "failureCode": value.pop("failure_code"),
            "detail": value.pop("detail"),
            "dependencyVersions": {
                "omero-biomero": value.pop("omero_biomero_version"),
                "biomero-importer": value.pop("biomero_importer_version"),
            },
            "mappedRoot": value.pop("mapped_root"),
            "groupName": value.pop("group_name"),
        }


def _enabled(value):
    return str(value or "").strip().lower() in {"1", "true", "yes", "on"}


def _version(distribution):
    try:
        return metadata.version(distribution)
    except metadata.PackageNotFoundError:
        return None


def _signature_accepts(function, required):
    try:
        parameters = inspect.signature(function).parameters
    except (TypeError, ValueError):
        return False
    return all(name in parameters for name in required)


def _dependencies():
    mapping = import_module("omero_biomero.utils")
    tracker = import_module("biomero_importer.utils.ingest_tracker")
    symbols = {
        "get_all_group_mappings": mapping.get_all_group_mappings,
        "get_group_folder_path": mapping.get_group_folder_path,
        "initialize_ingest_tracker": tracker.initialize_ingest_tracker,
        "log_ingestion_step": tracker.log_ingestion_step,
        "get_ingest_tracker": tracker.get_ingest_tracker,
        "STAGE_NEW_ORDER": tracker.STAGE_NEW_ORDER,
        "STAGE_IMPORTED": tracker.STAGE_IMPORTED,
        "STAGE_INGEST_FAILED": tracker.STAGE_INGEST_FAILED,
        "IngestionTracking": tracker.IngestionTracking,
    }
    signatures = {
        "get_all_group_mappings": ("config_file_path", "group_mappings_file_path"),
        "get_group_folder_path": ("group_id", "base_dir", "group_mappings_file_path"),
        "initialize_ingest_tracker": ("config",),
        "log_ingestion_step": ("order_info", "stage"),
    }
    if any(not _signature_accepts(symbols[name], arguments)
           for name, arguments in signatures.items()):
        raise TypeError("A required integration function has an incompatible signature")
    for name in ("STAGE_NEW_ORDER", "STAGE_IMPORTED", "STAGE_INGEST_FAILED"):
        if not isinstance(symbols[name], str) or not symbols[name]:
            raise TypeError(f"{name} must be a non-empty string")
    return symbols


def _ensure_tracker_initialized(symbols, db_url):
    """Initialize the process-wide importer tracker once per database URL."""
    global _TRACKER_INITIALIZED_DB_URL

    if _TRACKER_INITIALIZED_DB_URL == db_url:
        return symbols["get_ingest_tracker"]()
    with _TRACKER_INITIALIZATION_LOCK:
        if _TRACKER_INITIALIZED_DB_URL != db_url:
            initialized = symbols["initialize_ingest_tracker"](
                {"ingest_tracking_db": db_url}
            )
            if initialized is False:
                raise RuntimeError("The ingest tracker could not be initialized")
            _TRACKER_INITIALIZED_DB_URL = db_url
    return symbols["get_ingest_tracker"]()


def storage_capability(group_id=None, *, initialize=True):
    """Return guarded importer capability for an active OMERO group."""
    if not _enabled(os.environ.get("IMPORTER_ENABLED")):
        return StorageCapability()
    mount_text = os.environ.get("IMPORT_MOUNT_PATH", "").strip()
    if not mount_text:
        return StorageCapability(failure_code="mount_missing", detail="IMPORT_MOUNT_PATH is not set")
    mount = Path(mount_text).resolve()
    if not mount.is_dir():
        return StorageCapability(failure_code="mount_missing", detail="IMPORT_MOUNT_PATH does not exist")
    if not os.access(mount, os.W_OK):
        return StorageCapability(failure_code="mount_not_writable", detail="IMPORT_MOUNT_PATH is not writable")
    db_url = os.environ.get("INGEST_TRACKING_DB_URL", "").strip()
    if not db_url:
        return StorageCapability(failure_code="tracking_db_missing", detail="INGEST_TRACKING_DB_URL is not set")
    ob_version = _version("omero-biomero")
    importer_version = _version("biomero-importer")
    if not ob_version or not importer_version:
        return StorageCapability(
            failure_code="dependency_missing", detail="Optional BIOMERO packages are not installed",
            omero_biomero_version=ob_version, biomero_importer_version=importer_version,
        )
    try:
        versions_ok = (
            Version(ob_version) in OMERO_BIOMERO_RANGE
            and Version(importer_version) in IMPORTER_RANGE
        )
    except InvalidVersion:
        versions_ok = False
    if not versions_ok:
        return StorageCapability(
            failure_code="dependency_version_unsupported",
            detail="Installed BIOMERO package versions are outside the supported ranges",
            omero_biomero_version=ob_version, biomero_importer_version=importer_version,
        )
    try:
        symbols = _dependencies()
    except (ImportError, AttributeError, TypeError) as exc:
        return StorageCapability(
            failure_code="dependency_api_incompatible", detail=str(exc),
            omero_biomero_version=ob_version, biomero_importer_version=importer_version,
        )
    if group_id is None:
        return StorageCapability(
            failure_code="group_required", detail="An active OMERO group is required",
            omero_biomero_version=ob_version, biomero_importer_version=importer_version,
        )
    config_path = os.environ.get("OMERO_BIOMERO_CONFIG_FILE") or None
    mappings_path = os.environ.get("OMERO_BIOMERO_GROUP_MAPPINGS_FILE") or None
    try:
        mappings = symbols["get_all_group_mappings"](
            config_file_path=config_path, group_mappings_file_path=mappings_path
        )
        mapping = mappings.get(str(group_id)) or mappings.get(group_id)
        if not isinstance(mapping, dict):
            raise KeyError(group_id)
        group_name = str(mapping.get("groupName") or mapping.get("group_name") or "").strip()
        if not group_name:
            raise ValueError("The Group Folder Mapping has no groupName")
        resolved = symbols["get_group_folder_path"](
            group_id, base_dir=str(mount), group_mappings_file_path=mappings_path
        )
        if not resolved:
            raise KeyError(group_id)
        mapped = Path(resolved).resolve()
        mapped.relative_to(mount)
    except KeyError:
        return StorageCapability(
            failure_code="group_mapping_missing", detail="The active group has no explicit Group Folder Mapping",
            omero_biomero_version=ob_version, biomero_importer_version=importer_version,
        )
    except (OSError, RuntimeError, ValueError) as exc:
        return StorageCapability(
            failure_code="group_mapping_unsafe", detail=str(exc),
            omero_biomero_version=ob_version, biomero_importer_version=importer_version,
        )
    if not mapped.is_dir() or not os.access(mapped, os.W_OK):
        return StorageCapability(
            failure_code="mapped_root_not_writable", detail="The mapped group folder is missing or not writable",
            omero_biomero_version=ob_version, biomero_importer_version=importer_version,
            mapped_root=str(mapped), group_name=group_name,
        )
    analysis_root = mapped / ".analysis"
    try:
        if analysis_root.exists() and analysis_root.is_symlink():
            raise ValueError("The .analysis root must not be a symlink")
        analysis_root.mkdir(exist_ok=True)
        analysis_root.resolve().relative_to(mapped)
        fd, probe = tempfile.mkstemp(prefix=".capability-", dir=str(analysis_root))
        try:
            with os.fdopen(fd, "wb") as stream:
                stream.write(b"ok")
                stream.flush()
                os.fsync(stream.fileno())
            final_probe = analysis_root / (Path(probe).name + ".atomic")
            os.replace(probe, final_probe)
            final_probe.unlink()
        finally:
            if os.path.exists(probe):
                os.unlink(probe)
    except (OSError, ValueError) as exc:
        return StorageCapability(
            failure_code="analysis_root_not_writable", detail=str(exc),
            omero_biomero_version=ob_version, biomero_importer_version=importer_version,
            mapped_root=str(mapped), group_name=group_name,
        )
    if initialize:
        try:
            tracker = _ensure_tracker_initialized(symbols, db_url)
            if tracker is None or not callable(getattr(tracker, "Session", None)):
                raise RuntimeError("The ingest tracker did not provide Session")
            session = tracker.Session()
            try:
                session.query(symbols["IngestionTracking"]).limit(1).all()
            finally:
                session.close()
        except Exception as exc:
            return StorageCapability(
                failure_code="tracking_db_unavailable", detail=str(exc),
                omero_biomero_version=ob_version, biomero_importer_version=importer_version,
                mapped_root=str(mapped), group_name=group_name,
            )
    return StorageCapability(
        mode="inplace", ready=True, failure_code="ready", detail="Importer-backed storage is available",
        omero_biomero_version=ob_version, biomero_importer_version=importer_version,
        mapped_root=str(mapped), group_name=group_name,
    )


def _safe_name(name):
    raw = str(name or "")
    if (
        raw in {"", ".", ".."}
        or "/" in raw
        or "\\" in raw
        or any(ord(character) < 32 for character in raw)
        or any(character in '<>:"|?*' for character in raw)
        or len(raw.encode("utf-8")) > 255
    ):
        raise ValueError("Unsafe .analysis filename")
    return raw


class AnalysisStorage:
    def __init__(self, capability, user_id):
        if not capability.ready or capability.mode != "inplace":
            raise ValueError("Importer-backed storage is not ready")
        self.capability = capability
        self.group_root = Path(capability.mapped_root).resolve()
        self.analysis_root = self.group_root / ".analysis"
        self.user_root = self.analysis_root / "users" / str(int(user_id))
        current = self.group_root
        for component in (".analysis", "users", str(int(user_id))):
            current = current / component
            if current.exists() and current.is_symlink():
                raise ValueError("Symlinks are not allowed in .analysis storage")
            current.mkdir(exist_ok=True)
            current.resolve().relative_to(self.group_root)

    def _ensure_inside(self, path):
        target = Path(path)
        relative = target.relative_to(self.user_root)
        # Existing parent resolution catches symlinks without requiring the leaf to exist.
        if target != self.user_root:
            target.parent.resolve().relative_to(self.user_root.resolve())
        if target.exists() and target.is_symlink():
            raise ValueError("Symlinks are not allowed in .analysis storage")
        current = self.user_root
        for component in relative.parts:
            current = current / component
            if current.exists() and current.is_symlink():
                raise ValueError("Symlinks are not allowed in .analysis storage")
        return target

    def _ensure_directory(self, path):
        path = Path(path)
        self._ensure_inside(path)
        path.mkdir(parents=True, exist_ok=True)
        resolved = path.resolve()
        if path.is_symlink():
            raise ValueError("Symlinks are not allowed in .analysis storage")
        resolved.relative_to(self.user_root.resolve())
        return path

    def atomic_write(self, path, data):
        path = self._ensure_inside(path)
        self._ensure_directory(path.parent)
        fd, temporary = tempfile.mkstemp(prefix=f".{path.name}.", dir=str(path.parent))
        try:
            with os.fdopen(fd, "wb") as stream:
                stream.write(data)
                stream.flush()
                os.fsync(stream.fileno())
            # OMERO.Web, BIOMERO.importer and OMERO Server deliberately run as
            # different UIDs.  In-place ``ln_s`` import therefore requires a
            # world-readable source file on their shared mount.
            os.chmod(temporary, 0o644)
            os.replace(temporary, path)
        finally:
            if os.path.exists(temporary):
                os.unlink(temporary)
        return path

    def store_blob(self, data, filename, expected_sha256=None):
        digest = hashlib.sha256(data).hexdigest()
        if expected_sha256 and digest != expected_sha256:
            raise ValueError("Blob SHA-256 does not match the inventory")
        filename = _safe_name(filename)
        target = self.user_root / "blobs" / "sha256" / digest[:2] / digest / filename
        if target.exists():
            if target.is_symlink() or hashlib.sha256(target.read_bytes()).hexdigest() != digest:
                raise ValueError("Existing .analysis blob is unsafe or corrupt")
        else:
            self.atomic_write(target, data)
        return {
            "sha256": digest, "size": len(data), "filename": filename,
            "path": str(target), "relativePath": target.relative_to(self.analysis_root).as_posix(),
        }

    def write_json(self, relative, value):
        data = (json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n").encode()
        return self.atomic_write(self.user_root / relative, data)

    def read_json(self, relative):
        path = self._ensure_inside(self.user_root / relative)
        if not path.is_file() or path.is_symlink():
            return None
        return json.loads(path.read_text(encoding="utf-8"))

    def delete_json(self, relative):
        path = self._ensure_inside(self.user_root / relative)
        if path.is_file() and not path.is_symlink():
            path.unlink()

    def workspace_manifest_path(self, workspace_id):
        return Path("workspaces") / _safe_name(workspace_id) / "manifest.json"

    def pending_path(self, order_uuid):
        return Path("pending") / f"{uuid.UUID(str(order_uuid))}.json"

    def garbage_collect(self):
        referenced = set()
        for folder in (self.user_root / "workspaces", self.user_root / "settings", self.user_root / "pending"):
            if not folder.exists():
                continue
            for manifest in folder.rglob("*.json"):
                if manifest.is_symlink():
                    continue
                try:
                    value = json.loads(manifest.read_text(encoding="utf-8"))
                except (OSError, ValueError):
                    continue
                for item in value.get("items", []):
                    blob = item.get("blob") or {}
                    if blob.get("relativePath"):
                        referenced.add(blob["relativePath"])
        deleted = 0
        blob_root = self.user_root / "blobs"
        if blob_root.exists():
            for blob in blob_root.rglob("*"):
                if blob.is_file() and not blob.is_symlink():
                    relative = blob.relative_to(self.analysis_root).as_posix()
                    if relative not in referenced:
                        blob.unlink()
                        deleted += 1
        return deleted


def storage_for(group_id, user_id, *, initialize=True):
    capability = storage_capability(group_id, initialize=initialize)
    if not capability.ready:
        return capability, None
    try:
        storage = AnalysisStorage(capability, user_id)
        probe = storage.user_root / ".write-probe"
        storage.atomic_write(probe, b"ok")
        probe.unlink()
        return capability, storage
    except (OSError, ValueError) as exc:
        return StorageCapability(
            failure_code="analysis_root_not_writable", detail=str(exc),
            omero_biomero_version=capability.omero_biomero_version,
            biomero_importer_version=capability.biomero_importer_version,
            mapped_root=capability.mapped_root, group_name=capability.group_name,
        ), None


def deterministic_order_uuid(user_id, workspace_id, item_key, sha256):
    return str(uuid.uuid5(ORDER_NAMESPACE, f"{int(user_id)}:{workspace_id}:{item_key}:{sha256}"))


def retry_order_uuid(original_order_uuid, attempt):
    """Return a stable, distinct importer UUID for a failed retry attempt."""
    return str(uuid.uuid5(ORDER_NAMESPACE, f"{uuid.UUID(str(original_order_uuid))}:retry:{int(attempt)}"))


def submit_png_order(capability, order_uuid, username, dataset_id, item_key, path, filename):
    symbols = _dependencies()
    order = {
        "Group": capability.group_name,
        "Username": str(username),
        "DestinationID": int(dataset_id),
        "DestinationType": "Dataset",
        "UUID": str(uuid.UUID(order_uuid)),
        "Files": [str(Path(path).resolve())],
        "FileNames": [_safe_name(filename)],
        "Description": str(item_key),
    }
    symbols["log_ingestion_step"](order, symbols["STAGE_NEW_ORDER"])
    return order


def latest_ingest_event(order_uuid):
    return latest_ingest_events([order_uuid]).get(str(order_uuid), {
        "state": "pending", "stage": None, "exists": False,
        "hasTerminalEvent": False,
    })


def latest_ingest_events(order_uuids):
    """Return latest and terminal state for many importer UUIDs in one query."""
    order_uuids = list(dict.fromkeys(str(value) for value in order_uuids if value))
    if not order_uuids:
        return {}
    symbols = _dependencies()
    tracker = symbols["get_ingest_tracker"]()
    session = tracker.Session()
    try:
        model = symbols["IngestionTracking"]
        events = (
            session.query(model).filter(model.uuid.in_(order_uuids))
            .order_by(model.uuid.asc(), model.timestamp.desc(), model.id.desc()).all()
        )
        terminal_stages = {symbols["STAGE_IMPORTED"], symbols["STAGE_INGEST_FAILED"]}
        terminal_uuids = {str(event.uuid) for event in events if event.stage in terminal_stages}
        latest = {}
        for event in events:
            event_uuid = str(event.uuid)
            if event_uuid in latest:
                continue
            if event.stage == symbols["STAGE_IMPORTED"]:
                state = "imported"
            elif event.stage == symbols["STAGE_INGEST_FAILED"]:
                state = "failed"
            else:
                state = "pending"
                timeout_seconds = max(
                    30, int(os.environ.get("OMERO_ANALYSIS_IMPORT_TIMEOUT_SECONDS", "120"))
                )
                timestamp = event.timestamp
                if timestamp is not None:
                    if timestamp.tzinfo is None:
                        timestamp = timestamp.replace(tzinfo=timezone.utc)
                    if (datetime.now(timezone.utc) - timestamp).total_seconds() > timeout_seconds:
                        state = "timeout"
            latest[event_uuid] = {
                "state": state, "stage": event.stage,
                "timestamp": event.timestamp.isoformat() if event.timestamp else None,
                "exists": True,
                "hasTerminalEvent": event_uuid in terminal_uuids,
            }
        for order_uuid in order_uuids:
            latest.setdefault(order_uuid, {
                "state": "pending", "stage": None, "exists": False,
                "hasTerminalEvent": False,
            })
        return latest
    finally:
        session.close()


def healthcheck():
    """Container health check: validate dependencies, DB and every configured mapping."""
    if not _enabled(os.environ.get("IMPORTER_ENABLED")):
        return True, {"mode": "legacy", "ready": False, "failureCode": "importer_disabled"}
    try:
        symbols = _dependencies()
        mappings = symbols["get_all_group_mappings"](
            config_file_path=os.environ.get("OMERO_BIOMERO_CONFIG_FILE") or None,
            group_mappings_file_path=os.environ.get("OMERO_BIOMERO_GROUP_MAPPINGS_FILE") or None,
        )
    except Exception as exc:
        return False, {"mode": "legacy", "ready": False, "failureCode": "dependency_api_incompatible", "detail": str(exc)}
    if not mappings:
        return False, {"mode": "legacy", "ready": False, "failureCode": "group_mapping_missing"}
    results = {str(key): storage_capability(key).public() for key in mappings}
    return all(value["ready"] for value in results.values()), results


if __name__ == "__main__":  # pragma: no cover - used by Docker health checks
    ok, result = healthcheck()
    print(json.dumps(result, sort_keys=True))
    raise SystemExit(0 if ok else 1)
