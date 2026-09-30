import type { ZarrFocusTarget, ZarrVectorItem, ZarrVectorOverlay } from "./types";

export type ResultKind = "spatial" | "colocalization" | "tracking" | "spots";
export const RESULT_LABELS: Record<ResultKind, string> = {
  spatial: "Spatial neighbours",
  colocalization: "Colocalisation",
  tracking: "Tracks",
  spots: "Spots",
};

const NAV = `n.object_id, n.label_set_id, n.output_store_uuid, n.output_resource_path, n.output_label_path,
 n.output_label_kind, n.output_channel_index, n.label_value, n.label_name,
 n.object_type, n.timepoint, n.size_x, n.size_y, n.size_z, n.size_t,
 n.centroid_x_px, n.centroid_y_px, n.centroid_z_px,
 n.bbox_min_x_px, n.bbox_min_y_px, n.bbox_max_x_px, n.bbox_max_y_px`;

export const RESULT_SQL: Record<ResultKind, string> = {
  spatial: `SELECT ${NAV}, s.nearest_object_id, s.nearest_distance_um AS metric,
    s.neighbor_count, s.radius_um, s.touching_neighbor_count, s.shared_boundary, s.boundary_unit
    FROM spatial_measurements s JOIN object_navigation n ON n.object_id=s.object_id
    WHERE s.nearest_distance_um IS NOT NULL ORDER BY s.nearest_distance_um DESC LIMIT 100`,
  colocalization: `SELECT ${NAV}, c.pearson_r AS metric, c.manders_a_in_b, c.manders_b_in_a,
    c.sample_count, c.reason, a.channel_index AS channel_a, b.channel_index AS channel_b,
    c.channel_a_id, c.channel_b_id, n.image_id
    FROM colocalization_measurements c JOIN object_navigation n ON n.object_id=c.object_id
    JOIN channels a ON a.channel_id=c.channel_a_id JOIN channels b ON b.channel_id=c.channel_b_id
    ORDER BY c.object_id LIMIT 100`,
  tracking: `SELECT ${NAV}, tr.track_id, tr.path_length_um AS metric, tr.duration, tr.end_frame,
    tr.mean_speed, tr.speed_unit, tr.directionality, tr.observation_count, tr.parent_track_id
    FROM tracks tr JOIN track_observations obs ON obs.track_id=tr.track_id
    JOIN object_navigation n ON n.object_id=obs.object_id AND n.timepoint=tr.start_frame
    ORDER BY tr.path_length_um DESC LIMIT 100`,
  spots: `SELECT ${NAV}, p.x_px AS point_x, p.y_px AS point_y, p.z_px AS point_z,
    n.area_um2 AS metric, p.coordinate_source
    FROM point_localizations p JOIN object_navigation n ON n.object_id=p.object_id
    ORDER BY n.object_id LIMIT 100`,
};

export type ResultRow = Record<string, unknown>;

export function queryRows(result: Record<string, unknown>): ResultRow[] {
  const columns = Array.isArray(result.columns)
    ? result.columns.map((item) => typeof item === "string" ? item : String((item as { name?: unknown })?.name || ""))
    : [];
  return (Array.isArray(result.preview) ? result.preview : [])
    .filter(Array.isArray)
    .map((values) => Object.fromEntries(columns.map((column, index) => [column, values[index]])));
}

export function numberAt(row: ResultRow, key: string, fallback = 0): number {
  if (row[key] == null || row[key] === "") return fallback;
  const value = Number(row[key]);
  return Number.isFinite(value) ? value : fallback;
}

function coordinateAt(row: ResultRow, primary: string, fallback: string): number {
  const value = row[primary] == null ? row[fallback] : row[primary];
  const coordinate = Number(value);
  if (value == null || !Number.isFinite(coordinate) || coordinate < 0 || coordinate > 1_000_000_000) {
    throw new Error(`Invalid ${primary}/${fallback} coordinate in measurement row`);
  }
  return coordinate;
}

export function integerId(row: ResultRow, key: string): number {
  const value = numberAt(row, key, -1);
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`Invalid ${key} in measurement row`);
  return value;
}

