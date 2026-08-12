"""Offline-first notebook context for OMERO.Analysis."""

from .context import NotebookContext, configure
from .protocol import PROTOCOL_SCHEMA, ProtocolError, load_contract, validate_contract

__all__ = [
    "NotebookContext",
    "PROTOCOL_SCHEMA",
    "ProtocolError",
    "configure",
    "load_contract",
    "validate_contract",
]

__version__ = "0.1.0"
