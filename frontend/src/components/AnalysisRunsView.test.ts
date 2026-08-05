import { describe, expect, it } from "vitest";
import type { ExecutionRecord, WorkspaceFile } from "../types";
import { supplementalRunImages } from "./AnalysisRunsView";

const createdAt = "2026-08-05T12:00:00Z";

function execution(outputFileIds: string[]): ExecutionRecord {
  return {
    id: "execution", workspaceId: "workspace", runId: "run", code: "", codeHash: "hash",
    cacheKey: "cache", status: "reused", stdout: "", stderr: "", outputFileIds,
    missingPlotCsv: [], inputHashes: [], runtimeVersion: "test", model: "test", createdAt
  };
}

function image(id: string, sha256: string): WorkspaceFile {
  return {
    id, workspaceId: "workspace", runId: "run", name: `${id}.png`,
    logicalPath: `/output/${id}.png`, type: "image/png", size: 3, sha256,
    source: "result", state: "ready", data: new Uint8Array([1, 2, 3]).buffer, createdAt
  };
}

describe("supplemental Pipeline run images", () => {
  it("returns restored run images that no execution file ID claims", () => {
    const displayed = image("displayed", "displayed-content");
    const restored = image("restored", "restored-content");
    expect(supplementalRunImages(
      [execution([displayed.id])], [restored], [displayed, restored]
    )).toEqual([restored]);
  });

  it("does not duplicate an image restored under another file ID", () => {
    const displayed = image("displayed", "same-content");
    const alias = image("alias", "same-content");
    expect(supplementalRunImages(
      [execution([displayed.id])], [alias], [displayed, alias]
    )).toEqual([]);
  });
});
