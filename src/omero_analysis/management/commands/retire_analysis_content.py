"""Explicit administrator command; never runs at application startup."""
import os
from django.core.management.base import BaseCommand, CommandError
from ...retirement_cleanup import prepare_cleanup, apply_cleanup
from ...retirement_plan import canonical


class Command(BaseCommand):
    help = "Back up and retire managed Methods/Pipelines/assistant/settings; retain notebooks and results"

    def add_arguments(self, parser):
        mode = parser.add_mutually_exclusive_group(required=True)
        mode.add_argument("--dry-run", action="store_true")
        mode.add_argument("--apply", action="store_true")
        parser.add_argument("--backup-dir", required=True, help="New private directory; existing backups are never overwritten")
        parser.add_argument("--dataset-id", type=int, help="Restrict acceptance to one managed workspace Dataset")
        parser.add_argument("--host", default=os.environ.get("OMERO_HOST", "omeroserver"))
        parser.add_argument("--port", type=int, default=int(os.environ.get("OMERO_PORT", "4064")))
        parser.add_argument("--username", default=os.environ.get("OMERO_USER", "root"))

    def handle(self, *args, **options):
        from omero.gateway import BlitzGateway
        password = os.environ.get("OMERO_PASSWORD") or os.environ.get("ROOTPASS")
        if not password:
            raise CommandError("Provide OMERO_PASSWORD/ROOTPASS in the protected process environment")
        conn = BlitzGateway(options["username"], password, host=options["host"], port=options["port"])
        if not conn.connect():
            raise CommandError("Could not connect to OMERO")
        try:
            report = prepare_cleanup(conn, options["backup_dir"], options.get("dataset_id"))
            result = {"backupComplete": True, "files": len(report["files"]), "markers": len(report["markers"]),
                      "durableFiles": len(report["durable"]), "datasetId": report["datasetId"]}
            if options["apply"]:
                result["applied"] = apply_cleanup(conn, options["backup_dir"])
            self.stdout.write(canonical(result).decode())
        except Exception as exc:
            raise CommandError(str(exc)) from exc
        finally:
            conn.close()
