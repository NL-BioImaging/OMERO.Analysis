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
    const result = first.inventory.items.find((item) =>
      item.key.startsWith("result-content:png-image:")
    );
    expect(first.inventory).toEqual(second.inventory);
    expect(first.inventory.items.map((item) => item.key)).toEqual(expect.arrayContaining([
      "chat:chat-1:json",
      "chat:chat-1:markdown",
      "template-input:template-1"
    ]));
    expect(result?.kind).toBe("png-image");
    expect(result?.metadata).toMatchObject({
      contentAddressed: true,
      sourceCount: 1,
      sources: [{ fileId: "result-1", chatId: "chat-1" }]
    });
    expect(first.bytes.has("input-1")).toBe(false);
    expect(first.inventory.items.find(
      (item) => item.key === "template-input:template-1"
    )?.kind).toBe("template-input");
    expect(first.bytes.has("template-input:template-1")).toBe(true);
  });

  it("synchronizes identical output bytes once and records every origin", async () => {
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
      sourceCount: 2,
      sources: [
        { fileId: "result-1", chatId: "chat-1", methodId: null },
        { fileId: "result-2", chatId: null, methodId: "method-1" }
      ]
    });
    expect(Array.from(payload.bytes.keys()).filter((key) =>
      key.startsWith("result-content:")
    )).toHaveLength(1);
  });

  it("links plot CSV inventory items to their synchronized PNG image", async () => {
    const value = workspace();
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

  it("keeps Chat attachments out by default and emits originals when enabled", async () => {
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
    const excluded = await buildWorkspaceSyncPayload(value, context);
    expect(excluded.inventory.items.some((item) => item.kind === "chat-attachment")).toBe(false);
    const included = await buildWorkspaceSyncPayload(value, context, {
      includeChatAttachments: true
    });
    const item = included.inventory.items.find((entry) => entry.kind === "chat-attachment");
    expect(item).toMatchObject({
      key: "chat-attachment:attachment-1",
      logicalPath: "Chat/cells/Attachments/notes.txt",
      metadata: { fileId: "attachment-1", chatId: "chat-1", origin: "url" }
    });
    expect(JSON.stringify(item)).not.toContain("secret.example");
    expect(new TextDecoder().decode(included.bytes.get(item!.key))).toBe("notes");
  });

  it("keeps managed item identities stable when a Chat folder is renamed", async () => {
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
      attachment: { origin: "upload" },
      state: "ready",
      data: new TextEncoder().encode("notes").buffer,
      createdAt: "2026-07-29T00:00:00Z"
    });
    const before = await buildWorkspaceSyncPayload(value, context, {
      includeChatAttachments: true
    });

    value.chats[0] = {
      ...value.chats[0],
      title: "Renamed cells",
      titleEdited: true,
      updatedAt: "2026-07-30T00:00:00Z"
    };
    const after = await buildWorkspaceSyncPayload(value, context, {
      includeChatAttachments: true
    });

    const trackedKeys = [
      "chat:chat-1:json",
      "chat:chat-1:markdown",
      "chat-attachment:attachment-1"
    ];
    expect(after.inventory.items.filter((item) => trackedKeys.includes(item.key))
      .map((item) => item.key)).toEqual(expect.arrayContaining(trackedKeys));
    expect(after.inventory.items.find((item) =>
      item.key === "chat:chat-1:json"
    )?.logicalPath).toBe("Chat/renamed-cells/chat.json");
    expect(after.inventory.items.find((item) =>
      item.key === "chat-attachment:attachment-1"
    )?.logicalPath).toBe("Chat/renamed-cells/Attachments/notes.txt");
    expect(before.inventory.items.find((item) =>
      item.key === "chat-attachment:attachment-1"
    )?.sha256).toBe(after.inventory.items.find((item) =>
      item.key === "chat-attachment:attachment-1"
    )?.sha256);
  });

  it("adds a single managed restore snapshot when Workspace sync is enabled", async () => {
    const data = new Uint8Array([80, 75, 3, 4]);
    const payload = await buildWorkspaceSyncPayload(workspace(), context, {
      workspaceSnapshot: {
        name: "screen-analysis.oa-workspace.zip",
        data,
        omittedLocalInputs: ["large.duckdb"]
      }
    });
    const snapshot = payload.inventory.items.find(
      (item) => item.kind === "workspace-snapshot"
    );
    expect(snapshot).toMatchObject({
      key: "workspace-snapshot:workspace-1",
      mimetype: "application/zip",
      metadata: {
        workspaceId: "workspace-1",
        omittedLocalInputs: ["large.duckdb"]
      }
    });
    expect(payload.bytes.get(snapshot!.key)).toEqual(data);
  });
});
