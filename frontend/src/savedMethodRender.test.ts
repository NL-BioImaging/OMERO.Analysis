import { savedGalleryRequest, savedRecipeReplay } from "./savedMethodRender";

const panels = [
  {
    field: "B/1/5",
    roi: [1, 2, 30, 40],
    source_channels: [1],
    overlays: [{ label_path: "labels/cells", values: [10], mode: "outline" }]
  },
  {
    field: "B/1/6",
    roi: [5, 6, 35, 46],
    source_channels: [1],
    overlays: [{ label_path: "labels/cells", values: [11], mode: "outline" }]
  }
];

describe("saved method gallery replay", () => {
  it("replays the exact evidence-backed panels with the new evidence id", () => {
    const request = savedGalleryRequest(JSON.stringify({
      ok: true,
      evidence_id: "new-evidence",
      preview: {
        result: {
          store_uuid: "ac680965-c76f-47f3-98f9-95f07ecae356",
          render_panels: panels
        }
      }
    }), "top-8-cells-analysis.py");

    expect(request).toMatchObject({
      evidence_ids: ["new-evidence"],
      store_uuid: "ac680965-c76f-47f3-98f9-95f07ecae356",
      panels,
      filename: "top-8-cells",
      columns: 2
    });
    expect(request?.panels).toStrictEqual(panels);
  });

  it("preserves saved recipe presentation settings", () => {
    const request = savedGalleryRequest(JSON.stringify({
      evidence_id: "new-evidence",
      preview: JSON.stringify({
        store_uuid: "ac680965-c76f-47f3-98f9-95f07ecae356",
        render_panels: panels
      })
    }), "analysis.py", {
      storeUuid: "ac680965-c76f-47f3-98f9-95f07ecae356",
      title: "Saved title",
      filename: "saved-name.png",
      layout: { columns: 1 },
      panels: []
    });

    expect(request).toMatchObject({
      title: "Saved title",
      filename: "saved-name.png",
      columns: 1
    });
  });

  it("does not render ordinary methods or results without fresh evidence", () => {
    expect(savedGalleryRequest(JSON.stringify({
      evidence_id: "evidence",
      preview: { result: [1, 2, 3] }
    }), "ordinary.py")).toBeNull();
    expect(savedGalleryRequest(JSON.stringify({
      preview: {
        store_uuid: "ac680965-c76f-47f3-98f9-95f07ecae356",
        render_panels: panels
      }
    }), "gallery.py")).toBeNull();
  });

  it("replays a saved single ROI with fresh navigation and overlay values", () => {
    const replay = savedRecipeReplay(JSON.stringify({
      evidence_id: "fresh-evidence",
      preview: {
        result: {
          store_uuid: "11111111-1111-4111-8111-111111111111",
          field: "C/3/9",
          source_channels: [2],
          timepoint: 1,
          centroid_z_px: 3,
          cell_label_path: "C/3/9/labels/cells",
          cell_label_value: 88,
          foci_overlays: [{
            label_path: "C/3/9/labels/foci",
            values: [901, 902]
          }]
        }
      }
    }), {
      storeUuid: "ac680965-c76f-47f3-98f9-95f07ecae356",
      panels: [{
        field: "B/1/5",
        roi: [0, 0, 400, 400],
        sourceChannels: [1],
        t: 0,
        z: 0,
        title: "Most foci",
        overlays: [{
          labelPath: "B/1/5/labels/cells",
          values: [12],
          mode: "outline",
          opacity: 1,
          outlineWidth: 2,
          name: "cell"
        }, {
          labelPath: "B/1/5/labels/foci",
          values: [31],
          mode: "outline",
          opacity: 1,
          outlineWidth: 2,
          name: "foci"
        }]
      }]
    });
    expect(replay).toMatchObject({
      evidenceIds: ["fresh-evidence"],
      renderKind: "roi",
      recipe: {
        storeUuid: "11111111-1111-4111-8111-111111111111",
        panels: [{
          field: "C/3/9",
          sourceChannels: [2],
          t: 1,
          z: 3,
          overlays: [{
            labelPath: "C/3/9/labels/cells",
            values: [88]
          }, {
            labelPath: "C/3/9/labels/foci",
            values: [901, 902]
          }]
        }]
      }
    });
  });
});
