import type { ArtifactRecord, WorkspaceFile } from "./types";

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
