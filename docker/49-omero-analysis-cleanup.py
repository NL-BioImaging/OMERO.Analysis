#!/usr/bin/env python3
"""Remove retired UI entries before the declarative Analysis config is loaded."""

from subprocess import DEVNULL, run
from pathlib import Path
from shutil import rmtree


OMERO = "/opt/omero/web/venv3/bin/omero"
RETIRED = (
    ("omero.web.apps", '"omero_jupyterlite"'),
    (
        "omero.web.ui.center_plugins",
        '["Jupyter", "omero_jupyterlite/center_plugin.js.html", '
        '"omero_jupyterlite_panel"]',
    ),
    (
        "omero.web.ui.top_links",
        '["JupyterLab", "omero_jupyterlite_lab", '
        '{"title": "Open JupyterLab", "target": "new"}]',
    ),
    (
        "omero.web.ui.center_plugins",
        '["Analysis", "omero_analysis/center_plugin.js.html", '
        '"omero_analysis_panel"]',
    ),
    (
        "omero.web.ui.center_plugins",
        '["Analysis Chat", "omero_analysis/center_plugin.js.html", '
        '"omero_analysis_chat_panel"]',
    ),
    (
        "omero.web.ui.center_plugins",
        '["Analysis Notebook", "omero_analysis/notebook_center_plugin.js.html", '
        '"omero_analysis_notebook_panel"]',
    ),
)


for key, value in RETIRED:
    run(
        [OMERO, "config", "remove", "--", key, value],
        stdout=DEVNULL,
        stderr=DEVNULL,
        check=False,
    )

retired_static = Path(
    "/opt/omero/web/OMERO.web/var/static/omero_jupyterlite"
)
if retired_static.is_dir():
    rmtree(retired_static)
