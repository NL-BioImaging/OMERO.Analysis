import { describe, expect, it } from "vitest";
import { plotGroups } from "./plotGroups";
import type { WorkspaceFile } from "./types";

function file(id: string, extension: string, executionId = "exec", folder = "/output"): WorkspaceFile {
  return { id, workspaceId: "w", name: `plot.${extension}`, logicalPath: `${folder}/plot.${extension}`,
    executionId, runId: "run", source: "result", type: extension === "svg" ? "image/svg+xml" : extension === "png" ? "image/png" : "text/csv",
    size: 1, sha256: id, state: "ready", createdAt: "now" };
}

describe("plot companions", () => {
  it("prefers PNG and retains SVG and CSV regardless of input order", () => {
    const result = plotGroups([file("svg", "svg"), file("csv", "csv"), file("png", "png")]);
    expect(result).toHaveLength(1);
    expect(result[0].preview.id).toBe("png");
    expect(result[0].files.map(f => f.id).sort()).toEqual(["csv", "png", "svg"]);
  });
  it("keeps SVG-only, different directories, and different executions visible", () => {
    expect(plotGroups([file("a", "svg"), file("b", "png", "other"), file("c", "png", "exec", "/other")])).toHaveLength(3);
  });
  it("never uses a trashed PNG to hide a surviving SVG", () => {
    expect(plotGroups([{ ...file("a", "png"), deletedAt: "now" }, file("b", "svg")])[0].preview.id).toBe("b");
  });
});
