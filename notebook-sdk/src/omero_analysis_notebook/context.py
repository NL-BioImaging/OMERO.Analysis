"""Runtime context used by portable notebooks when executed offline."""

from __future__ import annotations

import json
import os
import sqlite3
import time
from pathlib import Path
from typing import Any, Mapping

from .protocol import ProtocolError, _validate_select, load_contract, validate_parameter_values


class NotebookContext:
    def __init__(self, contract: dict[str, Any], project_root: Path | None = None):
        self.contract = contract
        self.project_root = (project_root or Path.cwd()).resolve()
        self.results = (self.project_root / contract["results"]["path"]).resolve()
        if self.project_root not in self.results.parents:
            raise ProtocolError("Results directory escapes the project")
        self.results.mkdir(parents=True, exist_ok=True)
        supplied = json.loads(os.environ.get("OAN_PARAMETERS", "{}"))
        if not isinstance(supplied, dict):
            raise ProtocolError("OAN_PARAMETERS must be a JSON object")
        self.params = validate_parameter_values(contract, supplied)
        self._inputs = {item["id"]: item for item in contract["inputs"]}

    def input(self, identifier: str) -> Path:
        try:
            item = self._inputs[identifier]
        except KeyError as exc:
            raise KeyError(f"Unknown notebook input: {identifier}") from exc
        path = (self.project_root / item["path"]).resolve()
        if self.project_root not in path.parents:
            raise ProtocolError("Input path escapes the project")
        if item.get("required", True) and not path.is_file():
            raise FileNotFoundError(f"Required notebook input is missing: {path}")
        return path

    def _query_sync(
        self,
        source: str,
        sql: str,
        parameters: Mapping[str, Any] | None = None,
    ):
        _validate_select(sql)
        item = self._inputs.get(source)
        if not item or item["kind"] != "query":
            raise KeyError(f"Unknown query source: {source}")
        path = self.input(source)
        suffix = path.suffix.lower()
        values = dict(parameters or {})
        import pandas as pd

        if suffix == ".duckdb":
            import duckdb

            connection = duckdb.connect(str(path), read_only=True)
            try:
                connection.execute("SET enable_external_access=false")
                connection.execute("SET autoinstall_known_extensions=false")
                connection.execute("SET autoload_known_extensions=false")
                return connection.execute(sql, values).fetchdf()
            finally:
                connection.close()
        if suffix in {".sqlite", ".sqlite3"}:
            connection = sqlite3.connect(f"file:{path.as_posix()}?mode=ro", uri=True)
            try:
                connection.execute("PRAGMA query_only=ON")
                denied = {
                    sqlite3.SQLITE_INSERT, sqlite3.SQLITE_UPDATE, sqlite3.SQLITE_DELETE,
                    sqlite3.SQLITE_CREATE_INDEX, sqlite3.SQLITE_CREATE_TABLE,
                    sqlite3.SQLITE_CREATE_TEMP_INDEX, sqlite3.SQLITE_CREATE_TEMP_TABLE,
                    sqlite3.SQLITE_CREATE_TEMP_TRIGGER, sqlite3.SQLITE_CREATE_TEMP_VIEW,
                    sqlite3.SQLITE_CREATE_TRIGGER, sqlite3.SQLITE_CREATE_VIEW,
                    sqlite3.SQLITE_DROP_INDEX, sqlite3.SQLITE_DROP_TABLE,
                    sqlite3.SQLITE_DROP_TEMP_INDEX, sqlite3.SQLITE_DROP_TEMP_TABLE,
                    sqlite3.SQLITE_DROP_TEMP_TRIGGER, sqlite3.SQLITE_DROP_TEMP_VIEW,
                    sqlite3.SQLITE_DROP_TRIGGER, sqlite3.SQLITE_DROP_VIEW,
                    sqlite3.SQLITE_ALTER_TABLE, sqlite3.SQLITE_REINDEX,
                    sqlite3.SQLITE_ANALYZE, sqlite3.SQLITE_ATTACH, sqlite3.SQLITE_DETACH,
                }
                connection.set_authorizer(
                    lambda action, _one, _two, _database, _trigger:
                    sqlite3.SQLITE_DENY if action in denied else sqlite3.SQLITE_OK
                )
                deadline = time.monotonic() + 30
                connection.set_progress_handler(
                    lambda: 1 if time.monotonic() > deadline else 0,
                    10_000,
                )
                return pd.read_sql_query(sql, connection, params=values)
            finally:
                connection.close()
        if suffix == ".csv":
            import duckdb

            connection = duckdb.connect(":memory:")
            try:
                connection.register("data", pd.read_csv(path))
                connection.execute("SET enable_external_access=false")
                connection.execute("SET autoinstall_known_extensions=false")
                connection.execute("SET autoload_known_extensions=false")
                return connection.execute(sql, values).fetchdf()
            finally:
                connection.close()
        raise ProtocolError(f"Unsupported query source extension: {suffix}")

    async def query(
        self,
        source: str,
        sql: str,
        parameters: Mapping[str, Any] | None = None,
    ):
        return self._query_sync(source, sql, parameters)

    def display_parameters(self):
        """Optionally display ipywidgets offline; Analysis renders its native form."""
        try:
            import ipywidgets as widgets
            from IPython.display import display
        except ImportError:
            return self.params
        controls = []
        for item in self.contract.get("parameters", []):
            name = item["name"]
            choices = item.get("choices")
            choices_query = item.get("choices_query")
            if item["type"] == "choice" and choices_query:
                sql = choices_query["sql"].rstrip().rstrip(";")
                frame = self._query_sync(
                    choices_query["source"],
                    f"SELECT * FROM ({sql}) AS choices LIMIT {choices_query.get('limit', 100)}",
                )
                value_column = choices_query.get("value_column") or str(frame.columns[0])
                if value_column not in frame.columns:
                    raise ProtocolError(
                        f"Parameter {name} choices_query value column is missing: {value_column}"
                    )
                values = frame[value_column].tolist()
                label_column = choices_query.get("label_column")
                if label_column:
                    if label_column not in frame.columns:
                        raise ProtocolError(
                            f"Parameter {name} choices_query label column is missing: {label_column}"
                        )
                    choices = list(zip(frame[label_column].astype(str).tolist(), values))
                else:
                    choices = values
                if values and self.params.get(name) not in values:
                    self.params[name] = values[0]
            common = {
                "description": item.get("label", name),
                "value": self.params.get(name),
            }
            kind = item["type"]
            if kind == "boolean":
                control = widgets.Checkbox(**common)
            elif kind == "integer":
                control = widgets.IntSlider(
                    min=item.get("minimum", 0), max=item.get("maximum", 100),
                    step=item.get("step", 1), **common
                )
            elif kind == "number":
                control = widgets.FloatSlider(
                    min=item.get("minimum", 0.0), max=item.get("maximum", 1.0),
                    step=item.get("step", 0.01), **common
                )
            elif kind == "choice" and choices:
                control = widgets.Dropdown(options=choices, **common)
            else:
                control = widgets.Text(**common)
            control.observe(lambda change, key=name: self.params.__setitem__(key, change["new"]), names="value")
            controls.append(control)
        box = widgets.VBox(controls)
        display(box)
        return box


def configure(contract: str | dict[str, Any], *, project_root: Path | None = None) -> NotebookContext:
    return NotebookContext(load_contract(contract), project_root=project_root)
