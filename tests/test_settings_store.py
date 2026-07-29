import pytest

from omero_analysis.errors import UnsupportedMedia
from omero_analysis.settings_store import (
    SETTINGS_SCHEMA,
    _decrypted_bundle,
    _encrypted_bundle,
    _validated_payload,
)

from .conftest import FakeConnection


def settings_payload():
    return {
        "schema": SETTINGS_SCHEMA,
        "analysis": {"plotCsv": True},
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
