import { buildWorkspaceSyncPayload, canonicalJson, syncHasChanges } from "./workspaceSync";
import type { AnalysisWorkspace, OmeroContext } from "./types";

const context: OmeroContext = {
  object_type: "Screen",
  object_id: 151,
  name: "2DWellTestZarr",
  user_id: 7,
  group_id: 4,
  can_annotate: true,
  selected_attachments: []
};

function workspace(): AnalysisWorkspace {
  return {
    workspace: {
      id: "workspace-1",
      userId: 7,
      groupId: 4,
      objectType: "Screen",
      objectId: 151,
      contextKey: "7:4:Screen:151",
      name: "Screen analysis",
      rootPath: "OMERO/Screen-151",
      activeChatId: "chat-1",
      plotCsv: true,
      createdAt: "2026-07-29T00:00:00Z",
      updatedAt: "2026-07-29T00:00:00Z"
    },
    chats: [{
      id: "chat-1",
      workspaceId: "workspace-1",
      title: "Cells",
      summary: "",
      archived: false,
      messages: [],
      pinnedMessageIds: [],
      createdAt: "2026-07-29T00:00:00Z",
      updatedAt: "2026-07-29T00:00:00Z"
    }],
    files: [{
      id: "input-1",
      workspaceId: "workspace-1",
      name: "measurements.duckdb",
      logicalPath: "/input/measurements.duckdb",
      type: "application/vnd.duckdb",
      size: 3,
      sha256: "input",
      source: "omero",
      state: "ready",
      data: new Uint8Array([1, 2, 3]).buffer,
      createdAt: "2026-07-29T00:00:00Z"
    }, {
      id: "template-1",
      workspaceId: "workspace-1",
      name: "plate-analysis-TEMPLATE.csv",
      logicalPath: "/input/plate-analysis-TEMPLATE.csv",
      type: "text/csv",
      size: 3,
      sha256: "template",
      source: "local",
      state: "ready",
      data: new Uint8Array([7, 8, 9]).buffer,
      createdAt: "2026-07-29T00:00:00Z"
    }, {
      id: "result-1",
      workspaceId: "workspace-1",
      chatId: "chat-1",
      name: "plot.png",
      logicalPath: "/output/plot.png",
      type: "image/png",
      size: 4,
      sha256: "",
      source: "result",
      state: "ready",
      data: new Uint8Array([4, 5, 6, 7]).buffer,
      createdAt: "2026-07-29T00:00:00Z"
    }],
    executions: [],
    methods: [],
    pipelines: [],
    notebooks: [],
    artifacts: [],
    audits: [],
    evidence: []
  };
}

describe("Workspace synchronization inventory", () => {
  it("is deterministic, excludes ordinary inputs, and includes template-named inputs", async () => {
    const first = await buildWorkspaceSyncPayload(workspace(), context);
    const second = await buildWorkspaceSyncPayload(workspace(), context);
    expect(first.inventory).toEqual(second.inventory);
    expect(first.inventory.items.map((item) => item.key)).toEqual([
      "chat:chat-1:json",
      "chat:chat-1:markdown",
      "result:result-1",
      "template-input:template-1"
    ]);
    expect(first.inventory.items.find((item) => item.key === "result:result-1")?.kind)
      .toBe("png-image");
    expect(first.bytes.has("input-1")).toBe(false);
    expect(first.inventory.items.find(
      (item) => item.key === "template-input:template-1"
    )?.kind).toBe("template-input");
    expect(first.bytes.has("template-input:template-1")).toBe(true);
  });

  it("canonicalizes object keys and detects a remote digest mismatch", () => {
    expect(canonicalJson({ z: 1, a: { y: 2, b: 3 } })).toBe(
      '{\n  "a": {\n    "b": 3,\n    "y": 2\n  },\n  "z": 1\n}\n'
    );
    expect(syncHasChanges("local", "remote")).toBe(true);
    expect(syncHasChanges("same", "same")).toBe(false);
  });
});
