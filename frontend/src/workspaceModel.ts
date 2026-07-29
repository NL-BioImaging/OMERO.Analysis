import type { AnalysisWorkspace } from "./types";

function workspaceSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 72)
    .toLowerCase() || "analysis";
}

export function normalizeWorkspaceName(value: string): string {
  return value
    .replace(/[\u0000-\u001f\\/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

export function renameAnalysisWorkspace(
  workspace: AnalysisWorkspace,
  requestedName: string,
  updatedAt: string
): AnalysisWorkspace {
  const name = normalizeWorkspaceName(requestedName);
  if (!name) throw new Error("Workspace name cannot be empty");
  const previousRoot = workspace.workspace.rootPath;
  const objectRoot = previousRoot.split("--", 1)[0] || "OMERO/Local";
  const rootPath = `${objectRoot}--${workspaceSlug(name)}`;
  const files = workspace.files.map((file) => ({
    ...file,
    logicalPath: file.logicalPath.startsWith(`${previousRoot}/`)
      ? `${rootPath}${file.logicalPath.slice(previousRoot.length)}`
      : file.logicalPath
  }));
  return {
    ...workspace,
    workspace: {
      ...workspace.workspace,
      name,
      rootPath,
      updatedAt
    },
    files
  };
}

export function trashWorkspaceOutputs(
  workspace: AnalysisWorkspace,
  outputIds: Iterable<string>,
  deletedAt: string
): AnalysisWorkspace {
  const ids = new Set(outputIds);
  return {
    ...workspace,
    files: workspace.files.map((file) =>
      ids.has(file.id) && file.source === "result" && !file.deletedAt
        ? { ...file, deletedAt }
        : file
    )
  };
}
