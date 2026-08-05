import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchZarrCapability,
  zarrCandidates,
  zarrFocusFromToolArgs,
  zarrRecipeFromToolArgs,
  zarrViewerUrl
} from "./zarrViewer";
import type { ZarrViewerIntegrationStatus } from "./types";

const storeUuid = "ac680965-c76f-47f3-98f9-95f07ecae356";
const status: ZarrViewerIntegrationStatus = {
  schema_version: 1,
  available: true,
  installed: true,
  enabled: true,
  version: "0.4.0",
  minimum_version: "0.4.0",
  reason: "ready",
  viewer_url: "/biomero_zarr_viewer/",
  image_capabilities_template: "/biomero_zarr_viewer/api/images/0/capabilities/",
  plate_capabilities_template: "/biomero_zarr_viewer/api/plates/0/capabilities/"
};

afterEach(() => vi.unstubAllGlobals());

describe("ZarrViewer focus validation", () => {
  it("uses half-open database bounds for an object preview", () => {
    const focus = zarrFocusFromToolArgs({
      evidence_ids: ["evidence-1"],
      store_uuid: storeUuid,
      field: "A/1/5",
      target_kind: "object",
      size_x: 2008,
      size_y: 2008,
      bbox: [406, 737, 486, 833],
      source_channels: [1],
      label_path: "labels/cells",
      label_value: 132
    });
    expect(focus.roi).toEqual([406, 737, 486, 833]);
    expect(focus.t).toBe(0);
    expect(focus.z).toBe(0);
  });

  it("renders a bounded center crop for an oversized full field", () => {
    const focus = zarrFocusFromToolArgs({
      evidence_ids: ["evidence-1"],
      store_uuid: storeUuid,
      field: "B/1/1",
      target_kind: "field",
      size_x: 3000,
      size_y: 2500
    });
    expect(focus.roi[2] - focus.roi[0]).toBe(1024);
    expect(focus.roi[3] - focus.roi[1]).toBe(1024);
    expect(focus.croppedField).toBe(true);
  });

  it("rejects invented identity and unsafe paths", () => {
    expect(() => zarrFocusFromToolArgs({
      evidence_ids: ["evidence-1"],
      store_uuid: "not-a-uuid",
      field: "../secret",
      target_kind: "field",
      size_x: 10,
      size_y: 10
    })).toThrow(/canonical UUID/);
  });

  it("keeps multiple values and 2 px complete-outline defaults", () => {
    const focus = zarrFocusFromToolArgs({
      evidence_ids: ["evidence-1"],
      store_uuid: storeUuid,
      field: "B/1/5",
      target_kind: "object",
      size_x: 1000,
      size_y: 1000,
      bbox: [100, 100, 300, 300],
      overlays: [{
        label_path: "labels/cells",
        values: [260],
        mode: "outline"
      }, {
        label_path: "labels/foci",
        values: [332, 337, 349, 353],
        mode: "outline-fill",
        opacity: 0.3,
        color: "#ff00ff"
      }]
    });
    expect(focus.overlays[0]).toMatchObject({
      values: [260],
      outlineWidth: 2,
      opacity: 1
    });
    expect(focus.overlays[1].values).toEqual([332, 337, 349, 353]);
  });

  it("creates one bounded gallery recipe for ranked objects", () => {
    const panel = (field: string, value: number) => ({
      field,
      roi: [0, 0, 128, 128],
      source_channels: [1, 2],
      title: `Cell ${value}`,
      caption: `${value} foci`,
      overlays: [{
        label_path: "labels/cells",
        values: [value],
        mode: "outline",
        outline_width: 3
      }]
    });
    const { recipe, evidenceIds } = zarrRecipeFromToolArgs({
      evidence_ids: ["ranking-evidence"],
      store_uuid: storeUuid,
      title: "Top cells",
      columns: 2,
      panels: [panel("A/1/0", 1), panel("A/1/1", 2)]
    });
    expect(evidenceIds).toEqual(["ranking-evidence"]);
    expect(recipe.panels).toHaveLength(2);
    expect(recipe.layout).toEqual({ columns: 2 });
    expect(recipe.panels[0].overlays[0].outlineWidth).toBe(3);
  });
});

