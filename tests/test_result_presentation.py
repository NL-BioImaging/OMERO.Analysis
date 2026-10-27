import copy
import json
from types import SimpleNamespace

import pytest

from omero_analysis.errors import InvalidObject
from omero_analysis.result_presentation import (
    BEGIN, END, description, merge_description, refresh_result, source_context, validate_provenance,
)
from omero_analysis.workspace_sync import _item_marker_values


def item():
    return {"key": "result:" + "a" * 64, "kind": "png-image", "name": "counts__minimum=0.png", "sha256": "a" * 64,
            "metadata": {"analysisProvenance": {"version": 1, "outputName": "counts.png", "parameterKey": "settings-key",
                "notebook": {"id": "nb", "name": "counts.ipynb", "nameRecorded": True, "scriptSha256": "b" * 64},
                "run": {"id": "run-uuid", "mode": "cell", "cellIndex": 1, "startedAt": "2026-10-21T12:00:00Z",
                        "parameters": {"minimum": 0, "normalize": False, "channel": "", "optional": None}},
                "inputs": [{"inputId": "db", "name": "measurements.duckdb", "annotationId": 752, "originalFileId": 900}]}}}


WORKSPACE = {"id": "w", "name": "SolHunt", "sourceObjectType": "Screen", "sourceObjectId": 152, "sourceObjectName": "SolHunt"}


def test_description_contains_recorded_settings_sources_and_script_without_run_uuid():
    value = item()
    validate_provenance(value["metadata"]["analysisProvenance"])
    text = description(value, WORKSPACE, "Screen: SolHunt (ID 152)\nPlate: Trial5 (ID 253)")
    for expected in ["Screen: SolHunt", "Plate: Trial5", "counts.ipynb", "cell 2", "minimum = 0", "normalize = false", 'channel = ""', "optional = null", "measurements.duckdb", "FileAnnotation 752"]:
        assert expected in text
    assert "run-uuid" not in text
    values = _item_marker_values("w", value)
    assert values["notebook_run_id"] == "run-uuid"
    assert values["notebook_script_sha256"] == "b" * 64
    assert values["parameter.minimum"] == "0"
    assert values["parameter.normalize"] == "false"
    assert json.loads(values["analysis_provenance"])["run"]["parameters"]["optional"] is None


def test_missing_history_is_not_reported_as_current_defaults():
    value = item()
    value["metadata"]["analysisProvenance"]["run"]["parameters"] = None
    value["metadata"]["analysisProvenance"]["notebook"].update(nameRecorded=False, scriptSha256=None)
    text = description(value, WORKSPACE, "Screen 152")
    assert "not substituted" in text
    assert "name at execution was not recorded" in text
    assert "not recorded for this older run" in text


def test_replaces_only_managed_description_and_preserves_user_notes():
    value = item()
    generated = description(value, WORKSPACE, "Screen 152")
    previous = f"My notes\n{BEGIN}\nold block\n{END}\nReview note"
    merged = merge_description(previous, generated, value, "operation")
    assert merged.startswith("My notes\n") and merged.endswith("\nReview note")
    assert merged.count(BEGIN) == 1 and "old block" not in merged
    assert merge_description(merged, generated, value, "operation") == merged
    legacy = f'OMERO Analysis synchronized item {value["key"]}. Source SHA-256 {value["sha256"]}. Operation operation. Conversion: RGBA composited onto black.'
    merged = merge_description(legacy, generated, value, "operation")
    assert "Operation operation" not in merged
    assert "Conversion: RGBA" in merged


def test_source_screen_lists_plate_context_without_claiming_analysis_coverage():
    plate = SimpleNamespace(getName=lambda: "Trial5", getId=lambda: 253)
    screen = SimpleNamespace(getName=lambda: "SolHunt", getId=lambda: 152, listChildren=lambda: iter([plate]))
    text = source_context(screen, WORKSPACE)
    assert "Screen:152 — SolHunt" in text and "Plate:253 — Trial5" in text
    assert "selection may be narrower" in text


class Remote:
    def __init__(self, owner=7):
        self.name, self.text, self.owner, self.events = "old-uuid.png", "My note", owner, []
    def getName(self): return self.name
    def setName(self, value): self.name = value; self.events.append("name")
    def getDescription(self): return self.text
    def setDescription(self, value): self.text = value; self.events.append("description")
    def save(self): self.events.append("save")
    def unloadAnnotationLinks(self): self.events.append("unload")
    def getDetails(self): return SimpleNamespace(getOwner=lambda: SimpleNamespace(getId=lambda: self.owner))


