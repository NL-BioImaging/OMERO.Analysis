"""Create or repair a reproducible OMERO.Analysis development environment."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


def run(*command, cwd=None):
    subprocess.run(command, cwd=cwd, check=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip-frontend", action="store_true")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    run(sys.executable, "-m", "pip", "install", "-r", str(root / "requirements-dev.txt"))
    run(sys.executable, "-m", "pip", "install", "--no-deps", "-e", str(root))
    run(sys.executable, "-m", "pip", "install", "-e", f"{root / 'notebook-sdk'}[test,run,widgets]")
    if not args.skip_frontend:
        npm = shutil.which("npm")
        if npm is None:
            raise SystemExit("npm was not found; use --skip-frontend for backend-only setup")
        run(npm, "ci", cwd=root / "frontend")
    print("OMERO.Analysis development environment is ready")


if __name__ == "__main__":
    main()
