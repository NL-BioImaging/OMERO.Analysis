import hashlib
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace

import pytest

from omero_analysis import inplace_storage as storage


def ready_capability(root):
    return storage.StorageCapability(
        mode="inplace", ready=True, failure_code="ready", detail="ok",
        omero_biomero_version="1.6.0", biomero_importer_version="1.4.1",
        mapped_root=str(root), group_name="researchers",
    )


def test_disabled_capability_is_stable(monkeypatch):
    monkeypatch.delenv("IMPORTER_ENABLED", raising=False)
    value = storage.storage_capability(1)
    assert value.mode == "legacy"
    assert value.failure_code == "importer_disabled"


def test_unsupported_versions_do_not_import_optional_apis(monkeypatch, tmp_path):
    monkeypatch.setenv("IMPORTER_ENABLED", "true")
    monkeypatch.setenv("IMPORT_MOUNT_PATH", str(tmp_path))
    monkeypatch.setenv("INGEST_TRACKING_DB_URL", "sqlite:///tracker.db")
    monkeypatch.setattr(storage, "_version", lambda name: "2.0.0")
    monkeypatch.setattr(storage, "_dependencies", lambda: pytest.fail("must not import"))
    value = storage.storage_capability(1)
    assert value.failure_code == "dependency_version_unsupported"


def test_explicit_mapping_and_contract(monkeypatch, tmp_path):
    monkeypatch.setattr(storage, "_TRACKER_INITIALIZED_DB_URL", None)
    monkeypatch.setenv("IMPORTER_ENABLED", "true")
    monkeypatch.setenv("IMPORT_MOUNT_PATH", str(tmp_path))
    monkeypatch.setenv("INGEST_TRACKING_DB_URL", "sqlite:///tracker.db")
    monkeypatch.setattr(storage, "_version", lambda name: "1.6.0" if name == "omero-biomero" else "1.4.1")
    tracker = SimpleNamespace(Session=lambda: SimpleNamespace(
        query=lambda model: SimpleNamespace(limit=lambda count: SimpleNamespace(all=lambda: [])),
        close=lambda: None,
    ))
    monkeypatch.setattr(storage, "_dependencies", lambda: {
        "get_all_group_mappings": lambda **kwargs: {"7": {"folder": "lab", "groupName": "Lab"}},
        "get_group_folder_path": lambda group_id, **kwargs: str(tmp_path / "lab"),
        "initialize_ingest_tracker": lambda config: config["ingest_tracking_db"] == "sqlite:///tracker.db",
        "get_ingest_tracker": lambda: tracker,
        "IngestionTracking": object,
    })
    (tmp_path / "lab").mkdir()
    value = storage.storage_capability(7)
    assert value.ready and value.group_name == "Lab"
    assert value.mapped_root == str((tmp_path / "lab").resolve())


def test_missing_explicit_mapping_uses_legacy(monkeypatch, tmp_path):
    monkeypatch.setenv("IMPORTER_ENABLED", "true")
    monkeypatch.setenv("IMPORT_MOUNT_PATH", str(tmp_path))
    monkeypatch.setenv("INGEST_TRACKING_DB_URL", "sqlite:///tracker.db")
    monkeypatch.setattr(storage, "_version", lambda name: "1.6.0" if name == "omero-biomero" else "1.4.1")
    monkeypatch.setattr(storage, "_dependencies", lambda: {
        "get_all_group_mappings": lambda **kwargs: {},
        "get_group_folder_path": lambda *args, **kwargs: None,
    })
    assert storage.storage_capability(7).failure_code == "group_mapping_missing"


def test_content_addressed_atomic_storage_and_gc(tmp_path):
    root = tmp_path / "group"
    root.mkdir()
    store = storage.AnalysisStorage(ready_capability(root), 42)
    data = b"plot bytes"
    digest = hashlib.sha256(data).hexdigest()
    blob = store.store_blob(data, "plot.png", digest)
    assert Path(blob["path"]).read_bytes() == data
    manifest = {
        "items": [{"blob": blob}], "workspaceId": "workspace-1",
    }
    store.write_json(store.workspace_manifest_path("workspace-1"), manifest)
    assert store.read_json(store.workspace_manifest_path("workspace-1")) == manifest
    assert store.garbage_collect() == 0
    store.delete_json(store.workspace_manifest_path("workspace-1"))
    assert store.garbage_collect() == 1


def test_storage_rejects_traversal_hash_and_symlink(tmp_path):
    root = tmp_path / "group"
    root.mkdir()
    store = storage.AnalysisStorage(ready_capability(root), 42)
    with pytest.raises(ValueError, match="filename"):
        store.store_blob(b"x", "../escape")
    with pytest.raises(ValueError, match="SHA-256"):
        store.store_blob(b"x", "x.txt", "0" * 64)
    blob = store.store_blob(b"valid", "Analysis result — plate 1.csv")
    assert Path(blob["path"]).name == "Analysis result — plate 1.csv"
    symlink = store.user_root / "workspaces"
    outside = tmp_path / "outside"
    outside.mkdir()
    try:
        symlink.symlink_to(outside, target_is_directory=True)
    except OSError:
        pytest.skip("Symlink creation is not permitted on this Windows host")
    with pytest.raises(ValueError):
        store.write_json(Path("workspaces") / "x" / "manifest.json", {})


