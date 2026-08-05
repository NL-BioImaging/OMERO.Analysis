import {
  reconcileDeletedRemoteWorkspaces,
  remoteWorkspaceWasDeleted
} from "./workspaceReconciliation";
import type { SyncStatus, WorkspaceRecord } from "./types";

const timestamp = "2026-08-05T12:00:00.000Z";

function workspace(id: string, synced = true): WorkspaceRecord {
  return {
    id,
    contextKey: `7:4:Dataset:${id}`,
    rootPath: `OMERO/Dataset-${id}`,
    name: id,
    objectType: "Dataset",
    objectId: 42,
    userId: 7,
    groupId: 4,
    activeChatId: `chat-${id}`,
    plotCsv: true,
    ...(synced ? {
      omeroSync: {
        projectId: 2,
        datasetId: 303,
        manifestAnnotationId: 1002,
        remoteRevision: 3,
        inventoryDigest: "digest",
        lastSyncedAt: timestamp
      }
    } : {}),
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function status(linked: boolean): SyncStatus {
  return {
    schema: "nl.bioimaging.analysis.sync.status.v1",
    canSync: true,
    reason: "",
    linked,
    remoteRevision: linked ? 3 : 0,
    inventoryDigest: linked ? "digest" : "",
    itemCount: linked ? 4 : 0
  };
}

describe("remote Workspace deletion reconciliation", () => {
  it("recognizes a confirmed deletion only for a previously synced Workspace", () => {
    expect(remoteWorkspaceWasDeleted(workspace("synced"), status(false))).toBe(true);
    expect(remoteWorkspaceWasDeleted(workspace("local", false), status(false))).toBe(false);
    expect(remoteWorkspaceWasDeleted(workspace("linked"), status(true))).toBe(false);
  });

  it("deletes missing synced Workspaces but preserves new local Workspaces", async () => {
    const removed: string[] = [];
    const result = await reconcileDeletedRemoteWorkspaces(
      [workspace("deleted"), workspace("local", false), workspace("linked")],
      async (workspaceId) => status(workspaceId === "linked"),
      async (workspaceId) => { removed.push(workspaceId); }
    );

    expect(removed).toEqual(["deleted"]);
    expect(result.deletedWorkspaceIds).toEqual(["deleted"]);
    expect(result.retained.map((item) => item.id)).toEqual(["local", "linked"]);
  });

  it("keeps local data when the OMERO status check fails", async () => {
    const removed: string[] = [];
    const result = await reconcileDeletedRemoteWorkspaces(
      [workspace("offline")],
      async () => { throw new Error("OMERO unavailable"); },
      async (workspaceId) => { removed.push(workspaceId); }
    );

    expect(removed).toEqual([]);
    expect(result.retained.map((item) => item.id)).toEqual(["offline"]);
    expect(result.errors).toHaveLength(1);
  });
});
