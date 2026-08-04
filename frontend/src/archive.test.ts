import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import { exportWorkspace, importWorkspace, WORKSPACE_FORMAT } from "./archive";
import { sha256 } from "./storage";
import type { AnalysisWorkspace, WorkspaceFile } from "./types";

function asArrayBuffer(value: Uint8Array): ArrayBuffer {
  return value.buffer.slice(
    value.byteOffset,
    value.byteOffset + value.byteLength
  ) as ArrayBuffer;
}

async function workspace(): Promise<AnalysisWorkspace> {
  const attached = new TextEncoder().encode("canonical OMERO input").buffer;
  const local = new TextEncoder().encode("local upload").buffer;
  const output = new TextEncoder().encode("result").buffer;
  const createdAt = "2026-07-26T12:00:00.000Z";
  const files: WorkspaceFile[] = [
    {
      id: "omero-file", workspaceId: "workspace", name: "measurements.duckdb",
      logicalPath: "OMERO/Screen-101--test/inputs/551--measurements.duckdb",
      type: "application/octet-stream", size: attached.byteLength,
      sha256: await sha256(attached), source: "omero", state: "ready", data: attached,
      annotationId: 551, fileId: 651, createdAt
    },
    {
      id: "local-file", workspaceId: "workspace", name: "groups.csv",
      logicalPath: "OMERO/Screen-101--test/inputs/groups.csv",
      type: "text/csv", size: local.byteLength, sha256: await sha256(local),
      source: "local", state: "ready", data: local, createdAt
    },
    {
      id: "output-file", workspaceId: "workspace", chatId: "chat", executionId: "execution",
      name: "plot.csv", logicalPath: "OMERO/Screen-101--test/chats/chat/outputs/plot.csv",
      type: "text/csv", size: output.byteLength, sha256: await sha256(output),
      source: "result", state: "ready", data: output, createdAt
    }
  ];
  return {
    workspace: {
      id: "workspace", contextKey: "7:4:Screen:101", rootPath: "OMERO/Screen-101--test",
      name: "Test", objectType: "Screen", objectId: 101, userId: 7, groupId: 4,
      activeChatId: "chat", plotCsv: true, createdAt, updatedAt: createdAt
    },
    chats: [{
      id: "chat", workspaceId: "workspace", title: "Analysis", summary: "",
      messages: [{ id: "prompt", role: "user", content: "Analyze", createdAt }],
      createdAt, updatedAt: createdAt
    }],
    files,
    executions: [{
      id: "execution", workspaceId: "workspace", chatId: "chat", promptId: "prompt",
      code: "result = 1", codeHash: "hash", cacheKey: "cache", status: "success",
      stdout: "", stderr: "", outputFileIds: ["output-file"], missingPlotCsv: [],
      inputHashes: files.slice(0, 2).map((file) => file.sha256), runtimeVersion: "runtime",
      model: "gpt-5", evidenceId: "evidence", createdAt
    }],
    runs: [{
      id: "run", workspaceId: "workspace", kind: "method", artifactId: "method",
      artifactName: "analysis.py", artifactVersion: 1, status: "success",
      executionIds: ["execution"], resolvedBindings: { "input.duckdb": "measurements.duckdb" },
      steps: [], createdAt, completedAt: createdAt
    }],
    methods: [],
    pipelines: [],
    notebooks: [],
    artifacts: [],
    audits: [],
    evidence: [{
      id: "evidence",
      workspaceId: "workspace",
      chatId: "chat",
      promptId: "prompt",
      executionId: "execution",
      kind: "navigation",
      status: "success",
      sourceHashes: files.slice(0, 2).map((file) => file.sha256),
      skillHashes: ["skill"],
      sourceSkillKey: "key",
      summary: "verified navigation",
      payload: "{}",
      createdAt
    }]
  };
}

