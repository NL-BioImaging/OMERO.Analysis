"""Contract tests for offline release preparation and immutable upload retries."""

import copy
import importlib.util
import json
import shutil
import sys
import zipfile
from pathlib import Path
from types import SimpleNamespace

import pytest

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"


def module(name):
    spec = importlib.util.spec_from_file_location(name, SCRIPTS / f"{name}.py")
    result = importlib.util.module_from_spec(spec)
    sys.modules[name] = result
    spec.loader.exec_module(result)
    return result


release = module("analysis_release")
builder = module("build_release_manifest")
downloader = module("download_analysis_release")
uploader = module("upload_release_assets")


def make_wheel(folder, project, version, metadata_version=None):
    name = project.replace("-", "_")
    info = f"{name}-{version}.dist-info/"
    path = folder / f"{name}-{version}-py3-none-any.whl"
    with zipfile.ZipFile(path, "w") as archive:
        archive.writestr(info + "METADATA", f"Metadata-Version: 2.1\nName: {project}\nVersion: {metadata_version or version}\n")
        archive.writestr(info + "WHEEL", "Wheel-Version: 1.0\nRoot-Is-Purelib: true\nTag: py3-none-any\n")
        if project == "omero-analysis":
            for filename in ("views.py", "templates/omero_analysis/analysis.html",
                             "static/omero_analysis/app.js", "static/omero_analysis/pyodide/pyodide.mjs"):
                archive.writestr("omero_analysis/" + filename, "fixture")
            for filename in ("49-omero-analysis-cleanup.py", "51-omero-analysis-navigation.py", "90-omero-analysis.omero"):
                archive.writestr(f"{name}-{version}.data/data/share/omero-analysis/{filename}", "fixture")
        else:
            archive.writestr("omero_analysis_notebook/context.py", "fixture")
    return path


@pytest.fixture
def assets(tmp_path):
    source = tmp_path / "source"
    source.mkdir()
    wheels = [make_wheel(source, "omero-analysis", "0.15.0"),
              make_wheel(source, "omero-analysis-notebook", "0.1.0")]
    manifest = builder.build_manifest("0.15.0", wheels)
    (source / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")
    return source, wheels, manifest


def fetch_from(source):
    def fetch(url, target, _limit):
        assert "/releases/download/v0.15.0/" in url
        shutil.copyfile(source / url.rsplit("/", 1)[-1], target)
    return fetch


def test_release_preparation_is_exact_verified_and_preserves_wheelhouse(assets, tmp_path):
    source, wheels, manifest = assets
    output = tmp_path / "wheelhouse"
    output.mkdir()
    (output / "third_party.whl").write_bytes(b"keep")
    for _ in range(2):
        assert downloader.prepare_release("0.15.0", output, fetch_from(source)) == manifest
    assert (output / "third_party.whl").read_bytes() == b"keep"
    for wheel in wheels:
        assert (output / wheel.name).read_bytes() == wheel.read_bytes()
    assert json.loads((output / "omero-analysis-release-0.15.0.manifest.json").read_text()) == manifest


@pytest.mark.parametrize("bad", ["main", "latest", "v0.15.0", "0.15", "01.15.0", "../../0.15.0", "0.15.0.dev1", ""])
def test_no_branch_latest_or_ambiguous_production_pin(bad, tmp_path):
    with pytest.raises(ValueError, match="exact X.Y.Z"):
        downloader.prepare_release(bad, tmp_path / "output", lambda *_: pytest.fail("must not download"))


@pytest.mark.parametrize("mutation", ["schema", "version", "hash", "size", "path", "duplicate", "missing-sdk"])
def test_invalid_manifests_do_not_download_wheels_or_publish_files(assets, tmp_path, mutation):
    source, _, original = assets
    manifest = copy.deepcopy(original)
    if mutation in ("schema", "version"):
        manifest[mutation] = "incorrect"
    elif mutation == "hash":
        manifest["wheels"][0]["sha256"] = "bad"
    elif mutation == "size":
        manifest["wheels"][0]["size"] = True
    elif mutation == "path":
        manifest["wheels"][0]["name"] = "../../outside.whl"
    elif mutation == "duplicate":
        manifest["wheels"][1] = manifest["wheels"][0]
    else:
        manifest["wheels"].pop()
    (source / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")
    output = tmp_path / "output"
    with pytest.raises(ValueError):
        downloader.prepare_release("0.15.0", output, fetch_from(source))
    assert list(output.iterdir()) == []


def test_corrupt_sdk_cannot_leave_a_partially_verified_release(assets, tmp_path):
    source, wheels, _ = assets
    wheels[1].write_bytes(b"corrupt")
    output = tmp_path / "output"
    with pytest.raises(ValueError, match="mismatch"):
        downloader.prepare_release("0.15.0", output, fetch_from(source))
    assert list(output.iterdir()) == []


def test_metadata_must_match_wheel_filename(tmp_path):
    wheel = make_wheel(tmp_path, "omero-analysis", "0.15.0", metadata_version="0.14.0")
    with pytest.raises(ValueError, match="filename/metadata"):
        release.wheel_identity(wheel)


def test_missing_release_has_explicit_no_fallback_message(monkeypatch, tmp_path):
    import urllib.error
    def missing(url, **_):
        raise urllib.error.HTTPError(url, 404, "Not found", {}, None)
    monkeypatch.setattr(downloader.urllib.request, "urlopen", missing)
    with pytest.raises(ValueError, match="HTTP 404.*no fallback"):
        downloader.prepare_release("0.15.0", tmp_path / "output")


def test_upload_retry_accepts_identical_assets_and_publishes_manifest_last(assets):
    source, wheels, _ = assets
    uploads = []
    def command(args, **_):
        if args[2] == "view":
            return SimpleNamespace(stdout=json.dumps({"tagName": "v0.15.0", "assets": [{"name": wheels[0].name}]}))
        if args[2] == "download":
            shutil.copyfile(wheels[0], Path(args[-1]) / wheels[0].name)
        if args[2] == "upload":
            assert "--clobber" not in args
            uploads.append(Path(args[4]).name)
    uploader.upload_assets("v0.15.0", "NL-BioImaging/OMERO.Analysis", source / "manifest.json", [source], command)
    assert uploads == [wheels[1].name, "manifest.json"]


def test_changed_existing_release_fails_before_any_upload(assets):
    source, wheels, _ = assets
    def command(args, **_):
        if args[2] == "view":
            return SimpleNamespace(stdout=json.dumps({"tagName": "v0.15.0", "assets": [{"name": "manifest.json"}]}))
        if args[2] == "download":
            (Path(args[-1]) / "manifest.json").write_text("changed", encoding="utf-8")
        if args[2] == "upload":
            pytest.fail("immutable preflight must precede all uploads")
    with pytest.raises(ValueError, match="different bytes"):
        uploader.upload_assets("v0.15.0", "NL-BioImaging/OMERO.Analysis", source / "manifest.json", [source], command)
