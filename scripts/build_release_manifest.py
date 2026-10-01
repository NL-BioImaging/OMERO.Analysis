"""Generate a release manifest from verified, pre-built wheels."""

import argparse
import json
from pathlib import Path

from analysis_release import SCHEMA, PROJECTS, digest, release_version, wheel_identity, validate_manifest


def build_manifest(version, paths):
    release_version(version)
    identities = [wheel_identity(path) for path in paths]
    if len(paths) != 2 or {project for project, _ in identities} != PROJECTS:
        raise ValueError("Provide exactly one Analysis wheel and one notebook SDK wheel")
    if dict(identities)["omero-analysis"] != version:
        raise ValueError("Main wheel version does not match release version")
    manifest = {
        "schema": SCHEMA, "version": version,
        "wheels": [
            {"name": path.name, "sha256": digest(path), "size": path.stat().st_size}
            for path in sorted(paths)
        ],
    }
    validate_manifest(manifest, version)
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--version", required=True)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("wheels", nargs="+", type=Path)
    args = parser.parse_args()
    try:
        manifest = build_manifest(args.version, args.wheels)
    except (ValueError, OSError) as exc:
        parser.exit(1, f"Release manifest failed: {exc}\n")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Verified release {args.version}: {args.output}")


if __name__ == "__main__":
    main()
