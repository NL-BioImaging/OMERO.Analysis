"""Prepare a checksum-verified Ubuntu image and a private SSH-only cloud-init seed."""
import argparse
import hashlib
import json
import ipaddress
from pathlib import Path
import subprocess
import urllib.request

BASE = "https://cloud-images.ubuntu.com/noble/20260826/"
IMAGE = "noble-server-cloudimg-amd64.img"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--directory", type=Path, required=True)
    parser.add_argument("--address", required=True, help="Unused guest IPv4 address with prefix, e.g. 172.29.128.250/20")
    parser.add_argument("--gateway", required=True, help="Host Default Switch IPv4 address")
    args = parser.parse_args()
    address = ipaddress.IPv4Interface(args.address)
    gateway = ipaddress.IPv4Address(args.gateway)
    if gateway not in address.network or address.ip == gateway:
        parser.error("Guest and gateway must be distinct addresses in the same subnet")
    root = args.directory
    root.mkdir(parents=True, exist_ok=True)
    checksums = urllib.request.urlopen(BASE + "SHA256SUMS", timeout=60).read().decode()
    expected = next(line.split()[0] for line in checksums.splitlines() if line.split()[-1].lstrip("*") == IMAGE)
    target = root / "cloud.img"
    if not target.exists():
        urllib.request.urlretrieve(BASE + IMAGE, target)
    with target.open("rb") as handle:
        actual = hashlib.file_digest(handle, "sha256").hexdigest()
    if actual != expected:
        raise RuntimeError("Ubuntu cloud image checksum mismatch")
    key = root / "gate-key"
    if not key.exists():
        subprocess.run(["ssh-keygen", "-q", "-t", "ed25519", "-N", "", "-f", str(key)], check=True)
    public = key.with_suffix(".pub").read_text().strip()
    (root / "user-data").write_text("""#cloud-config
users:
  - name: gate
    groups: [sudo, docker]
    sudo: ALL=(ALL) NOPASSWD:ALL
    shell: /bin/bash
    lock_passwd: true
    ssh_authorized_keys:
      - """ + public + """
ssh_pwauth: false
package_update: false
""", encoding="utf-8")
    (root / "network-config").write_text(json.dumps({"version": 2, "ethernets": {"uplink": {
        "match": {"name": "e*"}, "dhcp4": False, "addresses": [str(address)],
        "routes": [{"to": "default", "via": str(gateway)}],
        "nameservers": {"addresses": [str(gateway)]}, "optional": True}}}))
    (root / "meta-data").write_text("instance-id: analysis-query-crash-gate\nlocal-hostname: query-crash-gate\n")
    (root / "image.json").write_text(json.dumps({"url": BASE + IMAGE, "sha256": actual}, indent=2))
    print("Verified Ubuntu image; prepared SSH-only disposable VM seed")


if __name__ == "__main__":
    main()
