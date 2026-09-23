import type { AnalysisWorkspace } from "./types";
import {
  groupChatResults,
  normalizeWorkspaceName,
  renameAnalysisWorkspace,
  scopedWorkspaceName,
  workspaceNameSuffix,
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
  it("keeps the full source path when naming and renaming an analysis", () => {
    const context = { object_type: "Image" as const, object_id: 3, name: "Field 1",
      user_id: 7, group_id: 4, can_annotate: true, selected_attachments: [],
      source_path: [{ type: "Screen", id: 1, name: "SolHunt" },
        { type: "Plate", id: 2, name: "Plate A" }, { type: "Image", id: 3, name: "Field 1" }] };
    const name = scopedWorkspaceName(context, "Analysis 2");
    expect(name).toBe("SolHunt › Plate A › Field 1 — Analysis 2");
    expect(scopedWorkspaceName(context, name)).toBe(name);
    expect(workspaceNameSuffix(context, name)).toBe("Analysis 2");
    expect(scopedWorkspaceName({ ...context, source_path: [{ type: "Image", id: 3, name: "B/2/0" }] }, "Analysis 1"))
      .toBe("B/2/0 — Analysis 1");
    const renamed = renameAnalysisWorkspace(workspace, "Cell counts", "2026-09-09T12:00:00Z", context);
    expect(renamed.workspace.name).toBe("SolHunt › Plate A › Field 1 — Cell counts");
    const long = { ...context, source_path: [{ type: "Screen", id: 1, name: "S".repeat(110) }] };
    expect(scopedWorkspaceName(long, "Analysis 1")).toBe(`${"S".repeat(110)} — Analysis 1`);
    expect(renameAnalysisWorkspace(workspace, "Analysis 1", "now", long).workspace.rootPath)
      .not.toBe(renameAnalysisWorkspace(workspace, "Analysis 2", "now", long).workspace.rootPath);
  });
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
