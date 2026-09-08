"""Power-cut only the explicitly named disposable Hyper-V VM; retain all test disks."""
import argparse
import json
from pathlib import Path
import subprocess
import time

ROOT = Path(__file__).resolve().parents[1]
VM = "analysis-query-crash-gate"
WEB = "query-powercut-web-1"
PYTHON = "/opt/omero/web/venv3/bin/python"
STATE = "/opt/omero/web/OMERO.web/var/query-state/gate.barrier"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="172.29.128.250")
    parser.add_argument("--output", type=Path, default=ROOT / "benchmark-data/vm-powercuts.jsonl")
    parser.add_argument("--repair-search-index", action="store_true", help="Apply the documented OMERO index recovery if recognized corruption prevents startup")
    parser.add_argument("--points", nargs="+", default=["csv_file:created", "csv_file:chunk", "csv:created",
        "recipe_file:created", "recipe:created", "summary:created", "csv:linked", "recipe:linked", "summary:linked", "complete:recorded"])
    args = parser.parse_args()
    if args.output.exists():
        parser.error("Choose a new evidence file")
    key = ROOT / ".local-query-gates/vm/gate-key"
    hosts = ROOT / ".local-query-gates/vm/known_hosts"
    ssh = ["ssh", "-o", "BatchMode=yes", "-o", "ConnectTimeout=5", "-o", "ServerAliveInterval=2",
           "-o", "ServerAliveCountMax=2", "-o", "UserKnownHostsFile=" + str(hosts), "-i", str(key), "gate@" + args.host]
    def remote(command, payload=None, check=True):
        return subprocess.run([*ssh, command], input=json.dumps(payload) if payload is not None else None,
                              capture_output=True, text=True, encoding="utf-8", check=check, timeout=180)
    def response_json(response):
        for line in reversed(response.stdout.splitlines()):
            if line.startswith("{"):
                return json.loads(line)
        raise RuntimeError("No JSON verdict from private probe: " + response.stdout[:300] + response.stderr[-1000:])
    # Password remains in controller memory; never copied to output/artifact files.
    values = dict(line.split("=", 1) for line in remote("cat /home/gate/.gate.env").stdout.splitlines())
    password = values["GATE_OMERO_PASSWORD"]
    command = f"sudo docker exec -i -w /opt/omero/web/OMERO.web {WEB} {PYTHON} /tmp/vm_query_probe.py"
    subprocess.run(["scp", "-o", "UserKnownHostsFile=" + str(hosts), "-i", str(key),
                    str(ROOT / "scripts/vm_query_probe.py"), "gate@" + args.host + ":/home/gate/"], check=True)
    remote(f"sudo docker cp /home/gate/vm_query_probe.py {WEB}:/tmp/vm_query_probe.py")
    subprocess.run(["scp", "-o", "UserKnownHostsFile=" + str(hosts), "-i", str(key),
                    str(ROOT / "scripts/repair_query_gate_search.py"), "gate@" + args.host + ":/home/gate/"], check=True)
    for point in args.points:
        private = None
        row = {"point": point, "vm": VM, "status": "failed"}
        try:
            setup = remote(command, {"mode": "setup", "password": password})
            private = {**response_json(setup), "password": password, "point": point}
            remote(f"sudo docker exec {WEB} {PYTHON} -c \"from pathlib import Path; Path('{STATE}').unlink(missing_ok=True)\"")
            # Establish a durable baseline (images, harness, original source).
            # No sync is issued after the promotion starts or reaches its barrier.
            remote("sync")
            process = subprocess.Popen([*ssh, command], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                       stderr=subprocess.PIPE, text=True, encoding="utf-8")
            process.stdin.write(json.dumps({**private, "mode": "pause"}))
            process.stdin.close()
            deadline = time.monotonic() + 90
            while time.monotonic() < deadline:
                marker = remote(f"sudo docker exec {WEB} cat {STATE}", check=False)
                if marker.returncode == 0 and marker.stdout.strip() == point:
                    break
                if process.poll() is not None:
                    raise RuntimeError("Barrier process exited: " + process.stderr.read()[-1500:])
                time.sleep(.5)
            else:
                raise RuntimeError("Power-cut barrier timeout")
            # Only this task-created VM is stopped; no host or live Docker restart.
            subprocess.run(["powershell", "-NoProfile", "-Command", f"Stop-VM -Name '{VM}' -TurnOff -Force"], check=True)
            started = time.monotonic()
            subprocess.run(["powershell", "-NoProfile", "-Command", f"Start-VM -Name '{VM}'"], check=True)
            deadline = time.monotonic() + 180
            repaired = False
            while time.monotonic() < deadline:
                status = remote(command, {"mode": "ready", "password": password}, check=False)
                if status.returncode == 0 and '"ready"' in status.stdout:
                    break
                if args.repair_search_index and not repaired:
                    inspection = remote("python3 /home/gate/repair_query_gate_search.py", check=False)
                    if inspection.returncode == 0:
                        repair = remote("python3 /home/gate/repair_query_gate_search.py --apply")
                        row["search_index_recovery"] = response_json(repair)
                        repaired = True
                time.sleep(1)
            else:
                raise RuntimeError("OMERO did not recover within 180 seconds")
            recovered = remote(command, {**private, "mode": "recover"})
            row.update(response_json(recovered), recovery_seconds=time.monotonic() - started)
            process.wait(timeout=15)
            process.stdout.close()
            process.stderr.close()
        except Exception as exc:
            # CalledProcessError.command contains no credentials; stdin is never rendered.
            row["error"] = str(exc)
            if isinstance(exc, subprocess.CalledProcessError):
                row["diagnostic"] = (exc.stderr or "")[-2000:]
            raise
        finally:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            with args.output.open("a", encoding="utf-8") as handle:
                handle.write(json.dumps(row) + "\n")
            print(json.dumps(row), flush=True)
            if private and row["status"] == "passed":
                remote(command, {**private, "mode": "cleanup"})


if __name__ == "__main__":
    main()
