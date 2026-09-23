import { samePlot } from "./plotGroups";
import { exportWorkspace } from "./archive";
import { sha256 } from "./storage";
import type {
  AnalysisWorkspace,
  OmeroContext,
  SyncStatus,
  SyncInventory,
  SyncInventoryItem,
  SyncItemKind,
  SyncPayload
} from "./types";

const encoder = new TextEncoder();

export function withWorkspaceSyncStatus(
  workspace: AnalysisWorkspace,
  synced: SyncStatus,
  timestamp: string
): AnalysisWorkspace {
  if (
    !synced.linked ||
    !synced.projectId ||
    !synced.datasetId ||
    !synced.manifestAnnotationId
  ) {
    throw new Error("OMERO returned an incomplete linked Workspace status");
  }
  return {
    ...workspace,
    workspace: {
      ...workspace.workspace,
      lifecycleRevision: synced.lifecycleRevision || 0,
      omeroSync: {
        projectId: synced.projectId,
        datasetId: synced.datasetId,
        manifestAnnotationId: synced.manifestAnnotationId,
        remoteRevision: synced.remoteRevision,
        inventoryDigest: synced.inventoryDigest,
        lastSyncedAt: synced.lastSyncedAt || timestamp
      }
    }
  };
}

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, canonical(child)])
    );
  }
  return value;
}

export function canonicalJson(value: unknown): string {
  return `${JSON.stringify(canonical(value), null, 2)}\n`;
}

function safeName(value: string): string {
  return value
    .replace(/[\\/\u0000-\u001f\u007f]+/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180) || "analysis";
}

function slug(value: string): string {
  return safeName(value)
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "analysis";
}

function resultStem(path: string): string {
  return path.replace(/\\/g, "/").replace(/\.[^/.]+$/, "").toLowerCase();
}

const isPlotPair = samePlot;

async function itemFromBytes(
  key: string,
  kind: SyncItemKind,
  name: string,
  mimetype: string,
  logicalPath: string,
  bytes: Uint8Array,
  metadata: Record<string, unknown> = {}
): Promise<SyncInventoryItem> {
  return {
    key,
    kind,
    name: safeName(name),
    mimetype,
    size: bytes.byteLength,
    sha256: await sha256(bytes.slice().buffer),
    logicalPath,
    metadata
  };
}

