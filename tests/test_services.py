from io import BytesIO
import json
import zipfile

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile

from omero_analysis.errors import (
    AttachmentNotFound,
    FileTooLarge,
    InvalidObject,
    PermissionDenied,
    UnsupportedMedia,
)
from omero_analysis.services import (
    WORKSPACE_NAMESPACE,
    NOTEBOOK_NAMESPACE,
    RESULT_NAMESPACE,
    PIPELINE_NAMESPACE,
    canonical_object_type,
    checked_download,
    direct_file_annotations,
    get_direct_attachment,
    get_scoped_attachment,
    list_attachment_dicts,
    object_context,
    object_hierarchy,
    safe_filename,
    upload_workspace_snapshot_annotation,
    upload_result_annotation,
    upload_pipeline_annotation,
    upload_notebook_annotation,
    validate_workspace_snapshot,
    validate_result,
    validate_pipeline_template,
    validate_notebook,
)

from .conftest import FakeAnnotation, FakeConnection, FakeObject


def workspace_archive(format_name=WORKSPACE_NAMESPACE):
    stream = BytesIO()
    with zipfile.ZipFile(stream, "w") as archive:
        archive.writestr(
            "workspace.json",
            json.dumps({"format": format_name, "version": 1}),
        )
    return stream.getvalue()


@pytest.mark.parametrize("value", ["image", "Dataset", "PLATE", "screen"])
def test_supported_object_types(value):
    assert canonical_object_type(value) in {"Image", "Dataset", "Plate", "Screen"}


def test_unsupported_object_type_is_rejected():
    with pytest.raises(InvalidObject):
        canonical_object_type("workspace")


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


def test_result_database_and_immediate_child_attachments_are_selectable():
    result = FakeAnnotation(
        7,
        "measurements.duckdb",
        namespace=RESULT_NAMESPACE,
    )
    child = FakeObject(object_id=3, name="Child image", annotations=[result])
    child.OMERO_CLASS = "Image"
    child.getId = lambda: 3
    dataset = FakeObject(object_id=2, name="Parent dataset")
    dataset.OMERO_CLASS = "Dataset"
    dataset.getId = lambda: 2
    dataset.listChildren = lambda: [child]

    context = object_context("Dataset", 2, dataset)

    assert context["attachments"] == []
    assert context["supported_attachments"][0]["annotation_id"] == 7
    assert context["supported_attachments"][0]["kind"] == "result"
    assert context["supported_attachments"][0]["direct"] is False
    assert context["supported_attachments"][0]["object_type"] == "Image"
    _, info = get_scoped_attachment(dataset, 7)
    assert info.object_name == "Child image"


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


def test_workspace_snapshots_have_separate_kind_namespace_and_zip_validation():
    uploaded = SimpleUploadedFile(
        "screen-1.oa-workspace.zip",
        workspace_archive(),
        content_type="application/zip",
    )
    assert validate_workspace_snapshot(uploaded) == (
        "screen-1.oa-workspace.zip",
        "application/zip",
    )
    obj = FakeObject()
    conn = FakeConnection(obj)
    result = upload_workspace_snapshot_annotation(conn, obj, uploaded)
    assert result["namespace"] == WORKSPACE_NAMESPACE
    assert result["kind"] == "workspace"
    assert result["supported"] is False
    with pytest.raises(UnsupportedMedia):
        validate_workspace_snapshot(
            SimpleUploadedFile("workspace.zip", workspace_archive(), content_type="application/zip")
        )
    with pytest.raises(UnsupportedMedia):
        validate_workspace_snapshot(
            SimpleUploadedFile(
                "workspace.oa-workspace.zip", b"not-a-zip", content_type="application/zip"
            )
        )
    with pytest.raises(UnsupportedMedia):
        validate_workspace_snapshot(
        SimpleUploadedFile(
            "legacy.oa-workspace.zip",
            workspace_archive("nl.bioimaging.analysis.project.v1"),
            content_type="application/zip",
        )
    )


