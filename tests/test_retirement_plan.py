import json
import pytest

from omero_analysis.retirement_plan import (
    assert_same_identity, canonical, checked_path, exclusive_settings_parent,
    migrate_item_manifest, removable_payload, sha256, verify_backup,
)


def test_manifest_retains_legacy_results_and_is_repeatable():
    result = {"key": "r", "kind": "result", "metadata": {"methodId": "old"},
              "logicalPath": "Methods/Results/result.csv"}
    source = {"schema": "nl.bioimaging.analysis.sync.manifest.v1", "revision": 7,
              "inventory_digest": "old", "items": [
                  {"kind": "method"}, {"kind": "chat-json"}, result,
                  {"kind": "notebook"}, {"kind": "template-input"}]}
    migrated = migrate_item_manifest(source)
    assert migrated["items"] == [result, {"kind": "notebook"}, {"kind": "template-input"}]
    assert migrated["revision"] == 8
    assert "inventory_digest" not in migrated
    assert migrate_item_manifest(migrated) == migrated
    assert len(source["items"]) == 5


def test_snapshot_reference_updates_keep_annotation_identity():
    source = {"schema": "nl.bioimaging.analysis.storage.workspace.v1", "items": [{
        "kind": "workspace-snapshot", "remote": {"object_type": "Annotation", "object_id": 8, "file_id": 9},
        "blob": {"sha256": "old"}, "metadata": {"stateDigest": "old"}}]}
    migrated = migrate_item_manifest(source, {"8": {"fileId": 10, "sha256": "new", "size": 12, "blob": {"sha256": "new"}}})
    item = migrated["items"][0]
    assert item["remote"] == {"object_type": "Annotation", "object_id": 8, "file_id": 10}
    assert item["blob"]["sha256"] == "new"
    assert item["metadata"] == {}


def test_never_delete_by_name_or_legacy_result_origin():
    annotation = {"annotationId": 2, "namespace": "nl.bioimaging.analysis.payload.v1"}
    remote = {"object_type": "Annotation", "object_id": 2}
    assert removable_payload({"kind": "chat-json", "remote": remote}, annotation)
    assert not removable_payload({"kind": "result", "name": "methods.json", "remote": remote}, annotation)
    assert not removable_payload({"kind": "chat-json", "remote": remote}, {**annotation, "namespace": "unrelated"})


def test_settings_parent_requires_marker_ownership_and_exclusive_contents():
    parent = {"objectType": "Dataset", "ownerId": 7, "groupId": 4,
              "settingsMarker": {"schema": "nl.bioimaging.analysis.settings.bundle.v1",
                                 "role": "skills", "owner_user_id": "7"},
              "contentsChecked": True, "annotationIds": [8], "imageIds": []}
    assert exclusive_settings_parent(parent, {8}, set())
    assert not exclusive_settings_parent({**parent, "annotationIds": [8, 9]}, {8}, set())
    assert not exclusive_settings_parent({**parent, "imageIds": [10]}, {8}, set())
    assert not exclusive_settings_parent({**parent, "ownerId": 12}, {8}, set())
    assert not exclusive_settings_parent({**parent, "settingsMarker": {}}, {8}, set())
    assert not exclusive_settings_parent({**parent, "contentsChecked": False}, {8}, set())


def test_backup_checks_size_hash_and_path(tmp_path):
    data = canonical({"before": "change"})
    (tmp_path / "backup.bin").write_bytes(data)
    entry = {"backup": "backup.bin", "size": len(data), "sha256": sha256(data)}
    assert verify_backup(tmp_path, entry) == data
    with pytest.raises(ValueError):
        verify_backup(tmp_path, {**entry, "sha256": "wrong"})
    with pytest.raises(ValueError):
        checked_path(tmp_path, "../outside")
    with pytest.raises(ValueError):
        checked_path(tmp_path, str(tmp_path / "absolute"))


@pytest.mark.parametrize("key", ["annotationId", "ownerId", "groupId", "namespace"])
def test_identity_changes_abort_cleanup(key):
    expected = {"annotationId": 1, "ownerId": 7, "groupId": 4, "namespace": "managed"}
    with pytest.raises(ValueError):
        assert_same_identity({**expected, key: "changed"}, expected)
