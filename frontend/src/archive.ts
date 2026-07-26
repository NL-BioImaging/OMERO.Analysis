import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import type {
  ChatRecord,
  ExecutionRecord,
  ProjectRecord,
  ProjectWorkspace,
  ScriptRecord,
  WorkspaceFile
} from "./types";
import { sha256 } from "./storage";

export const PROJECT_FORMAT = "nl.bioimaging.analysis-chat.project";
export const PROJECT_FORMAT_VERSION = 1;
export const MAX_ARCHIVE_ENTRIES = 10_000;
export const MAX_ARCHIVE_UNCOMPRESSED = 512 * 1024 * 1024;

interface SnapshotManifest {
  format: typeof PROJECT_FORMAT;
  version: typeof PROJECT_FORMAT_VERSION;
  exportedAt: string;
  project: ProjectRecord;
  chats: ChatRecord[];
  executions: ExecutionRecord[];
  scripts: ScriptRecord[];
  files: Array<Omit<WorkspaceFile, "data"> & { archivePath?: string }>;
  omittedLocalInputs: string[];
}

export interface ArchiveResult {
  data: Uint8Array;
  filename: string;
  omittedLocalInputs: string[];
  manifest: SnapshotManifest;
}

function safeSegment(value: string): string {
  return value.replace(/[\\/\x00-\x1f\x7f]/g, "_").replace(/^\.+$/, "_").slice(0, 180);
}

function utf8(value: string): Uint8Array {
  return new Uint8Array(strToU8(value));
}

function serializableProject(project: ProjectRecord): ProjectRecord {
  return { ...project };
}

function buildArchive(
  workspace: ProjectWorkspace,
  omitLocal: boolean
): ArchiveResult {
  const entries: Record<string, Uint8Array> = {};
  const omittedLocalInputs: string[] = [];
  const files = workspace.files.map((file) => {
    const metadata: Omit<WorkspaceFile, "data"> & { archivePath?: string } = { ...file };
    delete (metadata as Partial<WorkspaceFile>).data;
    const isOmeroInput = file.source === "omero";
    const omitted = file.source === "local" && omitLocal;
    if (omitted) {
      omittedLocalInputs.push(file.name);
      metadata.state = "missing";
      metadata.error = "Local input was omitted because the project snapshot exceeded its size limit.";
      return metadata;
    }
    if (isOmeroInput || !file.data) return metadata;
    const archivePath = file.source === "local"
      ? `inputs/local/${safeSegment(file.id)}--${safeSegment(file.name)}`
      : `chats/${safeSegment(file.chatId || "unassigned")}/outputs/${safeSegment(file.id)}--${safeSegment(file.name)}`;
    metadata.archivePath = archivePath;
    entries[archivePath] = new Uint8Array(file.data);
    return metadata;
  });
  const manifest: SnapshotManifest = {
    format: PROJECT_FORMAT,
    version: PROJECT_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    project: serializableProject(workspace.project),
    chats: workspace.chats,
    executions: workspace.executions,
    scripts: workspace.scripts,
    files,
    omittedLocalInputs
  };
  entries["project.json"] = utf8(JSON.stringify(manifest, null, 2));
  for (const chat of workspace.chats) {
    entries[`chats/${safeSegment(chat.id)}/chat.json`] = utf8(JSON.stringify(chat, null, 2));
    entries[`chats/${safeSegment(chat.id)}/chat.md`] = utf8(chatMarkdown(chat));
  }
  for (const script of workspace.scripts) {
    entries[`scripts/${safeSegment(script.id)}/script.json`] = utf8(JSON.stringify(script, null, 2));
    for (const version of script.versions) {
      entries[`scripts/${safeSegment(script.id)}/v${String(version.version).padStart(3, "0")}.py`] =
        utf8(version.code);
    }
  }
  const data = zipSync(entries, { level: 0 });
  const filename = `${safeSegment(workspace.project.rootPath.split("/").at(-1) || "analysis-project")}-${new Date().toISOString().replace(/[:.]/g, "-")}.oac.zip`;
  return { data, filename, omittedLocalInputs, manifest };
}

export function exportProject(
  workspace: ProjectWorkspace,
  maxBytes: number
): ArchiveResult {
  const complete = buildArchive(workspace, false);
  if (complete.data.byteLength <= maxBytes) return complete;
  const withoutLocal = buildArchive(workspace, true);
  if (withoutLocal.data.byteLength > maxBytes) {
    throw new Error(
      `Chats, scripts, and generated outputs require ${(withoutLocal.data.byteLength / 1024 / 1024).toFixed(1)} MiB, exceeding the ${(maxBytes / 1024 / 1024).toFixed(0)} MiB snapshot limit.`
    );
  }
  return withoutLocal;
}