def test_object_context_lists_workspace_snapshots_separately():
    snapshot = FakeAnnotation(
        21,
        "saved.oa-workspace.zip",
        b"PK\x03\x04snapshot",
        namespace=WORKSPACE_NAMESPACE,
    )
    context = object_context("Image", 1, FakeObject(annotations=[snapshot]))
    assert context["workspace_snapshots"][0]["annotation_id"] == 21
    assert context["supported_attachments"] == []


def test_pipeline_templates_are_validated_and_listed_separately():
    data = b'{"format":"nl.bioimaging.analysis.pipeline.v1","pipeline":{},"scripts":[]}'
    uploaded = SimpleUploadedFile(
        "counts.oa-pipeline.json", data, content_type="application/json"
    )
    assert validate_pipeline_template(uploaded) == (
        "counts.oa-pipeline.json",
        "application/json",
    )
    obj = FakeObject()
    conn = FakeConnection(obj)
    result = upload_pipeline_annotation(conn, obj, uploaded)
    assert result["namespace"] == PIPELINE_NAMESPACE
    assert result["kind"] == "pipeline"
    context = object_context("Dataset", 1, FakeObject(annotations=[conn.created]))
    assert context["pipeline_templates"][0]["kind"] == "pipeline"
    assert context["supported_attachments"] == []
    with pytest.raises(UnsupportedMedia):
        validate_pipeline_template(
            SimpleUploadedFile(
                "bad.oa-pipeline.json",
                b'{"format":"other"}',
                content_type="application/json",
            )
        )
    legacy = SimpleUploadedFile(
        "legacy.oac-pipeline.json",
        b'{"format":"nl.bioimaging.analysis-chat.pipeline.v1","pipeline":{},"scripts":[]}',
        content_type="application/json",
    )
    with pytest.raises(UnsupportedMedia):
        validate_pipeline_template(legacy)


def test_legacy_analysis_namespaces_are_not_classified_as_workspace_or_pipeline():
    annotations = [
        FakeAnnotation(
            31,
            "legacy.oac.zip",
            b"PK\x03\x04snapshot",
            namespace="nl.bioimaging.analysis-chat.workspace.v2",
        ),
        FakeAnnotation(
            32,
            "legacy.oac-pipeline.json",
            b"{}",
            namespace="nl.bioimaging.analysis-chat.pipeline.v1",
        ),
        FakeAnnotation(
            33,
            "legacy.csv",
            b"a\n1\n",
            namespace="nl.bioimaging.analysis-chat.result",
        ),
    ]
    context = object_context("Dataset", 1, FakeObject(annotations=annotations))
    assert context["workspace_snapshots"] == []
    assert context["pipeline_templates"] == []
    result = next(item for item in context["attachments"] if item["annotation_id"] == 33)
    assert result["kind"] == "result"


def test_python_nbformat4_notebooks_are_validated_attached_and_discovered():
    payload = json.dumps({
        "nbformat": 4,
        "nbformat_minor": 5,
        "metadata": {
            "kernelspec": {"language": "python"},
            "language_info": {"name": "python"},
        },
        "cells": [{"cell_type": "code", "source": ["1 + 1"], "metadata": {}}],
    }).encode()
    uploaded = SimpleUploadedFile(
        "analysis.ipynb", payload, content_type="application/x-ipynb+json"
    )
    assert validate_notebook(uploaded) == (
        "analysis.ipynb", "application/x-ipynb+json"
    )
    obj = FakeObject()
    conn = FakeConnection(obj)
    result = upload_notebook_annotation(conn, obj, uploaded)
    assert result["namespace"] == NOTEBOOK_NAMESPACE
    assert result["kind"] == "notebook"
    context = object_context("Image", 1, FakeObject(annotations=[conn.created]))
    assert context["notebooks"][0]["annotation_id"] == conn.created.getId()
    with pytest.raises(UnsupportedMedia):
        validate_notebook(SimpleUploadedFile(
            "r.ipynb",
            json.dumps({"nbformat": 4, "metadata": {
                "language_info": {"name": "r"},
                "kernelspec": {"language": "r"},
            }, "cells": []}).encode(),
            content_type="application/x-ipynb+json",
        ))


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
