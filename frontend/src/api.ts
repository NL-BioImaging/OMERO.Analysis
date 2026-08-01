import { MAX_TOOL_TEXT, TEMPERATURE, TOOLS } from "./constants";
import type {
  Attachment,
  Bootstrap,
  ProviderSettings,
  RuntimeOutput,
  OmeroHierarchy,
  WorkspaceFile,
  WorkflowSkillCatalog,
  WorkflowSkillPackage,
  AnalysisSkillProviderCatalog,
  LibraryDataset,
  SyncInventory,
  SyncPlan,
  SyncStatus,
  AnalysisSettingsBundle,
  AnalysisSettingsStatus,
  ZarrViewerIntegrationStatus
} from "./types";
import { zarrViewerStatusFrom } from "./zarrViewer";
import { csrfToken, OmeroContextTransport } from "./omeroTransport";

function route(template: string, objectType: string, objectId: number): string {
  return template.replace("TYPE", objectType).replace("/1/", `/${objectId}/`);
}

function workspaceRoute(
  template: string,
  objectType: string,
  objectId: number,
  workspaceId: string
): string {
  return route(template, objectType, objectId).replace(
    "WORKSPACE",
    encodeURIComponent(workspaceId)
  );
}

export class OmeroApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export class OmeroBridge {
  private readonly transport: OmeroContextTransport;

  constructor(private readonly bootstrap: Bootstrap) {
    this.transport = new OmeroContextTransport(bootstrap);
  }

  get canUpload(): boolean {
    return this.transport.has("upload");
  }

  get canSync(): boolean {
    return this.transport.has("sync_plan") && this.transport.has("sync_apply");
  }

  get canSettingsSync(): boolean {
    return this.transport.has("settings_sync");
  }

  async connect(): Promise<void> {
    await this.transport.connect();
  }

