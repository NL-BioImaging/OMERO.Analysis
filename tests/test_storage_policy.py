from types import SimpleNamespace

import pytest

from omero_analysis.errors import AnalysisError
from omero_analysis.inplace_storage import StorageCapability
from omero_analysis import storage_policy as policy


def capability(ready=False, code="importer_disabled", detail="disabled"):
    return StorageCapability(
        mode="inplace" if ready else "legacy",
        ready=ready,
        failure_code="ready" if ready else code,
        detail="ready" if ready else detail,
    )


def test_disabled_importer_selects_omero_only(monkeypatch):
    monkeypatch.setenv("IMPORTER_ENABLED", "false")
    monkeypatch.setattr(policy, "storage_for", lambda *args, **kwargs: (capability(), None))

    selected = policy.storage_policy(4, 7)

    assert selected.operation_mode == "omero"
    assert selected.writable
    assert selected.public()["operationMode"] == "omero"


def test_enabled_ready_importer_selects_inplace(monkeypatch):
    storage = object()
    monkeypatch.setenv("IMPORTER_ENABLED", "true")
    monkeypatch.setattr(
        policy, "storage_for", lambda *args, **kwargs: (capability(True), storage)
    )

    selected = policy.storage_policy(4, 7)

    assert selected.operation_mode == "inplace"
    assert selected.storage is storage


def test_enabled_broken_importer_blocks_writes(monkeypatch):
    monkeypatch.setenv("IMPORTER_ENABLED", "true")
    monkeypatch.setattr(
        policy,
        "storage_for",
        lambda *args, **kwargs: (
            capability(False, "group_mapping_missing", "mapping missing"),
            None,
        ),
    )

    selected = policy.storage_policy(4, 7)

    assert selected.operation_mode == "blocked"
    with pytest.raises(AnalysisError) as raised:
        policy.require_storage_write(selected, "Saving")
    assert raised.value.status == 503
    assert raised.value.code == "analysis_storage_unavailable"

