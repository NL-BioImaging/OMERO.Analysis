import { CHAT_URL, MAX_TOOL_TEXT, TEMPERATURE, TOOLS } from "./constants";
import type {
  Attachment,
  Bootstrap,
  ProviderSettings,
  RuntimeOutput,
  OmeroHierarchy,
  WorkspaceFile,
  WorkflowSkillCatalog,
  WorkflowSkillPackage,
  ZarrViewerIntegrationStatus
} from "./types";
import { zarrViewerStatusFrom } from "./zarrViewer";

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
    if (typeof body.context_token !== "string" || !Array.isArray(body.operations) ||
        body.operations.some((value: unknown) => typeof value !== "string")) {
      throw new Error("OMERO returned an invalid context capability");
    }
    this.contextToken = body.context_token;
    this.operations = new Set(body.operations);
  }

  private async authorizedFetch(
    input: RequestInfo | URL,
    init: RequestInit = {},
    retry = true
  ): Promise<Response> {
    const response = await fetch(input, {
      ...init,
      credentials: "same-origin",
      headers: {
        ...(init.headers || {}),
        "X-OMERO-Analysis-Context": this.contextToken
      }
    });
    if (retry && (response.status === 401 || response.status === 403)) {
      await this.connect();
      return this.authorizedFetch(input, init, false);
    }
    return response;
  }

  async download(attachment: Attachment): Promise<ArrayBuffer> {
    const url = this.bootstrap.downloadTemplate.replace(
      "/1/download/",
      `/${attachment.annotation_id}/download/`
    );
    const response = await this.authorizedFetch(url);
    if (!response.ok) throw new Error(await errorText(response));
    return response.arrayBuffer();
  }

  async attach(file: WorkspaceFile): Promise<Attachment> {
    const context = this.bootstrap.context;
    if (!context || !file.data) throw new Error("No OMERO target or result data");
    const form = new FormData();
    form.append("file", new Blob([file.data], { type: file.type }), file.name);
    const response = await this.authorizedFetch(
      route(
        this.bootstrap.uploadTemplate,
        context.object_type,
        context.object_id
      ),
      {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken()
        },
        body: form
      }
    );
    const body = await readJson(response);
    return attachmentFrom(body.attachment);
  }

  async listSnapshots(): Promise<Attachment[]> {
    const context = this.bootstrap.context;
    if (!context) return [];
    const response = await this.authorizedFetch(
      route(this.bootstrap.snapshotsTemplate, context.object_type, context.object_id),
      {
        headers: {}
      }
    );
    const body = await readJson(response);
    return attachmentList(body.snapshots);
  }

  async hierarchy(): Promise<OmeroHierarchy | null> {
    const context = this.bootstrap.context;
    if (!context) return null;
    const response = await this.authorizedFetch(
      route(this.bootstrap.hierarchyTemplate, context.object_type, context.object_id)
    );
    return hierarchyFrom(await readJson(response));
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
    const response = await this.authorizedFetch(
      route(this.bootstrap.snapshotUploadTemplate, context.object_type, context.object_id),
      {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken()
        },
        body: form
      }
    );
    const body = await readJson(response);
    return attachmentFrom(body.snapshot);
  }

  async downloadSnapshot(snapshot: Attachment): Promise<ArrayBuffer> {
    const url = this.bootstrap.snapshotDownloadTemplate.replace(
      "/1/download/",
      `/${snapshot.annotation_id}/download/`
    );
    const response = await this.authorizedFetch(url);
    if (!response.ok) throw new Error(await errorText(response));
    return response.arrayBuffer();
  }

  async listWorkflowTemplates(): Promise<Attachment[]> {
    const context = this.bootstrap.context;
    if (!context) return [];
    const response = await this.authorizedFetch(
      route(this.bootstrap.workflowTemplatesTemplate, context.object_type, context.object_id)
    );
    const body = await readJson(response);
    return attachmentList(body.workflows);
  }

  async uploadWorkflowTemplate(name: string, data: Uint8Array): Promise<Attachment> {
    const context = this.bootstrap.context;
    if (!context) throw new Error("No OMERO target for the workflow template");
    const form = new FormData();
    form.append("file", new Blob([data as BlobPart], { type: "application/json" }), name);
    const response = await this.authorizedFetch(
      route(this.bootstrap.workflowTemplatesTemplate, context.object_type, context.object_id),
      { method: "POST", headers: { "X-CSRFToken": csrfToken() }, body: form }
    );
    const body = await readJson(response);
    return attachmentFrom(body.workflow);
  }

  async downloadWorkflowTemplate(template: Attachment): Promise<ArrayBuffer> {
    const url = this.bootstrap.workflowDownloadTemplate.replace(
      "/1/download/",
      `/${template.annotation_id}/download/`
    );
    const response = await this.authorizedFetch(url);
    if (!response.ok) throw new Error(await errorText(response));
    return response.arrayBuffer();
  }

  async listWorkflowSkills(): Promise<WorkflowSkillCatalog> {
    const response = await fetch(this.bootstrap.workflowSkillsUrl, {
      credentials: "same-origin"
    });
    return workflowSkillCatalogFrom(await readJson(response));
  }

  async zarrViewerStatus(): Promise<ZarrViewerIntegrationStatus> {
    const response = await fetch(this.bootstrap.zarrViewerStatusUrl, {
      credentials: "same-origin"
    });
    return zarrViewerStatusFrom(await readJson(response));
  }

  async loadWorkflowSkill(
    workflowKey: string,
    skillName: string
  ): Promise<WorkflowSkillPackage> {
    const catalog = await this.listWorkflowSkills();
    const skill = [...catalog.workflows, ...(catalog.applications || [])]
      .flatMap((entry) => entry.skills)
      .find((item) =>
        (item.source_key || item.workflow_key) === workflowKey && item.name === skillName
      );
    if (!skill) throw new Error(`Workflow skill ${workflowKey}/${skillName} is unavailable`);
    const catalogUrl = this.bootstrap.workflowSkillsUrl.replace(/\/?$/, "/");
    const packageUrl =
      `${catalogUrl}${encodeURIComponent(workflowKey)}/${encodeURIComponent(skillName)}/`;
    const response = await fetch(packageUrl, { credentials: "same-origin" });
    return workflowSkillPackageFrom(await readJson(response));
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

function record(value: unknown, label: string): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} is not a valid object`);
  }
  return value as Record<string, any>;
}

function attachmentFrom(value: unknown): Attachment {
  const item = record(value, "OMERO attachment");
  if (
    !Number.isInteger(item.annotation_id) ||
    !Number.isInteger(item.file_id) ||
    typeof item.name !== "string" ||
    typeof item.mimetype !== "string" ||
    typeof item.size !== "number" ||
    !["attachment", "result", "project", "workflow"].includes(item.kind) ||
    typeof item.supported !== "boolean"
  ) {
    throw new Error("OMERO returned invalid attachment metadata");
  }
  return item as Attachment;
}

function attachmentList(value: unknown): Attachment[] {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new Error("OMERO returned an invalid attachment list");
  return value.map(attachmentFrom);
}

function hierarchyFrom(value: unknown): OmeroHierarchy {
  const body = record(value, "OMERO hierarchy");
  const item = (input: unknown) => {
    const candidate = record(input, "OMERO hierarchy item");
    if (
      typeof candidate.type !== "string" ||
      !Number.isInteger(candidate.id) ||
      typeof candidate.name !== "string" ||
      typeof candidate.supported !== "boolean"
    ) throw new Error("OMERO returned an invalid hierarchy item");
    return candidate;
  };
  if (!Array.isArray(body.parents) || !Array.isArray(body.children)) {
    throw new Error("OMERO returned an invalid hierarchy");
  }
  return {
    current: item(body.current),
    parents: body.parents.map(item),
    children: body.children.map(item)
  } as OmeroHierarchy;
}

function workflowSkillCatalogFrom(value: unknown): WorkflowSkillCatalog {
  const body = record(value, "workflow skill catalog");
  if (
    body.schema !== "nl.bioimaging.omero-workflow-skills.v1" ||
    body.consumer !== "omero-analysis-chat" ||
    !Array.isArray(body.workflows) ||
    !(body.applications == null || Array.isArray(body.applications)) ||
    !Array.isArray(body.diagnostics)
  ) {
    throw new Error("OMERO returned an invalid workflow skill catalog");
  }
  body.applications = body.applications || [];
  for (const rawEntry of [...body.workflows, ...body.applications]) {
    const entry = record(rawEntry, "workflow skill entry");
    const source = record(entry.source, "workflow skill source");
    if (
      typeof source.workflow_key !== "string" ||
      !(source.source_kind == null || ["workflow", "application"].includes(source.source_kind)) ||
      !(source.source_key == null || typeof source.source_key === "string") ||
      typeof source.repository_url !== "string" ||
      typeof source.configured_ref !== "string" ||
      typeof source.resolved_commit !== "string" ||
      !Array.isArray(entry.skills)
    ) {
      throw new Error("OMERO returned invalid workflow skill metadata");
    }
    for (const rawSkill of entry.skills) {
      const skill = record(rawSkill, "workflow skill");
      if (
        typeof skill.name !== "string" ||
        typeof skill.sha256 !== "string" ||
        typeof skill.package_url !== "string" ||
        !skill.match ||
        typeof skill.match !== "object"
      ) {
        throw new Error("OMERO returned an invalid workflow skill");
      }
    }
  }
  return body as WorkflowSkillCatalog;
}

function workflowSkillPackageFrom(value: unknown): WorkflowSkillPackage {
  const body = record(value, "workflow skill package");
  const source = record(body.source, "workflow skill source");
  const collection = source.source_kind === "application" ? "applications" : "workflows";
  workflowSkillCatalogFrom({
    schema: "nl.bioimaging.omero-workflow-skills.v1",
    consumer: "omero-analysis-chat",
    workflows: collection === "workflows" ? [{
      source: body.source,
      status: "ready",
      checked_at: "",
      skills: [body.skill]
    }] : [],
    applications: collection === "applications" ? [{
      source: body.source,
      status: "ready",
      checked_at: "",
      skills: [body.skill]
    }] : [],
    diagnostics: []
  });
  if (!Array.isArray(body.files)) {
    throw new Error("OMERO returned an invalid workflow skill package");
  }
  for (const rawFile of body.files) {
    const file = record(rawFile, "workflow skill file");
    if (
      typeof file.path !== "string" ||
      typeof file.content !== "string" ||
      typeof file.sha256 !== "string" ||
      (file.path !== "SKILL.md" && !file.path.startsWith("references/"))
    ) {
      throw new Error("OMERO returned an unsafe workflow skill file");
    }
  }
  return body as WorkflowSkillPackage;
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
  signal: AbortSignal,
  onDelta?: (content: string) => void,
  tools: readonly unknown[] = TOOLS
): Promise<AiResponse> {
  const toolConfiguration = tools.length
    ? { tools, tool_choice: "auto" }
    : {};
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
      ...toolConfiguration,
      stream: Boolean(onDelta),
      stream_options: onDelta ? { include_usage: true } : undefined
    })
  });
  if (!response.ok) throw new Error(await errorText(response));
  if (!onDelta || !response.headers.get("content-type")?.includes("text/event-stream")) {
    return aiResponseFrom(await response.json());
  }
  const reader = response.body?.getReader();
  if (!reader) throw new Error("AmsterdamUMC returned an empty response stream");
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";
  let usage: AiResponse["usage"];
  const calls = new Map<number, ToolCall>();
  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const raw = line.slice(5).trim();
      if (!raw || raw === "[DONE]") continue;
      const event = JSON.parse(raw);
      if (event.usage) usage = event.usage;
      const delta = event.choices?.[0]?.delta;
      if (delta?.content) {
        content += delta.content;
        onDelta(content);
      }
      for (const fragment of delta?.tool_calls || []) {
        const index = Number(fragment.index || 0);
        const current = calls.get(index) || {
          id: "",
          type: "function",
          function: { name: "", arguments: "" }
        };
        current.id += fragment.id || "";
        current.function.name += fragment.function?.name || "";
        current.function.arguments += fragment.function?.arguments || "";
        calls.set(index, current);
      }
    }
    if (done) break;
  }
  return aiResponseFrom({
    choices: [{
      message: {
        role: "assistant",
        content: content || null,
        tool_calls: calls.size ? Array.from(calls.values()) : undefined
      }
    }],
    usage
  });
}

function aiResponseFrom(value: unknown): AiResponse {
  const body = record(value, "AI response");
  if (!Array.isArray(body.choices) || !body.choices.length) {
    throw new Error("AmsterdamUMC returned no response choices");
  }
  for (const choice of body.choices) {
    const message = record(record(choice, "AI choice").message, "AI message");
    if (message.role !== "assistant" || !(message.content == null || typeof message.content === "string")) {
      throw new Error("AmsterdamUMC returned an invalid assistant message");
    }
    if (message.tool_calls != null) {
      if (!Array.isArray(message.tool_calls)) throw new Error("AmsterdamUMC returned invalid tool calls");
      for (const raw of message.tool_calls) {
        const call = record(raw, "AI tool call");
        const fn = record(call.function, "AI tool function");
        if (
          typeof call.id !== "string" ||
          call.type !== "function" ||
          typeof fn.name !== "string" ||
          typeof fn.arguments !== "string"
        ) throw new Error("AmsterdamUMC returned an invalid tool call");
      }
    }
  }
  return body as AiResponse;
}

export function toolResultText(output: RuntimeOutput): string {
  const value = JSON.stringify(output.modelPayload);
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
