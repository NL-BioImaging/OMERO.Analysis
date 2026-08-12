"""Notebook inspection, sanitization, scaffolding, and safe conversion helpers."""

from __future__ import annotations

import ast
import copy
import json
import re
from pathlib import Path
from typing import Any

from .protocol import PROTOCOL_SCHEMA, ProtocolError, load_contract

CONFIG_TAG = "omero-analysis-config"


def read_notebook(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise ProtocolError(f"Cannot read notebook: {exc}") from exc
    if not isinstance(value, dict) or value.get("nbformat") != 4 or not isinstance(value.get("cells"), list):
        raise ProtocolError("Only nbformat 4 notebooks are supported")
    return value


def extract_contract(document: dict[str, Any]) -> dict[str, Any] | None:
    marked = [
        cell for cell in document["cells"]
        if cell.get("cell_type") == "code" and CONFIG_TAG in cell.get("metadata", {}).get("tags", [])
    ]
    if not marked:
        return None
    if len(marked) != 1 or document["cells"][0] is not marked[0]:
        raise ProtocolError("The configuration cell must be the first cell and uniquely tagged")
    source = "".join(marked[0].get("source", [])) if isinstance(marked[0].get("source"), list) else str(marked[0].get("source", ""))
    tree = ast.parse(source)
    calls = [node for node in ast.walk(tree) if isinstance(node, ast.Call)]
    for call in calls:
        if isinstance(call.func, ast.Attribute) and call.func.attr == "configure" and call.args:
            try:
                literal = ast.literal_eval(call.args[0])
            except (ValueError, SyntaxError) as exc:
                raise ProtocolError("configure() must receive literal JSON") from exc
            return load_contract(literal)
    raise ProtocolError("Marked configuration cell must call oan.configure(literal_json)")


def sanitize(document: dict[str, Any]) -> dict[str, Any]:
    clean = copy.deepcopy(document)
    clean.setdefault("metadata", {}).pop("widgets", None)
    for cell in clean["cells"]:
        if cell.get("cell_type") == "code":
            cell["execution_count"] = None
            cell["outputs"] = []
    return clean


def inspect(document: dict[str, Any]) -> dict[str, Any]:
    sources = [
        "".join(cell.get("source", [])) if isinstance(cell.get("source"), list) else str(cell.get("source", ""))
        for cell in document["cells"] if cell.get("cell_type") == "code"
    ]
    code = "\n".join(sources)
    contract = extract_contract(document)
    return {
        "protocol": contract.get("schema") if contract else None,
        "legacy": contract is None,
        "paths": sorted(set(re.findall(r"[\"']((?:input|results)[/\\][^\"']+)[\"']", code))),
        "imports": sorted(set(re.findall(r"^(?:from|import)\s+([A-Za-z0-9_.-]+)", code, re.M))),
        "widgets": bool(re.search(r"\b(?:ipywidgets|widgets\.)", code)),
        "direct_database_access": bool(re.search(r"\b(?:duckdb|sqlite3)\s*\.\s*connect\s*\(", code)),
        "unsafe_sql": bool(re.search(r"(?<!\.)\b(?:ATTACH|COPY|PRAGMA|INSTALL|LOAD|CREATE|DROP|INSERT|UPDATE|DELETE)\b", code, re.I)),
        "unbounded_queries": [line.strip() for line in code.splitlines() if re.search(r"\b(?:select|with)\b", line, re.I) and "limit" not in line.lower()][:20],
        "outputs": sorted(set(re.findall(r"(?:savefig|to_csv)\s*\(\s*([^,\n)]+)", code))),
    }


def starter_document() -> dict[str, Any]:
    contract = {
        "schema": PROTOCOL_SCHEMA,
        "inputs": [
            {"id": "measurements", "kind": "query", "path": "input/measurements.duckdb", "formats": ["duckdb", "sqlite", "sqlite3", "csv"], "required": True}
        ],
        "results": {"path": "results"},
        "parameters": [{"name": "minimum_count", "type": "integer", "default": 1, "minimum": 0, "label": "Minimum count"}],
        "requirements": ["pandas", "matplotlib"],
    }
    literal = json.dumps(contract, indent=2)
    return {
        "nbformat": 4,
        "nbformat_minor": 5,
        "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}, "language_info": {"name": "python"}},
        "cells": [
            {"id": "omero-analysis-config", "cell_type": "code", "metadata": {"tags": [CONFIG_TAG]}, "execution_count": None, "outputs": [], "source": f'import omero_analysis_notebook as oan\nctx = oan.configure(r\'\'\'{literal}\'\'\')\nctx.display_parameters()\n'},
            {"id": "analysis", "cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": 'result = await ctx.query("measurements", "SELECT * FROM data LIMIT 100")\nresult\n'},
            {"id": "results", "cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": 'output = ctx.results / "summary.csv"\nresult.to_csv(output, index=False)\noutput\n'},
        ],
    }


def safe_convert(document: dict[str, Any]) -> tuple[dict[str, Any], list[str]]:
    converted = sanitize(document)
    if extract_contract(converted) is None:
        converted["cells"].insert(0, starter_document()["cells"][0])
    report = inspect(converted)
    semantic = []
    if report["direct_database_access"]:
        semantic.append("Replace direct database connections with await ctx.query(...); SQL semantics require review.")
    if report["widgets"]:
        semantic.append("Replace ipywidgets with protocol parameter declarations.")
    if report["unbounded_queries"]:
        semantic.append("Bound or aggregate queries before transferring rows to pandas.")
    if not report["outputs"]:
        semantic.append("Write durable outputs below ctx.results.")
    return converted, semantic
