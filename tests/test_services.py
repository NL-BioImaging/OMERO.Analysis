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
    canonical_object_type,
    checked_download,
    direct_file_annotations,
    get_direct_attachment,
    list_attachment_dicts,
    safe_filename,
    upload_project_snapshot_annotation,
    upload_result_annotation,
    validate_project_snapshot,
    validate_result,
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
