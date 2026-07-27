from importlib.metadata import PackageNotFoundError

from django.urls import NoReverseMatch

from omero_analysis_chat import integrations


def test_zarr_viewer_is_optional(monkeypatch):
    def missing(_name):
        raise PackageNotFoundError

    monkeypatch.setattr(integrations, "version", missing)
    status = integrations.zarr_viewer_status()
    assert status["available"] is False
    assert status["reason"] == "not-installed"


def test_zarr_viewer_requires_compatible_version(monkeypatch):
    monkeypatch.setattr(integrations, "version", lambda _name: "0.2.9")
    status = integrations.zarr_viewer_status()
    assert status["installed"] is True
    assert status["enabled"] is False
    assert status["reason"] == "incompatible-version"


def test_zarr_viewer_reports_routes_without_importing_the_plugin(monkeypatch):
    monkeypatch.setattr(integrations, "version", lambda _name: "0.4.0")

    def fake_reverse(name, kwargs=None):
        if name == "biomero_zarr_viewer_index":
            return "/biomero_zarr_viewer/"
        value = (kwargs or {}).get("image_id", (kwargs or {}).get("plate_id"))
        return f"/{name}/{value}/"

    monkeypatch.setattr(integrations, "reverse", fake_reverse)
    status = integrations.zarr_viewer_status()
    assert status["available"] is True
    assert status["version"] == "0.4.0"
    assert status["plate_capabilities_template"].endswith("/0/")


def test_zarr_viewer_must_be_enabled_in_omero_web(monkeypatch):
    monkeypatch.setattr(integrations, "version", lambda _name: "0.4.0")

    def missing_route(*_args, **_kwargs):
        raise NoReverseMatch

    monkeypatch.setattr(integrations, "reverse", missing_route)
    status = integrations.zarr_viewer_status()
    assert status["available"] is False
    assert status["reason"] == "app-disabled"
