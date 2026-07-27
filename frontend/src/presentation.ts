import type {
  ChatMessage,
  ExecutionPurpose,
  WorkflowSkillCatalog
} from "./types";

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

export function workflowSkillTooltip(
  catalog: WorkflowSkillCatalog | null,
  warning: string,
  matchingSkillKeys: string[]
): string {
  if (warning) {
    return `Workflow-specific guidance is unavailable.\n${warning}`;
  }
  if (!catalog) {
    return "The workflow-skill catalog is still loading or is not configured.";
  }
  const values = [...catalog.workflows, ...(catalog.applications || [])].flatMap((entry) =>
    entry.skills.map((skill) => ({
      key: `${entry.source.source_key || entry.source.workflow_key}/${skill.name}`,
      label: `${entry.source.source_key || entry.source.workflow_key}: ${skill.name} v${skill.version}` +
        `${entry.source.source_kind === "application" ? " (application)" : ""}`,
      ref: entry.source.configured_ref,
      commit: entry.source.resolved_commit.slice(0, 12),
      status: entry.status
    }))
  );
  if (!values.length) {
    return [
      "No workflow skills are currently available.",
      "A configured workflow repository must publish compatible skills before they can be activated."
    ].join("\n");
  }
  const matches = new Set(matchingSkillKeys);
  return [
    `${values.length} validated workflow/application skill${values.length === 1 ? "" : "s"} discovered.`,
    matches.size
      ? `${matches.size} match${matches.size === 1 ? "es" : ""} the current inputs (marked ✓).`
      : "None currently match the loaded inputs.",
    "",
    ...values.map((value) =>
      `${matches.has(value.key) ? "✓" : "•"} ${value.label} — ${value.ref} @ ${value.commit} [${value.status}]`
    )
  ].join("\n");
}
