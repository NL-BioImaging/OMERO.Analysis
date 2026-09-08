"""Durable ownership records and bounded uploads for query promotion.

Journals contain identifiers and hashes only. OMERO creation metadata carries a
signed operation identity, so a lost create response does not lose the artifact.
"""
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import tempfile
import time
import uuid

from django.conf import settings
from django.core import signing

from .errors import RemoteQueryFailed

SALT = "nl.bioimaging.analysis.data-query.recovery.v1"
CHUNK = 1024 * 1024
PARENTS = ("Project", "Dataset", "Image", "Screen", "Plate", "Well", "PlateAcquisition", "Annotation")


def state_directory():
    directory = Path(getattr(settings, "OMERO_ANALYSIS_DATA_QUERY_STATE_DIR", "") or
                     os.getenv("OMERO_ANALYSIS_DATA_QUERY_STATE_DIR", "") or
                     Path(tempfile.gettempdir()) / "omero-analysis-data-query")
    directory.mkdir(parents=True, exist_ok=True, mode=0o700)
    return directory


def _sync_directory(directory):
    if os.name == "posix":
        fd = os.open(directory, os.O_RDONLY | os.O_DIRECTORY)
        try:
            os.fsync(fd)
        finally:
            os.close(fd)


def digest_file(path, algorithm="sha256"):
    digest = hashlib.new(algorithm)
    with Path(path).open("rb") as handle:
        for block in iter(lambda: handle.read(CHUNK), b""):
            digest.update(block)
    return digest.hexdigest()


def checkpoint(name):
    """Test seam: production never reads a fault-injection environment variable."""


def clear_staging(journal):
    root = state_directory().resolve()
    for path in root.glob("staging-" + journal.value["operation"] + "-*"):
        if path.is_symlink() or path.resolve().parent != root:
            raise RemoteQueryFailed("Unsafe promotion staging path")
        if path.is_dir():
            shutil.rmtree(path)


class PromotionJournal:
    def __init__(self, receipt_hash, record=None):
        if not re.fullmatch(r"[a-f0-9]{64}", receipt_hash):
            raise ValueError("Invalid promotion identity")
        self.path = state_directory() / (receipt_hash + ".json")
        self.value = None
        if self.path.exists():
            # Signed state fails closed on damaged files or a changed signing key.
            self.value = signing.loads(self.path.read_text(), salt=SALT)
            if self.value["receipt_sha256"] != receipt_hash or self.value["schema"] != SALT:
                raise RemoteQueryFailed("Promotion recovery state is invalid")
        elif record is not None:
            self.value = {"schema": SALT, "operation": uuid.uuid4().hex,
                          "receipt_sha256": receipt_hash, "user_id": record["user_id"],
                          "group_id": record["group_id"], "context": record["context"],
                          "result_sha256": record["result"]["execution"]["result_sha256"],
                          "byte_count": record["result"]["byte_count"], "state": "pending",
                          "artifacts": {}, "created_at": time.time()}
            self.save()

    def save(self):
        self.value["updated_at"] = time.time()
        temporary = self.path.with_suffix("." + uuid.uuid4().hex + ".tmp")
        try:
            fd = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            with os.fdopen(fd, "w", encoding="utf-8") as handle:
                handle.write(signing.dumps(self.value, salt=SALT, compress=True))
                handle.flush()
                os.fsync(handle.fileno())
            os.replace(temporary, self.path)
            _sync_directory(self.path.parent)
        finally:
            temporary.unlink(missing_ok=True)

    def intent(self, role, kind):
        identity = {key: self.value[key] for key in
                    ("operation", "receipt_sha256", "user_id", "group_id")}
        identity["role"] = role
        tag = signing.dumps(identity, salt=SALT, compress=True)
        self.value["artifacts"][role] = {"kind": kind, "tag": tag, "ids": [],
                                           "intent_at": time.time()}
        self.save()
        checkpoint(role + ":intent")
        return tag

    def remember(self, role, identifier):
        checkpoint(role + ":created")
        self.value["artifacts"][role]["ids"] = [int(identifier)]
        self.save()
        checkpoint(role + ":recorded")

    def complete(self):
        self.value["state"] = "complete"
        self.save()
        checkpoint("complete:recorded")

    def reset(self, record):
        # Keep the old attempt as evidence; it must already be clean.
        if self.value["state"] != "cleaned":
            raise RemoteQueryFailed("Previous promotion requires reconciliation")
        archive = self.path.with_name(self.value["operation"] + ".reconciled")
        os.replace(self.path, archive)
        _sync_directory(self.path.parent)
        self.__init__(self.value["receipt_sha256"], record)


