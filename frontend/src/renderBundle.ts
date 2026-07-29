import { zipSync } from "fflate";
import type {
  ArtifactRecord,
  EvidenceRecord,
  ExecutionRecord,
  WorkspaceFile,
  ZarrRenderRecipe
} from "./types";
import { withAssistantSummaryComments } from "./methodDocumentation";

export interface RenderBundle {
  archive: Uint8Array;
  code: string;
  sourceCode: string;
  recipe: ZarrRenderRecipe;
  manifest: Record<string, unknown>;
  execution: ExecutionRecord;
}

export function selectReproducibleExecutions(
  executions: ExecutionRecord[],
  artifact: ArtifactRecord
): ExecutionRecord[] {
  const successful = executions
    .filter((item) =>
      item.chatId === artifact.chatId &&
      item.promptId === artifact.promptId &&
      (item.status === "success" || item.status === "reused")
    )
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  const analysis = successful.filter((item) => item.purpose !== "inspection");
  const citedIds = new Set(artifact.viewer?.evidenceIds || []);
  const citedAnalysis = analysis.filter(
    (item) => item.evidenceId && citedIds.has(item.evidenceId)
  );
  if (citedAnalysis.length) return citedAnalysis;
  return analysis.length ? analysis : successful.filter((item) => item.purpose === "inspection");
}

export function buildRenderBundle(
  artifact: ArtifactRecord,
  png: WorkspaceFile,
  executions: ExecutionRecord[],
  evidence: EvidenceRecord[],
  assistantSummary = ""
): RenderBundle {
  const recipe = artifact.viewer?.renderRecipe;
  if (!recipe) throw new Error("This preview has no reproducible render recipe");
  if (!png.data) throw new Error("The rendered PNG is unavailable in this browser workspace");
  const selected = selectReproducibleExecutions(executions, artifact);
  if (!selected.length) throw new Error("No successful analysis or inspection code produced this render");
  const sourceCode = Array.from(new Set(selected.map((item) => item.code.trimEnd()))).join(
    "\n\n# Continued verified analysis\n"
  );
  const code = withAssistantSummaryComments(sourceCode, assistantSummary);
  const citedIds = new Set(artifact.viewer?.evidenceIds || []);
  const cited = evidence.filter((item) =>
    item.status === "success" &&
    (citedIds.has(item.id) || selected.some((execution) => execution.evidenceId === item.id))
  );
  const manifest = {
    schema: "nl.bioimaging.omero-analysis-render-bundle.v1",
    created_at: new Date().toISOString(),
    artifact: {
      id: artifact.id,
      title: artifact.title,
      render_kind: artifact.viewer?.renderKind || "roi",
      png_sha256: png.sha256
    },
    assistant_summary: assistantSummary || null,
    source_hashes: Array.from(new Set(cited.flatMap((item) => item.sourceHashes))).sort(),
    skill_hashes: Array.from(new Set(cited.flatMap((item) => item.skillHashes))).sort(),
    evidence: cited.map((item) => ({
      id: item.id,
      kind: item.kind,
      summary: item.summary,
      source_skill_key: item.sourceSkillKey,
      created_at: item.createdAt
    })),
    executions: selected.map((item) => ({
      id: item.id,
      evidence_id: item.evidenceId,
      code_hash: item.codeHash,
      runtime_version: item.runtimeVersion,
      model: item.model,
      purpose: item.purpose,
      created_at: item.createdAt
    }))
  };
  const encoded = (value: string) =>
    new Uint8Array(new TextEncoder().encode(value));
  const archive = zipSync({
    "analysis.py": encoded(`${code}\n`),
    "render-recipe.json": encoded(`${JSON.stringify(recipe, null, 2)}\n`),
    "render.png": new Uint8Array(png.data),
    "evidence-manifest.json": encoded(`${JSON.stringify(manifest, null, 2)}\n`)
  }, { level: 6 });
  return {
    archive,
    code,
    sourceCode,
    recipe,
    manifest,
    execution: selected.at(-1)!
  };
}
