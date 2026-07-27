import { strFromU8, unzipSync } from "fflate";
import { describe, expect, it } from "vitest";
import type { ArtifactRecord, EvidenceRecord, ExecutionRecord, WorkspaceFile } from "./types";
import { buildRenderBundle, selectReproducibleExecutions } from "./renderBundle";

const execution = (
  id: string,
  purpose: ExecutionRecord["purpose"],
  status: ExecutionRecord["status"] = "success"
): ExecutionRecord => ({
  id,
  projectId: "project",
  chatId: "chat",
  promptId: "prompt",
  code: `result = "${id}"`,
  codeHash: `hash-${id}`,
  cacheKey: `cache-${id}`,
  status,
  stdout: "",
  stderr: "",
  outputFileIds: [],
  missingPlotCsv: [],
  inputHashes: ["input"],
  runtimeVersion: "runtime",
  model: "model",
  purpose,
  evidenceId: `evidence-${id}`,
  createdAt: `2026-01-01T00:00:0${id.length}Z`
});

const artifact: ArtifactRecord = {
  id: "artifact",
  projectId: "project",
  chatId: "chat",
  promptId: "prompt",
  fileId: "png",
  kind: "viewer-preview",
  title: "Top cells",
  pinned: false,
  viewer: {
    application: "biomero-zarr-viewer",
    viewerVersion: "0.4.0",
    storeUuid: "store",
    objectType: "Plate",
    objectId: 1,
    capabilityImageId: 1,
    field: "A/1/0",
    roi: [0, 0, 64, 64],
    sourceChannels: [0],
    evidenceIds: ["evidence-analysis"],
    renderRecipe: {
      storeUuid: "store",
      panels: [{
        field: "A/1/0",
        roi: [0, 0, 64, 64],
        sourceChannels: [0],
        t: 0,
        z: 0,
        title: "Cell",
        overlays: [],
        scaleBar: true
      }]
    },
    renderKind: "gallery",
    t: 0,
    z: 0,
    viewerUrl: "",
    croppedField: true
  },
  createdAt: "2026-01-01T00:00:00Z"
};

const png: WorkspaceFile = {
  id: "png",
  projectId: "project",
  chatId: "chat",
  name: "render.png",
  logicalPath: "chats/chat/render.png",
  type: "image/png",
  size: 4,
  sha256: "png-hash",
  source: "result",
  state: "ready",
  data: new Uint8Array([137, 80, 78, 71]).buffer,
  createdAt: "2026-01-01T00:00:00Z"
};

const evidence: EvidenceRecord = {
  id: "evidence-analysis",
  projectId: "project",
  chatId: "chat",
  promptId: "prompt",
  kind: "navigation",
  status: "success",
  sourceHashes: ["input"],
  skillHashes: ["skill"],
  sourceSkillKey: "key",
  summary: "verified object row",
  payload: "{}",
  createdAt: "2026-01-01T00:00:00Z"
};

describe("reproducible render bundles", () => {
  it("uses successful analysis code and excludes failed attempts", () => {
    const selected = selectReproducibleExecutions([
      execution("inspection", "inspection"),
      execution("failed", "analysis", "failed"),
      execution("analysis", "analysis")
    ], artifact);
    expect(selected.map((item) => item.id)).toEqual(["analysis"]);
  });

  it("promotes successful inspection code for legacy renders", () => {
    expect(selectReproducibleExecutions([
      execution("failed", "analysis", "failed"),
      execution("inspection", "inspection")
    ], artifact).map((item) => item.id)).toEqual(["inspection"]);
  });

  it("stores the exact recipe, PNG, script, and provenance manifest", () => {
    const bundle = buildRenderBundle(
      artifact,
      png,
      [execution("analysis", "analysis")],
      [evidence]
    );
    const files = unzipSync(bundle.archive);
    expect(Object.keys(files).sort()).toEqual([
      "analysis.py",
      "evidence-manifest.json",
      "render-recipe.json",
      "render.png"
    ]);
    expect(JSON.parse(strFromU8(files["render-recipe.json"]))).toEqual(artifact.viewer?.renderRecipe);
    expect(strFromU8(files["analysis.py"])).toContain("result =");
    expect(JSON.parse(strFromU8(files["evidence-manifest.json"])).source_hashes).toEqual(["input"]);
  });
});