def upload_annotation(conn, path, mimetype, namespace, journal, role):
    """Upload in bounded chunks, journaling the OriginalFile before writing data."""
    from omero.gateway import FileAnnotationWrapper
    from omero.model import ChecksumAlgorithmI, FileAnnotationI, OriginalFileI
    from omero.model.enums import ChecksumAlgorithmSHA1160
    from omero.rtypes import rlong, rstring

    path = Path(path)
    file_role = role + "_file"
    tag = journal.intent(file_role, "OriginalFile")
    original = OriginalFileI()
    original.setName(rstring(path.name))
    original.setPath(rstring("/omero-analysis-query/" + tag + "/"))
    original.setSize(rlong(path.stat().st_size))
    original.setMimetype(rstring(mimetype))
    original.setHash(rstring(digest_file(path, "sha1")))
    checksum = ChecksumAlgorithmI()
    checksum.setValue(rstring(ChecksumAlgorithmSHA1160))
    original.setHasher(checksum)
    update = conn.getUpdateService()
    original = update.saveAndReturnObject(original, conn.SERVICE_OPTS)
    journal.remember(file_role, original.getId().getValue())
    store = conn.createRawFileStore()
    try:
        store.setFileId(original.getId().getValue(), conn.SERVICE_OPTS)
        with path.open("rb") as handle:
            offset = 0
            for block in iter(lambda: handle.read(CHUNK), b""):
                store.write(block, offset, len(block), conn.SERVICE_OPTS)
                offset += len(block)
                checkpoint(file_role + ":chunk")
        original = store.save(conn.SERVICE_OPTS)
        checkpoint(file_role + ":uploaded")
    finally:
        store.close()
    tag = journal.intent(role, "Annotation")
    annotation = FileAnnotationI()
    annotation.setFile(original)
    annotation.setNs(rstring(namespace))
    annotation.setDescription(rstring(tag))
    annotation = update.saveAndReturnObject(annotation, conn.SERVICE_OPTS)
    journal.remember(role, annotation.getId().getValue())
    return FileAnnotationWrapper(conn, annotation)


def _discover(conn, journal):
    from omero.sys import ParametersI

    found = []
    for role, item in journal.value["artifacts"].items():
        identity = signing.loads(item["tag"], salt=SALT)
        expected = {key: journal.value[key] for key in
                    ("operation", "receipt_sha256", "user_id", "group_id")}
        if identity != {**expected, "role": role}:
            raise RemoteQueryFailed("Invalid promotion artifact identity")
        kind = item["kind"]
        field = "path" if kind == "OriginalFile" else "description"
        tag = "/omero-analysis-query/" + item["tag"] + "/" if kind == "OriginalFile" else item["tag"]
        query = (f"select a from {kind} a join fetch a.details.owner join fetch a.details.group "
                 f"where a.{field} = :tag")
        rows = conn.getQueryService().findAllByQuery(query, ParametersI().addString("tag", tag),
                                                    conn.SERVICE_OPTS)
        ids = []
        for row in rows:
            details = row.getDetails()
            if (details.getOwner().getId().getValue() != expected["user_id"] or
                    details.getGroup().getId().getValue() != expected["group_id"]):
                raise RemoteQueryFailed("Promotion artifact ownership changed")
            ids.append(int(row.getId().getValue()))
        # A create may still be executing on OMERO after the client disappeared.
        if not ids and not item["ids"] and time.time() - item["intent_at"] < 1800:
            raise RemoteQueryFailed("Uncertain OMERO creation; retry reconciliation after 30 minutes")
        if any(identifier not in ids for identifier in item["ids"]):
            # Missing objects are harmless only if truly absent, not moved/retagged.
            for identifier in item["ids"]:
                if identifier not in ids and conn.getObject(kind, identifier) is not None:
                    raise RemoteQueryFailed("Promotion artifact identity changed")
        found.extend((kind, identifier) for identifier in ids)
        if ids:
            item["ids"] = ids
    return found


def reconcile(conn, journal, apply=False):
    """Caller holds promotion_lock and uses the recorded group.

    Operator callers must use an administrator session. User retries only operate
    after the regular fresh source/destination authorization.
    """
    from .data_query_provenance import _complete_promotion

    value = journal.value
    context = value["context"]
    obj = conn.getObject(context["object_type"], context["object_id"])
    if obj and _complete_promotion(obj, value["receipt_sha256"]):
        if apply:
            journal.complete()
            clear_staging(journal)
        return {"state": "complete", "artifacts": []}
    if value["state"] == "complete":
        raise RemoteQueryFailed("A completed promotion changed; operator review required")
    found = _discover(conn, journal)
    annotations = {identifier for kind, identifier in found if kind == "Annotation"}
    # Validate every reference before deleting anything. Unknown links veto cleanup.
    for kind, identifier in found:
        if kind == "Annotation":
            for parent in PARENTS:
                for link in conn.getAnnotationLinks(parent, ann_ids=[identifier]):
                    if parent != context["object_type"] or int(link.getParent().getId()) != context["object_id"]:
                        raise RemoteQueryFailed("Promotion annotation has an external link; operator review required")
        else:
            from omero.sys import ParametersI
            rows = conn.getQueryService().findAllByQuery(
                "select a from FileAnnotation a where a.file.id = :id",
                ParametersI().addLong("id", identifier), conn.SERVICE_OPTS)
            if any(int(row.getId().getValue()) not in annotations for row in rows):
                raise RemoteQueryFailed("Promotion file is referenced elsewhere; operator review required")
    if apply:
        journal.save()
        # Delete annotations first; OMERO may cascade deletion of their files.
        for kind in ("Annotation", "OriginalFile"):
            for selected, identifier in found:
                if selected == kind and conn.getObject(kind, identifier) is not None:
                    conn.deleteObjects(kind, [identifier], wait=True)
                    checkpoint("cleanup:" + kind)
        if _discover(conn, journal):
            raise RemoteQueryFailed("Promotion cleanup is incomplete")
        journal.value["state"] = "cleaned"
        journal.save()
        clear_staging(journal)
    return {"state": "cleaned" if apply else "incomplete", "artifacts": found}
