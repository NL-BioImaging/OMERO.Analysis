#!/usr/bin/env python3
"""Copy the bundled portable template without overwriting existing work."""

from __future__ import annotations

import shutil
import sys
from pathlib import Path


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: scaffold_notebook.py DESTINATION.ipynb", file=sys.stderr)
        return 2
    destination = Path(sys.argv[1])
    if destination.exists():
        print(f"refusing to overwrite {destination}", file=sys.stderr)
        return 2
    destination.parent.mkdir(parents=True, exist_ok=True)
    (destination.parent / "input").mkdir(exist_ok=True)
    (destination.parent / "results").mkdir(exist_ok=True)
    shutil.copyfile(Path(__file__).parents[1] / "assets" / "portable-notebook-template.ipynb", destination)
    print(f"created {destination}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
