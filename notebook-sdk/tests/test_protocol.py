from __future__ import annotations

import json
from pathlib import Path

import pytest

from omero_analysis_notebook.notebook import extract_contract, inspect, sanitize, starter_document
from omero_analysis_notebook.protocol import ProtocolError, load_contract, validate_parameter_values


def contract() -> dict:
    return {
        "schema": "nl.bioimaging.omero-analysis-notebook.v1",
        "inputs": [
            {
                "id": "measurements",
                "kind": "query",
                "path": "input/measurements.duckdb",
                "formats": ["duckdb", "sqlite", "sqlite3", "csv"],
            },
            {
                "id": "template",
                "kind": "file",
                "path": "input/template.xlsx",
                "extensions": [".xlsx"],
            },
        ],
        "results": {"path": "results"},
        "parameters": [
            {"name": "enabled", "type": "boolean", "default": True},
            {"name": "threshold", "type": "number", "default": 1.5, "minimum": 0, "step": 0.1},
            {"name": "mode", "type": "choice", "default": "a", "choices": ["a", "b"]},
            {
                "name": "channel",
                "type": "choice",
                "choices_query": {
                    "source": "measurements",
                    "sql": "SELECT DISTINCT channel_name FROM channels LIMIT 100",
                    "limit": 100,
                },
            },
        ],
        "requirements": ["pandas", "matplotlib"],
    }


def test_valid_contract_normalizes_paths_and_extensions():
    value = load_contract(json.dumps(contract()))
    assert value["inputs"][1]["extensions"] == [".xlsx"]
    assert value["results"]["path"] == "results"


@pytest.mark.parametrize("path", ["../input/data.csv", "/input/data.csv", "other/data.csv"])
def test_paths_must_stay_in_declared_directory(path: str):
    value = contract()
    value["inputs"][0]["path"] = path
    with pytest.raises(ProtocolError):
        load_contract(value)


def test_choices_query_must_be_bounded_and_safe():
    value = contract()
    value["parameters"][-1]["choices_query"]["sql"] = "DELETE FROM channels"
    with pytest.raises(ProtocolError, match="SELECT"):
        load_contract(value)


def test_config_cell_is_literal_first_and_unique():
    document = starter_document()
    assert extract_contract(document)["schema"].endswith(".v1")
    document["cells"].insert(0, {"cell_type": "markdown", "metadata": {}, "source": "x"})
    with pytest.raises(ProtocolError, match="first cell"):
        extract_contract(document)


def test_sanitize_removes_output_and_widget_state():
    document = starter_document()
    document["metadata"]["widgets"] = {"state": {}}
    document["cells"][0]["execution_count"] = 3
    document["cells"][0]["outputs"] = [{"output_type": "stream", "text": "secret"}]
    clean = sanitize(document)
    assert "widgets" not in clean["metadata"]
    assert clean["cells"][0]["execution_count"] is None
    assert clean["cells"][0]["outputs"] == []


def test_inspection_flags_semantic_conversion_work():
    document = starter_document()
    document["cells"][1]["source"] = "import duckdb\nimport ipywidgets\nduckdb.connect('input/x.duckdb')"
    report = inspect(document)
    assert report["widgets"] is True
    assert report["direct_database_access"] is True


def test_inspection_does_not_treat_dataframe_copy_as_sql_copy():
    document = starter_document()
    document["cells"][1]["source"] = "frame = frame.copy()"
    assert inspect(document)["unsafe_sql"] is False


def test_contract_rejects_package_outside_browser_allowlist():
    value = contract()
    value["requirements"] = ["requests>=2"]
    with pytest.raises(ProtocolError, match="Unsupported package"):
        load_contract(value)


def test_runtime_parameter_values_are_typed_and_bounded():
    value = load_contract(contract())
    with pytest.raises(ProtocolError, match="threshold is below"):
        validate_parameter_values(value, {"threshold": -1})
