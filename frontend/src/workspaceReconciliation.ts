import type { SyncStatus, WorkspaceRecord } from "./types";

export interface WorkspaceReconciliationResult {
  retained: WorkspaceRecord[];
  deletedWorkspaceIds: string[];
  errors: Array<{ workspaceId: string; error: unknown }>;
}

/**
 * A missing remote Dataset is authoritative only after this browser has
 * successfully synchronized the Workspace before. A new browser-local
 * Workspace has no omeroSync marker and must never be removed merely because
 * it has not been published yet.
 */
export function remoteWorkspaceWasDeleted(
  workspace: WorkspaceRecord,
  status: SyncStatus
): boolean {
  return Boolean(workspace.omeroSync) && !status.linked;
}

/**
 * Reconcile durable remote deletions without turning connection failures into
 * destructive actions. Probes that fail leave their local Workspace intact.
 */
export async function reconcileDeletedRemoteWorkspaces(
  workspaces: WorkspaceRecord[],
  readStatus: (workspaceId: string) => Promise<SyncStatus>,
  removeLocal: (workspaceId: string) => Promise<void>
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
      await removeLocal(workspace.id);
      deletedWorkspaceIds.push(workspace.id);
    } catch (error) {
      retained.push(workspace);
      errors.push({ workspaceId: workspace.id, error });
    }
  }

  return { retained, deletedWorkspaceIds, errors };
}
