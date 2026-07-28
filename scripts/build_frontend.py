"""Build and validate frontend and self-hosted Pyodide assets."""

import argparse
import json
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "frontend"
STATIC = ROOT / "src/omero_analysis/static/omero_analysis"
RUNTIME = STATIC / "pyodide"
PYTHON_BUILD = ROOT / "build"
REQUIRED_RUNTIME = {
    "pyodide.mjs",
    "pyodide.asm.mjs",
    "pyodide.asm.wasm",
    "python_stdlib.zip",
    "pyodide-lock.json",
    "RUNTIME.json",
    "seaborn-0.13.2-py3-none-any.whl",
}
REQUIRED_PACKAGES = {
    "duckdb",
    "matplotlib",
    "numpy",
    "pandas",
    "pyarrow",
    "python-calamine",
    "scipy",
    "seaborn",
    "xlrd",
}


def npm():
    executable = shutil.which("npm.cmd" if __import__("sys").platform == "win32" else "npm")
    if not executable:
        raise RuntimeError("npm is required to build OMERO Analysis")
    return executable


def run(*args):
    subprocess.run([str(value) for value in args], cwd=FRONTEND, check=True)


def validate():
    entry = STATIC / "app.js"
    stylesheet = STATIC / "app.css"
    panel_stylesheet = STATIC / "panel.css"
    if not entry.is_file() or not stylesheet.is_file() or not panel_stylesheet.is_file():
        raise RuntimeError("Frontend build did not create app.js, app.css, and panel.css")
    if "Frontend bundle not built" in entry.read_text(encoding="utf-8"):
        raise RuntimeError("The placeholder frontend is still installed")
    missing = sorted(name for name in REQUIRED_RUNTIME if not (RUNTIME / name).is_file())
    if missing:
        raise RuntimeError(f"Self-hosted Pyodide runtime is incomplete: {missing}")
    manifest = json.loads((RUNTIME / "RUNTIME.json").read_text(encoding="utf-8"))
    packages = set(manifest.get("packages", {}))
    missing_packages = sorted(REQUIRED_PACKAGES - packages)
    if missing_packages:
        raise RuntimeError(f"Pyodide runtime lacks required packages: {missing_packages}")
    if (RUNTIME / "pyodide.asm.wasm").stat().st_size < 5_000_000:
        raise RuntimeError("Pyodide WebAssembly binary is unexpectedly small")
    print(
        f"Validated frontend and Pyodide {manifest['pyodide']} "
        f"with {len(packages)} pinned packages"
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip-install", action="store_true")
    parser.add_argument("--skip-runtime", action="store_true")
    parser.add_argument("--validate-only", action="store_true")
    args = parser.parse_args()
    if not args.validate_only:
        command = npm()
        if not args.skip_install:
            run(command, "ci")
        if not args.skip_runtime:
            run(command, "run", "vendor:pyodide")
        run(command, "run", "build")
        shutil.rmtree(PYTHON_BUILD, ignore_errors=True)
    validate()


if __name__ == "__main__":
    main()
