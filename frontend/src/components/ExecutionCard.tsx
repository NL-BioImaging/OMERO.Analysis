import { useEffect, useMemo, useState } from "react";
import { executionActivityText } from "../presentation";
import type { ExecutionRecord, WorkspaceFile } from "../types";

export function ExecutionCard({
  execution,
  files,
  onSave,
  onRerun,
  viewerPreparation = false,
  saveDisabled = false
}: {
  execution: ExecutionRecord;
  files: WorkspaceFile[];
  onSave: () => void;
  onRerun: () => void;
  viewerPreparation?: boolean;
  saveDisabled?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const outputs = execution.outputFileIds
    .map((fileId) => files.find((file) => file.id === fileId && !file.deletedAt))
    .filter(Boolean) as WorkspaceFile[];
  const plots = execution.status === "reused"
    ? []
    : outputs.filter((file) => file.type === "image/png" || file.type === "image/svg+xml");
  const purpose = execution.purpose || "analysis";
  const isInspection = purpose === "inspection";
  const showReusableActions =
    !isInspection &&
    !viewerPreparation &&
    ["success", "reused"].includes(execution.status);
  const timing = executionActivityText(purpose, execution.durationMs);
  const controls = (position: "top" | "bottom") => (
    <div className={`execution-actions ${position}`}>
      <button
        className="detail-toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >{expanded ? "Collapse" : "Show details"}</button>
      {showReusableActions && (
        <button
          disabled={saveDisabled}
          title={saveDisabled ? "Wait until the assistant has finished its summary" : undefined}
          onClick={onSave}
        >
          Save as method
        </button>
      )}
      {showReusableActions && <button onClick={onRerun}>Rerun</button>}
      <small>{execution.codeHash.slice(0, 12)} · {execution.runtimeVersion}</small>
    </div>
  );
  return (
    <article
      className={`message execution ${execution.status} ${isInspection ? "inspection" : ""}`}
      data-purpose={purpose}
    >
      <section className="execution-details" data-expanded={expanded ? "true" : "false"}>
        <div className="execution-heading">
          <span>
            {execution.status === "reused"
              ? "Reused Python run"
              : isInspection
                ? "AI data inspection (local)"
                : viewerPreparation
                  ? "Zarr render preparation (local)"
                : "Python code (local)"}
          </span>
          {controls("top")}
        </div>
        {timing && <p className="activity-timing">{timing}</p>}
        {isInspection && (
          <p className="inspection-note">
            This code was generated only to inspect bounded data for the assistant. It is not a reusable analysis method.
          </p>
        )}
        {viewerPreparation && (
          <p className="inspection-note">
            This intermediate code prepared and validated the ZarrViewer render. Save the complete analysis and render from the image card below.
          </p>
        )}
        <div className="execution-content" hidden={!expanded}>
          <pre><code>{execution.code}</code></pre>
          {execution.stdout && <pre>{execution.stdout}</pre>}
          {execution.stderr && <pre className="execution-error">{execution.stderr}</pre>}
          {execution.modelPayload && (
            <details className="model-payload">
              <summary>Data sent to AI</summary>
              <p>Only this bounded envelope was returned to the configured AI provider.</p>
              <pre>{JSON.stringify(execution.modelPayload, null, 2)}</pre>
            </details>
          )}
          {execution.preview != null && <Preview value={execution.preview} />}
          {controls("bottom")}
        </div>
      </section>
      {execution.status === "reused" && (
        <p className="reuse-note">
          Reused prior execution {execution.reusedFrom?.slice(0, 8)} because code and inputs are unchanged.
        </p>
      )}
      {execution.missingPlotCsv.length > 0 && (
        <p className="plot-warning">Source CSV missing: {execution.missingPlotCsv.join(", ")}</p>
      )}
      {plots.map((file) => <Artifact key={file.id} file={file} />)}
    </article>
  );
}

export function Preview({ value }: { value: unknown }) {
  const [query, setQuery] = useState("");
  const preview = value as {
    kind?: string;
    data?: { columns?: string[]; data?: unknown[][] };
  };
  if (preview?.kind === "table" && preview.data) {
    const columns = preview.data.columns || [];
    const rows = (preview.data.data || []).filter((row) =>
      !query || row.some((cell) => String(cell ?? "").toLowerCase().includes(query.toLowerCase()))
    );
    return (
      <div className="table-wrap">
        <label className="table-filter">
          <span>Filter preview</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <table>
          <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
          <tbody>{rows.map((row, index) => (
            <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{String(cell ?? "")}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
    );
  }
  return <pre className="preview">{JSON.stringify(value, null, 2)}</pre>;
}

export function Artifact({ file }: { file: WorkspaceFile }) {
  const [zoomed, setZoomed] = useState(false);
  const url = useMemo(
    () => file.data ? URL.createObjectURL(new Blob([file.data], { type: file.type })) : "",
    [file.data, file.type]
  );
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  return url ? (
    <figure className={zoomed ? "artifact-zoomed" : ""}>
      <button className="plot-zoom" onClick={() => setZoomed((value) => !value)}>
        {zoomed ? "Close full view" : "Open full view"}
      </button>
      <img src={url} alt={file.name} onDoubleClick={() => setZoomed(true)} />
      <figcaption>{file.name}</figcaption>
    </figure>
  ) : null;
}
