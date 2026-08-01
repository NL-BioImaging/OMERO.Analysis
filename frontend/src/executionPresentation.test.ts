import { describe, expect, it } from "vitest";
import { primaryExecutionForPrompt } from "./executionPresentation";
import type { AnalysisWorkspace, ExecutionRecord, WorkspaceFile } from "./types";

function run(id: string, createdAt: string, overrides: Partial<ExecutionRecord> = {}): ExecutionRecord {
  return {
    id, workspaceId: "workspace", chatId: "chat", promptId: "prompt",
    code: "result = 1", codeHash: id, cacheKey: id, status: "success",
    stdout: "", stderr: "", outputFileIds: [], missingPlotCsv: [], inputHashes: [],
    runtimeVersion: "test", model: "test", purpose: "analysis", createdAt,
    ...overrides
  };
}

function file(id: string, executionId: string): WorkspaceFile {
  return {
    id, workspaceId: "workspace", chatId: "chat", executionId,
    name: "plot.png", logicalPath: `/output/${id}.png`, type: "image/png",
    size: 1, sha256: id, source: "result", state: "ready", createdAt: "2026-01-01"
  };
}

describe("execution presentation", () => {
  it("keeps the output-producing run as the one reusable card", () => {
    const plotted = run("plotted", "2026-01-01T00:00:01Z", { outputFileIds: ["plot"] });
    const laterProbe = run("later", "2026-01-01T00:00:02Z");
    const workspace = {
      executions: [plotted, laterProbe], files: [file("plot", plotted.id)], artifacts: []
    } as unknown as AnalysisWorkspace;
    expect(primaryExecutionForPrompt(workspace, laterProbe)?.id).toBe("plotted");
  });

  it("does not present inspection-only work as a reusable analysis", () => {
    const inspection = run("inspection", "2026-01-01", { purpose: "inspection" });
    const workspace = {
      executions: [inspection], files: [], artifacts: []
    } as unknown as AnalysisWorkspace;
    expect(primaryExecutionForPrompt(workspace, inspection)).toBeNull();
  });
});
