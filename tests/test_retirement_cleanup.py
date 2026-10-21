import io
import json
from pathlib import Path
import zipfile

from omero_analysis.retired_content import migrate_workspace_archive
from omero_analysis.retirement_cleanup import _apply_durable
from omero_analysis.retirement_plan import canonical, sha256


def archive():
    stream = io.BytesIO()
    with zipfile.ZipFile(stream, "w") as z:
        z.writestr("workspace.json", json.dumps({
            "format": "nl.bioimaging.analysis.workspace.v1", "version": 2,
            "workspace": {"id": "test", "activeChatId": "old"},
            "files": [{"archivePath": "Methods/Results/result.csv"}],
            "notebooks": [], "methods": [{"id": "old"}], "chats": [{"id": "old"}],
        }))
        z.writestr("Methods/Results/result.csv", "value\n12")
        z.writestr("Methods/old.py", "print('retired')")
    return stream.getvalue()


def test_archive_is_byte_idempotent_and_keeps_legacy_results():
    migrated = migrate_workspace_archive(archive())
    assert migrate_workspace_archive(migrated) == migrated
    with zipfile.ZipFile(io.BytesIO(migrated)) as z:
        assert z.read("Methods/Results/result.csv") == b"value\n12"
        assert "Methods/old.py" not in z.namelist()


def test_durable_cleanup_keeps_result_bytes_and_updates_snapshot_copies(tmp_path):
    backup = tmp_path / "backup"
    backup.mkdir()
    root = tmp_path / "analysis"
    root.mkdir()
    report = {"files": [], "durable": []}

    def record(path, data, browse=False):
        live = root / path
        live.parent.mkdir(parents=True, exist_ok=True)
        live.write_bytes(data)
        filename = f"{len(report['durable'])}.bin"
        (backup / filename).write_bytes(data)
        item = {"root": str(root), "path": path, "ownerId": 0, "backup": filename,
                "sha256": sha256(data), "size": len(data), "browse": browse}
        report["durable"].append(item)
        return live

    old = archive()
    result = b"same bytes as retired method"
    manifest = {
        "schema": "nl.bioimaging.analysis.storage.workspace.v1", "userId": 0, "groupId": 0,
        "items": [
            {"kind": "method", "sha256": sha256(result)},
            {"kind": "result", "sha256": sha256(result), "metadata": {"methodId": "legacy"}},
            {"kind": "workspace-snapshot", "sha256": sha256(old),
             "remote": {"object_type": "Annotation", "object_id": 10, "file_id": 11}},
        ],
    }
    live_manifest = record("users/0/workspaces/test/manifest.json", canonical(manifest))
    result_path = record("root--0/+AnalysisWorkspaces/Test/Results/result.csv", result, True)
    snapshot_path = record("root--0/+AnalysisWorkspaces/Test/Workspace/workspace.zip", old, True)
    obsolete_path = record("root--0/+AnalysisWorkspaces/Test/Methods/old.py", b"retired code", True)
    record("users/0/workspaces/test/browse.json", canonical({"files": [
        p.relative_to(root).as_posix() for p in (result_path, snapshot_path, obsolete_path)
    ]}))
    original = {"backup": "obsolete.bin", "size": 12, "sha256": sha256(b"retired code"),
                "action": "delete", "namespace": "nl.bioimaging.analysis.method.v1"}
    (backup / "obsolete.bin").write_bytes(b"retired code")
    report["files"].append(original)
    outcome = {"durable": 0}
    migrated = migrate_workspace_archive(old)
    _apply_durable(report, backup, {"10": {"fileId": 12, "sha256": sha256(migrated), "size": len(migrated)}}, {}, outcome)
    assert result_path.read_bytes() == result
    assert not obsolete_path.exists()
    assert snapshot_path.read_bytes() == migrated
    value = json.loads(live_manifest.read_bytes())
    assert [i["kind"] for i in value["items"]] == ["result", "workspace-snapshot"]
    assert value["items"][0]["metadata"]["methodId"] == "legacy"

def test_signed_state_migration_preserves_identity_and_results():
    from django.core import signing
    from omero_analysis.omero_state import STATE_SALT, STATE_SCHEMA
    from omero_analysis.retirement_cleanup import migrate_state_record
    import pytest

    record = {"schema": STATE_SCHEMA, "path": "workspaces/test/manifest.json",
              "userId": 52, "groupId": 114, "generation": 7,
              "payload": {"schema": "nl.bioimaging.analysis.storage.workspace.v1",
                          "userId": 52, "groupId": 114, "datasetId": 454,
                          "items": [{"kind": "method"}, {"kind": "result", "metadata": {"methodId": "old"}}]}}
    encoded = signing.dumps(record, salt=STATE_SALT).encode()
    expected = {"ownerId": 52, "groupId": 114}
    migrated = migrate_state_record(encoded, expected)
    current = signing.loads(migrated.decode("utf-8"), salt=STATE_SALT)
    assert current["generation"] == 8
    assert current["payload"]["datasetId"] == 454
    assert current["payload"]["items"] == [{"kind": "result", "metadata": {"methodId": "old"}}]
    assert migrate_state_record(migrated, expected) == migrated
    with pytest.raises(ValueError, match="identity"):
        migrate_state_record(encoded, {"ownerId": 136, "groupId": 114})
    with pytest.raises(signing.BadSignature):
        migrate_state_record(encoded + b"tampered", expected)
    record["path"] = "workspaces/../manifest.json"
    with pytest.raises(ValueError, match="path"):
        migrate_state_record(signing.dumps(record, salt=STATE_SALT).encode(), expected)


def test_signed_lifecycle_journal_is_not_rewritten():
    from django.core import signing
    from omero_analysis.omero_state import STATE_SALT, STATE_SCHEMA
    from omero_analysis.retirement_cleanup import migrate_state_record
    record = {"schema": STATE_SCHEMA, "path": "workspaces/test/pending-cleanup.json",
              "userId": 0, "groupId": 0, "generation": 2,
              "payload": {"pending": [{"kind": "result", "object_id": 12}], "errors": []}}
    encoded = signing.dumps(record, salt=STATE_SALT).encode()
    assert migrate_state_record(encoded, {"ownerId": 0, "groupId": 0}) == encoded
