"""Real optional-provider route and package contracts; run in the paired CI job."""
from types import ModuleType
import pytest
from django.urls import clear_url_caches, include, path
from omero_analysis import integrations

def test_installed_viewer_routes_and_immutable_skill_package(settings):
    pytest.importorskip('biomero_zarr_viewer')
    from biomero_zarr_viewer.analysis_skill_provider import descriptor, package_payload
    urlconf = ModuleType('installed_viewer_test_urls')
    urlconf.urlpatterns = [path('biomero_zarr_viewer/', include('biomero_zarr_viewer.urls'))]
    settings.ROOT_URLCONF = urlconf
    clear_url_caches()
    try:
        status = integrations.zarr_viewer_status()
        assert status['available'] is True
        assert status['image_capabilities_template'].endswith('/images/0/capabilities/')
        skill = descriptor()
        bundled = package_payload()
        assert skill['sha256'] == bundled['skill']['sha256']
        assert any(item['path'] == 'SKILL.md' for item in bundled['files'])
    finally:
        clear_url_caches()
