"""Real 10,000,000-row / 2-GiB boundaries, through Analysis's HTTP broker."""
import argparse
import hashlib
import json
from pathlib import Path
import time
from types import SimpleNamespace

from query_gate_support import WorkerContainer, LocalAnnotation, configure_broker


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--image", default="omero-data-query-worker:recovery")
    parser.add_argument("--fixtures", type=Path, default=Path("benchmark-data/10m"))
    parser.add_argument("--output", type=Path, default=Path("benchmark-data/export-boundaries.jsonl"))
    args = parser.parse_args()
    if args.output.exists():
        parser.error("Choose a new evidence file")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with WorkerContainer(args.image) as worker:
        configure_broker(worker)
        from omero_analysis.data_query import DataQueryBroker
        from omero_analysis.errors import RemoteQueryFailed
        broker = DataQueryBroker()
        path = args.fixtures / "dataquery-benchmark.duckdb"
        info = SimpleNamespace(name=path.name, size=path.stat().st_size, mimetype="application/octet-stream")
        annotation = LocalAnnotation(path)
        cases = [
            ("rows_exact", "SELECT row_id FROM measurements", 10_000_000, None, False),
            ("rows_over", "SELECT row_id FROM measurements UNION ALL SELECT 10000000 AS row_id", None, None, True),
            ("bytes_exact", "SELECT repeat('x', CASE WHEN row_id = 0 THEN 4093 ELSE 4095 END) AS v FROM measurements WHERE row_id < 524288", 524288, 2 * 1024**3, False),
            ("bytes_over", "SELECT repeat('x', CASE WHEN row_id = 0 THEN 4094 ELSE 4095 END) AS v FROM measurements WHERE row_id < 524288", None, None, True),
        ]
        for name, sql, rows, size, rejected in cases:
            item = {"case": name, "status": "failed"}
            start = time.monotonic()
            try:
                try:
                    result, identifier = broker.query(annotation, info, "boundary-gate", "duckdb", {"sql": sql, "parameters": {}})
                except RemoteQueryFailed as exc:
                    assert rejected and exc.worker_status == 413 and exc.worker_code == "query_limit_exceeded", str(exc)
                    item["worker_code"] = exc.worker_code
                else:
                    assert not rejected
                    assert result["row_count"] == rows
                    if size is not None:
                        assert result["byte_count"] == size
                    digest, transferred = hashlib.sha256(), 0
                    with broker.download(identifier) as response:
                        for chunk in response.iter_content(1024 * 1024):
                            transferred += len(chunk)
                            digest.update(chunk)
                    assert transferred == result["byte_count"]
                    assert digest.hexdigest() == result["execution"]["result_sha256"]
                    item.update(row_count=rows, byte_count=transferred, sha256=digest.hexdigest())
                assert worker.observation()["cache"]["active_queries"] == 0
                item["status"] = "passed"
            finally:
                item["seconds"] = time.monotonic() - start
                with args.output.open("a", encoding="utf-8") as handle:
                    handle.write(json.dumps(item) + "\n")
                print(json.dumps(item), flush=True)
        broker.session.close()


if __name__ == "__main__":
    main()
