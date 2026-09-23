"""Local acceptance fixtures; credentials and explicit fixture IDs arrive on stdin.

setup creates an isolated, named set of source objects. probe exercises real
OMERO links, storage, and lifecycle services. cleanup accepts only that exact set.
Keep the JSON setup output until browser testing and cleanup are finished.
"""
import hashlib
import json
import os
import sys
import uuid
from types import SimpleNamespace


def main():
    options = json.load(sys.stdin)
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "omeroweb.settings")
    import django
    django.setup()
    from django.test import RequestFactory
    from django.core.files.uploadedfile import SimpleUploadedFile
    from omero.gateway import BlitzGateway, DatasetWrapper, ScreenWrapper, PlateWrapper
    from omero.model import DatasetI, ScreenI, PlateI, ScreenPlateLinkI
    from omero_analysis import workspace_sync as ws
    from omero_analysis.workspace_lifecycle import change_lifecycle, state_for
    from omero_analysis.workspace_results import result_payload
    import time
    def retry(fn, *args):
        for attempt in range(30):
            try:
                return fn(*args)
            except Exception as exc:
                if getattr(exc, "code", "") != "sync_busy" or attempt == 29:
                    raise
                time.sleep(2)
    def lifecycle(*args):
        return retry(change_lifecycle, *args)
    conn = BlitzGateway("root", options["password"], host="omeroserver", port=4064)
    assert conn.connect()
    conn.setGroupForSession(0)
    try:
        if options.get("action") == "setup":
            import numpy as np
            prefix = "Analysis-QA-" + uuid.uuid4().hex[:8]
            sources = []
            for kind, wrapper, model in (("Screen", ScreenWrapper, ScreenI), ("Plate", PlateWrapper, PlateI), ("Dataset", DatasetWrapper, DatasetI)):
                obj = wrapper(conn, model())
                obj.setName(prefix + " " + kind)
                obj.save()
                sources.append({"type": kind, "id": obj.getId(), "name": obj.getName()})
            link = ScreenPlateLinkI()
            link.parent = ScreenI(sources[0]["id"], False)
            link.child = PlateI(sources[1]["id"], False)
            conn.getUpdateService().saveAndReturnObject(link)
            dataset = conn.getObject("Dataset", sources[2]["id"])
            image = conn.createImageFromNumpySeq(iter([np.arange(64, dtype=np.uint8).reshape(8, 8)]), prefix + " Image", dataset=dataset)
            sources.append({"type": "Image", "id": image.getId(), "name": image.getName()})
            print(json.dumps({"prefix": prefix, "sources": sources}, indent=2))
            return
        fixture = options["fixture"]
        for source in fixture["sources"]:
            obj = conn.getObject(source["type"], source["id"])
            assert obj is not None and obj.getName() == source["name"] and source["name"].startswith(fixture["prefix"])
        if options["action"] == "probe":
            outcomes = []
            request = RequestFactory().post("/")
            request.session = SimpleNamespace(session_key="analysis-reliability-probe")
            for source in fixture["sources"]:
                obj = conn.getObject(source["type"], source["id"])
                for number in (1, 2):
                    wid = str(uuid.uuid4())
                    data = b"value,label\n1,synthetic\n2,unicode-\xc3\xa9\n"
                    digest = hashlib.sha256(data).hexdigest()
                    item = {"key": "result-content:result:" + digest, "kind": "result", "name": "qa.csv", "mimetype": "text/csv",
                            "logicalPath": "Results/qa.csv", "size": len(data), "sha256": digest, "metadata": {}}
                    unsigned = {"schema": ws.INVENTORY_SCHEMA, "workspace": {"id": wid, "name": source["name"] + f" — Analysis {number}",
                                "sourceObjectType": source["type"], "sourceObjectId": source["id"], "sourceObjectName": source["name"],
                                "userId": 0, "groupId": 0, "lifecycleRevision": 0}, "items": [item]}
                    inventory = {**unsigned, "digest": ws._digest(unsigned)}
                    inventory = ws.validate_inventory(inventory, wid, source["type"], source["id"], obj, conn)
                    plan = retry(ws.plan_sync, request, conn, obj, inventory)
                    saved = retry(ws.apply_sync, request, conn, obj, inventory, plan["planToken"], plan["uploadKeys"], [SimpleUploadedFile("qa.csv", data)])
                    assert saved["linked"] and saved["browseState"] == "ready", saved
                    metadata, handle, chunks = result_payload(conn, obj, wid, item["key"])
                    try:
                        restored = handle.read() if handle else b"".join(chunks)
                        assert hashlib.sha256(restored).hexdigest() == digest
                    finally:
                        if handle:
                            handle.close()
                    trashed = lifecycle(conn, obj, wid, "trash", 0)
                    assert trashed["lifecycle"] == "trashed" and trashed["lifecycleRevision"] == 1
                    try:
                        ws.plan_sync(request, conn, obj, inventory)
                    except Exception as exc:
                        assert getattr(exc, "code", None) == "workspace_conflict"
                    else:
                        raise AssertionError("Stale synchronization resurrected Trash")
                    restored_state = lifecycle(conn, obj, wid, "restore", 1)
                    assert restored_state["lifecycle"] == "active" and restored_state["lifecycleRevision"] == 2
                    lifecycle(conn, obj, wid, "trash", 2)
                    purged = lifecycle(conn, obj, wid, "purge", 3)
                    assert purged["cleanup"]["complete"], purged
                    assert purged["lifecycle"] == "purged" and not purged["linked"], purged
                    outcomes.append({"source": source, "workspace": wid, "datasetId": saved["datasetId"], "result": "passed"})
            print(json.dumps({"outcomes": outcomes}, indent=2))
            return
        if options["action"] == "faults":
            from omero.gateway import MapAnnotationWrapper
            from omero_analysis.errors import PermissionDenied
            source = next(item for item in fixture["sources"] if item["type"] == "Dataset")
            obj = conn.getObject("Dataset", source["id"])
            wid, data = str(uuid.uuid4()), b"value\n42\n"
            digest = hashlib.sha256(data).hexdigest()
            item = {"key": "result-content:result:" + digest, "kind": "result", "name": "fault.csv", "mimetype": "text/csv",
                    "logicalPath": "Results/fault.csv", "size": len(data), "sha256": digest, "metadata": {}}
            unsigned = {"schema": ws.INVENTORY_SCHEMA, "workspace": {"id": wid, "name": fixture["prefix"] + " Fault acceptance",
                        "sourceObjectType": "Dataset", "sourceObjectId": obj.getId(), "sourceObjectName": obj.getName(),
                        "userId": 0, "groupId": 0, "lifecycleRevision": 0}, "items": [item]}
            inventory = ws.validate_inventory({**unsigned, "digest": ws._digest(unsigned)}, wid, "Dataset", obj.getId(), obj, conn)
            request = RequestFactory().post("/")
            request.session = SimpleNamespace(session_key="analysis-fault-probe")
            plan = retry(ws.plan_sync, request, conn, obj, inventory)
            saved = retry(ws.apply_sync, request, conn, obj, inventory, plan["planToken"], plan["uploadKeys"], [SimpleUploadedFile("fault.csv", data)])
            dataset = conn.getObject("Dataset", saved["datasetId"])
            _, manifest = ws._read_manifest(dataset)
            stored = ws._remote_items(manifest)[item["key"]]
            annotation_id = stored["remote"]["object_id"]
            print(json.dumps({"fault_workspace": wid, "dataset": dataset.getId(), "annotation": annotation_id}), flush=True)
            shared = conn.getObject("FileAnnotation", annotation_id)
            obj.linkAnnotation(shared)
            unrelated = MapAnnotationWrapper(conn)
            unrelated.setNs(fixture["prefix"] + ".unrelated")
            unrelated.setValue([["keep", "synthetic unrelated annotation"]])
            unrelated.save()
            dataset.linkAnnotation(unrelated)
            wrong_source = conn.getObject("Screen", fixture["sources"][0]["id"])
            try:
                result_payload(conn, wrong_source, wid, item["key"])
            except PermissionDenied:
                pass
            else:
                raise AssertionError("Cross-source recovery was permitted")
            lifecycle(conn, obj, wid, "trash", 0)
            original_delete = ws._delete
            failed = []
            def fail_once(connection, kind, identifier):
                if not failed:
                    failed.append((kind, identifier))
                    raise RuntimeError("Injected interrupted cleanup")
                return original_delete(connection, kind, identifier)
            ws._delete = fail_once
            try:
                partial = lifecycle(conn, obj, wid, "purge", 1)
                assert not partial["cleanup"]["complete"] and partial["cleanup"]["errors"]
            finally:
                ws._delete = original_delete
            storage, state = state_for(conn, obj, wid)
            assert storage.read_json("workspaces/" + wid + "/cleanup.json")["errors"]
            complete = lifecycle(conn, obj, wid, "purge", state["revision"])
            assert complete["cleanup"]["complete"] and not complete["cleanup"]["dataset_deleted"]
            assert conn.getObject("Annotation", annotation_id) is not None
            assert conn.getObject("Annotation", unrelated.getId()) is not None
            blob_path = storage.analysis_root / stored["storage"]["blob"]["relativePath"]
            assert hashlib.sha256(blob_path.read_bytes()).hexdigest() == digest
            print(json.dumps({"partial_cleanup": "passed", "retry": "passed", "shared_result": "preserved",
                              "unrelated_annotation": "preserved", "canonical_checksum": digest, "source_isolation": "passed"}), flush=True)
            # These are all synthetic objects created above, including the otherwise
            # deliberately preserved container and external shared link.
            original_delete(conn, "Annotation", annotation_id)
            original_delete(conn, "Annotation", unrelated.getId())
            original_delete(conn, "Dataset", dataset.getId())
            return
        if options["action"] == "cleanup":
            # Delete only workspace mirrors whose recorded source is a fixture.
            for source in fixture["sources"]:
                obj = conn.getObject(source["type"], source["id"])
                for item in ws.library_datasets(conn, obj):
                    if item.get("sourceObjectType") != source["type"] or item.get("sourceObjectId") != source["id"]:
                        continue
                    wid = item["workspaceId"]
                    _, state = state_for(conn, obj, wid)
                    if state["state"] == "active":
                        lifecycle(conn, obj, wid, "trash", state["revision"])
                    _, state = state_for(conn, obj, wid)
                    result = lifecycle(conn, obj, wid, "purge", state["revision"])
                    assert result["cleanup"]["complete"], result
            for kind in ("Image", "Dataset", "Plate", "Screen"):
                for source in fixture["sources"]:
                    if source["type"] == kind:
                        conn.deleteObjects(kind, [source["id"]], wait=True)
            print(json.dumps({"cleaned": fixture["sources"]}))
        if options["action"] == "verify-results":
            checked = []
            for source in fixture["sources"]:
                obj = conn.getObject(source["type"], source["id"])
                for entry in ws.library_datasets(conn, obj):
                    if entry.get("sourceObjectType") != source["type"] or entry.get("sourceObjectId") != source["id"]:
                        continue
                    wid = entry["workspaceId"]
                    dataset = conn.getObject("Dataset", entry["datasetId"])
                    _, manifest = ws._read_manifest(dataset)
                    for item in ws._remote_items(manifest).values():
                        if item.get("kind") not in {"result", "png-image"}:
                            continue
                        metadata, handle, chunks = result_payload(conn, obj, wid, item["key"])
                        digest, size = hashlib.sha256(), 0
                        try:
                            for chunk in iter(lambda: handle.read(1024 * 1024), b"") if handle else chunks:
                                digest.update(chunk)
                                size += len(chunk)
                        finally:
                            if handle:
                                handle.close()
                        assert digest.hexdigest() == metadata["sha256"] and size == metadata["size"]
                        checked.append({"workspace": wid, "name": item["name"], "sha256": digest.hexdigest(), "bytes": size})
            assert checked, "No fixture result bytes were checked"
            print(json.dumps({"verified": checked}, indent=2))
    finally:
        conn.close()


if __name__ == "__main__":
    main()
