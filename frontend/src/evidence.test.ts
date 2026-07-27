import {
  currentEvidence,
  evidenceKind,
  evidencePrompt,
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
