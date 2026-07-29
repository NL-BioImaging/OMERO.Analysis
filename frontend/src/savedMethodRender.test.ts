import { savedGalleryRequest } from "./savedMethodRender";

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
});
