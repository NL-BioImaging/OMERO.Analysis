import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import type {
  AnalysisWorkspace,
  ArtifactRecord,
  ChatRecord,
  EvidenceRecord,
  ExecutionRecord,
  MethodRecord,
  NotebookRecord,
  OmeroContext,
  OutboundPayloadAudit,
  PipelineRecord,
  WorkspaceFile,
  WorkspaceRecord
} from "./types";
import { sha256 } from "./storage";
import { chatTranscriptMarkdown } from "./chatTranscript";

export const WORKSPACE_FORMAT = "nl.bioimaging.analysis.workspace.v1";
export const WORKSPACE_FORMAT_VERSION = 1;
export const MAX_ARCHIVE_ENTRIES = 10_000;
export const MAX_ARCHIVE_UNCOMPRESSED = 512 * 1024 * 1024;

export interface WorkspaceManifest {
  format: typeof WORKSPACE_FORMAT;
  version: typeof WORKSPACE_FORMAT_VERSION;
  exportedAt: string;
  workspace: WorkspaceRecord;
  chats: ChatRecord[];
  executions: ExecutionRecord[];
  methods: MethodRecord[];
  pipelines: PipelineRecord[];
  notebooks: NotebookRecord[];
  artifacts: ArtifactRecord[];
  audits: OutboundPayloadAudit[];
  evidence: EvidenceRecord[];
  files: Array<Omit<WorkspaceFile, "data"> & { archivePath?: string }>;
  omittedLocalInputs: string[];
}

export interface ArchiveResult {
  data: Uint8Array;
  filename: string;
  omittedLocalInputs: string[];
  manifest: WorkspaceManifest;
}

function safeSegment(value: string): string {
  return value.replace(/[\\/\x00-\x1f\x7f]/g, "_").replace(/^\.+$/, "_").slice(0, 180);
}

function utf8(value: string): Uint8Array {
  return new Uint8Array(strToU8(value));
}

function buildArchive(workspace: AnalysisWorkspace, omitLocal: boolean): ArchiveResult {
  const entries: Record<string, Uint8Array> = {};
  const omittedLocalInputs: string[] = [];
  const files = workspace.files.filter((file) => !file.deletedAt).map((file) => {
    const metadata: Omit<WorkspaceFile, "data"> & { archivePath?: string } = { ...file };
    delete (metadata as Partial<WorkspaceFile>).data;
    const omitted = file.source === "local" && omitLocal;
    if (omitted) {
      omittedLocalInputs.push(file.name);
      metadata.state = "missing";
      metadata.error = file.role === "chat-attachment"
        ? "Chat attachment was omitted because the Workspace snapshot exceeded its size limit. Reselect or remove it before sending this Chat."
        : "Local input was omitted because the Workspace snapshot exceeded its size limit.";
      return metadata;
    }
    if (file.source === "omero" || !file.data) return metadata;
    const owner = file.notebookId
      ? `Notebook/${safeSegment(file.notebookId)}`
      : `Chat/${safeSegment(file.chatId || "unassigned")}`;
    const archivePath = file.role === "chat-attachment"
      ? `Chat/${safeSegment(file.chatId || "unassigned")}/Attachments/${safeSegment(file.id)}--${safeSegment(file.name)}`
      : file.source === "local"
        ? `Input/${safeSegment(file.id)}--${safeSegment(file.name)}`
        : `Results/${owner}/${safeSegment(file.id)}--${safeSegment(file.name)}`;
    metadata.archivePath = archivePath;
    entries[archivePath] = new Uint8Array(file.data);
    return metadata;
  });
  const manifest: WorkspaceManifest = {
    format: WORKSPACE_FORMAT,
    version: WORKSPACE_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    workspace: { ...workspace.workspace },
    chats: workspace.chats,
    executions: workspace.executions,
    methods: workspace.methods,
    pipelines: workspace.pipelines,
    notebooks: workspace.notebooks,
    artifacts: workspace.artifacts,
    audits: workspace.audits.map((audit) => ({ ...audit, payload: "[omitted from snapshot]" })),
    evidence: workspace.evidence,
    files,
    omittedLocalInputs
  };
  entries["workspace.json"] = utf8(JSON.stringify(manifest, null, 2));
  for (const chat of workspace.chats) {
    const path = `Chat/${safeSegment(chat.id)}`;
    entries[`${path}/chat.json`] = utf8(JSON.stringify(chat, null, 2));
    entries[`${path}/chat.md`] = utf8(chatTranscriptMarkdown(chat));
  }
  for (const method of workspace.methods) {
    const path = `Methods/${safeSegment(method.id)}`;
    entries[`${path}/method.json`] = utf8(JSON.stringify(method, null, 2));
    for (const version of method.versions) {
      entries[`${path}/v${String(version.version).padStart(3, "0")}.py`] = utf8(version.code);
    }
  }
  for (const pipeline of workspace.pipelines) {
    entries[`Pipelines/${safeSegment(pipeline.id)}.json`] = utf8(JSON.stringify(pipeline, null, 2));
  }
  for (const notebook of workspace.notebooks) {
    entries[`Notebooks/${safeSegment(notebook.id)}--${safeSegment(notebook.name)}`] =
      utf8(JSON.stringify(notebook.document, null, 2));
  }
  const data = zipSync(entries, { level: 0 });
  const base = safeSegment(workspace.workspace.rootPath.split("/").at(-1) || "analysis-workspace");
  const filename = `${base}-${new Date().toISOString().replace(/[:.]/g, "-")}.oa-workspace.zip`;
  return { data, filename, omittedLocalInputs, manifest };
}

