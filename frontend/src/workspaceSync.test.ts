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
    runs: [],
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
      "template-input:template-1"
    ]);
    expect(first.bytes.has("input-1")).toBe(false);
    expect(first.inventory.items.find(
      (item) => item.key === "template-input:template-1"
    )?.kind).toBe("template-input");
    expect(first.bytes.has("template-input:template-1")).toBe(true);
  });

  it("synchronizes direct reusable output while excluding identical Assistant output", async () => {
    const value = workspace();
    value.files.push({
      ...value.files[2],
      id: "result-2",
      chatId: undefined,
      methodId: "method-1",
      logicalPath: "/output/method/plot-copy.png"
    });

    const payload = await buildWorkspaceSyncPayload(value, context);
    const results = payload.inventory.items.filter((item) =>
      item.key.startsWith("result-content:")
    );
    expect(results).toHaveLength(1);
    expect(results[0].metadata).toMatchObject({
      sourceCount: 1,
      sources: [
        { fileId: "result-2", chatId: null, methodId: "method-1" }
      ]
    });
    expect(Array.from(payload.bytes.keys()).filter((key) =>
      key.startsWith("result-content:")
    )).toHaveLength(1);
  });

  it("links plot CSV inventory items to their synchronized PNG image", async () => {
    const value = workspace();
    value.files[2] = { ...value.files[2], chatId: undefined, methodId: "method-1" };
    value.files.push({
      ...value.files[2],
      id: "result-csv",
      name: "plot.csv",
      logicalPath: "/output/plot.csv",
      type: "text/csv",
      data: new TextEncoder().encode("group,value\na,1\n").buffer
    });

    const payload = await buildWorkspaceSyncPayload(value, context);
    const image = payload.inventory.items.find((item) => item.kind === "png-image")!;
    const csv = payload.inventory.items.find((item) =>
      item.kind === "result" && item.name === "plot.csv"
    )!;
    expect(csv.metadata.plotImageKeys).toEqual([image.key]);
  });

  it("canonicalizes object keys and detects a remote digest mismatch", () => {
    expect(canonicalJson({ z: 1, a: { y: 2, b: 3 } })).toBe(
      '{\n  "a": {\n    "b": 3,\n    "y": 2\n  },\n  "z": 1\n}\n'
    );
    expect(syncHasChanges("local", "remote")).toBe(true);
    expect(syncHasChanges("same", "same")).toBe(false);
  });

  it("always excludes Assistant conversations, attachments, and Assistant-owned results", async () => {
    const value = workspace();
    value.files.push({
      id: "attachment-1",
      workspaceId: value.workspace.id,
      chatId: "chat-1",
      name: "notes.txt",
      logicalPath: "/Chat/chat-1/Attachments/notes.txt",
      type: "text/plain",
      size: 5,
      sha256: "",
      source: "local",
      role: "chat-attachment",
      attachment: { origin: "url", sourceUrl: "https://secret.example/notes.txt" },
      state: "ready",
      data: new TextEncoder().encode("notes").buffer,
      createdAt: "2026-07-29T00:00:00Z"
    });
    const payload = await buildWorkspaceSyncPayload(value, context);
    expect(payload.inventory.items.some((item) => String(item.kind).startsWith("chat-")))
      .toBe(false);
    expect(payload.inventory.items.some((item) => item.kind === "png-image")).toBe(false);
    expect(JSON.stringify(payload.inventory)).not.toContain("secret.example");
  });
});
