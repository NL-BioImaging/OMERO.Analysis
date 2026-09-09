"""Recovery bytes require current source, group, linkage and integrity."""
import hashlib
from types import SimpleNamespace as NS

import pytest

from omero_analysis import workspace_results as results, workspace_sync as sync
from omero_analysis.errors import AttachmentNotFound, PermissionDenied, UnsupportedMedia


@pytest.fixture
def payload(monkeypatch, tmp_path):
    content = b"value\n42\n"
    (tmp_path / "blobs").mkdir()
    (tmp_path / "blobs/result.csv").write_bytes(content)
    source = NS(getId=lambda: 1, OMERO_CLASS="Screen", group=4)
    dataset = NS(getId=lambda: 2)
    asset = NS(group=4, getFile=lambda: NS(getId=lambda: 4), getParentLinks=lambda kind: [NS(getParent=lambda: dataset)] if kind == "Dataset" else [])
    conn = NS(getObject=lambda *args: asset)
    state = {"state": "active"}
    storage = NS(analysis_root=tmp_path, user_root=tmp_path, _ensure_inside=lambda path: path)
    item = {"key": "result", "kind": "result", "size": len(content),
            "sha256": hashlib.sha256(content).hexdigest(),
            "remote": {"object_type": "Annotation", "object_id": 3},
            "storage": {"blob": {"relativePath": "blobs/result.csv"}}}
    monkeypatch.setattr(results, "state_for", lambda *args: (storage, state))
    monkeypatch.setattr(results, "object_group_id", lambda obj: obj.group)
    monkeypatch.setattr(sync, "_managed_project", lambda *args: None)
    monkeypatch.setattr(sync, "_managed_dataset", lambda *args: dataset)
    monkeypatch.setattr(sync, "_marker", lambda *args: (None, {"source_object_id": 1, "source_object_type": "Screen"}))
    monkeypatch.setattr(sync, "_read_manifest", lambda *args: (None, {"items": [item]}))
    return NS(conn=conn, source=source, asset=asset, state=state, item=item, path=tmp_path / "blobs/result.csv", content=content)


def test_exact_recovery_bytes(payload):
    item, handle, chunks = results.result_payload(payload.conn, payload.source, "one", "result")
    with handle:
        assert handle.read() == payload.content
    assert chunks is None
    assert item["sha256"] == hashlib.sha256(payload.content).hexdigest()


@pytest.mark.parametrize("failure", ["source", "group", "unlink", "purged", "checksum", "size", "original-file", "storage-scope"])
def test_recovery_rechecks_access_and_integrity(payload, failure):
    error = AttachmentNotFound
    if failure == "source":
        payload.source.OMERO_CLASS = "Dataset"
        error = PermissionDenied
    elif failure == "group":
        payload.asset.group = 5
    elif failure == "unlink":
        payload.asset.getParentLinks = lambda kind: []
    elif failure == "purged":
        payload.state["state"] = "purged"
    elif failure == "checksum":
        payload.path.write_bytes(b"value\n43\n")
        error = UnsupportedMedia
    elif failure == "original-file":
        payload.conn.getObject = lambda kind, identifier: None if kind == "OriginalFile" else payload.asset
    elif failure == "storage-scope":
        payload.item["storage"]["blob"]["relativePath"] = "settings.json"
        error = PermissionDenied
    else:
        payload.item["size"] += 1
        error = UnsupportedMedia
    with pytest.raises(error):
        results.result_payload(payload.conn, payload.source, "one", "result")
