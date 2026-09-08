"""Documented OMERO search rebuild, restricted to the disposable gate stack.

https://omero.readthedocs.io/en/stable/sysadmins/search.html#re-indexing
The damaged index is quarantined, never deleted. Database and originals remain.
"""
import argparse
import json
import subprocess
import time

SERVER = "query-powercut-omeroserver-1"
CLI = "/opt/omero/server/OMERO.server/bin/omero"


def docker(*args, check=True):
    return subprocess.run(["sudo", "docker", *args], text=True, capture_output=True, check=check, timeout=120)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    record = json.loads(docker("inspect", SERVER).stdout)[0]
    assert record["Config"]["Labels"]["com.docker.compose.project"] == "query-powercut"
    assert any(m.get("Name") == "query-powercut_omero" and m["Destination"] == "/OMERO" for m in record["Mounts"])
    log = docker("exec", SERVER, "tail", "-250", "/opt/omero/server/OMERO.server/var/log/Blitz-0.log").stdout
    assert "Could not initialize index" in log and "read past EOF" in log, "No recognized index corruption"
    if not args.apply:
        print('{"action":"quarantine FullText and rebuild","dry_run":true}')
        return
    docker("stop", SERVER)
    code = "import pathlib,os,uuid; root=pathlib.Path('/OMERO'); p=root/'FullText'; assert p.resolve().parent==root and not p.is_symlink(); os.rename(p,root/('FullText.quarantined-'+uuid.uuid4().hex))"
    docker("run", "--rm", "--volumes-from", SERVER, "--user", "0", "--network", "none", "--entrypoint", "python",
           "omero-data-query-worker:recovery", "-c", code)
    docker("start", SERVER)
    deadline = time.monotonic() + 120
    while time.monotonic() < deadline:
        result = docker("exec", SERVER, CLI, "admin", "reindex", "--prepare", check=False)
        if result.returncode == 0:
            break
        time.sleep(1)
    else:
        raise RuntimeError("OMERO did not become available for reindexing")
    docker("exec", SERVER, CLI, "admin", "reindex", "--reset", "0")
    docker("exec", SERVER, CLI, "admin", "reindex", "--finish")
    print('{"status":"rebuilt","original_index":"quarantined","requires_index_catchup":true}')


if __name__ == "__main__":
    main()
