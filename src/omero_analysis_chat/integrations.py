"""Optional OMERO.web application integrations."""

from __future__ import annotations

from importlib.metadata import PackageNotFoundError, version

from django.urls import NoReverseMatch, reverse
from packaging.version import InvalidVersion, Version

ZARR_VIEWER_DISTRIBUTION = "biomero-zarr-viewer"
ZARR_VIEWER_MINIMUM_VERSION = "0.3.0"


def zarr_viewer_status():
    """Describe the optional ZarrViewer without importing it as a dependency."""
    try:
        installed_version = version(ZARR_VIEWER_DISTRIBUTION)
    except PackageNotFoundError:
        return {
            "schema_version": 1,
            "available": False,
            "installed": False,
            "enabled": False,
            "version": None,
            "minimum_version": ZARR_VIEWER_MINIMUM_VERSION,
            "reason": "not-installed",
        }

    try:
        compatible = Version(installed_version) >= Version(
            ZARR_VIEWER_MINIMUM_VERSION
        )
    except InvalidVersion:
        compatible = False
    if not compatible:
        return {
            "schema_version": 1,
            "available": False,
            "installed": True,
            "enabled": False,
            "version": installed_version,
            "minimum_version": ZARR_VIEWER_MINIMUM_VERSION,
            "reason": "incompatible-version",
        }

    try:
        routes = {
            "viewer_url": reverse("biomero_zarr_viewer_index"),
            "image_capabilities_template": reverse(
                "biomero_zarr_viewer_capabilities", kwargs={"image_id": 0}
            ),
            "plate_capabilities_template": reverse(
                "biomero_zarr_viewer_plate_capabilities",
                kwargs={"plate_id": 0},
            ),
        }
    except NoReverseMatch:
        return {
            "schema_version": 1,
            "available": False,
            "installed": True,
            "enabled": False,
            "version": installed_version,
            "minimum_version": ZARR_VIEWER_MINIMUM_VERSION,
            "reason": "app-disabled",
        }

    return {
        "schema_version": 1,
        "available": True,
        "installed": True,
        "enabled": True,
        "version": installed_version,
        "minimum_version": ZARR_VIEWER_MINIMUM_VERSION,
        "reason": "ready",
        **routes,
    }
