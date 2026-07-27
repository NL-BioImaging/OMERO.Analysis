import type {
  DataProfile,
  WorkflowSkillCatalog,
  WorkflowSkillEntry,
  WorkflowSkillPackage,
  WorkflowSkillSummary,
  WorkspaceFile
} from "./types";

export interface MatchedWorkflowSkill {
  entry: WorkflowSkillEntry;
  skill: WorkflowSkillSummary;
  score: number;
  reasons: string[];
}

export function workflowSkillSourceKey(entry: WorkflowSkillEntry): string {
  return entry.source.source_key || entry.source.workflow_key;
}

function globMatches(name: string, glob: string): boolean {
  const expression = glob
    .split("*")
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${expression}$`, "i").test(name);
}

function profileTerms(profiles: DataProfile[]): Set<string> {
  const terms = new Set<string>();
  const visit = (value: unknown) => {
    if (typeof value === "string") terms.add(value.toLowerCase());
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object") {
      Object.entries(value).forEach(([key, item]) => {
        terms.add(key.toLowerCase());
        visit(item);
      });
    }
  };
  profiles.forEach((profile) => visit(profile.summary));
  return terms;
}

export function matchWorkflowSkills(
  catalog: WorkflowSkillCatalog | null,
  files: WorkspaceFile[],
  profiles: DataProfile[]
): MatchedWorkflowSkill[] {
  if (!catalog) return [];
  const names = files
    .filter((file) => !file.deletedAt && file.state === "ready")
    .map((file) => file.name);
  const terms = profileTerms(profiles);
  const matches: MatchedWorkflowSkill[] = [];
  for (const entry of catalog.workflows) {
    for (const skill of entry.skills) {
      let score = skill.match.auto_activate ? 1 : 0;
      const reasons: string[] = [];
      const extension = skill.match.extensions.find((value) =>
        names.some((name) => name.toLowerCase().endsWith(value.toLowerCase()))
      );
      if (extension) {
        score += 2;
        reasons.push(`extension ${extension}`);
      }
      const glob = skill.match.filename_globs.find((value) =>
        names.some((name) => globMatches(name, value))
      );
      if (glob) {
        score += 3;
        reasons.push(`filename ${glob}`);
      }
      const required = skill.match.required_tables.map((value) => value.toLowerCase());
      if (required.length && required.every((value) => terms.has(value))) {
        score += 5;
        reasons.push(`schema ${required.join(", ")}`);
      }
      const hasRules =
        skill.match.extensions.length > 0 ||
        skill.match.filename_globs.length > 0 ||
        skill.match.required_tables.length > 0;
      if (!hasRules) {
        score += 1;
        reasons.push("general workflow guidance");
      }
      if (score > 0) matches.push({ entry, skill, score, reasons });
    }
  }
  return matches.sort((left, right) =>
    right.score - left.score ||
    left.skill.name.localeCompare(right.skill.name)
  );
}

export function packageInstructions(value: WorkflowSkillPackage): string {
  const main = value.files.find((file) => file.path === "SKILL.md");
  if (!main) throw new Error(`${value.skill.name} has no SKILL.md`);
  const references = value.files
    .filter((file) => file.path !== "SKILL.md")
    .map((file) => file.path);
  const required = (value.skill.required_resources || []).map((path) => {
    const file = value.files.find((item) => item.path === path);
    if (!file) throw new Error(`${value.skill.name} requires unavailable resource ${path}`);
    return `Required reference ${path}:\n${file.content}`;
  });
  const capabilities = value.skill.required_capabilities || [];
  return [
    `Active ${value.source.source_kind === "application" ? "application-operation" : "workflow"} skill: ${value.skill.name} v${value.skill.version}`,
    `Source: ${value.source.repository_url}@${value.source.configured_ref}`,
    `Resolved commit: ${value.source.resolved_commit}`,
    `Package hash: ${value.skill.sha256}`,
    main.content,
    ...(capabilities.length
      ? [`Required host capabilities: ${capabilities.join(", ")}`]
      : []),
    ...required,
    references.length
      ? `Other available references (load only when needed): ${
        references.filter((path) => !value.skill.required_resources?.includes(path)).join(", ") || "none"
      }`
      : "No additional references."
  ].join("\n\n");
}

export function skillProvenance(value: WorkflowSkillPackage) {
  return {
    workflowKey: value.source.workflow_key,
    sourceKind: value.source.source_kind || "workflow",
    sourceKey: value.source.source_key || value.source.workflow_key,
    name: value.skill.name,
    version: value.skill.version,
    sha256: value.skill.sha256,
    configuredRef: value.source.configured_ref,
    resolvedCommit: value.source.resolved_commit
  };
}
