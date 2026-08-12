from __future__ import annotations

import asyncio
import sqlite3
import sys
from types import SimpleNamespace
from pathlib import Path

import duckdb
import pandas as pd
import pytest

from omero_analysis_notebook import configure


def make_contract(path: str, formats: list[str]) -> dict:
    return {
        "schema": "nl.bioimaging.omero-analysis-notebook.v1",
        "inputs": [{"id": "measurements", "kind": "query", "path": path, "formats": formats}],
        "results": {"path": "results"},
        "parameters": [{"name": "minimum", "type": "integer", "default": 2}],
        "requirements": [],
    }


@pytest.mark.parametrize("kind", ["duckdb", "sqlite", "csv"])
def test_offline_query_sources_and_results_mapping(tmp_path: Path, kind: str):
    inputs = tmp_path / "input"
    inputs.mkdir()
    if kind == "duckdb":
        path = inputs / "measurements.duckdb"
        connection = duckdb.connect(str(path))
        connection.execute("CREATE TABLE data(value INTEGER)")
        connection.execute("INSERT INTO data VALUES (1), (2), (3)")
        connection.close()
        formats = ["duckdb"]
    elif kind == "sqlite":
        path = inputs / "measurements.sqlite"
        connection = sqlite3.connect(path)
        connection.execute("CREATE TABLE data(value INTEGER)")
        connection.executemany("INSERT INTO data VALUES (?)", [(1,), (2,), (3,)])
        connection.commit()
        connection.close()
        formats = ["sqlite"]
    else:
        path = inputs / "measurements.csv"
        pd.DataFrame({"value": [1, 2, 3]}).to_csv(path, index=False)
        formats = ["csv"]
    ctx = configure(make_contract(f"input/{path.name}", formats), project_root=tmp_path)
    result = asyncio.run(ctx.query("measurements", "SELECT * FROM data WHERE value >= $minimum", {"minimum": 2}))
    assert result["value"].tolist() == [2, 3]
    assert ctx.results == tmp_path / "results"


def test_query_rejects_mutation(tmp_path: Path):
    inputs = tmp_path / "input"
    inputs.mkdir()
    path = inputs / "measurements.csv"
    path.write_text("value\n1\n", encoding="utf-8")
    ctx = configure(make_contract("input/measurements.csv", ["csv"]), project_root=tmp_path)
    with pytest.raises(ValueError):
        asyncio.run(ctx.query("measurements", "DELETE FROM data"))

    with pytest.raises(ValueError, match="file or external"):
        asyncio.run(ctx.query("measurements", "SELECT * FROM read_csv('/etc/passwd')"))


def test_database_backed_widget_choices_are_bounded(tmp_path: Path, monkeypatch):
    inputs = tmp_path / "input"
    inputs.mkdir()
    path = inputs / "measurements.csv"
    path.write_text("channel,label\n1,DAPI\n2,GFP\n", encoding="utf-8")
    contract = make_contract("input/measurements.csv", ["csv"])
    contract["parameters"] = [{
        "name": "channel",
        "type": "choice",
        "choices_query": {
            "source": "measurements",
            "sql": "SELECT channel, label FROM data ORDER BY channel",
            "limit": 10,
            "value_column": "channel",
            "label_column": "label",
        },
    }]

    class Widget:
        def __init__(self, **kwargs):
            self.__dict__.update(kwargs)

        def observe(self, *_args, **_kwargs):
            return None

    class VBox:
        def __init__(self, children):
            self.children = children

    fake_widgets = SimpleNamespace(
        Checkbox=Widget, IntSlider=Widget, FloatSlider=Widget,
        Dropdown=Widget, Text=Widget, VBox=VBox,
    )
    monkeypatch.setitem(sys.modules, "ipywidgets", fake_widgets)
    monkeypatch.setattr("IPython.display.display", lambda _value: None)

    ctx = configure(contract, project_root=tmp_path)
    box = ctx.display_parameters()
    assert box.children[0].options == [("DAPI", 1), ("GFP", 2)]
    assert ctx.params["channel"] == 1
