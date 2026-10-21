from types import SimpleNamespace
import pytest
from omero_analysis import workspace_sync as ws
from omero_analysis.result_reconciliation import result_deletions, reject_deleted_results
from omero_analysis.errors import AnalysisError, PermissionDenied


def setup(monkeypatch, asset=None, retired=False, kind="png-image"):
    dataset = SimpleNamespace(getId=lambda: 4)
    item = {"key": "plot", "kind": kind, "remote": {"object_type": "Image", "object_id": 12},
            "metadata": {"sources": [{"fileId": "file-1", "deletedAt": "old" if retired else None}]}}
    monkeypatch.setattr(ws, "_owner_id", lambda obj: 1)
    monkeypatch.setattr(ws, "_user_id", lambda conn: 1)
    monkeypatch.setattr(ws, "_remote_object", lambda conn, remote: asset)
    return dataset, {"items": [item]}


def test_missing_result_and_persistent_receipts_reject_stale_upload(monkeypatch):
    dataset, manifest = setup(monkeypatch)
    records = result_deletions(None, dataset, manifest)
    assert records[0]["fileIds"] == ["file-1"]
    with pytest.raises(AnalysisError) as error:
        reject_deleted_results({"items": manifest["items"]}, records)
    assert error.value.status == 409 and error.value.code == "results_removed"
    # A newly executed run can intentionally regenerate the same bytes.
    fresh = {**manifest["items"][0], "metadata": {"sources": [{"fileId": "new-run-file"}]}}
    reject_deleted_results({"items": [fresh]}, records)
    assert result_deletions(None, dataset, {"items": [], "external_deletions": records}) == records


def test_unlinking_a_plot_counts_as_removal_but_retired_unlinked_results_do_not(monkeypatch):
    asset = SimpleNamespace(listParents=lambda: [])
    dataset, manifest = setup(monkeypatch, asset)
    assert len(result_deletions(None, dataset, manifest)) == 1
    manifest["items"][0]["metadata"]["sources"][0]["deletedAt"] = "prior-local-removal"
    assert result_deletions(None, dataset, manifest) == []


def test_annotation_companion_stays_active_only_through_a_live_workspace_parent(monkeypatch):
    dataset, manifest = setup(monkeypatch, kind="result")
    image = SimpleNamespace(getId=lambda: 12, listParents=lambda: [dataset])
    annotation = SimpleNamespace(getParentLinks=lambda kind: [SimpleNamespace(getParent=lambda: image)])
    monkeypatch.setattr(ws, "_remote_object", lambda *args: annotation)
    monkeypatch.setattr(ws, "_annotation_parent_links", lambda *args: [])
    manifest["items"].append({"key": "image", "kind": "png-image", "remote": {"object_id": 12}})
    assert result_deletions(None, dataset, manifest) == []
    image.listParents = lambda: []
    assert len(result_deletions(None, dataset, manifest)) == 1


@pytest.mark.parametrize("error", [PermissionDenied("access denied"), ConnectionError("offline")])
def test_failures_are_never_deletions(monkeypatch, error):
    dataset, manifest = setup(monkeypatch)
    def fail(*args): raise error
    monkeypatch.setattr(ws, "_remote_object", fail)
    with pytest.raises(type(error)):
        result_deletions(None, dataset, manifest)


def test_collaborator_does_not_certify_owner_deletion(monkeypatch):
    dataset, manifest = setup(monkeypatch)
    monkeypatch.setattr(ws, "_user_id", lambda conn: 2)
    assert result_deletions(None, dataset, manifest) == []
