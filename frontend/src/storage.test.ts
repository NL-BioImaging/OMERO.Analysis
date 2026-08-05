import {
  loadOrCreateWorkspace,
  loadWorkspace,
  newChat,
  deleteChatCascade,
  deleteWorkspaceCascade,
  saveChat,
  saveEvidenceLedger,
  replaceWorkspace,
  saveWorkspaceRecord,
  saveFile,
  setValue
} from "./storage";
import type { OmeroContext } from "./types";

const context: OmeroContext = {
  object_type: "Dataset",
  object_id: 42,
  name: "Cells",
  user_id: 7,
  group_id: 4,
  can_annotate: true,
  selected_attachments: []
};

describe("normalized workspace storage", () => {
  it("keeps a multi-image selection separate from each individual Image workspace", async () => {
    const selectedContext: OmeroContext = {
      ...context,
      object_type: "Image",
      object_id: 11,
      name: "2 selected Images",
      selected_objects: [
        { type: "Image", id: 11, name: "Field 11", supported: true },
        { type: "Image", id: 12, name: "Field 12", supported: true }
      ]
    };
    const selection = await loadOrCreateWorkspace(selectedContext);
    const individual = await loadOrCreateWorkspace({
      ...selectedContext,
      name: "Field 11",
      selected_objects: undefined
    });

    expect(selection.workspace.id).not.toBe(individual.workspace.id);
    expect(selection.workspace.rootPath).toContain("Image-selection-11-12");
  });

  it("creates an exact-object workspace and stores chats separately", async () => {
    const workspace = await loadOrCreateWorkspace(context);
    expect(workspace.workspace.rootPath).toBe("OMERO/Dataset-42--cells");
    expect(workspace.workspace.plotCsv).toBe(true);
    const chat = newChat(workspace.workspace.id, "Second chat");
    await saveChat(chat);
    await saveWorkspaceRecord({ ...workspace.workspace, activeChatId: chat.id });
    const loaded = await loadWorkspace(workspace.workspace.id);
    expect(loaded?.chats.map((item) => item.title)).toContain("Second chat");
    expect(loaded?.workspace.activeChatId).toBe(chat.id);
  });

  it("ignores an old monolithic browser value", async () => {
    const legacyContext = { ...context, object_id: 43 };
    await setValue("workspace:7:4:Dataset:43", {
      messages: [{ id: "legacy-message", role: "user", content: "Old question" }],
      files: []
    });
    const created = await loadOrCreateWorkspace(legacyContext);
    expect(created.chats[0].title).toBe("New Assistant Chat");
    expect(created.chats[0].messages).toEqual([]);
  });

  it("serializes rapid writes and deletes an entire workspace transactionally", async () => {
    const workspace = await loadOrCreateWorkspace({ ...context, object_id: 60 });
    await Promise.all([
      saveWorkspaceRecord({ ...workspace.workspace, name: "first" }),
      saveWorkspaceRecord({ ...workspace.workspace, name: "latest" })
    ]);
    expect((await loadWorkspace(workspace.workspace.id))?.workspace.name).toBe("latest");
    await deleteWorkspaceCascade(workspace.workspace.id);
    expect(await loadWorkspace(workspace.workspace.id)).toBeUndefined();
  });

  it("deletes a chat and every chat-owned record while preserving sibling data", async () => {
    const workspace = await loadOrCreateWorkspace({ ...context, object_id: 65 });
    const removed = workspace.chats[0];
    const kept = newChat(workspace.workspace.id, "Keep me");
    const record = (id: string, chatId: string) => ({
      id,
      workspaceId: workspace.workspace.id,
      chatId,
      createdAt: "2026-08-03T00:00:00Z"
    });
    await replaceWorkspace({
      ...workspace,
      chats: [removed, kept],
      files: [...[removed, kept].map((chat) => ({
        ...record(`file-${chat.id}`, chat.id),
        name: `${chat.id}.csv`,
        logicalPath: `/output/${chat.id}.csv`,
        type: "text/csv",
        size: 1,
        sha256: chat.id,
        source: "result" as const,
        state: "ready" as const
      })), {
        id: "run-file", workspaceId: workspace.workspace.id, runId: "run",
        name: "run.csv", logicalPath: "/Runs/run.csv", type: "text/csv",
        size: 1, sha256: "run", source: "result" as const, state: "ready" as const,
        createdAt: "2026-08-03T00:00:00Z"
      }],
      executions: [...[removed, kept].map((chat) => ({
        ...record(`execution-${chat.id}`, chat.id),
        promptId: `prompt-${chat.id}`,
        code: "result = 1",
        codeHash: chat.id,
        cacheKey: chat.id,
        status: "success" as const,
        stdout: "",
        stderr: "",
        outputFileIds: [`file-${chat.id}`],
        missingPlotCsv: [],
        inputHashes: [],
        runtimeVersion: "test",
        model: "test"
      })), {
        id: "run-execution", workspaceId: workspace.workspace.id, runId: "run",
        code: "result = 2", codeHash: "run", cacheKey: "run", status: "success" as const,
        stdout: "", stderr: "", outputFileIds: ["run-file"], missingPlotCsv: [],
        inputHashes: [], runtimeVersion: "test", model: "test",
        createdAt: "2026-08-03T00:00:00Z"
      }],
      runs: [{
        id: "run", workspaceId: workspace.workspace.id, kind: "method" as const,
        artifactId: "method", artifactName: "method.py", artifactVersion: 1,
        status: "success" as const, executionIds: ["run-execution"],
        resolvedBindings: {}, steps: [], createdAt: "2026-08-03T00:00:00Z",
        completedAt: "2026-08-03T00:01:00Z"
      }],
      artifacts: [removed, kept].map((chat) => ({
        ...record(`artifact-${chat.id}`, chat.id),
        kind: "file" as const,
        title: chat.title,
        pinned: false
      })),
      audits: [removed, kept].map((chat) => ({
        ...record(`audit-${chat.id}`, chat.id),
        categories: [],
        byteLength: 2,
        payload: "{}"
      })),
      evidence: [removed, kept].map((chat) => ({
        ...record(`evidence-${chat.id}`, chat.id),
        promptId: `prompt-${chat.id}`,
        kind: "tool-result" as const,
        status: "success" as const,
        sourceHashes: [],
        skillHashes: [],
        sourceSkillKey: chat.id,
        summary: chat.title,
        payload: "{}"
      }))
    });

    await deleteChatCascade(removed.id);
    const loaded = await loadWorkspace(workspace.workspace.id);
    expect(loaded?.chats.map((chat) => chat.id)).toEqual([kept.id]);
    for (const values of [
      loaded?.files,
      loaded?.executions,
      loaded?.artifacts,
      loaded?.audits,
      loaded?.evidence
    ]) expect(values?.filter((value) => value.chatId).map((value) => value.chatId)).toEqual([kept.id]);
    expect(loaded?.runs.map((run) => run.id)).toEqual(["run"]);
    expect(loaded?.files.some((file) => file.runId === "run")).toBe(true);
    expect(loaded?.executions.some((execution) => execution.runId === "run")).toBe(true);
  });

  it("returns authoritative monotonic Workspace revisions", async () => {
    const workspace = await loadOrCreateWorkspace({ ...context, object_id: 62 });
    const first = await saveWorkspaceRecord({ ...workspace.workspace, name: "first" });
    const staleWriter = await saveWorkspaceRecord({
      ...workspace.workspace,
      revision: 0,
      name: "second"
    });
    expect(staleWriter.revision).toBe((first.revision || 0) + 1);
    expect((await loadWorkspace(workspace.workspace.id))?.workspace.revision)
      .toBe(staleWriter.revision);
  });

  it("updates Workspace metadata without rewriting an existing large file blob", async () => {
    const workspace = await loadOrCreateWorkspace({ ...context, object_id: 64 });
    await saveFile({
      id: "large-file",
      workspaceId: workspace.workspace.id,
      name: "large.duckdb",
      logicalPath: "/input/large.duckdb",
      type: "application/octet-stream",
      size: 790 * 1024 * 1024,
      sha256: "large-hash",
      source: "omero",
      state: "ready",
      data: new Uint8Array([1, 2, 3, 4]).buffer,
      createdAt: "2026-08-01T00:00:00Z"
    });
    const put = vi.spyOn(IDBObjectStore.prototype, "put");
    await saveWorkspaceRecord({ ...workspace.workspace, name: "metadata only" });
    expect(put).toHaveBeenCalledTimes(1);
    expect((put.mock.calls[0][0] as { id: string }).id).toBe(workspace.workspace.id);
    put.mockRestore();
  });

  it("uses full replacement only for restore semantics", async () => {
    const workspace = await loadOrCreateWorkspace({ ...context, object_id: 63 });
    const extra = newChat(workspace.workspace.id, "Remove on restore");
    await saveChat(extra);
    const replaced = await replaceWorkspace({ ...workspace, chats: workspace.chats });
    expect(replaced.workspace.revision).toBeGreaterThan(workspace.workspace.revision || 0);
    expect((await loadWorkspace(workspace.workspace.id))?.chats.map((chat) => chat.title))
      .not.toContain("Remove on restore");
  });

  it("persists a bounded replacement evidence ledger per chat", async () => {
    const workspace = await loadOrCreateWorkspace({ ...context, object_id: 61 });
    const chatId = workspace.workspace.activeChatId;
    const evidence = (id: string) => ({
      id,
      workspaceId: workspace.workspace.id,
      chatId,
      promptId: "prompt",
      kind: "tool-result" as const,
      status: "success" as const,
      sourceHashes: ["source"],
      skillHashes: ["skill"],
      sourceSkillKey: "key",
      summary: id,
      payload: "{}",
      createdAt: "2026-07-27T00:00:00Z"
    });
    await saveEvidenceLedger(chatId, [evidence("old"), evidence("keep")]);
    await saveEvidenceLedger(chatId, [evidence("keep")]);
    expect((await loadWorkspace(workspace.workspace.id))?.evidence.map((item) => item.id))
      .toEqual(["keep"]);
  });
});
