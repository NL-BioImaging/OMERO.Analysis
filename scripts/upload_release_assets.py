"""Attach verified release assets, refusing to overwrite published bytes."""

import argparse
import json
import subprocess
import tempfile
from pathlib import Path

from analysis_release import validate_manifest, verify_asset, digest


def upload_assets(tag, repo, manifest_path, directories, command=subprocess.run):
    if manifest_path.name != "manifest.json":
        raise ValueError("Release manifest asset must be named manifest.json")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    entries = validate_manifest(manifest, tag.removeprefix("v"))
    if tag != f"v{manifest['version']}":
        raise ValueError("GitHub release tag differs from the manifest version")
    files = []
    for entry in entries:
        matches = [folder / entry["name"] for folder in directories if (folder / entry["name"]).is_file()]
        if len(matches) != 1:
            raise ValueError(f"Expected one artifact for {entry['name']}")
        verify_asset(matches[0], entry)
        files.append(matches[0])
    files.append(manifest_path)
    view = command(["gh", "release", "view", tag, "--repo", repo, "--json", "assets,tagName"],
                   check=True, capture_output=True, text=True)
    release = json.loads(view.stdout)
    if release["tagName"] != tag:
        raise ValueError("GitHub release tag mismatch")
    existing = {asset["name"] for asset in release["assets"]}
    pending = []
    with tempfile.TemporaryDirectory(prefix="analysis-release-retry-") as folder:
        for asset in files:
            if asset.name in existing:
                command(["gh", "release", "download", tag, "--repo", repo,
                         "--pattern", asset.name, "--dir", folder], check=True)
                if digest(Path(folder) / asset.name) != digest(asset):
                    raise ValueError(f"Release already contains different bytes for {asset.name}; use a new version")
            else:
                pending.append(asset)
        # Manifest is last, so consumers never see it before its wheels.
        for asset in pending:
            command(["gh", "release", "upload", tag, str(asset), "--repo", repo], check=True)
    print(f"Release {tag}: {len(files)} assets verified; {len(pending)} attached")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tag", required=True)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--directory", action="append", type=Path, required=True)
    args = parser.parse_args()
    try:
        upload_assets(args.tag, args.repo, args.manifest, args.directory)
    except (ValueError, OSError, subprocess.CalledProcessError) as exc:
        parser.exit(1, f"Release attachment failed: {exc}\n")


if __name__ == "__main__":
    main()
