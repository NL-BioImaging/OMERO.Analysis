import type { AnalysisWorkspace } from "./types";

export const NOTEBOOK_STORAGE_VERSION = 3;
export const LEGACY_BACKUP_STORE = "migration-backups";
export const RETIRED_STORES = new Set(["chats", "methods", "pipelines", "audits", "evidence", "executions", "runs", "artifacts"]);
export const retiredValueKey = (key: string) =>
  key === "provider:generic" || key.startsWith("provider:") || key.startsWith("skills:custom:");

/**
 * Copy affected records before removal in the SAME IndexedDB upgrade transaction.
 * Quota errors abort the complete upgrade; the original database stays intact.
 * A v2 client cannot reopen the v3 database and recreate retired records.
 */
export function upgradeNotebookStorage(db: IDBDatabase, tx: IDBTransaction, oldVersion: number) {
  const backup = db.objectStoreNames.contains(LEGACY_BACKUP_STORE)
    ? tx.objectStore(LEGACY_BACKUP_STORE) : db.createObjectStore(LEGACY_BACKUP_STORE);
  if (oldVersion === 0 || oldVersion >= NOTEBOOK_STORAGE_VERSION) return;
  const startedAt = new Date().toISOString();
  backup.put({ version: NOTEBOOK_STORAGE_VERSION, startedAt, oldVersion }, "v3:inventory");
  for (const name of [...RETIRED_STORES, "values", "workspaces"]) {
    if (!db.objectStoreNames.contains(name)) continue;
    const cursor = tx.objectStore(name).openCursor();
    cursor.onsuccess = () => {
      const entry = cursor.result;
      if (!entry) return;
      const affected = name !== "values" || retiredValueKey(String(entry.key));
      if (affected) {
        backup.put({ store: name, key: entry.key, value: entry.value, backedUpAt: startedAt },
          `v3:${name}:${String(entry.key)}`);
        if (name === "workspaces") entry.update({ ...entry.value, activeChatId: "", plotCsv: true, storageVersion: 3 });
        else entry.delete();
      }
      entry.continue();
    };
  }
}

/** Legacy archives may be read, but their executable/assistant records never return. */
export function notebookWorkspace(value: AnalysisWorkspace): AnalysisWorkspace {
  return {
    ...value,
    workspace: { ...value.workspace, activeChatId: "", plotCsv: true, storageVersion: 3 },
    chats: [], methods: [], pipelines: [], audits: [], evidence: [],
    executions: [], runs: [], artifacts: [],
    // Preserve every input and result, including outputs of removed Methods.
    files: value.files.map(file => file.role === "chat-attachment"
      ? { ...file, role: undefined, chatId: undefined, attachment: undefined } : file),
  };
}
