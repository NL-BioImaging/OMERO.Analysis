import { notebookWorkspace, upgradeNotebookStorage, LEGACY_BACKUP_STORE } from "./notebookMigration";
import type { AnalysisWorkspace } from "./types";

const value = <T>(request: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
});
const complete = (tx: IDBTransaction) => new Promise<void>((resolve, reject) => {
  tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); tx.onerror = () => reject(tx.error);
});

it("backs up all local users atomically and preserves notebooks, file bytes, and unrelated settings", async () => {
  const name = `migration-${crypto.randomUUID()}`;
  const oldRequest = indexedDB.open(name, 2);
  oldRequest.onupgradeneeded = () => {
    for (const store of ["chats", "methods", "pipelines", "values", "workspaces", "files", "notebooks"]) oldRequest.result.createObjectStore(store);
  };
  const old = await value(oldRequest);
  const tx = old.transaction(Array.from(old.objectStoreNames), "readwrite");
  tx.objectStore("methods").put({id: "m", workspaceId: "a", code: "legacy"}, "m");
  tx.objectStore("chats").put({id: "c", workspaceId: "b", messages: ["private"]}, "c");
  tx.objectStore("workspaces").put({id: "a", userId: 1, activeChatId: "c", plotCsv: false}, "a");
  tx.objectStore("workspaces").put({id: "b", userId: 2, activeChatId: "d"}, "b");
  tx.objectStore("values").put({apiKey: "test-only-secret"}, "provider:profiles:v1");
  tx.objectStore("values").put("dark", "ui:theme:v1");
  tx.objectStore("files").put({id: "result", methodId: "m", data: new Uint8Array([1,2,3])}, "result");
  tx.objectStore("notebooks").put({id: "notebook", document: {nbformat: 4}}, "notebook");
  await complete(tx); old.close();
  const request = indexedDB.open(name, 3);
  request.onupgradeneeded = event => upgradeNotebookStorage(request.result, request.transaction!, event.oldVersion);
  const db = await value(request);
  const read = db.transaction(Array.from(db.objectStoreNames), "readonly");
  const [methods, chats, settings, theme, files, notebooks, backups, workspaces] = await Promise.all([
    value(read.objectStore("methods").getAll()), value(read.objectStore("chats").getAll()),
    value(read.objectStore("values").get("provider:profiles:v1")), value(read.objectStore("values").get("ui:theme:v1")),
    value(read.objectStore("files").getAll()), value(read.objectStore("notebooks").getAll()),
    value(read.objectStore(LEGACY_BACKUP_STORE).getAll()), value(read.objectStore("workspaces").getAll()),
  ]);
  expect(methods).toEqual([]); expect(chats).toEqual([]); expect(settings).toBeUndefined(); expect(theme).toBe("dark");
  expect(Array.from(files[0].data)).toEqual([1,2,3]); expect(notebooks[0].id).toBe("notebook");
  expect(backups.some(item => item.store === "methods" && item.value.code === "legacy")).toBe(true);
  expect(backups.some(item => item.store === "chats" && item.value.messages[0] === "private")).toBe(true);
  expect(workspaces.map(item => [item.userId, item.activeChatId, item.plotCsv])).toEqual([[1, "", true], [2, "", true]]);
  db.close();
  await expect(value(indexedDB.open(name, 2))).rejects.toMatchObject({name: "VersionError"});
  await value(indexedDB.deleteDatabase(name));
});

it("cannot restore retired records but preserves old Method results and input bytes", () => {
  const file = {id: "result", source: "result", methodId: "method", data: new Uint8Array([7]).buffer};
  const attachment = {id: "input", source: "local", role: "chat-attachment", data: new Uint8Array([8]).buffer};
  const legacy = {workspace: {id: "a", activeChatId: "c", plotCsv: false}, files: [file, attachment],
    notebooks: [{id: "n"}], chats: [{id: "c"}], methods: [{id: "method"}], pipelines: [{id: "p"}],
    executions: [{id: "e"}], runs: [], artifacts: [], audits: [], evidence: []} as unknown as AnalysisWorkspace;
  const migrated = notebookWorkspace(legacy);
  expect(migrated.methods).toEqual([]); expect(migrated.chats).toEqual([]); expect(migrated.pipelines).toEqual([]);
  expect(migrated.files[0]).toBe(file); expect(migrated.files[1].data).toBe(attachment.data);
  expect(migrated.files[1].role).toBeUndefined(); expect(migrated.notebooks).toBe(legacy.notebooks);
  expect(notebookWorkspace(migrated)).toEqual(migrated);
  expect(legacy.methods).toHaveLength(1);
});
