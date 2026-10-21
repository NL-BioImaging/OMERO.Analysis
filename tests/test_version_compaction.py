import hashlib, io, json, zipfile
from types import SimpleNamespace
from omero_analysis.version_compaction import obsolete_versions
from omero_analysis import workspace_sync as ws


def test_only_managed_owned_versions_with_exact_identity_are_compacted(monkeypatch):
    dataset=SimpleNamespace(listAnnotations=lambda: annotations)
    manifest={"workspace":{"id":"w","groupId":4,"sourceObjectType":"Screen","sourceObjectId":152},"revision":2,
              "items":[{"kind":"workspace-snapshot","key":"workspace-snapshot:w","remote":{"object_type":"Annotation","object_id":1}}]}
    def snapshot(identifier, owner=0, workspace="w", description=True):
        stream=io.BytesIO()
        with zipfile.ZipFile(stream,"w") as archive:
            archive.writestr("workspace.json",json.dumps({"workspace":{"id":workspace,"userId":owner,"groupId":4,"objectType":"Screen","objectId":152}}))
        data=stream.getvalue()
        return SimpleNamespace(getId=lambda:identifier,getNs=lambda:ws.WORKSPACE_SNAPSHOT_NAMESPACE,
            getDescription=lambda:f"OMERO Analysis synchronized item workspace-snapshot:w. Operation {'a'*64}." if description else "User upload",
            owner=owner,data=data)
    annotations=[snapshot(1),snapshot(2),snapshot(3,owner=7),snapshot(4,workspace="other"),snapshot(5,description=False)]
    monkeypatch.setattr(ws,"_user_id",lambda conn:0)
    monkeypatch.setattr(ws,"_owner_id",lambda obj:getattr(obj,"owner",0))
    monkeypatch.setattr(ws,"_file_bytes",lambda obj:obj.data)
    assert obsolete_versions(None,dataset,manifest)==[("Annotation",2)]


def test_api_failures_do_not_authorize_cleanup(monkeypatch):
    import pytest
    dataset=SimpleNamespace(listAnnotations=lambda: (_ for _ in ()).throw(ConnectionError("offline")))
    monkeypatch.setattr(ws,"_user_id",lambda conn:0)
    monkeypatch.setattr(ws,"_owner_id",lambda obj:0)
    with pytest.raises(ConnectionError): obsolete_versions(None,dataset,{"workspace":{"id":"w"},"items":[]})
