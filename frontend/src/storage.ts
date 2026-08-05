import type {
  ChatRecord,
  ExecutionRecord,
  OmeroContext,
  WorkspaceRecord,
  AnalysisWorkspace,
  ProviderSettings,
  MethodRecord,
  PipelineRecord,
  NotebookRecord,
  ArtifactRecord,
  OutboundPayloadAudit,
  WorkspaceFile,
  EvidenceRecord,
  AnalysisRunRecord
} from "./types";

const DB_NAME = "omero-analysis-workspaces";
const DB_VERSION = 2;
const STORES = [
  "workspaces",
  "chats",
  "files",
  "executions",
  "runs",
  "methods",
  "pipelines",
  "notebooks",
  "artifacts",
  "audits",
  "evidence"
] as const;
type EntityStore = typeof STORES[number];

function requestValue<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error("Storage transaction aborted"));
  });
}

function openDatabase(name: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("values")) db.createObjectStore("values");
      for (const name of STORES) {
        const store = db.objectStoreNames.contains(name)
          ? request.transaction!.objectStore(name)
          : db.createObjectStore(name, { keyPath: "id" });
        if (name !== "workspaces" && !store.indexNames.contains("workspaceId")) {
          store.createIndex("workspaceId", "workspaceId");
        }
        if (name === "workspaces" && !store.indexNames.contains("contextKey")) {
          store.createIndex("contextKey", "contextKey", { unique: true });
        }
        if (
          (name === "files" || name === "executions" || name === "evidence") &&
          !store.indexNames.contains("chatId")
        ) {
          store.createIndex("chatId", "chatId");
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

let databasePromise: Promise<IDBDatabase> | undefined;

function database(): Promise<IDBDatabase> {
  databasePromise ??= openDatabase(DB_NAME);
  return databasePromise;
}

export async function getValue<T>(key: string): Promise<T | undefined> {
  const db = await database();
  const tx = db.transaction("values", "readonly");
  return requestValue(tx.objectStore("values").get(key)) as Promise<T | undefined>;
}

export async function setValue<T>(key: string, value: T): Promise<void> {
  const db = await database();
  const tx = db.transaction("values", "readwrite");
  tx.objectStore("values").put(value, key);
  await transactionDone(tx);
}

export async function deleteValue(key: string): Promise<void> {
  const db = await database();
  const tx = db.transaction("values", "readwrite");
  tx.objectStore("values").delete(key);
  await transactionDone(tx);
}

async function putEntity<T extends { id: string }>(store: EntityStore, value: T): Promise<void> {
  const db = await database();
  const tx = db.transaction(store, "readwrite");
  tx.objectStore(store).put(value);
  await transactionDone(tx);
}

let writeQueue: Promise<unknown> = Promise.resolve();

function serializedWrite<T>(operation: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(operation, operation);
  writeQueue = next.catch(() => undefined);
  return next;
}

async function deleteEntity(store: EntityStore, id: string): Promise<void> {
  const db = await database();
  const tx = db.transaction(store, "readwrite");
  tx.objectStore(store).delete(id);
  await transactionDone(tx);
}

async function entitiesForWorkspace<T>(store: Exclude<EntityStore, "workspaces">, workspaceId: string): Promise<T[]> {
  const db = await database();
  const tx = db.transaction(store, "readonly");
  return requestValue(tx.objectStore(store).index("workspaceId").getAll(workspaceId)) as Promise<T[]>;
}

export const saveWorkspaceRecord = (value: WorkspaceRecord): Promise<WorkspaceRecord> =>
  serializedWrite(async () => {
    const db = await database();
    const tx = db.transaction("workspaces", "readwrite");
    const store = tx.objectStore("workspaces");
    const persisted = await requestValue(store.get(value.id)) as WorkspaceRecord | undefined;
    const updated = {
      ...value,
      revision: Math.max(persisted?.revision || 0, value.revision || 0) + 1
    };
    store.put(updated);
    await transactionDone(tx);
    return updated;
  });
export const saveChat = (value: ChatRecord) =>
  serializedWrite(() => putEntity("chats", value));
export const saveFile = (value: WorkspaceFile) =>
  serializedWrite(() => putEntity("files", value));
export const saveExecution = (value: ExecutionRecord) =>
  serializedWrite(() => putEntity("executions", value));
export const saveRun = (value: AnalysisRunRecord) =>
  serializedWrite(() => putEntity("runs", value));
export const saveMethod = (value: MethodRecord) =>
  serializedWrite(() => putEntity("methods", value));
export const savePipeline = (value: PipelineRecord) =>
  serializedWrite(() => putEntity("pipelines", value));
export const saveNotebook = (value: NotebookRecord) =>
  serializedWrite(() => putEntity("notebooks", value));
export const saveArtifact = (value: ArtifactRecord) =>
  serializedWrite(() => putEntity("artifacts", value));
export const saveAudit = (value: OutboundPayloadAudit) =>
  serializedWrite(() => putEntity("audits", value));
export const saveEvidence = (value: EvidenceRecord) =>
  serializedWrite(() => putEntity("evidence", value));
export const saveEvidenceLedger = (chatId: string, values: EvidenceRecord[]) =>
  serializedWrite(async () => {
    const db = await database();
    const tx = db.transaction("evidence", "readwrite");
    const store = tx.objectStore("evidence");
    const keys = await requestValue(store.index("chatId").getAllKeys(chatId));
    keys.forEach((key) => store.delete(key));
    values.forEach((value) => store.put(value));
    await transactionDone(tx);
  });
export const deleteFile = (id: string) => serializedWrite(() => deleteEntity("files", id));
export const deleteChat = (id: string) => serializedWrite(() => deleteEntity("chats", id));
export const deleteMethod = (id: string) => serializedWrite(() => deleteEntity("methods", id));
export const deleteNotebook = (id: string) => serializedWrite(() => deleteEntity("notebooks", id));

export async function deleteChatCascade(chatId: string): Promise<void> {
  await serializedWrite(async () => {
    const db = await database();
    const relatedStores = ["files", "executions", "artifacts", "audits", "evidence"] as const;
    const tx = db.transaction(["chats", ...relatedStores], "readwrite");
    tx.objectStore("chats").delete(chatId);
    const pending = relatedStores.map((storeName) => {
      const store = tx.objectStore(storeName);
      const indexed = store.indexNames.contains("chatId");
      const request = indexed
        ? store.index("chatId").getAllKeys(chatId)
        : store.getAll();
      return { store, indexed, request };
    });
    const results = await Promise.all(pending.map(({ request }) => requestValue(request)));
    pending.forEach(({ store, indexed }, index) => {
      if (indexed) {
        (results[index] as IDBValidKey[]).forEach((key) => store.delete(key));
      } else {
        (results[index] as Array<{ id: string; chatId?: string }>)
          .filter((value) => value.chatId === chatId)
          .forEach((value) => store.delete(value.id));
      }
    });
    await transactionDone(tx);
  });
}

export async function deleteWorkspaceCascade(workspaceId: string): Promise<void> {
  await serializedWrite(async () => {
    const db = await database();
    const tx = db.transaction([...STORES], "readwrite");
    for (const storeName of STORES) {
      const store = tx.objectStore(storeName);
      if (storeName === "workspaces") {
        store.delete(workspaceId);
        continue;
      }
      const keys = await requestValue(store.index("workspaceId").getAllKeys(workspaceId));
      keys.forEach((key) => store.delete(key));
    }
    await transactionDone(tx);
  });
}

export async function contextKey(context: OmeroContext | null): Promise<string> {
  if (!context) return "standalone";
  const selected = (context.selected_objects || [])
    .filter((item) => item.type === context.object_type)
    .map((item) => item.id)
    .sort((left, right) => left - right);
  const source = selected.length > 1
    ? `${context.object_type}-selection:${selected.join(",")}`
    : `${context.object_type}:${context.object_id}`;
  return `${context.user_id}:${context.group_id}:${source}`;
}

function slug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 64)
    .toLowerCase() || "workspace";
}

