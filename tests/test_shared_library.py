import json
from pathlib import Path
from types import SimpleNamespace

import pytest

from omero_analysis.errors import AnalysisError, ObjectNotFound, UnsupportedMedia
from omero_analysis.shared_library import SharedLibrary, FOLDER, validate_payload


@pytest.fixture(autouse=True)
def immediate_files(monkeypatch):
    monkeypatch.setattr("omero_analysis.shared_library.MIN_STABLE_SECONDS", 0)


def notebook(text="print('hello')"):
    return json.dumps({"nbformat": 4, "nbformat_minor": 5, "metadata": {}, "cells": [{
        "cell_type": "code", "metadata": {}, "source": text, "outputs": [{"text": "private"}],
        "execution_count": 4}]}).encode()


def test_external_discovery_history_and_independent_revision(tmp_path):
    root = tmp_path / FOLDER / "notebooks"
    root.mkdir(parents=True)
    file = root / "analysis.ipynb"
    file.write_bytes(notebook())
    library = SharedLibrary(tmp_path)
    first = library.catalogue()["items"][0]
    data, _ = library.download(first["id"], first["revision"])
    assert json.loads(data)["cells"][0]["outputs"] == []
    file.write_bytes(notebook("print('new')"))
    second = library.catalogue(refresh=True)["items"][0]
    assert first["revision"] != second["revision"]
    assert len(library.history(first["id"])["revisions"]) == 2
    assert library.download(first["id"], first["revision"])[0] == data
    file.write_text('{"cells":')
    bad = library.catalogue(refresh=True)["items"][0]
    assert not bad["available"] and bad["revision"] == second["revision"]
    assert library.download(first["id"], first["revision"])[0] == data
    file.unlink()
    assert library.catalogue(refresh=True)["items"] == []
    with pytest.raises(ObjectNotFound):
        library.download(first["id"], first["revision"])


def test_publication_compare_and_swap_and_recovery(tmp_path, monkeypatch):
    library = SharedLibrary(tmp_path)
    assert library.catalogue()["items"] == []
    assert not (tmp_path / FOLDER).exists()
    first = library.publish("template", "plate.csv", b"well,dose\nA1,1\n", None, 0)
    assert first["publishedBy"] == 0
    with pytest.raises(AnalysisError) as exc:
        library.publish("template", "plate.csv", b"well,dose\nA1,2\n", None, 0)
    assert exc.value.status == 409
    original = library._scan
    calls = 0

    def interrupted():
        nonlocal calls
        calls += 1
        if calls == 2:
            raise RuntimeError("web worker stopped after file replacement")
        return original()

    monkeypatch.setattr(library, "_scan", interrupted)
    with pytest.raises(RuntimeError):
        library.publish("template", "plate.csv", b"well,dose\nA1,2\n", first["revision"], 0)
    recovered = SharedLibrary(tmp_path).catalogue(refresh=True)["items"][0]
    assert recovered["revision"] != first["revision"] and recovered["publishedBy"] == 0
    assert recovered["revisionCount"] == 2


def test_shared_location_identity_and_isolation(tmp_path):
    a = tmp_path / "a"
    b = tmp_path / "b"
    a.mkdir()
    b.mkdir()
    one, two, separate = SharedLibrary(a), SharedLibrary(a), SharedLibrary(b)
    item = one.publish("notebook", "same.ipynb", notebook(), None, 0)
    assert two.identity == one.identity != separate.identity
    assert two.catalogue()["items"][0]["id"] == item["id"]
    with pytest.raises(ObjectNotFound):
        separate.download(item["id"], item["revision"])


@pytest.mark.parametrize("name", ["../a.ipynb", "a/b.ipynb", "a\\b.ipynb", ".a.ipynb", "~a.ipynb", "C:a.ipynb"])
def test_unsafe_names_rejected(tmp_path, name):
    with pytest.raises(UnsupportedMedia):
        SharedLibrary(tmp_path).publish("notebook", name, notebook(), None, 0)


def test_symlink_rejected(tmp_path):
    outside = tmp_path / "outside.ipynb"
    outside.write_bytes(notebook())
    folder = tmp_path / FOLDER / "notebooks"
    folder.mkdir(parents=True)
    try:
        (folder / "escape.ipynb").symlink_to(outside)
    except OSError:
        pytest.skip("Host does not permit symlinks")
    item = SharedLibrary(tmp_path).catalogue()["items"][0]
    assert not item["available"] and "symlink" in item["error"]


