import { loadOrCreateWorkspace, loadWorkspace } from "./storage";
import { prepareRemoteInput } from "./workspaceInputs";
import type { WorkspaceFile } from "./types";

it("restores a prepared remote database reference after reopening without launch attachments", async () => {
  const workspace = await loadOrCreateWorkspace(null, "remote-input-persistence");
  const file = { id: "remote-persistence", workspaceId: workspace.workspace.id,
    name: "plate-results.duckdb", logicalPath: "inputs/plate-results.duckdb",
    type: "application/octet-stream", size: 1_500_000_000, sha256: "",
    source: "omero", state: "ready", annotationId: 1515, fileId: 42,
    createdAt: "2026-10-13T00:00:00Z" } as WorkspaceFile;
  await prepareRemoteInput(file, async () => ({ schema_digest: "schema-one" }));
  const restored = await loadWorkspace(workspace.workspace.id);
  expect(restored?.files).toContainEqual(expect.objectContaining({
    id: file.id, annotationId: 1515, dataQueryMode: "remote", state: "ready",
    remoteSchemaDigest: "schema-one", data: undefined
  }));
  await prepareRemoteInput(file, async () => { throw new Error("Worker unavailable"); });
  const failed = (await loadWorkspace(workspace.workspace.id))?.files.find(item => item.id === file.id);
  expect(failed?.state).toBe("failed");
  expect(failed?.error).toContain("Worker unavailable");
});