  private async authorizedFetch(
    input: RequestInfo | URL,
    init: RequestInit = {},
    retry = true
  ): Promise<Response> {
    return this.transport.fetch(input, init, retry);
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
    if (!context) throw new Error("No OMERO target for the workspace snapshot");
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

  async listPipelineTemplates(): Promise<Attachment[]> {
    const context = this.bootstrap.context;
    if (!context) return [];
    const response = await this.authorizedFetch(
      route(this.bootstrap.pipelineTemplatesTemplate, context.object_type, context.object_id)
    );
    const body = await readJson(response);
    return attachmentList(body.pipelines);
  }

  async uploadPipelineTemplate(name: string, data: Uint8Array): Promise<Attachment> {
    const context = this.bootstrap.context;
    if (!context) throw new Error("No OMERO target for the pipeline template");
    const form = new FormData();
    form.append("file", new Blob([data as BlobPart], { type: "application/json" }), name);
    const response = await this.authorizedFetch(
      route(this.bootstrap.pipelineTemplatesTemplate, context.object_type, context.object_id),
      { method: "POST", headers: { "X-CSRFToken": csrfToken() }, body: form }
    );
    const body = await readJson(response);
    return attachmentFrom(body.pipeline);
  }

  async downloadPipelineTemplate(template: Attachment): Promise<ArrayBuffer> {
    const url = this.bootstrap.pipelineDownloadTemplate.replace(
      "/1/download/",
      `/${template.annotation_id}/download/`
    );
    const response = await this.authorizedFetch(url);
    if (!response.ok) throw new Error(await errorText(response));
    return response.arrayBuffer();
  }

  async downloadNotebook(notebook: Attachment): Promise<ArrayBuffer> {
    const url = this.bootstrap.notebookDownloadTemplate.replace(
      "/1/download/",
      `/${notebook.annotation_id}/download/`
    );
    const response = await this.authorizedFetch(url);
    if (!response.ok) throw new Error(await errorText(response));
    return response.arrayBuffer();
  }

  async uploadNotebook(name: string, data: Uint8Array): Promise<Attachment> {
    const context = this.bootstrap.context;
    if (!context) throw new Error("No OMERO target for the notebook");
    const form = new FormData();
    form.append(
      "file",
      new Blob([data as BlobPart], { type: "application/x-ipynb+json" }),
      name
    );
    const response = await this.authorizedFetch(
      route(this.bootstrap.notebookUploadTemplate, context.object_type, context.object_id),
      { method: "POST", headers: { "X-CSRFToken": csrfToken() }, body: form }
    );
    const body = await readJson(response);
    return attachmentFrom(body.notebook);
  }

  async syncStatus(workspaceId: string): Promise<SyncStatus> {
    const context = this.bootstrap.context;
    if (!context) throw new Error("No OMERO context for synchronization");
    const response = await this.authorizedFetch(workspaceRoute(
      this.bootstrap.workspaceSyncStatusTemplate,
      context.object_type,
      context.object_id,
      workspaceId
    ));
    return syncStatusFrom(await readJson(response));
  }

  async planWorkspaceSync(inventory: SyncInventory): Promise<SyncPlan> {
    const context = this.bootstrap.context;
    if (!context) throw new Error("No OMERO context for synchronization");
    const response = await this.authorizedFetch(workspaceRoute(
      this.bootstrap.workspaceSyncPlanTemplate,
      context.object_type,
      context.object_id,
      inventory.workspace.id
    ), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken()
      },
      body: JSON.stringify(inventory)
    });
    return syncPlanFrom(await readJson(response));
  }

  async applyWorkspaceSync(
    inventory: SyncInventory,
    plan: SyncPlan,
    bytes: Map<string, Uint8Array>
  ): Promise<SyncStatus> {
    const context = this.bootstrap.context;
    if (!context) throw new Error("No OMERO context for synchronization");
    const form = new FormData();
    form.append("inventory", JSON.stringify(inventory));
    form.append("plan_token", plan.planToken);
    const payloadKeys: string[] = [];
    for (const key of plan.uploadKeys) {
      const data = bytes.get(key);
      const item = inventory.items.find((entry) => entry.key === key);
      if (!data || !item) throw new Error(`Missing synchronization payload ${key}`);
      payloadKeys.push(key);
      form.append(
        "payloads",
        new Blob([data as BlobPart], { type: item.mimetype }),
        item.name
      );
    }
    form.append("payload_keys", JSON.stringify(payloadKeys));
    const response = await this.authorizedFetch(workspaceRoute(
      this.bootstrap.workspaceSyncApplyTemplate,
      context.object_type,
      context.object_id,
      inventory.workspace.id
    ), {
      method: "POST",
      headers: { "X-CSRFToken": csrfToken() },
      body: form
    });
    if (!response.ok) throw new OmeroApiError(await errorText(response), response.status);
    return syncStatusFrom(await readJson(response));
  }

  async removeWorkspaceSync(workspaceId: string): Promise<{
    removed: number;
    datasetDeleted: boolean;
    preservedUnmanaged: number;
  }> {
    const context = this.bootstrap.context;
    if (!context) throw new Error("No OMERO context for synchronization");
    const response = await this.authorizedFetch(workspaceRoute(
      this.bootstrap.workspaceSyncRemoveTemplate,
      context.object_type,
      context.object_id,
      workspaceId
    ), {
      method: "DELETE",
      headers: { "X-CSRFToken": csrfToken() }
    });
    const body = await readJson(response);
    return {
      removed: Number(body.removed || 0),
      datasetDeleted: Boolean(body.dataset_deleted),
      preservedUnmanaged: Number(body.preserved_unmanaged || 0)
    };
  }

  async workspaceLibrary(): Promise<LibraryDataset[]> {
    const context = this.bootstrap.context;
    if (!context) return [];
    const response = await this.authorizedFetch(route(
      this.bootstrap.workspaceLibraryTemplate,
      context.object_type,
      context.object_id
    ));
    const body = await readJson(response);
    if (!Array.isArray(body.datasets)) throw new Error("OMERO returned an invalid library");
    return body.datasets as LibraryDataset[];
  }

  async downloadLibraryItem(annotationId: number): Promise<ArrayBuffer> {
    const url = this.bootstrap.workspaceLibraryDownloadTemplate.replace(
      "/1/download/",
      `/${annotationId}/download/`
    );
    const response = await this.authorizedFetch(url);
    if (!response.ok) throw new OmeroApiError(await errorText(response), response.status);
    return response.arrayBuffer();
  }

  async analysisSettings(): Promise<AnalysisSettingsStatus> {
    const context = this.bootstrap.context;
    if (!context) {
      return {
        schema: "nl.bioimaging.analysis.settings.bundle.v1",
        synced: false,
        payload: null
      };
    }
    const response = await this.authorizedFetch(route(
      this.bootstrap.analysisSettingsTemplate,
      context.object_type,
      context.object_id
    ));
    return await readJson(response) as AnalysisSettingsStatus;
  }

  async syncAnalysisSettings(
    bundle: AnalysisSettingsBundle
  ): Promise<AnalysisSettingsStatus> {
    const context = this.bootstrap.context;
    if (!context) throw new Error("No OMERO context for settings synchronization");
    const response = await this.authorizedFetch(route(
      this.bootstrap.analysisSettingsTemplate,
      context.object_type,
      context.object_id
    ), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken()
      },
      body: JSON.stringify(bundle)
    });
    return await readJson(response) as AnalysisSettingsStatus;
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

  async loadZarrViewerSkill(): Promise<WorkflowSkillPackage> {
    const catalog = await this.listZarrViewerSkills();
    const summary = catalog.skills.find(
      (item: unknown) => record(item, "ZarrViewer skill").name === "use-omero-zarr-viewer"
    );
    if (!summary || typeof summary.package_url !== "string") {
      throw new Error("ZarrViewer operation skill is unavailable");
    }
    const body = record(
      await readJson(await fetch(summary.package_url, { credentials: "same-origin" })),
      "ZarrViewer skill package"
    );
    const skill = record(body.skill, "ZarrViewer skill");
    if (
      skill.name !== "use-omero-zarr-viewer" ||
      typeof skill.version !== "string" ||
      typeof skill.sha256 !== "string" ||
      !Array.isArray(body.files)
    ) {
      throw new Error("ZarrViewer returned an invalid skill package");
    }
    const provider = record(body.provider, "ZarrViewer skill provider");
    return {
      source: {
        workflow_key: "biomero-zarr-viewer",
        source_kind: "application",
        source_key: "biomero-zarr-viewer",
        repository_url: "BIOMERO.ZarrViewer",
        configured_ref: String(provider.version || ""),
        resolved_commit: String(provider.version || ""),
        skills_path: "bundled/analysis_skills",
        ref_kind: "distribution"
      },
      skill: {
        workflow_key: "biomero-zarr-viewer",
        source_kind: "application",
        source_key: "biomero-zarr-viewer",
        name: skill.name,
        description: String(skill.description || ""),
        purpose: String(skill.purpose || "application-operation"),
        consumers: Array.isArray(skill.consumers) ? skill.consumers : ["omero-analysis"],
        version: skill.version,
        sha256: skill.sha256,
        package_url: summary.package_url,
        required_resources: Array.isArray(skill.required_resources) ? skill.required_resources : [],
        required_capabilities: Array.isArray(skill.required_capabilities) ? skill.required_capabilities : [],
        match: skill.match || {
          extensions: [], filename_globs: [], required_tables: [], auto_activate: false
        }
      },
      files: body.files.map((item: unknown) => {
        const file = record(item, "ZarrViewer skill file");
        if (
          typeof file.path !== "string" ||
          typeof file.content !== "string" ||
          typeof file.sha256 !== "string" ||
          (file.path !== "SKILL.md" && !file.path.startsWith("references/"))
        ) {
          throw new Error("ZarrViewer returned an unsafe skill file");
        }
        return file;
      })
    } as WorkflowSkillPackage;
  }

  async listZarrViewerSkills(): Promise<AnalysisSkillProviderCatalog> {
    const status = await this.zarrViewerStatus();
    if (!status.available || !status.skill_catalog_url) {
      throw new Error("ZarrViewer skill provider is unavailable");
    }
    const catalog = record(
      await readJson(await fetch(status.skill_catalog_url, { credentials: "same-origin" })),
      "ZarrViewer skill catalog"
    );
    const provider = record(catalog.provider, "ZarrViewer skill provider");
    if (
      catalog.schema !== "nl.bioimaging.analysis-skill-provider.v1" ||
      !Array.isArray(catalog.skills) ||
      typeof provider.name !== "string" ||
      typeof provider.distribution !== "string" ||
      typeof provider.version !== "string" ||
      typeof provider.source !== "string" ||
      typeof provider.health !== "string"
    ) {
      throw new Error("ZarrViewer returned an invalid skill catalog");
    }
    for (const raw of catalog.skills) {
      const skill = record(raw, "ZarrViewer skill");
      if (
        typeof skill.name !== "string" ||
        typeof skill.version !== "string" ||
        typeof skill.sha256 !== "string" ||
        typeof skill.package_url !== "string"
      ) {
        throw new Error("ZarrViewer returned invalid skill metadata");
      }
    }
    return catalog as AnalysisSkillProviderCatalog;
  }

  async loadWorkflowSkill(
    workflowKey: string,
    skillName: string
  ): Promise<WorkflowSkillPackage> {
    const catalog = await this.listWorkflowSkills();
    const skill = catalog.workflows
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
    const message = body.error?.message || `${response.status} ${response.statusText}`;
    const requestId = body.error?.request_id || response.headers.get("X-OMERO-Analysis-Request-ID");
    return requestId ? `${message} (request ${requestId})` : message;
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

function syncStatusFrom(value: unknown): SyncStatus {
  const item = record(value, "Workspace synchronization status");
  if (
    item.schema !== "nl.bioimaging.analysis.sync.status.v1" ||
    typeof item.canSync !== "boolean" ||
    typeof item.linked !== "boolean" ||
    typeof item.remoteRevision !== "number" ||
    typeof item.inventoryDigest !== "string"
  ) throw new Error("OMERO returned an invalid synchronization status");
  return item as unknown as SyncStatus;
}

function syncPlanFrom(value: unknown): SyncPlan {
  const item = record(value, "Workspace synchronization plan");
  if (
    item.schema !== "nl.bioimaging.analysis.sync.plan.v1" ||
    typeof item.planToken !== "string" ||
    !Array.isArray(item.uploadKeys) ||
    item.uploadKeys.some((key) => typeof key !== "string")
  ) throw new Error("OMERO returned an invalid synchronization plan");
  return item as unknown as SyncPlan;
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
    !["attachment", "result", "workspace", "pipeline", "notebook"].includes(item.kind) ||
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
    body.consumer !== "omero-analysis" ||
    !Array.isArray(body.workflows) ||
    !Array.isArray(body.diagnostics)
  ) {
    throw new Error("OMERO returned an invalid workflow skill catalog");
  }
  for (const rawEntry of body.workflows) {
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
        !(skill.required_resources == null || (
          Array.isArray(skill.required_resources) &&
          skill.required_resources.every((item: unknown) => typeof item === "string")
        )) ||
        !(skill.required_capabilities == null || (
          Array.isArray(skill.required_capabilities) &&
          skill.required_capabilities.every((item: unknown) => typeof item === "string")
        )) ||
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
  if (source.source_kind === "application") {
    throw new Error("Application skills are served by their owning application provider");
  }
  workflowSkillCatalogFrom({
    schema: "nl.bioimaging.omero-workflow-skills.v1",
    consumer: "omero-analysis",
    workflows: [{
      source: body.source,
      status: "ready",
      checked_at: "",
      skills: [body.skill]
    }],
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
  return settings.protocol === "anthropic"
    ? completeAnthropic(settings, messages, signal, onDelta, tools)
    : completeOpenAi(settings, messages, signal, onDelta, tools);
}

export async function validateProviderConnection(
  settings: ProviderSettings,
  signal: AbortSignal
): Promise<string> {
  if (!settings.endpoint.trim()) throw new Error("The API endpoint is empty");
  if (!settings.model.trim()) throw new Error("The model or deployment is empty");
  if (
    (settings.protocol === "anthropic" || settings.authMode !== "none") &&
    !settings.apiKey.trim()
  ) {
    throw new Error("The API key is empty");
  }
  const endpoint = providerEndpoint(settings);
  const isAnthropic = settings.protocol === "anthropic";
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (isAnthropic) {
    headers["x-api-key"] = settings.apiKey;
    headers["anthropic-version"] = "2023-06-01";
  } else if (settings.authMode === "api-key") {
    headers["api-key"] = settings.apiKey;
  } else if (settings.authMode === "bearer") {
    headers.Authorization = `Bearer ${settings.apiKey}`;
  }
  const openAiBody = (tokenParameter: "max_tokens" | "max_completion_tokens") => ({
    model: settings.model,
    [tokenParameter]: tokenParameter === "max_completion_tokens" ? 128 : 1,
    messages: [{ role: "user", content: "Reply OK" }]
  });
  const prefersCompletionTokens = /^(?:gpt-5|o[1-9])(?:[-.]|$)/i.test(
    settings.model.trim()
  );
  const request = (tokenParameter: "max_tokens" | "max_completion_tokens") =>
    fetch(endpoint, {
      method: "POST",
      signal,
      headers,
      body: JSON.stringify(isAnthropic ? {
        model: settings.model,
        max_tokens: 1,
        messages: [{ role: "user", content: "Reply OK" }]
      } : openAiBody(tokenParameter))
    });
  let response: Response;
  try {
    const preferred = prefersCompletionTokens
      ? "max_completion_tokens"
      : "max_tokens";
    response = await request(preferred);
    if (!isAnthropic && response.status === 400) {
      const detail = await response.clone().text().catch(() => "");
      const unsupported = detail.toLowerCase().includes("unsupported parameter");
      const namesAlternative =
        detail.includes("max_completion_tokens") || detail.includes("max_tokens");
      if (unsupported && namesAlternative) {
        response = await request(
          preferred === "max_tokens" ? "max_completion_tokens" : "max_tokens"
        );
      }
    }
  } catch (error) {
    if (signal.aborted) throw new Error("Connection validation timed out");
    throw new Error(
      `The browser could not reach the endpoint. Check the URL, TLS certificate, network, and CORS policy. ${String(error)}`
    );
  }
  if (!response.ok) {
    const detail = await errorText(response);
    const hint = response.status === 401 || response.status === 403
      ? " Check the API key and authentication-header type."
      : response.status === 404
        ? " Check whether the endpoint is a base URL or a complete API route."
        : response.status === 400
          ? " Check the model/deployment name and provider protocol."
          : "";
    throw new Error(`${response.status} ${detail}.${hint}`.replace(/\.\./g, "."));
  }
  const body = await response.json().catch(() => null);
  if (!body || typeof body !== "object") {
    throw new Error("The provider responded, but its response was not valid JSON");
  }
  if (isAnthropic) {
    if (!Array.isArray((body as any).content)) {
      throw new Error("The endpoint responded but not with an Anthropic Messages response");
    }
  } else if (!Array.isArray((body as any).choices)) {
    throw new Error("The endpoint responded but not with an OpenAI-compatible response");
  }
  return `Connection validated for ${settings.model} at ${endpoint}`;
}

export function providerLabel(settings: ProviderSettings): string {
  return settings.protocol === "anthropic" ? "Anthropic" : "AI provider";
}

export function providerEndpoint(settings: ProviderSettings): string {
  const value = settings.endpoint.trim().replace(/\/+$/, "");
  if (!value) throw new Error("Configure an AI API endpoint in Settings");
  if (settings.protocol === "anthropic") {
    return /\/messages$/i.test(value) ? value : `${value}/v1/messages`;
  }
  return /\/chat\/completions$/i.test(value)
    ? value
    : `${value}/chat/completions`;
}

async function completeOpenAi(
  settings: ProviderSettings,
  messages: AiMessage[],
  signal: AbortSignal,
  onDelta?: (content: string) => void,
  tools: readonly unknown[] = TOOLS
): Promise<AiResponse> {
  const toolConfiguration = tools.length
    ? { tools, tool_choice: "auto" }
    : {};
  const authorization: Record<string, string> = settings.authMode === "api-key"
    ? { "api-key": settings.apiKey }
    : settings.authMode === "bearer"
      ? { Authorization: `Bearer ${settings.apiKey}` }
      : {};
  const response = await fetch(providerEndpoint(settings), {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      ...authorization
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
    return aiResponseFrom(await response.json(), providerLabel(settings));
  }
  const reader = response.body?.getReader();
  if (!reader) throw new Error(`${providerLabel(settings)} returned an empty response stream`);
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
  }, providerLabel(settings));
}

type AnthropicBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: unknown }
  | { type: "tool_result"; tool_use_id: string; content: string };

function anthropicMessages(messages: AiMessage[]) {
  const system = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content || "")
    .filter(Boolean)
    .join("\n\n");
  const converted: Array<{ role: "user" | "assistant"; content: string | AnthropicBlock[] }> = [];
  for (const message of messages.filter((item) => item.role !== "system")) {
    let role: "user" | "assistant";
    let content: string | AnthropicBlock[];
    if (message.role === "assistant") {
      role = "assistant";
      const blocks: AnthropicBlock[] = [];
      if (message.content) blocks.push({ type: "text", text: message.content });
      for (const call of message.tool_calls || []) {
        let input: unknown = {};
        try {
          input = JSON.parse(call.function.arguments || "{}");
        } catch {
          input = {};
        }
        blocks.push({
          type: "tool_use",
          id: call.id,
          name: call.function.name,
          input
        });
      }
      content = blocks.length ? blocks : "";
    } else if (message.role === "tool") {
      role = "user";
      content = [{
        type: "tool_result",
        tool_use_id: message.tool_call_id || "",
        content: message.content || ""
      }];
    } else {
      role = "user";
      content = message.content || "";
    }
    const previous = converted.at(-1);
    if (previous?.role === role) {
      const priorBlocks: AnthropicBlock[] = typeof previous.content === "string"
        ? [{ type: "text", text: previous.content }]
        : previous.content;
      const nextBlocks: AnthropicBlock[] = typeof content === "string"
        ? [{ type: "text", text: content }]
        : content;
      previous.content = [...priorBlocks, ...nextBlocks];
    } else {
      converted.push({ role, content });
    }
  }
  return { system, messages: converted };
}

