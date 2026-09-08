"""Test the actual broker through a disposable mTLS proxy on the private Docker network.

No host ports are published and the running broker configuration is not changed.
"""
from __future__ import annotations
import argparse
from datetime import datetime, timedelta, timezone
from pathlib import Path
import subprocess
import tempfile
import uuid

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID, ExtendedKeyUsageOID


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--network", default="deployment_scenarios_data-query")
    parser.add_argument("--web-container", default="deployment_scenarios-omeroweb-1")
    parser.add_argument("--worker-repo", type=Path, default=Path(__file__).resolve().parents[2] / "OMERO.DataQueryWorker")
    args = parser.parse_args()
    name = "dqw-mtls-" + uuid.uuid4().hex[:10]
    remote = "/tmp/" + name
    def docker(*cmd, **kwargs):
        return subprocess.run(["docker", *cmd], check=True, text=True, **kwargs)
    with tempfile.TemporaryDirectory(prefix=name) as temporary:
        directory = Path(temporary)
        now = datetime.now(timezone.utc)
        ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, name + "-ca")])
        ca = (x509.CertificateBuilder().subject_name(ca_name).issuer_name(ca_name)
              .public_key(ca_key.public_key()).serial_number(x509.random_serial_number())
              .not_valid_before(now - timedelta(minutes=1)).not_valid_after(now + timedelta(hours=1))
              .add_extension(x509.BasicConstraints(ca=True, path_length=0), critical=True)
              .sign(ca_key, hashes.SHA256()))
        (directory / "ca.crt").write_bytes(ca.public_bytes(serialization.Encoding.PEM))
        for role, usage in (("server", ExtendedKeyUsageOID.SERVER_AUTH), ("client", ExtendedKeyUsageOID.CLIENT_AUTH)):
            key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            cert = (x509.CertificateBuilder().subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, name)]))
                    .issuer_name(ca_name).public_key(key.public_key()).serial_number(x509.random_serial_number())
                    .not_valid_before(now - timedelta(minutes=1)).not_valid_after(now + timedelta(hours=1))
                    .add_extension(x509.SubjectAlternativeName([x509.DNSName(name)]), critical=False)
                    .add_extension(x509.ExtendedKeyUsage([usage]), critical=False).sign(ca_key, hashes.SHA256()))
            (directory / (role + ".crt")).write_bytes(cert.public_bytes(serialization.Encoding.PEM))
            (directory / (role + ".key")).write_bytes(key.private_bytes(serialization.Encoding.PEM,
                serialization.PrivateFormat.PKCS8, serialization.NoEncryption()))
        config = directory / "default.conf"
        config.write_text((args.worker_repo / "deploy/nginx-mtls.conf").read_text())
        try:
            docker("run", "--detach", "--name", name, "--network", args.network,
                   "--read-only", "--tmpfs", "/tmp", "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
                   "-v", str(directory) + ":/run/query-tls:ro",
                   "-v", str(config) + ":/etc/nginx/conf.d/default.conf:ro",
                   "nginxinc/nginx-unprivileged:1.28-alpine", stdout=subprocess.DEVNULL)
            docker("exec", args.web_container, "mkdir", "-m", "700", remote)
            for filename in ("ca.crt", "client.crt", "client.key"):
                docker("cp", str(directory / filename), args.web_container + ":" + remote + "/" + filename)
            code = f'''import os, time
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "omeroweb.settings")
import django; django.setup()
from django.conf import settings
from omero_analysis.data_query import DataQueryBroker
settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_URL = "https://{name}:8443"
settings.OMERO_ANALYSIS_DATA_QUERY_CA_FILE = "{remote}/ca.crt"
settings.OMERO_ANALYSIS_DATA_QUERY_CLIENT_CERT_FILE = "{remote}/client.crt"
settings.OMERO_ANALYSIS_DATA_QUERY_CLIENT_KEY_FILE = "{remote}/client.key"
for attempt in range(20):
    if DataQueryBroker().capabilities()["ready"]: break
    time.sleep(.5)
else:
    broker = DataQueryBroker()
    probe = broker.session.get(broker.url + "/health/ready", timeout=3)
    probe.raise_for_status()
    raise AssertionError("mTLS broker authenticated capabilities failed")
settings.OMERO_ANALYSIS_DATA_QUERY_CLIENT_CERT_FILE = ""
settings.OMERO_ANALYSIS_DATA_QUERY_CLIENT_KEY_FILE = ""
assert not DataQueryBroker().capabilities()["ready"], "Client certificate was not enforced"
settings.OMERO_ANALYSIS_DATA_QUERY_CLIENT_CERT_FILE = "{remote}/client.crt"
settings.OMERO_ANALYSIS_DATA_QUERY_CLIENT_KEY_FILE = "{remote}/client.key"
settings.OMERO_ANALYSIS_DATA_QUERY_CA_FILE = "{remote}/client.crt"
assert not DataQueryBroker().capabilities()["ready"], "Untrusted server was accepted"
print("mTLS broker passed: client authentication, readiness, capabilities, bad CA rejection")
'''
            docker("exec", "-i", "-w", "/opt/omero/web/OMERO.web", args.web_container,
                   "/opt/omero/web/venv3/bin/python", "-", input=code)
        except Exception:
            subprocess.run(["docker", "logs", "--tail", "15", name])
            raise
        finally:
            subprocess.run(["docker", "rm", "-f", name], capture_output=True)
            # Only this invocation's fixed, unique test directory is removed.
            docker("exec", args.web_container, "/opt/omero/web/venv3/bin/python", "-c",
                   f"import shutil; shutil.rmtree({remote!r}, ignore_errors=True)")


if __name__ == "__main__":
    main()
