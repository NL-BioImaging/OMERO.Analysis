import { CHAT_URL, MAX_TOOL_TEXT, TEMPERATURE, TOOLS } from "./constants";
import type {
  Attachment,
  Bootstrap,
  ProviderSettings,
  RuntimeOutput,
  WorkspaceFile
} from "./types";

function csrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

function route(template: string, objectType: string, objectId: number): string {
  return template.replace("TYPE", objectType).replace("/1/", `/${objectId}/`);
}

export class OmeroBridge {
  private contextToken = "";
  private operations = new Set<string>();

  constructor(private readonly bootstrap: Bootstrap) {}

  get canUpload(): boolean {
    return this.operations.has("upload");
  }

  async connect(): Promise<void> {
    const context = this.bootstrap.context;
    if (!context) return;
    const response = await fetch(this.bootstrap.tokenUrl, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken()
      },
      body: JSON.stringify({
        object_type: context.object_type,
        object_id: context.object_id
      })
    });
    const body = await readJson(response);
    this.contextToken = body.context_token;
    this.operations = new Set(body.operations);
  }

  async download(attachment: Attachment): Promise<ArrayBuffer> {
    const url = this.bootstrap.downloadTemplate.replace(
      "/1/download/",
      `/${attachment.annotation_id}/download/`
    );
    const response = await fetch(url, {
      credentials: "same-origin",
      headers: { "X-OMERO-Analysis-Context": this.contextToken }
    });
    if (!response.ok) throw new Error(await errorText(response));
    return response.arrayBuffer();
  }

  async attach(file: WorkspaceFile): Promise<Attachment> {
    const context = this.bootstrap.context;
    if (!context || !file.data) throw new Error("No OMERO target or result data");
    const form = new FormData();
    form.append("file", new Blob([file.data], { type: file.type }), file.name);
    const response = await fetch(
      route(
        this.bootstrap.uploadTemplate,
        context.object_type,
        context.object_id
      ),
      {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "X-CSRFToken": csrfToken(),
          "X-OMERO-Analysis-Context": this.contextToken
        },
        body: form
      }
    );
    const body = await readJson(response);
    return body.attachment;
  }

  async listSnapshots(): Promise<Attachment[]> {
    const context = this.bootstrap.context;
    if (!context) return [];
    const response = await fetch(
      route(this.bootstrap.snapshotsTemplate, context.object_type, context.object_id),
      {
        credentials: "same-origin",
        headers: { "X-OMERO-Analysis-Context": this.contextToken }
      }
    );
    const body = await readJson(response);
    return body.snapshots || [];
  }

  async uploadSnapshot(name: string, data: Uint8Array): Promise<Attachment> {
    const context = this.bootstrap.context;
    if (!context) throw new Error("No OMERO target for the project snapshot");
    const form = new FormData();
    form.append(
      "file",
      new Blob([data as BlobPart], { type: "application/zip" }),
      name
    );
    const response = await fetch(
      route(this.bootstrap.snapshotUploadTemplate, context.object_type, context.object_id),
      {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "X-CSRFToken": csrfToken(),
          "X-OMERO-Analysis-Context": this.contextToken
        },
        body: form
      }
    );
    const body = await readJson(response);
    return body.snapshot;
  }

  async downloadSnapshot(snapshot: Attachment): Promise<ArrayBuffer> {
    const url = this.bootstrap.snapshotDownloadTemplate.replace(
      "/1/download/",
      `/${snapshot.annotation_id}/download/`
    );
    const response = await fetch(url, {
      credentials: "same-origin",
      headers: { "X-OMERO-Analysis-Context": this.contextToken }
    });
    if (!response.ok) throw new Error(await errorText(response));
    return response.arrayBuffer();
  }
}

async function errorText(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body.error?.message || `${response.status} ${response.statusText}`;
  } catch {
    return `${response.status} ${response.statusText}`;
  }
}

async function readJson(response: Response): Promise<any> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error?.message || `${response.status} ${response.statusText}`);
  }
  return body;
}

export interface AiMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

export interface AiResponse {
  choices: Array<{
    message: {
      role: "assistant";
      content: string | null;
      tool_calls?: ToolCall[];
    };
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

export async function completeChat(
  settings: ProviderSettings,
  messages: AiMessage[],
  signal: AbortSignal
): Promise<AiResponse> {
  const response = await fetch(CHAT_URL, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "api-key": settings.apiKey
    },
    body: JSON.stringify({
      model: settings.model,
      temperature: TEMPERATURE,
      messages,
      tools: TOOLS,
      tool_choice: "auto"
    })
  });
  if (!response.ok) throw new Error(await errorText(response));
  return response.json();
}

export function toolResultText(output: RuntimeOutput): string {
  const value = JSON.stringify({
    stdout: output.stdout,
    stderr: output.stderr,
    preview: output.preview,
    generated_files: output.files.map((file) => ({
      name: file.name,
      size: file.data.byteLength,
      type: file.type
    }))
  });
  return value.length > 64 * 1024
    ? `${value.slice(0, 64 * 1024)}\n[tool output truncated]`
    : value;
}

export function toolErrorText(error: unknown): string {
  const detail = String(error instanceof Error ? error.message : error)
    .slice(0, MAX_TOOL_TEXT);
  const value = JSON.stringify({
    ok: false,
    error: detail,
    instruction:
      "Inspect this error, correct the code or choose an available package, and call run_python again. Do not stop after a recoverable tool error.",
    available_packages: [
      "Python standard library",
      "numpy",
      "pandas",
      "matplotlib",
      "seaborn",
      "scipy",
      "duckdb",
      "pyarrow",
      "python-calamine",
      "xlrd"
    ]
  });
  return value.length > MAX_TOOL_TEXT
    ? `${value.slice(0, MAX_TOOL_TEXT)}\n[tool error truncated]`
    : value;
}
