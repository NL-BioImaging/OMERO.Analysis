export type OmeroObjectType = "Image" | "Dataset" | "Plate" | "Screen";
export type FileSource = "local" | "omero" | "result";
export type FileState = "loading" | "ready" | "failed" | "missing";

export interface Attachment {
  annotation_id: number;
  file_id: number;
  name: string;
  mimetype: string;
  size: number;
  namespace?: string | null;
  kind: "attachment" | "result" | "project";
  supported: boolean;
}

export interface OmeroContext {
  object_type: OmeroObjectType;
  object_id: number;
  name: string;
  user_id: number;
  group_id: number;
  can_annotate: boolean;
  max_snapshot_bytes?: number;
  selected_attachments: Attachment[];
}

export interface Bootstrap {
  context: OmeroContext | null;
  tokenUrl: string;
  contextTemplate: string;
  attachmentsTemplate: string;
  downloadTemplate: string;
  uploadTemplate: string;
  snapshotsTemplate: string;
  snapshotUploadTemplate: string;
  snapshotDownloadTemplate: string;
  runtimeBase: string;
}

export interface ProjectRecord {
  id: string;
  contextKey: string;
  rootPath: string;
  name: string;
  objectType?: OmeroObjectType;
  objectId?: number;
  userId: number;
  groupId: number;
  activeChatId: string;
  plotCsv: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRecord {
  id: string;
  projectId: string;
  title: string;
  summary: string;
  archived: boolean;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceFile {
  id: string;
  projectId: string;
  chatId?: string;
  executionId?: string;
  name: string;
  logicalPath: string;
  type: string;
  size: number;
  sha256: string;
  source: FileSource;
  state: FileState;
  data?: ArrayBuffer;
  error?: string;
  annotationId?: number;
  fileId?: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  kind?: "text" | "error" | "execution";
  executionId?: string;
  createdAt: string;
}

export interface ExecutionRecord {
  id: string;
  projectId: string;
  chatId: string;
  promptId: string;
  code: string;
  codeHash: string;
  cacheKey: string;
  status: "running" | "success" | "failed" | "reused" | "incomplete";
  reusedFrom?: string;
  stdout: string;
  stderr: string;
  preview?: unknown;
  outputFileIds: string[];
  missingPlotCsv: string[];
  inputHashes: string[];
  runtimeVersion: string;
  model: string;
  createdAt: string;
}

export interface ScriptVersion {
  version: number;
  code: string;
  codeHash: string;
  executionId: string;
  createdAt: string;
}

export interface ScriptRecord {
  id: string;
  projectId: string;
  name: string;
  description: string;
  versions: ScriptVersion[];
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderSettings {
  apiKey: string;
  model: string;
  contextWindow: number;
}

export interface RuntimeOutput {
  stdout: string;
  stderr: string;
  preview: unknown;
  files: Array<{ name: string; type: string; data: ArrayBuffer }>;
}

export interface RuntimeProgress {
  percent: number;
  message: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  sessionTokens: number;
  estimated: boolean;
}

export interface ProjectWorkspace {
  project: ProjectRecord;
  chats: ChatRecord[];
  files: WorkspaceFile[];
  executions: ExecutionRecord[];
  scripts: ScriptRecord[];
}

declare global {
  interface Window {
    OMERO_ANALYSIS_CHAT: Bootstrap;
  }
}