def test_refresh_reuses_owned_object_records_identity_before_changes_and_is_repeatable():
    remote, value = Remote(), item()
    conn = SimpleNamespace(getUserId=lambda: 7)
    marker = lambda *args: remote.events.append("marker")
    values = _item_marker_values("w", value)
    refresh_result(conn, remote, value, WORKSPACE, "Screen 152", values, marker)
    assert remote.events[:2] == ["marker", "unload"]
    assert remote.name == value["name"] and remote.text.endswith("My note")
    remote.events.clear()
    refresh_result(conn, remote, value, WORKSPACE, "Screen 152", values, marker)
    assert remote.events == ["marker", "unload"]
    foreign = Remote(owner=99)
    refresh_result(conn, foreign, value, WORKSPACE, "Screen 152", values, marker)
    assert foreign.events == [] and foreign.name == "old-uuid.png"


@pytest.mark.parametrize("parameters", [{"x": []}, {"x": float("nan")}, {"x": float("inf")}])
def test_rejects_invalid_recorded_parameter_values(parameters):
    value = copy.deepcopy(item()["metadata"]["analysisProvenance"])
    value["run"]["parameters"] = parameters
    with pytest.raises(InvalidObject):
        validate_provenance(value)


def test_description_uses_declared_parameter_order_after_json_sorting():
    value = item()
    run = value["metadata"]["analysisProvenance"]["run"]
    run["parameterOrder"] = ["channel", "minimum", "optional", "normalize"]
    validate_provenance(value["metadata"]["analysisProvenance"])
    text = description(value, WORKSPACE, "Screen 152")
    assert text.index('channel = ""') < text.index("minimum = 0") < text.index("optional = null") < text.index("normalize = false")
    run["parameterOrder"] = ["missing"]
    with pytest.raises(InvalidObject):
        validate_provenance(value["metadata"]["analysisProvenance"])


def test_file_rename_saves_description_with_an_unloaded_original_file_reference(monkeypatch):
    import sys
    original = Remote()
    original.getId = lambda: 99
    annotation = Remote()
    annotation.getFile = lambda: original
    references = []
    annotation._obj = SimpleNamespace(setFile=references.append)
    monkeypatch.setitem(sys.modules, "omero.model", SimpleNamespace(OriginalFileI=lambda identity, loaded: (identity, loaded)))
    value = item()
    value["kind"] = "result"
    value["name"] = "counts__0.csv"
    refresh_result(SimpleNamespace(getUserId=lambda: 7), annotation, value, WORKSPACE, "Screen 152", _item_marker_values("w", value), lambda *args: pytest.fail("Annotations cannot have child annotations"))
    assert original.name == "counts__0.csv"
    assert references == [(99, False)]
    assert "Parameters actually used" in annotation.text


def test_large_utf8_marker_values_reference_complete_manifest_metadata():
    import hashlib
    from omero_analysis.workspace_sync import _manifest_for, INVENTORY_SCHEMA
    value = item()
    value["metadata"]["analysisProvenance"]["run"]["parameters"]["long_setting"] = "μ" * 3000
    value["metadata"]["sources"] = [{"fileId": "source-" + str(i), "name": "source-" + str(i)} for i in range(100)]
    original = copy.deepcopy(value)
    markers = _item_marker_values("w", value)
    assert all(len(str(entry).encode("utf-8")) <= 1024 for entry in markers.values())
    for key in ("analysis_provenance", "source_references", "notebook_parameters", "parameter.long_setting"):
        reference = json.loads(markers[key])
        assert reference["storage"] == "workspace-manifest"
        assert reference["item_key"] == value["key"] and reference["field"] == key
        assert len(reference["sha256"]) == 64
    serialized = json.dumps(value["metadata"]["analysisProvenance"], ensure_ascii=False, separators=(",", ":"))
    assert json.loads(markers["analysis_provenance"])["sha256"] == hashlib.sha256(serialized.encode("utf-8")).hexdigest()
    assert markers["parameter.minimum"] == "0" and markers["parameter.normalize"] == "false"
    manifest = _manifest_for({"schema": INVENTORY_SCHEMA, "workspace": WORKSPACE, "digest": "d", "items": [value]}, 1, [value])
    assert manifest["items"][0]["metadata"] == original["metadata"]
    assert value == original
