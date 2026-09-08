"""Redacted, correlatable audit events, independent of the worker cache."""
from __future__ import annotations

import json
import logging
import os
import re
import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path

from django.conf import settings

_guard = threading.Lock()
_ALLOWED = {"request_id", "user_id", "group_id", "object_type", "object_id", "annotation_id",
            "file_id", "source_sha256", "sql_sha256", "result_sha256", "receipt_sha256",
            "row_count", "byte_count", "duration_ms", "cache_status", "code",
            "result_annotation_id", "provenance_annotation_id"}


def correlation_id(value=None):
    return value if isinstance(value, str) and re.fullmatch(r"[A-Za-z0-9._-]{1,80}", value) else uuid.uuid4().hex


def request_correlation(request):
    if not getattr(request, "data_query_request_id", None):
        request.data_query_request_id = correlation_id(request.headers.get("X-Request-ID"))
    return request.data_query_request_id


def audit(event, outcome, **values):
    payload = {"timestamp": datetime.now(timezone.utc).isoformat(),
               "event": event, "outcome": outcome,
               **{k: v for k, v in values.items() if k in _ALLOWED and
                  (v is None or isinstance(v, (str, int, float, bool)))}}
    encoded = json.dumps(payload, sort_keys=True, separators=(",", ":"))
    path = str(getattr(settings, "OMERO_ANALYSIS_DATA_QUERY_AUDIT_FILE", "") or
               os.getenv("OMERO_ANALYSIS_DATA_QUERY_AUDIT_FILE", ""))
    if path:
        # O_APPEND + one write per event also supports multiple web workers and external logrotate.
        with _guard:
            target = Path(path)
            target.parent.mkdir(parents=True, mode=0o700, exist_ok=True)
            fd = os.open(target, os.O_WRONLY | os.O_APPEND | os.O_CREAT, 0o600)
            try:
                raw = (encoded + "\n").encode()
                if os.write(fd, raw) != len(raw):
                    raise OSError("Incomplete query audit write")
                os.fsync(fd)
            finally:
                os.close(fd)
    else:
        logging.getLogger("omero_analysis.data_query.audit").info(encoded)
