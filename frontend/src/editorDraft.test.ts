import { describe, expect, it } from "vitest";
import { editorDraft } from "./editorDraft";
import { trashBlockers, purgeBlockers, pipelineRestoreBlockers } from "./artifactLifecycle";
import type { AnalysisWorkspace } from "./types";

const workspace = () => ({ methods: [{ id: "m", name: "Method", currentVersion: 1, versions: [{version: 1, code: 'INPUTS["missing.csv"]'}] }],
  pipelines: [{ id: "p", name: "Pipeline", steps: [{ id: "s", methodId: "m", methodVersion: 1 }] }],
  notebooks: [{ id: "n", name: "test.ipynb", document: { cells: [{ id: "c", source: ['INPUTS["missing.csv"]'] }] } }],
  files: [], runs: [], artifacts: [], executions: [] } as unknown as AnalysisWorkspace);

it("opens missing bindings without mutation or dirty state", () => {
  const value = workspace();
  const before = JSON.stringify(value);
  for (const [kind, id] of [["method", "m"], ["pipeline", "p"], ["notebook", "n"]] as const) {
    const session = editorDraft(value, kind, id, "home");
    expect(session.dirty).toBe(false);
    expect(session.bindingCount).toBe(0);
    expect(session.error).toBeUndefined();
  }
  expect(JSON.stringify(value)).toBe(before);
});

it("editing a Pipeline draft does not change pinned historical values", () => {
  const value = workspace();
  const session = editorDraft(value, "pipeline", "p", "pipelines");
  if (session.kind !== "pipeline") throw new Error();
  session.draft.steps[0].methodVersion = 2;
  expect(value.pipelines[0].steps[0].methodVersion).toBe(1);
});

it("blocks Method trash for active Pipelines and preserves pins after Pipeline trash", () => {
  const value = workspace();
  expect(trashBlockers(value, "method", "m")).toEqual(["Pipeline"]);
  value.pipelines[0].deletedAt = "now";
  expect(trashBlockers(value, "method", "m")).toEqual([]);
  expect(purgeBlockers(value, "method", "m")).toContain("Pinned Pipeline versions (including Trash)");
});

it("requires restoring Pipeline dependencies first without changing pinned versions", () => {
  const value = workspace();
  value.pipelines[0].deletedAt = "now";
  value.methods[0].deletedAt = "now";
  expect(pipelineRestoreBlockers(value, "p")).toEqual(["Method"]);
  value.methods[0].deletedAt = undefined;
  expect(pipelineRestoreBlockers(value, "p")).toEqual([]);
  expect(value.pipelines[0].steps[0].methodVersion).toBe(1);
  value.methods = [];
  expect(pipelineRestoreBlockers(value, "p")).toEqual(["Missing Method m"]);
});
