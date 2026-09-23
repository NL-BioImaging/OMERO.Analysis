from types import SimpleNamespace

import pytest

from omero_analysis import workspace_lifecycle as lifecycle, workspace_sync as sync
from omero_analysis.errors import AnalysisError
from omero_analysis.inplace_storage import AnalysisStorage
from .test_inplace_storage import ready_capability


@pytest.fixture
def environment(monkeypatch, tmp_path):
    storage = AnalysisStorage(ready_capability(tmp_path), 7)
    monkeypatch.setattr(lifecycle, "storage_for", lambda *a, **k: (None, storage))
    monkeypatch.setattr("omero_analysis.sync_lock.storage_for", lambda *a, **k: (None, storage))
    monkeypatch.setattr(lifecycle, "object_group_id", lambda obj: 4)
    monkeypatch.setattr("omero_analysis.sync_lock.object_group_id", lambda obj: 4)
    monkeypatch.setattr(lifecycle, "user_id", lambda conn: 7)
    monkeypatch.setattr("omero_analysis.sync_lock.user_id", lambda conn: 7)
    monkeypatch.setattr(lifecycle, "require_workspace_access", lambda conn, obj: None)
    monkeypatch.setattr(sync, "_managed_project", lambda *a: object())
    return storage


def test_revision_prevents_resurrection_after_trash_and_restore(environment):
    path = "workspaces/one/lifecycle.json"
    environment.write_json(path, {"state": "trashed", "revision": 1})
    with pytest.raises(AnalysisError, match="Trash"):
        lifecycle.require_active(None, None, {"workspace": {"id": "one"}})
    environment.write_json(path, {"state": "active", "revision": 2})
    with pytest.raises(AnalysisError, match="another tab"):
        lifecycle.require_active(None, None, {"workspace": {"id": "one", "lifecycleRevision": 0}})
    lifecycle.require_active(None, None, {"workspace": {"id": "one", "lifecycleRevision": 2}})


def test_shared_image_protects_its_companion_annotation():
    parent = SimpleNamespace(getId=lambda: 99)
    image = SimpleNamespace(listParents=lambda: [parent])
    assert lifecycle._shared(None, image, "Image", 20, 10, set())
    annotation = SimpleNamespace(getParentLinks=lambda kind: [SimpleNamespace(getParent=lambda: SimpleNamespace(getId=lambda: 20))] if kind == "Image" else [])
    assert lifecycle._shared(None, annotation, "Annotation", 30, 10, set())
    assert not lifecycle._shared(None, annotation, "Annotation", 30, 10, {20})


def test_image_with_unrelated_annotation_is_preserved():
    annotation = SimpleNamespace(getId=lambda: 30, getNs=lambda: "another.application")
    image = SimpleNamespace(listParents=lambda: [SimpleNamespace(getId=lambda: 10)],
                            listAnnotations=lambda: [annotation])
    assert lifecycle._shared(None, image, "Image", 20, 10, set())
    assert not lifecycle._shared(None, image, "Image", 20, 10, set(), {30})


def test_partial_cleanup_journal_retries_typed_targets_without_deleting_active_ref(environment, monkeypatch):
    dataset = SimpleNamespace(getId=lambda: 10)
    asset = SimpleNamespace(getParentLinks=lambda kind: [], listParents=lambda: [])
    conn = SimpleNamespace(getObject=lambda kind, identifier: dataset if kind == "Dataset" else asset)
    monkeypatch.setattr(sync, "_read_manifest", lambda _: (None, {"items": [{"key": "current", "remote": {"object_type": "Image", "object_id": 20}}]}))
    deleted = []
    def delete(conn, kind, identifier):
        if identifier == 30 and not deleted:
            deleted.append("failed")
            raise RuntimeError("network failure")
        deleted.append((kind, identifier))
    monkeypatch.setattr(sync, "_delete", delete)
    lifecycle.cleanup_replaced(conn, None, "one", dataset, [("Annotation", 30), ("Image", 20), ("Annotation", 20)], 1)
    journal = environment.read_json("workspaces/one/pending-cleanup.json")
    # Numeric IDs in different tables are independent. The current Image is protected.
    assert ("Annotation", 20) in deleted and ("Image", 20) not in deleted
    # Retry injects a failure independent of ref ordering.
    monkeypatch.setattr(sync, "_delete", lambda *a: (_ for _ in ()).throw(RuntimeError("denied")))
    lifecycle.cleanup_replaced(conn, None, "one", dataset, [("Annotation", 40)], 2)
    assert environment.read_json("workspaces/one/pending-cleanup.json")["pending"] == [["Annotation", 40]]
    monkeypatch.setattr(sync, "_delete", lambda c, k, i: deleted.append((k, i)))
    lifecycle.cleanup_replaced(conn, None, "one", dataset, [], 2)
    assert environment.read_json("workspaces/one/pending-cleanup.json")["pending"] == []
    assert ("Annotation", 40) in deleted


def test_purge_requires_trash_and_matching_revision(environment):
    with pytest.raises(AnalysisError, match="Trash"):
        lifecycle.change_lifecycle(None, None, "one", "purge", 0)
    with pytest.raises(AnalysisError, match="changed"):
        lifecycle.change_lifecycle(None, None, "one", "trash", 7)


def test_owned_dataset_management_does_not_require_reading_original_source(monkeypatch):
    from types import SimpleNamespace
    from omero_analysis import workspace_sync as ws
    from .conftest import FakeConnection, FakeObject
    dataset = FakeObject(object_id=42)
    conn = FakeConnection(dataset)
    monkeypatch.setattr(ws, "_owner_id", lambda obj: conn.user_id)
    monkeypatch.setattr(ws, "_marker", lambda *args: (None, {"workspace_id": "mine", "source_object_type": "Plate", "source_object_id": "303"}))
    monkeypatch.setattr(ws, "_managed_project", lambda *args: object())
    monkeypatch.setattr(ws, "_managed_dataset", lambda *args: dataset)
    source, wid = lifecycle.owned_workspace_context(conn, dataset)
    assert wid == "mine" and source.OMERO_CLASS == "Plate" and source.getId() == 303
    assert conn.getObject("Plate", 303) is None


def test_workspace_membership_is_rechecked_after_revocation(monkeypatch):
    import sys
    from types import SimpleNamespace
    from omero_analysis.workspace_access import require_workspace_access
    from omero_analysis.errors import PermissionDenied
    from .conftest import FakeConnection, FakeObject
    class Parameters:
        def addLong(self, *args): return self
    monkeypatch.setitem(sys.modules, "omero.sys", SimpleNamespace(ParametersI=Parameters))
    obj = FakeObject()
    conn = FakeConnection(obj)
    conn.getQueryService = lambda: SimpleNamespace(projection=lambda *args: [])
    with pytest.raises(PermissionDenied, match="revoked"):
        require_workspace_access(conn, obj)
