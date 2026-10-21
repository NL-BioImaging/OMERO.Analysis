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

export function runLabel(file: WorkspaceFile): string {
  return file.notebookRunId ? `Run ${file.notebookRunStartedAt?.replace("T", " ").replace("Z", " UTC") || "unknown time"} · ${file.notebookRunId.slice(0, 8)}` : "Earlier results";
}

export function remoteResultName(file: WorkspaceFile, notebooks: NotebookRecord[]): string {
  const notebook = notebooks.find(n => n.id === file.notebookId);
  const title = (notebook?.name.replace(/\.ipynb$/i, "") || "Analysis").replace(/[^\p{L}\p{N}_. -]/gu, "_").slice(0, 65);
  const run = file.notebookRunStartedAt || file.createdAt;
  const stamp = run?.replace(/[^0-9TZ]/g, "") || "legacy";
  const identity = (file.notebookRunId || file.sha256 || file.id).slice(0, 8);
  const prefix = `${title}__${stamp}-${identity}__`;
  const extension = file.name.match(/\.[^.]{1,16}$/)?.[0] || "";
  const basename = extension ? file.name.slice(0, -extension.length) : file.name;
  return `${prefix}${basename.slice(0, 180 - prefix.length - extension.length)}${extension}`;
}

export function notebookResultPath(root: string, name: string, key: string, fileName: string, runId?: string): string {
  return `${root}/Notebooks/Results/${name}/${runId ? `Run-${runId}` : `Settings-${key.slice(0, 12)}`}/${fileName}`;
}

/** One current result per notebook, inputs and parameter setting; preserve other settings. */
export async function completeNotebookResults(files: WorkspaceFile[], notebook: NotebookRecord, root: string): Promise<WorkspaceFile[]> {
  const latest = notebook.protocolRuns?.at(-1);
  if (!latest || latest.status === "running") return files;
  if (latest.status === "failed") return files.map(file => latest.id && file.notebookRunId === latest.id && !file.supersededAt
    ? supersedeResult(file, latest.completedAt || notebook.updatedAt) : file);
  const timestamp = latest.completedAt || notebook.updatedAt;
  const parameterKey = await notebookParameterKey(notebook.id, latest);
  const produced = new Set(latest.outputs.map(output => output.name));
  const scoped = await Promise.all(files.map(async file => {
    if (file.notebookId !== notebook.id || file.source !== "result" || file.notebookParameterKey) return file;
    const matches = (notebook.protocolRuns || []).filter(run => run.completedAt && file.createdAt >= run.startedAt &&
      file.createdAt <= run.completedAt && run.outputs.some(output => output.name === file.name && output.size === file.size));
    return matches.length === 1 ? {...file, notebookRunStartedAt: matches[0].startedAt,
      notebookParameterKey: await notebookParameterKey(notebook.id, matches[0])} : file;
  }));
  const winners = new Map<string, string>();
  for (const file of [...scoped].sort((a,b) => a.createdAt.localeCompare(b.createdAt))) {
    if (file.notebookId === notebook.id && file.notebookParameterKey === parameterKey && !file.deletedAt && !file.supersededAt &&
        (latest.id ? file.notebookRunId === latest.id : file.notebookRunStartedAt === latest.startedAt)) winners.set(file.name, file.id);
  }
  return scoped.map(file => {
    if (file.notebookId !== notebook.id || file.source !== "result" || file.notebookParameterKey !== parameterKey || file.supersededAt || file.deletedInOmeroAt) return file;
    const fromThisRun = latest.id ? file.notebookRunId === latest.id : file.notebookRunStartedAt === latest.startedAt;
    const replaced = latest.mode === "all" ? !fromThisRun || winners.get(file.name) !== file.id :
      produced.has(file.name) && winners.get(file.name) !== file.id;
    return replaced ? supersedeResult(file, timestamp) : file;
  });
}

export function supersedeResult(file: WorkspaceFile, timestamp: string): WorkspaceFile {
  return {...file, deletedAt: file.deletedAt || timestamp, supersededAt: timestamp,
    data: undefined, mediaBlob: undefined, remoteResult: undefined, state: "missing", error: "Replaced by the current result"};
}

/** Once per workspace, compact legacy duplicate versions after a remote status check. */
export function compactResultVersions(files: WorkspaceFile[], timestamp: string): WorkspaceFile[] {
  const latest = new Map<string, string>();
  const key = (file: WorkspaceFile) => JSON.stringify([file.notebookId || file.methodId || file.pipelineId || "legacy", file.notebookParameterKey || "legacy", file.name]);
  for (const file of [...files].sort((a,b) => a.createdAt.localeCompare(b.createdAt))) {
    if (file.source === "result" && !file.deletedAt && !file.deletedInOmeroAt) latest.set(key(file), file.id);
  }
  return files.map(file => file.source === "result" && !file.deletedInOmeroAt && !file.supersededAt &&
    (file.deletedAt || latest.get(key(file)) !== file.id) ? supersedeResult(file, timestamp) : file);
}
