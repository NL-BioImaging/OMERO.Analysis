"""Actual HTTP compatibility matrix. Opt in with DQW_RUN_INTEGRATION=1."""
from __future__ import annotations

import importlib.util
import json
import os
import socket
import subprocess
import sys
import time
import types
from contextlib import contextmanager
from pathlib import Path
from types import SimpleNamespace

import pytest
import requests

from omero_analysis.data_query import DataQueryBroker

from .conftest import FakeAnnotation

pytestmark = pytest.mark.skipif(os.getenv("DQW_RUN_INTEGRATION") != "1",
                                reason="Set DQW_RUN_INTEGRATION=1 for HTTP version matrix")
TOKEN = "contract-test-service-token-only"


@pytest.fixture(scope="module")
def repositories():
    analysis = Path(__file__).resolve().parents[1]
    worker = Path(os.getenv("DQW_REPO", str(analysis.parent / "OMERO.DataQueryWorker")))
    fixture = worker / "tests/fixtures/compatibility"
    return worker, fixture, json.loads((fixture / "v1.json").read_text(encoding="utf-8"))


@pytest.fixture(scope="module")
def old_broker(repositories):
    _, fixture, _ = repositories
    name = "omero_analysis._contract_baseline_broker"
    module = types.ModuleType(name)
    module.__package__ = "omero_analysis"
    exec(compile((fixture / "analysis_broker_v013.txt").read_text(encoding="utf-8"), name, "exec"), module.__dict__)
    return module.DataQueryBroker


@pytest.fixture(scope="module")
def old_worker(repositories, tmp_path_factory):
    worker, _, contract = repositories
    destination = tmp_path_factory.mktemp("old-worker")
    files = subprocess.check_output(["git", "-C", str(worker), "ls-tree", "-r", "--name-only",
                                      contract["worker_commit"], "src"], text=True).splitlines()
    for name in files:
        path = destination / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(subprocess.check_output(["git", "-C", str(worker), "show",
                                                 contract["worker_commit"] + ":" + name]))
    return destination


@contextmanager
def serve(worker, source, cache):
    python = os.getenv("DQW_PYTHON") or str(worker / ".venv" / ("Scripts/python.exe" if os.name == "nt" else "bin/python"))
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        port = sock.getsockname()[1]
    env = {**os.environ, "PYTHONPATH": str(source / "src"), "DQW_API_TOKEN": TOKEN,
           "DQW_CACHE_DIR": str(cache), "TMPDIR": str(cache / "tmp"),
           "DQW_QUERY_TIMEOUT_SECONDS": "15", "DQW_MAX_RESULT_ROWS": "10000"}
    env.pop("DQW_TOKEN_KEYRING_FILE", None)
    cache.mkdir(parents=True, exist_ok=True)
    (cache / "tmp").mkdir(exist_ok=True)
    log = (cache.parent / (cache.name + "-worker.log")).open("ab")
    process = subprocess.Popen([python, "-m", "uvicorn", "omero_data_query_worker.app:app",
                                "--host", "127.0.0.1", "--port", str(port), "--no-access-log"],
                               cwd=source, env=env, stdout=log, stderr=log)
    url = f"http://127.0.0.1:{port}"
    try:
        for _ in range(150):
            if process.poll() is not None:
                raise RuntimeError("Worker exited; inspect " + log.name)
            try:
                if requests.get(url + "/health/ready", timeout=.5).ok:
                    break
            except requests.RequestException:
                pass
            time.sleep(.1)
        else:
            raise RuntimeError("Worker did not become ready")
        yield url
    finally:
        if os.name == "nt":
            subprocess.run(["taskkill", "/PID", str(process.pid), "/T", "/F"], capture_output=True)
        process.terminate()
        try:
            process.wait(timeout=20)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait()
        log.close()


