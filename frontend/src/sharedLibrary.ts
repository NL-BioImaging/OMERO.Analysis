import type { AnalysisWorkspace, OmeroContext, SharedLibraryItem, SharedLibraryOrigin, WorkspaceRecord } from "./types";
import { parseNotebook } from "./NotebookView";
import { parameterDefaults, parseNotebookProtocol, sanitizeProtocolNotebook } from "./notebookProtocol";
import { sha256 } from "./storage";

export const HANDOFF_PREFIX = "omero-analysis-shared:";
export function sharedHandoffKey(context: OmeroContext, workspaceId: string): string {
  return HANDOFF_PREFIX + [context.user_id, context.group_id, context.object_type, context.object_id, workspaceId].join(":");
}
export function readSharedHandoff(context: OmeroContext, workspaceId: string): Array<{ id: string; revision: string; libraryId: string }> {
  const key = sharedHandoffKey(context, workspaceId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const value = JSON.parse(raw);
    if (!Number.isFinite(value.expires) || value.expires < Date.now() || value.expires > Date.now() + 900_000 ||
      !Array.isArray(value.items) || value.items.length > 100) throw new Error("Expired or invalid library handoff");
    if (!value.items.every((i: any) => /^[a-f0-9]{64}$/.test(i.id) && /^[a-f0-9]{64}$/.test(i.revision) && /^[a-f0-9]{40}$/.test(i.libraryId))) {
      throw new Error("Invalid library references");
    }
    return value.items;
  } catch {
    localStorage.removeItem(key);
    return [];
  }
}

export function bindSharedHandoff(context: OmeroContext, launchId: string | null, workspace: WorkspaceRecord): void {
  // Existing storage uses the launch ID as a context-key suffix, not the record ID.
  if (!launchId || !workspace.contextKey.endsWith(`:workspace:${launchId}`) || workspace.userId !== context.user_id ||
    workspace.groupId !== context.group_id || workspace.objectType !== context.object_type || workspace.objectId !== context.object_id) return;
  if (!readSharedHandoff(context, launchId).length) return;
  const from = sharedHandoffKey(context, launchId), to = sharedHandoffKey(context, workspace.id);
  if (from !== to) {
    localStorage.setItem(to, localStorage.getItem(from)!);
    localStorage.removeItem(from);
  }
}

function uniqueName(name: string, used: string[]): string {
  let candidate = name, n = 2;
  const dot = name.lastIndexOf(".");
  while (used.includes(candidate)) {
    candidate = dot > 0 ? `${name.slice(0, dot)} (${n++})${name.slice(dot)}` : `${name} (${n++})`;
  }
  return candidate;
}

export async function prepareSharedImports(current: AnalysisWorkspace, libraryId: string, items: SharedLibraryItem[],
  download: (id: string, revision: string) => Promise<ArrayBuffer>): Promise<AnalysisWorkspace> {
  let next = { ...current, files: [...current.files], notebooks: [...current.notebooks] };
  for (const item of [...items].sort((a, b) => Number(a.kind === "notebook") - Number(b.kind === "notebook"))) {
    if (!item.available || !item.revision || !item.sha256) throw new Error(`${item.name} is unavailable; refresh the library`);
    const origin: SharedLibraryOrigin = { source: "shared", libraryId, itemId: item.id, revision: item.revision, sha256: item.sha256 };
    const existing = [...next.files, ...next.notebooks].some(record => !record.deletedAt &&
      record.libraryOrigin?.source === "shared" && record.libraryOrigin.libraryId === libraryId &&
      record.libraryOrigin.itemId === item.id && record.libraryOrigin.revision === item.revision);
    if (existing) continue;
    const data = await download(item.id, item.revision);
    if (data.byteLength !== item.size || await sha256(data) !== item.sha256) throw new Error(`${item.name} failed its integrity check`);
    const stamp = new Date().toISOString(), id = crypto.randomUUID();
    if (item.kind === "template") {
      const name = uniqueName(item.name, next.files.filter(f => !f.deletedAt).map(f => f.name));
      next.files.push({ id, workspaceId: current.workspace.id, name, logicalPath: `${current.workspace.rootPath}/inputs/${id}--${name}`,
        type: item.mimetype || "application/octet-stream", size: data.byteLength, sha256: item.sha256,
        source: "local", role: "template-input", state: "ready", data, libraryOrigin: origin, createdAt: stamp });
    } else {
      const document = sanitizeProtocolNotebook(parseNotebook(data));
      const contract = parseNotebookProtocol(document, true);
      next.notebooks.push({ id, workspaceId: current.workspace.id, name: uniqueName(item.name, next.notebooks.map(n => n.name)),
        document, parameterValues: contract ? parameterDefaults(contract) : undefined,
        portabilityWarning: contract ? undefined : "Legacy notebook: inputs must be checked before running.",
        attachmentIds: [], selectedDataFileIds: next.files.filter(f => f.state === "ready" && !f.deletedAt && f.source !== "result" && f.role !== "chat-attachment").map(f => f.id),
        libraryOrigin: origin, createdAt: stamp, updatedAt: stamp });
    }
  }
  return next;
}
