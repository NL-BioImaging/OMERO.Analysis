"""Run in OMERO.web with credentials on stdin. Default is an inventory only.

Apply requires the exact previously reviewed inventory as ``allowlist`` and
``apply: true``. A fresh membership and data check precedes every deletion.
Event history is never modified. The output is the deployment filter manifest.
"""
import json
import logging
import re
import sys

logging.disable(logging.CRITICAL)


def main():
    from omero.gateway import BlitzGateway
    from omero.sys import ParametersI
    from omero.rtypes import rstring
    options = json.load(sys.stdin)
    conn = BlitzGateway("root", options["password"], host=options.get("host", "omeroserver"), port=4064)
    if not conn.connect():
        raise RuntimeError("Administrator connection failed")
    try:
        admin, query = conn.getAdminService(), conn.getQueryService()
        users = [u for u in admin.lookupExperimenters() if re.fullmatch(r"dqw-test-[0-9a-f]+-(owner|member|pi)", u.omeName.val)]
        groups = [g for g in admin.lookupGroups() if re.fullmatch(r"dqw-test-[0-9a-f]+-(private|read-only|read-annotate|read-write|revocation)", g.name.val)]
        inventory = {"users": {str(u.id.val): u.omeName.val for u in users},
                     "groups": {str(g.id.val): g.name.val for g in groups}}
        checks = {}
        for kind, values in (("users", users), ("groups", groups)):
            for value in values:
                identifier = value.id.val
                counts = {}
                for model in ("Project", "Dataset", "Screen", "Plate", "Image", "OriginalFile", "Annotation", "Fileset", "Well", "PlateAcquisition"):
                    field = "owner" if kind == "users" else "group"
                    rows = query.projection(f"select count(x.id) from {model} x where x.details.{field}.id = :id",
                                            ParametersI().addLong("id", identifier), {"omero.group": "-1"})
                    counts[model] = rows[0][0].val
                members = [u.id.val for u in admin.containedExperimenters(identifier)] if kind == "groups" else []
                memberships = [g.id.val for g in admin.containedGroups(identifier)] if kind == "users" else []
                checks[f"{kind}:{identifier}"] = {"objects": counts, "members": members, "memberships": memberships,
                    "safe": not any(counts.values()) and (all(str(i) in inventory["users"] for i in members)) and
                        (kind != "users" or 1 not in memberships)}
        if not options.get("apply"):
            print(json.dumps({"allowlist": inventory, "checks": checks}, indent=2))
            return
        if options.get("allowlist") != inventory or not all(item["safe"] for item in checks.values()):
            raise RuntimeError("Fixture inventory changed or a dependency check failed; review a new inventory")
        report = {"deleted": {"users": {}, "groups": {}}, "retired": {"users": {}, "groups": {}}, "refusals": [], "checks": checks}
        for kind, values in (("users", users), ("groups", groups)):
            for value in values:
                identifier = str(value.id.val)
                name = inventory[kind][identifier]
                try:
                    if kind == "users":
                        admin.deleteExperimenter(value)
                    else:
                        admin.deleteGroup(value)
                    report["deleted"][kind][identifier] = name
                except Exception as exc:
                    reason = str(getattr(exc, "message", "") or type(exc).__name__)
                    report["refusals"].append({"kind": kind, "id": int(identifier), "name": name, "reason": reason})
                    # Retention is deliberate: OMERO event history is immutable.
                    if kind == "users":
                        fresh = admin.getExperimenter(int(identifier))
                        fresh.lastName = rstring("Retired DataQueryTest")
                        admin.updateExperimenter(fresh)
                    else:
                        fresh = admin.getGroup(int(identifier))
                        fresh.description = rstring("Retired DataQuery permission-test fixture; retained for OMERO event history.")
                        admin.updateGroup(fresh)
                    report["retired"][kind][identifier] = name
        print(json.dumps(report, indent=2))
    finally:
        conn.close()


if __name__ == "__main__":
    main()
