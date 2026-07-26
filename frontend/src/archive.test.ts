import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import { exportProject, importProject, PROJECT_FORMAT } from "./archive";
import { sha256 } from "./storage";
import type { ProjectWorkspace, WorkspaceFile } from "./types";

function asArrayBuffer(value: Uint8Array): ArrayBuffer {
  return value.buffer.slice(
    value.byteOffset,
    value.byteOffset + value.byteLength
  ) as ArrayBuffer;
}

async function workspace(): Promise<ProjectWorkspace> {
  const attached = new TextEncoder().encode("canonical OMERO input").buffer;
  const local = new TextEncoder().encode("local upload").buffer;
  const output = new TextEncoder().encode("result").buffer;
  const createdAt = "2026-07-26T12:00:00.000Z";
  const files: WorkspaceFile[] = [
    {
      id: "omero-file", projectId: "project", name: "measurements.duckdb",
      logicalPath: "OMERO/Screen-101--test/inputs/551--measurements.duckdb",
      type: "application/octet-stream", size: attached.byteLength,
      sha256: await sha256(attached), source: "omero", state: "ready", data: attached,
      annotationId: 551, fileId: 651, createdAt
    },
    {
      id: "local-file", projectId: "project", name: "groups.csv",
      logicalPath: "OMERO/Screen-101--test/inputs/groups.csv",
      type: "text/csv", size: local.byteLength, sha256: await sha256(local),
      source: "local", state: "ready", data: local, createdAt
    },
    {
      id: "output-file", projectId: "project", chatId: "chat", executionId: "execution",
      name: "plot.csv", logicalPath: "OMERO/Screen-101--test/chats/chat/outputs/plot.csv",
      type: "text/csv", size: output.byteLength, sha256: await sha256(output),
      source: "result", state: "ready", data: output, createdAt
    }
  ];
  return {
    project: {
      id: "project", contextKey: "7:4:Screen:101", rootPath: "OMERO/Screen-101--test",
      name: "Test", objectType: "Screen", objectId: 101, userId: 7, groupId: 4,
      activeChatId: "chat", plotCsv: true, createdAt, updatedAt: createdAt
    },
    chats: [{
      id: "chat", projectId: "project", title: "Analysis", summary: "", archived: false,
      messages: [{ id: "prompt", role: "user", content: "Analyze", createdAt }],
      createdAt, updatedAt: createdAt
    }],
    files,
    executions: [{
      id: "execution", projectId: "project", chatId: "chat", promptId: "prompt",
      code: "result = 1", codeHash: "hash", cacheKey: "cache", status: "success",
      stdout: "", stderr: "", outputFileIds: ["output-file"], missingPlotCsv: [],
      inputHashes: files.slice(0, 2).map((file) => file.sha256), runtimeVersion: "runtime",
      model: "gpt-5", createdAt
    }],
    scripts: []
  };
}

describe("project archive", () => {
  it("references OMERO inputs while embedding local inputs and outputs", async () => {
    const source = await workspace();
    const archive = exportProject(source, 1024 * 1024);
    const entries = unzipSync(archive.data);
    const paths = Object.keys(entries);
    expect(paths.some((path) => path.includes("inputs/local/"))).toBe(true);
    expect(paths.some((path) => path.includes("measurements.duckdb"))).toBe(false);
    const manifest = JSON.parse(strFromU8(entries["project.json"]));
    expect(manifest.format).toBe(PROJECT_FORMAT);
    expect(manifest.files.find((file: any) => file.id === "omero-file").archivePath).toBeUndefined();
    expect(JSON.stringify(manifest).toLowerCase()).not.toContain("apikey");

    const restored = await importProject(archive.data.buffer as ArrayBuffer);
    expect(restored.project.id).not.toBe(source.project.id);
    expect(restored.files.find((file) => file.source === "omero")?.data).toBeUndefined();
    expect(restored.files.find((file) => file.source === "local")?.data).toBeInstanceOf(ArrayBuffer);
  });

  it("omits local inputs when they make the snapshot exceed its limit", async () => {
    const source = await workspace();
    const local = source.files.find((file) => file.source === "local")!;
    local.data = new Uint8Array(20_000).buffer;
    local.size = local.data.byteLength;
    local.sha256 = await sha256(local.data);
    const archive = exportProject(source, 10_000);
    expect(archive.omittedLocalInputs).toEqual(["groups.csv"]);
    const manifest = JSON.parse(strFromU8(unzipSync(archive.data)["project.json"]));
    expect(manifest.files.find((file: any) => file.id === "local-file").state).toBe("missing");
  });

  it("rejects traversal paths, altered files, and credential fields", async () => {
    const source = await workspace();
    const archive = exportProject(source, 1024 * 1024);
    const entries = unzipSync(archive.data);

    await expect(importProject(asArrayBuffer(zipSync({
      ...entries,
      "../escape.txt": strToU8("unsafe")
    })))).rejects.toThrow(/Unsafe project archive path/);

    const hashEntries = unzipSync(exportProject(source, 1024 * 1024).data);
    const localPath = Object.keys(hashEntries).find((path) => path.startsWith("inputs/local/"))!;
    hashEntries[localPath][0] ^= 1;
    const alteredArchive = zipSync(hashEntries);
    await expect(importProject(asArrayBuffer(alteredArchive))).rejects.toThrow(/Hash mismatch/);

    (source.project as any).preferences = { api_key: "must-not-be-imported" };
    const credentialArchive = exportProject(source, 1024 * 1024);
    await expect(importProject(asArrayBuffer(credentialArchive.data))).rejects.toThrow(/API key/);
  });
});
