import {
  loadOrCreateWorkspace,
  loadWorkspace,
  newChat,
  saveChat,
  saveProject,
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

describe("normalized project storage", () => {
  it("creates an exact-object project and stores chats separately", async () => {
    const workspace = await loadOrCreateWorkspace(context);
    expect(workspace.project.rootPath).toBe("OMERO/Dataset-42--cells");
    expect(workspace.project.plotCsv).toBe(true);
    const chat = newChat(workspace.project.id, "Second chat");
    await saveChat(chat);
    await saveProject({ ...workspace.project, activeChatId: chat.id });
    const loaded = await loadWorkspace(workspace.project.id);
    expect(loaded?.chats.map((item) => item.title)).toContain("Second chat");
    expect(loaded?.project.activeChatId).toBe(chat.id);
  });

  it("migrates the old monolithic workspace into an imported chat", async () => {
    const legacyContext = { ...context, object_id: 43 };
    await setValue("workspace:7:4:Dataset:43", {
      messages: [{ id: "legacy-message", role: "user", content: "Old question" }],
      files: []
    });
    const migrated = await loadOrCreateWorkspace(legacyContext);
    expect(migrated.chats[0].title).toBe("Imported chat");
    expect(migrated.chats[0].messages[0].content).toBe("Old question");
  });
});
