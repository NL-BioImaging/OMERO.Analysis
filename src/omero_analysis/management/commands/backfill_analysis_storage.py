"""Backfill existing managed OMERO content into group-local ``.analysis``."""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from ...inplace_storage import AnalysisStorage, storage_capability
from ...managed_omero import user_id
from ...settings_store import (
    SETTINGS_FILE_NAMESPACE,
    SKILL_FILE_NAMESPACE,
    _annotation_bytes as settings_bytes,
    _dataset as settings_dataset,
    _managed_annotations as settings_annotations,
    _project as settings_project,
)
from ...workspace_sync import (
    _file_bytes,
    _managed_project,
    _read_manifest,
    _remote_items,
)


def _archive_png(image):
    """Return a lossless PNG representation of the Image's stored pixel planes."""
    import io
    import numpy
    from PIL import Image

    size_c = int(image.getSizeC())
    pixels = image.getPrimaryPixels()
    planes = [numpy.asarray(pixels.getPlane(0, channel, 0)) for channel in range(size_c)]
    if size_c == 1:
        rendered = Image.fromarray(planes[0])
    elif size_c in {3, 4}:
        values = numpy.stack(planes[:size_c], axis=-1)
        if values.dtype != numpy.uint8:
            maximum = float(values.max()) or 1.0
            values = numpy.clip(values * (255.0 / maximum), 0, 255).astype(numpy.uint8)
        rendered = Image.fromarray(values, "RGB" if size_c == 3 else "RGBA")
    else:
        raise ValueError("Only one-, three-, and four-channel Analysis Images can be archived as PNG")
    output = io.BytesIO()
    rendered.save(output, format="PNG", optimize=False)
    return output.getvalue()


