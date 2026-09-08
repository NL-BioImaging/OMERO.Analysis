"""Verified, explicit promotion of an exact worker CSV into OMERO."""
from __future__ import annotations

import base64
import hashlib
import json
import os
import tempfile
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

from cryptography.fernet import Fernet, InvalidToken as InvalidFernetToken
from django.conf import settings
from django.core import signing

from .data_query import DataQueryBroker, authorize_query_source, data_query_result_ttl_seconds
from .data_query_audit import audit, request_correlation
from .errors import InvalidToken, PermissionDenied, RemoteQueryFailed, UnsupportedMedia
from .managed_omero import map_values
from .services import RESULT_NAMESPACE, attachment_info, can_annotate, safe_filename
from .settings import max_upload_bytes

NAMESPACE = "nl.bioimaging.analysis.data-query.provenance.v1"
COMPLETION_SALT = NAMESPACE + ".completion"


def _cipher():
    key = hashlib.sha256((str(settings.SECRET_KEY) + "\0" + NAMESPACE).encode()).digest()
    return Fernet(base64.urlsafe_b64encode(key))


def make_receipt(request, conn, claims, info, result_token, query, result):
    execution = result.get("execution")
    if not isinstance(execution, dict) or execution.get("schema") != "result_provenance_v1":
        return None
    value = {
        "schema": NAMESPACE, "result_token_sha256": hashlib.sha256(result_token.encode()).hexdigest(),
        "user_id": int(conn.getUserId()), "group_id": claims["group_id"],
        "context": {"object_type": claims["object_type"], "object_id": claims["object_id"]},
        "source": {key: getattr(info, key, None) for key in (
            "annotation_id", "file_id", "object_type", "object_id", "name", "size", "source_revision")},
        "sql": query["sql"], "parameters": query.get("parameters", {}),
        "result": {key: result[key] for key in ("columns", "row_count", "byte_count", "source_sha256",
                                                "sql_sha256", "duration_ms", "cache_status", "execution")},
        "queried_at": datetime.now(timezone.utc).isoformat(),
        "request_id": request_correlation(request),
    }
    return _cipher().encrypt(json.dumps(value, separators=(",", ":")).encode()).decode()


def read_receipt(receipt, result_token):
    try:
        if not isinstance(receipt, str) or len(receipt) > 2 * 1024 * 1024:
            raise ValueError
        value = json.loads(_cipher().decrypt(receipt.encode(), ttl=data_query_result_ttl_seconds()))
        if (not isinstance(value, dict) or value.get("schema") != NAMESPACE or
                value.get("result_token_sha256") != hashlib.sha256(result_token.encode()).hexdigest()):
            raise ValueError
        return value
    except (InvalidFernetToken, ValueError, TypeError, AttributeError) as exc:
        raise InvalidToken("Query provenance is invalid or expired; rerun the query") from exc


@contextmanager
def promotion_lock(receipt_hash):
    # Fixed stripes bound lock-file count; OS locks work across web processes.
    # Deployments with multiple web hosts must share this directory on a locking-capable volume.
    directory = Path(getattr(settings, "OMERO_ANALYSIS_DATA_QUERY_STATE_DIR", "") or
                     os.getenv("OMERO_ANALYSIS_DATA_QUERY_STATE_DIR", "") or
                     Path(tempfile.gettempdir()) / "omero-analysis-data-query")
    directory.mkdir(parents=True, exist_ok=True, mode=0o700)
    path = directory / (receipt_hash[:2] + ".lock")
    fd = os.open(path, os.O_RDWR | os.O_CREAT, 0o600)
    with os.fdopen(fd, "r+b") as handle:
        if os.name == "nt":
            import msvcrt
            if not path.stat().st_size:
                handle.write(b"0")
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
            raise RemoteQueryFailed("A result save is already in progress; retry shortly") from exc
        try:
            yield
        finally:
            handle.seek(0)
            release()


def _complete_promotion(obj, receipt_hash):
    annotations = {int(a.getId()): a for a in obj.listAnnotations()}
    for annotation in annotations.values():
        if str(annotation.getNs()) != NAMESPACE:
            continue
        values = map_values(annotation)
        if values.get("receipt_sha256") != receipt_hash:
            continue
        try:
            record = signing.loads(values.get("completion", ""), salt=COMPLETION_SALT)
            if record["receipt_sha256"] != receipt_hash:
                continue
            result = annotations[record["result_annotation_id"]]
            provenance = annotations[record["provenance_annotation_id"]]
            if str(result.getNs()) != RESULT_NAMESPACE or str(provenance.getNs()) != NAMESPACE:
                continue
            digest = hashlib.sha256()
            size = 0
            for chunk in result.getFileInChunks():
                size += len(chunk)
                if size > record["byte_count"]:
                    raise ValueError
                digest.update(chunk)
            if size != record["byte_count"] or digest.hexdigest() != record["result_sha256"]:
                raise ValueError
            recipe_digest = hashlib.sha256()
            recipe_size = 0
            for chunk in provenance.getFileInChunks():
                recipe_size += len(chunk)
                if recipe_size > record["provenance_byte_count"]:
                    raise ValueError
                recipe_digest.update(chunk)
            if (recipe_size != record["provenance_byte_count"] or
                    recipe_digest.hexdigest() != record["provenance_sha256"]):
                raise ValueError
            return {"result": attachment_info(result).to_dict(),
                    "provenance": attachment_info(provenance).to_dict(), "reused": True}
        except (signing.BadSignature, KeyError, ValueError, TypeError):
            continue
    return None


