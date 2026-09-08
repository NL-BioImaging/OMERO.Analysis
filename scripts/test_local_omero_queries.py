"""Local Docker OMERO permission/provenance gate. No credentials written to disk or logs."""
import argparse
import json
import subprocess
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--server-container", default="deployment_scenarios-omeroserver-1")
    parser.add_argument("--web-container", default="deployment_scenarios-omeroweb-1")
    args = parser.parse_args()
    root_password = subprocess.check_output([
        "docker", "exec", args.server_container, "python", "-c",
        "import os; print(os.environ['ROOTPASS'], end='')"], text=True)
    subprocess.run(["docker", "cp", str(Path(__file__).with_name("live_query_probe.py")),
                    args.web_container + ":/tmp/live_query_probe.py"], check=True)
    subprocess.run(["docker", "exec", "-i", "-w", "/opt/omero/web/OMERO.web", args.web_container,
                    "/opt/omero/web/venv3/bin/python", "/tmp/live_query_probe.py"],
                   input=json.dumps({"password": root_password}), text=True, check=True)


if __name__ == "__main__":
    main()
