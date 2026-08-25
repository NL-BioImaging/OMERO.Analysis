"""Build the portable remote DataQueryWorker benchmark notebook."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

BENCHMARK_FORMATS = ("duckdb", "sqlite", "csv")


CONTRACT = {
    "schema": "nl.bioimaging.omero-analysis-notebook.v1",
    "inputs": [
        {"id": "duckdb", "kind": "query", "path": "input/dataquery-benchmark.duckdb", "formats": ["duckdb"], "required": True},
        {"id": "sqlite", "kind": "query", "path": "input/dataquery-benchmark.sqlite", "formats": ["sqlite"], "required": True},
        {"id": "csv", "kind": "query", "path": "input/dataquery-benchmark.csv", "formats": ["csv"], "required": True},
    ],
    "results": {"path": "results"},
    "parameters": [
        {"name": "run_id", "type": "string", "default": "local-baseline-001", "label": "Unique benchmark run ID"},
        {"name": "maximum_rows", "type": "integer", "default": 4_000_000, "minimum": 1, "maximum": 4_000_000, "help": "Use a smaller value only for local smoke validation."},
        {"name": "run_full_results", "type": "boolean", "default": True},
    ],
    "requirements": ["pandas", "matplotlib"],
}


SETUP = r'''import gc
import json
import math
import platform
import time
from datetime import datetime, timezone

import matplotlib.pyplot as plt
import pandas as pd

FORMATS = ("duckdb", "sqlite", "csv")
_maximum_rows = int(ctx.params["maximum_rows"])
SIZES = tuple(size for size in (1_000_000, 2_000_000, 4_000_000) if size <= _maximum_rows)
if not SIZES:
    SIZES = (_maximum_rows,)
EXPECTED_COLUMNS = [
    "row_id", "plate_id", "well_id", "field_id", "object_id", "class_label",
    "area", "mean_intensity", "max_intensity", "eccentricity"
]
records = []
blocked_full_formats = set()

def table_for(format_name):
    return "data" if format_name == "csv" else "measurements"

def expected_row(row_id):
    mean_intensity = ((row_id * 17) % 65_536) / 10.0
    return {
        "row_id": row_id, "plate_id": row_id % 16, "well_id": row_id % 384,
        "field_id": row_id % 9, "object_id": row_id,
        "class_label": f"class_{row_id % 8}",
        "area": ((row_id * 13) % 100_000) / 100.0,
        "mean_intensity": mean_intensity,
        "max_intensity": mean_intensity + ((row_id * 19) % 1_000) / 10.0,
        "eccentricity": ((row_id * 23) % 1_000) / 1_000,
    }

def validate_full(frame, row_count):
    assert list(frame.columns) == EXPECTED_COLUMNS
    assert len(frame) == row_count
    for index in (0, row_count // 2, row_count - 1):
        actual = frame.iloc[index].to_dict()
        expected = expected_row(index)
        for key, value in expected.items():
            if isinstance(value, float):
                assert math.isclose(float(actual[key]), value, rel_tol=1e-9, abs_tol=1e-9)
            else:
                assert actual[key] == value

def record_case(format_name, size, query_type, repetition, started, frame=None, error=None):
    metrics = dict(frame.attrs.get("omero_analysis_query", {})) if frame is not None else {}
    records.append({
        "run_id": str(ctx.params["run_id"]), "format": format_name,
        "rows_requested": size, "query_type": query_type,
        "repetition": repetition, "temperature": "cold" if repetition == 0 else "warm",
        "status": "failed" if error else "passed", "error": str(error) if error else "",
        "notebook_wall_ms": (time.perf_counter() - started) * 1000,
        **metrics,
    })

def checkpoint():
    snapshot = pd.DataFrame(records)
    snapshot.to_csv(ctx.results / "dataquery-benchmark-results.csv", index=False)
    (ctx.results / "dataquery-benchmark-results.json").write_text(
        json.dumps({"environment": environment, "records": records}, indent=2, default=str),
        encoding="utf-8",
    )
    return snapshot

environment = {
    "recorded_at": datetime.now(timezone.utc).isoformat(),
    "run_id": str(ctx.params["run_id"]),
    "maximum_rows": int(ctx.params["maximum_rows"]),
    "run_full_results": bool(ctx.params["run_full_results"]),
    "python": platform.python_version(),
    "platform": platform.platform(),
}
'''

RUN_HELPERS = r'''async def run_case(format_name, size, query_type, repetition):
    table = table_for(format_name)
    if query_type == "aggregate":
        sql = f"""SELECT $run_marker AS run_id, COUNT(*) AS row_count,
            MIN(row_id) AS minimum_row_id, MAX(row_id) AS maximum_row_id,
            SUM(row_id) AS row_id_sum, AVG(area) AS mean_area,
            AVG(mean_intensity) AS mean_intensity
            FROM {table} WHERE row_id < $maximum_row_id"""
    else:
        sql = f"SELECT * FROM {table} WHERE row_id < $maximum_row_id AND $run_marker = $run_marker ORDER BY row_id"
    started = time.perf_counter()
    frame = None
    try:
        frame = await ctx.query(format_name, sql, {"maximum_row_id": size, "run_marker": str(ctx.params["run_id"])})
        if query_type == "aggregate":
            assert len(frame) == 1
            assert int(frame.iloc[0]["row_count"]) == size
            assert int(frame.iloc[0]["minimum_row_id"]) == 0
            assert int(frame.iloc[0]["maximum_row_id"]) == size - 1
            assert int(frame.iloc[0]["row_id_sum"]) == size * (size - 1) // 2
        else:
            validate_full(frame, size)
        record_case(format_name, size, query_type, repetition, started, frame=frame)
    except Exception as error:
        record_case(format_name, size, query_type, repetition, started, frame=frame, error=error)
        if query_type == "full":
            blocked_full_formats.add(format_name)
    finally:
        del frame
        gc.collect()

async def run_group(query_type, size, formats):
    if query_type == "full" and not bool(ctx.params["run_full_results"]):
        return checkpoint()
    for format_name in formats:
        if query_type == "full" and format_name in blocked_full_formats:
            records.append({
                "run_id": str(ctx.params["run_id"]), "format": format_name,
                "rows_requested": size, "query_type": query_type, "repetition": 0,
                "temperature": "cold", "status": "skipped",
                "error": "A smaller full-result case failed for this format"
            })
            continue
        for repetition in range(4):
            await run_case(format_name, size, query_type, repetition)
    return checkpoint()
'''

RUN_AGGREGATES = r'''for size in SIZES:
    await run_group("aggregate", size, FORMATS)
pd.DataFrame(records)
'''


def full_group_source(size: int, format_name: str) -> str:
    return f'''if {size} in SIZES:
    await run_group("full", {size}, ("{format_name}",))
pd.DataFrame(records)
'''

REPORT = r'''results = checkpoint()

passed = results[results["status"] == "passed"].copy()
if not passed.empty:
    passed["seconds"] = pd.to_numeric(passed["notebook_wall_ms"], errors="coerce") / 1000
    summary = passed.groupby(["query_type", "format", "rows_requested", "temperature"], as_index=False).agg(
        runs=("seconds", "count"), median_seconds=("seconds", "median"),
        minimum_seconds=("seconds", "min"), maximum_seconds=("seconds", "max")
    )
    summary.to_csv(ctx.results / "dataquery-benchmark-summary.csv", index=False)
    for query_type in summary["query_type"].unique():
        for temperature in ("cold", "warm"):
            subset = summary[
                (summary["query_type"] == query_type)
                & (summary["temperature"] == temperature)
            ]
            if subset.empty:
                continue
            figure, axis = plt.subplots(figsize=(8, 4.5))
            for format_name, group in subset.groupby("format"):
                axis.plot(group["rows_requested"] / 1_000_000, group["median_seconds"], marker="o", label=format_name)
            axis.set(title=f"{query_type.title()} query {temperature}-cache median", xlabel="Rows (millions)", ylabel="Seconds")
            axis.grid(alpha=0.25)
            axis.legend()
            figure.tight_layout()
            figure.savefig(ctx.results / f"dataquery-benchmark-{query_type}-{temperature}.png", dpi=150)
            plt.close(figure)
else:
    summary = pd.DataFrame()

failures = results[results["status"] != "passed"]
print(f"Recorded {len(results)} cases: {len(passed)} passed, {len(failures)} failed or skipped")
summary
'''


def code_cell(identifier: str, source: str, tags: list[str] | None = None) -> dict:
    metadata = {"tags": tags} if tags else {}
    return {"id": identifier, "cell_type": "code", "metadata": metadata, "execution_count": None, "outputs": [], "source": source}


def build_notebook() -> dict:
    contract_json = json.dumps(CONTRACT, separators=(",", ":"))
    configure = f"import omero_analysis_notebook as oan\nctx = oan.configure(r'''{contract_json}''')\nctx.display_parameters()\n"
    return {
        "nbformat": 4,
        "nbformat_minor": 5,
        "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}, "language_info": {"name": "python", "version": "3"}},
        "cells": [
            code_cell("omero-analysis-config", configure, ["omero-analysis-config"]),
            {"id": "introduction", "cell_type": "markdown", "metadata": {}, "source": "# Remote DataQueryWorker large-result benchmark\n\nTests aggregate scans and complete 10-column transfers at 1M, 2M, and 4M rows. Use a new run ID for each baseline."},
            code_cell("benchmark-setup", SETUP),
            code_cell("benchmark-helpers", RUN_HELPERS),
            code_cell("benchmark-aggregates", RUN_AGGREGATES),
            *[
                code_cell(
                    f"benchmark-full-smoke-{format_name}",
                    f'''if SIZES and SIZES[0] not in (1_000_000, 2_000_000, 4_000_000):
    await run_group("full", SIZES[0], ("{format_name}",))
pd.DataFrame(records)
''',
                )
                for format_name in BENCHMARK_FORMATS
            ],
            *[
                code_cell(
                    f"benchmark-full-{size}-{format_name}",
                    full_group_source(size, format_name),
                )
                for size in (1_000_000, 2_000_000, 4_000_000)
                for format_name in BENCHMARK_FORMATS
            ],
            code_cell("benchmark-report", REPORT),
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("docs/examples/portable-notebooks/dataquery-worker-large-benchmark.ipynb"))
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(build_notebook(), indent=1) + "\n", encoding="utf-8")
    print(f"Wrote {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
