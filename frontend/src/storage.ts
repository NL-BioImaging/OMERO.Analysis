import type {
  ChatRecord,
  ExecutionRecord,
  OmeroContext,
  ProjectRecord,
  ProjectWorkspace,
  ProviderSettings,
  ScriptRecord,
  WorkflowRecord,
  ArtifactRecord,
  OutboundPayloadAudit,
  WorkspaceFile,
  EvidenceRecord
} from "./types";

const DB_NAME = "omero-analysis";
const LEGACY_DB_NAME = "omero-analysis-chat";
const DB_VERSION = 5;
const STORES = [
  "projects",
  "chats",
  "files",
  "executions",
  "scripts",
  "workflows",
  "artifacts",
  "audits",
  "evidence"
] as const;
type EntityStore = typeof STORES[number];

interface LegacyWorkspace {
  messages?: Array<Record<string, any>>;
  files?: Array<Record<string, any>>;
}

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
        if (name !== "projects" && !store.indexNames.contains("projectId")) {
          store.createIndex("projectId", "projectId");
        }
        if (name === "projects" && !store.indexNames.contains("contextKey")) {
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

async function existingDatabase(name: string): Promise<IDBDatabase | null> {
  if (typeof indexedDB.databases === "function") {
    const databases = await indexedDB.databases();
    if (!databases.some((entry) => entry.name === name)) return null;
  }
  return new Promise((resolve, reject) => {
    let created = false;
    const request = indexedDB.open(name);
    request.onupgradeneeded = () => {
      created = true;
      request.transaction?.abort();
    };
    request.onsuccess = () => resolve(created ? null : request.result);
    request.onerror = () => {
      if (created && request.error?.name === "AbortError") {
        resolve(null);
      } else {
        reject(request.error);
      }
    };
  });
}

async function migrateLegacyDatabase(target: IDBDatabase): Promise<void> {
  const markerKey = `migration:${LEGACY_DB_NAME}`;
  const markerTx = target.transaction("values", "readonly");
  if (await requestValue(markerTx.objectStore("values").get(markerKey))) return;
  const projectTx = target.transaction("projects", "readonly");
  if (await requestValue(projectTx.objectStore("projects").count()) > 0) return;

  const legacy = await existingDatabase(LEGACY_DB_NAME);
  if (!legacy) return;
  try {
    for (const storeName of ["values", ...STORES]) {
      if (!legacy.objectStoreNames.contains(storeName)) continue;
      const sourceTx = legacy.transaction(storeName, "readonly");
      const source = sourceTx.objectStore(storeName);
      const [values, keys] = await Promise.all([
        requestValue(source.getAll()),
        requestValue(source.getAllKeys())
      ]);
      const targetTx = target.transaction(storeName, "readwrite");
      const destination = targetTx.objectStore(storeName);
      values.forEach((value, index) => {
        if (storeName === "values") destination.put(value, keys[index]);
        else destination.put(value);
      });
      await transactionDone(targetTx);
    }
    const completedTx = target.transaction("values", "readwrite");
    completedTx.objectStore("values").put(
      { completedAt: new Date().toISOString(), source: LEGACY_DB_NAME },
      markerKey
    );
    await transactionDone(completedTx);
  } finally {
    legacy.close();
  }
}

let databasePromise: Promise<IDBDatabase> | undefined;

function database(): Promise<IDBDatabase> {
  databasePromise ??= openDatabase(DB_NAME).then(async (db) => {
    await migrateLegacyDatabase(db);
    return db;
  });
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

let writeQueue: Promise<void> = Promise.resolve();

function serializedWrite(operation: () => Promise<void>): Promise<void> {
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

async function entitiesForProject<T>(store: Exclude<EntityStore, "projects">, projectId: string): Promise<T[]> {
  const db = await database();
  const tx = db.transaction(store, "readonly");
  return requestValue(tx.objectStore(store).index("projectId").getAll(projectId)) as Promise<T[]>;
}

export const saveProject = (value: ProjectRecord) =>
  serializedWrite(() => putEntity("projects", value));
export const saveChat = (value: ChatRecord) =>
  serializedWrite(() => putEntity("chats", value));
export const saveFile = (value: WorkspaceFile) =>
  serializedWrite(() => putEntity("files", value));
export const saveExecution = (value: ExecutionRecord) =>
  serializedWrite(() => putEntity("executions", value));
export const saveScript = (value: ScriptRecord) =>
  serializedWrite(() => putEntity("scripts", value));
export const saveWorkflow = (value: WorkflowRecord) =>
  serializedWrite(() => putEntity("workflows", value));
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
export const deleteScript = (id: string) => serializedWrite(() => deleteEntity("scripts", id));

export async function deleteProjectCascade(projectId: string): Promise<void> {
  await serializedWrite(async () => {
    const db = await database();
    const tx = db.transaction([...STORES], "readwrite");
    for (const storeName of STORES) {
      const store = tx.objectStore(storeName);
      if (storeName === "projects") {
        store.delete(projectId);
        continue;
      }
      const keys = await requestValue(store.index("projectId").getAllKeys(projectId));
      keys.forEach((key) => store.delete(key));
    }
    await transactionDone(tx);
  });
}

export async function contextKey(context: OmeroContext | null): Promise<string> {
  return context
    ? `${context.user_id}:${context.group_id}:${context.object_type}:${context.object_id}`
    : "standalone";
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

export function projectRoot(context: OmeroContext | null): string {
  return context
    ? `OMERO/${context.object_type}-${context.object_id}--${slug(context.name)}`
    : "OMERO/Local--workspace";
}

export async function sha256(data: ArrayBuffer | string): Promise<string> {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
}

export function newChat(projectId: string, title = "New analysis"): ChatRecord {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    projectId,
    title,
    summary: "",
    archived: false,
    messages: [],
    createdAt: now,
    updatedAt: now
  };
}

async function findProject(key: string): Promise<ProjectRecord | undefined> {
  const db = await database();
  const tx = db.transaction("projects", "readonly");
  return requestValue(tx.objectStore("projects").index("contextKey").get(key)) as Promise<ProjectRecord | undefined>;
}

export async function saveWorkspace(workspace: ProjectWorkspace): Promise<void> {
  await serializedWrite(async () => {
    const db = await database();
    const tx = db.transaction([...STORES], "readwrite");
    const project = {
      ...workspace.project,
      revision: (workspace.project.revision || 0) + 1
    };
    tx.objectStore("projects").put(project);
    workspace.chats.forEach((value) => tx.objectStore("chats").put(value));
    workspace.files.forEach((value) => tx.objectStore("files").put(value));
    workspace.executions.forEach((value) => tx.objectStore("executions").put(value));
    workspace.scripts.forEach((value) => tx.objectStore("scripts").put(value));
    workspace.workflows.forEach((value) => tx.objectStore("workflows").put(value));
    workspace.artifacts.forEach((value) => tx.objectStore("artifacts").put(value));
    workspace.audits.forEach((value) => tx.objectStore("audits").put(value));
    workspace.evidence.forEach((value) => tx.objectStore("evidence").put(value));
    await transactionDone(tx);
  });
}

async function migrateLegacy(
  project: ProjectRecord,
  chat: ChatRecord,
  key: string
): Promise<ProjectWorkspace | null> {
  const legacy = await getValue<LegacyWorkspace>(`workspace:${key}`);
  if (!legacy) return null;
  const now = new Date().toISOString();
  chat.title = "Imported chat";
  chat.messages = (legacy.messages || []).map((message) => ({
    id: String(message.id || crypto.randomUUID()),
    role: message.role === "user" ? "user" : "assistant",
    content: String(message.content || message.code || ""),
    kind: message.kind === "error" ? "error" : "text",
    createdAt: now
  }));
  chat.updatedAt = now;
  const files: WorkspaceFile[] = [];
  for (const item of legacy.files || []) {
    const data = item.data instanceof ArrayBuffer ? item.data : undefined;
    files.push({
      id: String(item.id || crypto.randomUUID()),
      projectId: project.id,
      chatId: item.source === "result" ? chat.id : undefined,
      name: String(item.name || "file"),
      logicalPath: item.source === "result"
        ? `${project.rootPath}/chats/${chat.id}/outputs/${String(item.name || "file")}`
        : `${project.rootPath}/inputs/${String(item.name || "file")}`,
      type: String(item.type || "application/octet-stream"),
      size: Number(item.size || data?.byteLength || 0),
      sha256: data ? await sha256(data) : "",
      source: item.source === "result" ? "result" : item.source === "omero" ? "omero" : "local",
      state: item.state === "failed" ? "failed" : data ? "ready" : "missing",
      data,
      error: item.error,
      annotationId: item.annotationId,
      createdAt: now
    });
  }
  const workspace = {
    project,
    chats: [chat],
    files,
    executions: [],
    scripts: [],
    workflows: [],
    artifacts: [],
    audits: [],
    evidence: []
  };
  await saveWorkspace(workspace);
  await setValue(`migration:v2:${key}`, { completedAt: now });
  return workspace;
}

export async function loadOrCreateWorkspace(context: OmeroContext | null): Promise<ProjectWorkspace> {
  const key = await contextKey(context);
  let project = await findProject(key);
  if (!project) {
    const now = new Date().toISOString();
    const chat = newChat(crypto.randomUUID());
    project = {
      id: chat.projectId,
      contextKey: key,
      rootPath: projectRoot(context),
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
    const migrated = await migrateLegacy(project, chat, key);
    if (migrated) return migrated;
    const workspace = {
      project,
      chats: [chat],
      files: [],
      executions: [],
      scripts: [],
      workflows: [],
      artifacts: [],
      audits: [],
      evidence: []
    };
    await saveWorkspace(workspace);
    return workspace;
  }
  const [chats, files, executions, scripts, workflows, artifacts, audits, evidence] = await Promise.all([
    entitiesForProject<ChatRecord>("chats", project.id),
    entitiesForProject<WorkspaceFile>("files", project.id),
    entitiesForProject<ExecutionRecord>("executions", project.id),
    entitiesForProject<ScriptRecord>("scripts", project.id),
    entitiesForProject<WorkflowRecord>("workflows", project.id),
    entitiesForProject<ArtifactRecord>("artifacts", project.id),
    entitiesForProject<OutboundPayloadAudit>("audits", project.id),
    entitiesForProject<EvidenceRecord>("evidence", project.id)
  ]);
  if (!chats.length) {
    const chat = newChat(project.id);
    project = { ...project, activeChatId: chat.id, updatedAt: new Date().toISOString() };
    await saveWorkspace({
      project,
      chats: [chat],
      files,
      executions,
      scripts,
      workflows,
      artifacts,
      audits,
      evidence
    });
    chats.push(chat);
  }
  return { project, chats, files, executions, scripts, workflows, artifacts, audits, evidence };
}

export async function listContextProjects(context: OmeroContext | null): Promise<ProjectRecord[]> {
  const key = await contextKey(context);
  const db = await database();
  const tx = db.transaction("projects", "readonly");
  const values = await requestValue(tx.objectStore("projects").getAll()) as ProjectRecord[];
  return values
    .filter((project) => project.contextKey === key || project.contextKey.startsWith(`${key}:import:`))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function listUserProjects(context: OmeroContext | null): Promise<ProjectRecord[]> {
  if (!context) return listContextProjects(null);
  const db = await database();
  const tx = db.transaction("projects", "readonly");
  const values = await requestValue(tx.objectStore("projects").getAll()) as ProjectRecord[];
  return values
    .filter((project) =>
      project.userId === context.user_id &&
      project.groupId === context.group_id
    )
    .sort((a, b) => {
      const object = `${a.objectType || ""}:${a.objectId || 0}`.localeCompare(
        `${b.objectType || ""}:${b.objectId || 0}`
      );
      return object || b.updatedAt.localeCompare(a.updatedAt);
    });
}

export async function loadWorkspace(projectId: string): Promise<ProjectWorkspace | undefined> {
  const db = await database();
  const tx = db.transaction("projects", "readonly");
  const project = await requestValue(tx.objectStore("projects").get(projectId)) as ProjectRecord | undefined;
  if (!project) return undefined;
  const [chats, files, executions, scripts, workflows, artifacts, audits, evidence] = await Promise.all([
    entitiesForProject<ChatRecord>("chats", project.id),
    entitiesForProject<WorkspaceFile>("files", project.id),
    entitiesForProject<ExecutionRecord>("executions", project.id),
    entitiesForProject<ScriptRecord>("scripts", project.id),
    entitiesForProject<WorkflowRecord>("workflows", project.id),
    entitiesForProject<ArtifactRecord>("artifacts", project.id),
    entitiesForProject<OutboundPayloadAudit>("audits", project.id),
    entitiesForProject<EvidenceRecord>("evidence", project.id)
  ]);
  return { project, chats, files, executions, scripts, workflows, artifacts, audits, evidence };
}

export async function storageEstimate(): Promise<{ usage: number; quota: number }> {
  const value = await navigator.storage?.estimate?.();
  return { usage: value?.usage || 0, quota: value?.quota || 0 };
}

export const settingsKey = "provider:AmsterdamUMC";
export const defaultSettings: ProviderSettings = {
  apiKey: "",
  model: "",
  contextWindow: 0,
  rememberKey: false
};
