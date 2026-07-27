import type { EvidenceKind, EvidenceRecord } from "./types";

export const MAX_EVIDENCE_PER_CHAT = 100;
export const MAX_EVIDENCE_PAYLOAD = 48 * 1024;

export function sourceSkillKey(
  sourceHashes: string[],
  skillHashes: string[],
): string {
  return [...sourceHashes].sort().join(",") + "|" + [...skillHashes].sort().join(",");
}

export function evidenceKind(code: string): EvidenceKind {
  if (/\bobject_navigation\b|\bfoci_assignments\b|\bfield_quality_summary\b/i.test(code)) {
    return "navigation";
  }
  if (
    /\bschema_info\b|\binformation_schema\b|\bsqlite_master\b|\bpragma\s+table_info\b|\bdescribe\b/i.test(code)
  ) {
    return "schema";
  }
  return "tool-result";
}

export function boundedEvidencePayload(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return text.length > MAX_EVIDENCE_PAYLOAD
    ? `${text.slice(0, MAX_EVIDENCE_PAYLOAD)}\n[evidence payload truncated]`
    : text;
}

export function currentEvidence(
  records: EvidenceRecord[],
  chatId: string,
  sourceHashes: string[],
  skillHashes: string[],
): EvidenceRecord[] {
  const key = sourceSkillKey(sourceHashes, skillHashes);
  return records
    .filter((record) => record.chatId === chatId && record.sourceSkillKey === key)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

export function upsertBoundedEvidence(
  records: EvidenceRecord[],
  record: EvidenceRecord,
): EvidenceRecord[] {
  const without = records.filter((item) => item.id !== record.id);
  const sameChat = [...without.filter((item) => item.chatId === record.chatId), record]
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
    .slice(-MAX_EVIDENCE_PER_CHAT);
  const keep = new Set(sameChat.map((item) => item.id));
  return [
    ...without.filter((item) => item.chatId !== record.chatId || keep.has(item.id)),
    ...sameChat.filter((item) => !without.some((prior) => prior.id === item.id)),
  ].sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

export function evidencePrompt(records: EvidenceRecord[]): string {
  if (!records.length) return "No verified evidence is available for the current input and skill hashes.";
  const successes = records.filter((record) => record.status === "success").slice(-12);
  const failures = records.filter((record) => record.status === "failed").slice(-4);
  const lines = [
    "Verified evidence ledger for unchanged inputs/skills:",
    ...successes.map((record) =>
      `- ${record.id} [${record.kind}] ${record.summary}`
    ),
  ];
  if (failures.length) {
    lines.push(
      "Recent failed approaches; do not repeat unchanged:",
      ...failures.map((record) => `- ${record.id}: ${record.summary}`),
    );
  }
  return lines.join("\n").slice(0, 12_000);
}

export function requireEvidenceIds(
  requested: unknown,
  available: EvidenceRecord[],
): string[] {
  if (!Array.isArray(requested) || !requested.length) {
    throw new Error("Rendering requires at least one evidence_id from a successful analysis execution");
  }
  const allowed = new Set(
    available.filter((record) => record.status === "success").map((record) => record.id)
  );
  const ids = [...new Set(requested.map(String))];
  if (ids.some((value) => !allowed.has(value))) {
    throw new Error("A render evidence_id is missing, failed, or stale for the current inputs/skills");
  }
  return ids;
}
