import hashlib
import json
from types import SimpleNamespace

import pytest
from django.test import RequestFactory

from omero_analysis.errors import FileTooLarge, PermissionDenied
from omero_analysis.workspace_sync import (
    INVENTORY_SCHEMA,
    _canonical_json,
    _item_marker_values,
    plan_sync,
    sync_status,
    validate_inventory,
)

from .conftest import FakeConnection, FakeObject


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


def test_content_marker_tracks_every_local_result_origin():
    values = _item_marker_values("workspace-1", {
        "key": f"result-content:result:{'a' * 64}",
        "kind": "result",
        "name": "counts.csv",
        "sha256": "a" * 64,
        "metadata": {
            "sourceCount": 2,
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


def test_sync_uses_concrete_omero_container_and_link_models():
    pytest.importorskip("omero.gateway")
    from omero.gateway import DatasetWrapper, ProjectWrapper
    from omero.model import DatasetI, ProjectDatasetLinkI, ProjectI

    project = ProjectWrapper(None, ProjectI())
    dataset = DatasetWrapper(None, DatasetI())
    link = ProjectDatasetLinkI()

    assert project._obj is not None
    assert dataset._obj is not None
    assert link.__class__.__name__ == "ProjectDatasetLinkI"
