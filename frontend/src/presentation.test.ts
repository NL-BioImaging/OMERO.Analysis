import {
  activityText,
  executionActivityText,
  formatDuration,
  projectRowClassName,
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

describe("browser-local project selection", () => {
  it("selects the clicked project independently from the open project", () => {
    expect(projectRowClassName("imported", "imported", "older")).toBe(
      "browser-row project-row open"
    );
    expect(projectRowClassName("older", "imported", "older")).toBe(
      "browser-row project-row selected"
    );
  });
});

describe("workflow-skill tooltip", () => {
  const catalog = {
    schema: "nl.bioimaging.omero-workflow-skills.v1",
    consumer: "omero-analysis-chat",
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
        consumers: ["omero-analysis-chat"],
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
      "Workflow guidance is using an unchanged cached revision.",
      ["cisegmentation/analyze-measurements"]
    );
    expect(tooltip).toContain("Warning: Workflow guidance");
    expect(tooltip).toContain("✓ cisegmentation: analyze-measurements v1");
    expect(tooltip).not.toContain("Workflow-specific guidance is unavailable");
  });

  it("explains an empty catalog", () => {
    expect(workflowSkillTooltip(
      { ...catalog, workflows: [] },
      "",
      []
    )).toContain("No workflow skills are currently available");
  });
});
