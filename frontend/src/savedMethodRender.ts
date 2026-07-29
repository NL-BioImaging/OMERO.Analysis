import type { ZarrRenderRecipe } from "./types";

interface GalleryContract {
  store_uuid: string;
  render_panels: unknown[];
  title?: string;
  filename?: string;
  columns?: number;
}

function findGalleryContract(
  value: unknown,
  seen = new Set<object>()
): GalleryContract | null {
  if (typeof value === "string") {
    const text = value.trim();
    if (!text.startsWith("{") && !text.startsWith("[")) return null;
    try {
      return findGalleryContract(JSON.parse(text), seen);
    } catch {
      return null;
    }
  }
  if (!value || typeof value !== "object") return null;
  if (seen.has(value)) return null;
  seen.add(value);
  if (Array.isArray(value)) {
    for (const child of value) {
      const found = findGalleryContract(child, seen);
      if (found) return found;
    }
    return null;
  }
  const record = value as Record<string, unknown>;
  if (
    typeof record.store_uuid === "string" &&
    Array.isArray(record.render_panels) &&
    record.render_panels.length >= 2
  ) {
    return {
      store_uuid: record.store_uuid,
      render_panels: record.render_panels,
      title: typeof record.title === "string" ? record.title : undefined,
      filename: typeof record.filename === "string" ? record.filename : undefined,
      columns: typeof record.columns === "number" ? record.columns : undefined
    };
  }
  for (const child of Object.values(record)) {
    const found = findGalleryContract(child, seen);
    if (found) return found;
  }
  return null;
}

function defaultStem(scriptName: string): string {
  return scriptName
    .replace(/\.py$/i, "")
    .replace(/-analysis$/i, "")
    .replace(/^analysis-/, "") || "saved-method-gallery";
}

export function savedGalleryRequest(
  executionResult: string,
  scriptName: string,
  recipe?: ZarrRenderRecipe
): Record<string, unknown> | null {
  let result: Record<string, unknown>;
  try {
    result = JSON.parse(executionResult) as Record<string, unknown>;
  } catch {
    return null;
  }
  const evidenceId = result.evidence_id;
  if (typeof evidenceId !== "string" || !evidenceId) return null;
  const contract = findGalleryContract(result);
  if (!contract) return null;
  const stem = defaultStem(scriptName);
  const columns = recipe?.layout?.columns ?? contract.columns ??
    Math.min(4, contract.render_panels.length);
  return {
    evidence_ids: [evidenceId],
    store_uuid: contract.store_uuid,
    panels: contract.render_panels,
    title: recipe?.title || contract.title || stem.replace(/-/g, " "),
    filename: recipe?.filename || contract.filename || stem,
    columns
  };
}
