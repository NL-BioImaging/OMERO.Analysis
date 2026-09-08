"""Local Docker OMERO permission/provenance gate. No credentials written to disk or logs."""
import argparse
import json
import subprocess
import uuid
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--server-container", default="deployment_scenarios-omeroserver-1")
    parser.add_argument("--web-container", default="deployment_scenarios-omeroweb-1")
    parser.add_argument("--analysis-source", type=Path, help="Test this source package in a private process, without replacing the running web app")
    parser.add_argument("--probe", default="live_query_probe.py", choices=["live_query_probe.py", "live_query_crash_probe.py"])
    parser.add_argument("--points", nargs="+", help="Selected crash/reconciliation checkpoints for the crash probe")
    args = parser.parse_args()
    root_password = subprocess.check_output([
        "docker", "exec", args.server_container, "python", "-c",
        "import os; print(os.environ['ROOTPASS'], end='')"], text=True)
    subprocess.run(["docker", "cp", str(Path(__file__).with_name(args.probe)),
                    args.web_container + ":/tmp/live_query_probe.py"], check=True)
    package_root = "/tmp/query-gate-" + uuid.uuid4().hex
    environment = []
    try:
        if args.analysis_source:
            subprocess.run(["docker", "exec", args.web_container, "mkdir", package_root], check=True)
            subprocess.run(["docker", "cp", str(args.analysis_source.resolve()),
                            args.web_container + ":" + package_root + "/omero_analysis"], check=True)
            environment = ["-e", "PYTHONPATH=" + package_root]
        subprocess.run(["docker", "exec", "-i", *environment, "-w", "/opt/omero/web/OMERO.web", args.web_container,
                        "/opt/omero/web/venv3/bin/python", "/tmp/live_query_probe.py"],
                       input=json.dumps({"password": root_password, **({"points": args.points} if args.points else {})}), text=True, check=True)
    finally:
        if args.analysis_source:
            subprocess.run(["docker", "exec", "-u", "0", args.web_container, "/opt/omero/web/venv3/bin/python", "-c",
                            "import shutil,sys; shutil.rmtree(sys.argv[1])", package_root], check=False)


if __name__ == "__main__":
    main()
