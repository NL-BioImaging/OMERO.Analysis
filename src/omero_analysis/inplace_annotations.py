"""Optional in-place OMERO FileAnnotation creation.

The durable source file must already exist on shared storage.  When the
``omero-upload`` integration is unavailable, callers retain the existing
byte-copy FileAnnotation behavior and record that choice in their manifest.
"""

from __future__ import annotations

import inspect
import os
from dataclasses import asdict, dataclass
from importlib import import_module, metadata
from pathlib import Path

from packaging.specifiers import SpecifierSet
from packaging.version import InvalidVersion, Version


OMERO_UPLOAD_RANGE = SpecifierSet(">=0.4,<0.5")


@dataclass(frozen=True)
class AttachmentCapability:
    ready: bool = False
    failure_code: str = "dependency_missing"
    detail: str = "omero-upload is not installed"
    version: str | None = None

    def public(self):
        value = asdict(self)
        value["failureCode"] = value.pop("failure_code")
        return value


def _enabled(value):
    return str(value if value is not None else "true").strip().lower() in {
        "1", "true", "yes", "on",
    }


def _version():
    return metadata.version("omero-upload")


def _dependencies():
    upload = import_module("omero_upload")
    model = import_module("omero.model")
    gateway = import_module("omero.gateway")
    rtypes = import_module("omero.rtypes")
    return {
        "upload_ln_s": upload.upload_ln_s,
        "FileAnnotationI": model.FileAnnotationI,
        "FileAnnotationWrapper": gateway.FileAnnotationWrapper,
        "rstring": rtypes.rstring,
    }


def attachment_capability():
    if not _enabled(os.environ.get("USE_INPLACE_ATTACHMENTS")):
        return AttachmentCapability(
            failure_code="inplace_attachments_disabled",
            detail="USE_INPLACE_ATTACHMENTS is disabled",
        )
    try:
        installed = _version()
    except metadata.PackageNotFoundError:
        return AttachmentCapability()
    try:
        if Version(installed) not in OMERO_UPLOAD_RANGE:
            return AttachmentCapability(
                failure_code="dependency_version_unsupported",
                detail=f"omero-upload {installed} is outside {OMERO_UPLOAD_RANGE}",
                version=installed,
            )
    except InvalidVersion:
        return AttachmentCapability(
            failure_code="dependency_version_unsupported",
            detail=f"omero-upload has invalid version {installed!r}",
            version=installed,
        )
    try:
        symbols = _dependencies()
        inspect.signature(symbols["upload_ln_s"]).bind(
            object(), "/data/source", "/OMERO", "application/octet-stream"
        )
    except (AttributeError, ImportError, TypeError, ValueError) as exc:
        return AttachmentCapability(
            failure_code="dependency_api_incompatible",
            detail=str(exc),
            version=installed,
        )
    return AttachmentCapability(
        ready=True, failure_code="ready",
        detail="In-place FileAnnotations are available", version=installed,
    )


def _omero_data_dir(conn):
    try:
        configured = conn.getConfigService().getConfigValue("omero.data.dir")
    except Exception:
        configured = None
    return str(configured or os.environ.get("OMERO_DATA_DIR") or "/OMERO")


def create_file_annotation(
    conn, file_path, *, mimetype, namespace, description,
):
    """Create an in-place annotation when supported, otherwise copy bytes.

    Returns ``(annotation, storage_mode, capability)``. Runtime failures after
    a ready capability check are deliberately not downgraded to a copied
    upload: the caller must not publish a misleading in-place manifest.
    """
    source = Path(file_path).resolve(strict=True)
    if not source.is_file() or source.is_symlink():
        raise ValueError("The durable attachment source must be a regular file")
    capability = attachment_capability()
    if not capability.ready:
        annotation = conn.createFileAnnfromLocalFile(
            str(source), mimetype=mimetype, ns=namespace, desc=description,
        )
        return annotation, "hybrid", capability

    symbols = _dependencies()
    original = symbols["upload_ln_s"](
        conn.c, str(source), _omero_data_dir(conn), mimetype
    )
    annotation = symbols["FileAnnotationI"]()
    annotation.setFile(original._obj)
    annotation.setNs(symbols["rstring"](namespace))
    annotation.setDescription(symbols["rstring"](description))
    annotation = conn.getUpdateService().saveAndReturnObject(annotation)
    return (
        symbols["FileAnnotationWrapper"](conn, annotation),
        "inplace-annotation",
        capability,
    )
