import type { HierarchyItem, OmeroContext, OmeroHierarchy, ZarrViewerCapability } from "./types";
import { zarrCandidates } from "./zarrViewer";

export function workspaceImageCandidates(context: OmeroContext | null, hierarchy: OmeroHierarchy | null, selected?: HierarchyItem[]): HierarchyItem[] {
  if (!context) return [];
  const available = zarrCandidates(context, hierarchy);
  if (selected === undefined) return available; // Preserve existing workspaces.
  const ids = new Set(selected.map(item => `${item.type}:${item.id}`));
  return available.filter(item => ids.has(`${item.type}:${item.id}`));
}

export function currentMovieImageCandidate(context: OmeroContext | null, hierarchy: OmeroHierarchy | null, selected?: HierarchyItem[]): HierarchyItem | undefined {
  const candidates = renderImageInputCandidates(context, hierarchy, selected);
  return candidates.length === 1 ? candidates[0] : undefined;
}

/** User-selected images, independent of any measurement/result provenance. */
export function renderImageInputCandidates(context: OmeroContext | null, hierarchy: OmeroHierarchy | null, selected?: HierarchyItem[]): HierarchyItem[] {
  if (!context) return [];
  if (selected === undefined) {
    return context.object_type === "Image"
      ? [{type: "Image", id: context.object_id, name: context.name, supported: true}]
      : [];
  }
  return workspaceImageCandidates(context, hierarchy, selected).filter(item => item.type === "Image");
}

export function preferredZarrMatch<T extends { capability: ZarrViewerCapability }>(matches: T[]): T | undefined {
  if (matches.length === 1) return matches[0];
  // A root intensity image exposes its label layers; the label images sharing
  // its UUID do not. Never choose between multiple intensity roots implicitly.
  const roots = matches.filter(item => item.capability.labels.length > 0);
  return roots.length === 1 ? roots[0] : undefined;
}
