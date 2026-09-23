"""Local acceptance probe. Credentials on stdin; results contain no tokens.

Run inside OMERO.web. Uses the explicitly designated TestGroup fixtures only.
Permission matrix temporarily changes group permissions and restores them in finally.
"""
import hashlib
import json
import os
import sys
import uuid
from pathlib import Path
from types import SimpleNamespace


def main():
    options = json.load(sys.stdin)
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "omeroweb.settings")
    import django
    django.setup()
    from django.test import RequestFactory
    from omero.gateway import BlitzGateway
    from omero.model import PermissionsI
    from omero_analysis.workspace_sync import (
        INVENTORY_SCHEMA, _canonical_json, validate_inventory, plan_sync, apply_sync,
        workspace_destination,
    )
    from omero_analysis.services import object_context
    from omero_analysis.tokens import make_context_token
    from omero_analysis.data_query import authorize_query_source, DataQueryBroker, make_result_token
    from omero_analysis.data_query_provenance import make_receipt, promote_result
    from omero_analysis.workspace_lifecycle import change_lifecycle
    from omero_analysis.errors import AnalysisError

    def connect(name, password):
        c = BlitzGateway(name, password, host="omeroserver", port=4064)
        assert c.connect()
        c.setGroupForSession(114)
        return c

    root = connect("root", options["root_password"])
    group = root.getObject("ExperimenterGroup", 114)
    assert group.getName().lower() == "testgroup"
    original = str(group.getDetails().getPermissions())
    def snapshot():
        result = {}
        for pid in (302, 303):
            p = root.getObject("Plate", pid)
            values = []
            for a in p.listAnnotations():
                value = {"id": a.getId(), "owner": a.getDetails().getOwner().getId(), "ns": a.getNs()}
                if hasattr(a, "getFile"):
                    h = hashlib.sha256()
                    for chunk in a.getFileInChunks(): h.update(chunk)
                    value.update(file_id=a.getFile().getId(), sha256=h.hexdigest())
                if hasattr(a, "getValue"): value["value"] = a.getValue()
                values.append(value)
            result[str(pid)] = sorted(values, key=lambda x: x["id"])
        return result
    before = snapshot()
    report = {"before": before, "cases": []}
    try:
        modes = [("read-annotate", "rwra--")]
        if options.get("permission_matrix"):
            modes += [("read-only", "rwr---")]
        for label, permissions in modes:
            if options.get("permission_matrix"):
                root.getAdminService().changePermissions(root.getObject("ExperimenterGroup", 114)._obj, PermissionsI(permissions))
            for name, pid, aid in [("user1",302,4050),("user1",303,4052),("user2",302,4050),("user2",303,4052)]:
                conn = connect(name, options["user_password"])
                try:
                    obj = conn.getObject("Plate", pid)
                    case = {"mode": label, "user": name, "plate": pid}
                    if obj is None:
                        assert label == "private" and (name,pid) in [("user1",303),("user2",302)]
                        case["read"] = "denied"
                        report["cases"].append(case)
                        continue
                    ctx = object_context("Plate", pid, obj, conn)
                    case.update(can_annotate_source=ctx["can_annotate_source"], can_manage_workspace=ctx["can_manage_workspace"])
                    wid = str(uuid.uuid4())
                    request = RequestFactory().post("/")
                    request.session = SimpleNamespace(session_key="workspace-acceptance-" + wid)
                    token, _ = make_context_token(request, conn, "Plate", pid, obj, ["data_query", "sync_plan", "sync_apply"])
                    request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = token
                    payload = {"schema": INVENTORY_SCHEMA, "workspace": {"id": wid,
                        "name": "Acceptance " + label, "sourceObjectType": "Plate", "sourceObjectId": pid,
                        "sourceObjectName": obj.getName(), "userId": conn.getUserId(), "groupId": 114}, "items": []}
                    payload["digest"] = hashlib.sha256(_canonical_json(payload)).hexdigest()
                    inv = validate_inventory(payload, wid, "Plate", pid, obj, conn)
                    plan = plan_sync(request, conn, obj, inv)
                    synced = apply_sync(request, conn, obj, inv, plan["planToken"], [], [])
                    target = workspace_destination(conn, obj, wid)
                    assert target.getDetails().getOwner().getId() == conn.getUserId()
                    case.update(workspace=wid, dataset=target.getId())
                    claims, _, ann, info, scope, ref = authorize_query_source(request, conn, annotation_id=aid)
                    query = {"sql": "SELECT COUNT(*) AS cell_count FROM objects WHERE object_type='cells'", "parameters": {}}
                    broker = DataQueryBroker()
                    result, identifier = broker.query(ann, info, scope, ref, query)
                    result_token = make_result_token(request, conn, claims, info, identifier)
                    receipt = make_receipt(request, conn, claims, info, result_token, query, result)
                    save = {"result_token": result_token, "receipt": receipt, "workspace_id": wid, "filename": "verified-cell-count.csv"}
                    saved = promote_result(request, conn, save)
                    assert promote_result(request, conn, save)["reused"]
                    a = conn.getObject("FileAnnotation", saved["result"]["annotation_id"])
                    assert a.getDetails().getOwner().getId() == conn.getUserId()
                    assert b"".join(a.getFileInChunks()) == b"cell_count\n3\n"
                    case.update(result_annotation=a.getId(), cell_count=3, retry="reused")
                    trashed = change_lifecycle(conn, obj, wid, "trash", 0)
                    restored = change_lifecycle(conn, obj, wid, "restore", trashed["lifecycleRevision"])
                    assert restored["lifecycle"] == "active"
                    case["trash_restore"] = "passed"
                    report["cases"].append(case)
                finally:
                    conn.close()
    finally:
        if options.get("permission_matrix"):
            root.getAdminService().changePermissions(root.getObject("ExperimenterGroup", 114)._obj, PermissionsI(original))
        report["after"] = snapshot()
        report["source_unchanged"] = report["after"] == before
        Path(options.get("output", "/tmp/cross-user-workspace-probe.json")).write_text(json.dumps(report, indent=2))
        root.close()
    assert report["source_unchanged"]
    print(json.dumps({"cases": report["cases"], "source_unchanged": True}))


if __name__ == "__main__":
    main()
