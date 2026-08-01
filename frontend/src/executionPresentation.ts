import type { AnalysisWorkspace, ExecutionRecord } from "./types";

type ExecutionWorkspace = Pick<
  AnalysisWorkspace,
  "executions" | "files" | "artifacts"
>;

export function executionPreparesViewer(
  workspace: Pick<AnalysisWorkspace, "artifacts">,
  execution: ExecutionRecord
): boolean {
  if (execution.purpose === "inspection") return false;
  if (workspace.artifacts.some((artifact) =>
    artifact.chatId === execution.chatId &&
    artifact.promptId === execution.promptId &&
    Boolean(artifact.viewer)
  )) return true;
  const payload = execution.modelPayload
    ? JSON.stringify(execution.modelPayload)
    : "";
  return (
    /\brender_panels\b/i.test(execution.code) ||
    /"render_panels"\s*:/i.test(payload) ||
    (
      /\bstore_uuid\b/i.test(execution.code) &&
      /\b(?:field|roi|source_channels|overlays)\b/i.test(execution.code)
    ) ||
    (
      /"store_uuid"\s*:/i.test(payload) &&
      /"(?:field|roi|source_channels|overlays)"\s*:/i.test(payload)
    )
  );
}

export function executionsForPrompt(
  workspace: Pick<AnalysisWorkspace, "executions">,
  execution: ExecutionRecord
): ExecutionRecord[] {
  return workspace.executions
    .filter((item) =>
      item.chatId === execution.chatId && item.promptId === execution.promptId
    )
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

function hasOutput(
  workspace: Pick<AnalysisWorkspace, "files">,
  execution: ExecutionRecord,
  visualOnly: boolean
): boolean {
  return execution.outputFileIds.some((fileId) => {
    const file = workspace.files.find((item) => item.id === fileId && !item.deletedAt);
    return Boolean(file && (!visualOnly || file.type.startsWith("image/")));
  });
}

/** Select the single user-facing local Analysis run for a request. */
export function primaryExecutionForPrompt(
  workspace: ExecutionWorkspace,
  execution: ExecutionRecord
): ExecutionRecord | null {
  const candidates = executionsForPrompt(workspace, execution).filter((item) =>
    item.purpose !== "inspection" && !executionPreparesViewer(workspace, item)
  );
  if (!candidates.length) return null;

  const completed = candidates.filter((item) =>
    ["success", "reused", "incomplete"].includes(item.status)
  );
  const latest = (items: ExecutionRecord[]) => items.at(-1) || null;
  return (
    latest(completed.filter((item) => hasOutput(workspace, item, true))) ||
    latest(completed.filter((item) => hasOutput(workspace, item, false))) ||
    latest(completed) ||
    latest(candidates)
  );
}
