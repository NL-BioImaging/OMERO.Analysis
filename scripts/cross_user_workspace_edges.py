"""Isolated deleted-source and workspace-ownership acceptance checks; credentials on stdin."""
import hashlib
import json
import os
import sys
import uuid
from pathlib import Path
from types import SimpleNamespace


def main():
    credentials = json.load(sys.stdin)
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "omeroweb.settings")
    import django
    django.setup()
    from django.test import RequestFactory
    from omero.gateway import BlitzGateway, DatasetWrapper
    from omero.model import DatasetI
    from omero_analysis.errors import PermissionDenied, InvalidObject
    from omero_analysis.workspace_sync import (
        INVENTORY_SCHEMA, _canonical_json, plan_sync, apply_sync, workspace_destination,
    )
    from omero_analysis.workspace_lifecycle import owned_workspace_context, change_lifecycle

    def connect(name, password, gid):
        c = BlitzGateway(name, password, host="omeroserver", port=4064)
        assert c.connect()
        c.setGroupForSession(gid)
        return c
    root = connect("root", credentials["root_password"], 114)
    connections = []
    sources = []
    report = {}
    try:
        owner = connect("user1", credentials["user_password"],114)
        member = connect("user2",credentials["user_password"],114)
        connections += [owner,member]
        source = DatasetWrapper(owner, DatasetI())
        source.setName("Temporary source for workspace recovery check")
        source.save()
        sources.append((owner,source.getId()))
        obj = member.getObject("Dataset",source.getId())
        wid = str(uuid.uuid4())
        request = RequestFactory().post("/")
        request.session = SimpleNamespace(session_key=wid)
        payload = {"schema":INVENTORY_SCHEMA,"workspace":{"id":wid,"name":"Deleted source recovery test",
            "sourceObjectType":"Dataset","sourceObjectId":obj.getId(),"sourceObjectName":obj.getName(),
            "userId":137,"groupId":114},"items":[]}
        payload["digest"] = hashlib.sha256(_canonical_json(payload)).hexdigest()
        plan = plan_sync(request,member,obj,payload)
        synced = apply_sync(request,member,obj,payload,plan["planToken"],[],[])
        destination = workspace_destination(member,obj,wid)
        try:
            workspace_destination(owner,source,wid)
            raise AssertionError("Other user's workspace must not be accepted")
        except (PermissionDenied,InvalidObject):
            report["other_workspace"] = "denied"
        owner.deleteObjects("Dataset",[source.getId()],wait=True)
        sources.clear()
        assert member.getObject("Dataset",source.getId()) is None
        surrogate, resolved = owned_workspace_context(member,destination)
        assert resolved == wid
        trashed = change_lifecycle(member,surrogate,wid,"trash",0)
        restored = change_lifecycle(member,surrogate,wid,"restore",trashed["lifecycleRevision"])
        trashed = change_lifecycle(member,surrogate,wid,"trash",restored["lifecycleRevision"])
        purged = change_lifecycle(member,surrogate,wid,"purge",trashed["lifecycleRevision"])
        assert purged["cleanup"]["complete"] and purged["cleanup"]["dataset_deleted"]
        report["deleted_source_workspace"] = {"trash_restore_purge":"passed","dataset":destination.getId()}
    finally:
        for owner,did in sources: owner.deleteObjects("Dataset",[did],wait=True)
        for c in connections: c.close()
        root.close()
        Path("/tmp/cross-user-workspace-edges.json").write_text(json.dumps(report,indent=2))
    print(json.dumps(report))


if __name__ == "__main__": main()
