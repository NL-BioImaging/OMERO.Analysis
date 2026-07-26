import type { ChatMessage, ProviderSettings, WorkspaceFile } from "./types";

const DB_NAME = "omero-analysis-chat";
const DB_VERSION = 1;

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("values")) db.createObjectStore("values");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getValue<T>(key: string): Promise<T | undefined> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("values", "readonly");
    const request = transaction.objectStore("values").get(key);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
  });
}

export async function setValue<T>(key: string, value: T): Promise<void> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("values", "readwrite");
    transaction.objectStore("values").put(value, key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function deleteValue(key: string): Promise<void> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("values", "readwrite");
    transaction.objectStore("values").delete(key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export interface PersistedWorkspace {
  messages: ChatMessage[];
  files: WorkspaceFile[];
}

export const settingsKey = "provider:AmsterdamUMC";
export const defaultSettings: ProviderSettings = { apiKey: "", model: "" };

