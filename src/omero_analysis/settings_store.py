"""Encrypted, user/group-scoped OMERO storage for Analysis settings."""

from __future__ import annotations

import base64
import hashlib
import io
import json
import tempfile
import zipfile
from datetime import datetime, timezone
from pathlib import Path

from cryptography.fernet import Fernet, InvalidToken
from django.conf import settings

from .errors import FileTooLarge, InvalidObject, UnsupportedMedia
from .services import safe_filename
from .workspace_sync import _delete, _plain, _project_datasets, _user_id

SETTINGS_NAMESPACE = "nl.bioimaging.analysis.settings.v1"
SETTINGS_FILE_NAMESPACE = "nl.bioimaging.analysis.settings.encrypted.v1"
SKILL_FILE_NAMESPACE = "nl.bioimaging.analysis.user-skill.v1"
SETTINGS_SCHEMA = "nl.bioimaging.analysis.settings.bundle.v1"
PROJECT_NAME = "+AnalysisSettings"
AI_DATASET_NAME = "AI Settings"
SKILLS_DATASET_NAME = "Skills"
SETTINGS_FILENAME = "analysis-settings.oa-settings.zip.enc"
MAX_SETTINGS_BYTES = 5 * 1024 * 1024
MAX_SKILLS = 100
MAX_SKILL_BYTES = 1024 * 1024


def _annotations(obj):
    try:
        return list(obj.listAnnotations())
    except (AttributeError, TypeError):
        return []


def _map_values(annotation):
    try:
        return {
            str(_plain(key)): str(_plain(value))
            for key, value in annotation.getValue()
        }
    except (AttributeError, TypeError, ValueError):
        return {}


def _marker(obj, role):
    for annotation in _annotations(obj):
        if str(_plain(annotation.getNs())) != SETTINGS_NAMESPACE:
            continue
        values = _map_values(annotation)
        if values.get("role") == role:
            return annotation, values
    return None, {}


def _set_marker(conn, obj, role, values):
    from omero.gateway import MapAnnotationWrapper

    annotation, current = _marker(obj, role)
    payload = {
        **current,
        **{key: str(value) for key, value in values.items()},
        "role": role,
    }
    pairs = sorted(payload.items())
    if annotation is None:
        annotation = MapAnnotationWrapper(conn)
        annotation.setNs(SETTINGS_NAMESPACE)
        annotation.setValue(pairs)
        annotation.save()
        obj.linkAnnotation(annotation)
    else:
        annotation.setValue(pairs)
        annotation.save()
    return annotation


def _owned_projects(conn):
    try:
        return list(conn.getObjects("Project", opts={"owner": _user_id(conn)}))
    except (AttributeError, TypeError):
        return []


def _project(conn, group_id, create=False):
    for project in _owned_projects(conn):
        _, marker = _marker(project, "project")
        if (
            marker.get("owner_user_id") == str(_user_id(conn))
            and marker.get("group_id") == str(group_id)
        ):
            return project
    if not create:
        return None
    from omero.gateway import ProjectWrapper
    from omero.model import ProjectI

    project = ProjectWrapper(conn, ProjectI())
    project.setName(PROJECT_NAME)
    project.setDescription(
        "Private OMERO Analysis settings. AI credentials are encrypted at rest."
    )
    project.save()
    _set_marker(conn, project, "project", {
        "owner_user_id": _user_id(conn),
        "group_id": group_id,
        "schema": SETTINGS_SCHEMA,
    })
    return project


def _dataset(project, role):
    if project is None:
        return None
    for dataset in _project_datasets(project):
        _, marker = _marker(dataset, role)
        if marker:
            return dataset
    return None


