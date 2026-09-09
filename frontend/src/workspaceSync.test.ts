import {
  buildWorkspaceSyncPayload,
  canonicalJson,
  syncHasChanges,
  withWorkspaceSyncStatus
} from "./workspaceSync";
import type { AnalysisWorkspace, OmeroContext, SyncStatus } from "./types";
import { unzipSync, strFromU8 } from "fflate";

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
    expect(first.contentDigest).toEqual(second.contentDigest);
    expect(first.inventory.items.map((item) => item.key)).toEqual([
      "template-input:template-1", "workspace-snapshot:workspace-1"
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

  it("links same-stem SVG inventory items to their synchronized PNG image", async () => {
    const value = workspace();
    value.files[2] = { ...value.files[2], chatId: undefined, methodId: "method-1" };
    value.files.push({
      ...value.files[2],
      id: "result-svg",
      name: "plot.svg",
      logicalPath: "/output/plot.svg",
      type: "image/svg+xml",
      data: new TextEncoder().encode("<svg xmlns=\"http://www.w3.org/2000/svg\"/>").buffer
    });

    const payload = await buildWorkspaceSyncPayload(value, context);
    const image = payload.inventory.items.find((item) => item.kind === "png-image")!;
    const svg = payload.inventory.items.find((item) =>
      item.kind === "result" && item.name === "plot.svg"
    )!;
    expect(svg.metadata.plotImageKeys).toEqual([image.key]);
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
    const snapshot = unzipSync(payload.bytes.get(`workspace-snapshot:${value.workspace.id}`)!);
    const manifest = JSON.parse(strFromU8(snapshot["workspace.json"]));
    expect(manifest.chats.every((chat: { messages: unknown[] }) => chat.messages.length === 0)).toBe(true);
    expect(JSON.stringify(manifest)).not.toContain("secret.example");
    const repeat = await buildWorkspaceSyncPayload({ ...value, workspace: {
      ...value.workspace, updatedAt: "2026-09-09T00:00:00Z", revision: 999
    } }, context);
    expect(repeat.contentDigest).toBe(payload.contentDigest);
  });

  it("merges sync metadata without restoring stale run state", () => {
    const latest = workspace();
    latest.runs = [{
      id: "run-1", workspaceId: latest.workspace.id, kind: "pipeline",
      artifactId: "pipeline-1", artifactName: "Pipeline", artifactVersion: 1,
      status: "success", executionIds: [], resolvedBindings: {}, steps: [],
      createdAt: "2026-08-05T12:00:00Z", completedAt: "2026-08-05T12:00:03Z"
    }];
    const synced: SyncStatus = {
      schema: "nl.bioimaging.analysis.sync.status.v1", canSync: true, reason: "",
      linked: true, projectId: 2, datasetId: 303, manifestAnnotationId: 1002,
      remoteRevision: 4, inventoryDigest: "remote", itemCount: 2
    };

    const merged = withWorkspaceSyncStatus(latest, synced, "2026-08-05T12:00:04Z");
    expect(merged.runs[0].status).toBe("success");
    expect(merged.workspace.omeroSync).toMatchObject({
      datasetId: 303,
      remoteRevision: 4,
      inventoryDigest: "remote"
    });
  });
  it("keeps large results out of recovery snapshots and retains Trash metadata", async () => {
    const value = workspace();
    const file = value.files.find(file => file.id === "result-1")!;
    file.methodId = "method-1";
    file.deletedAt = "2026-09-09T00:00:00Z";
    file.data = new Uint8Array(100_000).buffer;
    file.size = file.data.byteLength;
    const payload = await buildWorkspaceSyncPayload(value, { ...context, max_snapshot_bytes: 20_000 });
    const snapshot = unzipSync(payload.bytes.get(`workspace-snapshot:${value.workspace.id}`)!);
    const manifest = JSON.parse(strFromU8(snapshot["workspace.json"]));
    const restored = manifest.files.find((item: { id: string }) => item.id === file.id);
    expect(restored.deletedAt).toBe(file.deletedAt);
    expect(restored.remoteResult.size).toBe(100_000);
    expect(restored.remoteResult.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(Object.values(snapshot).every(bytes => bytes.length < 20_000)).toBe(true);
    const repeated = await buildWorkspaceSyncPayload({ ...value, files: value.files.map(item => item.id === file.id
      ? { ...item, data: undefined, remoteResult: restored.remoteResult } : item) }, { ...context, max_snapshot_bytes: 20_000 });
    expect(repeated.inventory.items.find(item => item.kind === "png-image")?.sha256).toBe(restored.remoteResult.sha256);
  });

});
