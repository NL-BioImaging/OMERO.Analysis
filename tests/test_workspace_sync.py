import hashlib
import io
import json
import sys
import zipfile
from types import ModuleType
from types import SimpleNamespace

import pytest
from django.test import RequestFactory

from omero_analysis.errors import FileTooLarge, InvalidObject, PermissionDenied, UnsupportedMedia
from omero_analysis.workspace_sync import (
    INVENTORY_SCHEMA,
    _canonical_json,
    _item_marker_values,
    _item_namespace,
    _validate_payload,
    _reconcile_result_attachments,
    plan_sync,
    resolve_workspace_dataset,
    sync_status,
    validate_inventory,
)

from .conftest import FakeAnnotation, FakeConnection, FakeObject


def inventory(obj, conn, items=None):
    unsigned = {
        "schema": INVENTORY_SCHEMA,
        "workspace": {
            "id": "workspace-1",
            "name": "Cells",
            "sourceObjectType": "Screen",
            "sourceObjectId": obj.object_id,
            "sourceObjectName": obj.name,
            "userId": conn.user_id,
            "groupId": obj.group_id,
        },
        "items": items or [],
    }
    return {
        **unsigned,
        "digest": hashlib.sha256(_canonical_json(unsigned)).hexdigest(),
    }


def request():
    value = RequestFactory().post("/")
    value.session = SimpleNamespace(session_key="session-1")
    return value


def test_inventory_validation_and_empty_plan_are_deterministic():
    obj = FakeObject(object_id=151, name="2DWellTestZarr")
    conn = FakeConnection(obj)
    payload = inventory(obj, conn, [{
        "key": "method:one",
        "kind": "method",
        "name": "one.oa-method.json",
        "mimetype": "application/json",
        "size": 12,
        "sha256": "a" * 64,
        "logicalPath": "Methods/one.py",
        "metadata": {},
    }])
    validated = validate_inventory(
        payload, "workspace-1", "Screen", 151, obj, conn
    )
    plan = plan_sync(request(), conn, obj, validated)
    assert plan["create"] == 1
    assert plan["update"] == 0
    assert plan["delete"] == 0
    assert plan["uploadKeys"] == ["method:one"]
    assert plan["uploadBytes"] == 12
    assert plan["datasetName"] == "Screen-151 — 2DWellTestZarr"
    assert plan["planToken"]


def test_workspace_dataset_resolution_returns_original_source_and_snapshot(monkeypatch):
    dataset = FakeObject(object_id=303, name="Screen-152 — SolHunt")
    source = FakeObject(object_id=152, name="SolHunt")

    class Connection(FakeConnection):
        def getObject(self, object_type, object_id):
            return {
                ("Dataset", 303): dataset,
                ("Screen", 152): source,
            }.get((object_type, int(object_id)))

    monkeypatch.setattr(
        "omero_analysis.workspace_sync._marker",
        lambda _obj, role=None, match=None: (
            None,
            {"role": "dataset", "workspace_id": "workspace-1"},
        ),
    )
    monkeypatch.setattr(
        "omero_analysis.workspace_sync.library_datasets",
        lambda _conn, _obj: [{
            "datasetId": 303,
            "datasetName": "Screen-152 — SolHunt",
            "workspaceId": "workspace-1",
            "workspaceName": "SolHunt analysis",
            "sourceObjectType": "Screen",
            "sourceObjectId": 152,
            "sourceObjectName": "SolHunt",
            "revision": 4,
            "updatedAt": "2026-08-06T12:00:00+00:00",
            "snapshot": {"annotationId": 901},
        }],
    )

    result = resolve_workspace_dataset(Connection(dataset), 303)

    assert result["managed"] is True
    assert result["resumable"] is True
    assert result["sourceObjectType"] == "Screen"
    assert result["sourceObjectId"] == 152
    assert result["workspaceAnnotationId"] == 901


def test_workspace_dataset_resolution_keeps_ordinary_dataset_as_source(monkeypatch):
    dataset = FakeObject(object_id=303)
    monkeypatch.setattr(
        "omero_analysis.workspace_sync._marker",
        lambda _obj, role=None, match=None: (None, {}),
    )

    result = resolve_workspace_dataset(FakeConnection(dataset), 303)

    assert result == {"managed": False, "resumable": False}