def test_portable_contract_is_parsed_without_execution():
    contract = {"schema": "nl.bioimaging.omero-analysis-notebook.v1", "inputs": [
        {"id": "data", "kind": "query", "path": "input/data.csv", "formats": ["csv"]}],
        "results": {"path": "results"}}
    doc = json.loads(notebook("raise RuntimeError('never execute')"))
    doc["cells"].insert(0, {"cell_type": "code", "metadata": {"tags": ["omero-analysis-config"]},
                            "source": "ctx = oan.configure('''" + json.dumps(contract) + "''')"})
    data, _, parsed = validate_payload("analysis.ipynb", "notebook", json.dumps(doc).encode())
    assert parsed["inputs"][0]["required"] is True
    assert "never execute" in data.decode()


def test_forged_revision_blob_fails_integrity_check(tmp_path):
    library = SharedLibrary(tmp_path)
    item = library.publish("template", "layout.csv", b"well\nA1\n", None, 0)
    (library.state / "revisions" / item["revision"]).write_bytes(b"well\nB1\n")
    with pytest.raises(AnalysisError, match="integrity"):
        library.download(item["id"], item["revision"])


@pytest.mark.parametrize("mode,status,code", [("omero", 404, "shared_library_disabled"), ("blocked", 503, "shared_library_unavailable")])
def test_disabled_or_broken_importer_never_opens_library(tmp_path, monkeypatch, mode, status, code):
    from omero_analysis import shared_library as shared
    from .conftest import FakeConnection, FakeObject
    monkeypatch.setattr(shared, "storage_policy", lambda *args: SimpleNamespace(operation_mode=mode,
        capability=SimpleNamespace(detail="Importer unavailable", mapped_root=tmp_path)))
    with pytest.raises(AnalysisError) as exc:
        shared.library_for(FakeConnection(), FakeObject())
    assert exc.value.status == status and exc.value.code == code
    assert not list(tmp_path.iterdir())


def test_membership_revocation_and_root_mapping_revalidation(tmp_path, monkeypatch):
    from omero_analysis import shared_library as shared
    from .conftest import FakeConnection, FakeObject, Value
    from omero_analysis.errors import PermissionDenied
    obj, mappings = FakeObject(group_id=0), [tmp_path]
    conn = FakeConnection(obj, user_id=0)
    conn.getEventContext = lambda: SimpleNamespace(groupId=0)
    rows = [[Value(0), Value("system")], [Value(1), Value("user")]]
    conn.getQueryService = lambda: SimpleNamespace(projection=lambda *args: rows)
    monkeypatch.setattr(shared, "storage_policy", lambda group, user: SimpleNamespace(operation_mode="inplace",
        capability=SimpleNamespace(mapped_root=mappings[0])))
    first = shared.library_for(conn, obj)
    other = tmp_path / "other"
    other.mkdir()
    mappings[0] = other
    assert shared.library_for(conn, obj).identity != first.identity
    rows.clear()
    with pytest.raises(PermissionDenied, match="revoked"):
        shared.library_for(conn, obj)


def test_full_admin_requires_fresh_role_not_only_cached_session():
    from omero_analysis.shared_library import full_admin
    conn = SimpleNamespace(isFullAdmin=lambda: True, getUserId=lambda: 0,
                           getQueryService=lambda: SimpleNamespace(projection=lambda *args: []))
    assert not full_admin(conn)
    conn.getQueryService = lambda: SimpleNamespace(projection=lambda *args: [["system"]])
    assert full_admin(conn)
    conn.isFullAdmin = lambda: False
    assert not full_admin(conn)


def test_non_admin_cannot_publish_even_with_old_token(tmp_path, monkeypatch):
    from django.test import RequestFactory
    from django.core.files.uploadedfile import SimpleUploadedFile
    from omero_analysis import views, shared_library as shared
    from .conftest import FakeConnection, FakeObject
    from .test_views import token_for, with_session
    obj, library = FakeObject(), SharedLibrary(tmp_path)
    conn = FakeConnection(obj)
    monkeypatch.setattr(shared, "library_for", lambda *args: library)
    request = with_session(RequestFactory().post("/", {"kind": "template", "library_id": library.identity,
        "file": SimpleUploadedFile("plate.csv", b"well\nA1\n")}))
    request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = token_for(conn, obj, ["shared_library_publish"])
    response = views.shared_library(request, "Image", 1, conn=conn)
    assert response.status_code == 403
    assert not list(tmp_path.iterdir())


