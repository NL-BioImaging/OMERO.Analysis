"""Coordinate cold source uploads across web processes without sharing auth scopes."""
from contextlib import contextmanager
import hashlib
import os
import time
from .errors import RemoteQueryUnavailable
from .omero_state import state_directory


@contextmanager
def preparing_source(worker_url, scope, source_ref, deadline):
    root = state_directory() / "query-sources"
    root.mkdir(parents=True, exist_ok=True, mode=0o700)
    identity = hashlib.sha256(f"{worker_url}\0{scope}\0{source_ref}".encode()).hexdigest()
    path = root / (identity + ".lock")
    with path.open("a+b") as handle:
        if os.name == "nt":
            import msvcrt
            if not path.stat().st_size:
                handle.write(b"0"); handle.flush()
            handle.seek(0)
            acquire = lambda: msvcrt.locking(handle.fileno(), msvcrt.LK_NBLCK, 1)
            release = lambda: msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)
        else:
            import fcntl
            acquire = lambda: fcntl.flock(handle.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
            release = lambda: fcntl.flock(handle.fileno(), fcntl.LOCK_UN)
        while True:
            try:
                acquire(); break
            except OSError as error:
                import errno
                if error.errno not in {errno.EACCES, errno.EAGAIN, errno.EDEADLK}:
                    raise
                if time.monotonic() >= deadline:
                    raise RemoteQueryUnavailable("Another request is still preparing this database. Retry inspection shortly.") from error
                time.sleep(min(0.1, max(0, deadline-time.monotonic())))
        try: yield
        finally: release()
