"""Check source versions before building; additionally check the publishing tag."""
from __future__ import annotations

import argparse
import ast
import json
import os
from pathlib import Path
try:
    import tomllib
except ModuleNotFoundError:  # Python 3.10 backend test matrix
    import tomli as tomllib

from analysis_release import release_version


def check_versions(root: Path, tag: str | None = None) -> str:
    version = tomllib.loads((root / "pyproject.toml").read_text(encoding="utf-8"))["project"]["version"]
    release_version(version)
    runtime = ast.parse((root / "src/omero_analysis/__init__.py").read_text(encoding="utf-8"))
    runtime_versions = [ast.literal_eval(node.value) for node in runtime.body
                        if isinstance(node, ast.Assign)
                        and any(isinstance(target, ast.Name) and target.id == "__version__"
                                for target in node.targets)]
    if runtime_versions != [version]:
        raise ValueError(f"Runtime __version__ must match Analysis {version}")
    for name in ("plugin.json", "frontend/package.json", "frontend/package-lock.json"):
        document = json.loads((root / name).read_text(encoding="utf-8"))
        if document.get("version") != version:
            raise ValueError(f"{name} version must match Analysis {version}")
        if name.endswith("package-lock.json") and document.get("packages", {}).get("", {}).get("version") != version:
            raise ValueError(f"{name} root package version must match Analysis {version}")
    if tag is not None and tag != f"v{version}":
        raise ValueError(f"Release tag must be v{version}")
    return version


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-only", action="store_true", help="Validate a branch before a release tag exists")
    args = parser.parse_args()
    try:
        version = check_versions(Path.cwd(), None if args.source_only else os.environ.get("GITHUB_REF_NAME", ""))
    except ValueError as exc:
        raise SystemExit(str(exc)) from exc
    print(f"Validated Analysis {version} source versions")


if __name__ == "__main__":
    main()
