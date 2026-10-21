"""Notebook-only storage rules and lossless legacy archive migration.

Namespace matches identify managed content. Names alone never identify objects
for removal. Callers must back up the original bytes before applying a migration.
"""
from __future__ import annotations

from copy import deepcopy
import io
import json
from pathlib import PurePosixPath
import zipfile

from .errors import FileTooLarge, UnsupportedMedia

STORAGE_VERSION = 3
SETTINGS_NAMESPACE = "nl.bioimaging.analysis.settings.v1"
SETTINGS_FILE_NAMESPACE = "nl.bioimaging.analysis.settings.encrypted.v1"
SKILL_FILE_NAMESPACE = "nl.bioimaging.analysis.user-skill.v1"
RETIRED_ITEM_KINDS = frozenset({"method", "method-python", "pipeline"})
RETIRED_FILE_NAMESPACES = frozenset({
    "nl.bioimaging.analysis.method.v1", "nl.bioimaging.analysis.pipeline.v1",
    SETTINGS_FILE_NAMESPACE, SKILL_FILE_NAMESPACE, "nl.bioimaging.analysis.chat.v1",
})
RETIRED_RECORDS = (
    "chats", "methods", "pipelines", "executions", "runs", "artifacts",
    "audits", "evidence",
)
WORKSPACE_FORMAT = "nl.bioimaging.analysis.workspace.v1"
MAX_ARCHIVE_BYTES = 512 * 1024 * 1024


def notebook_manifest(value):
    """Drop retired records, preserving every notebook and file reference."""
    if not isinstance(value, dict) or value.get("format") != WORKSPACE_FORMAT:
        raise UnsupportedMedia("Unsupported Analysis workspace archive")
    result = deepcopy(value)
    if not isinstance(result.get("workspace"), dict):
        raise UnsupportedMedia("Workspace archive has no workspace record")
    if not isinstance(result.get("files"), list) or not isinstance(result.get("notebooks"), list):
        raise UnsupportedMedia("Workspace archive has no files or notebooks collection")
    if not all(isinstance(file, dict) for file in result["files"]):
        raise UnsupportedMedia("Workspace archive has an invalid file record")
    result["version"] = STORAGE_VERSION
    for key in RETIRED_RECORDS:
        result[key] = []
    workspace = result["workspace"]
    workspace["storageVersion"] = STORAGE_VERSION
    workspace["activeChatId"] = ""
    workspace["plotCsv"] = True
    for file in result["files"]:
        if file.get("role") == "chat-attachment":
            for key in ("role", "chatId", "attachment"):
                file.pop(key, None)
    return result


def validate_notebook_manifest(value):
    """Reject obsolete writes instead of silently discarding their content."""
    notebook_manifest(value)
    if value.get("version") != STORAGE_VERSION or any(value.get(key) for key in RETIRED_RECORDS):
        raise UnsupportedMedia("This client uses retired Analysis content. Reload Analysis before saving.")
    workspace = value["workspace"]
    if workspace.get("activeChatId") or workspace.get("storageVersion") != STORAGE_VERSION:
        raise UnsupportedMedia("Reload Analysis to use notebook-only workspace storage.")
    if any(file.get("role") == "chat-attachment" for file in value["files"]):
        raise UnsupportedMedia("Chat attachment writes are no longer supported.")


def _archive_entries(archive):
    entries = archive.infolist()
    names = [entry.filename for entry in entries]
    if len(entries) > 10000 or len(set(names)) != len(names) or "workspace.json" not in names:
        raise UnsupportedMedia("Unsupported or ambiguous workspace archive layout")
    if sum(entry.file_size for entry in entries) > MAX_ARCHIVE_BYTES:
        raise FileTooLarge("Workspace archive expands beyond 512 MiB")
    for entry in entries:
        raw_name = entry.orig_filename
        path = PurePosixPath(raw_name)
        if not path.parts or path.is_absolute() or "\\" in raw_name or ".." in path.parts or ":" in path.parts[0]:
            raise UnsupportedMedia("Unsafe workspace archive path")
        if entry.flag_bits & 1:
            raise UnsupportedMedia("Encrypted workspace archive entries are unsupported")
    return entries


def migrate_workspace_archive(data):
    """Return v3 bytes without changing any retained input/notebook/result bytes.

    Keep all manifest-referenced files, even when a legacy result lives beneath
    Chat/ or Methods/. Drop only unreferenced retired records and their exports.
    Unknown entries remain preserved.
    """
    try:
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            entries = _archive_entries(archive)
            value = json.loads(archive.read("workspace.json"))
            migrated = notebook_manifest(value)
            retained = {file["archivePath"] for file in migrated["files"] if file.get("archivePath")}
            retired = {"chat", "chats", "methods", "pipelines", "assistant", "settings", "skills"}
            if migrated == value and not any(
                entry.filename.split("/", 1)[0].casefold() in retired
                and entry.filename not in retained for entry in entries
            ):
                return data
            output = io.BytesIO()
            with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as rewritten:
                for entry in entries:
                    name = entry.filename
                    if name == "workspace.json":
                        rewritten.writestr(name, json.dumps(migrated, ensure_ascii=False, indent=2).encode("utf-8"))
                        continue
                    top = name.split("/", 1)[0].casefold()
                    if top in {"chat", "chats", "methods", "pipelines", "assistant", "settings", "skills"} and name not in retained:
                        continue
                    rewritten.writestr(name, archive.read(entry))
            return output.getvalue()
    except (zipfile.BadZipFile, KeyError, ValueError, UnicodeDecodeError, TypeError) as exc:
        raise UnsupportedMedia("Invalid Analysis workspace archive") from exc


def validate_notebook_archive(archive):
    entries = _archive_entries(archive)
    manifest = json.loads(archive.read("workspace.json"))
    validate_notebook_manifest(manifest)
    retained = {file["archivePath"] for file in manifest["files"] if file.get("archivePath")}
    for entry in entries:
        if entry.filename.split("/", 1)[0].casefold() in {
            "chat", "chats", "methods", "pipelines", "assistant", "settings", "skills"
        } and entry.filename not in retained:
            raise UnsupportedMedia("Retired Analysis records cannot be restored or synchronized.")
    return manifest
