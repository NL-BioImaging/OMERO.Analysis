"""Verify one complete Analysis frontend and runtime in a wheel."""

import argparse
import json
import re
import zipfile
from pathlib import Path, PurePosixPath

STATIC = PurePosixPath("omero_analysis/static/omero_analysis")
REQUIRED = {
    str(STATIC / "app.js"),
    str(STATIC / "app.css"),
    str(STATIC / "asset-manifest.json"),
    str(STATIC / "panel.css"),
    str(STATIC / "pyodide/pyodide.mjs"),
    str(STATIC / "pyodide/pyodide.asm.mjs"),
    str(STATIC / "pyodide/pyodide.asm.wasm"),
    str(STATIC / "pyodide/python_stdlib.zip"),
    str(STATIC / "pyodide/pyodide-lock.json"),
    str(STATIC / "pyodide/RUNTIME.json"),
    str(STATIC / "pyodide/seaborn-0.13.2-py3-none-any.whl"),
    "omero_analysis/templates/omero_analysis/analysis.html",
    "omero_analysis/templates/omero_analysis/panel.html",
    "omero_analysis/templates/omero_analysis/runtime_sandbox.html",
    "omero_analysis/templates/omero_analysis/center_plugin.js.html",
}
PACKAGES = {
    "duckdb",
    "matplotlib",
    "pandas",
    "pyarrow",
    "python-calamine",
    "scipy",
    "seaborn",
}
LOCK_PACKAGES = PACKAGES - {"seaborn"}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("wheel", type=Path)
    args = parser.parse_args()
    with zipfile.ZipFile(args.wheel) as archive:
        names = set(archive.namelist())
        missing = sorted(REQUIRED - names)
        if missing:
            raise RuntimeError(f"Wheel is missing packaged assets: {missing}")
        entry = archive.read(str(STATIC / "app.js")).decode("utf-8")
        if "Frontend bundle not built" in entry:
            raise RuntimeError("Wheel contains the placeholder frontend")
        match = re.fullmatch(r'import "\./(main-[A-Za-z0-9_-]+\.js)";\s*', entry)
        if not match:
            raise RuntimeError("Wheel frontend entry does not reference one hashed main bundle")
        expected_main = str(STATIC / match.group(1))
        main_bundles = sorted(
            name for name in names
            if name.startswith(str(STATIC / "main-")) and name.endswith(".js")
        )
        if main_bundles != [expected_main]:
            raise RuntimeError(
                "Wheel contains stale frontend main bundles; run "
                "scripts/build_frontend.py before building the wheel: "
                f"{main_bundles}"
            )
        build_manifest = json.loads(
            archive.read(str(STATIC / "asset-manifest.json")).decode("utf-8")
        )
        if build_manifest.get("version") != 1 or not re.fullmatch(
            r"[0-9a-f]{16}", str(build_manifest.get("build", ""))
        ):
            raise RuntimeError("Wheel contains an invalid frontend asset manifest")
        runtime = json.loads(
            archive.read(str(STATIC / "pyodide/RUNTIME.json")).decode("utf-8")
        )
        absent = sorted(PACKAGES - set(runtime["packages"]))
        if absent:
            raise RuntimeError(f"Wheel runtime lacks packages: {absent}")
        for package in LOCK_PACKAGES:
            record = json.loads(
                archive.read(str(STATIC / "pyodide/pyodide-lock.json"))
            )["packages"][package]
            packaged = str(STATIC / "pyodide" / record["file_name"])
            if packaged not in names:
                raise RuntimeError(f"Wheel lacks {package} artifact: {packaged}")
    print(f"Verified packaged Analysis frontend/runtime in {args.wheel}")


if __name__ == "__main__":
    main()
