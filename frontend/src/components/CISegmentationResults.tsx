import { useEffect, useRef, useState } from "react";
import "../scientific-results.css";
import type { OmeroContext, OmeroHierarchy, WorkspaceFile, ZarrFocusTarget, ZarrVectorItem, ZarrViewerIntegrationStatus } from "../types";
import type { OmeroBridge } from "../api";
import { fetchZarrCapability, renderZarrPreview, zarrCandidates, zarrViewerUrl } from "../zarrViewer";
import { focusForResult, integerId, numberAt, pointItem, queryRows, RESULT_LABELS, RESULT_SQL, trackItems,
  type ResultKind, type ResultRow } from "../cisegmentationResults";

interface Props {
  bridge: OmeroBridge;
  files: WorkspaceFile[];
  context: OmeroContext | null;
  hierarchy: OmeroHierarchy | null;
  viewer: ZarrViewerIntegrationStatus | null;
}

const MODES: ResultKind[] = ["spatial", "colocalization", "tracking", "spots"];
const METRIC: Record<ResultKind, string> = {
  spatial: "Nearest neighbour (µm)", colocalization: "Pearson r",
  tracking: "Path length (µm)", spots: "Spot area (µm²)"
};

function scientificInputs(files: WorkspaceFile[]): WorkspaceFile[] {
  return files.filter((file) => !file.deletedAt && file.state === "ready" && file.annotationId &&
    /\.(duckdb|sqlite|sqlite3)$/i.test(file.name) && !/geometry/i.test(file.name));
}

