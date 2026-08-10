#!/usr/bin/env python3
"""Register the standalone Analysis top link unless BIOMERO embeds Analysis."""

import os
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
    if not integrated_data_analysis():
        run(
            [*command, "append", "--", TOP_LINK_KEY, TOP_LINK_VALUE],
            check=True,
        )


if __name__ == "__main__":
    main()
