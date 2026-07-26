export interface Attachment {
  annotation_id: number;
  name: string;
  mimetype: string;
  size: number;
  supported: boolean;
}

export interface OmeroContext {
  object_type: string;
  object_id: number;
  name: string;
  user_id: number;
  group_id: number;
  can_annotate: boolean;
  selected_attachments: Attachment[];
}

export interface Bootstrap {
  context: OmeroContext | null;
  tokenUrl: string;
  contextTemplate: string;
  attachmentsTemplate: string;
  downloadTemplate: string;
  uploadTemplate: string;
  runtimeBase: string;
}

export interface WorkspaceFile {
  id: string;
  name: string;
  type: string;
  size: number;
  source: "local" | "omero" | "result";
  state: "loading" | "ready" | "failed";
  data?: ArrayBuffer;
  error?: string;
  annotationId?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  kind?: "text" | "code" | "result" | "error";
  code?: string;
  preview?: unknown;
  artifacts?: string[];
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

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  sessionTokens: number;
  estimated: boolean;
}

declare global {
  interface Window {
    OMERO_ANALYSIS_CHAT: Bootstrap;
  }
}