def _create_map(conn, values):
    from omero.gateway import MapAnnotationWrapper
    annotation = MapAnnotationWrapper(conn)
    annotation.setNs(NAMESPACE)
    annotation.setValue(sorted((key, str(value)) for key, value in values.items()))
    annotation.save()
    return annotation


def promote_result(request, conn, payload):
    if not isinstance(payload, dict) or set(payload) - {"result_token", "receipt", "filename"}:
        raise RemoteQueryFailed("Unsupported result-save fields")
    token, receipt = payload.get("result_token"), payload.get("receipt")
    if not isinstance(token, str):
        raise InvalidToken("A result token is required")
    record = read_receipt(receipt, token)
    claims, obj, _, info, _, _ = authorize_query_source(request, conn, result_token=token)
    if not can_annotate(obj):
        raise PermissionDenied("The active user cannot annotate the selected object")
    receipt_hash = hashlib.sha256(receipt.encode()).hexdigest()
    filename = safe_filename(payload.get("filename") or "data-query-result.csv")
    if not filename.lower().endswith(".csv"):
        raise UnsupportedMedia("Saved query results must use a .csv filename")
    result = record["result"]
    request.data_query_audit.update({key: result[key] for key in (
        "source_sha256", "sql_sha256", "row_count", "byte_count")})
    request.data_query_audit["result_sha256"] = result["execution"]["result_sha256"]
    if result["byte_count"] > max_upload_bytes():
        raise RemoteQueryFailed("Query result exceeds the Analysis upload limit")
    with promotion_lock(receipt_hash):
        existing = _complete_promotion(obj, receipt_hash)
        if existing:
            return existing
        created = []
        with tempfile.TemporaryDirectory(prefix="analysis-query-result-") as directory:
            csv_path = Path(directory) / filename
            response = DataQueryBroker(request_id=request_correlation(request)).download(claims["result_id"])
            digest = hashlib.sha256()
            size = 0
            try:
                with csv_path.open("wb") as handle:
                    for chunk in response.iter_content(chunk_size=1024 * 1024):
                        size += len(chunk)
                        if size > min(result["byte_count"], max_upload_bytes()):
                            raise RemoteQueryFailed("Query result size changed; rerun the query")
                        digest.update(chunk)
                        handle.write(chunk)
            finally:
                response.close()
            if size != result["byte_count"] or digest.hexdigest() != result["execution"]["result_sha256"]:
                raise RemoteQueryFailed("Query result checksum changed; rerun the query")
            # Recheck after the transfer, immediately before OMERO writes.
            _, obj, _, _, _, _ = authorize_query_source(request, conn, result_token=token)
            if not can_annotate(obj):
                raise PermissionDenied("The destination is no longer annotatable")
            record = {key: value for key, value in record.items() if key != "result_token_sha256"}
            record.update({"receipt_sha256": receipt_hash, "saved_at": datetime.now(timezone.utc).isoformat(),
                           "promotion_request_id": request_correlation(request)})
            try:
                csv_annotation = conn.createFileAnnfromLocalFile(str(csv_path), mimetype="text/csv",
                    ns=RESULT_NAMESPACE, desc="Verified DataQueryWorker CSV; linked query provenance")
                created.append(csv_annotation)
                record["result_annotation_id"] = int(csv_annotation.getId())
                json_path = Path(directory) / "query-provenance.json"
                json_path.write_text(json.dumps(record, indent=2, ensure_ascii=False), encoding="utf-8")
                provenance = conn.createFileAnnfromLocalFile(str(json_path), mimetype="application/json",
                    ns=NAMESPACE, desc="Full query recipe and verified execution provenance")
                created.append(provenance)
                completion = {"receipt_sha256": receipt_hash, "result_annotation_id": int(csv_annotation.getId()),
                              "provenance_annotation_id": int(provenance.getId()), "byte_count": size,
                              "result_sha256": digest.hexdigest(),
                              "provenance_byte_count": json_path.stat().st_size,
                              "provenance_sha256": hashlib.sha256(json_path.read_bytes()).hexdigest()}
                marker = _create_map(conn, {**completion,
                    "source_file_id": info.file_id, "source_annotation_id": info.annotation_id,
                    "source_sha256": result["source_sha256"], "sql_sha256": result["sql_sha256"],
                    "completion": signing.dumps(completion, salt=COMPLETION_SALT)})
                created.append(marker)
                for annotation in created:
                    obj.linkAnnotation(annotation)
            except Exception:
                for annotation in reversed(created):
                    try:
                        conn.deleteObjects("Annotation", [int(annotation.getId())], wait=True)
                    except Exception:
                        audit("promotion_cleanup", "failed", request_id=request_correlation(request),
                              annotation_id=int(annotation.getId()))
                raise
    audit("promotion_saved", "success", request_id=request_correlation(request),
          user_id=int(conn.getUserId()), group_id=record["group_id"], receipt_sha256=receipt_hash,
          result_annotation_id=int(csv_annotation.getId()), provenance_annotation_id=int(provenance.getId()))
    return {"result": attachment_info(csv_annotation).to_dict(),
            "provenance": attachment_info(provenance).to_dict(), "reused": False}
