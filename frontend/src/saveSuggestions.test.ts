import { visualSaveTitle } from "./saveSuggestions";
import type { ArtifactRecord, WorkspaceFile } from "./types";

const createdAt = "2026-07-28T08:00:00Z";

function file(id: string, name: string, type = "image/png"): WorkspaceFile {
  return {
    id,
    projectId: "project",
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
    projectId: "project",
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
