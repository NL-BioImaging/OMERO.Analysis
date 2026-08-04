import pytest

from omero_analysis.errors import InvalidObject, UnsupportedMedia
from omero_analysis.settings_store import (
    PROJECT_NAME,
    SETTINGS_SCHEMA,
    _decrypted_bundle,
    _encrypted_bundle,
    _project,
    _validated_payload,
)

from .conftest import FakeConnection


def settings_payload():
    return {
        "schema": SETTINGS_SCHEMA,
        "analysis": {"plotCsv": True, "theme": "light"},
        "ai": {
            "activeProfileId": "default",
            "profiles": [{
                "id": "default",
                "name": "Default",
                "settings": {
                    "protocol": "openai",
                    "authMode": "bearer",
                    "endpoint": "https://provider.example/v1",
                    "model": "model",
                    "apiKey": "secret",
                },
            }],
        },
        "skills": [{
            "id": "tables",
            "name": "Tables",
            "content": "# Tables\n",
        }],
    }


def test_settings_bundle_is_encrypted_and_round_trips_per_user_and_group():
    conn = FakeConnection(user_id=17)
    payload = _validated_payload(settings_payload())
    encrypted = _encrypted_bundle(conn, 3, payload)
    assert b"secret" not in encrypted
    assert _decrypted_bundle(conn, 3, encrypted) == payload


def test_settings_bundle_cannot_be_decrypted_in_another_group():
    conn = FakeConnection(user_id=17)
    encrypted = _encrypted_bundle(conn, 3, settings_payload())
    with pytest.raises(UnsupportedMedia):
        _decrypted_bundle(conn, 4, encrypted)


def test_settings_bundle_accepts_a_keyless_local_openai_profile():
    payload = settings_payload()
    provider = payload["ai"]["profiles"][0]["settings"]
    provider.update({
        "authMode": "none",
        "endpoint": "http://localhost:1234/v1",
        "apiKey": "",
        "model": "local-model",
    })
    assert _validated_payload(payload) == payload


def test_settings_bundle_rejects_an_unknown_color_theme():
    payload = settings_payload()
    payload["analysis"]["theme"] = "sepia"
    with pytest.raises(InvalidObject, match="color theme"):
        _validated_payload(payload)


def test_settings_bundle_accepts_default_off_artifact_editor_preference():
    legacy = settings_payload()
    assert _validated_payload(legacy)["analysis"].get("editorEnabled", False) is False

    current = settings_payload()
    current["analysis"]["editorEnabled"] = True
    assert _validated_payload(current)["analysis"]["editorEnabled"] is True


def test_settings_bundle_rejects_non_boolean_artifact_editor_preference():
    payload = settings_payload()
    payload["analysis"]["editorEnabled"] = "yes"
    with pytest.raises(InvalidObject, match="editor preference"):
        _validated_payload(payload)


def test_settings_bundle_accepts_optional_chat_attachment_sync_preference():
    legacy = settings_payload()
    assert _validated_payload(legacy)["analysis"].get("syncChatAttachments") is None
    current = settings_payload()
    current["analysis"]["syncChatAttachments"] = True
    assert _validated_payload(current)["analysis"]["syncChatAttachments"] is True


def test_settings_bundle_rejects_non_boolean_chat_attachment_sync_preference():
    payload = settings_payload()
    payload["analysis"]["syncChatAttachments"] = "yes"
    with pytest.raises(InvalidObject, match="attachment synchronization"):
        _validated_payload(payload)


def test_settings_bundle_accepts_default_on_analysis_sync_preferences():
    legacy = settings_payload()
    validated = _validated_payload(legacy)
    assert validated["analysis"].get("syncAnalysisWorkspace", True) is True
    assert validated["analysis"].get("syncAnalysisSettings", True) is True

    current = settings_payload()
    current["analysis"].update({
        "syncAnalysisWorkspace": False,
        "syncAnalysisSettings": False,
    })
    assert _validated_payload(current)["analysis"]["syncAnalysisWorkspace"] is False


@pytest.mark.parametrize("key", ["syncAnalysisWorkspace", "syncAnalysisSettings"])
def test_settings_bundle_rejects_non_boolean_analysis_sync_preferences(key):
    payload = settings_payload()
    payload["analysis"][key] = "yes"
    with pytest.raises(InvalidObject, match="synchronization preference"):
        _validated_payload(payload)


def test_marked_settings_project_is_renamed_in_place():
    class Annotation:
        def getNs(self):
            return "nl.bioimaging.analysis.settings.v1"

        def getValue(self):
            return [
                ("role", "project"),
                ("owner_user_id", "17"),
                ("group_id", "3"),
            ]

    class Project:
        name = "+AnalysisSettings"
        saved = False

        def listAnnotations(self):
            return [Annotation()]

        def getName(self):
            return self.name

        def setName(self, value):
            self.name = value

        def save(self):
            self.saved = True

    project = Project()

    class Connection(FakeConnection):
        def getObjects(self, object_type, opts=None):
            assert object_type == "Project"
            return [project]

    assert PROJECT_NAME == "~AnalysisSettings"
    assert _project(Connection(user_id=17), 3) is project
    assert project.name == "~AnalysisSettings"
    assert project.saved is True
