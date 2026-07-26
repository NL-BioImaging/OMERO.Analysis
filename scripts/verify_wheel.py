"""Verify one complete Analysis Chat frontend and runtime in a wheel."""

import argparse
import json
import zipfile
from pathlib import Path, PurePosixPath

STATIC = PurePosixPath("omero_analysis_chat/static/omero_analysis_chat")
REQUIRED = {
    str(STATIC / "app.js"),
    str(STATIC / "app.css"),
    str(STATIC / "pyodide/pyodide.mjs"),
    str(STATIC / "pyodide/pyodide.asm.mjs"),
    str(STATIC / "pyodide/pyodide.asm.wasm"),
    str(STATIC / "pyodide/python_stdlib.zip"),
    str(STATIC / "pyodide/pyodide-lock.json"),
    str(STATIC / "pyodide/RUNTIME.json"),
    "omero_analysis_chat/templates/omero_analysis_chat/chat.html",
    "omero_analysis_chat/templates/omero_analysis_chat/panel.html",
    "omero_analysis_chat/templates/omero_analysis_chat/center_plugin.js.html",
}
PACKAGES = {"duckdb", "pandas", "pyarrow", "python-calamine", "matplotlib"}


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
        runtime = json.loads(
            archive.read(str(STATIC / "pyodide/RUNTIME.json")).decode("utf-8")
        )
        absent = sorted(PACKAGES - set(runtime["packages"]))
        if absent:
            raise RuntimeError(f"Wheel runtime lacks packages: {absent}")
        for package in PACKAGES:
            record = json.loads(
                archive.read(str(STATIC / "pyodide/pyodide-lock.json"))
            )["packages"][package]
            packaged = str(STATIC / "pyodide" / record["file_name"])
            if packaged not in names:
                raise RuntimeError(f"Wheel lacks {package} artifact: {packaged}")
    print(f"Verified packaged Analysis Chat frontend/runtime in {args.wheel}")


if __name__ == "__main__":
    main()

