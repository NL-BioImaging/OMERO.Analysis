"""Mapping-scoped shared notebook/template catalogue and revisioned publication."""
from __future__ import annotations

import csv
from contextlib import contextmanager
import hashlib
import io
import json
import os
import stat
import tempfile
import time
import uuid
import zipfile
from pathlib import Path

from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.crypto import salted_hmac

from .errors import AnalysisError, FileTooLarge, ObjectNotFound, UnsupportedMedia
from .notebook_contract import prepare_notebook
from .services import object_group_id, validate_notebook
from .settings import max_notebook_bytes, max_upload_bytes
from .storage_policy import storage_policy
from .sync_lock import storage_lock
from .workspace_access import require_workspace_access

FOLDER = ".analysis_notebooks_templates"
KINDS = {"notebook": ("notebooks", {".ipynb"}), "template": ("templates", {".xlsx", ".xls", ".csv"})}
CACHE_SECONDS = 5
MIN_STABLE_SECONDS = 1
MAX_ITEMS = 1000


def failure(message, code="shared_library_unavailable", status=503):
    error = AnalysisError(message)
    error.code, error.status = code, status
    return error


def full_admin(conn):
    if not getattr(conn, "isFullAdmin", lambda: False)():
        return False
    # Do not authorize publication with a stale cached session role.
    from omero.sys import ParametersI
    rows = conn.getQueryService().projection(
        "SELECT m.parent.name FROM GroupExperimenterMap m WHERE m.child.id = :user "
        "AND m.parent.name = 'system'", ParametersI().addLong("user", int(conn.getUserId())))
    return bool(rows)


def library_for(conn, obj):
    require_workspace_access(conn, obj)
    policy = storage_policy(object_group_id(obj), int(conn.getUserId()))
    if policy.operation_mode != "inplace":
        raise failure(policy.capability.detail, "shared_library_disabled" if policy.operation_mode == "omero"
                      else "shared_library_unavailable", 404 if policy.operation_mode == "omero" else 503)
    return SharedLibrary(policy.capability.mapped_root)


def shared_groups(conn, library):
    """Only administrators receive the cross-group destination summary."""
    from omero_biomero.utils import get_all_group_mappings, get_group_folder_path
    mappings = get_all_group_mappings(
        config_file_path=os.environ.get("OMERO_BIOMERO_CONFIG_FILE") or None,
        group_mappings_file_path=os.environ.get("OMERO_BIOMERO_GROUP_MAPPINGS_FILE") or None)
    groups = []
    for group_id, mapping in mappings.items():
        resolved = get_group_folder_path(
            int(group_id), base_dir=os.environ["IMPORT_MOUNT_PATH"],
            group_mappings_file_path=os.environ.get("OMERO_BIOMERO_GROUP_MAPPINGS_FILE") or None)
        if resolved and Path(resolved).resolve() == library.mapped:
            groups.append({"id": int(group_id), "name": mapping.get("groupName") or mapping.get("group_name") or str(group_id)})
    return sorted(groups, key=lambda g: (g["name"], g["id"]))


