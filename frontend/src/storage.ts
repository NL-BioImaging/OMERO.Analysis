import type {
  ChatRecord,
  ExecutionRecord,
  OmeroContext,
  ProjectRecord,
  ProjectWorkspace,
  ProviderSettings,
  ScriptRecord,
  WorkspaceFile
} from "./types";

const DB_NAME = "omero-analysis-chat";
const DB_VERSION = 2;
const STORES = ["projects", "chats", "files", "executions", "scripts"] as const;
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

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("values")) db.createObjectStore("values");
      for (const name of STORES) {
        if (db.objectStoreNames.contains(name)) continue;
        const store = db.createObjectStore(name, { keyPath: "id" });
        if (name !== "projects") store.createIndex("projectId", "projectId");
        if (name === "projects") store.createIndex("contextKey", "contextKey", { unique: true });
        if (name === "files" || name === "executions") {
          store.createIndex("chatId", "chatId");
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
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

export const saveProject = (value: ProjectRecord) => putEntity("projects", value);
export const saveChat = (value: ChatRecord) => putEntity("chats", value);
export const saveFile = (value: WorkspaceFile) => putEntity("files", value);
export const saveExecution = (value: ExecutionRecord) => putEntity("executions", value);
export const saveScript = (value: ScriptRecord) => putEntity("scripts", value);
export const deleteFile = (id: string) => deleteEntity("files", id);
export const deleteChat = (id: string) => deleteEntity("chats", id);

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
  const db = await database();
  const tx = db.transaction([...STORES], "readwrite");
  tx.objectStore("projects").put(workspace.project);
  workspace.chats.forEach((value) => tx.objectStore("chats").put(value));
  workspace.files.forEach((value) => tx.objectStore("files").put(value));
  workspace.executions.forEach((value) => tx.objectStore("executions").put(value));
  workspace.scripts.forEach((value) => tx.objectStore("scripts").put(value));
  await transactionDone(tx);
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
  const workspace = { project, chats: [chat], files, executions: [], scripts: [] };
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
    const workspace = { project, chats: [chat], files: [], executions: [], scripts: [] };
    await saveWorkspace(workspace);
    return workspace;
  }
  const [chats, files, executions, scripts] = await Promise.all([
    entitiesForProject<ChatRecord>("chats", project.id),
    entitiesForProject<WorkspaceFile>("files", project.id),
    entitiesForProject<ExecutionRecord>("executions", project.id),
    entitiesForProject<ScriptRecord>("scripts", project.id)
  ]);
  if (!chats.length) {
    const chat = newChat(project.id);
    project = { ...project, activeChatId: chat.id, updatedAt: new Date().toISOString() };
    await saveWorkspace({ project, chats: [chat], files, executions, scripts });
    chats.push(chat);
  }
  return { project, chats, files, executions, scripts };
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

export async function loadWorkspace(projectId: string): Promise<ProjectWorkspace | undefined> {
  const db = await database();
  const tx = db.transaction("projects", "readonly");
  const project = await requestValue(tx.objectStore("projects").get(projectId)) as ProjectRecord | undefined;
  if (!project) return undefined;
  const [chats, files, executions, scripts] = await Promise.all([
    entitiesForProject<ChatRecord>("chats", project.id),
    entitiesForProject<WorkspaceFile>("files", project.id),
    entitiesForProject<ExecutionRecord>("executions", project.id),
    entitiesForProject<ScriptRecord>("scripts", project.id)
  ]);
  return { project, chats, files, executions, scripts };
}

export async function storageEstimate(): Promise<{ usage: number; quota: number }> {
  const value = await navigator.storage?.estimate?.();
  return { usage: value?.usage || 0, quota: value?.quota || 0 };
}

export const settingsKey = "provider:AmsterdamUMC";
export const defaultSettings: ProviderSettings = {
  apiKey: "",
  model: "",
  contextWindow: 0
};