function anthropicTools(tools: readonly unknown[]) {
  return tools.flatMap((raw) => {
    const outer = raw && typeof raw === "object"
      ? raw as Record<string, unknown>
      : {};
    const fn = outer.function && typeof outer.function === "object"
      ? outer.function as Record<string, unknown>
      : {};
    return typeof fn.name === "string"
      ? [{
          name: fn.name,
          description: typeof fn.description === "string" ? fn.description : "",
          input_schema: fn.parameters || {
            type: "object",
            properties: {},
            additionalProperties: false
          }
        }]
      : [];
  });
}

async function completeAnthropic(
  settings: ProviderSettings,
  messages: AiMessage[],
  signal: AbortSignal,
  onDelta?: (content: string) => void,
  tools: readonly unknown[] = TOOLS
): Promise<AiResponse> {
  const converted = anthropicMessages(messages);
  const response = await fetch(providerEndpoint(settings), {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": settings.apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: settings.model,
      max_tokens: 4096,
      temperature: TEMPERATURE,
      system: converted.system || undefined,
      messages: converted.messages,
      tools: tools.length ? anthropicTools(tools) : undefined
    })
  });
  if (!response.ok) throw new Error(await errorText(response));
  const body = record(await response.json(), "Anthropic response");
  if (!Array.isArray(body.content)) {
    throw new Error("Anthropic returned an invalid response");
  }
  const text = body.content
    .filter((block: unknown) =>
      Boolean(block && typeof block === "object" &&
        (block as Record<string, unknown>).type === "text")
    )
    .map((block: unknown) => String((block as Record<string, unknown>).text || ""))
    .join("");
  const toolCalls: ToolCall[] = body.content.flatMap((block: unknown) => {
    const value = block && typeof block === "object"
      ? block as Record<string, unknown>
      : {};
    if (
      value.type !== "tool_use" ||
      typeof value.id !== "string" ||
      typeof value.name !== "string"
    ) return [];
    return [{
      id: value.id,
      type: "function" as const,
      function: {
        name: value.name,
        arguments: JSON.stringify(value.input || {})
      }
    }];
  });
  const rawUsage = body.usage && typeof body.usage === "object"
    ? body.usage as Record<string, unknown>
    : {};
  const promptTokens = Number(rawUsage.input_tokens || 0);
  const completionTokens = Number(rawUsage.output_tokens || 0);
  if (text && onDelta) onDelta(text);
  return {
    choices: [{
      message: {
        role: "assistant",
        content: text || null,
        tool_calls: toolCalls.length ? toolCalls : undefined
      }
    }],
    usage: {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: promptTokens + completionTokens
    }
  };
}

function aiResponseFrom(value: unknown, provider = "AI provider"): AiResponse {
  const body = record(value, "AI response");
  if (!Array.isArray(body.choices) || !body.choices.length) {
    throw new Error(`${provider} returned no response choices`);
  }
  for (const choice of body.choices) {
    const message = record(record(choice, "AI choice").message, "AI message");
    if (message.role !== "assistant" || !(message.content == null || typeof message.content === "string")) {
      throw new Error(`${provider} returned an invalid assistant message`);
    }
    if (message.tool_calls != null) {
      if (!Array.isArray(message.tool_calls)) throw new Error(`${provider} returned invalid tool calls`);
      for (const raw of message.tool_calls) {
        const call = record(raw, "AI tool call");
        const fn = record(call.function, "AI tool function");
        if (
          typeof call.id !== "string" ||
          call.type !== "function" ||
          typeof fn.name !== "string" ||
          typeof fn.arguments !== "string"
        ) throw new Error(`${provider} returned an invalid tool call`);
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