class Command(BaseCommand):
    help = "Backfill managed OMERO.Analysis content into the mapped .analysis store"

    def add_arguments(self, parser):
        mode = parser.add_mutually_exclusive_group(required=True)
        mode.add_argument("--dry-run", action="store_true")
        mode.add_argument("--apply", action="store_true")
        parser.add_argument("--group-id", type=int, required=True)
        parser.add_argument("--user-id", type=int)
        parser.add_argument("--workspace-id")
        parser.add_argument("--checkpoint")
        parser.add_argument("--report")
        parser.add_argument("--host", default=os.environ.get("OMERO_HOST", "omeroserver"))
        parser.add_argument("--port", type=int, default=int(os.environ.get("OMERO_PORT", "4064")))
        parser.add_argument("--username", default=os.environ.get("OMERO_USER", "root"))
        parser.add_argument("--password", default=os.environ.get("OMERO_PASSWORD") or os.environ.get("ROOTPASS"))

    def handle(self, *args, **options):
        if not options["password"]:
            raise CommandError("Set OMERO_PASSWORD/ROOTPASS or pass --password through a protected environment")
        capability = storage_capability(options["group_id"])
        if not capability.ready:
            raise CommandError(f"Storage capability failed: {capability.failure_code}: {capability.detail}")
        options["resume"] = {}
        if options["checkpoint"] and Path(options["checkpoint"]).is_file():
            try:
                options["resume"] = json.loads(
                    Path(options["checkpoint"]).read_text(encoding="utf-8")
                )
            except (OSError, ValueError) as exc:
                raise CommandError(f"Checkpoint is not valid JSON: {exc}") from exc
        from omero.gateway import BlitzGateway

        conn = BlitzGateway(
            options["username"], options["password"],
            host=options["host"], port=options["port"],
        )
        if not conn.connect():
            raise CommandError("Could not connect to OMERO")
        try:
            conn.SERVICE_OPTS.setOmeroGroup(options["group_id"])
            current_user = user_id(conn)
            if options["user_id"] not in {None, current_user}:
                raise CommandError(
                    "This command writes the authenticated user's private library; authenticate as --user-id"
                )
            storage = None if options["dry_run"] else AnalysisStorage(capability, current_user)
            report = self._backfill(conn, storage, options, current_user)
        finally:
            conn.close()
        report["mode"] = "dry-run" if options["dry_run"] else "apply"
        report["completedAt"] = datetime.now(timezone.utc).isoformat()
        encoded = json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
        if options["report"]:
            Path(options["report"]).write_text(encoded, encoding="utf-8")
        self.stdout.write(encoded)

    def _backfill(self, conn, storage, options, current_user):
        completed = set(options["resume"].get("completedWorkspaces") or [])
        report = {
            "groupId": options["group_id"], "userId": current_user,
            "workspaces": [], "settings": [],
            "completedWorkspaces": sorted(completed),
            "settingsCompleted": bool(options["resume"].get("settingsCompleted")),
        }
        project = _managed_project(conn, options["group_id"])
        for dataset in list(project.listChildren()) if project is not None else []:
            _, manifest = _read_manifest(dataset)
            workspace_id = str(((manifest or {}).get("workspace") or {}).get("id") or "")
            if not workspace_id or (options["workspace_id"] and workspace_id != options["workspace_id"]):
                continue
            if workspace_id in completed:
                report["workspaces"].append({"workspaceId": workspace_id, "resumed": True})
                continue
            local_items = []
            for key, item in _remote_items(manifest).items():
                remote = item.get("remote") or {}
                if remote.get("object_type") == "Annotation":
                    obj = conn.getObject("FileAnnotation", int(remote["object_id"]))
                    data = _file_bytes(obj)
                    archive_flags = []
                elif remote.get("object_type") == "Image":
                    obj = conn.getObject("Image", int(remote["object_id"]))
                    data = _archive_png(obj)
                    archive_flags = ["legacy-omero", "archive-derived"]
                else:
                    continue
                blob = None if storage is None else storage.store_blob(data, item["name"])
                local_items.append({
                    "key": key, "kind": item["kind"], "mimeType": item["mimetype"],
                    "size": len(data), "sha256": __import__("hashlib").sha256(data).hexdigest(),
                    "remote": remote, "storageMode": "legacy-omero", "flags": archive_flags,
                    "blob": blob,
                })
            entry = {"workspaceId": workspace_id, "datasetId": int(dataset.getId()), "itemCount": len(local_items)}
            report["workspaces"].append(entry)
            if storage is not None:
                storage.write_json(storage.workspace_manifest_path(workspace_id), {
                    "schema": "nl.bioimaging.analysis.storage.workspace.v1",
                    "userId": current_user, "groupId": options["group_id"],
                    **entry, "items": local_items,
                })
                completed.add(workspace_id)
                report["completedWorkspaces"] = sorted(completed)
                self._checkpoint(options, report)

        project = settings_project(conn, options["group_id"])
        local_settings = []
        if report["settingsCompleted"]:
            report["settings"] = [{"resumed": True}]
            return report
        for role, namespace, limit in (
            ("ai-settings", SETTINGS_FILE_NAMESPACE, None),
            ("skills", SKILL_FILE_NAMESPACE, None),
        ):
            dataset = settings_dataset(project, role)
            for annotation in settings_annotations(dataset, namespace) if dataset is not None else []:
                data = settings_bytes(annotation)
                original = annotation.getFile()
                name = str(getattr(original.getName(), "val", original.getName()))
                blob = None if storage is None else storage.store_blob(data, name)
                local_settings.append({
                    "key": f"{role}:{annotation.getId()}", "kind": role,
                    "mimeType": str(getattr(original.getMimetype(), "val", original.getMimetype())),
                    "size": len(data), "sha256": __import__("hashlib").sha256(data).hexdigest(),
                    "storageMode": "hybrid", "blob": blob,
                    "omero": {"annotationId": int(annotation.getId()), "fileId": int(original.getId())},
                })
        report["settings"] = [{"itemCount": len(local_settings)}]
        if storage is not None:
            storage.write_json(Path("settings") / "manifest.json", {
                "schema": "nl.bioimaging.analysis.storage.settings.v1",
                "userId": current_user, "groupId": options["group_id"], "items": local_settings,
            })
            storage.garbage_collect()
            report["settingsCompleted"] = True
            self._checkpoint(options, report)
        return report

    @staticmethod
    def _checkpoint(options, report):
        if options["checkpoint"]:
            path = Path(options["checkpoint"])
            path.parent.mkdir(parents=True, exist_ok=True)
            temporary = path.with_suffix(path.suffix + ".tmp")
            temporary.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
            os.replace(temporary, path)
