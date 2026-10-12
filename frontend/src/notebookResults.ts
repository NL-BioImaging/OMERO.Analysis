import { sha256 } from "./storage";
import type { NotebookRecord, WorkspaceFile } from "./types";
import type { NotebookRunProvenance } from "./notebookProtocol";

export async function notebookParameterKey(notebookId: string, run: NotebookRunProvenance): Promise<string> {
  const value = {
    notebookId,
    parameters: Object.entries(run.parameters).sort(([a], [b]) => a.localeCompare(b)),
    sources: run.sources.map(source => ({ inputId: source.inputId,
      identity: source.sourceDigest || source.name, schema: source.schemaDigest || null }))
      .sort((a, b) => a.inputId.localeCompare(b.inputId))
  };
  return sha256(new TextEncoder().encode(JSON.stringify(value)).buffer);
}

export function notebookResultPath(root: string, name: string, key: string, fileName: string): string {
  return `${root}/Notebooks/Results/${name}/Settings-${key.slice(0, 12)}/${fileName}`;
}

/** Recover legacy run ownership only when timestamps and output inventory agree. */
export async function completeNotebookResults(files: WorkspaceFile[], notebook: NotebookRecord, root: string): Promise<WorkspaceFile[]> {
  const runs = notebook.protocolRuns || [];
  const latest = runs.at(-1);
  if (!latest || latest.status !== "success") return files;
  const keys = new Map(await Promise.all(runs.map(async run =>
    [run.startedAt, await notebookParameterKey(notebook.id, run)] as const)));
  const successful = new Map<string, string>();
  for (const run of runs.filter(run => run.status === "success").sort((a, b) => a.startedAt.localeCompare(b.startedAt))) {
    successful.set(keys.get(run.startedAt)!, run.startedAt);
  }
  const scopedFiles = files.map(file => {
    if (file.notebookId !== notebook.id || file.source !== "result") return file;
    let scoped = file;
    if (!file.notebookParameterKey) {
      const matches = runs.filter(run => run.completedAt && file.createdAt >= run.startedAt &&
        file.createdAt <= run.completedAt && run.outputs.some(output => output.name === file.name && output.size === file.size));
      if (matches.length !== 1) return file; // Ambiguous old output remains untouched.
      const run = matches[0], key = keys.get(run.startedAt)!;
      scoped = { ...file, notebookParameterKey: key, notebookRunStartedAt: run.startedAt,
        logicalPath: notebookResultPath(root, notebook.name, key, file.name) };
    }
    return scoped;
  });
  const winners = new Map<string, string>();
  const fileKey = (file: WorkspaceFile) => JSON.stringify([file.notebookParameterKey, file.notebookRunStartedAt, file.name]);
  for (const file of [...scopedFiles].sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    if (file.notebookId === notebook.id && !file.deletedAt && file.notebookParameterKey &&
        successful.get(file.notebookParameterKey) === file.notebookRunStartedAt) winners.set(fileKey(file), file.id);
  }
  return scopedFiles.map(file => {
    const winner = file.notebookParameterKey && successful.get(file.notebookParameterKey);
    if (file.notebookId === notebook.id && !file.deletedAt && winner && file.notebookRunStartedAt &&
        (file.notebookRunStartedAt < winner || (file.notebookRunStartedAt === winner && winners.get(fileKey(file)) !== file.id))) {
      return { ...file, deletedAt: latest.completedAt || notebook.updatedAt };
    }
    return file;
  });
}
