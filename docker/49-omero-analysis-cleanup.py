#!/usr/bin/env python3
"""Remove exact Analysis UI entries before declarative config is reloaded."""

from subprocess import DEVNULL, run


OMERO = "/opt/omero/web/venv3/bin/omero"
REGISTERED_ENTRIES = (
    (
        "omero.web.ui.center_plugins",
        '["Analysis", "omero_analysis/center_plugin.js.html", '
        '"omero_analysis_panel"]',
    ),
    (
        "omero.web.ui.top_links",
        '["Analysis", "omero_analysis_index", '
        '{"title": "Open browser-local Analysis", "target": "new"}]',
    ),
)


def main():
    for key, value in REGISTERED_ENTRIES:
        run(
            [OMERO, "config", "remove", "--", key, value],
            stdout=DEVNULL,
            stderr=DEVNULL,
            check=False,
        )


if __name__ == "__main__":
    main()
