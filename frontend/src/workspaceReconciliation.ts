import type { SyncStatus, WorkspaceRecord } from "./types";

export interface WorkspaceReconciliationResult {
  retained: WorkspaceRecord[];
  deletedWorkspaceIds: string[];
  errors: Array<{ workspaceId: string; error: unknown }>;
}

/** Only an explicit lifecycle tombstone establishes that remote content was purged. */
export function remoteWorkspaceWasDeleted(
  workspace: WorkspaceRecord,
  status: SyncStatus
): boolean {
  // Absence is not proof of deletion: links and permissions may have changed.
  // Even an explicit remote purge must not erase unsynchronized local work.
  return Boolean(workspace.omeroSync) && status.lifecycle === "purged";
}

/**
 * Reconcile durable remote deletions without turning connection failures into
 * destructive actions. Probes that fail leave their local Workspace intact.
 */
export async function reconcileDeletedRemoteWorkspaces(
  workspaces: WorkspaceRecord[],
  readStatus: (workspaceId: string) => Promise<SyncStatus>,
  _removeLocal: (workspaceId: string) => Promise<void>
): Promise<WorkspaceReconciliationResult> {
  const retained: WorkspaceRecord[] = [];
  const deletedWorkspaceIds: string[] = [];
  const errors: Array<{ workspaceId: string; error: unknown }> = [];

  for (const workspace of workspaces) {
    if (!workspace.omeroSync) {
      retained.push(workspace);
      continue;
    }
    try {
      const status = await readStatus(workspace.id);
      if (!remoteWorkspaceWasDeleted(workspace, status)) {
        retained.push(workspace);
        continue;
      }
      retained.push(workspace);
      errors.push({ workspaceId: workspace.id,
        error: new Error("This workspace was purged in OMERO. Its browser copy is preserved for recovery.") });
    } catch (error) {
      retained.push(workspace);
      errors.push({ workspaceId: workspace.id, error });
    }
  }

  return { retained, deletedWorkspaceIds, errors };
}
