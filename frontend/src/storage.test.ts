import {
  loadOrCreateWorkspace,
  listContextWorkspaces,
  loadWorkspace,
  deleteWorkspaceCascade,
  replaceWorkspace,
  saveWorkspaceRecord,
  saveFile,
  setValue
} from "./storage";
import type { ChatRecord, OmeroContext } from "./types";

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
  it("rejects stale tab writes after Trash, Restore and permanent removal", async () => {
    const original = await loadOrCreateWorkspace({ ...context, object_id: 9182 }, "lifecycle-check");
    const trashed = await saveWorkspaceRecord({ ...original.workspace, deletedAt: "2026-09-09", browserLifecycleRevision: 1 });
    await expect(saveWorkspaceRecord(original.workspace)).rejects.toThrow(/lifecycle changed/);
    await expect(replaceWorkspace(original)).rejects.toThrow(/lifecycle changed/);
    const restored = await saveWorkspaceRecord({ ...trashed, deletedAt: undefined, browserLifecycleRevision: 2 });
    expect(restored.lifecycleRevision || 0).toBe(0); // Local Trash does not invent a server revision.
    await expect(saveWorkspaceRecord(trashed)).rejects.toThrow(/lifecycle changed/);
    await deleteWorkspaceCascade(original.workspace.id, true);
    await expect(saveWorkspaceRecord(restored)).rejects.toThrow(/permanently removed/);
    await expect(replaceWorkspace({ ...original, workspace: restored })).rejects.toThrow(/permanently removed/);
    expect(await loadWorkspace(original.workspace.id)).toBeUndefined();
  });
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



  it("ignores an old monolithic browser value", async () => {
    const legacyContext = { ...context, object_id: 43 };
    await setValue("workspace:7:4:Dataset:43", {
      messages: [{ id: "legacy-message", role: "user", content: "Old question" }],
      files: []
    });
    const created = await loadOrCreateWorkspace(legacyContext);
    expect(created.chats).toEqual([]);
    expect(created.workspace.activeChatId).toBe("");
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




});

it("keeps multiple named workspaces independent for the same source", async () => {
  const scope = { ...context, object_id: 9876 };
  const first = await loadOrCreateWorkspace(scope, "instance-one", "Analysis 1");
  const second = await loadOrCreateWorkspace(scope, "instance-two", "Analysis 2");
  const reopened = await loadOrCreateWorkspace(scope, "instance-one", "ignored");
  expect(first.workspace.id).not.toBe(second.workspace.id);
  expect(first.chats).toEqual([]);
  expect(second.chats).toEqual([]);
  expect(reopened.workspace.name).toBe(`${scope.name} — Analysis 1`);
  expect(reopened.workspace.id).toBe(first.workspace.id);
  expect((await listContextWorkspaces(scope)).map(item => item.id).sort())
    .toEqual([first.workspace.id, second.workspace.id].sort());
});


it("rejects retired record writes and restores only notebook-era content", async () => {
  const workspace = await loadOrCreateWorkspace({...context, object_id: 7654});
  await expect(setValue("provider:profiles:v1", {apiKey: "test"})).rejects.toThrow(/retired/);
  const restored = await replaceWorkspace({...workspace, chats: [{id: "legacy", workspaceId: workspace.workspace.id} as ChatRecord]});
  expect(restored.chats).toEqual([]);
  expect((await loadWorkspace(workspace.workspace.id))?.chats).toEqual([]);
});
