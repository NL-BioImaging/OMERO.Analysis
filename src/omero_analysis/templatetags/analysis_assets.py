"""Versioned static URLs backed by the frontend build manifest."""

import json
from functools import lru_cache
from pathlib import Path

from django import template
from django.templatetags.static import static

register = template.Library()


@lru_cache(maxsize=1)
def _build_id():
    manifest = (
        Path(__file__).resolve().parents[1]
        / "static"
        / "omero_analysis"
        / "asset-manifest.json"
    )
    try:
        value = json.loads(manifest.read_text(encoding="utf-8"))
        return str(value["build"])
    except (OSError, KeyError, TypeError, ValueError):
        return "development"


@register.simple_tag
def analysis_static(path):
    return f"{static(path)}?v={_build_id()}"
