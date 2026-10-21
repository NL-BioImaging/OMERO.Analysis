import { remoteResultName } from "./notebookResults";
import { notebookWorkspace } from "./notebookMigration";
import { resultBytes } from "./resultMedia";
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

/** Server deletion receipts are authoritative, including after snapshot restore. */
export function reconcileResultDeletions(workspace: AnalysisWorkspace, remote: SyncStatus): AnalysisWorkspace {
  const removed = new Map((remote.externalResultDeletions || []).flatMap(record => record.fileIds.map(id => [id, record.deletedAt] as const)));
  let changed = false;
  const files = workspace.files.map(file => {
    const timestamp = removed.get(file.id);
    if (file.source !== "result" || !timestamp || file.deletedInOmeroAt) return file;
    changed = true;
    return {...file, deletedAt: timestamp, deletedInOmeroAt: timestamp, data: undefined, mediaBlob: undefined, remoteResult: undefined,
      state: "missing" as const, error: "Removed in OMERO"};
  });
  return changed ? {...workspace, files} : workspace;
}

export function syncAlreadyCurrent(digest: string, remote: SyncStatus): boolean {
  return Boolean(digest && remote.linked && remote.syncState !== "pending" && remote.syncState !== "failed" &&
    remote.browseState !== "failed" && !remote.cleanupPending && !remote.attachmentRepairNeeded &&
    !syncHasChanges(digest, remote.inventoryDigest));
}

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
  context: OmeroContext,
  options: { inventoryOnly?: boolean; uploadKeys?: Set<string> } = {}
): Promise<SyncPayload> {
  workspace = notebookWorkspace(workspace);
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
    parameterKey?: string;
    runId?: string;
    kind: SyncItemKind;
    mimetype: string;
    sha256: string;
    data?: Uint8Array;
    size: number;
    files: typeof workspace.files;
  }>();
  for (const file of workspace.files
    .filter((entry) =>
      entry.source === "result" && !entry.deletedInOmeroAt && !entry.supersededAt
    )
    .sort((left, right) =>
      left.name.localeCompare(right.name) || left.id.localeCompare(right.id)
    )) {
    if (!file.data && !file.mediaBlob && !file.remoteResult) throw new Error(`Result ${file.name} is unavailable in this browser`);
    const scope = `${file.notebookParameterKey ? `:${file.notebookParameterKey}` : ""}${file.notebookRunId ? `:run:${file.notebookRunId}` : ""}`;
    const expectedKey = `result-content:${file.type === "image/png" ? "png-image" : "result"}:${file.sha256}${scope}`;
    const raw = Boolean(file.sha256) && (options.inventoryOnly || options.uploadKeys && !options.uploadKeys.has(expectedKey)) ? undefined : await resultBytes(file);
    const data = raw ? new Uint8Array(raw) : undefined;
    const kind: SyncItemKind = file.type === "image/png" ? "png-image" : "result";
    const mimetype = file.type || "application/octet-stream";
    const digest = file.sha256 || (data ? await sha256(data.slice().buffer) : file.remoteResult!.sha256);
    const groupKey = `${kind}:${mimetype}:${digest}${scope}`;
    const group = resultGroups.get(groupKey);
    if (group) {
      group.files.push(file);
      if (!group.data && data) group.data = data;
    } else {
      resultGroups.set(groupKey, {
        parameterKey: file.notebookParameterKey,
        runId: file.notebookRunId,
        kind,
        mimetype,
        sha256: digest,
        data,
        size: data?.byteLength ?? file.size,
        files: [file]
      });
    }
  }

  const sortedResultGroups = Array.from(resultGroups.values())
    .sort((left, right) => left.sha256.localeCompare(right.sha256));
  const resultKey = (group: typeof sortedResultGroups[number]) =>
    `result-content:${group.kind}:${group.sha256}${group.parameterKey ? `:${group.parameterKey}` : ""}${group.runId ? `:run:${group.runId}` : ""}`;
  const pngGroups = sortedResultGroups.filter((group) => group.kind === "png-image");

  for (const group of sortedResultGroups) {
    const canonicalFile = group.files[0];
    // Existing content keeps its stable remote key; new runs have their own scope.
    const displayName = remoteResultName(canonicalFile, workspace.notebooks);
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
      notebookParameterKey: file.notebookParameterKey || null,
      notebookRunStartedAt: file.notebookRunStartedAt || null,
      notebookRunId: file.notebookRunId || null,
      executionId: file.executionId || null,
      resultGroupId: file.resultGroupId || null, movie: file.movie || null,
      viewer: file.viewer || null
    }));
    const plotImageKeys = group.kind === "result" && group.files.some((file) =>
      file.type === "text/csv" || file.type === "image/svg+xml" || /\.(csv|svg)$/i.test(file.name)
    )
      ? pngGroups.filter((pngGroup) => group.files.some((companion) =>
          pngGroup.files.some((image) => !companion.deletedAt && !image.deletedAt && isPlotPair(companion, image))
        )).map(resultKey).sort()
      : [];
    const metadata = {
      contentAddressed: true, sourceCount: sources.length, sources,
      ...(plotImageKeys.length ? { plotImageKeys } : {})
    };
    if (group.data) {
      await add(resultKey(group), group.kind, displayName, group.mimetype,
        `Results/${canonicalFile.name}`, group.data, metadata);
    } else {
      items.push({ key: resultKey(group), kind: group.kind, name: displayName,
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
      (entry.role === "template-input" || /template/i.test(entry.name))
    )
    .sort((left, right) => left.id.localeCompare(right.id))) {
    const metadata = { fileId: file.id, source: file.source, sourceAnnotationId: file.annotationId || null,
      role: file.role, libraryOrigin: file.libraryOrigin, originalLogicalPath: file.logicalPath };
    if (!file.data && file.remoteResult?.key === `template-input:${file.id}`) {
      items.push({ key: file.remoteResult.key, kind: "template-input", name: file.name,
        mimetype: file.type || "application/octet-stream", logicalPath: `Templates/${file.name}`,
        sha256: file.remoteResult.sha256, size: file.remoteResult.size, metadata });
      continue;
    }
    if (!file.data) throw new Error(`Template input ${file.name} is unavailable in this browser`);
    await add(
      `template-input:${file.id}`,
      "template-input",
      file.name,
      file.type || "application/octet-stream",
      `Templates/${file.name}`,
      new Uint8Array(file.data.slice(0)),
      metadata
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

  const resultReferences = new Map(sortedResultGroups.flatMap(group => group.files.map(file =>
    [file.id, { workspaceId: workspace.workspace.id, key: resultKey(group), sha256: group.sha256, size: group.size }] as const)));
  for (const item of items.filter(item => item.kind === "template-input")) {
    resultReferences.set(String(item.metadata.fileId), { workspaceId: workspace.workspace.id,
      key: item.key, sha256: item.sha256, size: item.size });
  }
  const reusableSnapshot: AnalysisWorkspace = {
    ...workspace,
    files: workspace.files.filter(file => !file.supersededAt)
      .map(file => file.deletedInOmeroAt ? {...file, data: undefined, mediaBlob: undefined, remoteResult: undefined} : file)
      .map(file => resultReferences.has(file.id) ? { ...file, data: undefined, mediaBlob: undefined,
        remoteResult: resultReferences.get(file.id) } : file)
      .map(file => file.source === "local" && file.role !== "template-input" && !/template/i.test(file.name)
        ? { ...file, data: undefined, mediaBlob: undefined, state: "missing" as const, error: "Reselect this browser-local input" } : file),
    executions: [], artifacts: [],
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
