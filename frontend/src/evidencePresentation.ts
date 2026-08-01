import { primaryExecutionForPrompt } from "./executionPresentation";
import type { AnalysisWorkspace, WorkspaceFile } from "./types";

export interface EvidenceLink {
  key: string;
  fileId: string;
  label: string;
  title: string;
}

function evidenceFileLabel(file: WorkspaceFile): string {
  if (file.type.startsWith("image/")) return `Image: ${file.name}`;
  if (/csv|tab-separated-values|spreadsheet/i.test(file.type) || /\.(csv|tsv|xlsx?)$/i.test(file.name)) {
    return `Data: ${file.name}`;
  }
  return `Result: ${file.name}`;
}

function evidenceFileTitle(file: WorkspaceFile): string {
  const kind = file.type.startsWith("image/")
    ? "image result"
    : /csv|tab-separated-values|spreadsheet/i.test(file.type) || /\.(csv|tsv|xlsx?)$/i.test(file.name)
      ? "tabular result"
      : "generated result";
  return `Open ${kind} “${file.name}” in the Artifact Inspector`;
}

/** Resolve old and new execution citations to distinct user-facing result files. */
export function evidenceLinks(
  workspace: Pick<AnalysisWorkspace, "executions" | "files" | "artifacts">,
  citationIds: string[]
): EvidenceLink[] {
  const cited = workspace.executions.filter((execution) => citationIds.includes(execution.id));
  const primary = new Map<string, (typeof cited)[number]>();
  for (const execution of cited) {
    const selected = primaryExecutionForPrompt(workspace, execution);
    if (selected) primary.set(selected.id, selected);
  }
  const executions = primary.size
    ? Array.from(primary.values())
    : cited.filter((execution) => ["success", "reused", "incomplete"].includes(execution.status));
  const seen = new Set<string>();
  const links: EvidenceLink[] = [];
  for (const execution of executions) {
    for (const fileId of execution.outputFileIds) {
      const file = workspace.files.find((candidate) =>
        candidate.id === fileId && !candidate.deletedAt
      );
      if (!file) continue;
      const key = `${file.sha256}:${file.type}`;
      if (seen.has(key)) continue;
      seen.add(key);
      links.push({
        key,
        fileId: file.id,
        label: evidenceFileLabel(file),
        title: evidenceFileTitle(file)
      });
    }
  }
  return links.sort((left, right) => {
    const leftImage = left.label.startsWith("Image:") ? 0 : 1;
    const rightImage = right.label.startsWith("Image:") ? 0 : 1;
    return leftImage - rightImage || left.label.localeCompare(right.label);
  });
}
