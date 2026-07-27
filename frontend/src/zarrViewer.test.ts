import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchZarrCapability,
  zarrCandidates,
  zarrFocusFromToolArgs,
  zarrViewerUrl
} from "./zarrViewer";
import type { ZarrViewerIntegrationStatus } from "./types";

const storeUuid = "ac680965-c76f-47f3-98f9-95f07ecae356";
const status: ZarrViewerIntegrationStatus = {
  schema_version: 1,
  available: true,
  installed: true,
  enabled: true,
  version: "0.3.0",
  minimum_version: "0.3.0",
  reason: "ready",
  viewer_url: "/biomero_zarr_viewer/",
  image_capabilities_template: "/biomero_zarr_viewer/api/images/0/capabilities/",
  plate_capabilities_template: "/biomero_zarr_viewer/api/plates/0/capabilities/"
};

afterEach(() => vi.unstubAllGlobals());

describe("ZarrViewer focus validation", () => {
  it("uses half-open database bounds for an object preview", () => {
    const focus = zarrFocusFromToolArgs({
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
      store_uuid: "not-a-uuid",
      field: "../secret",
      target_kind: "field",
      size_x: 10,
      size_y: 10
    })).toThrow(/canonical UUID/);
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

it("discards capability credentials and builds a validated deep link", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
    schema_version: 1,
    supported: true,
    kind: "plate",
    image: { id: 201, name: "cells" },
    store: {
      uuid: storeUuid,
      roi_url: "/biomero_zarr_viewer/api/images/201/roi.png",
      url: "https://secret-store.example/",
      context: "must-not-survive",
      expires_at: "tomorrow"
    },
    initial_path: "A/1/5",
    channels: [{ index: 0, label: "DNA", active: true }],
    labels: [{ id: "cells", name: "cells", path: "labels/cells" }],
    plate: { wells: [{ path: "A/1", fields: [{ path: "A/1/5", name: "5" }] }] }
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
    roi_url: "/biomero_zarr_viewer/api/images/201/roi.png"
  });
  expect(JSON.stringify(capability)).not.toContain("secret-store");
  const url = new URL(zarrViewerUrl(status, capability, zarrFocusFromToolArgs({
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
