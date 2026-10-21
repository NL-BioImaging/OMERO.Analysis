import io
import json
import zipfile

import pytest

from omero_analysis.errors import UnsupportedMedia
from omero_analysis.retired_content import migrate_workspace_archive, validate_notebook_manifest


def archive(manifest, extra=None):
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w") as target:
        target.writestr("workspace.json", json.dumps(manifest))
        for path, data in (extra or {}).items():
            entry = zipfile.ZipInfo("placeholder")
            entry.filename = path  # Keep hostile separators even on Windows.
            target.writestr(entry, data)
    return output.getvalue()


def legacy():
    return {
        "format": "nl.bioimaging.analysis.workspace.v1", "version": 2,
        "workspace": {"id": "mine", "activeChatId": "old", "plotCsv": False},
        "chats": [{"id": "old"}], "methods": [{"id": "method"}],
        "pipelines": [], "notebooks": [{"id": "notebook", "document": {"cells": []}}],
        "files": [
            {"id": "result", "source": "result", "archivePath": "Chat/old/result.csv"},
            {"id": "input", "role": "chat-attachment", "chatId": "old", "archivePath": "Input/input.csv"},
        ],
    }


def test_migration_retains_legacy_results_and_input_bytes_and_cannot_resurrect_records():
    original = legacy()
    data = archive(original, {
        "Chat/old/result.csv": b"a\n1\n", "Input/input.csv": b"b\n2\n",
        "Methods/old.py": b"obsolete", "Chat/old/chat.json": b"obsolete",
        "Notebooks/book.ipynb": b"retained", "extra.txt": b"unrelated",
    })
    migrated = migrate_workspace_archive(data)
    with zipfile.ZipFile(io.BytesIO(migrated)) as restored:
        manifest = json.loads(restored.read("workspace.json"))
        assert manifest["notebooks"] == original["notebooks"]
        assert manifest["chats"] == manifest["methods"] == []
        assert manifest["workspace"]["plotCsv"] is True
        assert manifest["workspace"]["activeChatId"] == ""
        assert restored.read("Chat/old/result.csv") == b"a\n1\n"
        assert restored.read("Input/input.csv") == b"b\n2\n"
        assert restored.read("Notebooks/book.ipynb") == b"retained"
        assert restored.read("extra.txt") == b"unrelated"
        assert "Methods/old.py" not in restored.namelist()
        assert "role" not in manifest["files"][1]
        validate_notebook_manifest(manifest)
    with zipfile.ZipFile(io.BytesIO(migrate_workspace_archive(migrated))) as repeated:
        assert json.loads(repeated.read("workspace.json")) == manifest


def test_old_client_writes_are_rejected_instead_of_silently_erasing_their_records():
    with pytest.raises(UnsupportedMedia, match="retired"):
        validate_notebook_manifest(legacy())


@pytest.mark.parametrize("path", ["../outside", "/outside", "C:/outside", "Input\\outside"])
def test_migration_rejects_unsafe_archive_paths(path):
    with pytest.raises(UnsupportedMedia, match="Unsafe"):
        migrate_workspace_archive(archive(legacy(), {path: b"invalid"}))


@pytest.mark.parametrize("url", [
    "/api/settings/Screen/152/", "/api/pipelines/Screen/152/templates/",
    "/api/pipeline-template/752/download/",
])
def test_retired_api_routes_are_removed(url):
    from django.urls import Resolver404, resolve
    with pytest.raises(Resolver404):
        resolve(url, urlconf="omero_analysis.urls")
