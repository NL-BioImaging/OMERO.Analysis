"""Serialize per-user sync/reconciliation across web threads and processes."""
from contextlib import contextmanager
from functools import wraps
from inspect import signature
import os
import threading

from .errors import AnalysisError
from .inplace_storage import storage_for
from .managed_omero import user_id
from .services import object_group_id

_held = threading.local()


@contextmanager
def storage_lock(storage):
    if storage is None:
        yield
        return
    path = storage.user_root / '.sync.lock'
    held = getattr(_held, 'paths', set())
    if str(path) in held:
        yield
        return
    storage._ensure_inside(path)
    with path.open('a+b') as handle:
        if os.name == 'nt':
            import msvcrt
            if not path.stat().st_size:
                handle.write(b'0')
                handle.flush()
            handle.seek(0)
            acquire = lambda: msvcrt.locking(handle.fileno(), msvcrt.LK_NBLCK, 1)
            release = lambda: msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)
        else:
            import fcntl
            acquire = lambda: fcntl.flock(handle.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
            release = lambda: fcntl.flock(handle.fileno(), fcntl.LOCK_UN)
        try:
            acquire()
        except OSError as exc:
            error = AnalysisError('Another workspace synchronization is active; retry shortly')
            error.code, error.status = 'sync_busy', 409
            raise error from exc
        _held.paths = held | {str(path)}
        try:
            yield
        finally:
            _held.paths = held
            release()


def serialized_sync(function):
    parameters = signature(function)
    @wraps(function)
    def wrapped(*args, **kwargs):
        bound = parameters.bind(*args, **kwargs).arguments
        conn, obj = bound['conn'], bound['obj']
        _, storage = storage_for(object_group_id(obj), user_id(conn))
        with storage_lock(storage):
            return function(*args, **kwargs)
    return wrapped
