import { toolErrorText, toolResultText } from "./api";
import {
  BASE_URL,
  CHAT_URL,
  PROVIDER_NAME,
  SYSTEM_PROMPT,
  TEMPERATURE,
  TOOLS
} from "./constants";

describe("AmsterdamUMC provider", () => {
  it("keeps the exact endpoint contract and fixed temperature", () => {
    expect(PROVIDER_NAME).toBe("AmsterdamUMC");
    expect(BASE_URL).toBe(
      "https://aumc-aicode-openai-swedencentral-oai.openai.azure.com/openai/v1"
    );
    expect(CHAT_URL).toBe(`${BASE_URL}/chat/completions`);
    expect(TEMPERATURE).toBe(1);
  });

  it("exposes bounded analysis and user-approved saved-script tools", () => {
    expect(TOOLS.map((tool) => tool.function.name)).toEqual([
      "discover_skills",
      "load_skill",
      "list_workspace_files",
      "run_python",
      "reset_python",
      "list_saved_scripts",
      "read_saved_script",
      "run_saved_script",
      "list_saved_workflows",
      "run_saved_workflow"
    ]);
  });

  it("instructs the model to repair tool errors with the available local stack", () => {
    expect(SYSTEM_PROMPT).toContain("Tool failures are observations");
    expect(SYSTEM_PROMPT).toContain("seaborn");
    expect(SYSTEM_PROMPT).toContain("administrator-approved, revision-pinned skills");
    expect(SYSTEM_PROMPT).toContain("without waiting for the user to ask");
    expect(SYSTEM_PROMPT).toMatch(
      /Never print, preview, encode, or return a complete source\s+file/
    );
    const payload = toolErrorText(new Error("ModuleNotFoundError: missing"));
    expect(payload).toContain("call run_python again");
    expect(payload).toContain("available_packages");
    expect(payload.length).toBeLessThanOrEqual(64 * 1024 + 30);
  });

  it("never forwards local stdout or generated file contents to Azure", () => {
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
