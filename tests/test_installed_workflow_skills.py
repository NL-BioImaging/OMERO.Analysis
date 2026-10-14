"""Exercise Analysis HTTP adapters with the released provider, not a fake catalog."""
import json
import os

import pytest
from django.test import RequestFactory

from omero_analysis import views

pytestmark = pytest.mark.skipif(
    os.environ.get("WORKFLOW_SKILLS_RUN_INTEGRATION") != "1",
    reason="Set WORKFLOW_SKILLS_RUN_INTEGRATION=1 with WorkflowSkills installed",
)


def test_installed_provider_catalog_and_stateless_package(monkeypatch, tmp_path):
    from biomero_workflow_skills import WorkflowSkillCatalog
    from biomero_workflow_skills.github import RepositoryLocation, ResolvedRepository

    skill = "analyze-example-measurements"
    manifest = {
        "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
        "name": "example-workflow", "version": "1.0.0",
        "extensions": {"nl.bioimaging.biomero": {"skills": {skill: {
            "purpose": "attachment-analysis", "consumers": ["omero-analysis"],
            "preferred_capabilities": ["omero-data-query-v1"],
        }}}},
    }
    text = f"---\nname: {skill}\ndescription: Analyze example measurements.\n---\n\n# Analysis\nUse the measurement inputs.\n"

    class Repository:
        def resolve_repository(self, url):
            return ResolvedRepository(
                RepositoryLocation("example", "workflow", "v1.0.0", ""),
                "a" * 40, "tag",
            )

        def list_directory(self, source, path):
            if path == "skills":
                return [{"name": skill, "type": "dir"}]
            if path == f"skills/{skill}":
                return [{"name": "SKILL.md", "type": "file"}]
            return []

        def read_file(self, source, path):
            if path == "plugin.json":
                return json.dumps(manifest).encode()
            assert path == f"skills/{skill}/SKILL.md"
            return text.encode()

    config = tmp_path / "slurm-config.ini"
    config.write_text("[WORKFLOWS]\nexample=example\nexample_repo=https://github.com/example/workflow/tree/v1.0.0\n")
    # Each request creates a new provider instance, as the production adapter does.
    monkeypatch.setattr(views, "_workflow_skill_catalog", lambda: WorkflowSkillCatalog(
        config_path=config, cache_dir=tmp_path / "cache", github=Repository(),
    ))
    factory = RequestFactory()
    response = views.workflow_skills(factory.get("/api/workflow-skills/"), conn=object())
    assert response.status_code == 200
    catalog = json.loads(response.content)
    assert catalog["schema"] == "nl.bioimaging.biomero-workflow-skills.v2"
    entry = catalog["workflows"][0]
    assert entry["status"] == "ready", json.dumps(catalog)
    summary = entry["skills"][0]
    assert summary["preferred_capabilities"] == ["omero-data-query-v1"]
    assert summary["package_url"] == f"/api/workflow-skills/example/{skill}/"

    response = views.workflow_skill_package(
        factory.get(summary["package_url"]), "example", skill, conn=object(),
    )
    assert response.status_code == 200, response.content
    package = json.loads(response.content)
    assert package["source"]["resolved_commit"] == "a" * 40
    assert package["skill"]["name"] == skill
    assert package["files"][0]["path"] == "SKILL.md"
    assert package["files"][0]["content"] == text
