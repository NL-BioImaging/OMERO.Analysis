import {
  visualSaveTitle,
  withoutSupersededOutputRuns
} from "./saveSuggestions";
import type {
  ArtifactRecord,
  ExecutionRecord,
  WorkspaceFile
} from "./types";

const createdAt = "2026-07-28T08:00:00Z";

function file(id: string, name: string, type = "image/png"): WorkspaceFile {
  return {
    id,
    workspaceId: "workspace",
    chatId: "chat",
    name,
    logicalPath: `OMERO/Image-1/outputs/${name}`,
    type,
    size: 1,
    sha256: id,
    source: "result",
    state: "ready",
    data: new ArrayBuffer(1),
    createdAt
  };
}

function artifact(value: Partial<ArtifactRecord>): ArtifactRecord {
  return {
    id: value.id || "artifact",
    workspaceId: "workspace",
    chatId: "chat",
    kind: value.kind || "plot",
    title: value.title || "",
    pinned: false,
    createdAt: value.createdAt || createdAt,
    ...value
  };
}

describe("visual save suggestions", () => {
  it("uses a rendered viewer title instead of the chat question", () => {
    expect(visualSaveTitle([
      artifact({
        id: "render",
        kind: "viewer-preview",
        promptId: "prompt",
        fileId: "png",
        title: "Top 8 cells with nuclei background"
      })
    ], [file("png", "top-8.png")], {
      chatId: "chat",
      promptId: "prompt"
    })).toBe("Top 8 cells with nuclei background");
  });

  it("turns a generated PNG filename into a readable title", () => {
    expect(visualSaveTitle([
      artifact({
        executionId: "execution",
        fileId: "png",
        title: "plate-focus-review-candidates.png"
      })
    ], [file("png", "plate-focus-review-candidates.png")], {
      chatId: "chat",
      executionIds: ["execution"]
    })).toBe("Plate focus review candidates");
  });

  it("ignores unrelated and non-image artifacts", () => {
    expect(visualSaveTitle([
      artifact({
        executionId: "other",
        fileId: "csv",
        title: "ranking.csv"
      })
    ], [file("csv", "ranking.csv", "text/csv")], {
      chatId: "chat",
      executionIds: ["execution"]
    })).toBeNull();
  });
});

describe("superseded output runs", () => {
  function execution(
    id: string,
    createdAt: string,
    outputFileIds: string[]
  ): ExecutionRecord {
    return {
      id, workspaceId: "workspace", chatId: "chat", promptId: "prompt",
      code: `# ${id}`, codeHash: id, cacheKey: id, status: "success",
      stdout: "", stderr: "", outputFileIds, missingPlotCsv: [],
      inputHashes: [], runtimeVersion: "runtime", model: "model", createdAt
    };
  }

  it("keeps the later complete Plot + CSV run and drops its PNG-only predecessor", () => {
    const png1 = file("png-1", "heatmap.png");
    const png2 = file("png-2", "heatmap.png");
    const csv = file("csv", "heatmap.csv", "text/csv");
    const first = execution("first", "2026-07-30T10:00:00Z", [png1.id]);
    const corrected = execution(
      "corrected",
      "2026-07-30T10:00:01Z",
      [png2.id, csv.id]
    );
    expect(withoutSupersededOutputRuns(
      [first, corrected],
      [png1, png2, csv]
    ).map((item) => item.id)).toEqual(["corrected"]);
  });

  it("keeps distinct sequential analysis steps", () => {
    const table = file("table", "summary.csv", "text/csv");
    const plot = file("plot", "heatmap.png");
    const first = execution("first", "2026-07-30T10:00:00Z", [table.id]);
    const second = execution("second", "2026-07-30T10:00:01Z", [plot.id]);
    expect(withoutSupersededOutputRuns(
      [first, second],
      [table, plot]
    ).map((item) => item.id)).toEqual(["first", "second"]);
  });

  it("detects an identical rewritten plot from declared output paths", () => {
    const png = file("png", "heatmap.png");
    const csv = file("csv", "heatmap.csv", "text/csv");
    const first = {
      ...execution("first", "2026-07-30T10:00:00Z", [png.id]),
      code: 'plt.savefig("/output/heatmap.png")'
    };
    const corrected = {
      ...execution("corrected", "2026-07-30T10:00:01Z", [csv.id]),
      code: [
        'frame.to_csv("/output/heatmap.csv")',
        'plt.savefig("/output/heatmap.png")'
      ].join("\n")
    };
    expect(withoutSupersededOutputRuns(
      [first, corrected],
      [png, csv]
    ).map((item) => item.id)).toEqual(["corrected"]);
  });
});
