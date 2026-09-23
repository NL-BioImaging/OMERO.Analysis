"""Command-line interface for portable notebook projects."""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

from .notebook import extract_contract, inspect, read_notebook, safe_convert, sanitize, starter_document
from .protocol import ProtocolError


def _write(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def _schema_requirement(path: Path) -> dict | None:
    if not path.is_file():
        return None
    suffix = path.suffix.lower()
    tables: list[dict] = []
    if suffix == ".duckdb":
        import duckdb

        connection = duckdb.connect(str(path), read_only=True)
        try:
            names = [row[0] for row in connection.execute(
                "SELECT table_name FROM information_schema.tables "
                "WHERE table_schema='main' ORDER BY table_name"
            ).fetchall()]
            for name in names:
                escaped = name.replace('"', '""')
                columns = [
                    {"name": row[0], "type": row[1]}
                    for row in connection.execute(f'DESCRIBE SELECT * FROM "{escaped}"').fetchall()
                ]
                tables.append({"name": name, "columns": columns})
        finally:
            connection.close()
    elif suffix in {".sqlite", ".sqlite3"}:
        import sqlite3

        connection = sqlite3.connect(f"file:{path.as_posix()}?mode=ro", uri=True)
        try:
            names = [row[0] for row in connection.execute(
                "SELECT name FROM sqlite_master WHERE type IN ('table','view') ORDER BY name"
            ).fetchall()]
            for name in names:
                escaped = name.replace('"', '""')
                columns = [
                    {"name": row[1], "type": row[2] or ""}
                    for row in connection.execute(f'PRAGMA table_info("{escaped}")').fetchall()
                ]
                tables.append({"name": name, "columns": columns})
        finally:
            connection.close()
    elif suffix == ".csv":
        import pandas as pd

        frame = pd.read_csv(path, nrows=1000)
        tables = [{
            "name": "data",
            "columns": [{"name": str(name), "type": str(frame[name].dtype)} for name in frame.columns],
        }]
    else:
        return None
    canonical = json.dumps(tables, sort_keys=True, separators=(",", ":"))
    return {"tables": tables, "digest": hashlib.sha256(canonical.encode()).hexdigest()}


def command_new(path: Path) -> int:
    if path.exists():
        raise ProtocolError(f"Refusing to overwrite {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    (path.parent / "input").mkdir(exist_ok=True)
    (path.parent / "results").mkdir(exist_ok=True)
    _write(path, starter_document())
    print(f"Created {path}")
    return 0


def command_inspect(path: Path) -> int:
    print(json.dumps(inspect(read_notebook(path)), indent=2))
    return 0


def command_convert(path: Path, output: Path) -> int:
    if output.exists():
        raise ProtocolError(f"Refusing to overwrite {output}")
    converted, semantic = safe_convert(read_notebook(path))
    _write(output, converted)
    print(json.dumps({"output": str(output), "semantic_work": semantic}, indent=2))
    return 0


def command_validate(path: Path, write: bool) -> int:
    document = read_notebook(path)
    contract = extract_contract(document)
    if contract is None:
        raise ProtocolError("Notebook has no portable configuration cell")
    clean = sanitize(document)
    schema_requirements = {}
    for item in contract["inputs"]:
        if item["kind"] != "query":
            continue
        requirement = _schema_requirement((path.parent / item["path"]).resolve())
        if requirement:
            schema_requirements[item["id"]] = requirement
    clean.setdefault("metadata", {})["omero_analysis"] = {
        "protocol": contract["schema"],
        "validated_by": "omero-analysis-notebook/0.1.0",
        "requirements": contract.get("requirements", []),
        "input_requirements": [
            {key: item[key] for key in ("id", "kind", "formats", "extensions") if key in item}
            for item in contract["inputs"]
        ],
        "schema_requirements": schema_requirements,
    }
    if write:
        _write(path, clean)
    print(json.dumps({"valid": True, "protocol": contract["schema"], "written": write}, indent=2))
    return 0


def command_run(path: Path) -> int:
    command_validate(path, False)
    try:
        import nbformat
        from nbclient import NotebookClient
    except ImportError as exc:
        raise ProtocolError(
            "oan run requires nbclient/nbformat; install omero-analysis-notebook[run]"
        ) from exc
    with path.open("r", encoding="utf-8") as stream:
        document = nbformat.read(stream, as_version=4)
    NotebookClient(document, timeout=120, kernel_name="python3").execute(
        cwd=str(path.parent.resolve())
    )
    print(f"Executed {path} against {path.parent / 'input'}; outputs remain in results/")
    return 0


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(prog="oan")
    commands = root.add_subparsers(dest="command", required=True)
    new = commands.add_parser("new")
    new.add_argument("notebook", type=Path)
    inspect_command = commands.add_parser("inspect")
    inspect_command.add_argument("notebook", type=Path)
    convert = commands.add_parser("convert")
    convert.add_argument("notebook", type=Path)
    convert.add_argument("--output", required=True, type=Path)
    validate = commands.add_parser("validate")
    validate.add_argument("notebook", type=Path)
    validate.add_argument("--write", action="store_true")
    run = commands.add_parser("run")
    run.add_argument("notebook", type=Path)
    return root


def main(argv: list[str] | None = None) -> int:
    arguments = parser().parse_args(argv)
    try:
        if arguments.command == "new":
            return command_new(arguments.notebook)
        if arguments.command == "inspect":
            return command_inspect(arguments.notebook)
        if arguments.command == "convert":
            return command_convert(arguments.notebook, arguments.output)
        if arguments.command == "validate":
            return command_validate(arguments.notebook, arguments.write)
        return command_run(arguments.notebook)
    except ProtocolError as exc:
        print(f"oan: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
