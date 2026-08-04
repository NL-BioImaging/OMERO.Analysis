import type { AnalysisWorkspace } from "./types";
import {
  groupChatResults,
  normalizeWorkspaceName,
  renameAnalysisWorkspace,
  trashWorkspaceOutputs
} from "./workspaceModel";

describe("Chat result folders", () => {
  it("groups results by owning Chat and preserves legacy unassigned results", () => {
    const chats = [{
      id: "chat-a", workspaceId: "workspace", title: "A", summary: "", messages: [],
      createdAt: "2026-07-26T00:00:00Z", updatedAt: "2026-07-26T00:00:00Z"
    }];
    const owned = { ...workspace.files[0], id: "owned", chatId: "chat-a" };
    const legacy = { ...workspace.files[0], id: "legacy", chatId: undefined };
    const orphaned = { ...workspace.files[0], id: "orphaned", chatId: "removed-chat" };
    const grouped = groupChatResults([owned, legacy, orphaned], chats);
    expect(grouped.byChat.get("chat-a")?.map((file) => file.id)).toEqual(["owned"]);
    expect(grouped.unassigned.map((file) => file.id)).toEqual(["legacy", "orphaned"]);
  });
});

const workspace = {
  workspace: {
    id: "workspace",
    contextKey: "7:4:Screen:101:import:1",
    rootPath: "OMERO/Screen-101--2wellstest--imported",
    name: "2Wellstest (imported)",
    objectType: "Screen",
    objectId: 101,
    userId: 7,
    groupId: 4,
    activeChatId: "chat",
    plotCsv: true,
    createdAt: "2026-07-26T00:00:00Z",
    updatedAt: "2026-07-26T00:00:00Z"
  },
  chats: [],
  files: [{
    id: "file",
    workspaceId: "workspace",
    name: "result.csv",
    logicalPath: "OMERO/Screen-101--2wellstest--imported/chats/chat/outputs/result.csv",
    type: "text/csv",
    size: 1,
    sha256: "abc",
    source: "result",
    state: "ready",
    createdAt: "2026-07-26T00:00:00Z"
  }],
  executions: [],
  runs: [],
  methods: [],
  pipelines: [],
  notebooks: [],
  artifacts: [],
  audits: [],
  evidence: []
} satisfies AnalysisWorkspace;

describe("workspace renaming", () => {
  it("normalizes unsafe names", () => {
    expect(normalizeWorkspaceName("  New / analysis\\workspace  ")).toBe(
      "New analysis workspace"
    );
  });

  it("renames the logical root and every stored file path", () => {
    const renamed = renameAnalysisWorkspace(
      workspace,
      "Two well comparison",
      "2026-07-27T12:00:00Z"
    );
    expect(renamed.workspace.name).toBe("Two well comparison");
    expect(renamed.workspace.rootPath).toBe(
      "OMERO/Screen-101--two-well-comparison"
    );
    expect(renamed.files[0].logicalPath).toBe(
      "OMERO/Screen-101--two-well-comparison/chats/chat/outputs/result.csv"
    );
    expect(workspace.workspace.rootPath).toBe(
      "OMERO/Screen-101--2wellstest--imported"
    );
  });
});

describe("bulk output deletion", () => {
  it("tombstones selected outputs without removing provenance records", () => {
    const secondOutput = {
      ...workspace.files[0],
      id: "second-output",
      name: "plot.png",
      type: "image/png"
    };
    const withProvenance = {
      ...workspace,
      files: [...workspace.files, secondOutput],
      executions: [{
        id: "execution",
        workspaceId: "workspace",
        chatId: "chat",
        promptId: "prompt",
        code: "print('test')",
        codeHash: "code",
        cacheKey: "cache",
        status: "success",
        stdout: "",
        stderr: "",
        outputFileIds: ["file", "second-output"],
        missingPlotCsv: [],
        inputHashes: [],
        runtimeVersion: "runtime",
        model: "model",
        createdAt: "2026-07-26T00:00:00Z"
      }]
    } satisfies AnalysisWorkspace;
    const deleted = trashWorkspaceOutputs(
      withProvenance,
      ["file", "second-output"],
      "2026-07-27T12:00:00Z"
    );
    expect(deleted.files.every((file) => Boolean(file.deletedAt))).toBe(true);
    expect(deleted.executions[0].outputFileIds).toEqual([
      "file",
      "second-output"
    ]);
  });
});
