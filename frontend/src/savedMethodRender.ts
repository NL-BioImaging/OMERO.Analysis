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

function findAnalysisNavigation(
  value: unknown,
  seen = new Set<object>()
): Record<string, unknown> | null {
  if (typeof value === "string") {
    const text = value.trim();
    if (!text.startsWith("{") && !text.startsWith("[")) return null;
    try {
      return findAnalysisNavigation(JSON.parse(text), seen);
    } catch {
      return null;
    }
  }
  if (!value || typeof value !== "object") return null;
  if (seen.has(value)) return null;
  seen.add(value);
  if (Array.isArray(value)) {
    for (const child of value) {
      const found = findAnalysisNavigation(child, seen);
      if (found) return found;
    }
    return null;
  }
  const record = value as Record<string, unknown>;
  if (
    typeof record.store_uuid === "string" &&
    typeof record.field === "string"
  ) return record;
  for (const [key, child] of Object.entries(record)) {
    if (key === "omero_analysis_render_recipe") continue;
    const found = findAnalysisNavigation(child, seen);
    if (found) return found;
  }
  return null;
}

function numericArray(value: unknown): number[] | undefined {
  if (!Array.isArray(value) || value.some((item) => !Number.isInteger(item))) {
    return undefined;
  }
  return value.map(Number);
}

function updateOverlayPaths(
  recipe: ZarrRenderRecipe,
  navigation: Record<string, unknown>
): ZarrRenderRecipe {
  const first = recipe.panels[0];
  if (!first) return recipe;
  const field = String(navigation.field || first.field);
  const oldField = first.field;
  const cellPath = typeof navigation.cell_label_path === "string"
    ? navigation.cell_label_path
    : undefined;
  const cellValue = Number.isInteger(navigation.cell_label_value)
    ? Number(navigation.cell_label_value)
    : undefined;
  const focusGroups = Array.isArray(navigation.foci_overlays)
    ? navigation.foci_overlays.filter(
      (item): item is Record<string, unknown> => Boolean(item) && typeof item === "object"
    )
    : [];
  let focusIndex = 0;
  const overlays = first.overlays.map((overlay) => {
    const namedCell = overlay.name?.toLowerCase().includes("cell");
    const namedFocus = overlay.name?.toLowerCase().includes("foc");
    if (namedCell && cellPath && cellValue != null) {
      return { ...overlay, labelPath: cellPath, values: [cellValue] };
    }
    if (namedFocus && focusGroups.length) {
      const group = focusGroups[Math.min(focusIndex, focusGroups.length - 1)];
      focusIndex += 1;
      const values = numericArray(group.values);
      return {
        ...overlay,
        labelPath: typeof group.label_path === "string"
          ? group.label_path
          : overlay.labelPath,
        values: values || overlay.values
      };
    }
    return {
      ...overlay,
      labelPath: overlay.labelPath?.startsWith(`${oldField}/`)
        ? `${field}/${overlay.labelPath.slice(oldField.length + 1)}`
        : overlay.labelPath
    };
  });
  const channels = numericArray(navigation.source_channels);
  return {
    ...recipe,
    storeUuid: String(navigation.store_uuid || recipe.storeUuid).toLowerCase(),
    panels: [{
      ...first,
      field,
      sourceChannels: channels || first.sourceChannels,
      t: Number.isInteger(navigation.timepoint)
        ? Number(navigation.timepoint)
        : first.t,
      z: Number.isInteger(navigation.centroid_z_px)
        ? Number(navigation.centroid_z_px)
        : first.z,
      overlays
    }, ...recipe.panels.slice(1)]
  };
}

export interface SavedRecipeReplay {
  evidenceIds: string[];
  recipe: ZarrRenderRecipe;
  renderKind: "roi" | "gallery";
}

export function savedRecipeReplay(
  executionResult: string,
  recipe?: ZarrRenderRecipe
): SavedRecipeReplay | null {
  if (!recipe?.panels.length) return null;
  let result: Record<string, unknown>;
  try {
    result = JSON.parse(executionResult) as Record<string, unknown>;
  } catch {
    return null;
  }
  const evidenceId = result.evidence_id;
  if (typeof evidenceId !== "string" || !evidenceId) return null;
  const navigation = findAnalysisNavigation(result);
  return {
    evidenceIds: [evidenceId],
    recipe: navigation && recipe.panels.length === 1
      ? updateOverlayPaths(recipe, navigation)
      : recipe,
    renderKind: recipe.panels.length === 1 ? "roi" : "gallery"
  };
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
