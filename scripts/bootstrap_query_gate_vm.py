"""Install Docker and the isolated stack without requiring guest Internet access."""
import argparse
from pathlib import Path
import secrets
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", required=True)
    args = parser.parse_args()
    gate = ROOT / ".local-query-gates/vm"
    packages = gate / "packages"
    packages.mkdir(exist_ok=True)
    # Resolve guest packages on the online Docker host, using the same Ubuntu release.
    subprocess.run(["docker", "run", "--rm", "--mount",
        f"type=bind,src={packages},dst=/var/cache/apt/archives", "ubuntu:24.04", "sh", "-c",
        "apt-get update -qq && apt-get install --download-only -y docker.io docker-compose-v2"], check=True)
    options = ["-o", "BatchMode=yes", "-o", "StrictHostKeyChecking=accept-new", "-o",
               "UserKnownHostsFile=" + str(gate / "known_hosts"), "-i", str(gate / "gate-key")]
    target = "gate@" + args.host
    def remote(command, text=None):
        return subprocess.run(["ssh", *options, target, command], input=text, text=True, check=True)
    subprocess.run(["scp", *options, "-r", str(packages), target + ":/home/gate/"], check=True)
    remote("sudo dpkg -i /home/gate/packages/*.deb && sudo systemctl enable --now docker")
    images = ["omero-data-query-worker:recovery", "omero-analysis-web:recovery",
              "cellularimagingcf/omeroserver:1.7.0-beta.11", "postgres:16"]
    archive = gate / "gate-images.tar"
    subprocess.run(["docker", "save", "-o", str(archive), *images], check=True)
    subprocess.run(["scp", *options, str(archive), str(ROOT / "deploy/compose.query-gates.yaml"),
                    target + ":/home/gate/"], check=True)
    remote("sudo docker load -i /home/gate/gate-images.tar")
    # Credentials are generated in memory and sent over encrypted stdin, never arguments/logs.
    private = "GATE_OMERO_PASSWORD=" + secrets.token_urlsafe(32) + "\nGATE_WORKER_TOKEN=" + secrets.token_urlsafe(32) + "\n"
    remote("umask 077; test ! -e /home/gate/.gate.env && cat > /home/gate/.gate.env", private)
    remote("sudo docker compose -p query-powercut --env-file /home/gate/.gate.env -f /home/gate/compose.query-gates.yaml up -d && sync")
    print("Isolated query-powercut stack started; retain the private environment file for recovery tests.")


if __name__ == "__main__":
    main()