export function workspaceRoot(context: OmeroContext | null): string {
  if (!context) return "OMERO/Local--workspace";
  const selected = (context.selected_objects || [])
    .filter((item) => item.type === context.object_type)
    .map((item) => item.id)
    .sort((left, right) => left - right);
  const source = selected.length > 1
    ? `${context.object_type}-selection-${selected.join("-")}`
    : `${context.object_type}-${context.object_id}`;
  return `OMERO/${source}--${slug(context.name)}`;
}

export async function sha256(data: ArrayBuffer | string): Promise<string> {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
}

export function newChat(workspaceId: string, title = "New Assistant Chat"): ChatRecord {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    workspaceId,
    title,
    titleEdited: title !== "New Assistant Chat",
    summary: "",
    messages: [],
    createdAt: now,
    updatedAt: now
  };
}

async function findWorkspace(key: string): Promise<WorkspaceRecord | undefined> {
  const db = await database();
  const tx = db.transaction("workspaces", "readonly");
  return requestValue(tx.objectStore("workspaces").index("contextKey").get(key)) as Promise<WorkspaceRecord | undefined>;
}

/**
 * Replace a complete Workspace, for archive restore/import only.
 *
 * Ordinary edits must use the entity-level save functions above. Keeping this
 * operation explicit prevents a small metadata change from cloning every
 * potentially multi-gigabyte file blob in IndexedDB.
 */
