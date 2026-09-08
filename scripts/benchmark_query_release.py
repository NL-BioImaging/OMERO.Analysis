"""Linux 10M-row export gate using the actual Analysis HTTP broker.

Generate fixtures first. Results are incrementally written outside disposable
containers. Nonzero exit means a required case failed; no failure is truncated.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
import math
import os
from pathlib import Path
import threading
import time
from types import SimpleNamespace

from query_gate_support import WorkerContainer, LocalAnnotation, configure_broker


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--image", default="omero-data-query-worker:recovery")
    parser.add_argument("--fixtures", type=Path, default=Path("benchmark-data/10m"))
    parser.add_argument("--output", type=Path, default=Path("benchmark-data/release-capacity.jsonl"))
    parser.add_argument("--repeats", type=int, default=3)
    parser.add_argument("--sizes", type=int, nargs="+", default=[1_000_000, 4_000_000, 10_000_000])
    parser.add_argument("--concurrency", type=int, nargs="+", default=[1, 2, 4, 8])
    parser.add_argument("--formats", nargs="+", default=["duckdb", "sqlite", "csv"])
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    if args.output.exists():
        parser.error("Output already exists; select a new evidence file")
    failures = []
    lock = threading.Lock()
    def report(value):
        with lock, args.output.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(value) + "\n")
            handle.flush()
            os.fsync(handle.fileno())
    with WorkerContainer(args.image) as worker:
        configure_broker(worker)
        from omero_analysis.data_query import DataQueryBroker
        from omero_analysis.errors import RemoteQueryFailed
        report({"event": "configuration", "image": args.image,
                "image_id": worker.docker("inspect", "--format", "{{.Image}}", worker.name).stdout.strip(),
                "limits": {k: v for k, v in worker.options.items() if k != "DQW_API_TOKEN"},
                "memory": worker.memory, "cpus": 2, "repeats": args.repeats,
                "cold_definition": "New result key, separately measured source ingestion; OS cache retained",
                "memory_definition": "Cgroup cumulative high-water mark, includes charged file cache"})
        with worker.request("GET", "/v1/capabilities") as response:
            response.raise_for_status()
            report({"event": "worker_capabilities", "value": response.json()})
        for fmt in args.formats:
            path = args.fixtures / ("dataquery-benchmark." + fmt)
            annotation = LocalAnnotation(path)
            info = SimpleNamespace(name=path.name, size=path.stat().st_size, mimetype="application/octet-stream")
            started = time.monotonic()
            broker = DataQueryBroker()
            source = broker._source(annotation, info, "release-gate", fmt)
            report({"event": "ingestion", "format": fmt, "seconds": time.monotonic() - started,
                    "source": source, "observation": worker.observation()})
            table = "data" if fmt == "csv" else "measurements"
            for size in args.sizes:
                for concurrency in args.concurrency:
                    for repeat in range(args.repeats):
                        for kind in ("aggregate", "full"):
                            for temperature in ("cold", "warm"):
                                barrier = threading.Barrier(concurrency)
                                def query(index):
                                    selected = "COUNT(*) AS n, SUM(row_id) AS sum_id" if kind == "aggregate" else "*"
                                    sql = f"SELECT {selected} FROM {table} WHERE row_id < $n AND $run = $run"
                                    if kind == "full":
                                        sql += " ORDER BY row_id"
                                    payload = {"sql": sql, "parameters": {
                                        "n": {"type": "integer", "value": size},
                                        "run": {"type": "string", "value": f"{size}-{concurrency}-{repeat}-{kind}-{index}"}}}
                                    client = DataQueryBroker()
                                    barrier.wait(timeout=30)
                                    began = time.monotonic()
                                    item = {"event": "request", "format": fmt, "rows_requested": size,
                                            "concurrency": concurrency, "repeat": repeat, "kind": kind,
                                            "temperature": temperature, "index": index}
                                    try:
                                        result, identifier = client.query(annotation, info, "release-gate", fmt, payload)
                                        item["query_seconds"] = time.monotonic() - began
                                        digest, transferred, lines = hashlib.sha256(), 0, 0
                                        with client.download(identifier) as response:
                                            for chunk in response.iter_content(1024 * 1024):
                                                digest.update(chunk)
                                                transferred += len(chunk)
                                                lines += chunk.count(b"\n")
                                        assert digest.hexdigest() == result["execution"]["result_sha256"]
                                        assert transferred == result["byte_count"]
                                        assert result["row_count"] == (1 if kind == "aggregate" else size)
                                        # Generator text contains no newlines; arbitrary quoting is covered separately.
                                        assert lines == result["row_count"] + 1
                                        if concurrency == 1 and temperature == "warm":
                                            assert result["cache_status"] == "hit"
                                        item.update(status="passed", transfer_bytes=transferred,
                                                    row_count=result["row_count"], cache_status=result["cache_status"],
                                                    sha256=digest.hexdigest())
                                    except RemoteQueryFailed as exc:
                                        code = getattr(exc, "worker_code", "")
                                        status = getattr(exc, "worker_status", None)
                                        expected = concurrency > 1 and status in (413, 429, 507)
                                        item.update(status="bounded_rejection" if expected else "failed", worker_code=code,
                                                    http_status=status, error_reason=str(exc).split("\n")[0])
                                        if not expected:
                                            failures.append(item)
                                    except Exception as exc:
                                        item.update(status="failed", error=type(exc).__name__)
                                        failures.append(item)
                                    finally:
                                        client.session.close()
                                    item["seconds"] = time.monotonic() - began
                                    report(item)
                                    return item
                                with ThreadPoolExecutor(max_workers=concurrency) as pool:
                                    results = list(pool.map(query, range(concurrency)))
                                successful = sorted(r["seconds"] for r in results if r["status"] == "passed")
                                report({"event": "batch", "format": fmt, "size": size, "concurrency": concurrency,
                                        "temperature": temperature, "kind": kind, "repeat": repeat,
                                        "success_count": len(successful), "failure_count": concurrency - len(successful),
                                        "p50_seconds": successful[math.ceil(len(successful)*.5)-1] if successful else None,
                                        "p95_seconds": successful[math.ceil(len(successful)*.95)-1] if successful else None,
                                        "observation": worker.observation()})
                                if failures:
                                    report({"event": "verdict", "status": "failed", "failures": len(failures)})
                                    raise SystemExit(1)
                        print(f"{fmt} rows={size} concurrency={concurrency} repeat={repeat+1} complete", flush=True)
            broker.session.close()
        report({"event": "verdict", "status": "failed" if failures else "passed", "failures": len(failures)})
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
