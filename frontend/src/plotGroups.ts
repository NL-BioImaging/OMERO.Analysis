import type { WorkspaceFile } from "./types";

const stem = (path: string) => path.replace(/\\/g, "/").replace(/\.[^/.]+$/, "");
const extension = (file: WorkspaceFile) => file.name.split(".").at(-1)?.toLowerCase() || "file";

/** Never associate outputs from different executions just because a Method matches. */
export function samePlot(left: WorkspaceFile, right: WorkspaceFile): boolean {
  if (left.workspaceId !== right.workspaceId) return false;
  if (left.executionId || right.executionId) {
    if (!left.executionId || left.executionId !== right.executionId) return false;
  }
  if (left.runId || right.runId) {
    if (!left.runId || left.runId !== right.runId) return false;
  }
  if (left.resultGroupId && right.resultGroupId) return left.resultGroupId === right.resultGroupId;
  return stem(left.name) === stem(right.name) && stem(left.logicalPath) === stem(right.logicalPath);
}

export function plotGroups(files: WorkspaceFile[]): Array<{ preview: WorkspaceFile; files: WorkspaceFile[] }> {
  const active = files.filter(file => !file.deletedAt);
  const images = active.filter(file => ["video/mp4", "image/png", "image/svg+xml"].includes(file.type));
  const used = new Set<string>();
  return images.sort((a, b) => Number(b.type === "video/mp4") - Number(a.type === "video/mp4") || Number(b.type === "image/png") - Number(a.type === "image/png"))
    .flatMap(preview => {
      if (used.has(preview.id)) return [];
      const companions = active.filter(file => file.id === preview.id ||
        (["mp4", "png", "svg", "csv", "json"].includes(extension(file)) && samePlot(preview, file)));
      companions.forEach(file => used.add(file.id));
      return [{ preview, files: companions }];
    });
}

export function groupedResultFiles(files: WorkspaceFile[]): WorkspaceFile[][] {
  const plots = plotGroups(files);
  const grouped = new Set(plots.flatMap(plot => plot.files.map(file => file.id)));
  return [...plots.map(plot => plot.files), ...files.filter(file => !file.deletedAt && !grouped.has(file.id)).map(file => [file])];
}