export async function replaceWorkspace(workspace: AnalysisWorkspace): Promise<AnalysisWorkspace> {
  return serializedWrite(async () => {
    const db = await database();
    const tx = db.transaction([...STORES], "readwrite");
    const existing = await requestValue(
      tx.objectStore("workspaces").get(workspace.workspace.id)
    ) as WorkspaceRecord | undefined;
    const workspaceRecord = {
      ...workspace.workspace,
      revision: Math.max(existing?.revision || 0, workspace.workspace.revision || 0) + 1
    };
    tx.objectStore("workspaces").put(workspaceRecord);
    const valuesByStore = {
      chats: workspace.chats,
      files: workspace.files,
      executions: workspace.executions,
      runs: workspace.runs,
      methods: workspace.methods,
      pipelines: workspace.pipelines,
      notebooks: workspace.notebooks,
      artifacts: workspace.artifacts,
      audits: workspace.audits,
      evidence: workspace.evidence
    };
    for (const [storeName, values] of Object.entries(valuesByStore) as Array<
      [Exclude<EntityStore, "workspaces">, Array<{ id: string }>]
    >) {
      const store = tx.objectStore(storeName);
      const existingKeys = await requestValue(store.index("workspaceId").getAllKeys(workspaceRecord.id));
      const retained = new Set(values.map((value) => value.id));
      existingKeys.forEach((key) => {
        if (!retained.has(String(key))) store.delete(key);
      });
      values.forEach((value) => store.put(value));
    }
    await transactionDone(tx);
    return { ...workspace, workspace: workspaceRecord };
  });
}

