import json

from django.http import HttpResponse
from django.test import RequestFactory, override_settings

from omero_analysis.admin_extension import RetiredTestRecordsMiddleware


def test_filter_requires_exact_registry_and_admin_listing(tmp_path):
    registry = tmp_path / "retired.json"
    registry.write_text(json.dumps({"retired": {"users": {"102": "dqw-test-abc-owner", "52": "rahoebe", "0": "dqw-test-root"}}}))
    middleware = RetiredTestRecordsMiddleware(lambda _: HttpResponse("<body></body>"))
    with override_settings(OMERO_ANALYSIS_RETIRED_TEST_RECORDS=str(registry)):
        body = middleware(RequestFactory().get("/webadmin/experimenters/")).content.decode()
        assert 'dqw-test-abc-owner' in body
        assert 'rahoebe' not in body and 'dqw-test-root' not in body
        assert 'omero_analysis_admin/retired-test-records.js' in body
        assert middleware(RequestFactory().get("/webclient/")).content == b"<body></body>"


def test_missing_or_broken_registry_reveals_all_records(tmp_path):
    middleware = RetiredTestRecordsMiddleware(lambda _: HttpResponse("<body></body>"))
    registry = tmp_path / 'missing.json'
    with override_settings(OMERO_ANALYSIS_RETIRED_TEST_RECORDS=str(registry)):
        assert middleware(RequestFactory().get("/webadmin/groups/")).content == b"<body></body>"
        registry.write_text('{bad')
        assert middleware(RequestFactory().get("/webadmin/groups/")).content == b"<body></body>"
