import {
  loadOrCreateWorkspace,
  loadWorkspace,
  listUserWorkspaces,
  newChat,
  deleteWorkspaceCascade,
  saveChat,
  saveEvidenceLedger,
  saveWorkspaceRecord,
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
    expect(created.chats[0].title).toBe("New analysis");
    expect(created.chats[0].messages).toEqual([]);
  });

  it("lists destination workspaces for the same OMERO user and group", async () => {
    const first = await loadOrCreateWorkspace({ ...context, object_id: 50 });
    const second = await loadOrCreateWorkspace({
      ...context,
      object_type: "Screen",
      object_id: 51,
      name: "Other screen"
    });
    await loadOrCreateWorkspace({
      ...context,
      object_id: 52,
      group_id: 99,
      name: "Other group"
    });
    const workspaces = await listUserWorkspaces({ ...context, object_id: 50 });
    expect(workspaces.map((workspace) => workspace.id)).toContain(first.workspace.id);
    expect(workspaces.map((workspace) => workspace.id)).toContain(second.workspace.id);
    expect(workspaces.some((workspace) => workspace.groupId === 99)).toBe(false);
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
