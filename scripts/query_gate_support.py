"""Disposable Docker worker used by the release gates, never the live cache."""
import json
import os
from pathlib import Path
import secrets
import subprocess
import time
import uuid

import requests


class WorkerContainer:
    def __init__(self, image, *, memory="2g", engine_memory="256MB", rows=10_000_000,
                 result_bytes=2 * 1024**3, result_cache=10 * 1024**3, timeout=900):
        self.name = "dqw-gate-" + uuid.uuid4().hex[:12]
        self.volume = self.name + "-cache"
        self.token = secrets.token_urlsafe(32)
        self.image, self.memory = image, memory
        self.options = {"DQW_API_TOKEN": self.token, "DQW_DUCKDB_MEMORY_LIMIT": engine_memory,
                        "DQW_MAX_RESULT_ROWS": str(rows), "DQW_MAX_RESULT_BYTES": str(result_bytes),
                        "DQW_QUERY_TIMEOUT_SECONDS": str(timeout), "DQW_INGESTION_TIMEOUT_SECONDS": "1800",
                        "DQW_SOURCE_CACHE_MAX_BYTES": str(12 * 1024**3),
                        "DQW_RESULT_CACHE_MAX_BYTES": str(result_cache), "DQW_DUCKDB_THREADS": "2"}

    def docker(self, *args, check=True):
        return subprocess.run(["docker", *args], text=True, encoding="utf-8", errors="replace",
                              capture_output=True, check=check)

    def __enter__(self):
        self.docker("volume", "create", self.volume)
        args = ["docker", "run", "-d", "--name", self.name, "--init", "--read-only",
                "--cap-drop", "ALL", "--security-opt", "no-new-privileges", "--pids-limit", "128",
                "--memory", self.memory, "--memory-swap", self.memory, "--cpus", "2",
                "--mount", f"type=volume,src={self.volume},dst=/var/lib/omero-data-query-worker",
                "--publish", "127.0.0.1::8080"]
        for key in self.options:
            args += ["--env", key]
        try:
            subprocess.run([*args, self.image], env={**os.environ, **self.options},
                           check=True, capture_output=True)
            port = self.docker("port", self.name, "8080/tcp").stdout.strip().rsplit(":", 1)[1]
            self.url = "http://127.0.0.1:" + port
            self.ready()
        except BaseException:
            self.__exit__(None, None, None)
            raise
        return self

    def ready(self, timeout=120):
        # Docker may reallocate an ephemeral published port after stop/start.
        port = self.docker("port", self.name, "8080/tcp").stdout.strip().rsplit(":", 1)[1]
        self.url = "http://127.0.0.1:" + port
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            try:
                with requests.get(self.url + "/health/ready", timeout=2) as response:
                    if response.ok:
                        return
            except requests.RequestException:
                pass
            time.sleep(.25)
        raise RuntimeError("Worker did not recover readiness within deadline")

    def request(self, method, path, **kwargs):
        return requests.request(method, self.url + path,
                                headers={"Authorization": "Bearer " + self.token},
                                timeout=kwargs.pop("timeout", 930), **kwargs)

    def observation(self):
        code = """import json,pathlib
r=pathlib.Path('/sys/fs/cgroup')
print(json.dumps({n:(r/n).read_text() for n in ('memory.current','memory.peak','memory.events','memory.stat','pids.current') if (r/n).exists()}))
"""
        result = self.docker("exec", self.name, "python", "-c", code, check=False)
        cgroup = json.loads(result.stdout) if result.returncode == 0 else {}
        state = json.loads(self.docker("inspect", "--format", "{{json .State}}", self.name).stdout)
        with self.request("GET", "/v1/cache/status", timeout=5) as response:
            cache = response.json()
        return {"cgroup": cgroup, "container": state, "cache": cache}

    def group_oom(self):
        """Set group OOM only on this UUID-named disposable worker's cgroup."""
        identity = json.loads(self.docker("inspect", self.name).stdout)[0]
        assert identity["Name"] == "/" + self.name and self.name.startswith("dqw-gate-")
        code = """import pathlib,sys
pid,identifier=sys.argv[1:]
assert len(identifier)==64 and all(c in '0123456789abcdef' for c in identifier)
line=next(x for x in pathlib.Path('/proc',pid,'cgroup').read_text().splitlines() if x.startswith('0::'))
relative=line.split('::',1)[1]
assert identifier in relative, 'Refusing an unrelated cgroup'
path=pathlib.Path('/sys/fs/cgroup') / relative.lstrip('/') / 'memory.oom.group'
path.write_text('1')
assert path.read_text().strip()=='1'
"""
        self.docker("run", "--rm", "--privileged", "--user", "0", "--pid", "host", "--cgroupns", "host",
                    "--network", "none", "--entrypoint", "python", self.image, "-c", code,
                    str(identity["State"]["Pid"]), identity["Id"])

    def __exit__(self, *_):
        self.last_logs = self.docker("logs", "--tail", "60", self.name, check=False).stderr
        self.docker("rm", "-f", self.name, check=False)
        self.docker("volume", "rm", self.volume, check=False)


class LocalAnnotation:
    def __init__(self, path):
        self.path = Path(path)

    def getFileInChunks(self):
        with self.path.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                yield chunk


def configure_broker(worker):
    from django.conf import settings
    if not settings.configured:
        settings.configure(SECRET_KEY="disposable-query-gate")
    settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_URL = worker.url
    settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_TOKEN = worker.token
    settings.OMERO_ANALYSIS_DATA_QUERY_REQUEST_TIMEOUT_SECONDS = 930
    settings.OMERO_ANALYSIS_DATA_QUERY_SOURCE_UPLOAD_TIMEOUT_SECONDS = 1800
