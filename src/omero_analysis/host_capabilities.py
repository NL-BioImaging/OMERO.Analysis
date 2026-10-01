"""Detect the installed BIOMERO Analysis host contract without importing Django.

The integration flag expresses a preference, not evidence that a host exists.
Released BIOMERO versions can support importer storage without hosting Analysis.
Check the existing host contract in the view, template and frontend; do not infer
this capability from a BIOMERO version or rewrite another application's files.
"""

import ast
import json
from functools import lru_cache
from importlib.metadata import PackageNotFoundError, distribution
from pathlib import PurePosixPath


@lru_cache(maxsize=1)
def biomero_analysis_host_installed():
    try:
        package = distribution("omero-biomero")
        view = package.locate_file("omero_biomero/biomero_views.py")
        template = package.locate_file(
            "omero_biomero/templates/omero_biomero/webclient_plugins/react_app.html"
        )
        tree = ast.parse(view.read_text(encoding="utf-8"))
        host_view = any(
            isinstance(node, ast.FunctionDef) and node.name == "data_analysis_status"
            for node in tree.body
        )
        host_template = "WEBCLIENT.UI.DATA_ANALYSIS_AVAILABLE" in template.read_text(
            encoding="utf-8"
        )
        if not (host_view and host_template):
            return False
        assets = package.locate_file("omero_biomero/static/omero_biomero/assets")
        manifest = json.loads((assets / "asset-manifest.json").read_text(encoding="utf-8"))
        main = PurePosixPath(manifest["main.js"]).name
        bundle = (assets / main).read_text(encoding="utf-8")
        return all(marker in bundle for marker in (
            "DATA_ANALYSIS_AVAILABLE", "embedded", "workspace_id"
        ))
    except (PackageNotFoundError, OSError, SyntaxError, UnicodeError, ValueError, KeyError, TypeError):
        return False