def validate_payload(name, kind, data):
    if kind not in KINDS or Path(name).suffix.lower() not in KINDS[kind][1]:
        raise UnsupportedMedia("Use .ipynb notebooks or .xlsx, .xls, .csv plate templates")
    limit = max_notebook_bytes() if kind == "notebook" else max_upload_bytes()
    if len(data) > limit:
        raise FileTooLarge(f"Shared {kind} exceeds the configured {limit}-byte limit")
    if kind == "notebook":
        try:
            document = json.loads(data)
            if not isinstance(document, dict) or not isinstance(document.get("metadata", {}), dict):
                raise ValueError("Notebook metadata must be an object")
            for cell in document.get("cells", []):
                if not isinstance(cell, dict) or not isinstance(cell.get("metadata", {}), dict):
                    raise ValueError("Notebook cell metadata must be an object")
            validate_notebook(SimpleUploadedFile(name, data))
            document, contract = prepare_notebook(document)
        except (ValueError, TypeError, AttributeError, RecursionError) as exc:
            raise UnsupportedMedia(f"Invalid notebook: {exc}") from exc
        return (json.dumps(document, ensure_ascii=False).encode(), "application/x-ipynb+json", contract)
    if not data:
        raise UnsupportedMedia("Plate template is empty")
    extension = Path(name).suffix.lower()
    if extension == ".xlsx":
        try:
            with zipfile.ZipFile(io.BytesIO(data)) as archive:
                if not {"[Content_Types].xml", "xl/workbook.xml"}.issubset(archive.namelist()):
                    raise ValueError("Missing workbook structure")
                if sum(i.file_size for i in archive.infolist()) > max_upload_bytes() * 4:
                    raise ValueError("Uncompressed workbook exceeds the limit")
                if any(i.filename.lower().endswith("vbaproject.bin") for i in archive.infolist()):
                    raise ValueError("Macro-enabled workbooks are unsupported")
        except (zipfile.BadZipFile, ValueError) as exc:
            raise UnsupportedMedia(f"Invalid Excel workbook: {exc}") from exc
        mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    elif extension == ".xls":
        if len(data) < 512 or not data.startswith(bytes.fromhex("D0CF11E0A1B11AE1")):
            raise UnsupportedMedia("Invalid legacy Excel workbook")
        mime = "application/vnd.ms-excel"
    else:
        try:
            value = data.decode("utf-8-sig")
            if "\x00" in value or not next(csv.reader(io.StringIO(value), strict=True), []):
                raise ValueError("Missing CSV header")
            for _ in csv.reader(io.StringIO(value), strict=True):
                pass
        except (UnicodeError, csv.Error, ValueError) as exc:
            raise UnsupportedMedia(f"Invalid UTF-8 CSV template: {exc}") from exc
        mime = "text/csv"
    return data, mime, None


