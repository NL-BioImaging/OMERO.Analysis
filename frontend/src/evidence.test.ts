import {
  currentEvidence,
  evidenceKind,
  evidencePrompt,
  requireGalleryEvidence,
  requireEvidenceIds,
  sourceSkillKey,
  upsertBoundedEvidence,
} from "./evidence";
import type { EvidenceRecord } from "./types";

function record(overrides: Partial<EvidenceRecord> = {}): EvidenceRecord {
  return {
    id: overrides.id || crypto.randomUUID(),
    projectId: "project",
    chatId: "chat",
    promptId: "prompt",
    kind: "tool-result",
    status: "success",
    sourceHashes: ["source-a"],
    skillHashes: ["skill-a"],
    sourceSkillKey: sourceSkillKey(["source-a"], ["skill-a"]),
    summary: "verified result",
    payload: "{}",
    createdAt: overrides.createdAt || new Date().toISOString(),
    ...overrides,
  };
}

test("evidence invalidates when source or skill hashes change", () => {
  const evidence = [record()];
  expect(currentEvidence(evidence, "chat", ["source-a"], ["skill-a"])).toHaveLength(1);
  expect(currentEvidence(evidence, "chat", ["source-b"], ["skill-a"])).toHaveLength(0);
  expect(currentEvidence(evidence, "chat", ["source-a"], ["skill-b"])).toHaveLength(0);
});

test("schema and navigation evidence is classified and summarized", () => {
  expect(evidenceKind("SELECT * FROM schema_info")).toBe("schema");
  expect(evidenceKind("SELECT * FROM object_navigation")).toBe("navigation");
  const text = evidencePrompt([
    record({ id: "good" }),
    record({ id: "bad", status: "failed", summary: "bad SQL" }),
  ]);
  expect(text).toContain("good");
  expect(text).toContain("do not repeat");
});

test("render evidence must be successful and current", () => {
  const good = record({ id: "good" });
  expect(requireEvidenceIds(["good"], [good])).toEqual(["good"]);
  expect(() => requireEvidenceIds(["missing"], [good])).toThrow(/stale/);
});

test("gallery evidence must contain the exact panel recipe", () => {
  const panels = [{
    field: "A/1/0",
    roi: [1, 2, 30, 40],
    source_channels: [1],
    overlays: [{
      label_path: "A/1/0/labels/cells",
      values: [7],
      mode: "outline",
      color: "#FFFF00",
      outline_width: 2,
      name: "cell",
    }],
    t: 0,
    z: 0,
    title: "Cell 7",
    caption: "4 assigned foci",
  }];
  const good = record({
    id: "gallery",
    payload: JSON.stringify({
      preview: {
        store_uuid: "11111111-1111-4111-8111-111111111111",
        render_panels: panels,
      },
    }),
  });
  const request = {
    store_uuid: "11111111-1111-4111-8111-111111111111",
    panels,
  };
  expect(requireGalleryEvidence(request, ["gallery"], [good])).toEqual(["gallery"]);
  expect(() => requireGalleryEvidence({
    ...request,
    panels: [{
      ...panels[0],
      overlays: [{ ...panels[0].overlays[0], values: [8] }],
    }],
  }, ["gallery"], [good])).toThrow(/exact gallery recipe/);
});

test("ledger is bounded per chat", () => {
  let values: EvidenceRecord[] = [];
  for (let index = 0; index < 105; index += 1) {
    values = upsertBoundedEvidence(values, record({
      id: String(index),
      createdAt: new Date(index * 1000).toISOString(),
    }));
  }
  expect(values).toHaveLength(100);
  expect(values[0].id).toBe("5");
});