export async function loadOrCreateWorkspace(context: OmeroContext | null): Promise<AnalysisWorkspace> {
  const key = await contextKey(context);
  let workspaceRecord = await findWorkspace(key);
  if (!workspaceRecord) {
    const now = new Date().toISOString();
    const chat = newChat(crypto.randomUUID());
    workspaceRecord = {
      id: chat.workspaceId,
      contextKey: key,
      rootPath: workspaceRoot(context),
      name: context?.name || "Local workspace",
      objectType: context?.object_type,
      objectId: context?.object_id,
      userId: context?.user_id || 0,
      groupId: context?.group_id || 0,
      activeChatId: chat.id,
      plotCsv: true,
      createdAt: now,
      updatedAt: now
    };
    const workspace = {
      workspace: workspaceRecord,
      chats: [chat],
      files: [],
      executions: [],
      runs: [],
      methods: [],
      pipelines: [],
      notebooks: [],
      artifacts: [],
      audits: [],
      evidence: []
    };
    return replaceWorkspace(workspace);
  }
  const [chats, files, executions, runs, methods, pipelines, notebooks, artifacts, audits, evidence] = await Promise.all([
    entitiesForWorkspace<ChatRecord>("chats", workspaceRecord.id),
    entitiesForWorkspace<WorkspaceFile>("files", workspaceRecord.id),
    entitiesForWorkspace<ExecutionRecord>("executions", workspaceRecord.id),
    entitiesForWorkspace<AnalysisRunRecord>("runs", workspaceRecord.id),
    entitiesForWorkspace<MethodRecord>("methods", workspaceRecord.id),
    entitiesForWorkspace<PipelineRecord>("pipelines", workspaceRecord.id),
    entitiesForWorkspace<NotebookRecord>("notebooks", workspaceRecord.id),
    entitiesForWorkspace<ArtifactRecord>("artifacts", workspaceRecord.id),
    entitiesForWorkspace<OutboundPayloadAudit>("audits", workspaceRecord.id),
    entitiesForWorkspace<EvidenceRecord>("evidence", workspaceRecord.id)
  ]);
  if (!chats.length) {
    const chat = newChat(workspaceRecord.id);
    workspaceRecord = { ...workspaceRecord, activeChatId: chat.id, updatedAt: new Date().toISOString() };
    const replaced = await replaceWorkspace({
      workspace: workspaceRecord,
      chats: [chat],
      files,
      executions,
      runs,
      methods,
      pipelines,
      notebooks,
      artifacts,
      audits,
      evidence
    });
    workspaceRecord = replaced.workspace;
    chats.push(chat);
  }
  return { workspace: workspaceRecord, chats, files, executions, runs, methods, pipelines, notebooks, artifacts, audits, evidence };
}

export async function listContextWorkspaces(context: OmeroContext | null): Promise<WorkspaceRecord[]> {
  const key = await contextKey(context);
  const db = await database();
  const tx = db.transaction("workspaces", "readonly");
  const values = await requestValue(tx.objectStore("workspaces").getAll()) as WorkspaceRecord[];
  return values
    .filter((workspace) =>
      workspace.contextKey === key || workspace.contextKey.startsWith(`${key}:import:`)
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function loadWorkspace(workspaceId: string): Promise<AnalysisWorkspace | undefined> {
  const db = await database();
  const tx = db.transaction("workspaces", "readonly");
  const workspaceRecord = await requestValue(tx.objectStore("workspaces").get(workspaceId)) as WorkspaceRecord | undefined;
  if (!workspaceRecord) return undefined;
  const [chats, files, executions, runs, methods, pipelines, notebooks, artifacts, audits, evidence] = await Promise.all([
    entitiesForWorkspace<ChatRecord>("chats", workspaceRecord.id),
    entitiesForWorkspace<WorkspaceFile>("files", workspaceRecord.id),
    entitiesForWorkspace<ExecutionRecord>("executions", workspaceRecord.id),
    entitiesForWorkspace<AnalysisRunRecord>("runs", workspaceRecord.id),
    entitiesForWorkspace<MethodRecord>("methods", workspaceRecord.id),
    entitiesForWorkspace<PipelineRecord>("pipelines", workspaceRecord.id),
    entitiesForWorkspace<NotebookRecord>("notebooks", workspaceRecord.id),
    entitiesForWorkspace<ArtifactRecord>("artifacts", workspaceRecord.id),
    entitiesForWorkspace<OutboundPayloadAudit>("audits", workspaceRecord.id),
    entitiesForWorkspace<EvidenceRecord>("evidence", workspaceRecord.id)
  ]);
  return { workspace: workspaceRecord, chats, files, executions, runs, methods, pipelines, notebooks, artifacts, audits, evidence };
}

export async function storageEstimate(): Promise<{ usage: number; quota: number }> {
  const value = await navigator.storage?.estimate?.();
  return { usage: value?.usage || 0, quota: value?.quota || 0 };
}

export const settingsKey = "provider:generic";
export const aiProfilesKey = "provider:profiles:v1";
export const customSkillsKey = "skills:custom:v1";
export const uiThemeKey = "ui:theme:v1";
export const defaultSettings: ProviderSettings = {
  protocol: "openai",
  endpoint: "",
  authMode: "bearer",
  apiKey: "",
  model: "",
  contextWindow: 0,
  rememberKey: false
};
