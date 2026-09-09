import type { AnalysisWorkspace } from "./types";

export type TrashKind = "method" | "pipeline" | "notebook" | "file";

export function pipelineRestoreBlockers(workspace: AnalysisWorkspace, id: string): string[] {
  const pipeline = workspace.pipelines.find(item => item.id === id);
  return [...new Set((pipeline?.steps ?? []).flatMap(step => {
    const method = workspace.methods.find(item => item.id === step.methodId);
    return !method || method.deletedAt ? [method?.name ?? `Missing Method ${step.methodId}`] : [];
  }))];
}

export function trashBlockers(workspace: AnalysisWorkspace, kind: TrashKind, id: string): string[] {
  if (kind !== "method") return [];
  return workspace.pipelines.filter(pipeline => !pipeline.deletedAt &&
    pipeline.steps.some(step => step.methodId === id)).map(pipeline => pipeline.name);
}

export function purgeBlockers(workspace: AnalysisWorkspace, kind: TrashKind, id: string): string[] {
  const result = trashBlockers(workspace, kind, id);
  if (kind === "method" && workspace.pipelines.some(p => p.steps.some(step => step.methodId === id))) result.push("Pinned Pipeline versions (including Trash)");
  if ((kind === "method" || kind === "pipeline") && workspace.runs.some(run => run.artifactId === id ||
    (kind === "method" && run.steps.some(step => step.methodId === id)))) result.push("Historical runs");
  if (kind === "notebook" && workspace.files.some(file => file.notebookId === id)) result.push("Notebook result provenance");
  if (kind === "file" && (workspace.executions.some(e => e.outputFileIds.includes(id)) ||
    workspace.artifacts.some(a => a.fileId === id))) result.push("Historical result provenance");
  return [...new Set(result)];
}
