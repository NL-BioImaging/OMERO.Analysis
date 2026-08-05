import { toolErrorText, toolResultText } from "./api";
import {
  SYSTEM_PROMPT,
  TEMPERATURE,
  TOOLS
} from "./constants";

describe("generic AI provider", () => {
  it("keeps the analysis temperature contract", () => {
    expect(TEMPERATURE).toBe(1);
  });

  it("exposes bounded Method-authoring tools without saved-artifact runners", () => {
    expect(TOOLS.map((tool) => tool.function.name)).toEqual([
      "discover_skills",
      "load_skill",
      "list_workspace_files",
      "request_user_choice",
      "run_python",
      "reset_python",
      "list_saved_methods",
      "read_saved_method",
      "list_saved_pipelines"
    ]);
    expect(SYSTEM_PROMPT).toContain("Do not execute saved Methods or Pipelines from Chat");
  });

  it("supports blocking user choices without exposing private reasoning", () => {
    const choiceTool = TOOLS.find(
      (tool) => tool.function.name === "request_user_choice"
    );
    expect(choiceTool).toBeDefined();
    expect(SYSTEM_PROMPT).toContain("genuinely blocking choice");
    expect(SYSTEM_PROMPT).toContain("never hidden private");
  });

  it("instructs the model to repair tool errors with the available local stack", () => {
    expect(SYSTEM_PROMPT).toContain("Tool failures are observations");
    expect(SYSTEM_PROMPT).toContain("seaborn");
    expect(SYSTEM_PROMPT).toContain("administrator-approved, revision-pinned skills");
    expect(SYSTEM_PROMPT).toContain("without waiting for the user to ask");
    expect(SYSTEM_PROMPT).toMatch(
      /Never print, preview, encode,[\s\S]*return a complete input data file/
    );
    expect(SYSTEM_PROMPT).toContain("one complete, reusable Python Method");
    expect(SYSTEM_PROMPT).toContain("## Summary");
    expect(SYSTEM_PROMPT).toContain("## Review");
    expect(SYSTEM_PROMPT).toContain("## Recommendations");
    expect(SYSTEM_PROMPT).toContain("## Reusable Method");
    expect(SYSTEM_PROMPT).toContain("first inspect sheet names, columns, dtypes");
    expect(SYSTEM_PROMPT).toContain("stop tool use and deliver the Method");
    const payload = toolErrorText(new Error("ModuleNotFoundError: missing"));
    expect(payload).toContain("call run_python again");
    expect(payload).toContain("available_packages");
    expect(payload.length).toBeLessThanOrEqual(64 * 1024 + 30);
  });

  it("requires Python calls to distinguish AI inspection from user analysis", () => {
    const runPython = TOOLS.find(
      (tool) => tool.function.name === "run_python"
    ) as (typeof TOOLS)[number] & {
      function: {
        parameters: {
          required: readonly string[];
          properties: { purpose: { enum: readonly string[] } };
        };
      };
    };
    expect(runPython?.function.parameters.required).toEqual(["code", "purpose"]);
    expect(runPython?.function.parameters.properties.purpose.enum).toEqual([
      "inspection",
      "analysis"
    ]);
    expect(SYSTEM_PROMPT).toContain('purpose="inspection"');
    expect(SYSTEM_PROMPT).toContain('purpose="analysis"');
  });

  it("never forwards local stdout or generated file contents to the AI provider", () => {
    const payload = toolResultText({
      stdout: "CANARY COMPLETE SOURCE FILE",
      stderr: "",
      preview: "local-only preview",
      modelPayload: {
        preview: { kind: "table", data: { columns: ["count"], data: [[3]] } },
        generatedFiles: [{ name: "result.csv", size: 10, type: "text/csv" }],
        truncated: false
      },
      files: [{
        name: "result.csv",
        type: "text/csv",
        data: new TextEncoder().encode("secret rows").buffer
      }]
    });
    expect(payload).not.toContain("CANARY");
    expect(payload).not.toContain("secret rows");
    expect(payload).toContain("result.csv");
  });
});