export function exportWorkspace(workspace: AnalysisWorkspace, maxBytes: number): ArchiveResult {
  const complete = buildArchive(workspace, false);
  if (complete.data.byteLength <= maxBytes) return complete;
  const withoutLocal = buildArchive(workspace, true);
  if (withoutLocal.data.byteLength > maxBytes) {
    throw new Error(
      `Chats, Methods, Notebooks, and generated results require ${
        (withoutLocal.data.byteLength / 1024 / 1024).toFixed(1)
      } MiB, exceeding the ${(maxBytes / 1024 / 1024).toFixed(0)} MiB snapshot limit.`
    );
  }
  return withoutLocal;
}

function validatePath(path: string): void {
  if (!path || path.startsWith("/") || path.startsWith("\\") || path.split(/[\\/]/).includes("..")) {
    throw new Error(`Unsafe Workspace archive path: ${path}`);
  }
}

function validateArchiveDirectory(data: Uint8Array): void {
  let end = -1;
  for (let offset = Math.max(0, data.length - 65_557); offset <= data.length - 22; offset += 1) {
    if (
      data[offset] === 0x50 && data[offset + 1] === 0x4b &&
      data[offset + 2] === 0x05 && data[offset + 3] === 0x06
    ) end = offset;
  }
  if (end < 0) throw new Error("Workspace archive has no valid ZIP directory");
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const entries = view.getUint16(end + 10, true);
  const directorySize = view.getUint32(end + 12, true);
  const directoryOffset = view.getUint32(end + 16, true);
  if (entries > MAX_ARCHIVE_ENTRIES) throw new Error("Workspace archive contains too many entries");
  if (directoryOffset + directorySize > data.length) throw new Error("Workspace archive directory is truncated");
  let offset = directoryOffset;
  let total = 0;
  for (let index = 0; index < entries; index += 1) {
    if (view.getUint32(offset, true) !== 0x02014b50) {
      throw new Error("Workspace archive contains an invalid directory entry");
    }
    const uncompressed = view.getUint32(offset + 24, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    if (uncompressed === 0xffffffff) throw new Error("ZIP64 Workspace archives are not supported");
    total += uncompressed;
    if (total > MAX_ARCHIVE_UNCOMPRESSED) {
      throw new Error("Workspace archive exceeds the 512 MiB limit");
    }
    const start = offset + 46;
    validatePath(new TextDecoder().decode(data.subarray(start, start + nameLength)));
    offset = start + nameLength + extraLength + commentLength;
    if (offset > directoryOffset + directorySize) {
      throw new Error("Workspace archive directory is malformed");
    }
  }
}

function requireManifest(value: unknown): WorkspaceManifest {
  if (!value || typeof value !== "object") throw new Error("Workspace manifest must be an object");
  const raw = value as Partial<WorkspaceManifest>;
  if (raw.format !== WORKSPACE_FORMAT || raw.version !== WORKSPACE_FORMAT_VERSION) {
    throw new Error("Unsupported OMERO Analysis Workspace format");
  }
  if (
    !raw.workspace || !Array.isArray(raw.chats) || !Array.isArray(raw.files) ||
    !Array.isArray(raw.methods) || !Array.isArray(raw.pipelines) || !Array.isArray(raw.notebooks)
  ) {
    throw new Error("Workspace manifest is missing required records");
  }
  return {
    ...raw,
    executions: Array.isArray(raw.executions) ? raw.executions : [],
    artifacts: Array.isArray(raw.artifacts) ? raw.artifacts : [],
    audits: Array.isArray(raw.audits) ? raw.audits : [],
    evidence: Array.isArray(raw.evidence) ? raw.evidence : [],
    omittedLocalInputs: Array.isArray(raw.omittedLocalInputs) ? raw.omittedLocalInputs : []
  } as WorkspaceManifest;
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

export async function importWorkspace(
  data: ArrayBuffer,
  currentContext: OmeroContext | null = null
): Promise<AnalysisWorkspace> {
  const archiveBytes = new Uint8Array(data);
  validateArchiveDirectory(archiveBytes);
  const entries = unzipSync(archiveBytes);
  const paths = Object.keys(entries);
  if (paths.length > MAX_ARCHIVE_ENTRIES) throw new Error("Workspace archive contains too many entries");
  let total = 0;
  for (const path of paths) {
    validatePath(path);
    total += entries[path].byteLength;
    if (total > MAX_ARCHIVE_UNCOMPRESSED) throw new Error("Workspace archive exceeds the 512 MiB limit");
  }
  const manifestBytes = entries["workspace.json"];
  if (!manifestBytes) throw new Error("Workspace archive does not contain workspace.json");
  const manifest = requireManifest(JSON.parse(strFromU8(manifestBytes)));
  if (containsCredentialField(manifest)) throw new Error("Workspace archive contains a credential field");

  const workspaceId = crypto.randomUUID();
  const now = new Date().toISOString();
  const chatIds = new Map(manifest.chats.map((item) => [item.id, crypto.randomUUID()]));
  const executionIds = new Map(manifest.executions.map((item) => [item.id, crypto.randomUUID()]));
  const evidenceIds = new Map(manifest.evidence.map((item) => [item.id, crypto.randomUUID()]));
  const fileIds = new Map(manifest.files.map((item) => [item.id, crypto.randomUUID()]));
  const artifactIds = new Map(manifest.artifacts.map((item) => [item.id, crypto.randomUUID()]));
  const methodIds = new Map(manifest.methods.map((item) => [item.id, crypto.randomUUID()]));
  const pipelineIds = new Map(manifest.pipelines.map((item) => [item.id, crypto.randomUUID()]));
  const notebookIds = new Map(manifest.notebooks.map((item) => [item.id, crypto.randomUUID()]));
  const chats = manifest.chats.map((chat) => ({
    ...chat,
    id: chatIds.get(chat.id)!,
    workspaceId,
    title: `${chat.title} (imported)`,
    messages: chat.messages.map((message) => ({
      ...message,
      executionId: message.executionId ? executionIds.get(message.executionId) : undefined,
      artifactId: message.artifactId ? artifactIds.get(message.artifactId) : undefined,
      citationIds: message.citationIds
        ?.map((id) => executionIds.get(id))
        .filter(Boolean) as string[] | undefined
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
      workspaceId,
      chatId: metadata.chatId ? chatIds.get(metadata.chatId) : undefined,
      notebookId: metadata.notebookId ? notebookIds.get(metadata.notebookId) : undefined,
      executionId: metadata.executionId ? executionIds.get(metadata.executionId) : undefined,
      data: fileData,
      viewer: metadata.viewer ? { ...metadata.viewer, viewerUrl: "" } : undefined,
      state: fileData || metadata.source === "omero" ? metadata.state : "missing",
      logicalPath: metadata.logicalPath.replace(
        manifest.workspace.rootPath,
        `${manifest.workspace.rootPath}--imported`
      )
    });
  }
  const executions = manifest.executions.map((execution) => ({
    ...execution,
    id: executionIds.get(execution.id)!,
    workspaceId,
    chatId: chatIds.get(execution.chatId)!,
    outputFileIds: execution.outputFileIds.map((id) => fileIds.get(id)).filter(Boolean) as string[],
    reusedFrom: execution.reusedFrom ? executionIds.get(execution.reusedFrom) : undefined,
    evidenceId: execution.evidenceId ? evidenceIds.get(execution.evidenceId) : undefined
  }));
  const methods = manifest.methods.map((method) => ({
    ...method,
    id: methodIds.get(method.id)!,
    workspaceId,
    versions: method.versions.map((version) => ({
      ...version,
      executionId: executionIds.get(version.executionId) || ""
    })),
    updatedAt: now
  }));
  const pipelines = manifest.pipelines.map((pipeline) => ({
    ...pipeline,
    id: pipelineIds.get(pipeline.id)!,
    workspaceId,
    steps: pipeline.steps.map((step) => ({
      ...step,
      id: crypto.randomUUID(),
      methodId: methodIds.get(step.methodId) || step.methodId
    })),
    updatedAt: now
  }));
  const notebooks = manifest.notebooks.map((notebook) => ({
    ...notebook,
    id: notebookIds.get(notebook.id)!,
    workspaceId,
    selectedDataFileIds: notebook.selectedDataFileIds
      .map((id) => fileIds.get(id))
      .filter(Boolean) as string[],
    updatedAt: now
  }));
  const activeChatId = chatIds.get(manifest.workspace.activeChatId) || chats[0]?.id;
  if (!activeChatId) throw new Error("Workspace archive contains no chats");
  const workspaceRecord: WorkspaceRecord = {
    ...manifest.workspace,
    id: workspaceId,
    contextKey: currentContext
      ? `${currentContext.user_id}:${currentContext.group_id}:${currentContext.object_type}:${currentContext.object_id}:import:${workspaceId}`
      : `${manifest.workspace.contextKey}:import:${workspaceId}`,
    rootPath: `${manifest.workspace.rootPath}--imported`,
    name: `${manifest.workspace.name} (imported)`,
    objectType: currentContext?.object_type || manifest.workspace.objectType,
    objectId: currentContext?.object_id || manifest.workspace.objectId,
    userId: currentContext?.user_id ?? manifest.workspace.userId,
    groupId: currentContext?.group_id ?? manifest.workspace.groupId,
    activeChatId,
    origin: {
      contextKey: manifest.workspace.contextKey,
      userId: manifest.workspace.userId,
      groupId: manifest.workspace.groupId,
      snapshotAnnotationId: manifest.workspace.sourceWorkspaceSnapshotAnnotationId
    },
    createdAt: now,
    updatedAt: now
  };
  const artifacts = manifest.artifacts.map((artifact) => ({
    ...artifact,
    id: artifactIds.get(artifact.id)!,
    workspaceId,
    chatId: chatIds.get(artifact.chatId) || activeChatId,
    executionId: artifact.executionId ? executionIds.get(artifact.executionId) : undefined,
    fileId: artifact.fileId ? fileIds.get(artifact.fileId) : undefined,
    viewer: artifact.viewer ? { ...artifact.viewer, viewerUrl: "" } : undefined
  }));
  const evidence = manifest.evidence.map((item) => ({
    ...item,
    id: evidenceIds.get(item.id)!,
    workspaceId,
    chatId: chatIds.get(item.chatId) || activeChatId,
    executionId: item.executionId ? executionIds.get(item.executionId) : undefined
  }));
  return {
    workspace: workspaceRecord,
    chats,
    files,
    executions,
    methods,
    pipelines,
    notebooks,
    artifacts,
    audits: [],
    evidence
  };
}
