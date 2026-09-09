"""Opt-in OMERO.web 5.31.1 Admin extension for explicitly retired test fixtures."""
import json
import os
from pathlib import Path

from django.conf import settings
from django.templatetags.static import static
from django.utils.html import format_html, json_script


class RetiredTestRecordsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        kind = {"/webadmin/experimenters/": "users", "/webadmin/groups/": "groups"}.get(request.path)
        path = getattr(settings, "OMERO_ANALYSIS_RETIRED_TEST_RECORDS", "") or os.environ.get("OMERO_ANALYSIS_RETIRED_TEST_RECORDS", "")
        if not kind or not path or response.status_code != 200 or getattr(response, "streaming", False):
            return response
        try:
            records = json.loads(Path(path).read_text(encoding="utf-8"))
            records = records.get("retired", records).get(kind, {})
            records = {str(int(key)): value for key, value in records.items()
                       if int(key) > 2 and isinstance(value, str) and value.startswith("dqw-test-")}
        except (OSError, ValueError, AttributeError):
            # An invalid registry must reveal records, never hide extra accounts.
            return response
        if not records:
            return response
        payload = json_script({"kind": kind, "records": records}, "analysis-retired-records")
        extension = format_html('{}<script defer src="{}"></script>', payload,
                                static("omero_analysis_admin/retired-test-records.js"))
        response.content = response.content.replace(b"</body>", str(extension).encode("utf-8") + b"</body>")
        if response.has_header("Content-Length"):
            response["Content-Length"] = str(len(response.content))
        return response
