import type { ProjectWorkspace } from "./types";
import {
  normalizeProjectName,
  renameProjectWorkspace
} from "./projectModel";

const workspace = {
  project: {
    id: "project",
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
    projectId: "project",
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
  scripts: [],
  workflows: [],
  artifacts: [],
  audits: []
} satisfies ProjectWorkspace;

describe("project renaming", () => {
  it("normalizes unsafe names", () => {
    expect(normalizeProjectName("  New / analysis\\project  ")).toBe(
      "New analysis project"
    );
  });

  it("renames the logical root and every stored file path", () => {
    const renamed = renameProjectWorkspace(
      workspace,
      "Two well comparison",
      "2026-07-27T12:00:00Z"
    );
    expect(renamed.project.name).toBe("Two well comparison");
    expect(renamed.project.rootPath).toBe(
      "OMERO/Screen-101--two-well-comparison"
    );
    expect(renamed.files[0].logicalPath).toBe(
      "OMERO/Screen-101--two-well-comparison/chats/chat/outputs/result.csv"
    );
    expect(workspace.project.rootPath).toBe(
      "OMERO/Screen-101--2wellstest--imported"
    );
  });
});
