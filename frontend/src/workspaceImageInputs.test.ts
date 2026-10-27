import { preferredZarrMatch, workspaceImageCandidates } from "./workspaceImageInputs";
import type { OmeroContext, OmeroHierarchy, ZarrViewerCapability } from "./types";

const images = [
  {type: "Image", id: 1, name: "intensity", supported: true},
  {type: "Image", id: 2, name: "labels", supported: true},
  {type: "Image", id: 3, name: "other", supported: true}
];
const context = {object_type: "Dataset", object_id: 4, name: "dataset", user_id: 1, group_id: 1,
  can_annotate: true, selected_attachments: []} as OmeroContext;
const hierarchy = {current: {type: "Dataset", id: 4, name: "dataset", supported: true}, children: images, parents: []} as OmeroHierarchy;

it("keeps explicit image selections strict and leaves legacy workspaces unchanged", () => {
  expect(workspaceImageCandidates(context, hierarchy)).toEqual(images);
  expect(workspaceImageCandidates(context, hierarchy, [images[0]])).toEqual([images[0]]);
  expect(workspaceImageCandidates(context, hierarchy, [])).toEqual([]);
  expect(workspaceImageCandidates(context, hierarchy, [{...images[0], id: 999}])).toEqual([]);
});

it("selects a unique intensity root and preserves genuine ambiguity", () => {
  const label = {key: "label", capability: {labels: []} as unknown as ZarrViewerCapability};
  const root = {key: "root", capability: {labels: [{id: "spots"}]} as unknown as ZarrViewerCapability};
  expect(preferredZarrMatch([label, root])).toBe(root);
  expect(preferredZarrMatch([root])).toBe(root);
  expect(preferredZarrMatch([label, {...label}])).toBeUndefined();
  expect(preferredZarrMatch([root, {...root}])).toBeUndefined();
});
