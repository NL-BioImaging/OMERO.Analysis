import { useEffect, useMemo, useState } from "react";
import { executionActivityText } from "../presentation";
import type { ExecutionRecord, WorkspaceFile } from "../types";
import { ActionIcon } from "./ActionIcon";
import { Button, Input } from "./BlueprintControls";

export function ExecutionCard({
  execution,
  relatedExecutions = [execution],
  files,
  onSave,
  onRerun,
  saveDisabled = false,
  showSaveAction = true,
  showRerunAction = true
}: {
  execution: ExecutionRecord;
  relatedExecutions?: ExecutionRecord[];
  files: WorkspaceFile[];
  onSave: () => void;
  onRerun: () => void;
  saveDisabled?: boolean;
  showSaveAction?: boolean;
  showRerunAction?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const outputs = execution.outputFileIds
    .map((fileId) => files.find((file) => file.id === fileId && !file.deletedAt))
    .filter(Boolean) as WorkspaceFile[];
  const plots = outputs.filter((file) =>
    file.type === "image/png" || file.type === "image/svg+xml"
  );
  const purpose = execution.purpose || "analysis";
  const showReusableActions =
    ["success", "reused"].includes(execution.status);
  const timing = executionActivityText(purpose, execution.durationMs);
  const hiddenSteps = relatedExecutions.filter((item) => item.id !== execution.id);
  const controls = (
    <div className="execution-actions top">
      <Button
        className="detail-toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      ><ActionIcon name={expanded ? "clear" : "run"} />{expanded ? "Collapse" : "Show details"}</Button>
      {showReusableActions && showSaveAction && (
        <Button
          disabled={saveDisabled}
          title={saveDisabled ? "Wait until the assistant has finished its summary" : undefined}
          onClick={onSave}
        >
          <ActionIcon name="save" />Save as method
        </Button>
      )}
      {showReusableActions && showRerunAction && <Button onClick={onRerun}><ActionIcon name="reset" />Rerun</Button>}
      <small>{execution.codeHash.slice(0, 12)} · {execution.runtimeVersion}</small>
    </div>
  );
  return (
    <article
      className={`message execution ${execution.status}`}
      data-purpose={purpose}
    >
      <section className="execution-details" data-expanded={expanded ? "true" : "false"}>
        <div className="execution-heading">
          <span>
            {execution.status === "failed"
              ? "Analysis failed (local)"
              : execution.status === "reused"
                ? "Analysis reused (local)"
                : "Analysis (local)"}
          </span>
          {controls}
        </div>
        {(timing || hiddenSteps.length > 0) && (
          <p className="activity-timing">
            {[timing, hiddenSteps.length
              ? `${hiddenSteps.length} supporting local step${hiddenSteps.length === 1 ? "" : "s"} hidden`
              : ""].filter(Boolean).join(" · ")}
          </p>
        )}
        <div className="execution-content" hidden={!expanded}>
          <h4>Reusable Python</h4>
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
          {hiddenSteps.length > 0 && (
            <details className="supporting-executions">
              <summary>
                Supporting diagnostics ({hiddenSteps.length})
              </summary>
              <p>
                Schema inspection, repair attempts, and preparation stay here for troubleshooting. They are not separate reusable Methods.
              </p>
              {hiddenSteps.map((item, index) => (
                <section className="supporting-execution" key={item.id}>
                  <h5>
                    Step {index + 1} · {item.purpose === "inspection" ? "data inspection" : item.status}
                  </h5>
                  <pre><code>{item.code}</code></pre>
                  {item.stdout && <pre>{item.stdout}</pre>}
                  {item.stderr && <pre className="execution-error">{item.stderr}</pre>}
                </section>
              ))}
            </details>
          )}
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
          <Input value={query} onChange={(event) => setQuery(event.target.value)} />
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
      <Button className="plot-zoom" onClick={() => setZoomed((value) => !value)}>
        {zoomed ? "Close full view" : "Open full view"}
      </Button>
      <img src={url} alt={file.name} onDoubleClick={() => setZoomed(true)} />
      <figcaption>{file.name}</figcaption>
    </figure>
  ) : null;
}
