"""Reproducible cold/warm HTTP capacity probe using existing equivalent-format fixtures.

Starts its own worker/cache. Never purges or reconfigures the live OMERO worker.
Requires requests, psutil and DuckDB in the invoking Python environment.
"""
from __future__ import annotations
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
import math
import os
from pathlib import Path
import secrets
import socket
import subprocess
import tempfile
import threading
import time

import psutil
import requests
from generate_data_query_benchmark import generate, FILENAMES


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--worker-repo", type=Path, default=Path(__file__).resolve().parents[2] / "OMERO.DataQueryWorker")
    parser.add_argument("--rows", type=int, default=100_000)
    parser.add_argument("--repeats", type=int, default=3)
    parser.add_argument("--output", type=Path, default=Path("benchmark-data/capacity.json"))
    args = parser.parse_args()
    python = args.worker_repo / (".venv/Scripts/python.exe" if os.name == "nt" else ".venv/bin/python")
    records = []
    with tempfile.TemporaryDirectory(prefix="dqw-capacity-") as temporary:
        root = Path(temporary)
        generate(root / "fixtures", args.rows, 10_000)
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
        token = secrets.token_urlsafe(32)
        env = {**os.environ, "DQW_API_TOKEN": token, "DQW_TOKEN_KEYRING_FILE": "",
               "DQW_CACHE_DIR": str(root / "cache"), "DQW_QUERY_TIMEOUT_SECONDS": "30",
               "DQW_MAX_CONCURRENT_QUERIES": "4", "DQW_MAX_RESULT_ROWS": "100000",
               "DQW_MAX_RESULT_BYTES": str(8 * 1024**2), "DQW_RESULT_CACHE_MAX_BYTES": str(16 * 1024**2),
               "DQW_SOURCE_CACHE_MAX_BYTES": str(256 * 1024**2), "PYTHONPATH": str(args.worker_repo / "src")}
        url = f"http://127.0.0.1:{port}"
        headers = {"Authorization": "Bearer " + token}
        with (root / "worker.log").open("w") as log:
            process = subprocess.Popen([str(python), "-m", "uvicorn", "omero_data_query_worker.app:app",
                                        "--host", "127.0.0.1", "--port", str(port)], env=env, stdout=log, stderr=log)
            try:
                for _ in range(120):
                    try:
                        if requests.get(url + "/health/ready", timeout=1).ok:
                            break
                    except requests.RequestException:
                        pass
                    if process.poll() is not None:
                        raise RuntimeError("Benchmark worker exited during startup")
                    time.sleep(.25)
                else:
                    raise RuntimeError("Benchmark worker did not become ready")
                capabilities = requests.get(url + "/v1/capabilities", headers=headers, timeout=5).json()
                for format_name, filename in FILENAMES.items():
                    path = root / "fixtures" / filename
                    started = time.perf_counter()
                    with path.open("rb") as source:
                        response = requests.post(url + "/v1/sources", headers=headers,
                            data={"scope_id": "capacity", "source_ref": format_name, "format": format_name,
                                  "size": str(path.stat().st_size)}, files={"file": (filename, source)}, timeout=180)
                    response.raise_for_status()
                    source_id = response.json()["source_id"]
                    ingestion_seconds = time.perf_counter() - started
                    table = "data" if format_name == "csv" else "measurements"
                    for kind, select in (("aggregate", f"SELECT class_label, count(*) AS n, avg(area) AS area FROM {table}"),
                                         ("full", f"SELECT * FROM {table}")):
                        for concurrency in (1, 2, 4, 8):
                            for repeat in range(args.repeats):
                                for temperature in ("cold", "warm"):
                                    barrier = threading.Barrier(concurrency)
                                    stopped = threading.Event()
                                    peak = [0]
                                    def sample():
                                        while not stopped.wait(.05):
                                            try:
                                                children = [psutil.Process(process.pid), *psutil.Process(process.pid).children(recursive=True)]
                                                peak[0] = max(peak[0], sum(p.memory_info().rss for p in children if p.is_running()))
                                            except psutil.Error:
                                                pass
                                    monitor = threading.Thread(target=sample)
                                    monitor.start()
                                    def query(index):
                                        sql = select + " WHERE $run = $run AND row_id >= $first"
                                        sql += " GROUP BY class_label" if kind == "aggregate" else " ORDER BY row_id"
                                        payload = {"sql": sql, "parameters": {
                                            "run": {"type": "string", "value": f"{kind}-{concurrency}-{repeat}"},
                                            "first": {"type": "integer", "value": index}}}
                                        barrier.wait(timeout=20)
                                        started = time.perf_counter()
                                        result = requests.post(url + f"/v1/sources/{source_id}/query", headers=headers, json=payload, timeout=40)
                                        detail = result.json()
                                        transferred = 0
                                        if result.ok:
                                            with requests.get(url + f"/v1/results/{detail['result_id']}/download", headers=headers, stream=True, timeout=40) as download:
                                                download.raise_for_status()
                                                digest = hashlib.sha256()
                                                for chunk in download.iter_content(1024 * 1024):
                                                    digest.update(chunk)
                                                    transferred += len(chunk)
                                                assert digest.hexdigest() == detail["execution"]["result_sha256"]
                                            assert transferred == detail["byte_count"]
                                        else:
                                            assert result.status_code in {413, 422, 429, 507}, result.status_code
                                        return {"seconds": time.perf_counter() - started, "http_status": result.status_code,
                                                "cache_status": detail.get("cache_status"), "error": detail.get("code"), "transfer_bytes": transferred}
                                    try:
                                        with ThreadPoolExecutor(max_workers=concurrency) as pool:
                                            results = list(pool.map(query, range(concurrency)))
                                    finally:
                                        stopped.set()
                                        monitor.join()
                                    status = requests.get(url + "/v1/cache/status", headers=headers, timeout=5).json()
                                    times = sorted(r["seconds"] for r in results)
                                    records.append({"format": format_name, "kind": kind, "concurrency": concurrency,
                                        "temperature": temperature, "repeat": repeat, "ingestion_seconds": ingestion_seconds,
                                        "p50_seconds": times[math.ceil(len(times) * .5) - 1], "p95_seconds": times[math.ceil(len(times) * .95) - 1],
                                        "peak_process_tree_rss_bytes": peak[0], "cache": status,
                                        "failures": sum(r["http_status"] != 200 for r in results), "requests": results})
                            print(f"{format_name} {kind} concurrency={concurrency} completed", flush=True)
                args.output.parent.mkdir(parents=True, exist_ok=True)
                args.output.write_text(json.dumps({"rows": args.rows, "capabilities": capabilities,
                    "cold_definition": "Distinct query parameters, ingested source; OS cache is not cleared",
                    "memory_definition": "Sampled sum of worker/child RSS, includes shared pages", "records": records}, indent=2))
            finally:
                # Windows venv launchers can exit before their Python child does.
                children = psutil.Process(process.pid).children(recursive=True) if process.poll() is None else []
                for child in reversed(children):
                    try:
                        child.terminate()
                    except psutil.NoSuchProcess:
                        pass
                process.terminate()
                try:
                    process.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()
                _, alive = psutil.wait_procs(children, timeout=10)
                for child in alive:
                    child.kill()
                psutil.wait_procs(alive, timeout=5)
    print(f"Capacity report: {args.output}")


if __name__ == "__main__":
    main()
