import type { ChatMessage, ExecutionPurpose } from "./types";

export function formatDuration(durationMs?: number): string {
  if (durationMs == null || !Number.isFinite(durationMs) || durationMs < 0) return "";
  const seconds = durationMs / 1000;
  if (seconds < 10) return `${Math.max(0.1, seconds).toFixed(1)} sec`;
  if (seconds < 60) return `${Math.round(seconds)} sec`;
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60);
  return remainder ? `${minutes} min ${remainder} sec` : `${minutes} min`;
}

export function activityText(
  activity?: ChatMessage["activity"],
  durationMs?: number
): string {
  const duration = formatDuration(durationMs);
  if (!activity || !duration) return "";
  return `${activity === "worked" ? "Worked" : "Thought"} for ${duration}`;
}

export function executionActivityText(
  purpose: ExecutionPurpose | undefined,
  durationMs?: number
): string {
  const duration = formatDuration(durationMs);
  if (!duration) return "";
  return purpose === "inspection"
    ? `Worked for ${duration} · for AI data inspection`
    : `Worked for ${duration}`;
}

export function projectRowClassName(
  itemId: string,
  openProjectId: string,
  selectedProjectId: string | null
): string {
  const selected = itemId === (selectedProjectId || openProjectId);
  return [
    "browser-row",
    "project-row",
    selected ? "selected" : "",
    itemId === openProjectId ? "open" : ""
  ].filter(Boolean).join(" ");
}