def test_workspace_dataset_resolution_guides_when_snapshot_is_missing(monkeypatch):
    dataset = FakeObject(object_id=303)
    source = FakeObject(object_id=152)

    class Connection(FakeConnection):
        def getObject(self, object_type, object_id):
            return {
                ("Dataset", 303): dataset,
                ("Screen", 152): source,
            }.get((object_type, int(object_id)))

    monkeypatch.setattr(
        "omero_analysis.workspace_sync._marker",
        lambda _obj, role=None, match=None: (None, {"role": "dataset"}),
    )
    monkeypatch.setattr(
        "omero_analysis.workspace_sync.library_datasets",
        lambda _conn, _obj: [{
            "datasetId": 303,
            "datasetName": "Workspace",
            "workspaceId": "workspace-1",
            "workspaceName": "Workspace",
            "sourceObjectType": "Screen",
            "sourceObjectId": 152,
            "sourceObjectName": "Source",
            "revision": 1,
            "updatedAt": "",
            "snapshot": None,
        }],
    )

    result = resolve_workspace_dataset(Connection(dataset), 303)

    assert result["managed"] is True
    assert result["resumable"] is False
    assert "restore snapshot" in result["error"]


def test_template_input_is_a_supported_managed_file_kind():
    obj = FakeObject(object_id=151, name="2DWellTestZarr")
    conn = FakeConnection(obj)
    payload = inventory(obj, conn, [{
        "key": "template-input:one",
        "kind": "template-input",
        "name": "analysis-template.csv",
        "mimetype": "text/csv",
        "size": 12,
        "sha256": "c" * 64,
        "logicalPath": "Templates/analysis-template.csv",
        "metadata": {"source": "local"},
    }])
    validated = validate_inventory(
        payload, "workspace-1", "Screen", 151, obj, conn
    )
    assert validated["items"][0]["kind"] == "template-input"


@pytest.mark.parametrize("kind", ["chat-json", "chat-markdown", "chat-attachment"])
def test_assistant_content_is_not_a_supported_sync_item(kind):
    obj = FakeObject(object_id=151, name="2DWellTestZarr")
    conn = FakeConnection(obj)
    payload = inventory(obj, conn, [{
        "key": f"assistant:{kind}",
        "kind": kind,
        "name": "assistant-item.txt",
        "mimetype": "text/plain",
        "size": 1,
        "sha256": "a" * 64,
        "logicalPath": "Assistant/item.txt",
        "metadata": {},
    }])
    with pytest.raises(UnsupportedMedia, match="Unsupported synchronization item kind"):
        validate_inventory(payload, "workspace-1", "Screen", 151, obj, conn)