@pytest.fixture(scope="module", params=["current", "baseline"])
def worker_url(request, repositories, old_worker, tmp_path_factory):
    worker, _, _ = repositories
    with serve(worker, worker if request.param == "current" else old_worker,
               tmp_path_factory.mktemp("http-cache")) as url:
        yield url, request.param


@pytest.mark.parametrize("broker_version", ["current", "baseline"])
@pytest.mark.parametrize("format_name", ["duckdb", "sqlite", "sqlite3", "csv"])
def test_broker_http_contract(settings, worker_url, old_broker, broker_version, format_name, tmp_path):
    import sqlite3
    import duckdb
    url, worker_version = worker_url
    settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_URL = url
    settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_TOKEN = TOKEN
    path = tmp_path / ("measurements." + format_name)
    if format_name == "csv":
        path.write_bytes('id,area,label\n1,10.5,alpha\n2,20.5,"é,""beta"""\n'.encode())
    else:
        connection = duckdb.connect(str(path)) if format_name == "duckdb" else sqlite3.connect(path)
        connection.execute("CREATE TABLE measurements(id INTEGER, area DOUBLE, label VARCHAR)")
        connection.executemany("INSERT INTO measurements VALUES (?, ?, ?)", [(1, 10.5, "alpha"), (2, 20.5, 'é,"beta"')])
        if format_name != "duckdb":
            connection.commit()
        connection.close()
    annotation = FakeAnnotation(11, path.name, path.read_bytes())
    info = SimpleNamespace(name=path.name, size=path.stat().st_size, mimetype="application/octet-stream")
    broker = (DataQueryBroker if broker_version == "current" else old_broker)()
    capabilities = broker.capabilities()
    assert capabilities["ready"] and capabilities["capability"] == "omero-data-query-v1"
    if broker_version == "current":
        assert capabilities["features"]["result_promotion_v1"] == (worker_version == "current")
    scope, reference = "contract", f"{broker_version}-{format_name}"
    table = "data" if format_name == "csv" else "measurements"
    schema = broker.schema(annotation, info, scope, reference)
    assert "source_id" not in schema and schema["tables"][0]["name"] == table
    payload = {"sql": f"SELECT id, area FROM {table} WHERE area >= $minimum ORDER BY id",
               "parameters": {"minimum": {"type": "float", "value": 10.0}}}
    result, result_id = broker.query(annotation, info, scope, reference, payload)
    assert result["row_count"] == 2 and "result_id" not in result
    response = broker.download(result_id)
    try:
        assert response.content == b"id,area\n1,10.5\n2,20.5\n"
        assert len(response.content) == result["byte_count"]
    finally:
        response.close()
    assert broker.query(annotation, info, scope, reference, payload)[0]["cache_status"] == "hit"
    empty, empty_id = broker.query(annotation, info, scope, reference,
                                   {"sql": f"SELECT label FROM {table} WHERE 1=0", "parameters": {}})
    assert empty["row_count"] == 0
    volatile = {"sql": "SELECT random() AS value", "parameters": {}}
    assert broker.query(annotation, info, scope, reference, volatile)[0]["cache_status"] == "bypass"


def test_worker_rollback_with_candidate_cache(settings, repositories, old_worker, tmp_path):
    worker, _, _ = repositories
    source_ids = []
    for source in (worker, old_worker, worker):
        with serve(worker, source, tmp_path / "rollback") as url:
            settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_URL = url
            settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_TOKEN = TOKEN
            broker = DataQueryBroker()
            annotation = FakeAnnotation(11, "data.csv", b"id\n1\n")
            info = SimpleNamespace(name="data.csv", size=5, mimetype="text/csv")
            resolved = broker._source(annotation, info, "rollback", "source")
            source_ids.append(resolved["source_id"])
            result, result_id = broker.query(annotation, info, "rollback", "source",
                                              {"sql": "SELECT * FROM data", "parameters": {}})
            assert result["preview"] == [[1]]
    assert len(set(source_ids)) == 1
