from pathlib import Path

from django.core.files.uploadedfile import SimpleUploadedFile

from omero_analysis.inplace_storage import AnalysisStorage
from omero_analysis import staged_attachments as staged

from .conftest import FakeAnnotation, FakeConnection, FakeObject
from .test_inplace_storage import ready_capability


def configured_storage(monkeypatch, tmp_path, user_id=7):
    capability = ready_capability(tmp_path)
    storage = AnalysisStorage(capability, user_id)
    monkeypatch.setattr(
        staged,
        "storage_for",
        lambda group_id, requested_user_id, initialize=True: (
            capability,
            storage if requested_user_id == user_id else None,
        ),
    )
    return storage


def source_object():
    value = FakeObject(object_id=11, name="Source", group_id=4)
    value.OMERO_CLASS = "Image"
    return value


def test_upload_is_durable_staging_and_does_not_annotate_source(monkeypatch, tmp_path):
    storage = configured_storage(monkeypatch, tmp_path)
    source = source_object()
    conn = FakeConnection(source)

    result = staged.stage_attachment(
        conn,
        source,
        SimpleUploadedFile("measurements.csv", b"x,y\n1,2\n", content_type="text/csv"),
    )

    assert result["state"] == "staged"
    assert result["sha256"]
    assert source.linked == []
    assert conn.created is None
    records = staged.list_staged_attachments(conn, source)
    assert [item["staging_id"] for item in records] == [result["staging_id"]]
    record = storage.read_json(staged._record_path(result["staging_id"]))
    assert record["blob"]["path"].startswith(str(storage.user_root))


def test_adoption_is_workspace_only_and_idempotent(monkeypatch, tmp_path):
    storage = configured_storage(monkeypatch, tmp_path)
    source = source_object()
    dataset = FakeObject(object_id=303, name="Workspace", group_id=4)
    dataset.OMERO_CLASS = "Dataset"
    conn = FakeConnection(source)
    created = []

    class InputAnnotation(FakeAnnotation):
        def getDescription(self):
            return self.description

    monkeypatch.setattr(
        "omero_analysis.workspace_sync.ensure_workspace_destination",
        lambda _conn, _source, workspace_id, workspace_name=None: dataset,
    )

    def create(_conn, path, *, mimetype, namespace, description):
        annotation = InputAnnotation(
            900 + len(created), "measurements.csv", Path(path).read_bytes(), namespace
        )
        annotation.description = description
        annotation.file.mimetype = mimetype
        created.append(annotation)
        return annotation, "inplace-annotation", None

    monkeypatch.setattr(staged, "create_file_annotation", create)
    pending = staged.stage_attachment(
        conn,
        source,
        SimpleUploadedFile("measurements.csv", b"x\n1\n", content_type="text/csv"),
    )

    first = staged.adopt_staged_attachment(
        conn, source, "workspace-1", pending["staging_id"]
    )
    second = staged.adopt_staged_attachment(
        conn, source, "workspace-1", pending["staging_id"]
    )

    assert first["annotation_id"] == second["annotation_id"]
    assert first["storage_mode"] == "inplace-annotation"
    assert len(created) == 1
    assert dataset.linked == [created[0]]
    assert source.linked == []
    assert staged.list_staged_attachments(conn, source) == []
    record = storage.read_json(staged._record_path(pending["staging_id"]))
    assert record["state"] == "adopted"
    assert record["workspaceId"] == "workspace-1"


def test_adopted_upload_cannot_move_to_another_workspace(monkeypatch, tmp_path):
    configured_storage(monkeypatch, tmp_path)
    source = source_object()
    dataset = FakeObject(object_id=303, name="Workspace", group_id=4)
    dataset.OMERO_CLASS = "Dataset"
    conn = FakeConnection(source)
    monkeypatch.setattr(
        "omero_analysis.workspace_sync.ensure_workspace_destination",
        lambda *_args, **_kwargs: dataset,
    )
    annotation = FakeAnnotation(901, "measurements.csv", b"x\n1\n", staged.STAGED_INPUT_NAMESPACE)
    annotation.getDescription = lambda: ""
    monkeypatch.setattr(
        staged,
        "create_file_annotation",
        lambda *_args, **_kwargs: (annotation, "hybrid", None),
    )
    pending = staged.stage_attachment(
        conn,
        source,
        SimpleUploadedFile("measurements.csv", b"x\n1\n", content_type="text/csv"),
    )
    staged.adopt_staged_attachment(conn, source, "workspace-1", pending["staging_id"])

    from omero_analysis.errors import PermissionDenied
    import pytest

    with pytest.raises(PermissionDenied, match="another workspace"):
        staged.adopt_staged_attachment(conn, source, "workspace-2", pending["staging_id"])


def test_assignment_is_recoverable_and_cannot_be_changed(monkeypatch, tmp_path):
    configured_storage(monkeypatch, tmp_path)
    source = source_object()
    conn = FakeConnection(source)
    pending = staged.stage_attachment(
        conn,
        source,
        SimpleUploadedFile("measurements.csv", b"x\n1\n", content_type="text/csv"),
    )

    assert staged.assign_staged_attachments(
        conn, source, "workspace-1", [pending["staging_id"], pending["staging_id"]]
    ) == [pending["staging_id"]]
    assert staged.assigned_staging_ids(conn, source, "workspace-1") == [
        pending["staging_id"]
    ]

    from omero_analysis.errors import PermissionDenied
    import pytest

    with pytest.raises(PermissionDenied, match="another workspace"):
        staged.assign_staged_attachments(
            conn, source, "workspace-2", [pending["staging_id"]]
        )
    with pytest.raises(PermissionDenied, match="another workspace"):
        staged.adopt_staged_attachment(
            conn, source, "workspace-2", pending["staging_id"]
        )


def test_purged_workspace_staging_records_release_their_blobs(monkeypatch, tmp_path):
    storage = configured_storage(monkeypatch, tmp_path)
    source = source_object()
    conn = FakeConnection(source)
    pending = staged.stage_attachment(
        conn,
        source,
        SimpleUploadedFile("measurements.csv", b"x\n1\n", content_type="text/csv"),
    )
    path = staged._record_path(pending["staging_id"])
    record = storage.read_json(path)
    record.update({"state": "adopted", "workspaceId": "workspace-1"})
    storage.write_json(path, record)

    assert staged.delete_workspace_staging_records(storage, "workspace-1") == 1
    assert storage.read_json(path) is None
    assert storage.garbage_collect() == 1
