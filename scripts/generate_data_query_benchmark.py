"""Generate equivalent large DuckDB, SQLite, and CSV benchmark fixtures."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import sqlite3
import time
from collections.abc import Iterator
from pathlib import Path
from typing import Any

FILENAMES = {
    "csv": "dataquery-benchmark.csv",
    "duckdb": "dataquery-benchmark.duckdb",
    "sqlite": "dataquery-benchmark.sqlite",
}
TABLE = "measurements"
COLUMNS = (
    "row_id",
    "plate_id",
    "well_id",
    "field_id",
    "object_id",
    "class_label",
    "area",
    "mean_intensity",
    "max_intensity",
    "eccentricity",
)


def benchmark_row(row_id: int) -> tuple[Any, ...]:
    mean_intensity = ((row_id * 17) % 65_536) / 10.0
    return (
        row_id,
        row_id % 16,
        row_id % 384,
        row_id % 9,
        row_id,
        f"class_{row_id % 8}",
        ((row_id * 13) % 100_000) / 100.0,
        mean_intensity,
        mean_intensity + ((row_id * 19) % 1_000) / 10.0,
        ((row_id * 23) % 1_000) / 1_000,
    )


def row_chunks(rows: int, chunk_size: int) -> Iterator[list[tuple[Any, ...]]]:
    for start in range(0, rows, chunk_size):
        yield [benchmark_row(index) for index in range(start, min(rows, start + chunk_size))]


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def _samples(rows: int) -> list[list[Any]]:
    indexes = sorted({0, rows // 2, rows - 1}) if rows else []
    return [list(benchmark_row(index)) for index in indexes]


def _validate_database(path: Path, format_name: str, rows: int) -> dict[str, Any]:
    if format_name == "duckdb":
        import duckdb

        connection = duckdb.connect(str(path), read_only=True)
    else:
        connection = sqlite3.connect(f"file:{path.as_posix()}?mode=ro", uri=True)
    try:
        count, minimum, maximum = connection.execute(
            f"SELECT COUNT(*), MIN(row_id), MAX(row_id) FROM {TABLE}"
        ).fetchone()
        if int(count) != rows:
            raise RuntimeError(f"{path.name} contains {count} rows, expected {rows}")
        if minimum != 0 or maximum != rows - 1:
            raise RuntimeError(f"{path.name} has an unexpected row_id range")
        columns = [
            str(item[1])
            for item in connection.execute(f"PRAGMA table_info('{TABLE}')").fetchall()
        ]
        if columns != list(COLUMNS):
            raise RuntimeError(f"{path.name} has unexpected columns: {columns}")
        return {"row_count": int(count), "minimum_row_id": minimum, "maximum_row_id": maximum}
    finally:
        connection.close()


def generate(output_dir: Path, rows: int, chunk_size: int, force: bool = False) -> Path:
    if rows < 1:
        raise ValueError("rows must be positive")
    if chunk_size < 1:
        raise ValueError("chunk_size must be positive")
    output_dir.mkdir(parents=True, exist_ok=True)
    paths = {name: output_dir / filename for name, filename in FILENAMES.items()}
    manifest_path = output_dir / "dataquery-benchmark-manifest.json"
    existing = [path for path in (*paths.values(), manifest_path) if path.exists()]
    if existing and not force:
        names = ", ".join(path.name for path in existing)
        raise FileExistsError(f"Refusing to overwrite existing benchmark files: {names}")
    if force:
        for path in (*paths.values(), manifest_path):
            if path.is_file():
                path.unlink()

    timings: dict[str, float] = {}
    started = time.perf_counter()
    sqlite_connection = sqlite3.connect(paths["sqlite"])
    try:
        sqlite_connection.execute("PRAGMA journal_mode=OFF")
        sqlite_connection.execute("PRAGMA synchronous=OFF")
        sqlite_connection.execute(
            f"""CREATE TABLE {TABLE} (
                row_id INTEGER NOT NULL, plate_id INTEGER NOT NULL,
                well_id INTEGER NOT NULL, field_id INTEGER NOT NULL,
                object_id INTEGER NOT NULL, class_label TEXT NOT NULL,
                area REAL NOT NULL, mean_intensity REAL NOT NULL,
                max_intensity REAL NOT NULL, eccentricity REAL NOT NULL
            )"""
        )
        placeholders = ",".join("?" for _ in COLUMNS)
        with paths["csv"].open("w", encoding="utf-8", newline="") as csv_handle:
            writer = csv.writer(csv_handle, lineterminator="\n")
            writer.writerow(COLUMNS)
            for chunk in row_chunks(rows, chunk_size):
                writer.writerows(chunk)
                sqlite_connection.executemany(
                    f"INSERT INTO {TABLE} VALUES ({placeholders})", chunk
                )
        sqlite_connection.commit()
    finally:
        sqlite_connection.close()
    timings["csv_and_sqlite_seconds"] = time.perf_counter() - started

    duckdb_started = time.perf_counter()
    import duckdb

    duckdb_connection = duckdb.connect(str(paths["duckdb"]))
    try:
        escaped_csv = str(paths["csv"].resolve()).replace("'", "''")
        duckdb_connection.execute(
            f"""CREATE TABLE {TABLE} (
                row_id BIGINT, plate_id INTEGER, well_id INTEGER,
                field_id INTEGER, object_id BIGINT, class_label VARCHAR,
                area DOUBLE, mean_intensity DOUBLE, max_intensity DOUBLE,
                eccentricity DOUBLE
            )"""
        )
        duckdb_connection.execute(
            f"COPY {TABLE} FROM '{escaped_csv}' (FORMAT CSV, HEADER TRUE)"
        )
        duckdb_connection.execute("CHECKPOINT")
    finally:
        duckdb_connection.close()
    timings["duckdb_seconds"] = time.perf_counter() - duckdb_started

    validations = {
        name: _validate_database(path, name, rows)
        for name, path in paths.items()
        if name != "csv"
    }
    with paths["csv"].open("r", encoding="utf-8", newline="") as handle:
        header = next(csv.reader(handle))
    if header != list(COLUMNS):
        raise RuntimeError("CSV fixture has unexpected columns")
    validations["csv"] = {"row_count": rows, "minimum_row_id": 0, "maximum_row_id": rows - 1}

    manifest = {
        "schema": "nl.bioimaging.omero-analysis-data-query-benchmark.v1",
        "table": TABLE,
        "csv_table_in_worker": "data",
        "row_count": rows,
        "column_count": len(COLUMNS),
        "columns": list(COLUMNS),
        "samples": _samples(rows),
        "engine_versions": {"duckdb": duckdb.__version__, "sqlite": sqlite3.sqlite_version},
        "capacity_probe": {"concurrency": [1, 2, 4, 8], "temperatures": ["cold", "warm"],
                           "command": "python scripts/benchmark_query_capacity.py --rows " + str(rows)},
        "timings": timings,
        "files": {
            name: {
                "name": path.name,
                "bytes": path.stat().st_size,
                "sha256": _sha256(path),
                "validation": validations[name],
            }
            for name, path in paths.items()
        },
    }
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return manifest_path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=Path("benchmark-data"))
    parser.add_argument("--rows", type=int, default=10_000_000)
    parser.add_argument("--chunk-size", type=int, default=10_000)
    parser.add_argument("--force", action="store_true")
    arguments = parser.parse_args()
    manifest = generate(arguments.output_dir, arguments.rows, arguments.chunk_size, arguments.force)
    print(f"Generated benchmark fixtures; manifest: {manifest}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