def test_api_publication_destination_review_history_download(tmp_path, monkeypatch):
    from django.test import RequestFactory
    from django.core.files.uploadedfile import SimpleUploadedFile
    from omero_analysis import views, shared_library as shared
    from .conftest import FakeConnection, FakeObject
    from .test_views import token_for, with_session
    obj, library = FakeObject(group_id=0), SharedLibrary(tmp_path)
    conn = FakeConnection(obj, user_id=0)
    groups = [{"id": 0, "name": "system"}, {"id": 4, "name": "shared group"}]
    monkeypatch.setattr(shared, "library_for", lambda *args: library)
    monkeypatch.setattr(shared, "full_admin", lambda *args: True)
    monkeypatch.setattr(shared, "shared_groups", lambda *args: groups)
    token = token_for(conn, obj, ["library_list", "library_download", "shared_library_publish"])
    def authorized(request):
        request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = token
        return with_session(request)
    listing = views.shared_library(authorized(RequestFactory().get("/")), "Image", 1, conn=conn)
    catalogue = json.loads(listing.content)
    assert listing.status_code == 200 and catalogue["canPublish"] and catalogue["items"] == []
    def publish(destination):
        return views.shared_library(authorized(RequestFactory().post("/", {
            "kind": "template", "library_id": library.identity, "destination_revision": destination,
            "file": SimpleUploadedFile("layout.csv", b"well\nA1\n")})), "Image", 1, conn=conn)
    assert publish("stale-groups").status_code == 409
    result = publish(catalogue["destinationRevision"])
    assert result.status_code == 201
    item = json.loads(result.content)["item"]
    response = views.shared_library_item(authorized(RequestFactory().get("/")), "Image", 1,
        item["id"], item["revision"], conn=conn)
    assert response.content == b"well\nA1\n" and response["Cache-Control"] == "private, no-store"
    history = views.shared_library_item(authorized(RequestFactory().get("/")), "Image", 1, item["id"], conn=conn)
    assert len(json.loads(history.content)["revisions"]) == 1


def test_limits_hidden_files_and_malformed_notebooks(tmp_path, settings):
    from omero_analysis.errors import FileTooLarge
    library = SharedLibrary(tmp_path)
    settings.OMERO_ANALYSIS_MAX_UPLOAD_BYTES = 8
    with pytest.raises(FileTooLarge):
        library.publish("template", "layout.csv", b"well,dose\nA1,1\n", None, 0)
    with pytest.raises(UnsupportedMedia):
        library.publish("notebook", "bad.ipynb", b'{"nbformat":4,"metadata":[],"cells":[]}', None, 0)
    folder = tmp_path / FOLDER / "notebooks"
    folder.mkdir(parents=True)
    for name in (".hidden.ipynb", "~partial.ipynb", "unsupported.txt", "copy.ipynb.tmp"):
        (folder / name).write_bytes(b"bad")
    assert library.catalogue()["items"] == []


def test_concurrent_publication_uses_location_lock(tmp_path):
    from concurrent.futures import ThreadPoolExecutor
    from omero_analysis.sync_lock import storage_lock
    library = SharedLibrary(tmp_path)
    first = library.publish("template", "plate.csv", b"well\nA1\n", None, 0)
    with storage_lock(library), ThreadPoolExecutor() as pool:
        attempt = pool.submit(SharedLibrary(tmp_path).publish, "template", "plate.csv", b"well\nB1\n", first["revision"], 0)
        with pytest.raises(AnalysisError) as exc:
            attempt.result()
        assert exc.value.status == 409
    assert library.download(first["id"], first["revision"])[0] == b"well\nA1\n"


def test_interrupted_index_commit_keeps_previous_generation(tmp_path, monkeypatch):
    library = SharedLibrary(tmp_path)
    first = library.publish("template", "layout.csv", b"well\nA1\n", None, 0)
    (library.root / "templates" / "layout.csv").write_bytes(b"well\nB1\n")
    monkeypatch.setattr(library, "_commit", lambda _: (_ for _ in ()).throw(OSError("disk unavailable")))
    with pytest.raises(OSError):
        library.catalogue(refresh=True)
    old_index = json.loads((library.state / "index.json").read_text())
    assert old_index["items"][first["id"]]["revision"] == first["revision"]
    assert SharedLibrary(tmp_path).catalogue(refresh=True)["items"][0]["revisionCount"] == 2


def test_recent_external_copy_retains_last_valid_revision(tmp_path, monkeypatch):
    library = SharedLibrary(tmp_path)
    first = library.publish("template", "layout.csv", b"well\nA1\n", None, 0)
    (library.root / "templates" / "layout.csv").write_bytes(b"well\nB1\n")
    monkeypatch.setattr("omero_analysis.shared_library.MIN_STABLE_SECONDS", 60)
    item = library.catalogue(refresh=True)["items"][0]
    assert not item["available"] and "settling" in item["error"]
    assert item["revision"] == first["revision"] and item["revisionCount"] == 1
