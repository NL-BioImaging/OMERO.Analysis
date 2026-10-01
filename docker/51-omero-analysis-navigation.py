#!/usr/bin/env python3
"""Keep a working Analysis link unless the installed BIOMERO can host it."""

import os
import json
from subprocess import DEVNULL, run


OMERO = "/opt/omero/web/venv3/bin/omero"
OMERO_PYTHON = "/opt/omero/web/venv3/bin/python"
TOP_LINK_KEY = "omero.web.ui.top_links"
TOP_LINK_VALUE = (
    '["Analysis", "omero_analysis_index", '
    '{"title": "Open browser-local Analysis", "target": "new"}]'
)
TRUE_VALUES = {"1", "true"}


def integrated_data_analysis(value=None):
    raw = os.environ.get("INTEGRATE_DATA_ANALYSIS", "") if value is None else value
    return str(raw).strip().lower() in TRUE_VALUES


def analysis_installed():
    result = run(
        [
            OMERO_PYTHON,
            "-c",
            "from importlib.metadata import version; version('omero-analysis')",
        ],
        stdout=DEVNULL,
        stderr=DEVNULL,
        check=False,
    )
    return result.returncode == 0


def analysis_host_installed():
    result = run(
        [OMERO_PYTHON, "-c",
         "from omero_analysis.host_capabilities import biomero_analysis_host_installed; "
         "raise SystemExit(0 if biomero_analysis_host_installed() else 1)"],
        stdout=DEVNULL, stderr=DEVNULL, check=False,
    )
    return result.returncode == 0


def analysis_host_enabled():
    if not analysis_host_installed():
        return False
    result = run(
        [OMERO, "config", "get", "omero.web.apps"],
        capture_output=True, text=True, check=False,
    )
    try:
        apps = json.loads(result.stdout)
    except (ValueError, TypeError):
        return False
    return result.returncode == 0 and isinstance(apps, list) and "omero_biomero" in apps


def main():
    if not analysis_installed():
        return
    command = [OMERO, "config"]
    run(
        [*command, "remove", "--", TOP_LINK_KEY, TOP_LINK_VALUE],
        stdout=DEVNULL,
        stderr=DEVNULL,
        check=False,
    )
    if not (integrated_data_analysis() and analysis_host_enabled()):
        run(
            [*command, "append", "--", TOP_LINK_KEY, TOP_LINK_VALUE],
            check=True,
        )


if __name__ == "__main__":
    main()
