import uuid

from omero_analysis.data_query import ChunkReader
from omero_analysis.query_progress import Progress


def test_transfer_counts_and_scoped_progress(tmp_path, monkeypatch):
    monkeypatch.setattr("omero_analysis.query_progress.tempfile.gettempdir", lambda: str(tmp_path))
    request_id = str(uuid.uuid4())
    progress = Progress("user2-session", "source", request_id)
    progress.update("checking", 0, 6)
    sent = []
    reader = ChunkReader(iter([b"abc", b"def"]), 6, sent.append)
    assert reader.read(2) == b"ab"
    assert reader.read(4) == b"cdef"
    assert sent == [2, 6]
    progress.update("ready", sent[-1], 6)
    assert Progress("user2-session", "source", request_id).read()["sent"] == 6
    assert Progress("user1-session", "source", request_id).read() == {}
    assert Progress("user2-session", "other-source", request_id).read() == {}
    assert Progress("user2-session", "source", str(uuid.uuid4())).read() == {}


def test_progress_is_optional_and_expires(tmp_path, monkeypatch):
    monkeypatch.setattr("omero_analysis.query_progress.tempfile.gettempdir", lambda: str(tmp_path))
    invalid = Progress("scope", "source", "../../invalid")
    invalid.update("checking", 0, 100)
    assert invalid.read() == {}
    progress = Progress("scope", "source", str(uuid.uuid4()))
    progress.update("checking", 0, 100)
    monkeypatch.setattr("omero_analysis.query_progress.time.time", lambda: progress.started + 3601)
    assert progress.read() == {}
