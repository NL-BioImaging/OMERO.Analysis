from pathlib import Path
from types import SimpleNamespace

import pytest
from django.core import signing

from omero_analysis.errors import AnalysisError
from omero_analysis.omero_state import (
    OmeroStateStorage,
    STATE_NAMESPACE,
    STATE_SALT,
    STATE_SCHEMA,
)


class Annotation:
    def __init__(self, identifier, name, data, namespace, description, owner=7):
        self.identifier = identifier
        self.name = name
        self.data = data
        self.namespace = namespace
        self.description = description
        self.owner = owner

    def getId(self):
        return self.identifier

    def getNs(self):
        return self.namespace

    def getDescription(self):
        return self.description

    def getFileInChunks(self):
        yield self.data

    def getDetails(self):
        return SimpleNamespace(
            getOwner=lambda: SimpleNamespace(getId=lambda: self.owner)
        )


class Project:
    def __init__(self):
        self.annotations = []

    def listAnnotations(self):
        return list(self.annotations)

    def linkAnnotation(self, annotation):
        self.annotations.append(annotation)


class Connection:
    def __init__(self, project):
        self.project = project
        self.next_id = 1

    def getUserId(self):
        return 7

    def createFileAnnfromLocalFile(self, path, mimetype, ns, desc):
        annotation = Annotation(
            self.next_id, Path(path).name, Path(path).read_bytes(), ns, desc
        )
        self.next_id += 1
        return annotation

    def deleteObjects(self, object_type, identifiers, wait=True):
        self.project.annotations = [
            item for item in self.project.annotations
            if item.getId() not in set(identifiers)
        ]


class RetainingConnection(Connection):
    def deleteObjects(self, object_type, identifiers, wait=True):
        raise RuntimeError("cleanup unavailable")


def source():
    return SimpleNamespace(
        OMERO_CLASS="Screen",
        getId=lambda: 11,
        getDetails=lambda: SimpleNamespace(
            getGroup=lambda: SimpleNamespace(getId=lambda: 4)
        ),
    )


def test_state_is_signed_append_first_and_scoped(monkeypatch, settings, tmp_path):
    settings.OMERO_ANALYSIS_STATE_DIR = str(tmp_path)
    project = Project()
    store = OmeroStateStorage(Connection(project), source())
    monkeypatch.setattr(store, "_project", lambda create=False: project)

    store.write_json("workspaces/one/lifecycle.json", {"state": "active", "revision": 0})
    store.write_json("workspaces/one/lifecycle.json", {"state": "trashed", "revision": 1})

    assert len(project.annotations) == 1
    value = store.read_json("workspaces/one/lifecycle.json")
    assert value["state"] == "trashed"
    assert value["workspaceId"] == "one"
    assert value["sourceObjectType"] == "Screen"
    assert value["sourceObjectId"] == 11
    assert value["userId"] == 7
    assert value["groupId"] == 4


def test_conflicting_generation_fails_closed(monkeypatch, settings, tmp_path):
    settings.OMERO_ANALYSIS_STATE_DIR = str(tmp_path)
    project = Project()
    store = OmeroStateStorage(Connection(project), source())
    monkeypatch.setattr(store, "_project", lambda create=False: project)
    relative = "workspaces/one/lifecycle.json"
    for identifier, state in ((1, "active"), (2, "trashed")):
        record = {
            "schema": STATE_SCHEMA,
            "path": relative,
            "generation": 1,
            "userId": 7,
            "groupId": 4,
            "payload": {"state": state},
        }
        encoded = signing.dumps(record, salt=STATE_SALT, compress=True).encode()
        project.annotations.append(
            Annotation(
                identifier,
                "lifecycle.json",
                encoded,
                STATE_NAMESPACE,
                f"OMERO Analysis state {relative}",
            )
        )

    with pytest.raises(AnalysisError) as raised:
        store.read_json(relative)
    assert raised.value.status == 409


def test_superseded_record_cleanup_failure_keeps_new_generation(
    monkeypatch, settings, tmp_path
):
    settings.OMERO_ANALYSIS_STATE_DIR = str(tmp_path)
    project = Project()
    connection = RetainingConnection(project)
    store = OmeroStateStorage(connection, source())
    monkeypatch.setattr(store, "_project", lambda create=False: project)
    relative = "workspaces/one/lifecycle.json"

    store.write_json(relative, {"state": "active", "revision": 0})
    store.write_json(relative, {"state": "trashed", "revision": 1})

    assert len(project.annotations) == 2
    assert store.read_json(relative)["state"] == "trashed"
