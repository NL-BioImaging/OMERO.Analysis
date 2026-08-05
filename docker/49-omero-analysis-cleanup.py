#!/usr/bin/env python3
"""Remove the current Analysis entry before declarative config is reloaded."""

from subprocess import DEVNULL, run


OMERO = "/opt/omero/web/venv3/bin/omero"
REGISTERED_ENTRIES = (
    (
        "omero.web.ui.center_plugins",
        '["Analysis", "omero_analysis/center_plugin.js.html", '
        '"omero_analysis_panel"]',
    ),
)


for key, value in REGISTERED_ENTRIES:
    run(
        [OMERO, "config", "remove", "--", key, value],
        stdout=DEVNULL,
        stderr=DEVNULL,
        check=False,
    )
