"""Authoritative selection of importer-backed, OMERO-only, or blocked writes."""

from __future__ import annotations

import os
from dataclasses import dataclass

from .errors import AnalysisError
from .inplace_storage import StorageCapability, storage_for


def _enabled(value):
    return str(value or "").strip().lower() in {"1", "true", "yes", "on"}


def importer_requested():
    return _enabled(os.environ.get("IMPORTER_ENABLED"))


@dataclass(frozen=True)
class StoragePolicy:
    operation_mode: str
    capability: StorageCapability
    storage: object | None = None

    @property
    def writable(self):
        return self.operation_mode != "blocked"

    def public(self):
        value = self.capability.public()
        value.update({
            "operationMode": self.operation_mode,
            "importerRequested": importer_requested(),
        })
        return value


def storage_policy(group_id, user_id, *, initialize=True):
    capability, storage = storage_for(group_id, user_id, initialize=initialize)
    if not importer_requested():
        return StoragePolicy("omero", capability, None)
    if storage is not None and capability.ready:
        return StoragePolicy("inplace", capability, storage)
    return StoragePolicy("blocked", capability, None)


def require_storage_write(policy, operation="operation"):
    if policy.writable:
        return policy
    error = AnalysisError(
        f"{operation} requires the configured importer-backed Analysis storage: "
        f"{policy.capability.detail}"
    )
    error.code = "analysis_storage_unavailable"
    error.status = 503
    raise error