def test_order_is_deterministic_and_has_exact_contract(monkeypatch, tmp_path):
    captured = []
    monkeypatch.setattr(storage, "_dependencies", lambda: {
        "log_ingestion_step": lambda order, stage: captured.append((order, stage)),
        "STAGE_NEW_ORDER": "Import Pending",
    })
    png = tmp_path / "plot.png"
    png.write_bytes(b"png")
    order_uuid = storage.deterministic_order_uuid(1, "ws", "plot", "a" * 64)
    assert order_uuid == storage.deterministic_order_uuid(1, "ws", "plot", "a" * 64)
    order = storage.submit_png_order(
        ready_capability(tmp_path), order_uuid, "alice", 123, "result:plot", png, "plot.png"
    )
    assert set(order) == {
        "Group", "Username", "DestinationID", "DestinationType", "UUID",
        "Files", "FileNames", "Description",
    }
    assert order["DestinationID"] == 123
    assert captured == [(order, "Import Pending")]


def test_retry_order_uuid_is_stable_and_distinct():
    base = storage.deterministic_order_uuid(1, "ws", "plot", "a" * 64)
    first = storage.retry_order_uuid(base, 1)
    assert first == storage.retry_order_uuid(base, 1)
    assert first != base
    assert storage.retry_order_uuid(base, 2) != first


def test_latest_event_uses_terminal_stages(monkeypatch):
    event = SimpleNamespace(id=2, uuid="order", stage="Import Completed", timestamp=None)
    query = SimpleNamespace(
        filter=lambda *args: query,
        order_by=lambda *args: query,
        all=lambda: [event],
    )
    session = SimpleNamespace(query=lambda model: query, close=lambda: None)
    model = SimpleNamespace(
        uuid=SimpleNamespace(in_=lambda values: values, asc=lambda: None),
        stage=SimpleNamespace(in_=lambda values: values),
        timestamp=SimpleNamespace(desc=lambda: None),
        id=SimpleNamespace(desc=lambda: None),
    )
    monkeypatch.setattr(storage, "_dependencies", lambda: {
        "get_ingest_tracker": lambda: SimpleNamespace(Session=lambda: session),
        "IngestionTracking": model,
        "STAGE_IMPORTED": "Import Completed",
        "STAGE_INGEST_FAILED": "Import Failed",
    })
    assert storage.latest_ingest_event("order")["state"] == "imported"
    assert storage.latest_ingest_event("order")["hasTerminalEvent"] is True


def test_old_non_terminal_event_times_out(monkeypatch):
    event = SimpleNamespace(
        id=2, uuid="order", stage="Import Started",
        timestamp=datetime.now(timezone.utc) - timedelta(seconds=300),
    )
    query = SimpleNamespace(
        filter=lambda *args: query,
        order_by=lambda *args: query,
        all=lambda: [event],
    )
    session = SimpleNamespace(query=lambda model: query, close=lambda: None)
    model = SimpleNamespace(
        uuid=SimpleNamespace(in_=lambda values: values, asc=lambda: None),
        stage=SimpleNamespace(in_=lambda values: values),
        timestamp=SimpleNamespace(desc=lambda: None),
        id=SimpleNamespace(desc=lambda: None),
    )
    monkeypatch.setattr(storage, "_dependencies", lambda: {
        "get_ingest_tracker": lambda: SimpleNamespace(Session=lambda: session),
        "IngestionTracking": model,
        "STAGE_IMPORTED": "Import Completed",
        "STAGE_INGEST_FAILED": "Import Failed",
    })
    assert storage.latest_ingest_event("order")["state"] == "timeout"


def test_tracker_initialization_is_cached_per_process(monkeypatch, tmp_path):
    monkeypatch.setattr(storage, "_TRACKER_INITIALIZED_DB_URL", None)
    monkeypatch.setenv("IMPORTER_ENABLED", "true")
    monkeypatch.setenv("IMPORT_MOUNT_PATH", str(tmp_path))
    monkeypatch.setenv("INGEST_TRACKING_DB_URL", "sqlite:///cached-tracker.db")
    monkeypatch.setattr(
        storage, "_version",
        lambda name: "1.6.0" if name == "omero-biomero" else "1.4.1",
    )
    mapped = tmp_path / "lab"
    mapped.mkdir()
    initialized = []
    tracker = SimpleNamespace(Session=lambda: SimpleNamespace(
        query=lambda model: SimpleNamespace(limit=lambda count: SimpleNamespace(all=lambda: [])),
        close=lambda: None,
    ))
    monkeypatch.setattr(storage, "_dependencies", lambda: {
        "get_all_group_mappings": lambda **kwargs: {"7": {"folder": "lab", "groupName": "Lab"}},
        "get_group_folder_path": lambda group_id, **kwargs: str(mapped),
        "initialize_ingest_tracker": lambda config: initialized.append(config) or True,
        "get_ingest_tracker": lambda: tracker,
        "IngestionTracking": object,
    })

    assert storage.storage_capability(7).ready
    assert storage.storage_capability(7).ready
    assert initialized == [{"ingest_tracking_db": "sqlite:///cached-tracker.db"}]
