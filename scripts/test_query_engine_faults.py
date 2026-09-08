"""Actual engine OOM and persistent-cache restart gate in disposable containers."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import time
import tempfile
import sqlite3
import requests
from types import SimpleNamespace

from query_gate_support import WorkerContainer, LocalAnnotation, configure_broker


def counter(observation, name):
    return dict(line.split() for line in observation["cgroup"].get("memory.events", "").splitlines()).get(name, "0")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--image", default="omero-data-query-worker:recovery")
    parser.add_argument("--fixtures", type=Path, default=Path("benchmark-data/10m"))
    parser.add_argument("--output", type=Path, default=Path("benchmark-data/engine-faults.jsonl"))
    parser.add_argument("--repeats", type=int, default=3)
    parser.add_argument("--cases", nargs="+", default=["duckdb_limit", "duckdb_cgroup", "sqlite_cgroup", "csv_cgroup", "worker_oom", "restart"])
    args = parser.parse_args()
    if args.output.exists():
        parser.error("Choose a new evidence file")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    for case in args.cases:
        for repeat in range(args.repeats):
            item = {"case": case, "repeat": repeat, "status": "failed"}
            try:
                with WorkerContainer(args.image, memory="2g", engine_memory="32MB" if case == "duckdb_limit" else "8GB",
                                     timeout=60) as worker:
                    configure_broker(worker)
                    from omero_analysis.data_query import DataQueryBroker
                    fmt = "sqlite" if case == "sqlite_cgroup" else "duckdb"
                    path = args.fixtures / ("dataquery-benchmark." + fmt)
                    info = SimpleNamespace(name=path.name, size=path.stat().st_size, mimetype="application/octet-stream")
                    broker = DataQueryBroker()
                    source = broker._source(LocalAnnotation(path), info, "fault-gate", case)
                    good = {"sql": "SELECT COUNT(*) AS n FROM measurements", "parameters": {}}
                    baseline = broker._request("POST", f"/v1/sources/{source['source_id']}/query", json=good)
                    before = worker.observation()
                    if case == "worker_oom":
                        worker.group_oom()
                        worker.docker("update", "--memory", "320m", "--memory-swap", "320m", worker.name)
                        try:
                            with worker.request("POST", f"/v1/sources/{source['source_id']}/query", json={
                                "sql": "SELECT list(repeat(CAST(row_id AS VARCHAR), 10000)) FROM measurements WHERE row_id < 100000",
                                "parameters": {}}, timeout=90) as response:
                                raise AssertionError(f"Expected whole-worker OOM, got HTTP {response.status_code}")
                        except requests.RequestException as exc:
                            item["interrupted_request"] = type(exc).__name__
                        deadline = time.monotonic() + 15
                        while True:
                            state = json.loads(worker.docker("inspect", "--format", "{{json .State}}", worker.name).stdout)
                            if not state["Running"] or time.monotonic() >= deadline:
                                break
                            time.sleep(.1)
                        assert state["OOMKilled"] and not state["Running"], state
                        item["killed_state"] = state
                        worker.docker("update", "--memory", "2g", "--memory-swap", "2g", worker.name)
                        started = time.monotonic()
                        worker.docker("start", worker.name)
                        worker.ready()
                        broker.url = worker.url
                        item["recovery_seconds"] = time.monotonic() - started
                    elif case == "restart":
                        # Active source/result leases must not preserve incomplete publication after a kill.
                        query = {"sql": "SELECT * FROM measurements ORDER BY row_id", "parameters": {}}
                        with ThreadPoolExecutor(1) as pool:
                            future = pool.submit(worker.request, "POST", f"/v1/sources/{source['source_id']}/query", json=query)
                            deadline = time.monotonic() + 20
                            while time.monotonic() < deadline:
                                with worker.request("GET", "/v1/cache/status") as response:
                                    if response.json()["active_queries"]:
                                        break
                                time.sleep(.1)
                            else:
                                raise AssertionError("No active query to interrupt")
                            worker.docker("kill", "--signal", "KILL", worker.name)
                            try:
                                with future.result(timeout=15) as response:
                                    assert not response.ok
                            except Exception as exc:
                                item["interrupted_request"] = type(exc).__name__
                        started = time.monotonic()
                        worker.docker("start", worker.name)
                        worker.ready()
                        broker.url = worker.url
                        item["recovery_seconds"] = time.monotonic() - started
                    else:
                        if case != "duckdb_limit":
                            # Ingest first; force memory pressure specifically while the engine is working.
                            worker.docker("update", "--memory", "320m", "--memory-swap", "320m", worker.name)
                        if case == "csv_cgroup":
                            csv = args.fixtures / "dataquery-benchmark.csv"
                            csv_info = SimpleNamespace(name=csv.name, size=csv.stat().st_size, mimetype="text/csv")
                            try:
                                broker._source(LocalAnnotation(csv), csv_info, "fault-gate", "csv-oom")
                            except Exception as exc:
                                item["error"] = type(exc).__name__
                        else:
                            sql = ("SELECT group_concat(printf('%01024d', row_id), '') FROM measurements" if fmt == "sqlite" else
                                   "SELECT list(repeat(CAST(row_id AS VARCHAR), 10000)) FROM measurements WHERE row_id < 100000")
                            with worker.request("POST", f"/v1/sources/{source['source_id']}/query",
                                                json={"sql": sql, "parameters": {}}, timeout=90) as response:
                                item["http_status"] = response.status_code
                                detail = response.json()
                                item["worker_code"] = detail.get("code")
                                assert response.status_code == 422, detail
                                if case == "duckdb_limit":
                                    assert "memory" in detail.get("message", "").lower(), detail
                        # Restore allocation before checking recovery (the query/ingestion must have failed already).
                        worker.docker("update", "--memory", "2g", "--memory-swap", "2g", worker.name)
                        worker.ready(timeout=30)
                        after = worker.observation()
                        item["oom_kills"] = int(counter(after, "oom_kill")) - int(counter(before, "oom_kill"))
                        if case.endswith("cgroup"):
                            assert item["oom_kills"] > 0, "No actual kernel OOM; this does not pass the gate"
                        else:
                            assert item["oom_kills"] == 0
                    began = time.monotonic()
                    recovered = broker._request("POST", f"/v1/sources/{source['source_id']}/query", json=good)
                    assert recovered["row_count"] == baseline["row_count"]
                    assert recovered["execution"]["result_sha256"] == baseline["execution"]["result_sha256"]
                    # A cache hit alone does not prove that engine/admission slots recovered.
                    fresh = broker._request("POST", f"/v1/sources/{source['source_id']}/query", json={
                        "sql": "SELECT COUNT(*) AS n FROM measurements WHERE row_id >= $minimum",
                        "parameters": {"minimum": {"type": "integer", "value": repeat + 1}}})
                    assert fresh["preview"][0][0] == 10_000_000 - repeat - 1, fresh
                    with tempfile.TemporaryDirectory() as temporary:
                        upload = Path(temporary) / "recovery.sqlite"
                        database = sqlite3.connect(upload)
                        database.execute("CREATE TABLE data(id INTEGER, name TEXT)")
                        database.execute("INSERT INTO data VALUES (1, 'recovered')")
                        database.commit()
                        database.close()
                        upload_info = SimpleNamespace(name=upload.name, size=upload.stat().st_size, mimetype="application/octet-stream")
                        new_source = broker._source(LocalAnnotation(upload), upload_info, "fault-followup", str(repeat))
                        new_result = broker._request("POST", f"/v1/sources/{new_source['source_id']}/query", json={
                            "sql": "SELECT * FROM data", "parameters": {}})
                        assert new_result["row_count"] == 1
                    item["fresh_query_and_ingestion"] = "passed"
                    item["followup_seconds"] = time.monotonic() - began
                    assert item["followup_seconds"] < 30
                    with worker.request("GET", "/v1/cache/status") as response:
                        assert response.json()["active_queries"] == 0
                    staging = worker.docker("exec", worker.name, "python", "-c",
                        "from pathlib import Path; print(len(list(Path('/var/lib/omero-data-query-worker/tmp').iterdir())))")
                    assert staging.stdout.strip() == "0", staging.stdout
                    item["observation"] = worker.observation()
                    item["status"] = "passed"
                    broker.session.close()
            except Exception as exc:
                item["failure"] = str(exc)
                item["logs"] = getattr(worker, "last_logs", "")
                raise
            finally:
                with args.output.open("a", encoding="utf-8") as handle:
                    handle.write(json.dumps(item) + "\n")
                print(f"{case} repeat={repeat+1} {item['status']}", flush=True)


if __name__ == "__main__":
    main()