def _create_dataset(conn, project, role, name):
    from omero.gateway import DatasetWrapper
    from omero.model import DatasetI, ProjectDatasetLinkI

    dataset = DatasetWrapper(conn, DatasetI())
    dataset.setName(name)
    dataset.setDescription(
        "Managed by OMERO Analysis. Unmarked content is never modified."
    )
    dataset.save()
    try:
        _set_marker(conn, dataset, role, {
            "owner_user_id": _user_id(conn),
            "schema": SETTINGS_SCHEMA,
        })
        link = ProjectDatasetLinkI()
        link.setParent(project._obj.__class__(project._obj.id, False))
        link.setChild(dataset._obj.__class__(dataset._obj.id, False))
        conn.getUpdateService().saveObject(link, conn.SERVICE_OPTS)
    except Exception:
        _delete(conn, "Dataset", dataset.getId())
        raise
    return dataset


def _managed_annotations(dataset, namespace):
    return [
        annotation for annotation in _annotations(dataset)
        if hasattr(annotation, "getFile")
        and str(_plain(annotation.getNs()) or "") == namespace
    ]


def _annotation_bytes(annotation, limit=MAX_SETTINGS_BYTES):
    data = bytearray()
    for chunk in annotation.getFileInChunks():
        data.extend(chunk)
        if len(data) > limit:
            raise FileTooLarge("The synchronized settings bundle is too large")
    return bytes(data)


def _key(conn, group_id):
    secret = str(settings.SECRET_KEY).encode("utf-8")
    scope = f"omero-analysis-settings:{_user_id(conn)}:{group_id}".encode("utf-8")
    digest = hashlib.pbkdf2_hmac("sha256", secret, scope, 200_000, dklen=32)
    return base64.urlsafe_b64encode(digest)


def _validated_payload(value):
    if not isinstance(value, dict) or value.get("schema") != SETTINGS_SCHEMA:
        raise UnsupportedMedia("Unsupported Analysis settings bundle")
    analysis = value.get("analysis")
    ai = value.get("ai")
    skills = value.get("skills")
    if (
        not isinstance(analysis, dict)
        or not isinstance(analysis.get("plotCsv"), bool)
        or not isinstance(ai, dict)
        or not isinstance(ai.get("profiles"), list)
        or not isinstance(skills, list)
    ):
        raise InvalidObject("Analysis settings bundle is incomplete")
    if len(ai["profiles"]) > 50 or len(skills) > MAX_SKILLS:
        raise FileTooLarge("The settings bundle contains too many profiles or skills")
    for profile in ai["profiles"]:
        provider = profile.get("settings") if isinstance(profile, dict) else None
        if (
            not isinstance(profile, dict)
            or not isinstance(profile.get("id"), str)
            or not isinstance(profile.get("name"), str)
            or not isinstance(provider, dict)
            or provider.get("protocol") not in {"openai", "anthropic"}
            or provider.get("authMode") not in {"bearer", "api-key"}
        ):
            raise InvalidObject("An AI profile is invalid")
    for skill in skills:
        content = skill.get("content") if isinstance(skill, dict) else None
        if (
            not isinstance(skill, dict)
            or not isinstance(skill.get("id"), str)
            or not isinstance(skill.get("name"), str)
            or not isinstance(content, str)
            or len(content.encode("utf-8")) > MAX_SKILL_BYTES
        ):
            raise InvalidObject("A user skill is invalid or exceeds 1 MiB")
    encoded = json.dumps(value, ensure_ascii=False).encode("utf-8")
    if len(encoded) > MAX_SETTINGS_BYTES:
        raise FileTooLarge("The settings bundle exceeds 5 MiB")
    return value


