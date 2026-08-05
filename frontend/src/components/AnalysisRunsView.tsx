import { useMemo, useState } from "react";
import type {
  AnalysisRunRecord,
  ExecutionRecord,
  MethodRecord,
  PipelineRecord,
  WorkspaceFile
} from "../types";
import { ActionIcon } from "./ActionIcon";
import { Button } from "./BlueprintControls";
import { ExecutionCard, executionOutputFiles } from "./ExecutionCard";

function bytesLabel(value: number): string {
  if (value < 1024) return `${value} bytes`;
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} KiB`;
  return `${(value / 1024 ** 2).toFixed(1)} MiB`;
}

function runDuration(run: AnalysisRunRecord): string {
  if (!run.completedAt) return run.status === "running" ? "in progress" : "duration unavailable";
  const milliseconds = Date.parse(run.completedAt) - Date.parse(run.createdAt);
  if (!Number.isFinite(milliseconds) || milliseconds < 0) return "duration unavailable";
  if (milliseconds < 1000) return `${milliseconds} ms`;
  if (milliseconds < 60_000) return `${(milliseconds / 1000).toFixed(1)} sec`;
  return `${Math.floor(milliseconds / 60_000)} min ${Math.round(milliseconds % 60_000 / 1000)} sec`;
}

export function supplementalRunImages(
  executions: ExecutionRecord[],
  runFiles: WorkspaceFile[],
  allFiles: WorkspaceFile[]
): WorkspaceFile[] {
  const displayed = executions.flatMap((execution) => executionOutputFiles(execution, allFiles));
  const displayedIds = new Set(displayed.map((file) => file.id));
  const displayedContent = new Set(displayed
    .filter((file) => Boolean(file.sha256))
    .map((file) => `${file.type}:${file.sha256}`));
  return runFiles.filter((file) => {
    const isImage = file.type === "image/png" || file.type === "image/svg+xml";
    const contentKey = `${file.type}:${file.sha256}`;
    return isImage && Boolean(file.data) && !file.deletedAt &&
      !displayedIds.has(file.id) && (!file.sha256 || !displayedContent.has(contentKey));
  });
}

interface AnalysisRunsViewProps {
  kind: "method" | "pipeline";
  methods: MethodRecord[];
  pipelines: PipelineRecord[];
  selectedMethodIds: Set<string>;
  methodId: string;
  pipelineId: string;
  busy: boolean;
  editorEnabled: boolean;
  pipelineBuilderOpen: boolean;
  runs: AnalysisRunRecord[];
  selectedRun: AnalysisRunRecord | null;
  selectedRunExecutions: ExecutionRecord[];
  selectedRunFiles: WorkspaceFile[];
  allFiles: WorkspaceFile[];
  onMethodIdChange: (id: string) => void;
  onPipelineIdChange: (id: string) => void;
  onRunMethod: (method: MethodRecord) => void;
  onRunPipeline: (pipeline: PipelineRecord) => void;
  onEditMethod: (method: MethodRecord) => void;
  onEditPipeline: (pipeline: PipelineRecord) => void;
  onPipelineBuilderChange: (open: boolean) => void;
  onToggleMethod: (id: string) => void;
  onClearMethods: () => void;
  onCreatePipeline: () => Promise<PipelineRecord | null>;
  onStop: () => void;
  onRerun: (run: AnalysisRunRecord) => void;
  onSelectRun: (id: string) => void;
  onInspectFile: (id: string) => void;
}

export function AnalysisRunsView({
  kind,
  methods,
  pipelines,
  selectedMethodIds,
  methodId,
  pipelineId,
  busy,
  editorEnabled,
  pipelineBuilderOpen,
  runs,
  selectedRun,
  selectedRunExecutions,
  selectedRunFiles,
  allFiles,
  onMethodIdChange,
  onPipelineIdChange,
  onRunMethod,
  onRunPipeline,
  onEditMethod,
  onEditPipeline,
  onPipelineBuilderChange,
  onToggleMethod,
  onClearMethods,
  onCreatePipeline,
  onStop,
  onRerun,
  onSelectRun,
  onInspectFile
}: AnalysisRunsViewProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const selectedMethod = methods.find((item) => item.id === (methodId || methods[0]?.id));
  const selectedPipeline = pipelines.find((item) => item.id === (pipelineId || pipelines[0]?.id));
  const label = kind === "method" ? "Method" : "Pipeline";
  const filteredRuns = useMemo(() => runs
    .filter((run) => !query.trim() || run.artifactName.toLowerCase().includes(query.trim().toLowerCase()))
    .filter((run) => statusFilter === "all" || run.status === statusFilter)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt)), [query, runs, statusFilter]);
  const supplementalImages = useMemo(
    () => supplementalRunImages(selectedRunExecutions, selectedRunFiles, allFiles),
    [allFiles, selectedRunExecutions, selectedRunFiles]
  );

  return (
    <section className={`runs-view ${kind === "pipeline" && pipelineBuilderOpen ? "pipeline-builder-visible" : ""}`}
      aria-label={`${label}s`}>
      <div className="runs-toolbar">
        <div>
          <strong>{label}s</strong>
          <span>{kind === "method"
            ? "Run reusable Methods and inspect their durable output history."
            : "Run or create Pipelines and inspect their durable output history."}</span>
        </div>
        <div className="runs-launchers">
          {kind === "method" ? (
            <>
              <select aria-label="Method" value={methodId || methods[0]?.id || ""}
                disabled={!methods.length || busy}
                onChange={(event) => onMethodIdChange(event.target.value)}>
                {methods.map((method) => <option key={method.id} value={method.id}>{method.name} · v{method.currentVersion}</option>)}
              </select>
              <Button disabled={!selectedMethod || busy}
                onClick={() => selectedMethod && onRunMethod(selectedMethod)}>
                <ActionIcon name="run" />Run Method
              </Button>
              {editorEnabled && <Button aria-label="Edit selected Method" disabled={!selectedMethod || busy}
                onClick={() => selectedMethod && onEditMethod(selectedMethod)}>
                <ActionIcon name="edit" />Edit Method
              </Button>}
            </>
          ) : (
            <>
              <select aria-label="Pipeline" value={pipelineId || pipelines[0]?.id || ""}
                disabled={!pipelines.length || busy}
                onChange={(event) => onPipelineIdChange(event.target.value)}>
                {pipelines.map((pipeline) => <option key={pipeline.id} value={pipeline.id}>{pipeline.name} · v{pipeline.version}</option>)}
              </select>
              <Button disabled={!selectedPipeline || busy}
                onClick={() => selectedPipeline && onRunPipeline(selectedPipeline)}>
                <ActionIcon name="run" />Run Pipeline
              </Button>
              {editorEnabled && <Button aria-label="Edit selected Pipeline" disabled={!selectedPipeline || busy}
                onClick={() => selectedPipeline && onEditPipeline(selectedPipeline)}>
                <ActionIcon name="edit" />Edit Pipeline
              </Button>}
              <Button disabled={!methods.length || busy} aria-expanded={pipelineBuilderOpen}
                onClick={() => onPipelineBuilderChange(!pipelineBuilderOpen)}>
                <ActionIcon name="add" />Create Pipeline
              </Button>
            </>
          )}
        </div>
        {busy
          ? <Button onClick={onStop}><ActionIcon name="stop" />Stop</Button>
          : selectedRun && <Button onClick={() => onRerun(selectedRun)}><ActionIcon name="reset" />Rerun</Button>}
      </div>

      {kind === "pipeline" && pipelineBuilderOpen && (
        <section className="pipeline-builder" aria-label="Create Pipeline">
          <header>
            <div><strong>Create a Pipeline</strong><span>Select at least two Methods. Current saved versions are pinned in this order.</span></div>
            <Button aria-label="Close Pipeline builder" onClick={() => onPipelineBuilderChange(false)}>×</Button>
          </header>
          <div className="pipeline-method-picker">
            {methods.map((method, index) => (
              <label key={method.id} className={selectedMethodIds.has(method.id) ? "selected" : ""}>
                <input aria-label={`Include ${method.name} in Pipeline`} type="checkbox"
                  checked={selectedMethodIds.has(method.id)} onChange={() => onToggleMethod(method.id)} />
                <span className="pipeline-method-order">
                  {selectedMethodIds.has(method.id) ? Array.from(selectedMethodIds).indexOf(method.id) + 1 : index + 1}
                </span>
                <span><strong>{method.name}</strong><small>Current version {method.currentVersion}</small></span>
              </label>
            ))}
          </div>
          <div className="pipeline-builder-actions">
            <span>{selectedMethodIds.size} Method{selectedMethodIds.size === 1 ? "" : "s"} selected</span>
            <Button onClick={onClearMethods}>Clear selection</Button>
            <Button disabled={selectedMethodIds.size < 2} onClick={() => {
              void onCreatePipeline().then((pipeline) => {
                if (pipeline) onPipelineBuilderChange(false);
              });
            }}><ActionIcon name="pipeline" />Create Pipeline</Button>
          </div>
        </section>
      )}

      <div className="runs-layout">
        <aside className="run-history" aria-label={`${label} run history`}>
          <h3>{label} run history</h3>
          <div className="run-history-filters">
            <input type="search" aria-label={`Search ${label} run history`}
              placeholder="Search runs…" value={query} onChange={(event) => setQuery(event.target.value)} />
            <select aria-label={`Filter ${label} runs by status`} value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="stopped">Stopped</option>
              <option value="running">Running</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
          {!filteredRuns.length && <p>No matching {label} runs.</p>}
          {filteredRuns.map((run) => (
            <button key={run.id} className={selectedRun?.id === run.id ? "active" : ""}
              aria-label={`${run.artifactName}, version ${run.artifactVersion}, ${run.status}, ${new Date(run.createdAt).toLocaleString()}`}
              onClick={() => onSelectRun(run.id)}>
              <ActionIcon name={run.kind === "method" ? "run" : "pipeline"} />
              <span>
                <strong>{run.artifactName}</strong>
                <small>v{run.artifactVersion} · {run.status}</small>
                <time dateTime={run.createdAt}>{new Date(run.createdAt).toLocaleString()}</time>
                <small>{runDuration(run)}</small>
              </span>
            </button>
          ))}
        </aside>
        <div className="run-detail">
          {!selectedRun && <div className="run-empty"><h2>No run selected</h2><p>Run a {label} from Home, Explorer, or the Artifact Inspector.</p></div>}
          {selectedRun && (
            <>
              <header className={`run-summary ${selectedRun.status}`}>
                <div>
                  <span>{label} run</span>
                  <h2>{selectedRun.artifactName}</h2>
                  <p>Version {selectedRun.artifactVersion} · {selectedRun.status} · {new Date(selectedRun.createdAt).toLocaleString()} · {runDuration(selectedRun)}</p>
                </div>
                {selectedRun.error && <pre>{selectedRun.error}</pre>}
              </header>
              {selectedRun.steps.length > 0 && (
                <ol className="run-steps">
                  {selectedRun.steps.map((step) => (
                    <li key={step.stepId} className={step.status}>
                      <span>{step.status}</span><strong>{step.name}</strong><small>Method v{step.methodVersion}</small>
                      {step.error && <p>{step.error}</p>}
                    </li>
                  ))}
                </ol>
              )}
              {Object.keys(selectedRun.resolvedBindings).length > 0 && (
                <details className="run-bindings"><summary>Resolved input bindings</summary>
                  <dl>{Object.entries(selectedRun.resolvedBindings).map(([from, to]) => (
                    <div key={from}><dt>{from}</dt><dd>{to}</dd></div>
                  ))}</dl>
                </details>
              )}
              <div className="run-executions">
                {selectedRunExecutions.map((execution, index) => (
                  <ExecutionCard key={execution.id} execution={execution} files={allFiles}
                    supplementalOutputs={index === selectedRunExecutions.length - 1
                      ? supplementalImages
                      : []}
                    onSave={() => undefined} onRerun={() => onRerun(selectedRun)}
                    saveDisabled={busy} showSaveAction={false} showRerunAction={false} />
                ))}
              </div>
              {selectedRunFiles.length > 0 && (
                <section className="run-files" aria-label="Generated files">
                  <h3>Generated files</h3>
                  <div>{selectedRunFiles.map((file) => (
                    <button key={file.id} onClick={() => onInspectFile(file.id)}>
                      <ActionIcon name="download" />
                      <span><strong>{file.name}</strong><small>{bytesLabel(file.size)} · inspect or download</small></span>
                    </button>
                  ))}</div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
