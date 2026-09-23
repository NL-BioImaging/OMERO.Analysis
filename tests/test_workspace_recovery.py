from datetime import datetime, timedelta, timezone
from types import SimpleNamespace

from omero_analysis.workspace_sync import _journal_event
from omero_analysis.inplace_storage import AnalysisStorage
from .test_inplace_storage import ready_capability


def test_missing_tracking_row_expires_but_active_upload_does_not():
    event = {"state": "pending", "exists": False}
    now = datetime.now(timezone.utc)
    assert _journal_event({"createdAt": now.isoformat()}, event)["state"] == "pending"
    stale = {"createdAt": (now - timedelta(days=1)).isoformat()}
    assert _journal_event(stale, event)["state"] == "timeout"


def test_image_recovers_lost_completion_event(monkeypatch):
    monkeypatch.setattr("omero_analysis.workspace_sync._importer_image",
                        lambda dataset, order: SimpleNamespace(getId=lambda: 42))
    result = _journal_event({"orderUuid": "order"}, {"state": "timeout"}, object())
    assert result["state"] == "imported"
    assert result["recoveredImageId"] == 42


def test_completed_tracking_without_image_eventually_fails(monkeypatch):
    monkeypatch.setattr("omero_analysis.workspace_sync._importer_image", lambda *args: None)
    result = _journal_event({"createdAt": "2020-01-01T00:00:00Z"}, {"state": "imported"}, object())
    assert result["state"] == "timeout"


def test_browsing_tree_rename_preserves_canonical_bytes(tmp_path):
    storage = AnalysisStorage(ready_capability(tmp_path), 7)
    blob = storage.store_blob(b"plot", "plot.png")
    manifest = {"workspaceId": "one", "datasetId": 42, "datasetName": "Screen-1 - Analysis 1",
                "items": [{"kind": "png-image", "name": "plot.png", "blob": blob}]}
    storage.publish_workspace(manifest, "alice")
    old = tmp_path / '.analysis/alice--7/+AnalysisWorkspaces/Screen-1 - Analysis 1--42/Results/plot.png'
    assert old.read_bytes() == b"plot"
    old.write_bytes(b"local edit")
    from pathlib import Path
    assert Path(blob['path']).read_bytes() == b"plot"
    storage.publish_workspace({**manifest, "datasetName": "Screen-1 - Renamed"}, "alice")
    assert not old.exists()
    assert (tmp_path / '.analysis/alice--7/+AnalysisWorkspaces/Screen-1 - Renamed--42/Results/plot.png').read_bytes() == b"plot"
    storage.remove_workspace_view('one')
    assert not (tmp_path / '.analysis/alice--7/+AnalysisWorkspaces').exists()
    assert Path(blob['path']).read_bytes() == b"plot"


def test_corrupt_manifest_prevents_garbage_collection(tmp_path):
    from pathlib import Path
    storage = AnalysisStorage(ready_capability(tmp_path), 7)
    blob = storage.store_blob(b"keep", "data.csv")
    storage.atomic_write(storage.user_root / 'workspaces/one/manifest.json', b'{broken')
    assert storage.garbage_collect() == 0
    assert Path(blob['path']).exists()


def test_sync_lock_is_reentrant_but_excludes_other_threads(tmp_path):
    from concurrent.futures import ThreadPoolExecutor
    from omero_analysis.sync_lock import storage_lock
    from omero_analysis.errors import AnalysisError
    import pytest
    storage = AnalysisStorage(ready_capability(tmp_path), 7)
    def attempt():
        with storage_lock(storage):
            return True
    with storage_lock(storage):
        with storage_lock(storage):
            with ThreadPoolExecutor() as pool:
                with pytest.raises(AnalysisError, match='already|active'):
                    pool.submit(attempt).result()
    assert attempt()
