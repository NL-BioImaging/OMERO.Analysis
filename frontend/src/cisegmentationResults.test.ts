import { focusForResult, queryRows, trackItems } from "./cisegmentationResults";

const row = {
  object_id: 4, label_set_id: 2, output_store_uuid: "3935615d-a18d-41d8-af04-e63cfec3a46c",
  output_resource_path: "A/1/0", output_label_path: "A/1/0/labels/nuclei",
  output_label_kind: "label-image", label_value: 17, label_name: "nuclei",
  timepoint: 1, size_x: 40000, size_y: 40000, size_z: 1, size_t: 3,
  centroid_x_px: 20000, centroid_y_px: 19000, centroid_z_px: 0,
  bbox_min_x_px: 19990, bbox_max_x_px: 20010, bbox_min_y_px: 18990, bbox_max_y_px: 19010,
};

test("a 40K result is cropped and linked by portable UUID", () => {
  const focus = focusForResult(row, "spatial");
  expect(focus.roi).toEqual([19936, 18936, 20064, 19064]);
  expect(focus.storeUuid).toBe(row.output_store_uuid);
  expect(focus.overlays[0].values).toEqual([17]);
});

test("query previews map columns and tracks preserve subpixel coordinates and gaps", () => {
  expect(queryRows({ columns: [{ name: "object_id" }], preview: [[5]] })).toEqual([{ object_id: 5 }]);
  const items = trackItems([
    { timepoint: 0, point_x: 10.5, point_y: 11, point_z: 0 },
    { timepoint: 2, point_x: 13.25, point_y: 11.5, point_z: 0 },
  ]);
  expect(items[0]).toMatchObject({ kind: "line", dashed: true, x: 10.5, x2: 13.25 });
});

test("missing store identity fails closed", () => {
  expect(() => focusForResult({ ...row, output_store_uuid: "" }, "spatial")).toThrow();
});
