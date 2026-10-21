import type { NotebookRecord, WorkspaceFile } from "./types";

export function resultOwner(file: WorkspaceFile, notebooks: NotebookRecord[]): string | null {
  if (file.notebookId && notebooks.some(item => item.id === file.notebookId)) return file.notebookId;
  const path = file.logicalPath.replace(/\\/g, "/");
  const owners = notebooks.filter(item => path.includes(`/${item.name}/`));
  return owners.length === 1 ? owners[0].id : null;
}
export function resultGroups(files: WorkspaceFile[]) {
  const groups = new Map<string, WorkspaceFile[]>();
  for (const file of files) {
    const stem = file.name.replace(/\.(csv|png|svg)$/i, "");
    groups.set(stem, [...(groups.get(stem) || []), file]);
  }
  return [...groups].map(([name, files]) => ({ name, files }));
}
