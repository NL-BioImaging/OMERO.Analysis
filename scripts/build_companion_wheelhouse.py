"""Build a complete offline wheelhouse for an OMERO workflow-skill consumer."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--plugin-wheel", required=True, type=Path)
    parser.add_argument("--application-wheel", type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--catalog-repo", type=Path)
    args = parser.parse_args()
    plugin = args.plugin_wheel.resolve(strict=True)
    application = (
        args.application_wheel.resolve(strict=True)
        if args.application_wheel
        else None
    )
    root = Path(__file__).resolve().parents[1]
    default_catalog = root.parent / "BIOMERO.WorkflowSkills"
    if not default_catalog.is_dir():
        default_catalog = root.parent / "OMERO.WorkflowSkills"
    catalog = (args.catalog_repo or default_catalog).resolve()
    if not (catalog / "pyproject.toml").is_file():
        raise SystemExit(f"BIOMERO.WorkflowSkills repository not found at {catalog}")
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    for existing in output.iterdir():
        if existing.is_file():
            existing.unlink()
        elif existing.is_dir():
            shutil.rmtree(existing)
    subprocess.run(
        [
            sys.executable,
            "-m",
            "build",
            "--wheel",
            "--outdir",
            str(output),
            str(catalog),
        ],
        check=True,
    )
    shutil.copy2(plugin, output / plugin.name)
    if application:
        shutil.copy2(application, output / application.name)
    for python_version in ("310", "311", "312"):
        subprocess.run(
            [
                sys.executable,
                "-m",
                "pip",
                "download",
                "--only-binary=:all:",
                "--platform",
                "manylinux2014_x86_64",
                "--implementation",
                "cp",
                "--python-version",
                python_version,
                "--abi",
                f"cp{python_version}",
                "--dest",
                str(output),
                "PyYAML>=6,<7",
            ],
            check=True,
        )
    subprocess.run(
        [
            sys.executable,
            "-m",
            "pip",
            "download",
            "--only-binary=:all:",
            "--dest",
            str(output),
            "packaging>=23",
        ],
        check=True,
    )
    wheels = sorted(output.glob("*.whl"))
    manifest = {
        "schema": "nl.bioimaging.omero-plugin-wheelhouse.v1",
        "wheels": [
            {
                "name": wheel.name,
                "sha256": hashlib.sha256(wheel.read_bytes()).hexdigest(),
                "size": wheel.stat().st_size,
            }
            for wheel in wheels
        ],
    }
    (output / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Built offline wheelhouse with {len(wheels)} wheels at {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