export function CISegmentationResults({ bridge, files, context, hierarchy, viewer }: Props) {
  const inputs = scientificInputs(files);
  const [fileId, setFileId] = useState("");
  const [available, setAvailable] = useState<ResultKind[]>([]);
  const [mode, setMode] = useState<ResultKind>("spatial");
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [preview, setPreview] = useState("");
  const [fullUrl, setFullUrl] = useState("");
  const [detail, setDetail] = useState("");
  const [provenance, setProvenance] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const selectionEpoch = useRef(0);
  const source = inputs.find((file) => file.id === fileId) || inputs[0];

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => { selectionEpoch.current++; setAvailable([]); setRows([]); setSelected(null); setPreview(""); setFullUrl(""); setProvenance(null); setDetail(""); setError(""); }, [source?.id]);

  async function query(sql: string): Promise<ResultRow[]> {
    if (!source?.annotationId) throw new Error("Choose an OMERO-attached measurements database");
    return queryRows(await bridge.remoteQuery(source.annotationId, sql, {}));
  }

  async function inspect() {
    if (!source?.annotationId) return;
    const epoch = ++selectionEpoch.current;
    setBusy(true); setError(""); setRows([]); setSelected(null);
    try {
      const schema = await bridge.remoteSchema(source.annotationId);
      const names = new Set((Array.isArray(schema.tables) ? schema.tables : [])
        .map((table: { name?: string }) => String(table.name || "")));
      if (names.size && !names.has("measurement_extensions")) throw new Error("This is not a CISegmentation extension database");
      const registry = await query("SELECT name, version FROM measurement_extensions LIMIT 10");
      if (epoch !== selectionEpoch.current) return;
      const enabled = new Set(registry.filter((row) => Number(row.version) === 1).map((row) => String(row.name)));
      const hasPoints = (await query("SELECT object_id FROM point_localizations LIMIT 1")).length > 0;
      if (epoch !== selectionEpoch.current) return;
      const modes = MODES.filter((kind) => kind === "spots" ? hasPoints : enabled.has(kind));
      if (!modes.length) throw new Error("No supported optional measurements are enabled in this database");
      setAvailable(modes); setMode(modes[0]);
      await load(modes[0]);
    } catch (reason) { if (epoch === selectionEpoch.current) setError(reason instanceof Error ? reason.message : String(reason)); }
    finally { if (epoch === selectionEpoch.current) setBusy(false); }
  }

  async function load(kind: ResultKind) {
    const epoch = ++selectionEpoch.current;
    setMode(kind); setRows([]); setSelected(null); setDetail(""); setError(""); setBusy(true);
    try {
      const next = await query(RESULT_SQL[kind]);
      if (epoch === selectionEpoch.current) setRows(next);
    } catch (reason) { if (epoch === selectionEpoch.current) setError(reason instanceof Error ? reason.message : String(reason)); }
    finally { if (epoch === selectionEpoch.current) setBusy(false); }
  }

  async function selectRow(row: ResultRow, index: number) {
    const epoch = ++selectionEpoch.current;
    setSelected(index); setError(""); setDetail(""); setFullUrl(""); setPreview(""); setProvenance(null); setBusy(true);
    try {
      const items: ZarrVectorItem[] = [];
      const notes: string[] = [];
      if (mode === "spots") items.push(pointItem(row));
      if (mode === "tracking") {
        const trackId = integerId(row, "track_id");
        const observations = await query(`SELECT n.object_id, n.timepoint, n.centroid_x_px, n.centroid_y_px,
          n.centroid_z_px, p.x_px AS point_x, p.y_px AS point_y, p.z_px AS point_z
          FROM track_observations o JOIN object_navigation n ON n.object_id=o.object_id
          LEFT JOIN point_localizations p ON p.object_id=n.object_id
          WHERE o.track_id=${trackId} ORDER BY n.timepoint LIMIT 100`);
        items.push(...trackItems(observations));
        if (observations.length >= 40 || numberAt(row, "observation_count") > observations.length) {
          notes.push("Track overlay shows a bounded partial trail.");
        }
        if (["cells", "nuclei"].includes(String(row.object_type))) {
          const ids = observations.map((observation) => integerId(observation, "object_id")).slice(0, 40);
          if (ids.length) {
            const daughters = await query(`SELECT p.timepoint, p.centroid_x_px AS parent_x, p.centroid_y_px AS parent_y,
              p.centroid_z_px AS parent_z, a.centroid_x_px AS ax, a.centroid_y_px AS ay,
              b.centroid_x_px AS bx, b.centroid_y_px AS by
              FROM cell_divisions d JOIN object_navigation p ON p.object_id=d.parent_object_id
              JOIN object_navigation a ON a.object_id=d.daughter_a_object_id
              JOIN object_navigation b ON b.object_id=d.daughter_b_object_id
              WHERE d.parent_object_id IN (${ids.join(",")}) LIMIT 20`);
            for (const division of daughters) {
              for (const suffix of ["a", "b"] as const) items.push({ kind: "line",
                x: numberAt(division, "parent_x"), y: numberAt(division, "parent_y"),
                x2: numberAt(division, `${suffix}x`), y2: numberAt(division, `${suffix}y`),
                t: integerId(division, "timepoint") + 1,
                z: Math.max(0, Math.floor(numberAt(division, "parent_z"))),
                color: "#FFB300", width: 2, trail: true });
            }
          }
        }
      }
      if (mode === "spatial") {
        items.push(pointItem(row, "#FFFF00"));
        const nearestId = Number(row.nearest_object_id);
        if (Number.isSafeInteger(nearestId) && nearestId > 0) {
          const nearest = (await query(`SELECT object_id, timepoint, centroid_x_px, centroid_y_px,
            centroid_z_px FROM object_navigation WHERE object_id=${nearestId} LIMIT 1`))[0];
          if (nearest && integerId(nearest, "timepoint") === integerId(row, "timepoint")) {
            const from = pointItem(row); const to = pointItem(nearest, "#FFB300");
            if (from.z === to.z) items.push({ kind: "line", x: from.x, y: from.y,
              x2: to.x, y2: to.y, t: from.t, z: from.z, color: "#FFB300", width: 2 });
            items.push(to);
          }
        }
        const objectId = integerId(row, "object_id");
        const contacts = await query(`SELECT n.object_id, n.timepoint, n.centroid_x_px,
          n.centroid_y_px, n.centroid_z_px
          FROM object_contacts c JOIN object_navigation n ON n.object_id=
            CASE WHEN c.source_object_id=${objectId} THEN c.target_object_id ELSE c.source_object_id END
          WHERE c.source_object_id=${objectId} OR c.target_object_id=${objectId}
          LIMIT 20`);
        const from = pointItem(row);
        for (const contact of contacts) {
          const to = pointItem(contact, "#FF6E40");
          if (from.t !== to.t || from.z !== to.z) continue;
          items.push({ kind: "line", x: from.x, y: from.y, x2: to.x, y2: to.y,
            t: from.t, z: from.z, color: "#FF6E40", width: 2 });
          items.push(to);
        }
        notes.push(`${String(row.neighbor_count ?? "unknown")} neighbours within ${String(row.radius_um ?? "configured")} µm; ${String(row.touching_neighbor_count ?? "unknown")} touching neighbours; shared boundary ${String(row.shared_boundary ?? "unknown")} ${String(row.boundary_unit || "")}.`);
      }
      if (mode === "colocalization") {
        const imageId = integerId(row, "image_id");
        const t = integerId(row, "timepoint");
        const thresholds = await query(`SELECT c.channel_index, h.threshold, h.sample_count, h.method,
          h.sampling_json FROM colocalization_thresholds h JOIN channels c ON c.channel_id=h.channel_id
          WHERE h.image_id=${imageId} AND h.timepoint=${t} LIMIT 8`);
        notes.push(`Pearson ${String(row.metric ?? "undefined")}; Manders A in B ${String(row.manders_a_in_b ?? "undefined")}; B in A ${String(row.manders_b_in_a ?? "undefined")}.`);
        if (row.reason) notes.push(`Undefined-value reason: ${String(row.reason)}.`);
        notes.push(`Object sample count: ${String(row.sample_count ?? "unknown")}.`);
        notes.push(...thresholds.map((threshold) => `Channel ${threshold.channel_index}: ${threshold.method} threshold ${threshold.threshold}, ${threshold.sample_count} sampled pixels (${String(threshold.sampling_json || "sampling details unavailable").slice(0, 300)}).`));
      }
      let focusRow = row;
      if (mode !== "colocalization") {
        const labelSetId = integerId(row, "label_set_id");
        const origins = await query(`SELECT c.channel_index FROM label_set_sources s
          JOIN channels c ON c.channel_id=s.channel_id WHERE s.label_set_id=${labelSetId}
          ORDER BY CASE WHEN s.channel_role='primary' THEN 0 ELSE 1 END LIMIT 1`);
        if (origins.length) focusRow = { ...row, source_channel: origins[0].channel_index };
      }
      let focus = focusForResult(focusRow, mode, items);
      if (mode === "tracking") {
        const points = items.filter((item) => item.kind === "point");
        if (points.length) {
          const last = points[points.length - 1];
          const minX = Math.min(...points.map((item) => item.x));
          const maxX = Math.max(...points.map((item) => item.x));
          const minY = Math.min(...points.map((item) => item.y));
          const maxY = Math.max(...points.map((item) => item.y));
          const width = Math.min(focus.sizeX, 1024, Math.max(128, Math.ceil(maxX - minX + 64)));
          const height = Math.min(focus.sizeY, 1024, Math.max(128, Math.ceil(maxY - minY + 64)));
          const x0 = Math.max(0, Math.min(focus.sizeX - width, Math.floor((minX + maxX - width) / 2)));
          const y0 = Math.max(0, Math.min(focus.sizeY - height, Math.floor((minY + maxY - height) / 2)));
          focus = { ...focus, t: last.t, z: last.z, roi: [x0, y0, x0 + width, y0 + height] };
        }
      }
      const candidates = zarrCandidates(context, hierarchy);
      if (!viewer?.available || !candidates.length) throw new Error("No accessible ZarrViewer image is available in the current OMERO context");
      let capability;
      for (let offset = 0; offset < candidates.length && !capability; offset += 4) {
        const checked = await Promise.allSettled(candidates.slice(offset, offset + 4)
          .map((candidate) => fetchZarrCapability(viewer, candidate)));
        capability = checked.flatMap((result) => result.status === "fulfilled" ? [result.value] : [])
          .find((candidate) => candidate.store.uuid === focus.storeUuid);
      }
      if (!capability) throw new Error("No current-group OMERO image matches this result's output store UUID");
      if (!capability.features?.includes("zarr-vector-overlay-v1")) {
        focus = { ...focus, vectors: undefined };
        notes.push("This installed ZarrViewer can show the image and raster label; vector overlays require the analysis_skills viewer build.");
      }
      const url = zarrViewerUrl(viewer, capability, focus);
      const png = await renderZarrPreview(capability, focus);
      if (epoch !== selectionEpoch.current) return;
      setFullUrl(url); setPreview(URL.createObjectURL(new Blob([png], { type: "image/png" })));
      setDetail(notes.join(" "));
      setProvenance({ schema: "nl.bioimaging.cisegmentation-review.v1", sourceName: source?.name,
        query: RESULT_SQL[mode], selectedObjectId: row.object_id, metric: row.metric,
        storeUuid: focus.storeUuid, viewerUrl: url,
        renderRecipe: { storeUuid: focus.storeUuid, panels: [{ field: focus.field, roi: focus.roi,
          sourceChannels: focus.sourceChannels, t: focus.t, z: focus.z,
          overlays: focus.overlays, ...(focus.vectors ? { vectors: focus.vectors } : {}) }] } });
    } catch (reason) { if (epoch === selectionEpoch.current) setError(reason instanceof Error ? reason.message : String(reason)); }
    finally { if (epoch === selectionEpoch.current) setBusy(false); }
  }

  function downloadProvenance() {
    if (!provenance) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(provenance, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url; link.download = "cisegmentation-review.json"; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const values = rows.map((row) => Number(row.metric)).filter(Number.isFinite);
  const low = values.length ? Math.min(...values) : 0;
  const high = values.length ? Math.max(...values) : 1;
  const span = Math.max(1e-9, high - low);
  return <section className="ciseg-results" aria-label="CISegmentation results">
    <h2>Explore CISegmentation results</h2>
    <p>Inspect measured objects and their source image in the current OMERO group.</p>
    <div className="ciseg-controls">
      <label>Measurements database <select value={source?.id || ""} onChange={(event) => setFileId(event.target.value)}>
        {inputs.map((file) => <option key={file.id} value={file.id}>{file.name}</option>)}
      </select></label>
      <button disabled={!source || busy} onClick={() => void inspect()}>Inspect database</button>
      {available.length > 0 && <label>Result type <select value={mode} onChange={(event) => void load(event.target.value as ResultKind)}>
        {available.map((kind) => <option key={kind} value={kind}>{RESULT_LABELS[kind]}</option>)}
      </select></label>}
    </div>
    {!inputs.length && <p>Attach a CISegmentation DuckDB or SQLite measurements database to this workspace to explore it.</p>}
    {busy && <p role="status">Loading bounded results…</p>}
    {error && <p role="alert" className="browser-error">{error}</p>}
    {rows.length > 0 && <div className="ciseg-review">
      <div className="ciseg-plot">
        <h3>{METRIC[mode]}</h3>
        <svg viewBox="0 0 640 220" role="img" aria-label={`${METRIC[mode]} distribution, ${rows.length} sampled results`}>
          <line x1="42" y1="185" x2="620" y2="185" stroke="currentColor" />
          <text x="4" y="25" fill="currentColor" fontSize="12">{high.toPrecision(3)}</text>
          <text x="4" y="186" fill="currentColor" fontSize="12">{low.toPrecision(3)}</text>
          {rows.map((row, index) => {
            const value = Number(row.metric);
            if (!Number.isFinite(value)) return null;
            const x = 45 + index * 570 / Math.max(1, rows.length - 1);
            const y = 180 - (value - low) / span * 150;
            return <circle key={index} cx={x} cy={y} r={selected === index ? 6 : 4}
              fill={selected === index ? "#ffb300" : "#00acc1"} role="button" tabIndex={0}
              aria-label={`Result ${index + 1}: ${value}`}
              onClick={() => void selectRow(row, index)}
              onKeyDown={(event) => { if (event.key === "Enter") void selectRow(row, index); }} />;
          })}
        </svg>
        <div className="ciseg-table-wrap"><table><thead><tr><th>Object</th><th>Field</th><th>Time</th><th>{METRIC[mode]}</th></tr></thead>
          <tbody>{rows.map((row, index) => <tr key={index} className={selected === index ? "selected" : ""}
            onClick={() => void selectRow(row, index)}>
            <td>{String(row.object_id)}</td><td>{String(row.output_resource_path)}</td>
            <td>{String(row.timepoint)}</td><td>{row.metric == null ? "undefined" : String(row.metric)}</td>
          </tr>)}</tbody></table></div>
      </div>
      <aside className="ciseg-preview"><h3>Source image</h3>
        {preview ? <img src={preview} alt="Bounded source image and selected scientific overlays" />
          : <p>Select a plotted result to inspect its source image.</p>}
        {fullUrl && <a href={fullUrl} target="_blank" rel="noopener noreferrer">Open full ZarrViewer</a>}
        {preview && <div className="ciseg-downloads">
          <a href={preview} download="cisegmentation-review.png">Download PNG</a>
          <button onClick={downloadProvenance}>Download review provenance</button>
        </div>}
        {detail && <p>{detail}</p>}
      </aside>
    </div>}
  </section>;
}