def test_workspace_snapshot_is_validated_as_the_managed_restore_item():
    stream = io.BytesIO()
    with zipfile.ZipFile(stream, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("workspace.json", json.dumps({
            "format": "nl.bioimaging.analysis.workspace.v1",
            "version": 1,
        }))
    data = stream.getvalue()

    class Upload:
        def chunks(self):
            return [data]

    obj = FakeObject(object_id=151, name="2DWellTestZarr")
    conn = FakeConnection(obj)
    item = {
        "key": "workspace-snapshot:workspace-1",
        "kind": "workspace-snapshot",
        "name": "cells.oa-workspace.zip",
        "mimetype": "application/zip",
        "size": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "logicalPath": "Workspace/cells.oa-workspace.zip",
        "metadata": {"workspaceId": "workspace-1", "omittedLocalInputs": []},
    }
    validated = validate_inventory(
        inventory(obj, conn, [item]), "workspace-1", "Screen", 151, obj, conn
    )
    assert validated["items"][0]["kind"] == "workspace-snapshot"
    assert _validate_payload(item, Upload()) == data


def test_plot_csv_must_reference_a_synchronized_png_image():
    obj = FakeObject(object_id=151, name="2DWellTestZarr")
    conn = FakeConnection(obj)
    payload = inventory(obj, conn, [{
        "key": "result:csv",
        "kind": "result",
        "name": "plot.csv",
        "mimetype": "text/csv",
        "size": 12,
        "sha256": "a" * 64,
        "logicalPath": "Results/plot.csv",
        "metadata": {"plotImageKeys": ["result:missing-image"]},
    }])

    with pytest.raises(InvalidObject, match="unknown synchronized PNG"):
        validate_inventory(payload, "workspace-1", "Screen", 151, obj, conn)


def test_plot_csv_is_linked_to_image_instead_of_dataset():
    annotation = FakeAnnotation(42, "plot.csv")
    dataset = FakeObject(object_id=20, annotations=[annotation])
    image = FakeObject(object_id=30)
    item = {
        "key": "result:csv",
        "kind": "result",
        "name": "plot.csv",
        "metadata": {"plotImageKeys": ["result:image"]},
    }

    _reconcile_result_attachments(
        FakeConnection(),
        dataset,
        [item],
        {"result:csv": annotation, "result:image": image},
        {},
    )

    assert annotation not in dataset.annotations
    assert annotation in image.linked


def test_content_marker_tracks_every_local_result_origin():
    values = _item_marker_values("workspace-1", {
        "key": f"result-content:result:{'a' * 64}",
        "kind": "result",
        "name": "counts.csv",
        "sha256": "a" * 64,
        "metadata": {
            "sourceCount": 2,
            "plotImageKeys": ["result-content:png-image:image-hash"],
            "sources": [
                {"fileId": "chat-result", "chatId": "chat-1", "methodId": None},
                {"fileId": "method-result", "chatId": None, "methodId": "method-1"},
            ],
        },
    }, {"object_type": "Annotation", "object_id": 42})

    assert values["source_count"] == 2
    assert values["canonical_name"] == "counts.csv"
    assert values["remote_object_type"] == "Annotation"
    assert values["remote_object_id"] == 42
    assert json.loads(values["plot_image_keys"]) == [
        "result-content:png-image:image-hash"
    ]
    assert json.loads(values["source_references"]) == [
        {"chatId": "chat-1", "fileId": "chat-result", "methodId": None},
        {"chatId": None, "fileId": "method-result", "methodId": "method-1"},
    ]


def test_inventory_is_bound_to_user_group_and_source_object():
    obj = FakeObject(object_id=151)
    conn = FakeConnection(obj)
    payload = inventory(obj, conn)
    payload["workspace"]["userId"] = 99
    unsigned = {key: payload[key] for key in ("schema", "workspace", "items")}
    payload["digest"] = hashlib.sha256(_canonical_json(unsigned)).hexdigest()
    with pytest.raises(PermissionDenied):
        validate_inventory(payload, "workspace-1", "Screen", 151, obj, conn)


def test_status_does_not_adopt_an_unmarked_same_name_project():
    obj = FakeObject(object_id=151)

    class Connection(FakeConnection):
        def getObjects(self, object_type, opts=None):
            assert object_type == "Project"
            return [SimpleNamespace(
                getName=lambda: "+AnalysisWorkspaces",
                listAnnotations=lambda: [],
            )]

    status = sync_status(Connection(obj), obj, "workspace-1")
    assert status["linked"] is False
    assert status["projectId"] is None


def test_changed_payload_limit_is_enforced(settings):
    settings.OMERO_ANALYSIS_MAX_SYNC_CHANGED_BYTES = 5
    obj = FakeObject(object_id=151)
    conn = FakeConnection(obj)
    payload = inventory(obj, conn, [{
        "key": "result:one",
        "kind": "result",
        "name": "one.csv",
        "mimetype": "text/csv",
        "size": 6,
        "sha256": "b" * 64,
        "logicalPath": "Results/one.csv",
        "metadata": {},
    }])
    validated = validate_inventory(
        payload, "workspace-1", "Screen", 151, obj, conn
    )
    with pytest.raises(FileTooLarge):
        plan_sync(request(), conn, obj, validated)


def test_sync_uses_concrete_omero_container_and_link_models(monkeypatch):
    class Model:
        def __init__(self, object_id=None, _loaded=True):
            self.id = object_id

    class Wrapper:
        def __init__(self, _conn, model):
            self._obj = model

    gateway = ModuleType("omero.gateway")
    gateway.DatasetWrapper = Wrapper
    gateway.ProjectWrapper = Wrapper
    model = ModuleType("omero.model")
    model.DatasetI = type("DatasetI", (Model,), {})
    model.ProjectI = type("ProjectI", (Model,), {})
    model.ProjectDatasetLinkI = type("ProjectDatasetLinkI", (Model,), {})
    package = ModuleType("omero")
    package.gateway = gateway
    package.model = model
    monkeypatch.setitem(sys.modules, "omero", package)
    monkeypatch.setitem(sys.modules, "omero.gateway", gateway)
    monkeypatch.setitem(sys.modules, "omero.model", model)

    from omero.gateway import DatasetWrapper, ProjectWrapper
    from omero.model import DatasetI, ProjectDatasetLinkI, ProjectI

    project = ProjectWrapper(None, ProjectI())
    dataset = DatasetWrapper(None, DatasetI())
    link = ProjectDatasetLinkI()

    assert project._obj is not None
    assert dataset._obj is not None
    assert link.__class__.__name__ == "ProjectDatasetLinkI"
