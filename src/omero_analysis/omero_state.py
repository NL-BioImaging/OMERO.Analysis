"""Signed OMERO-backed journals for deployments without ``.analysis`` storage."""

from __future__ import annotations

import json
import logging
import os
import re
import tempfile
from datetime import datetime, timezone
from pathlib import Path

from django.conf import settings
from django.core import signing

from .errors import AnalysisError, InvalidObject
from .managed_omero import annotations, plain, user_id
from .services import object_group_id, safe_filename


STATE_NAMESPACE = "nl.bioimaging.analysis.workspace.state.v1"
STATE_SCHEMA = STATE_NAMESPACE
STATE_SALT = STATE_NAMESPACE + ".signed"
MAX_STATE_BYTES = 4 * 1024 * 1024
logger = logging.getLogger(__name__)
_PATH_RE = re.compile(
    r"^workspaces/[-\w]{1,128}/(?:lifecycle|pending-cleanup|cleanup|manifest)\.json$"
)


def state_directory():
    configured = (
        getattr(settings, "OMERO_ANALYSIS_STATE_DIR", "")
        or os.environ.get("OMERO_ANALYSIS_STATE_DIR", "")
    )
    base = Path(getattr(settings, "BASE_DIR", tempfile.gettempdir()))
    path = Path(configured) if configured else base / "var" / "analysis-state"
    path.mkdir(parents=True, exist_ok=True, mode=0o700)
    return path


def _conflict(message):
    error = AnalysisError(message)
    error.code = "workspace_conflict"
    error.status = 409
    return error


def _owner_id(value):
    try:
        return int(value.getDetails().getOwner().getId())
    except (AttributeError, TypeError, ValueError):
        return None


def _annotation_bytes(annotation):
    data = bytearray()
    for chunk in annotation.getFileInChunks():
        data.extend(chunk)
        if len(data) > MAX_STATE_BYTES:
            raise InvalidObject("Workspace state record is too large")
    return bytes(data)


class OmeroStateStorage:
    """Subset of AnalysisStorage used by workspace lifecycle and cleanup."""

    is_omero_state = True

    def __init__(self, conn, source):
        self.conn = conn
        self.source = source
        self.group_id = object_group_id(source)
        self.owner_id = user_id(conn)
        self.user_root = state_directory() / str(self.group_id) / str(self.owner_id)
        self.user_root.mkdir(parents=True, exist_ok=True, mode=0o700)

    def _project(self, create=False):
        from .workspace_sync import _managed_project

        if create:
            return _managed_project(self.conn, self.group_id, create=True)
        return _managed_project(self.conn, self.group_id)

    def _relative(self, relative):
        value = Path(relative).as_posix()
        if not _PATH_RE.fullmatch(value):
            raise InvalidObject("Workspace state path is invalid")
        return value

    def _records(self, relative):
        relative = self._relative(relative)
        project = self._project()
        if project is None:
            return []
        records = []
        for annotation in annotations(project):
            namespace = str(plain(getattr(annotation, "getNs", lambda: None)()) or "")
            description = str(
                plain(getattr(annotation, "getDescription", lambda: None)()) or ""
            )
            if (
                namespace != STATE_NAMESPACE
                or description != f"OMERO Analysis state {relative}"
                or _owner_id(annotation) != self.owner_id
            ):
                continue
            try:
                signed = _annotation_bytes(annotation).decode("utf-8")
                record = signing.loads(signed, salt=STATE_SALT)
                if (
                    record.get("schema") != STATE_SCHEMA
                    or record.get("path") != relative
                    or record.get("userId") != self.owner_id
                    or record.get("groupId") != self.group_id
                    or not isinstance(record.get("generation"), int)
                    or not isinstance(record.get("payload"), dict)
                ):
                    continue
                records.append((annotation, record, signed))
            except (signing.BadSignature, UnicodeDecodeError, ValueError, TypeError):
                raise _conflict("Workspace state metadata is invalid")
        return records

    def read_json(self, relative):
        records = self._records(relative)
        if not records:
            return None
        generation = max(record["generation"] for _, record, _ in records)
        current = [item for item in records if item[1]["generation"] == generation]
        if len({signed for _, _, signed in current}) != 1:
            raise _conflict("Concurrent workspace state updates require review")
        return dict(current[-1][1]["payload"])

    def write_json(self, relative, value):
        relative = self._relative(relative)
        if not isinstance(value, dict):
            raise InvalidObject("Workspace state must be a JSON object")
        workspace_id = relative.split("/")[1]
        source_type = str(getattr(self.source, "OMERO_CLASS", "") or "").split(".")[-1]
        value = {
            **value,
            "workspaceId": workspace_id,
            "sourceObjectType": source_type,
            "sourceObjectId": int(self.source.getId()),
            "userId": self.owner_id,
            "groupId": self.group_id,
            "recordUpdatedAt": datetime.now(timezone.utc).isoformat(),
        }
        prior = self._records(relative)
        generation = max((record["generation"] for _, record, _ in prior), default=0) + 1
        record = {
            "schema": STATE_SCHEMA,
            "path": relative,
            "generation": generation,
            "userId": self.owner_id,
            "groupId": self.group_id,
            "payload": value,
        }
        encoded = signing.dumps(record, salt=STATE_SALT, compress=True).encode("utf-8")
        project = self._project(create=True)
        annotation = None
        with tempfile.TemporaryDirectory(prefix="omero-analysis-state-") as directory:
            path = Path(directory) / safe_filename(Path(relative).name)
            path.write_bytes(encoded)
            annotation = self.conn.createFileAnnfromLocalFile(
                str(path),
                mimetype="application/octet-stream",
                ns=STATE_NAMESPACE,
                desc=f"OMERO Analysis state {relative}",
            )
        try:
            project.linkAnnotation(annotation)
            current = self._records(relative)
            same_generation = [
                item for item in current if item[1]["generation"] == generation
            ]
            if len({signed for _, _, signed in same_generation}) != 1:
                raise _conflict("Concurrent workspace state updates require review")
        except Exception:
            if annotation is not None:
                try:
                    self.conn.deleteObjects("Annotation", [annotation.getId()], wait=True)
                except Exception:
                    pass
            raise
        for old, old_record, _ in current:
            if old_record["generation"] >= generation:
                continue
            try:
                self.conn.deleteObjects("Annotation", [old.getId()], wait=True)
            except Exception:
                # The highest valid generation remains authoritative. Retaining
                # an older record is safer than rolling back the committed one.
                logger.warning(
                    "Could not remove superseded Analysis state Annotation %s",
                    old.getId(),
                    exc_info=True,
                )
        return dict(value)

    def delete_json(self, relative):
        for annotation, _, _ in self._records(relative):
            self.conn.deleteObjects("Annotation", [annotation.getId()], wait=True)

    def workspace_manifest_path(self, workspace_id):
        return Path("workspaces") / str(workspace_id) / "manifest.json"

    def remove_workspace_view(self, workspace_id):
        return None

    def prune_empty_directories(self):
        return 0
