from types import SimpleNamespace

from django.urls import NoReverseMatch
from importlib.metadata import PackageNotFoundError

from omero_analysis import host_capabilities, settings as analysis_settings


def test_host_requires_view_and_template_contract(tmp_path, monkeypatch):
    def locate(name):
        return tmp_path / name.rsplit("/", 1)[-1]

    monkeypatch.setattr(host_capabilities, "distribution", lambda _: SimpleNamespace(locate_file=locate))
    view = locate("biomero_views.py")
    template = locate("react_app.html")
    view.write_text("def biomero(): pass\n", encoding="utf-8")
    template.write_text("WEBCLIENT.UI.IMPORTER_ENABLED = true;", encoding="utf-8")
    try:
        assert not host_capabilities.biomero_analysis_host_installed()
        host_capabilities.biomero_analysis_host_installed.cache_clear()
        view.write_text("def data_analysis_status(enabled): pass\n", encoding="utf-8")
        assert not host_capabilities.biomero_analysis_host_installed()
        host_capabilities.biomero_analysis_host_installed.cache_clear()
        template.write_text("WEBCLIENT.UI.DATA_ANALYSIS_AVAILABLE = true;", encoding="utf-8")
        assert not host_capabilities.biomero_analysis_host_installed()
        host_capabilities.biomero_analysis_host_installed.cache_clear()
        assets = locate("omero_biomero/static/omero_biomero/assets")
        assets.mkdir()
        (assets / "asset-manifest.json").write_text('{"main.js":"/omero_biomero/assets/main.test.js"}', encoding="utf-8")
        (assets / "main.test.js").write_text('old BIOMERO frontend', encoding="utf-8")
        assert not host_capabilities.biomero_analysis_host_installed()
        host_capabilities.biomero_analysis_host_installed.cache_clear()
        (assets / "main.test.js").write_text('DATA_ANALYSIS_AVAILABLE embedded workspace_id', encoding="utf-8")
        assert host_capabilities.biomero_analysis_host_installed()
    finally:
        host_capabilities.biomero_analysis_host_installed.cache_clear()


def test_missing_biomero_is_safe(monkeypatch):
    def missing(_):
        raise PackageNotFoundError

    monkeypatch.setattr(host_capabilities, "distribution", missing)
    host_capabilities.biomero_analysis_host_installed.cache_clear()
    assert not host_capabilities.biomero_analysis_host_installed()
    host_capabilities.biomero_analysis_host_installed.cache_clear()


def test_embedding_requires_flag_host_and_enabled_route(settings, monkeypatch):
    settings.INTEGRATE_DATA_ANALYSIS = True
    monkeypatch.setattr(host_capabilities, "biomero_analysis_host_installed", lambda: False)
    assert not analysis_settings.integrated_data_analysis_available()
    monkeypatch.setattr(host_capabilities, "biomero_analysis_host_installed", lambda: True)
    def disabled(_):
        raise NoReverseMatch
    monkeypatch.setattr("django.urls.reverse", disabled)
    assert not analysis_settings.integrated_data_analysis_available()
    monkeypatch.setattr("django.urls.reverse", lambda _: "/omero_biomero/biomero/")
    assert analysis_settings.integrated_data_analysis_available()
    settings.INTEGRATE_DATA_ANALYSIS = False
    assert not analysis_settings.integrated_data_analysis_available()
