import type { ArtifactRecord, ExecutionRecord, WorkspaceFile } from "./types";

export function withoutSupersededOutputRuns(
  executions: ExecutionRecord[],
  files: WorkspaceFile[]
): ExecutionRecord[] {
  const ordered = [...executions].sort((left, right) =>
    left.createdAt.localeCompare(right.createdAt)
  );
  const outputNames = (execution: ExecutionRecord) => new Set(
    [
      ...execution.outputFileIds
      .map((fileId) => files.find((file) => file.id === fileId))
      .filter((file): file is WorkspaceFile => Boolean(file))
      .map((file) => file.name.toLowerCase()),
      ...Array.from(
        execution.code.matchAll(/\/output\/([^"'`\s)]+)/g),
        (match) => match[1].toLowerCase()
      )
    ]
  );
  const names = ordered.map(outputNames);
  return ordered.filter((_execution, index) => {
    if (!names[index].size) return true;
    return !ordered.slice(index + 1).some((_later, offset) => {
      const laterNames = names[index + 1 + offset];
      return [...names[index]].every((name) => laterNames.has(name));
    });
  });
}

function readableFileTitle(value: string): string {
  const title = value
    .replace(/\.(png|svg)$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return title ? title.charAt(0).toUpperCase() + title.slice(1) : "";
}

export function visualSaveTitle(
  artifacts: ArtifactRecord[],
  files: WorkspaceFile[],
  options: {
    chatId: string;
    promptId?: string;
    executionIds?: Iterable<string>;
  }
): string | null {
  const executionIds = new Set(options.executionIds || []);
  const candidates = artifacts
    .filter((artifact) =>
      artifact.chatId === options.chatId &&
      (artifact.kind === "viewer-preview" || artifact.kind === "plot") &&
      (
        (artifact.executionId != null && executionIds.has(artifact.executionId)) ||
        (options.promptId != null && artifact.promptId === options.promptId)
      )
    )
    .sort((left, right) => {
      const kind = Number(right.kind === "viewer-preview") - Number(left.kind === "viewer-preview");
      return kind || right.createdAt.localeCompare(left.createdAt);
    });
  for (const artifact of candidates) {
    const file = files.find((item) => item.id === artifact.fileId);
    if (artifact.kind === "plot" && !file?.type.startsWith("image/")) continue;
    const raw = artifact.title || file?.name || "";
    if (!raw) continue;
    if (file?.name === raw || /\.(png|svg)$/i.test(raw)) {
      const readable = readableFileTitle(raw);
      if (readable) return readable;
    }
    return raw.trim();
  }
  return null;
}
