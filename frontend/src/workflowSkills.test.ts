import { expect, it } from "vitest";
import { matchWorkflowSkills, packageInstructions } from "./workflowSkills";
import type {
  WorkflowSkillCatalog,
  WorkflowSkillPackage,
  WorkspaceFile
} from "./types";

const skill = {
  workflow_key: "cisegmentation",
  name: "analyze-cisegmentation-measurements",
  description: "Analyze measurements",
  purpose: "attachment-analysis",
  consumers: ["omero-analysis"],
  version: "1",
  sha256: "abc",
  package_url: "/skills/cisegmentation/analyze/",
  match: {
    extensions: [".duckdb"],
    filename_globs: ["*measurements*.duckdb"],
    required_tables: ["schema_info", "measurement_runs"],
    auto_activate: true
  }
};

const source = {
  workflow_key: "cisegmentation",
  repository_url: "https://github.com/example/cisegmentation/tree/v1",
  configured_ref: "v1",
  resolved_commit: "1".repeat(40),
  skills_path: "_agents/skills",
  ref_kind: "tag"
};

const catalog: WorkflowSkillCatalog = {
  schema: "nl.bioimaging.omero-workflow-skills.v1",
  generated_at: "",
  consumer: "omero-analysis",
  config_hash: "config",
  workflows: [{ source, status: "ready", checked_at: "", skills: [skill] }],
  diagnostics: []
};

it("selects the strongest skill from file and schema evidence", () => {
  const file = {
    name: "cells_measurements.duckdb",
    state: "ready",
    deletedAt: undefined
  } as WorkspaceFile;
  const matches = matchWorkflowSkills(catalog, [file], [{
    path: "/input/cells_measurements.duckdb",
    format: "duckdb",
    size: 1,
    summary: { tables: ["schema_info", "measurement_runs"] }
  }]);
  expect(matches[0].score).toBe(11);
  expect(matches[0].skill.name).toBe(skill.name);
});

it("formats main instructions with immutable provenance and progressive references", () => {
  const value: WorkflowSkillPackage = {
    source,
    skill,
    files: [
      { path: "SKILL.md", media_type: "text/markdown", size: 10, sha256: "a", content: "# Use me" },
      { path: "references/REFERENCE.md", media_type: "text/markdown", size: 10, sha256: "b", content: "# Reference" }
    ]
  };
  const text = packageInstructions(value);
  expect(text).toContain("Resolved commit");
  expect(text).toContain("# Use me");
  expect(text).toContain("references/REFERENCE.md");
  expect(text).not.toContain("# Reference");
});

it("loads required references and capability contracts into the first-turn instructions", () => {
  const value: WorkflowSkillPackage = {
    source,
    skill: {
      ...skill,
      required_resources: ["references/REFERENCE.md"],
      required_capabilities: ["zarr-render-v2", "zarr-gallery-v1"]
    },
    files: [
      { path: "SKILL.md", media_type: "text/markdown", size: 10, sha256: "a", content: "# Use me" },
      { path: "references/REFERENCE.md", media_type: "text/markdown", size: 10, sha256: "b", content: "# Canonical queries" }
    ]
  };
  const text = packageInstructions(value);
  expect(text).toContain("# Canonical queries");
  expect(text).toContain("zarr-render-v2");
  expect(text).toContain("zarr-gallery-v1");
});
