"""Prevent publishing inconsistent frontend, runtime and plugin versions."""
import importlib.util
import json
from pathlib import Path
import sys

import pytest

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))
spec = importlib.util.spec_from_file_location("check_release_version", SCRIPTS / "check_release_version.py")
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)


@pytest.fixture
def source(tmp_path):
    (tmp_path / "frontend").mkdir()
    (tmp_path / "src/omero_analysis").mkdir(parents=True)
    (tmp_path / "pyproject.toml").write_text('[project]\nversion = "1.0.0"\n')
    (tmp_path / "src/omero_analysis/__init__.py").write_text('__version__ = "1.0.0"\n')
    for name in ("plugin.json", "frontend/package.json", "frontend/package-lock.json"):
        (tmp_path / name).write_text(json.dumps({"version": "1.0.0", "packages": {"": {"version": "1.0.0"}}}))
    return tmp_path


def test_source_and_tag_must_agree(source):
    assert checker.check_versions(source) == "1.0.0"
    assert checker.check_versions(source, "v1.0.0") == "1.0.0"
    with pytest.raises(ValueError, match="Release tag"):
        checker.check_versions(source, "v0.15.0")


@pytest.mark.parametrize("name", ["plugin.json", "frontend/package.json", "frontend/package-lock.json"])
def test_stale_component_is_rejected(source, name):
    (source / name).write_text('{"version":"0.15.0"}')
    with pytest.raises(ValueError, match="must match"):
        checker.check_versions(source)


def test_runtime_version_and_nested_lock_are_checked(source):
    runtime = source / "src/omero_analysis/__init__.py"
    runtime.write_text('__version__ = "0.15.0"\n')
    with pytest.raises(ValueError, match="Runtime"):
        checker.check_versions(source)
    runtime.write_text('__version__ = "1.0.0"\n')
    (source / "frontend/package-lock.json").write_text('{"version":"1.0.0","packages":{"":{"version":"0.15.0"}}}')
    with pytest.raises(ValueError, match="root package"):
        checker.check_versions(source)