def _encrypted_bundle(conn, group_id, payload):
    plain = io.BytesIO()
    with zipfile.ZipFile(plain, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr(
            "settings.json",
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        )
    return Fernet(_key(conn, group_id)).encrypt(plain.getvalue())


def _decrypted_bundle(conn, group_id, encrypted):
    try:
        plain = Fernet(_key(conn, group_id)).decrypt(encrypted)
        with zipfile.ZipFile(io.BytesIO(plain), "r") as archive:
            names = archive.namelist()
            if names != ["settings.json"]:
                raise UnsupportedMedia("Encrypted settings archive has unsafe contents")
            value = json.loads(archive.read("settings.json"))
    except (InvalidToken, zipfile.BadZipFile, KeyError, ValueError) as exc:
        raise UnsupportedMedia(
            "The encrypted settings attachment cannot be decrypted or is corrupt"
        ) from exc
    return _validated_payload(value)


def _upload(conn, dataset, name, namespace, data, description):
    with tempfile.TemporaryDirectory(prefix="omero-analysis-settings-") as directory:
        path = Path(directory) / safe_filename(name)
        path.write_bytes(data)
        annotation = conn.createFileAnnfromLocalFile(
            str(path),
            mimetype="application/octet-stream"
            if namespace == SETTINGS_FILE_NAMESPACE else "text/markdown",
            ns=namespace,
            desc=description,
        )
        dataset.linkAnnotation(annotation)
    return annotation


def load_settings(conn, group_id):
    project = _project(conn, group_id)
    ai_dataset = _dataset(project, "ai-settings")
    annotations = _managed_annotations(ai_dataset, SETTINGS_FILE_NAMESPACE) \
        if ai_dataset is not None else []
    annotations.sort(key=lambda item: int(item.getId()), reverse=True)
    if not annotations:
        return {
            "schema": SETTINGS_SCHEMA,
            "synced": False,
            "projectId": int(project.getId()) if project is not None else None,
            "payload": None,
        }
    payload = _decrypted_bundle(
        conn, group_id, _annotation_bytes(annotations[0])
    )
    return {
        "schema": SETTINGS_SCHEMA,
        "synced": True,
        "projectId": int(project.getId()),
        "datasetId": int(ai_dataset.getId()),
        "annotationId": int(annotations[0].getId()),
        "payload": payload,
    }


def save_settings(conn, group_id, value):
    payload = _validated_payload(value)
    project = _project(conn, group_id, create=True)
    ai_dataset = _dataset(project, "ai-settings") or _create_dataset(
        conn, project, "ai-settings", AI_DATASET_NAME
    )
    skills_dataset = _dataset(project, "skills") or _create_dataset(
        conn, project, "skills", SKILLS_DATASET_NAME
    )
    encrypted = _encrypted_bundle(conn, group_id, payload)
    old_settings = _managed_annotations(ai_dataset, SETTINGS_FILE_NAMESPACE)
    old_skills = _managed_annotations(skills_dataset, SKILL_FILE_NAMESPACE)
    staged = []
    try:
        settings_annotation = _upload(
            conn,
            ai_dataset,
            SETTINGS_FILENAME,
            SETTINGS_FILE_NAMESPACE,
            encrypted,
            "Encrypted OMERO Analysis settings bundle",
        )
        staged.append(settings_annotation)
        for skill in payload["skills"]:
            filename = skill.get("filename") or f"{skill['name']}.skill.md"
            staged.append(_upload(
                conn,
                skills_dataset,
                filename,
                SKILL_FILE_NAMESPACE,
                skill["content"].encode("utf-8"),
                f"OMERO Analysis user skill {skill['id']}",
            ))
    except Exception:
        for annotation in staged:
            try:
                _delete(conn, "Annotation", annotation.getId())
            except Exception:
                pass
        raise
    for annotation in [*old_settings, *old_skills]:
        if all(int(annotation.getId()) != int(item.getId()) for item in staged):
            _delete(conn, "Annotation", annotation.getId())
    _set_marker(conn, ai_dataset, "ai-settings", {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "profile_count": len(payload["ai"]["profiles"]),
    })
    _set_marker(conn, skills_dataset, "skills", {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "skill_count": len(payload["skills"]),
    })
    return {
        "schema": SETTINGS_SCHEMA,
        "synced": True,
        "projectId": int(project.getId()),
        "aiDatasetId": int(ai_dataset.getId()),
        "skillsDatasetId": int(skills_dataset.getId()),
        "annotationId": int(settings_annotation.getId()),
        "profileCount": len(payload["ai"]["profiles"]),
        "skillCount": len(payload["skills"]),
    }