function chatMarkdown(chat: ChatRecord): string {
  const lines = [`# ${chat.title}`, "", `Updated: ${chat.updatedAt}`, ""];
  if (chat.summary) lines.push("## Conversation summary", "", chat.summary, "");
  for (const message of chat.messages) {
    if (message.kind === "execution") continue;
    lines.push(`## ${message.role === "user" ? "User" : "Assistant"}`, "", message.content, "");
  }
  return lines.join("\n");
}

function validatePath(path: string): void {
  if (!path || path.startsWith("/") || path.startsWith("\\") || path.split(/[\\/]/).includes("..")) {
    throw new Error(`Unsafe project archive path: ${path}`);
  }
}

function containsCredentialField(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(containsCredentialField);
  return Object.entries(value).some(([key, child]) => {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    return normalized === "apikey" || normalized === "azurekey" ||
      normalized === "credential" || containsCredentialField(child);
  });
}

export async function importProject(data: ArrayBuffer): Promise<ProjectWorkspace> {
  const entries = unzipSync(new Uint8Array(data));
  const paths = Object.keys(entries);
  if (paths.length > MAX_ARCHIVE_ENTRIES) throw new Error("Project archive contains too many entries");
  let total = 0;
  for (const path of paths) {
    validatePath(path);
    total += entries[path].byteLength;
    if (total > MAX_ARCHIVE_UNCOMPRESSED) throw new Error("Project archive exceeds the 512 MiB workspace limit");
  }
  const manifestBytes = entries["project.json"];
  if (!manifestBytes) throw new Error("Project archive does not contain project.json");
  const manifest = JSON.parse(strFromU8(manifestBytes)) as SnapshotManifest;
  if (manifest.format !== PROJECT_FORMAT || manifest.version !== PROJECT_FORMAT_VERSION) {
    throw new Error("Unsupported Analysis Chat project format");
  }
  if (containsCredentialField(manifest)) {
    throw new Error("Project archive unexpectedly contains an API key field");
  }

  const projectId = crypto.randomUUID();
  const chatIds = new Map(manifest.chats.map((chat) => [chat.id, crypto.randomUUID()]));
  const executionIds = new Map(manifest.executions.map((execution) => [execution.id, crypto.randomUUID()]));
  const fileIds = new Map(manifest.files.map((file) => [file.id, crypto.randomUUID()]));
  const scriptIds = new Map(manifest.scripts.map((script) => [script.id, crypto.randomUUID()]));
  const now = new Date().toISOString();
  const chats = manifest.chats.map((chat) => ({
    ...chat,
    id: chatIds.get(chat.id)!,
    projectId,
    title: `${chat.title} (imported)`,
    messages: chat.messages.map((message) => ({
      ...message,
      executionId: message.executionId ? executionIds.get(message.executionId) : undefined
    })),
    updatedAt: now
  }));
  const files: WorkspaceFile[] = [];
  for (const metadata of manifest.files) {
    let fileData: ArrayBuffer | undefined;
    if (metadata.archivePath) {
      validatePath(metadata.archivePath);
      const bytes = entries[metadata.archivePath];
      if (!bytes) throw new Error(`Missing archived file: ${metadata.archivePath}`);
      fileData = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
      if (metadata.sha256 && await sha256(fileData) !== metadata.sha256) {
        throw new Error(`Hash mismatch for ${metadata.name}`);
      }
    }
    files.push({
      ...metadata,
      id: fileIds.get(metadata.id)!,
      projectId,
      chatId: metadata.chatId ? chatIds.get(metadata.chatId) : undefined,
      executionId: metadata.executionId ? executionIds.get(metadata.executionId) : undefined,
      data: fileData,
      state: fileData || metadata.source === "omero" ? metadata.state : "missing",
      logicalPath: metadata.logicalPath.replace(manifest.project.rootPath, `${manifest.project.rootPath}--imported`)
    });
  }
  const executions = manifest.executions.map((execution) => ({
    ...execution,
    id: executionIds.get(execution.id)!,
    projectId,
    chatId: chatIds.get(execution.chatId)!,
    outputFileIds: execution.outputFileIds.map((id) => fileIds.get(id)).filter(Boolean) as string[],
    reusedFrom: execution.reusedFrom ? executionIds.get(execution.reusedFrom) : undefined
  }));
  const scripts = manifest.scripts.map((script) => ({
    ...script,
    id: scriptIds.get(script.id)!,
    projectId,
    versions: script.versions.map((version) => ({
      ...version,
      executionId: executionIds.get(version.executionId) || ""
    })),
    updatedAt: now
  }));
  const activeChatId = chatIds.get(manifest.project.activeChatId) || chats[0]?.id;
  if (!activeChatId) throw new Error("Project archive contains no chats");
  const project: ProjectRecord = {
    ...manifest.project,
    id: projectId,
    contextKey: `${manifest.project.contextKey}:import:${projectId}`,
    rootPath: `${manifest.project.rootPath}--imported`,
    name: `${manifest.project.name} (imported)`,
    activeChatId,
    createdAt: now,
    updatedAt: now
  };
  return { project, chats, files, executions, scripts };
}
