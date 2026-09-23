"""Run the real OMERO 10M save gate without changing the running web app."""
import argparse
import json
from pathlib import Path
import subprocess
import uuid

from query_gate_support import WorkerContainer

ROOT = Path(__file__).resolve().parents[1]
PYTHON = "/opt/omero/web/venv3/bin/python"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--image", default="omero-data-query-worker:recovery")
    parser.add_argument("--web", default="deployment_scenarios-omeroweb-1")
    parser.add_argument("--server", default="deployment_scenarios-omeroserver-1")
    parser.add_argument("--network", default="deployment_scenarios_data-query")
    parser.add_argument("--fixtures", type=Path, default=ROOT / "benchmark-data/10m")
    parser.add_argument("--output", type=Path, default=ROOT / "benchmark-data/omero-10m.jsonl")
    args = parser.parse_args()
    if args.output.exists():
        parser.error("Choose a new evidence file")
    package = "/tmp/query-large-" + uuid.uuid4().hex
    with WorkerContainer(args.image) as worker:
        worker.docker("network", "connect", args.network, worker.name)
        password = subprocess.check_output(["docker", "exec", args.server, "python", "-c",
                                           "import os; print(os.environ['ROOTPASS'], end='')"], text=True)
        worker.docker("exec", args.web, "mkdir", package)
        try:
            for source, target in ((ROOT / "src/omero_analysis", package + "/omero_analysis"),
                                   (args.fixtures, package + "/fixtures"),
                                   (ROOT / "scripts/live_query_large_probe.py", package + "/probe.py")):
                subprocess.run(["docker", "cp", str(source), args.web + ":" + target], check=True)
            args.output.parent.mkdir(parents=True, exist_ok=True)
            with args.output.open("w", encoding="utf-8") as output:
                result = subprocess.run(["docker", "exec", "-i", "-e", "PYTHONPATH=" + package,
                    "-w", "/opt/omero/web/OMERO.web", args.web, PYTHON, package + "/probe.py"],
                    input=json.dumps({"password": password, "worker_url": "http://" + worker.name + ":8080",
                                      "worker_token": worker.token, "fixtures": package + "/fixtures"}),
                    text=True, stdout=output, stderr=subprocess.PIPE)
            if result.returncode:
                raise RuntimeError(result.stderr[-2500:])
        finally:
            worker.docker("exec", "-u", "0", args.web, PYTHON, "-c",
                          "import pathlib,shutil,sys; p=pathlib.Path(sys.argv[1]); assert p.parent==pathlib.Path('/tmp') and p.name.startswith('query-large-'); shutil.rmtree(p)", package)
    print("Real OMERO 10M query/download/save passed for all formats")


if __name__ == "__main__":
    main()
