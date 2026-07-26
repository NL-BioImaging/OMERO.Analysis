from io import BytesIO

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile

from omero_analysis_chat.errors import (
    AttachmentNotFound,
    FileTooLarge,
    InvalidObject,
    PermissionDenied,
    UnsupportedMedia,
)
from omero_analysis_chat.services import (
    PROJECT_NAMESPACE,
    RESULT_NAMESPACE,
    WORKFLOW_NAMESPACE,
    canonical_object_type,
    checked_download,
    direct_file_annotations,
    get_direct_attachment,
    list_attachment_dicts,
    object_context,
    object_hierarchy,
    safe_filename,
    upload_project_snapshot_annotation,
    upload_result_annotation,
    upload_workflow_annotation,
    validate_project_snapshot,
    validate_result,
    validate_workflow_template,
)

from .conftest import FakeAnnotation, FakeConnection, FakeObject


@pytest.mark.parametrize("value", ["image", "Dataset", "PLATE", "screen"])
def test_supported_object_types(value):
    assert canonical_object_type(value) in {"Image", "Dataset", "Plate", "Screen"}


def test_unsupported_object_type_is_rejected():
    with pytest.raises(InvalidObject):
        canonical_object_type("project")


def test_only_direct_file_annotations_are_listed_and_marked_supported():
    obj = FakeObject(
        annotations=[
            FakeAnnotation(2, "notes.txt"),
            FakeAnnotation(1, "measurements.duckdb"),
            object(),
        ]
    )
    values = list_attachment_dicts(obj)
    assert [value["annotation_id"] for value in values] == [1, 2]
    assert values[0]["supported"] is True
    assert values[1]["supported"] is False


def test_attachment_must_be_directly_linked():
    with pytest.raises(AttachmentNotFound):
        get_direct_attachment(FakeObject(), 99)


def test_unsupported_and_oversized_downloads_are_rejected():
    unsupported = FakeObject(annotations=[FakeAnnotation(1, "notes.txt")])
    with pytest.raises(UnsupportedMedia):
        checked_download(unsupported, 1)
    oversized = FakeObject(
        annotations=[FakeAnnotation(2, "large.csv", data=b"x" * 1025)]
    )
    with pytest.raises(FileTooLarge):
        checked_download(oversized, 2)


@pytest.mark.parametrize("name", ["../result.csv", r"..\\result.csv", "\x00"])
def test_filenames_are_normalized_or_rejected(name):
    if name == "\x00":
        with pytest.raises(UnsupportedMedia):
            safe_filename(name)
    else:
        assert safe_filename(name) == "result.csv"


def test_result_validation_enforces_extension_mime_and_size():
    valid = SimpleUploadedFile("result.csv", b"a,b\n1,2\n", content_type="text/csv")
    assert validate_result(valid) == ("result.csv", "text/csv")
    with pytest.raises(UnsupportedMedia):
        validate_result(SimpleUploadedFile("result.exe", b"x"))
    with pytest.raises(UnsupportedMedia):
        validate_result(
            SimpleUploadedFile("result.csv", b"x", content_type="application/pdf")
        )
    with pytest.raises(FileTooLarge):
        validate_result(SimpleUploadedFile("large.csv", b"x" * 1025, content_type="text/csv"))


def test_result_upload_requires_permission_and_uses_analysis_namespace():
    denied = FakeObject(can_annotate=False)
    with pytest.raises(PermissionDenied):
        upload_result_annotation(
            FakeConnection(denied),
            denied,
            SimpleUploadedFile("result.csv", b"a\n1\n", content_type="text/csv"),
        )
    obj = FakeObject()
    conn = FakeConnection(obj)
    result = upload_result_annotation(
        conn,
        obj,
        SimpleUploadedFile("result.csv", b"a\n1\n", content_type="text/csv"),
    )
    assert result["namespace"] == RESULT_NAMESPACE
    assert obj.linked == [conn.created]


def test_project_snapshots_have_separate_kind_namespace_and_zip_validation():
    uploaded = SimpleUploadedFile(
        "screen-1.oac.zip",
        b"PK\x03\x04project",
        content_type="application/zip",
    )
    assert validate_project_snapshot(uploaded) == (
        "screen-1.oac.zip",
        "application/zip",
    )
    obj = FakeObject()
    conn = FakeConnection(obj)
    result = upload_project_snapshot_annotation(conn, obj, uploaded)
    assert result["namespace"] == PROJECT_NAMESPACE
    assert result["kind"] == "project"
    assert result["supported"] is False
    with pytest.raises(UnsupportedMedia):
        validate_project_snapshot(
            SimpleUploadedFile("project.zip", b"PK\x03\x04x", content_type="application/zip")
        )
    with pytest.raises(UnsupportedMedia):
        validate_project_snapshot(
            SimpleUploadedFile(
                "project.oac.zip", b"not-a-zip", content_type="application/zip"
            )
        )


def test_object_context_lists_project_snapshots_separately():
    snapshot = FakeAnnotation(
        21,
        "saved.oac.zip",
        b"PK\x03\x04snapshot",
        namespace=PROJECT_NAMESPACE,
    )
    context = object_context("Image", 1, FakeObject(annotations=[snapshot]))
    assert context["project_snapshots"][0]["annotation_id"] == 21
    assert context["supported_attachments"] == []


def test_workflow_templates_are_validated_and_listed_separately():
    data = b'{"format":"nl.bioimaging.analysis-chat.workflow.v1","workflow":{},"scripts":[]}'
    uploaded = SimpleUploadedFile(
        "counts.oac-workflow.json", data, content_type="application/json"
    )
    assert validate_workflow_template(uploaded) == (
        "counts.oac-workflow.json",
        "application/json",
    )
    obj = FakeObject()
    conn = FakeConnection(obj)
    result = upload_workflow_annotation(conn, obj, uploaded)
    assert result["namespace"] == WORKFLOW_NAMESPACE
    assert result["kind"] == "workflow"
    context = object_context("Dataset", 1, FakeObject(annotations=[conn.created]))
    assert context["workflow_templates"][0]["kind"] == "workflow"
    assert context["supported_attachments"] == []
    with pytest.raises(UnsupportedMedia):
        validate_workflow_template(
            SimpleUploadedFile(
                "bad.oac-workflow.json",
                b'{"format":"other"}',
                content_type="application/json",
            )
        )


def test_hierarchy_uses_wrapper_relations_without_webclient_api():
    parent = FakeObject(object_id=2, name="Parent")
    parent.OMERO_CLASS = "Dataset"
    parent.getId = lambda: 2
    child = FakeObject(object_id=3, name="Child")
    child.OMERO_CLASS = "Image"
    child.getId = lambda: 3
    obj = FakeObject()
    obj.listParents = lambda: [parent]
    obj.listChildren = lambda: [child]
    hierarchy = object_hierarchy("Dataset", 1, obj)
    assert hierarchy["parents"][0]["name"] == "Parent"
    assert hierarchy["children"][0] == {
        "type": "Image",
        "id": 3,
        "name": "Child",
        "supported": True,
    }
