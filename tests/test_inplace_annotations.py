from pathlib import Path
from types import SimpleNamespace

from omero_analysis import inplace_annotations as annotations

from .conftest import FakeConnection


def test_missing_optional_dependency_uses_hybrid_copy(monkeypatch, tmp_path):
    source = tmp_path / "result.csv"
    source.write_bytes(b"a,b\n1,2\n")
    conn = FakeConnection()
    monkeypatch.setattr(
        annotations, "attachment_capability",
        lambda: annotations.AttachmentCapability(),
    )

    annotation, mode, capability = annotations.create_file_annotation(
        conn, source, mimetype="text/csv", namespace="analysis/results",
        description="result",
    )

    assert mode == "hybrid"
    assert capability.failure_code == "dependency_missing"
    assert annotation.data == source.read_bytes()


def test_ready_dependency_creates_symlink_backed_file_annotation(monkeypatch, tmp_path):
    source = tmp_path / "result.svg"
    source.write_text("<svg/>", encoding="utf-8")
    calls = []

    class FileAnnotation:
        def setFile(self, value):
            self.file = value

        def setNs(self, value):
            self.namespace = value

        def setDescription(self, value):
            self.description = value

    class Connection:
        c = object()

        def getConfigService(self):
            return SimpleNamespace(getConfigValue=lambda key: "/OMERO")

        def getUpdateService(self):
            return SimpleNamespace(saveAndReturnObject=lambda value: value)

    def upload_ln_s(client, path, data_dir, mimetype):
        calls.append((client, path, data_dir, mimetype))
        return SimpleNamespace(_obj="original-file")

    monkeypatch.setattr(
        annotations, "attachment_capability",
        lambda: annotations.AttachmentCapability(
            ready=True, failure_code="ready", detail="ok", version="0.4.0"
        ),
    )
    monkeypatch.setattr(annotations, "_dependencies", lambda: {
        "upload_ln_s": upload_ln_s,
        "FileAnnotationI": FileAnnotation,
        "FileAnnotationWrapper": lambda conn, value: value,
        "rstring": lambda value: value,
    })

    annotation, mode, capability = annotations.create_file_annotation(
        Connection(), source, mimetype="image/svg+xml",
        namespace="analysis/results", description="plot",
    )

    assert mode == "inplace-annotation"
    assert capability.ready
    assert calls[0][1:] == (
        str(source.resolve()), "/OMERO", "image/svg+xml"
    )
    assert annotation.file == "original-file"
    assert annotation.namespace == "analysis/results"


def test_attachment_capability_checks_version_and_signature(monkeypatch):
    monkeypatch.setenv("USE_INPLACE_ATTACHMENTS", "true")
    monkeypatch.setattr(annotations, "_version", lambda: "0.4.0")
    monkeypatch.setattr(annotations, "_dependencies", lambda: {
        "upload_ln_s": lambda client, path, data_dir, mimetype: None,
    })
    assert annotations.attachment_capability().ready

    monkeypatch.setattr(annotations, "_version", lambda: "1.0.0")
    assert (
        annotations.attachment_capability().failure_code
        == "dependency_version_unsupported"
    )


def test_inplace_source_must_be_durable_regular_file(tmp_path):
    missing = Path(tmp_path) / "missing.csv"
    try:
        annotations.create_file_annotation(
            FakeConnection(), missing, mimetype="text/csv",
            namespace="analysis/results", description="result",
        )
    except FileNotFoundError:
        pass
    else:
        raise AssertionError("missing durable source was accepted")
