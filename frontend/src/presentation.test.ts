import {
  activityText,
  executionActivityText,
  formatDuration,
  workspaceRowClassName,
  workflowSkillTooltip
} from "./presentation";
import type { WorkflowSkillCatalog } from "./types";

describe("chat timing presentation", () => {
  it("formats short and long elapsed times", () => {
    expect(formatDuration(850)).toBe("0.8 sec");
    expect(formatDuration(12_400)).toBe("12 sec");
    expect(formatDuration(75_000)).toBe("1 min 15 sec");
    expect(activityText("thought", 2_400)).toBe("Thought for 2.4 sec");
    expect(activityText("worked", 12_400)).toBe("Worked for 12 sec");
  });

  it("identifies internal inspection timing", () => {
    expect(executionActivityText("inspection", 1_250)).toBe(
      "Worked for 1.3 sec · for AI data inspection"
    );
  });
});

describe("browser-local workspace selection", () => {
  it("selects the clicked workspace independently from the open workspace", () => {
    expect(workspaceRowClassName("imported", "imported", "older")).toBe(
      "browser-row workspace-row open"
    );
    expect(workspaceRowClassName("older", "imported", "older")).toBe(
      "browser-row workspace-row selected"
    );
  });
});

describe("measurement-skill tooltip", () => {
  const catalog = {
    schema: "nl.bioimaging.omero-workflow-skills.v1",
    consumer: "omero-analysis",
    generated_at: "2026-07-27T00:00:00Z",
    config_hash: "config",
    workflows: [{
      source: {
        workflow_key: "cisegmentation",
        repository_url: "https://github.com/example/cisegmentation",
        configured_ref: "v1.2.3",
        resolved_commit: "1234567890abcdef",
        skills_path: "_agents/skills",
        ref_kind: "tag"
      },
      status: "ready",
      checked_at: "2026-07-27T00:00:00Z",
      skills: [{
        workflow_key: "cisegmentation",
        name: "analyze-measurements",
        description: "Analyze measurements",
        version: "1",
        purpose: "attachment-analysis",
        consumers: ["omero-analysis"],
        sha256: "abc",
        package_url: "/skills/package/",
        match: {
          auto_activate: true,
          extensions: [".duckdb"],
          filename_globs: ["*measurements*.duckdb"],
          required_tables: []
        }
      }]
    }],
    diagnostics: []
  } satisfies WorkflowSkillCatalog;

  it("lists discovered skills and marks current matches", () => {
    expect(workflowSkillTooltip(
      catalog,
      "",
      ["cisegmentation/analyze-measurements"]
    )).toContain("✓ cisegmentation: analyze-measurements v1");
  });

  it("keeps catalog skills visible when a non-fatal warning is present", () => {
    const tooltip = workflowSkillTooltip(
      catalog,
      "Measurement guidance is using an unchanged cached revision.",
      ["cisegmentation/analyze-measurements"]
    );
    expect(tooltip).toContain("Warning: Measurement guidance");
    expect(tooltip).toContain("✓ cisegmentation: analyze-measurements v1");
    expect(tooltip).not.toContain("Measurement-specific guidance is unavailable");
  });

  it("explains an empty catalog", () => {
    expect(workflowSkillTooltip(
      { ...catalog, workflows: [] },
      "",
      []
    )).toContain("No measurement skills are currently available");
  });
});
