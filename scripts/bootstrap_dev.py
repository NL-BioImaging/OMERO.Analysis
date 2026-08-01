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
    run(sys.executable, "-m", "pip", "uninstall", "-y",
        "omero-analysis-chat", "omero-jupyterlite")
    # A historic editable install wrote its distribution metadata into this
    # repository's src directory, where importlib.metadata can still discover
    # it even after pip has removed the old .pth file.
    shutil.rmtree(root / "src" / "omero_analysis_chat.egg-info", ignore_errors=True)
    if sys.platform == "win32":
        # ZeroC Ice 3.6 (pulled in by omero-web) does not build with current
        # Windows/Python toolchains. OMERO integration is provided by the
        # deployment container; local unit tests use controlled gateway doubles.
        run(
            sys.executable, "-m", "pip", "install",
            "Django>=3.2,<6", "pytest>=8", "pytest-django>=4.8", "build>=1.2",
            "packaging>=23", "numpy>=1.24,<3", "Pillow>=10,<13",
            "cryptography>=42,<50",
        )
        run(sys.executable, "-m", "pip", "install", "--no-deps", "-e", str(root))
    else:
        run(sys.executable, "-m", "pip", "install", "-e", f"{root}[test]")
    if not args.skip_frontend:
        npm = shutil.which("npm")
        if npm is None:
            raise SystemExit("npm was not found; use --skip-frontend for backend-only setup")
        run(npm, "ci", cwd=root / "frontend")
    print("OMERO.Analysis development environment is ready")


if __name__ == "__main__":
    main()