export async function buildWorkspaceSyncPayload(
  workspace: AnalysisWorkspace,
  context: OmeroContext
): Promise<SyncPayload> {
  const items: SyncInventoryItem[] = [];
  const bytes = new Map<string, Uint8Array>();
  const add = async (
    key: string,
    kind: SyncItemKind,
    name: string,
    mimetype: string,
    logicalPath: string,
    data: Uint8Array,
    metadata: Record<string, unknown> = {}
  ) => {
    if (bytes.has(key)) throw new Error(`Duplicate synchronization item key: ${key}`);
    bytes.set(key, data);
    items.push(await itemFromBytes(
      key, kind, name, mimetype, logicalPath, data, metadata
    ));
  };

  const resultGroups = new Map<string, {
    kind: SyncItemKind;
    mimetype: string;
    sha256: string;
    data?: Uint8Array;
    size: number;
    files: typeof workspace.files;
  }>();
  for (const file of workspace.files
    .filter((entry) =>
      entry.source === "result" &&
      Boolean(entry.runId || entry.methodId || entry.pipelineId || entry.notebookId)
    )
    .sort((left, right) =>
      left.name.localeCompare(right.name) || left.id.localeCompare(right.id)
    )) {
    if (!file.data && !file.remoteResult) throw new Error(`Result ${file.name} is unavailable in this browser`);
    const data = file.data ? new Uint8Array(file.data.slice(0)) : undefined;
    const kind: SyncItemKind = file.type === "image/png" ? "png-image" : "result";
    const mimetype = file.type || "application/octet-stream";
    const digest = data ? await sha256(data.slice().buffer) : file.remoteResult!.sha256;
    const groupKey = `${kind}:${mimetype}:${digest}`;
    const group = resultGroups.get(groupKey);
    if (group) {
      group.files.push(file);
      if (!group.data && data) group.data = data;
    } else {
      resultGroups.set(groupKey, {
        kind,
        mimetype,
        sha256: digest,
        data,
        size: data?.byteLength ?? file.remoteResult!.size,
        files: [file]
      });
    }
  }

  const sortedResultGroups = Array.from(resultGroups.values())
    .sort((left, right) => left.sha256.localeCompare(right.sha256));
  const resultKey = (group: typeof sortedResultGroups[number]) =>
    `result-content:${group.kind}:${group.sha256}`;
  const pngGroups = sortedResultGroups.filter((group) => group.kind === "png-image");

  for (const group of sortedResultGroups) {
    const canonicalFile = group.files[0];
    const sources = group.files.map((file) => ({
      fileId: file.id,
      deletedAt: file.deletedAt || null,
      name: file.name,
      logicalPath: file.logicalPath,
      runId: file.runId || null,
      chatId: file.chatId || null,
      methodId: file.methodId || null,
      pipelineId: file.pipelineId || null,
      notebookId: file.notebookId || null,
      executionId: file.executionId || null,
      viewer: file.viewer || null
    }));
    const plotImageKeys = group.kind === "result" && group.files.some((file) =>
      file.type === "text/csv" || file.type === "image/svg+xml" || /\.(csv|svg)$/i.test(file.name)
    )
      ? pngGroups.filter((pngGroup) => group.files.some((companion) =>
          pngGroup.files.some((image) => isPlotPair(companion, image))
        )).map(resultKey).sort()
      : [];
    const metadata = {
      contentAddressed: true, sourceCount: sources.length, sources,
      ...(plotImageKeys.length ? { plotImageKeys } : {})
    };
    if (group.data) {
      await add(resultKey(group), group.kind, canonicalFile.name, group.mimetype,
        `Results/${canonicalFile.name}`, group.data, metadata);
    } else {
      items.push({ key: resultKey(group), kind: group.kind, name: canonicalFile.name,
        mimetype: group.mimetype, logicalPath: `Results/${canonicalFile.name}`,
        size: group.size, sha256: group.sha256, metadata });
    }
  }

  for (const file of workspace.files
    .filter((entry) =>
      entry.source !== "result" &&
      entry.role !== "chat-attachment" &&
      !entry.deletedAt &&
      entry.state === "ready" &&
      /template/i.test(entry.name)
    )
    .sort((left, right) => left.id.localeCompare(right.id))) {
    if (!file.data) {
      throw new Error(`Template input ${file.name} is unavailable in this browser`);
    }
    await add(
      `template-input:${file.id}`,
      "template-input",
      file.name,
      file.type || "application/octet-stream",
      `Templates/${file.name}`,
      new Uint8Array(file.data.slice(0)),
      {
        fileId: file.id,
        source: file.source,
        sourceAnnotationId: file.annotationId || null,
        originalLogicalPath: file.logicalPath
      }
    );
  }

  for (const method of workspace.methods
    .filter((entry) => !entry.deletedAt)
    .sort((left, right) => left.id.localeCompare(right.id))) {
    const bundle = encoder.encode(canonicalJson({
      schema: "nl.bioimaging.analysis.method.v1",
      version: 1,
      method
    }));
    await add(
      `method:${method.id}`,
      "method",
      `${slug(method.name.replace(/\.py$/i, ""))}.oa-method.json`,
      "application/json",
      `Methods/${method.name}`,
      bundle,
      {
        methodId: method.id,
        description: method.description,
        currentVersion: method.currentVersion,
        requiredCapabilities: method.requiredCapabilities || [],
        requiredFormats: method.inputContract?.formats || []
      }
    );
    const current = method.versions.find(
      (version) => version.version === method.currentVersion
    );
    if (current) {
      await add(
        `method:${method.id}:python`,
        "method-python",
        method.name,
        "text/x-python",
        `Methods/${method.name}`,
        encoder.encode(`${current.code.trimEnd()}\n`),
        {
          methodId: method.id,
          currentVersion: method.currentVersion,
          canonicalItemKey: `method:${method.id}`
        }
      );
    }
  }

  for (const pipeline of workspace.pipelines
    .filter((entry) => !entry.deletedAt)
    .sort((left, right) => left.id.localeCompare(right.id))) {
    const dependencies = Array.from(new Set(
      pipeline.steps.map((step) => `method:${step.methodId}`)
    )).sort();
    const dependencyMethods = pipeline.steps
      .map((step) => workspace.methods.find((method) =>
        method.id === step.methodId && !method.deletedAt
      ))
      .filter((method) => Boolean(method));
    await add(
      `pipeline:${pipeline.id}`,
      "pipeline",
      `${slug(pipeline.name)}.oa-pipeline.json`,
      "application/json",
      `Pipelines/${pipeline.name}`,
      encoder.encode(canonicalJson({
        schema: "nl.bioimaging.analysis.pipeline.v1",
        version: 1,
        pipeline
      })),
      {
        pipelineId: pipeline.id,
        description: pipeline.description,
        version: pipeline.version,
        dependencies,
        requiredCapabilities: Array.from(new Set(
          dependencyMethods.flatMap((method) => method?.requiredCapabilities || [])
        )).sort(),
        requiredFormats: Array.from(new Set(
          dependencyMethods.flatMap((method) => method?.inputContract?.formats || [])
        )).sort()
      }
    );
  }

  for (const notebook of workspace.notebooks
    .filter(item => !item.deletedAt)
    .sort((left, right) => left.id.localeCompare(right.id))) {
    await add(
      `notebook:${notebook.id}`,
      "notebook",
      notebook.name,
      "application/x-ipynb+json",
      `Notebooks/${notebook.name}`,
      encoder.encode(canonicalJson(notebook.document)),
      {
        notebookId: notebook.id,
        sourceAnnotationId: notebook.sourceAnnotationId || null
      }
    );
  }

  const executionIds = new Set([
    ...workspace.runs.flatMap(run => run.executionIds),
    ...workspace.methods.flatMap(method => method.versions.map(version => version.executionId))
  ]);
  // Automatic synchronization retains the existing reusable-analysis boundary.
  // Assistant conversations and private Chat attachments stay browser-local.
  const resultReferences = new Map(sortedResultGroups.flatMap(group => group.files.map(file =>
    [file.id, { workspaceId: workspace.workspace.id, key: resultKey(group), sha256: group.sha256, size: group.size }] as const)));
  const reusableSnapshot: AnalysisWorkspace = {
    ...workspace,
    chats: [{ id: workspace.workspace.activeChatId, workspaceId: workspace.workspace.id,
      title: "Assistant", summary: "", messages: [],
      createdAt: workspace.workspace.createdAt, updatedAt: workspace.workspace.createdAt }],
    files: workspace.files.filter(file => file.role !== "chat-attachment" &&
      (file.source !== "result" || Boolean(file.runId || file.methodId || file.pipelineId || file.notebookId)))
      .map(file => file.source === "result" ? { ...file, data: undefined,
        remoteResult: resultReferences.get(file.id) } : file)
      .map(file => file.source === "local" && !/template/i.test(file.name)
        ? { ...file, data: undefined, state: "missing" as const, error: "Reselect this browser-local input" } : file),
    executions: workspace.executions.filter(item => executionIds.has(item.id)),
    artifacts: workspace.artifacts.filter(item => item.runId || executionIds.has(item.executionId || "")),
    evidence: [], audits: []
  };
  const snapshot = exportWorkspace(reusableSnapshot, context.max_snapshot_bytes ?? 64 * 1024 * 1024);
  const { exportedAt: _exportedAt, ...state } = snapshot.manifest;
  const { omeroSync: _sync, revision: _revision, updatedAt: _updated, ...record } = state.workspace;
  const snapshotStateDigest = await sha256(canonicalJson({ ...state, workspace: record }));
  await add(`workspace-snapshot:${workspace.workspace.id}`, "workspace-snapshot", "workspace.oa-workspace.zip",
    "application/zip", "Workspace/workspace.oa-workspace.zip", snapshot.data,
    { workspaceId: workspace.workspace.id, stateDigest: snapshotStateDigest });
  items.sort((left, right) => left.key.localeCompare(right.key));
  const unsigned = {
    schema: "nl.bioimaging.analysis.sync.inventory.v1" as const,
    workspace: {
      lifecycleRevision: workspace.workspace.lifecycleRevision || 0,
      id: workspace.workspace.id,
      name: workspace.workspace.name,
      sourceObjectType: context.object_type,
      sourceObjectId: context.object_id,
      sourceObjectName: context.name,
      userId: context.user_id,
      groupId: context.group_id
    },
    items
  };
  const inventory: SyncInventory = {
    ...unsigned,
    digest: await sha256(canonicalJson(unsigned))
  };
  const contentDigest = await sha256(canonicalJson({
    ...unsigned, items: items.filter(item => item.kind !== "workspace-snapshot"),
    snapshotStateDigest
  }));
  return { inventory, bytes, contentDigest };
}

export function syncHasChanges(
  localDigest: string,
  remoteDigest: string
): boolean {
  return Boolean(localDigest && localDigest !== remoteDigest);
}
