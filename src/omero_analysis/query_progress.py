"""Short-lived, request-scoped transfer status shared by web processes.

Readers must authorize the source before constructing this object. No source
names, credentials or query contents are stored here. Status is best effort.
"""
import hashlib
import json
import re
import tempfile
import time
from pathlib import Path


class Progress:
    def __init__(self, scope, source_ref, request_id):
        self.path = None
        self.last_write = 0
        self.started = time.time()
        if re.fullmatch(r"[a-f0-9-]{36}", request_id):
            key = hashlib.sha256(f"{scope}:{source_ref}:{request_id}".encode()).hexdigest()
            self.path = Path(tempfile.gettempdir()) / "omero-analysis-progress" / key

    def update(self, stage, sent, total):
        now = time.time()
        if self.path is None or (stage == "transferring" and now - self.last_write < 1):
            return
        self.last_write = now
        try:
            self.path.parent.mkdir(mode=0o700, exist_ok=True)
            if stage == "checking":
                for old in self.path.parent.iterdir():
                    if old.stat().st_mtime < now - 3600:
                        old.unlink(missing_ok=True)
            temporary = self.path.with_suffix(".tmp")
            temporary.write_text(json.dumps(dict(stage=stage, sent=sent, total=total,
                                                 updated=now, started=self.started)))
            temporary.replace(self.path)
        except OSError:
            pass  # Progress must never prevent an analysis.

    def read(self):
        try:
            value = json.loads(self.path.read_text()) if self.path else {}
            return value if value.get("updated", 0) > time.time() - 3600 else {}
        except (OSError, ValueError):
            return {}
