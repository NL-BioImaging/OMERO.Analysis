import { evidenceLinks } from "./evidencePresentation";
import type { AnalysisWorkspace, ExecutionRecord, WorkspaceFile } from "./types";

function execution(id: string, outputFileIds: string[], createdAt: string): ExecutionRecord {
  return {
    id,
    workspaceId: "workspace",
    chatId: "chat",
    promptId: "prompt",
    code: "result = 1",
    codeHash: id,
    cacheKey: id,
    status: "success",
    stdout: "",
    stderr: "",
    outputFileIds,
    missingPlotCsv: [],
    inputHashes: [],
    runtimeVersion: "test",
    model: "test",
    purpose: "analysis",
    createdAt
  };
}

function file(id: string, name: string, sha256: string, type: string): WorkspaceFile {
  return {
    id,
    workspaceId: "workspace",
    chatId: "chat",
    executionId: "final",
    name,
    logicalPath: `/output/${name}`,
    type,
    size: 10,
    sha256,
    source: "result",
    state: "ready",
    createdAt: "2026-08-01T12:00:00Z"
  };
}

describe("evidenceLinks", () => {
  it("shows the final execution and removes duplicate result bytes", () => {
    const duplicate = file("old-plot", "old.png", "same-image", "image/png");
    const plot = file("plot", "heatmap.png", "same-image", "image/png");
    const csv = file("csv", "heatmap.csv", "table", "text/csv");
    const workspace = {
      executions: [
        execution("old", [duplicate.id], "2026-08-01T12:00:00Z"),
        execution("final", [plot.id, csv.id], "2026-08-01T12:01:00Z")
      ],
      files: [duplicate, plot, csv],
      artifacts: []
    } as Pick<AnalysisWorkspace, "executions" | "files" | "artifacts">;

    expect(evidenceLinks(workspace, ["old", "final"])).toEqual([
      expect.objectContaining({ fileId: "plot", label: "Image: heatmap.png" }),
      expect.objectContaining({ fileId: "csv", label: "Data: heatmap.csv" })
    ]);
  });

  it("does not create inactive buttons for an inspection without a result file", () => {
    const inspection = {
      ...execution("inspection", [], "2026-08-01T12:00:00Z"),
      purpose: "inspection" as const
    };
    expect(evidenceLinks({ executions: [inspection], files: [], artifacts: [] }, [inspection.id]))
      .toEqual([]);
  });
});
