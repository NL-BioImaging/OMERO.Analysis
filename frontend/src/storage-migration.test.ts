import type { ChatRecord, ProjectRecord } from "./types";

const LEGACY_DB_NAME = "omero-analysis-chat";
const DB_NAME = "omero-analysis";
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
    transaction.onabort = () => reject(transaction.error);
  });
}

function deleteDatabase(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function legacyDatabase(): Promise<IDBDatabase> {
  const request = indexedDB.open(LEGACY_DB_NAME, 5);
  request.onupgradeneeded = () => {
    const db = request.result;
    db.createObjectStore("values");
    for (const name of STORES) {
      const store = db.createObjectStore(name, { keyPath: "id" });
      if (name !== "projects") store.createIndex("projectId", "projectId");
      if (name === "projects") store.createIndex("contextKey", "contextKey", { unique: true });
      if (name === "files" || name === "executions" || name === "evidence") {
        store.createIndex("chatId", "chatId");
      }
    }
  };
  return requestValue(request);
}

describe("OMERO.Analysis browser storage migration", () => {
  it("copies the complete Analysis Chat database on first use", async () => {
    await Promise.all([deleteDatabase(DB_NAME), deleteDatabase(LEGACY_DB_NAME)]);
    const legacy = await legacyDatabase();
    const createdAt = "2026-07-28T00:00:00.000Z";
    const project: ProjectRecord = {
      id: "legacy-project",
      contextKey: "7:4:Dataset:42",
      rootPath: "OMERO/Dataset-42--cells",
      name: "Legacy cells",
      objectType: "Dataset",
      objectId: 42,
      userId: 7,
      groupId: 4,
      activeChatId: "legacy-chat",
      plotCsv: true,
      createdAt,
      updatedAt: createdAt
    };
    const chat: ChatRecord = {
      id: "legacy-chat",
      projectId: project.id,
      title: "Preserved chat",
      summary: "",
      archived: false,
      messages: [],
      createdAt,
      updatedAt: createdAt
    };
    const tx = legacy.transaction(["projects", "chats", "values"], "readwrite");
    tx.objectStore("projects").put(project);
    tx.objectStore("chats").put(chat);
    tx.objectStore("values").put({ rememberKey: false }, "provider:AmsterdamUMC");
    await transactionDone(tx);
    legacy.close();

    vi.resetModules();
    const storage = await import("./storage");
    const migrated = await storage.loadWorkspace(project.id);
    expect(migrated?.project.name).toBe("Legacy cells");
    expect(migrated?.chats[0].title).toBe("Preserved chat");
    expect(await storage.getValue("provider:AmsterdamUMC")).toEqual({ rememberKey: false });
  });
});
