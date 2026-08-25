import csv
import json
import sqlite3

import duckdb
import pytest

from scripts.generate_data_query_benchmark import COLUMNS, benchmark_row, generate


def test_generator_creates_equivalent_small_fixtures(tmp_path):
    manifest_path = generate(tmp_path, rows=1_003, chunk_size=127)
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    assert manifest["row_count"] == 1_003
    assert manifest["column_count"] == 10
    assert manifest["columns"] == list(COLUMNS)
    assert manifest["samples"] == [
        list(benchmark_row(0)),
        list(benchmark_row(501)),
        list(benchmark_row(1_002)),
    ]

    with (tmp_path / "dataquery-benchmark.csv").open(newline="", encoding="utf-8") as handle:
        csv_rows = list(csv.reader(handle))
    assert csv_rows[0] == list(COLUMNS)
    assert len(csv_rows) == 1_004

    duck = duckdb.connect(str(tmp_path / "dataquery-benchmark.duckdb"), read_only=True)
    sqlite = sqlite3.connect(tmp_path / "dataquery-benchmark.sqlite")
    try:
        query = "SELECT COUNT(*), SUM(row_id), SUM(area) FROM measurements"
        duck_result = duck.execute(query).fetchone()
        sqlite_result = sqlite.execute(query).fetchone()
        assert duck_result == pytest.approx(sqlite_result)
    finally:
        duck.close()
        sqlite.close()


def test_generator_refuses_to_overwrite_without_force(tmp_path):
    generate(tmp_path, rows=10, chunk_size=4)
    with pytest.raises(FileExistsError, match="Refusing to overwrite"):
        generate(tmp_path, rows=10, chunk_size=4)

    generate(tmp_path, rows=12, chunk_size=5, force=True)
    manifest = json.loads(
        (tmp_path / "dataquery-benchmark-manifest.json").read_text(encoding="utf-8")
    )
    assert manifest["row_count"] == 12