class SharedLibrary:
    def __init__(self, mapped_root):
        self.mapped = Path(mapped_root).resolve(strict=True)
        self.root = self.mapped / FOLDER
        self.state = self.root / ".catalogue"
        self.user_root = self.state  # storage_lock uses the location, not an OMERO group.
        self.identity = salted_hmac("analysis.shared-library", str(self.mapped)).hexdigest()
        self._check(self.root)

    def _check(self, path):
        relative = Path(path).relative_to(self.mapped)
        current = self.mapped
        for component in relative.parts:
            current = current / component
            if current.is_symlink() or getattr(current, "is_junction", lambda: False)():
                raise failure("Shared library symlinks are not allowed", "shared_library_unsafe", 400)
            if current.exists() and current != path and not current.is_dir():
                raise failure("Invalid shared library directory", "shared_library_unsafe", 400)
        Path(path).resolve().relative_to(self.root)
        return Path(path)

    @contextmanager
    def _parent(self, path):
        """Pin every directory component on POSIX; never follow swapped symlinks."""
        path = self._check(path)
        if os.name == "nt":
            yield None
            return
        descriptor = os.open(self.mapped, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
        try:
            for part in path.parent.relative_to(self.mapped).parts:
                child = os.open(part, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW, dir_fd=descriptor)
                os.close(descriptor)
                descriptor = child
            yield descriptor
        finally:
            os.close(descriptor)

    def open_lock(self):
        path = self.state / ".sync.lock"
        with self._parent(path) as parent:
            fd = os.open(path if parent is None else path.name,
                         os.O_RDWR | os.O_CREAT | getattr(os, "O_NOFOLLOW", 0), 0o660, dir_fd=parent)
            return os.fdopen(fd, "a+b")

    def _name(self, kind, name):
        if (kind not in KINDS or not isinstance(name, str) or not name or name.startswith((".", "~"))
                or any(c in name for c in '/\\:\x00') or any(ord(c) < 32 for c in name)
                or name.rstrip(" .") != name or len(name.encode()) > 240):
            raise UnsupportedMedia("Invalid shared library filename")
        if Path(name).suffix.lower() not in KINDS[kind][1]:
            raise UnsupportedMedia("Unsupported shared library file type")
        return name

    def _id(self, kind, name):
        return hashlib.sha256(f"{self.identity}/{kind}/{name}".encode()).hexdigest()

    def _init(self, create=False):
        if not self.root.exists() and not create:
            return False
        for directory in [self.root, self.state, self.state / "revisions"]:
            self._mkdir(directory)
        if create:
            for folder, _ in KINDS.values():
                self._mkdir(self.root / folder)
        self._check(self.state / ".sync.lock")
        return True

    def _mkdir(self, path):
        with self._parent(path) as parent:
            try:
                os.mkdir(path if parent is None else path.name, mode=0o770, dir_fd=parent)
            except FileExistsError:
                if not self._check(path).is_dir():
                    raise failure("Invalid shared library directory")

    def _read(self, path, limit):
        path = self._check(path)
        before = path.stat(follow_symlinks=False)
        if not stat.S_ISREG(before.st_mode):
            raise UnsupportedMedia("Only regular files are supported")
        if before.st_size > limit:
            raise FileTooLarge("Shared file exceeds the configured size limit")
        with self._parent(path) as parent:
            descriptor = os.open(path if parent is None else path.name,
                                 os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0) | getattr(os, "O_NONBLOCK", 0), dir_fd=parent)
        with os.fdopen(descriptor, "rb") as handle:
            opened = os.fstat(handle.fileno())
            if not stat.S_ISREG(opened.st_mode) or (before.st_dev, before.st_ino) != (opened.st_dev, opened.st_ino):
                raise failure("File changed during read; refresh and retry", "shared_library_changed", 409)
            data = handle.read(limit + 1)
            after = os.fstat(handle.fileno())
        self._check(path)
        current = path.stat(follow_symlinks=False)
        signature = lambda s: (s.st_dev, s.st_ino, s.st_size, s.st_mtime_ns, s.st_ctime_ns)
        if signature(before) != signature(current) or signature(opened) != signature(after) or len(data) > limit:
            raise failure("File changed during read; refresh and retry", "shared_library_changed", 409)
        return data

    def _atomic(self, path, data):
        if os.name != "nt":
            with self._parent(path) as parent:
                temporary = ".write-" + uuid.uuid4().hex
                fd = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o660, dir_fd=parent)
                try:
                    with os.fdopen(fd, "wb") as handle:
                        handle.write(data)
                        handle.flush()
                        os.fsync(handle.fileno())
                    self._check(path)
                    os.replace(temporary, path.name, src_dir_fd=parent, dst_dir_fd=parent)
                    os.fsync(parent)
                finally:
                    try:
                        os.unlink(temporary, dir_fd=parent)
                    except FileNotFoundError:
                        pass
            return
        self._check(path)
        fd, temporary = tempfile.mkstemp(prefix=".write-", dir=path.parent)
        try:
            with os.fdopen(fd, "wb") as handle:
                handle.write(data)
                handle.flush()
                os.fsync(handle.fileno())
            self._check(path)
            os.replace(temporary, path)
            if os.name != "nt":
                fd = os.open(path.parent, os.O_RDONLY | os.O_DIRECTORY)
                try:
                    os.fsync(fd)
                finally:
                    os.close(fd)
        finally:
            if os.path.exists(temporary):
                os.unlink(temporary)

    def _json(self, path, default):
        if not self._check(path).exists():
            return default
        try:
            return json.loads(self._read(path, 16 * 1024 * 1024))
        except (ValueError, UnicodeError) as exc:
            raise failure("Shared catalogue is invalid; administrator recovery required") from exc

    def _commit(self, catalogue):
        self._atomic(self.state / "index.json", json.dumps(catalogue, ensure_ascii=False).encode())

    def _scan(self):
        catalogue = self._json(self.state / "index.json", {"items": {}})
        for item in catalogue["items"].values():
            item["present"] = False
        pending = self._json(self.state / "pending.json", {})
        count = 0
        for kind, (folder, extensions) in KINDS.items():
            directory = self._check(self.root / folder)
            if not directory.exists():
                continue
            for path in sorted(directory.iterdir()):
                if path.name.startswith((".", "~")) or path.suffix.lower() not in extensions:
                    continue
                count += 1
                if count > MAX_ITEMS:
                    raise failure(f"Shared library exceeds {MAX_ITEMS} files")
                key = self._id(kind, path.name)
                item = catalogue["items"].setdefault(key, {"id": key, "kind": kind, "name": path.name, "revisions": []})
                item.update(present=True, available=False, error="")
                try:
                    self._name(kind, path.name)
                    data = self._read(path, max_notebook_bytes() if kind == "notebook" else max_upload_bytes())
                    raw_hash = hashlib.sha256(data).hexdigest()
                    clean, mime, contract = validate_payload(path.name, kind, data)
                    digest = hashlib.sha256(clean).hexdigest()
                    publication = pending.get("id") == key and pending.get("revision") == digest
                    if (not publication and item.get("rawHash") != raw_hash
                            and time.time() - path.stat(follow_symlinks=False).st_mtime < MIN_STABLE_SECONDS):
                        raise failure("File is still settling; refresh shortly", "shared_library_changed", 409)
                    blob = self.state / "revisions" / digest
                    if not self._check(blob).exists():
                        self._atomic(blob, clean)
                    revision = next((r for r in item["revisions"] if r["revision"] == digest), None)
                    if revision is None:
                        revision = {"revision": digest, "sha256": digest, "size": len(clean), "observedAt": time.time(),
                                    "origin": "filesystem", "mimetype": mime, "contract": contract}
                        item["revisions"].append(revision)
                    if publication:
                        revision.update(origin="admin", publishedBy=pending["publishedBy"])
                    item.update(revision, revision=digest, rawHash=raw_hash, available=True)
                except (AnalysisError, OSError, ValueError, TypeError, AttributeError) as exc:
                    item["error"] = str(exc)
        catalogue["scannedAt"] = time.time()
        self._commit(catalogue)
        if pending:
            self._check(self.state / "pending.json").unlink(missing_ok=True)
        return catalogue

    def catalogue(self, refresh=False):
        if not self._init():
            return {"libraryId": self.identity, "items": []}
        with storage_lock(self):
            catalogue = self._json(self.state / "index.json", {"items": {}})
            if refresh or time.time() - catalogue.get("scannedAt", 0) > CACHE_SECONDS:
                catalogue = self._scan()
            items = [{k: v for k, v in item.items() if k not in {"rawHash", "present", "revisions"}}
                     | {"revisionCount": len(item["revisions"])}
                     for item in catalogue["items"].values() if item.get("present")]
            return {"libraryId": self.identity, "items": sorted(items, key=lambda i: (i["kind"], i["name"].lower()))}

    def _item(self, catalogue, item_id):
        item = catalogue["items"].get(item_id)
        if not item or not item.get("present"):
            raise ObjectNotFound("Shared item no longer exists at this mapping")
        return item

    def history(self, item_id):
        if not self._init():
            raise ObjectNotFound("Shared library does not exist")
        with storage_lock(self):
            item = self._item(self._scan(), item_id)
            return {"id": item_id, "revisions": item["revisions"]}

    def download(self, item_id, revision):
        if not self._init():
            raise ObjectNotFound("Shared library does not exist")
        with storage_lock(self):
            item = self._item(self._scan(), item_id)
            found = next((r for r in item["revisions"] if r["revision"] == revision), None)
            if not found:
                raise ObjectNotFound("Shared item revision is unavailable")
            data = self._read(self.state / "revisions" / found["sha256"], found["size"])
            if hashlib.sha256(data).hexdigest() != found["sha256"]:
                raise failure("Stored shared revision failed its integrity check")
            return data, dict(found, name=item["name"])

    def publish(self, kind, name, data, expected_revision, user_id):
        name = self._name(kind, name)
        clean, _, _ = validate_payload(name, kind, data)
        self._init(create=True)
        with storage_lock(self):
            catalogue = self._scan()
            key = self._id(kind, name)
            existing = catalogue["items"].get(key)
            if existing and existing.get("present"):
                if not existing.get("available") or expected_revision != existing.get("revision"):
                    raise failure("Shared item changed; refresh before publishing", "shared_library_conflict", 409)
            elif expected_revision:
                raise failure("Shared item was removed; refresh before publishing", "shared_library_conflict", 409)
            destination = self._check(self.root / KINDS[kind][0] / name)
            # Catch external edits after discovery, before replacing the live file.
            if existing and existing.get("present"):
                raw = self._read(destination, max_notebook_bytes() if kind == "notebook" else max_upload_bytes())
                if hashlib.sha256(raw).hexdigest() != existing["rawHash"]:
                    raise failure("Shared file changed during publication", "shared_library_conflict", 409)
            elif destination.exists():
                raise failure("A shared file with that name already exists", "shared_library_conflict", 409)
            digest = hashlib.sha256(clean).hexdigest()
            self._atomic(self.state / "pending.json", json.dumps({
                "id": key, "revision": digest, "publishedBy": user_id}).encode())
            self._atomic(destination, clean)
            return self._item(self._scan(), key)
