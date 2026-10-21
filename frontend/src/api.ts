import type {
  Attachment,
  Bootstrap,
  OmeroHierarchy,
  WorkspaceFile,
  WorkflowSkillCatalog,
  WorkflowSkillPackage,
  AnalysisSkillProviderCatalog,
  LibraryDataset,
  SharedLibraryCatalogue,
  SharedLibraryItem,
  SyncInventory,
  SyncPlan,
  SyncStatus,
  DataQueryCapabilities,
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
  constructor(message: string, readonly status: number, readonly code?: string) {
    super(message);
  }
}

export interface QuerySaveReceipt {
  annotationId: number;
  resultToken: string;
  receipt: string;
  rowCount: number;
  completedAt: number;
}

export class OmeroBridge {
  private queryResultListeners = new Set<(result: QuerySaveReceipt) => void>();
  private schemaRequests = new Map<number, {
    promise: Promise<Record<string, any>>;
    listeners: Set<(value: Record<string, any>) => void>;
  }>();

  subscribeQueryResults(listener: (result: QuerySaveReceipt) => void): () => void {
    this.queryResultListeners.add(listener);
    return () => { this.queryResultListeners.delete(listener); };
  }

  async promoteRemoteResult(result: QuerySaveReceipt, workspaceId: string): Promise<Record<string, any>> {
    const url = this.bootstrap.dataQueryResultPromoteUrl;
    if (!url) throw new Error("Saving verified query results is unavailable");
    return readJson(await this.authorizedFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrfToken() },
      body: JSON.stringify({ result_token: result.resultToken, receipt: result.receipt, workspace_id: workspaceId })
    }));
  }
  private readonly transport: OmeroContextTransport;

  constructor(private readonly bootstrap: Bootstrap) {
    this.transport = new OmeroContextTransport(bootstrap);
  }

  get canUpload(): boolean {
    return this.transport.has("workspace_artifact");
  }

  get canSync(): boolean {
    return this.transport.has("sync_plan") && this.transport.has("sync_apply");
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

  async listAttachments(): Promise<Attachment[]> {
    const context = this.bootstrap.context;
    if (!context) return [];
    const response = await this.authorizedFetch(
      route(this.bootstrap.attachmentsTemplate, context.object_type, context.object_id)
    );
    const body = await readJson(response);
    return attachmentList(body.attachments);
  }

  private async uploadWorkspaceArtifact(workspaceId: string, kind: string, name: string, data: Blob): Promise<Attachment> {
    const context = this.bootstrap.context;
    if (!context || !workspaceId) throw new Error("An active workspace is required");
    const form = new FormData();
    form.append("kind", kind);
    form.append("file", data, name);
    const response = await this.authorizedFetch(workspaceRoute(
      this.bootstrap.workspaceSyncStatusTemplate, context.object_type, context.object_id, workspaceId
    ) + "artifact/", { method: "POST", headers: { "X-CSRFToken": csrfToken() }, body: form });
    return attachmentFrom((await readJson(response)).attachment);
  }

  async attach(file: WorkspaceFile, workspaceId: string): Promise<Attachment> {
    if (!file.data) throw new Error("No result data");
    return this.uploadWorkspaceArtifact(workspaceId, "result", file.name, new Blob([file.data], { type: file.type }));
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

  async uploadSnapshot(name: string, data: Uint8Array, workspaceId: string): Promise<Attachment> {
    return this.uploadWorkspaceArtifact(workspaceId, "snapshot", name,
      new Blob([data as BlobPart], { type: "application/zip" }));
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

  async downloadNotebook(notebook: Attachment): Promise<ArrayBuffer> {
    const url = this.bootstrap.notebookDownloadTemplate.replace(
      "/1/download/",
      `/${notebook.annotation_id}/download/`
    );
    const response = await this.authorizedFetch(url);
    if (!response.ok) throw new Error(await errorText(response));
    return response.arrayBuffer();
  }

  async uploadNotebook(name: string, data: Uint8Array, workspaceId: string): Promise<Attachment> {
    return this.uploadWorkspaceArtifact(workspaceId, "notebook", name,
      new Blob([data as BlobPart], { type: "application/x-ipynb+json" }));
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
    const bundle: BlobPart[] = [];
    for (const key of plan.uploadKeys) {
      const data = bytes.get(key);
      const item = inventory.items.find((entry) => entry.key === key);
      if (!data || !item) throw new Error(`Missing synchronization payload ${key}`);
      payloadKeys.push(key);
      if (plan.payloadEncoding === "concat-v1") bundle.push(data as BlobPart);
      else form.append(
        "payloads",
        new Blob([data as BlobPart], { type: item.mimetype }),
        item.name
      );
    }
    if (plan.payloadEncoding === "concat-v1") form.append("payload_bundle", new Blob(bundle), "workspace-payloads.bin");
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
    return syncStatusFrom(await readJson(response));
  }

  async downloadWorkspaceResult(reference: { workspaceId: string; key: string; sha256: string; size: number }): Promise<ArrayBuffer> {
    const context = this.bootstrap.context;
    if (!context) throw new Error("An OMERO context is required to restore this result");
    const url = workspaceRoute(this.bootstrap.workspaceSyncStatusTemplate, context.object_type,
      context.object_id, reference.workspaceId) + "result/?key=" + encodeURIComponent(reference.key);
    const response = await this.authorizedFetch(url);
    if (!response.ok) throw new OmeroApiError(await errorText(response), response.status);
    if (!Number.isSafeInteger(reference.size) || reference.size < 0 || !response.body) throw new Error("Invalid saved result size");
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        size += part.value.byteLength;
        if (size > reference.size) throw new Error("Restored result exceeds its declared size");
        chunks.push(part.value);
      }
    } finally { await reader.cancel(); reader.releaseLock(); }
    const buffer = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.byteLength; }
    const data = buffer.buffer;
    if (data.byteLength !== reference.size) throw new Error("Restored result size mismatch");
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", data))).map(b => b.toString(16).padStart(2, "0")).join("");
    if (digest !== reference.sha256) throw new Error("Restored result checksum mismatch");
    return data;
  }

  async manageWorkspaceDataset(datasetId: number, action?: "trash" | "restore" | "purge", revision?: number): Promise<SyncStatus> {
    const context = this.bootstrap.context;
    if (!context) throw new Error("No OMERO group for workspace management");
    const transport = new OmeroContextTransport({ ...this.bootstrap,
      context: { ...context, object_type: "Dataset", object_id: datasetId } });
    await transport.connect();
    const base = this.bootstrap.workspaceSyncStatusTemplate.split("workspace-sync/")[0];
    const response = await transport.fetch(`${base}workspace-dataset/${datasetId}/lifecycle/`, action ? {
      method: "POST", headers: { "X-CSRFToken": csrfToken(), "Content-Type": "application/json" },
      body: JSON.stringify({ action, revision })
    } : {});
    return syncStatusFrom(await readJson(response));
  }

  async changeWorkspaceLifecycle(workspaceId: string, action: "trash" | "restore" | "purge", revision: number): Promise<SyncStatus> {
    const context = this.bootstrap.context;
    if (!context) throw new Error("No OMERO context for workspace management");
    const url = workspaceRoute(this.bootstrap.workspaceSyncStatusTemplate,
      context.object_type, context.object_id, workspaceId) + "lifecycle/";
    const response = await this.authorizedFetch(url, { method: "POST",
      headers: { "X-CSRFToken": csrfToken(), "Content-Type": "application/json" },
      body: JSON.stringify({ action, revision }) });
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

  private sharedLibraryUrl(): string {
    const context = this.bootstrap.context;
    if (!context || !this.bootstrap.sharedLibraryTemplate) throw new Error("Shared library is unavailable");
    return route(this.bootstrap.sharedLibraryTemplate, context.object_type, context.object_id);
  }

  async sharedLibrary(refresh = false): Promise<SharedLibraryCatalogue> {
    const empty = { available: false, libraryId: "", canPublish: false, items: [] };
    if (!this.bootstrap.sharedLibraryTemplate || !this.bootstrap.context) return { ...empty, disabled: true };
    const response = await this.authorizedFetch(this.sharedLibraryUrl() + (refresh ? "?refresh=1" : ""));
    if (!response.ok) {
      const body = await response.json();
      return { ...empty, disabled: body.error?.code === "shared_library_disabled", error: body.error?.message || "Shared library unavailable" };
    }
    return readJson(response) as Promise<SharedLibraryCatalogue>;
  }

  async downloadSharedItem(itemId: string, revision: string): Promise<ArrayBuffer> {
    const response = await this.authorizedFetch(this.sharedLibraryUrl() + `${encodeURIComponent(itemId)}/${encodeURIComponent(revision)}/download/`);
    if (!response.ok) throw new OmeroApiError(await errorText(response), response.status);
    return response.arrayBuffer();
  }

  async sharedItemHistory(itemId: string): Promise<{ revisions: Array<{ revision: string; observedAt: number; origin: string }> }> {
    return readJson(await this.authorizedFetch(this.sharedLibraryUrl() + `${encodeURIComponent(itemId)}/history/`));
  }

  async publishSharedItem(catalogue: SharedLibraryCatalogue, file: File, kind: SharedLibraryItem["kind"], name: string,
    expectedRevision?: string): Promise<{ item: SharedLibraryItem }> {
    const body = new FormData();
    body.append("file", file);
    body.append("name", name);
    body.append("kind", kind);
    body.append("library_id", catalogue.libraryId);
    body.append("destination_revision", catalogue.destinationRevision || "");
    body.append("expected_revision", expectedRevision || "");
    return readJson(await this.authorizedFetch(this.sharedLibraryUrl(), {
      method: "POST", headers: { "X-CSRFToken": csrfToken() }, body
    }));
  }

  async listWorkflowSkills(): Promise<WorkflowSkillCatalog> {
    const response = await fetch(this.bootstrap.workflowSkillsUrl, {
      credentials: "same-origin"
    });
    return workflowSkillCatalogFrom(await readJson(response));
  }

  async dataQueryCapabilities(): Promise<DataQueryCapabilities> {
    if (!this.bootstrap.dataQueryCapabilitiesUrl) {
      throw new Error("Remote data-query capabilities are unavailable");
    }
    const body = record(
      await readJson(await fetch(this.bootstrap.dataQueryCapabilitiesUrl, {
        credentials: "same-origin"
      })),
      "remote data-query capabilities"
    );
    if (
      body.capability !== "omero-data-query-v1" ||
      typeof body.available !== "boolean" ||
      typeof body.ready !== "boolean" ||
      !Array.isArray(body.formats) ||
      !body.formats.every((item) => ["duckdb", "sqlite", "csv"].includes(String(item))) ||
      !Number.isSafeInteger(body.threshold_bytes) || body.threshold_bytes < 0 ||
      !Number.isSafeInteger(body.result_ttl_seconds) || body.result_ttl_seconds < 1
    ) {
      throw new Error("OMERO returned invalid remote data-query capabilities");
    }
    return body as unknown as DataQueryCapabilities;
  }

  async remoteSchema(annotationId: number, onProgress?: (value: Record<string, any>) => void): Promise<Record<string, any>> {
    // Inspector and compatibility checks share in-flight source preparation.
    // Keeping only pending requests ensures later checks revalidate authorization.
    let request = this.schemaRequests.get(annotationId);
    if (!request) {
      const listeners = new Set<(value: Record<string, any>) => void>();
      if (onProgress) listeners.add(onProgress);
      const promise = this.loadRemoteSchema(annotationId, value => {
        for (const listener of listeners) listener(value);
      }).finally(() => { this.schemaRequests.delete(annotationId); });
      request = { promise, listeners };
      this.schemaRequests.set(annotationId, request);
    } else if (onProgress) request.listeners.add(onProgress);
    try { return await request.promise; }
    finally { if (onProgress) request.listeners.delete(onProgress); }
  }

  private async loadRemoteSchema(annotationId: number, onProgress?: (value: Record<string, any>) => void): Promise<Record<string, any>> {
    const url = (this.bootstrap.dataSourceSchemaTemplate || "").replace(
      "/1/schema/", `/${annotationId}/schema/`
    );
    if (!onProgress) return await readJson(await this.authorizedFetch(url));
    const progressId = crypto.randomUUID();
    const suffix = `?progress_id=${progressId}`;
    let finished = false;
    let polling = false;
    const poll = async () => {
      if (finished || polling) return;
      polling = true;
      try {
        const value = await readJson(await this.authorizedFetch(url.replace("/schema/", "/progress/") + suffix));
        if (!finished) onProgress(value);
      } catch { /* Status availability must not block the query. */ }
      finally { polling = false; }
    };
    const timer = window.setInterval(() => { void poll(); }, 1000);
    try { return await readJson(await this.authorizedFetch(url + suffix)); }
    finally { finished = true; window.clearInterval(timer); }
  }

  async remoteQuery(
    annotationId: number,
    sql: string,
    parameters: Record<string, { type: string; value: unknown }>
  ): Promise<Record<string, any>> {
    const url = (this.bootstrap.dataSourceQueryTemplate || "").replace(
      "/1/query/",
      `/${annotationId}/query/`
    );
    const result = await readJson(await this.authorizedFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken()
      },
      body: JSON.stringify({ sql, parameters })
    }));
    if (typeof result.result_token === "string" && typeof result.provenance_receipt === "string") {
      const receipt: QuerySaveReceipt = {
        annotationId, resultToken: result.result_token, receipt: result.provenance_receipt,
        rowCount: Number(result.row_count), completedAt: Date.now()
      };
      this.queryResultListeners.forEach((listener) => listener(receipt));
    }
    return result;
  }

  async downloadRemoteResult(resultToken: string): Promise<ArrayBuffer> {
    const url = (this.bootstrap.dataQueryResultDownloadTemplate || "").replace(
      "TOKEN",
      encodeURIComponent(resultToken)
    );
    const response = await fetch(url, { credentials: "same-origin" });
    if (!response.ok) throw new OmeroApiError(await errorText(response), response.status);
    return response.arrayBuffer();
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
      !(skill.format == null || skill.format === "agent-skills-v1") ||
      !(skill.skills_path == null || skill.skills_path === "skills") ||
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
        skills_path: skill.skills_path === "skills" ? "skills" : "bundled/analysis_skills",
        ref_kind: "distribution",
        format: skill.format === "agent-skills-v1" ? "agent-skills-v1" : undefined
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
        !(skill.format == null || skill.format === "agent-skills-v1") ||
        !(skill.skills_path == null || skill.skills_path === "skills") ||
        typeof skill.version !== "string" ||
        typeof skill.sha256 !== "string" ||
        typeof skill.package_url !== "string"
      ) {
        throw new Error("ZarrViewer returned invalid skill metadata");
      }
    }
    return catalog as AnalysisSkillProviderCatalog;
  }

  async loadWorkflowNotebook(asset: import("./WorkflowExamples").WorkflowNotebookAsset): Promise<File> {
    const base = this.bootstrap.workflowSkillsUrl.replace(/\/?$/, "/");
    const url = `${base}${encodeURIComponent(asset.workflow_key)}/notebooks/${encodeURIComponent(asset.name)}/?sha256=${encodeURIComponent(asset.sha256)}&commit=${encodeURIComponent(asset.resolved_commit)}`;
    const response = await fetch(url, { credentials: "same-origin" });
    if (!response.ok) throw new Error(await errorText(response));
    const data = await response.arrayBuffer();
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", data)), b => b.toString(16).padStart(2, "0")).join("");
    if (digest !== asset.sha256) throw new Error("The example changed since the catalog was loaded. Refresh Libraries before importing.");
    return new File([data], `${asset.name}.ipynb`, { type: "application/x-ipynb+json" });
  }

  async loadWorkflowSkill(
    workflowKey: string,
    skillName: string
  ): Promise<WorkflowSkillPackage> {
    const catalog = await this.listWorkflowSkills();
    const candidates = catalog.workflows.flatMap((entry) =>
      entry.skills.map((skill) => ({ entry, skill }))
    );
    const exact = candidates.find(({ entry, skill }) =>
      (skill.source_key || entry.source.source_key || skill.workflow_key ||
        entry.source.workflow_key) === workflowKey && skill.name === skillName
    );
    const named = candidates.filter(({ skill }) => skill.name === skillName);
    const resolved = exact || (named.length === 1 ? named[0] : undefined);
    if (!resolved) {
      throw new Error(`Workflow skill ${workflowKey}/${skillName} is unavailable`);
    }
    const canonicalWorkflowKey = resolved.entry.source.workflow_key;
    const catalogUrl = this.bootstrap.workflowSkillsUrl.replace(/\/?$/, "/");
    const packageUrl =
      `${catalogUrl}${encodeURIComponent(canonicalWorkflowKey)}/${encodeURIComponent(skillName)}/`;
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
    throw new OmeroApiError(body.error?.message || `${response.status} ${response.statusText}`, response.status, body.error?.code);
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
    ![
      "nl.bioimaging.biomero-workflow-skills.v1",
      "nl.bioimaging.biomero-workflow-skills.v2"
    ].includes(String(body.schema)) ||
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
        !(skill.preferred_capabilities == null || (
          Array.isArray(skill.preferred_capabilities) &&
          skill.preferred_capabilities.every((item: unknown) => typeof item === "string")
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
    schema: "nl.bioimaging.biomero-workflow-skills.v2",
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
