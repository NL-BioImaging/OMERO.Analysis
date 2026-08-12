#!/usr/bin/env python3
"""Validate and optionally sanitize a portable OMERO.Analysis notebook."""

from __future__ import annotations

import subprocess
import sys


if __name__ == "__main__":
    raise SystemExit(subprocess.call([sys.executable, "-m", "omero_analysis_notebook.cli", "validate", *sys.argv[1:]]))
