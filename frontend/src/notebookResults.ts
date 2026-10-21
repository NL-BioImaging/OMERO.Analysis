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
  return file.notebookRunId || file.notebookRunStartedAt ? `Run ${file.notebookRunStartedAt?.replace("T", " ").replace("Z", " UTC") || "unknown time"} · ${file.notebookRunId?.slice(0, 8) || "legacy"}` : "Earlier results";
}

export function recordedResultRun(file: WorkspaceFile, notebook?: NotebookRecord): NotebookRunProvenance | undefined {
  const matches = (notebook?.protocolRuns || []).filter(run => file.notebookRunId
    ? run.id === file.notebookRunId
    : !!file.notebookRunStartedAt && run.startedAt === file.notebookRunStartedAt);
  return matches.length === 1 ? matches[0] : undefined;
}

export function resultProvenance(file: WorkspaceFile, notebooks: NotebookRecord[]) {
  const notebook = notebooks.find(n => n.id === file.notebookId);
  const run = recordedResultRun(file, notebook);
  return {version: 1, presentationVersion: 1, outputName: file.name,
    notebook: {id: file.notebookId || null, name: run?.notebookName || notebook?.name || null,
      nameRecorded: !!run?.notebookName, scriptSha256: run?.scriptSha256 || null},
    parameterKey: file.notebookParameterKey || null,
    run: {id: run?.id || file.notebookRunId || null, startedAt: run?.startedAt || file.notebookRunStartedAt || null,
      completedAt: run?.completedAt || null, mode: run?.mode || null, cellIndex: run?.cellIndex ?? null,
      status: run?.status || null, parameterOrder: run?.parameterOrder || Object.keys(run?.parameters || {}), parameters: run?.parameters ?? null},
    inputs: run?.sources || []};
}

/** Use execution provenance, never the notebook's currently edited values/defaults. */
export function runParametersLabel(file: WorkspaceFile, notebook?: NotebookRecord): string {
  const run = recordedResultRun(file, notebook);
  if (!run) return "Parameters not recorded";
  const entries = Object.entries(run.parameters);
  return entries.length ? `Parameters: ${entries.map(([name, value]) => `${name}=${JSON.stringify(value)}`).join(" · ")}` : "No run parameters";
}

export function remoteResultName(file: WorkspaceFile, notebooks: NotebookRecord[]): string {
  const notebook = notebooks.find(n => n.id === file.notebookId);
  const run = recordedResultRun(file, notebook);
  const clean = (value: string) => value.replace(/[\\/\u0000-\u001f\u007f<>:"|?*]+/g, "-").replace(/\s+/g, " ").trim();
  const shorten = (value: string, bytes: number) => {
    let result = "";
    for (const char of value) { if (new TextEncoder().encode(result + char).length > bytes) break; result += char; }
    return result;
  };
  const title = shorten(clean((run?.notebookName || notebook?.name || "Analysis").replace(/\.ipynb$/i, "")), 50);
  const valueName = (key: string, value: boolean | number | string | null) => {
    const text = typeof value === "number" && /channel(?:_id)?$/i.test(key) ? `channel${value}` : String(value === null ? "null" : value === "" ? "empty" : value);
    return clean(text).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
      .replace(/[^\p{L}\p{N}.+\-]+/gu, "-").replace(/^channel-(\d+)$/, "channel$1") || "empty";
  };
  const order = run?.parameterOrder || Object.keys(run?.parameters || {});
  const values = run ? order.filter(key => Object.hasOwn(run.parameters, key)).map(key => valueName(key, run.parameters[key])).join("_") : "parameters-not-recorded";
  // Full values live in provenance; shorten only the readable display name.
  const settings = new TextEncoder().encode(values).length > 100 ? `${shorten(values, 97)}…` : values || "no-parameters";
  const extension = file.name.match(/\.[^.]{1,16}$/)?.[0] || "";
  const basename = extension ? file.name.slice(0, -extension.length) : file.name;
  const suffix = `__${settings}${extension}`;
  const prefix = `${title}__`;
  return `${prefix}${shorten(clean(basename), 180 - new TextEncoder().encode(prefix + suffix).length)}${suffix}`;
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
