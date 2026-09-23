"""Explicit operator recovery, without stored OMERO credentials."""
import getpass
import json
from django.core.management.base import BaseCommand, CommandError
from omero_analysis.data_query_provenance import promotion_lock
from omero_analysis.data_query_recovery import PromotionJournal, reconcile, state_directory
from omero_analysis.data_query_audit import audit


class Command(BaseCommand):
    help = "Inspect abandoned query promotions; --apply cleans verified incomplete attempts."

    def add_arguments(self, parser):
        parser.add_argument("--host", required=True)
        parser.add_argument("--port", type=int, default=4064)
        parser.add_argument("--username", required=True)
        parser.add_argument("--receipt-sha256")
        parser.add_argument("--apply", action="store_true")

    def handle(self, *args, **options):
        from omero.gateway import BlitzGateway
        password = getpass.getpass("OMERO administrator password: ")
        conn = BlitzGateway(options["username"], password, host=options["host"], port=options["port"])
        del password
        failures = []
        try:
            if not conn.connect() or not conn.isAdmin():
                raise CommandError("An OMERO administrator session is required")
            conn.SERVICE_OPTS.setOmeroGroup(-1)
            selected = options["receipt_sha256"]
            keys = [selected] if selected else [p.stem for p in state_directory().glob("*.json")]
            for key in sorted(keys):
                try:
                    with promotion_lock(key):
                        journal = PromotionJournal(key)
                        if journal.value is None:
                            raise ValueError("Promotion journal not found")
                        result = reconcile(conn, journal, apply=options["apply"])
                        self.stdout.write(json.dumps({"receipt_sha256": key, **result}))
                        if options["apply"]:
                            audit("promotion_reconciliation", result["state"],
                                  user_id=int(conn.getUserId()), receipt_sha256=key)
                except Exception as exc:
                    failures.append(key)
                    self.stderr.write(json.dumps({"receipt_sha256": key, "error": str(exc)}))
        finally:
            conn.close()
        if failures:
            raise CommandError(f"{len(failures)} promotion(s) require review or retry")