it("selects Plate children for a Screen without inventing an OMERO id", () => {
  const values = zarrCandidates(
    {
      object_type: "Screen",
      object_id: 151,
      name: "2DWellTestZarr",
      user_id: 1,
      group_id: 1,
      can_annotate: true,
      selected_attachments: []
    },
    {
      current: { type: "Screen", id: 151, name: "2DWellTestZarr", supported: true },
      parents: [],
      children: [
        { type: "Plate", id: 201, name: "cells", supported: true },
        { type: "Image", id: 999, name: "unrelated", supported: true }
      ]
    }
  );
  expect(values).toEqual([
    { type: "Plate", id: 201, name: "cells", supported: true }
  ]);
});

it("uses every explicitly selected Image as a Zarr candidate", () => {
  const selected = [
    { type: "Image" as const, id: 11, name: "Field 11", supported: true },
    { type: "Image" as const, id: 12, name: "Field 12", supported: true }
  ];
  expect(zarrCandidates({
    object_type: "Image",
    object_id: 11,
    name: "2 selected Images",
    user_id: 1,
    group_id: 1,
    can_annotate: true,
    selected_attachments: [],
    selected_objects: selected
  }, null)).toEqual(selected);
});

it("discards capability credentials and builds a validated deep link", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
    schema_version: 1,
    supported: true,
    kind: "plate",
    image: { id: 201, name: "cells" },
    store: {
      uuid: storeUuid,
      roi_url: "/biomero_zarr_viewer/api/images/201/roi.png",
      render_url: "/biomero_zarr_viewer/api/images/201/render.png",
      url: "https://secret-store.example/",
      context: "must-not-survive",
      expires_at: "tomorrow"
    },
    initial_path: "A/1/5",
    channels: [{ index: 0, label: "DNA", active: true }],
    labels: [{ id: "cells", name: "cells", path: "labels/cells" }],
    plate: {
      name: "20220714_TKI_482",
      rows: ["A", "B"],
      columns: ["1", "2"],
      wells: [{ path: "A/1", fields: [{ path: "A/1/5", name: "5" }] }]
    }
  }), { status: 200, headers: { "Content-Type": "application/json" } })));
  const capability = await fetchZarrCapability(status, {
    type: "Plate",
    id: 201
  });
  expect(fetch).toHaveBeenCalledWith(
    "/biomero_zarr_viewer/api/plates/201/capabilities/",
    { credentials: "same-origin" }
  );
  expect(capability.store).toEqual({
    uuid: storeUuid,
    roi_url: "/biomero_zarr_viewer/api/images/201/roi.png",
    render_url: "/biomero_zarr_viewer/api/images/201/render.png"
  });
  expect(capability.plate).toMatchObject({
    name: "20220714_TKI_482",
    rows: ["A", "B"],
    columns: ["1", "2"]
  });
  expect(JSON.stringify(capability)).not.toContain("secret-store");
  const url = new URL(zarrViewerUrl(status, capability, zarrFocusFromToolArgs({
    evidence_ids: ["evidence-1"],
    store_uuid: storeUuid,
    field: "A/1/5",
    target_kind: "object",
    size_x: 2008,
    size_y: 2008,
    bbox: [406, 737, 486, 833],
    source_channels: [1],
    label_path: "labels/cells",
    label_value: 132
  })));
  expect(url.pathname).toBe("/biomero_zarr_viewer/");
  expect(url.searchParams.get("field")).toBe("A/1/5");
  expect(url.searchParams.get("roi")).toBe("406,737,486,833");
  expect(url.searchParams.get("storeUuid")).toBe(storeUuid);
});
