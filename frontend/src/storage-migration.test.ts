import { loadOrCreateWorkspace } from "./storage";

function requestValue<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

describe("clean-break browser storage", () => {
  it("does not read the old Project-era database", async () => {
    const request = indexedDB.open("omero-analysis", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("projects", { keyPath: "id" });
    };
    const old = await requestValue(request);
    const transaction = old.transaction("projects", "readwrite");
    transaction.objectStore("projects").put({
      id: "legacy-project",
      contextKey: "7:4:Dataset:42",
      name: "Must not migrate"
    });
    await new Promise<void>((resolve) => {
      transaction.oncomplete = () => resolve();
    });
    old.close();

    const created = await loadOrCreateWorkspace({
      object_type: "Dataset",
      object_id: 42,
      name: "Current",
      user_id: 7,
      group_id: 4,
      can_annotate: true,
      selected_attachments: []
    });
    expect(created.workspace.name).toBe("Current");
    expect(created.workspace.id).not.toBe("legacy-project");
  });
});
