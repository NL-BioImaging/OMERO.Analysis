from types import SimpleNamespace

from django.test import RequestFactory

from omero_analysis_chat import views


class FakePayload:
    def __init__(self, value):
        self.value = value

    def to_dict(self):
        return self.value


class FakeCatalog:
    refreshed = False

    def get_catalog(self, consumer):
        assert consumer == "omero-analysis-chat"
        return FakePayload(
            {
                "schema": "nl.bioimaging.omero-workflow-skills.v1",
                "consumer": consumer,
                "workflows": [],
            }
        )

    def get_package(self, workflow_key, skill_name, consumer):
        assert (workflow_key, skill_name, consumer) == (
            "cisegmentation",
            "analyze-cisegmentation-measurements",
            "omero-analysis-chat",
        )
        return FakePayload({"skill": {"name": skill_name}, "files": []})

    def refresh(self):
        self.refreshed = True

    def status(self):
        return {"version": "0.1.0"}


def test_catalog_and_package_adapters(monkeypatch):
    catalog = FakeCatalog()
    monkeypatch.setattr(views, "_workflow_skill_catalog", lambda: catalog)
    factory = RequestFactory()

    response = views.workflow_skills(
        factory.get("/api/workflow-skills/"),
        conn=object(),
    )
    assert response.status_code == 200
    assert b'"consumer": "omero-analysis-chat"' in response.content
    assert b'"version": "0.1.0"' in response.content

    response = views.workflow_skill_package(
        factory.get("/api/workflow-skills/cisegmentation/skill/"),
        "cisegmentation",
        "analyze-cisegmentation-measurements",
        conn=object(),
    )
    assert response.status_code == 200
    assert b"analyze-cisegmentation-measurements" in response.content


def test_refresh_is_admin_only(monkeypatch):
    catalog = FakeCatalog()
    monkeypatch.setattr(views, "_workflow_skill_catalog", lambda: catalog)
    factory = RequestFactory()

    denied = views.refresh_workflow_skills(
        factory.post("/api/workflow-skills/refresh/"),
        conn=SimpleNamespace(isAdmin=lambda: False),
    )
    assert denied.status_code == 403
    assert not catalog.refreshed

    allowed = views.refresh_workflow_skills(
        factory.post("/api/workflow-skills/refresh/"),
        conn=SimpleNamespace(isAdmin=lambda: True),
    )
    assert allowed.status_code == 200
    assert catalog.refreshed
