#!/usr/bin/env python3
"""Run the deterministic OMERO.Analysis notebook inventory."""

from __future__ import annotations

import subprocess
import sys


if __name__ == "__main__":
    raise SystemExit(subprocess.call([sys.executable, "-m", "omero_analysis_notebook.cli", "inspect", *sys.argv[1:]]))
