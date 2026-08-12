"""Validation for the literal portable notebook contract."""

from __future__ import annotations

import json
import math
import re
from pathlib import PurePosixPath
from typing import Any

PROTOCOL_SCHEMA = "nl.bioimaging.omero-analysis-notebook.v1"
QUERY_FORMATS = {"duckdb", "sqlite", "sqlite3", "csv"}
PARAMETER_TYPES = {"boolean", "integer", "number", "string", "choice"}
PACKAGE_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]*(?:[<>=!~]=?.+)?$")
APPROVED_PACKAGES = {
    "duckdb",
    "matplotlib",
    "numpy",
    "pandas",
    "pyarrow",
    "pypdf",
    "python-calamine",
    "scikit-image",
    "scipy",
    "seaborn",
    "xlrd",
}


class ProtocolError(ValueError):
    """Raised when a portable notebook contract is invalid."""


def load_contract(value: str | dict[str, Any]) -> dict[str, Any]:
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
        except json.JSONDecodeError as exc:
            raise ProtocolError(f"Configuration is not literal JSON: {exc.msg}") from exc
    elif isinstance(value, dict):
        parsed = value
    else:
        raise ProtocolError("Configuration must be a JSON string or object")
    return validate_contract(parsed)


def _portable_path(value: Any, field: str, prefix: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ProtocolError(f"{field} must be a non-empty relative path")
    path = PurePosixPath(value.replace("\\", "/"))
    if path.is_absolute() or ".." in path.parts or not path.parts or path.parts[0] != prefix:
        raise ProtocolError(f"{field} must stay inside {prefix}/")
    return str(path)


def _parameter(value: Any, index: int, known_inputs: set[str]) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ProtocolError(f"parameters[{index}] must be an object")
    name = value.get("name")
    kind = value.get("type")
    if not isinstance(name, str) or not re.fullmatch(r"[A-Za-z][A-Za-z0-9_]{0,63}", name):
        raise ProtocolError(f"parameters[{index}].name is invalid")
    if kind not in PARAMETER_TYPES:
        raise ProtocolError(f"Parameter {name} has unsupported type {kind!r}")
    if kind == "boolean" and "default" in value and not isinstance(value["default"], bool):
        raise ProtocolError(f"Parameter {name} default must be boolean")
    if kind == "integer" and "default" in value and (
        not isinstance(value["default"], int) or isinstance(value["default"], bool)
    ):
        raise ProtocolError(f"Parameter {name} default must be integer")
    if kind == "number" and "default" in value and (
        not isinstance(value["default"], (int, float)) or isinstance(value["default"], bool)
        or not math.isfinite(value["default"])
    ):
        raise ProtocolError(f"Parameter {name} default must be numeric")
    if kind in {"integer", "number"}:
        for key in ("minimum", "maximum", "step"):
            if key in value and (
                not isinstance(value[key], (int, float)) or isinstance(value[key], bool)
            ):
                raise ProtocolError(f"Parameter {name} {key} must be numeric")
        if value.get("minimum") is not None and value.get("maximum") is not None:
            if value["minimum"] > value["maximum"]:
                raise ProtocolError(f"Parameter {name} minimum exceeds maximum")
        if value.get("step", 1) <= 0:
            raise ProtocolError(f"Parameter {name} step must be positive")
    if kind == "string" and "default" in value and not isinstance(value["default"], str):
        raise ProtocolError(f"Parameter {name} default must be a string")
    if kind == "choice":
        if "default" in value and not isinstance(value["default"], (str, int, float, bool)):
            raise ProtocolError(f"Parameter {name} default must be scalar")
        choices = value.get("choices")
        query = value.get("choices_query")
        if choices is not None and (
            not isinstance(choices, list) or not choices or
            any(not isinstance(item, (str, int, float, bool)) for item in choices)
        ):
            raise ProtocolError(f"Parameter {name} choices must be a non-empty scalar list")
        if query is not None:
            if not isinstance(query, dict):
                raise ProtocolError(f"Parameter {name} choices_query must be an object")
            if query.get("source") not in known_inputs:
                raise ProtocolError(f"Parameter {name} choices_query source is unknown")
            sql = query.get("sql")
            limit = query.get("limit", 100)
            if not isinstance(sql, str) or not sql.strip():
                raise ProtocolError(f"Parameter {name} choices_query sql is required")
            for key in ("value_column", "label_column"):
                if query.get(key) is not None and not isinstance(query[key], str):
                    raise ProtocolError(f"Parameter {name} choices_query {key} must be a string")
            if not isinstance(limit, int) or isinstance(limit, bool) or not 1 <= limit <= 1000:
                raise ProtocolError(f"Parameter {name} choices_query limit must be 1..1000")
            _validate_select(sql)
        if choices is None and query is None:
            raise ProtocolError(f"Parameter {name} requires choices or choices_query")
    return dict(value)


def _validate_select(sql: str) -> None:
    clean = re.sub(r"--[^\n]*|/\*.*?\*/", " ", sql, flags=re.S).strip()
    if ";" in clean.rstrip(";") or not re.match(r"^(select|with)\b", clean, re.I):
        raise ProtocolError("Queries must contain one SELECT or WITH … SELECT statement")
    if re.search(
        r"\b(attach|copy|pragma|install|load|export|import|create|alter|drop|insert|update|delete|"
        r"merge|call|vacuum|checkpoint|set|reset)\b",
        clean,
        re.I,
    ):
        raise ProtocolError("Query contains a prohibited operation")
    if re.search(
        r"\b(read_csv|read_csv_auto|read_parquet|read_json|sqlite_scan|postgres_scan|"
        r"httpfs|delta_scan|iceberg_scan|shell|system)\s*\(",
        clean,
        re.I,
    ):
        raise ProtocolError("Query contains a prohibited file or external function")


def validate_contract(value: dict[str, Any]) -> dict[str, Any]:
    if value.get("schema") != PROTOCOL_SCHEMA:
        raise ProtocolError(f"schema must equal {PROTOCOL_SCHEMA}")
    raw_inputs = value.get("inputs")
    if not isinstance(raw_inputs, list) or not raw_inputs:
        raise ProtocolError("inputs must be a non-empty list")
    identifiers: set[str] = set()
    inputs: list[dict[str, Any]] = []
    for index, raw in enumerate(raw_inputs):
        if not isinstance(raw, dict):
            raise ProtocolError(f"inputs[{index}] must be an object")
        identifier = raw.get("id")
        kind = raw.get("kind")
        if not isinstance(identifier, str) or not re.fullmatch(r"[a-z][a-z0-9_-]{0,63}", identifier):
            raise ProtocolError(f"inputs[{index}].id is invalid")
        if identifier in identifiers:
            raise ProtocolError(f"Duplicate input id: {identifier}")
        identifiers.add(identifier)
        if kind not in {"query", "file"}:
            raise ProtocolError(f"Input {identifier} kind must be query or file")
        item = dict(raw)
        item["path"] = _portable_path(raw.get("path"), f"Input {identifier} path", "input")
        item["required"] = raw.get("required", True)
        if not isinstance(item["required"], bool):
            raise ProtocolError(f"Input {identifier} required must be boolean")
        if kind == "query":
            formats = raw.get("formats")
            if not isinstance(formats, list) or not formats or not set(formats) <= QUERY_FORMATS:
                raise ProtocolError(f"Input {identifier} formats are invalid")
            item["formats"] = list(dict.fromkeys(formats))
        else:
            extensions = raw.get("extensions")
            if not isinstance(extensions, list) or not extensions or any(
                not isinstance(ext, str) or not re.fullmatch(r"\.[A-Za-z0-9][A-Za-z0-9._-]*", ext)
                for ext in extensions
            ):
                raise ProtocolError(f"Input {identifier} extensions are invalid")
            item["extensions"] = [ext.lower() for ext in extensions]
        inputs.append(item)
    results = value.get("results")
    if not isinstance(results, dict):
        raise ProtocolError("results must be an object")
    normalized_results = dict(results)
    normalized_results["path"] = _portable_path(results.get("path"), "results.path", "results")
    parameters_raw = value.get("parameters", [])
    if not isinstance(parameters_raw, list):
        raise ProtocolError("parameters must be a list")
    parameters = [_parameter(item, index, identifiers) for index, item in enumerate(parameters_raw)]
    names = [item["name"] for item in parameters]
    if len(names) != len(set(names)):
        raise ProtocolError("Parameter names must be unique")
    requirements = value.get("requirements", [])
    if not isinstance(requirements, list) or any(
        not isinstance(item, str) or not PACKAGE_PATTERN.fullmatch(item) for item in requirements
    ):
        raise ProtocolError("requirements must contain valid package requirement strings")
    unsupported = sorted({
        re.split(r"[<>=!~]", item, maxsplit=1)[0].lower().replace("_", "-").replace(".", "-")
        for item in requirements
    } - APPROVED_PACKAGES)
    if unsupported:
        raise ProtocolError(
            "Unsupported package requirement(s): " + ", ".join(unsupported)
        )
    return {
        **value,
        "schema": PROTOCOL_SCHEMA,
        "inputs": inputs,
        "results": normalized_results,
        "parameters": parameters,
        "requirements": list(dict.fromkeys(requirements)),
    }


def validate_parameter_values(
    contract: dict[str, Any], supplied: dict[str, Any]
) -> dict[str, bool | int | float | str | None]:
    known = {item["name"] for item in contract.get("parameters", [])}
    unknown = sorted(set(supplied) - known)
    if unknown:
        raise ProtocolError("Unknown parameter value(s): " + ", ".join(unknown))
    values: dict[str, bool | int | float | str | None] = {}
    for item in contract.get("parameters", []):
        name = item["name"]
        value = supplied.get(name, item.get("default"))
        kind = item["type"]
        if value is None:
            values[name] = None
            continue
        if kind == "boolean" and not isinstance(value, bool):
            raise ProtocolError(f"Parameter {name} must be boolean")
        if kind == "integer" and (not isinstance(value, int) or isinstance(value, bool)):
            raise ProtocolError(f"Parameter {name} must be integer")
        if kind == "number" and (
            not isinstance(value, (int, float)) or isinstance(value, bool) or not math.isfinite(value)
        ):
            raise ProtocolError(f"Parameter {name} must be numeric")
        if kind == "string" and not isinstance(value, str):
            raise ProtocolError(f"Parameter {name} must be a string")
        if kind in {"integer", "number"}:
            if item.get("minimum") is not None and value < item["minimum"]:
                raise ProtocolError(f"Parameter {name} is below its minimum")
            if item.get("maximum") is not None and value > item["maximum"]:
                raise ProtocolError(f"Parameter {name} exceeds its maximum")
        if kind == "choice" and item.get("choices") and not any(
            type(option) is type(value) and option == value for option in item["choices"]
        ):
            raise ProtocolError(f"Parameter {name} is not an available choice")
        values[name] = value
    return values