function boundedRoi(row: ResultRow): [number, number, number, number] {
  const sizeX = integerId(row, "size_x");
  const sizeY = integerId(row, "size_y");
  if (!sizeX || !sizeY) throw new Error("Image dimensions are unavailable");
  const centerX = coordinateAt(row, "point_x", "centroid_x_px");
  const centerY = coordinateAt(row, "point_y", "centroid_y_px");
  const lowX = Number(row.bbox_min_x_px);
  const highX = Number(row.bbox_max_x_px);
  const lowY = Number(row.bbox_min_y_px);
  const highY = Number(row.bbox_max_y_px);
  const objectWidth = Number.isFinite(lowX) && Number.isFinite(highX) ? highX - lowX : 0;
  const objectHeight = Number.isFinite(lowY) && Number.isFinite(highY) ? highY - lowY : 0;
  const width = Math.min(sizeX, Math.max(128, Math.min(1024, objectWidth + 64)));
  const height = Math.min(sizeY, Math.max(128, Math.min(1024, objectHeight + 64)));
  const x0 = Math.max(0, Math.min(sizeX - width, Math.floor(centerX - width / 2)));
  const y0 = Math.max(0, Math.min(sizeY - height, Math.floor(centerY - height / 2)));
  return [x0, y0, x0 + width, y0 + height];
}

export function focusForResult(row: ResultRow, kind: ResultKind, items: ZarrVectorItem[] = []): ZarrFocusTarget {
  const uuid = String(row.output_store_uuid || "").toLowerCase();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid)) {
    throw new Error("The measurement row has no valid output store UUID");
  }
  const field = String(row.output_resource_path || ".");
  if (field.startsWith("/") || field.split("/").includes("..")) throw new Error("Invalid result field");
  const sourceChannels = kind === "colocalization"
    ? [integerId(row, "channel_a"), integerId(row, "channel_b")]
    : Number.isSafeInteger(Number(row.source_channel)) && Number(row.source_channel) > 0
      ? [Number(row.source_channel)] : [1];
  const labelValue = integerId(row, "label_value");
  const labelPath = String(row.output_label_path || "");
  const labelChannel = Number(row.output_channel_index);
  const overlays = labelValue > 0 && row.output_label_kind === "label-image" && labelPath
    ? [{ labelPath, values: [labelValue], mode: "outline" as const, opacity: 1, outlineWidth: 2, color: "#FFFF00" }]
    : labelValue > 0 && row.output_label_kind === "image-channel" && Number.isSafeInteger(labelChannel) && labelChannel > 0
      ? [{ labelChannel, values: [labelValue], mode: "outline" as const, opacity: 1, outlineWidth: 2, color: "#FFFF00" }]
      : [];
  const t = integerId(row, "timepoint");
  const z = Math.max(0, Math.floor(numberAt(row, "point_z", numberAt(row, "centroid_z_px"))));
  const selectedItems = items.slice(0, 256);
  for (const item of selectedItems) {
    const coordinates = [item.x, item.y, ...(item.kind === "line" ? [item.x2, item.y2] : [])];
    if (coordinates.some((value) => typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1_000_000_000)) {
      throw new Error("Invalid vector coordinates in measurement results");
    }
  }
  while (selectedItems.length && new URLSearchParams({ vectors: JSON.stringify({ version: 1, items: selectedItems }) }).toString().length > 16_000) {
    selectedItems.pop();
  }
  const vectors: ZarrVectorOverlay | undefined = selectedItems.length ? { version: 1, items: selectedItems } : undefined;
  return {
    storeUuid: uuid, field, targetKind: kind === "spots" ? "point" : "object",
    sizeX: integerId(row, "size_x"), sizeY: integerId(row, "size_y"),
    sizeZ: integerId(row, "size_z"), sizeT: integerId(row, "size_t"),
    sourceChannels: [...new Set(sourceChannels)], labelValue, overlays, vectors,
    evidenceIds: [], t, z, roi: boundedRoi(row), croppedField: true,
    title: `${RESULT_LABELS[kind]} · ${String(row.label_name || "object")} ${integerId(row, "object_id")}`,
  };
}

export function pointItem(row: ResultRow, color = "#00E5FF", trail = false): ZarrVectorItem {
  return { kind: "point", x: coordinateAt(row, "point_x", "centroid_x_px"),
    y: coordinateAt(row, "point_y", "centroid_y_px"),
    t: integerId(row, "timepoint"),
    z: Math.max(0, Math.floor(numberAt(row, "point_z", numberAt(row, "centroid_z_px")))),
    color, radius: 4, trail };
}

export function trackItems(rows: ResultRow[]): ZarrVectorItem[] {
  const ordered = [...rows].sort((a, b) => numberAt(a, "timepoint") - numberAt(b, "timepoint")).slice(0, 40);
  const points = ordered.map((row) => pointItem(row, "#00E5FF", true));
  const lines: ZarrVectorItem[] = [];
  for (let i = 1; i < points.length; i++) {
    const prior = points[i - 1];
    const next = points[i];
    if (prior.z !== next.z) continue;
    lines.push({ kind: "line", x: prior.x, y: prior.y, x2: next.x, y2: next.y,
      t: next.t, z: next.z, color: "#00E5FF", width: 2, trail: true,
      dashed: next.t - prior.t > 1 });
  }
  return [...lines, ...points];
}