describe("workspace archive", () => {
  it("references OMERO inputs while embedding local inputs and outputs", async () => {
    const source = await workspace();
    const archive = exportWorkspace(source, 1024 * 1024);
    const entries = unzipSync(archive.data);
    const paths = Object.keys(entries);
    expect(paths.some((path) => path.startsWith("Input/"))).toBe(true);
    expect(paths.some((path) => path.startsWith("Chat/"))).toBe(true);
    expect(paths.some((path) => path.includes("measurements.duckdb"))).toBe(false);
    const manifest = JSON.parse(strFromU8(entries["workspace.json"]));
    expect(manifest.format).toBe(WORKSPACE_FORMAT);
    expect(manifest.files.find((file: any) => file.id === "omero-file").archivePath).toBeUndefined();
    expect(JSON.stringify(manifest).toLowerCase()).not.toContain("apikey");

    const restored = await importWorkspace(archive.data.buffer as ArrayBuffer);
    expect(restored.workspace.id).not.toBe(source.workspace.id);
    expect(restored.files.find((file) => file.source === "omero")?.data).toBeUndefined();
    expect(restored.files.find((file) => file.source === "local")?.data).toBeInstanceOf(ArrayBuffer);
    expect(restored.evidence).toHaveLength(1);
    expect(restored.executions[0].evidenceId).toBe(restored.evidence[0].id);
    expect(restored.runs).toHaveLength(1);
    expect(restored.runs[0].executionIds).toEqual([restored.executions[0].id]);

    const rebound = await importWorkspace(archive.data.buffer as ArrayBuffer, {
      object_type: "Screen",
      object_id: 101,
      name: "Test",
      user_id: 99,
      group_id: 88,
      can_annotate: true,
      selected_attachments: []
    });
    expect(rebound.workspace.userId).toBe(99);
    expect(rebound.workspace.groupId).toBe(88);
    expect(rebound.workspace.contextKey).toContain("99:88:Screen:101:import:");
    expect(rebound.workspace.origin?.userId).toBe(7);
  });

  it("omits local inputs when they make the snapshot exceed its limit", async () => {
    const source = await workspace();
    const local = source.files.find((file) => file.source === "local")!;
    local.data = new Uint8Array(20_000).buffer;
    local.size = local.data.byteLength;
    local.sha256 = await sha256(local.data);
    const archive = exportWorkspace(source, 10_000);
    expect(archive.omittedLocalInputs).toEqual(["groups.csv"]);
    const manifest = JSON.parse(strFromU8(unzipSync(archive.data)["workspace.json"]));
    expect(manifest.files.find((file: any) => file.id === "local-file").state).toBe("missing");
  });

  it("stores Chat attachments under the Chat attachment path", async () => {
    const source = await workspace();
    const data = new TextEncoder().encode("attachment").buffer;
    source.files.push({
      id: "attachment", workspaceId: "workspace", chatId: "chat",
      name: "notes.txt", logicalPath: "Chat/chat/Attachments/notes.txt",
      type: "text/plain", size: data.byteLength, sha256: await sha256(data),
      source: "local", role: "chat-attachment", attachment: { origin: "upload" },
      state: "ready", data, createdAt: source.workspace.createdAt
    });
    const archive = exportWorkspace(source, 1024 * 1024);
    const paths = Object.keys(unzipSync(archive.data));
    expect(paths).toContain("Chat/chat/Attachments/attachment--notes.txt");
    const restored = await importWorkspace(archive.data.buffer as ArrayBuffer);
    const attachment = restored.files.find((file) => file.role === "chat-attachment");
    expect(attachment?.data).toBeInstanceOf(ArrayBuffer);
    expect(attachment?.chatId).toBe(restored.chats[0].id);
  });

  it("imports v1 archives as legacy Chat-owned history", async () => {
    const source = await workspace();
    const entries = unzipSync(exportWorkspace(source, 1024 * 1024).data);
    const manifest = JSON.parse(strFromU8(entries["workspace.json"]));
    manifest.version = 1;
    delete manifest.runs;
    const encoded = strToU8(JSON.stringify(manifest));
    const ArchiveUint8Array = entries["workspace.json"].constructor as Uint8ArrayConstructor;
    const replacement = new ArchiveUint8Array(encoded.byteLength);
    replacement.set(encoded);
    entries["workspace.json"] = replacement;
    const restored = await importWorkspace(asArrayBuffer(zipSync(entries)));
    expect(restored.runs).toEqual([]);
    expect(restored.executions[0].chatId).toBe(restored.chats[0].id);
    expect(restored.executions[0].runId).toBeUndefined();
  });

  it("rejects legacy Analysis Chat workspace snapshots", async () => {
    const source = await workspace();
    const entries = unzipSync(exportWorkspace(source, 1024 * 1024).data);
    const manifest = JSON.parse(strFromU8(entries["workspace.json"]));
    manifest.format = "nl.bioimaging.analysis-chat.workspace.v2";
    manifest.version = 3;
    const encodedManifest = strToU8(JSON.stringify(manifest));
    const ArchiveUint8Array = entries["workspace.json"].constructor as Uint8ArrayConstructor;
    const legacyManifest = new ArchiveUint8Array(encodedManifest.byteLength);
    legacyManifest.set(encodedManifest);
    const legacyEntries = {
      ...entries,
      "workspace.json": legacyManifest
    };
    const legacyArchive = zipSync(legacyEntries);
    await expect(importWorkspace(asArrayBuffer(legacyArchive)))
      .rejects.toThrow(/Unsupported OMERO Analysis Workspace format/);
  });

  it("rejects traversal paths, altered files, and credential fields", async () => {
    const source = await workspace();
    const archive = exportWorkspace(source, 1024 * 1024);
    const entries = unzipSync(archive.data);

    await expect(importWorkspace(asArrayBuffer(zipSync({
      ...entries,
      "../escape.txt": strToU8("unsafe")
    })))).rejects.toThrow(/Unsafe Workspace archive path/);

    const hashEntries = unzipSync(exportWorkspace(source, 1024 * 1024).data);
    const localPath = Object.keys(hashEntries).find((path) =>
      path.startsWith("Input/")
    )!;
    hashEntries[localPath][0] ^= 1;
    const alteredArchive = zipSync(hashEntries);
    await expect(importWorkspace(asArrayBuffer(alteredArchive))).rejects.toThrow(/Hash mismatch/);

    (source.workspace as any).preferences = { api_key: "must-not-be-imported" };
    const credentialArchive = exportWorkspace(source, 1024 * 1024);
    await expect(importWorkspace(asArrayBuffer(credentialArchive.data))).rejects.toThrow(/credential field/);

    const bomb = zipSync({ "workspace.json": strToU8("{}") });
    const view = new DataView(bomb.buffer, bomb.byteOffset, bomb.byteLength);
    for (let offset = 0; offset < bomb.length - 46; offset += 1) {
      if (view.getUint32(offset, true) === 0x02014b50) {
        view.setUint32(offset + 24, 600 * 1024 * 1024, true);
        break;
      }
    }
    await expect(importWorkspace(asArrayBuffer(bomb))).rejects.toThrow(/512 MiB/);
  });
});
