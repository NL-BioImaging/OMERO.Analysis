import type { ProjectWorkspace } from "./types";

function projectSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 72)
    .toLowerCase() || "analysis";
}

export function normalizeProjectName(value: string): string {
  return value
    .replace(/[\u0000-\u001f\\/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

export function renameProjectWorkspace(
  workspace: ProjectWorkspace,
  requestedName: string,
  updatedAt: string
): ProjectWorkspace {
  const name = normalizeProjectName(requestedName);
  if (!name) throw new Error("Project name cannot be empty");
  const previousRoot = workspace.project.rootPath;
  const objectRoot = previousRoot.split("--", 1)[0] || "OMERO/Local";
  const rootPath = `${objectRoot}--${projectSlug(name)}`;
  const files = workspace.files.map((file) => ({
    ...file,
    logicalPath: file.logicalPath.startsWith(`${previousRoot}/`)
      ? `${rootPath}${file.logicalPath.slice(previousRoot.length)}`
      : file.logicalPath
  }));
  return {
    ...workspace,
    project: {
      ...workspace.project,
      name,
      rootPath,
      updatedAt
    },
    files
  };
}

export function trashProjectOutputs(
  workspace: ProjectWorkspace,
  outputIds: Iterable<string>,
  deletedAt: string
): ProjectWorkspace {
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
