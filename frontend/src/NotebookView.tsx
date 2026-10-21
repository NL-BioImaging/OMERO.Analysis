import { NotebookSetup } from "./NotebookSetup";
import { RunParameters, type ParameterOptions } from "./RunParameters";
import { markNotebookStale, setupFingerprint } from "./notebookConfiguration";
import type { CompatibilitySource } from "./notebookCompatibility";
import { notebookError, notebookErrorSummary } from "./notebookErrors";
import { useEffect,useRef,useState,type ReactNode } from "react";
import { CodeEditor } from "./CodeEditor";
import { ActionIcon } from "./components/ActionIcon";
import { Button } from "./components/BlueprintControls";
import { Artifact } from "./components/ResultPreview";
import { MarkdownPreview } from "./components/WorkspacePanels";
import { compatibilityLabel,type Compatibility } from "./notebookCompatibility";
import { notebookToSource,sourceToNotebook } from "./notebookPercentSource";
import { parameterDefaults,parseNotebookProtocol,type NotebookProtocolContract } from "./notebookProtocol";
import { PythonRuntime } from "./runtime";
import type {
NotebookCell,
NotebookDocument,
NotebookOutput,
NotebookRecord,
RuntimeOutput,
WorkspaceFile
} from "./types";

const MAX_CELLS = 10000;

function sourceText(cell: NotebookCell): string {
  return Array.isArray(cell.source) ? cell.source.join("") : cell.source;
}

export function parseNotebook(data: ArrayBuffer): NotebookDocument {
  let value: unknown;
  try {
    value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(data));
  } catch {
    throw new Error("Notebook must contain valid UTF-8 JSON");
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Notebook root must be an object");
  }
  const document = value as Record<string, any>;
  if (document.nbformat !== 4 || !Array.isArray(document.cells)) {
    throw new Error("Only nbformat 4 notebooks are supported");
  }
  if (document.cells.length > MAX_CELLS) {
    throw new Error(`Notebook contains more than ${MAX_CELLS} cells`);
  }
  const metadata = document.metadata && typeof document.metadata === "object"
    ? document.metadata
    : {};
  const language = String(metadata.language_info?.name || "python").toLowerCase();
  const kernel = String(metadata.kernelspec?.language || "python").toLowerCase();
  if (!["python", "python3"].includes(language) ||
      !["python", "python3"].includes(kernel)) {
    throw new Error("Only Python notebooks are supported");
  }
  const cells = document.cells.map((raw: unknown, index: number): NotebookCell => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new Error(`Cell ${index + 1} is invalid`);
    }
    const cell = raw as Record<string, any>;
    if (!["markdown", "code", "raw"].includes(cell.cell_type)) {
      throw new Error(`Cell ${index + 1} has an unsupported type`);
    }
    if (!(typeof cell.source === "string" ||
      (Array.isArray(cell.source) && cell.source.every((line) => typeof line === "string")))) {
      throw new Error(`Cell ${index + 1} source must be text`);
    }
    return {
      ...cell,
      metadata: cell.metadata && typeof cell.metadata === "object" ? cell.metadata : {},
      outputs: cell.cell_type === "code" && Array.isArray(cell.outputs) ? cell.outputs : [],
      execution_count: cell.cell_type === "code" &&
        (cell.execution_count == null || Number.isInteger(cell.execution_count))
        ? cell.execution_count
        : null
    } as NotebookCell;
  });
  return {
    nbformat: 4,
    nbformat_minor: Number.isInteger(document.nbformat_minor)
      ? document.nbformat_minor
      : 0,
    metadata,
    cells
  };
}

export function serializeNotebook(document: NotebookDocument): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(document, null, 2));
}

export function clearNotebookInlineState(document: NotebookDocument): NotebookDocument {
  return {
    ...document,
    cells: document.cells.map((cell) => cell.cell_type === "code"
      ? { ...cell, execution_count: null, outputs: [] }
      : cell)
  };
}

const INPUT_BINDINGS_KIND = "input-bindings";

function fileExtension(name: string): string {
  const match = name.toLowerCase().match(/(\.[^.\\/]+)$/);
  return match?.[1] || "";
}

function inputReplacement(
  referencedName: string,
  inputs: WorkspaceFile[]
): string | null {
  const basename = referencedName.replace(/\\/g, "/").split("/").at(-1) || referencedName;
  const exact = inputs.find((file) => file.name === basename);
  if (exact) return exact.name;
  const extension = fileExtension(basename);
  const candidates = inputs.filter((file) => fileExtension(file.name) === extension);
  return candidates.length === 1 ? candidates[0].name : null;
}

function rebindInputPaths(source: string, inputs: WorkspaceFile[]): string {
  return source.replace(
    /(["'])(\/input\/(?:selected_measurements\/)?)([^"']+)\1/g,
    (value, quote: string, _prefix: string, referencedName: string) => {
      const replacement = inputReplacement(referencedName, inputs);
      return replacement ? `${quote}/input/${replacement}${quote}` : value;
    }
  );
}

export function reattachNotebookDocument(
  document: NotebookDocument,
  workspaceInputs: WorkspaceFile[]
): NotebookDocument {
  const inputs = workspaceInputs.filter(
    (file) => file.source !== "result" && file.state === "ready" &&
      !file.deletedAt && Boolean(file.data)
  );
  const bindingSource = [
    "# OMERO.Analysis input bindings — maintained by Reattach input data",
    "from pathlib import Path as _OAPath",
    'OA_INPUT_DIR = _OAPath("/input")',
    "OA_ATTACHED_INPUTS = {",
    ...inputs.map((file) =>
      `    ${JSON.stringify(file.name)}: OA_INPUT_DIR / ${JSON.stringify(file.name)},`
    ),
    "}",
    ""
  ].join("\n");
  const bindingCell: NotebookCell = {
    id: "omero-analysis-input-bindings",
    cell_type: "code",
    source: bindingSource,
    metadata: { omero_analysis: { kind: INPUT_BINDINGS_KIND } },
    execution_count: null,
    outputs: []
  };
  const cells = document.cells
    .filter((cell) =>
      (cell.metadata?.omero_analysis as { kind?: string } | undefined)?.kind !==
        INPUT_BINDINGS_KIND
    )
    .map((cell) => cell.cell_type === "code"
      ? { ...cell, source: rebindInputPaths(sourceText(cell), inputs) }
      : cell);
  return { ...document, cells: [bindingCell, ...cells] };
}

function base64(data: ArrayBuffer): string {
  const bytes = new Uint8Array(data);
  let value = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    value += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(value);
}

function executionOutputs(result: RuntimeOutput, count: number): NotebookOutput[] {
  const outputs: NotebookOutput[] = [];
  if (result.stdout) {
    outputs.push({ output_type: "stream", name: "stdout", text: result.stdout });
  }
  if (result.stderr) {
    outputs.push({ output_type: "stream", name: "stderr", text: result.stderr });
  }
  const renderRequest = result.preview != null && typeof result.preview === "object" &&
    !Array.isArray(result.preview) && "omero_analysis_render_recipe" in result.preview;
  if (result.preview != null && !renderRequest) {
    outputs.push({
      output_type: "execute_result",
      execution_count: count,
      metadata: {},
      data: { "application/json": result.preview }
    });
  }
  for (const file of result.files) {
    if (file.type === "video/mp4") {
      outputs.push({ output_type: "display_data", metadata: {}, data: {
        "application/vnd.omero-analysis.result+json": { name: file.name, resultGroupId: file.resultGroupId }
      } });
    } else if (file.type === "image/png" && !(file.resultGroupId && result.files.some(movie => movie.type === "video/mp4" && movie.resultGroupId === file.resultGroupId))) {
      outputs.push({
        output_type: "display_data",
        metadata: {},
        data: { "image/png": base64(file.data) }
      });
    }
  }
  return outputs;
}

function textValue(value: unknown): string {
  return Array.isArray(value) ? value.join("") : String(value ?? "");
}

const ANSI_ESCAPE = /\x1b\[[0-?]*[ -/]*[@-~]/g;
const DUCKDB_PROGRESS = /\b(\d{1,3})%/g;

export interface DuckDbProgressSummary {
  percent: number;
  elapsed: string | null;
}

export function duckDbProgressSummary(value: unknown): DuckDbProgressSummary | null {
  const text = textValue(value).replace(ANSI_ESCAPE, "");
  if (!/(?:seconds? remaining|elapsed)/i.test(text)) return null;
  const percentages = Array.from(text.matchAll(DUCKDB_PROGRESS), (match) => Number(match[1]))
    .filter((percent) => percent >= 0 && percent <= 100);
  if (!percentages.length) return null;
  const elapsed = text.match(/\((\d{2}:\d{2}:\d{2}(?:\.\d+)?)\s+elapsed\)/i)?.[1] || null;
  return { percent: Math.max(...percentages), elapsed };
}

export function isDuckDbTechnicalOutput(output: NotebookOutput): boolean {
  if (output.output_type === "stream") {
    const text = textValue(output.text);
    return /duckdb/i.test(text) || duckDbProgressSummary(text) != null;
  }
  if (output.output_type !== "execute_result" && output.output_type !== "display_data") {
    return false;
  }
  const value = output.data?.["application/json"];
  return Boolean(value && typeof value === "object" &&
    String((value as Record<string, unknown>).engine || "").toLowerCase() === "duckdb");
}

function NotebookMovie({ file, retrieve }: { file: WorkspaceFile; retrieve?: (file: WorkspaceFile) => Promise<WorkspaceFile> }) {
  const [ready, setReady] = useState(file), [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    setReady(file);
    if (!file.data && !file.mediaBlob && retrieve) retrieve(file).then(value => { if (!cancelled) setReady(value); })
      .catch(error => { if (!cancelled) setError(String(error)); });
    return () => { cancelled = true; };
  }, [file.id, file.data, file.mediaBlob, retrieve]);
  return error ? <p role="alert">{error}</p> : <Artifact file={ready} />;
}

export function NotebookTable({ value }: { value: unknown }) {
  if (!value || typeof value !== "object") return null;
  const preview = value as { kind?: unknown; data?: { columns?: unknown; data?: unknown } };
  if (preview.kind !== "table" || !preview.data || !Array.isArray(preview.data.columns) ||
      !Array.isArray(preview.data.data) || !preview.data.data.every(Array.isArray)) return null;
  const columns = preview.data.columns.slice(0, 200);
  const rows = preview.data.data.slice(0, 100);
  const display = (item: unknown) => item == null ? "—" : typeof item === "object" ? JSON.stringify(item) : String(item);
  return <div className="notebook-table-output">
    <div className="inspector-table-scroll"><table className="bp5-html-table bp5-html-table-striped bp5-html-table-condensed">
      <thead><tr>{columns.map((column, index) => <th key={index} scope="col">{display(column)}</th>)}</tr></thead>
      <tbody>{rows.map((row, index) => <tr key={index}>{columns.map((_, col) => <td key={col}>{display(row[col])}</td>)}</tr>)}</tbody>
    </table></div>
    {preview.data.data.length > rows.length && <p>Showing the first {rows.length} rows of this output.</p>}
    {preview.data.columns.length > columns.length && <p>Showing the first {columns.length} columns.</p>}
  </div>;
}

function OutputView({ output, files = [], retrieve }: { output: NotebookOutput; files?: WorkspaceFile[]; retrieve?: (file: WorkspaceFile) => Promise<WorkspaceFile> }) {
  if (output.output_type === "stream") {
    return <pre className={`notebook-stream ${output.name || ""}`}>{textValue(output.text)}</pre>;
  }
  if (output.output_type === "error") {
    return <div className="notebook-error" role="alert"><p>{output.ename || "Error"}: {output.evalue || "Execution failed"}</p>
      {output.traceback?.length ? <details><summary>Traceback</summary><pre>{output.traceback.join("\n")}</pre></details> : null}</div>;
  }
  const data = output.data || {};
  const reference = data["application/vnd.omero-analysis.result+json"] as { name?: string; resultGroupId?: string } | undefined;
  if (reference && typeof reference.name === "string") {
    const file = files.find(file => file.type === "video/mp4" && file.name === reference.name &&
      Boolean(reference.resultGroupId) && file.resultGroupId === reference.resultGroupId);
    return file ? <NotebookMovie file={file} retrieve={retrieve} /> : <p>Movie result is unavailable in this Workspace.</p>;
  }
  const png = data["image/png"];
  if (typeof png === "string" && /^[A-Za-z0-9+/=\s]+$/.test(png)) {
    return <img className="notebook-image" alt="Notebook PNG output"
      src={`data:image/png;base64,${png.replace(/\s/g, "")}`} />;
  }
  if ("application/json" in data) {
    const value = data["application/json"];
    const preview = value as { kind?: unknown; data?: { columns?: unknown; data?: unknown } } | null;
    if (preview?.kind === "table" && Array.isArray(preview.data?.columns) &&
        Array.isArray(preview.data?.data) && preview.data.data.every(Array.isArray)) {
      return <NotebookTable value={value} />;
    }
    return <pre className="notebook-json">{JSON.stringify(value, null, 2)}</pre>;
  }
  if ("text/plain" in data) {
    return <pre>{textValue(data["text/plain"])}</pre>;
  }
  // text/html and JavaScript MIME bundles are intentionally never rendered.
  return <p className="notebook-unsupported-output">Unsupported output hidden for safety.</p>;
}

function DuckDbTechnicalOutputs({ outputs }: { outputs: NotebookOutput[] }) {
  const progress = outputs
    .filter((output) => output.output_type === "stream")
    .map((output) => duckDbProgressSummary(output.text))
    .find((value): value is DuckDbProgressSummary => value != null);
  const structured = outputs.filter((output) =>
    output.output_type !== "stream" || duckDbProgressSummary(output.text) == null
  );
  const complete = progress?.percent === 100;

  return (
    <details className="notebook-duckdb-output">
      <summary>
        <span>DuckDB query details</span>
        <small>{progress
          ? `${complete ? "Completed" : "Progress"} · ${progress.percent}%${progress.elapsed ? ` · ${progress.elapsed}` : ""}`
          : "Technical output"}</small>
      </summary>
      <div className="notebook-duckdb-output-body">
        {progress && (
          <div className="notebook-duckdb-progress" role="status">
            <div><strong>{complete ? "Query completed" : "Query progress"}</strong><span>{progress.percent}%</span></div>
            <progress aria-label="DuckDB query progress" max={100} value={progress.percent} />
            {progress.elapsed && <small>Elapsed time {progress.elapsed}</small>}
          </div>
        )}
        {structured.map((output, index) => <OutputView output={output} key={index} />)}
      </div>
    </details>
  );
}

function NotebookOutputs({ outputs, files, retrieve }: { outputs: NotebookOutput[]; files: WorkspaceFile[]; retrieve?: (file: WorkspaceFile) => Promise<WorkspaceFile> }) {
  const duckDb = outputs.filter(isDuckDbTechnicalOutput);
  const visible = outputs.filter((output) => !isDuckDbTechnicalOutput(output));
  return (
    <>
      {duckDb.length > 0 && <DuckDbTechnicalOutputs outputs={duckDb} />}
      {visible.map((output, index) => <OutputView output={output} files={files} retrieve={retrieve} key={index} />)}
    </>
  );
}

interface Props {
  notebook: NotebookRecord | null;
  notebooks?: NotebookRecord[];
  inputs: WorkspaceFile[];
  runtime: PythonRuntime;
  runRequest: { id: string; nonce: number } | null;
  openCellRequest?: { notebookId: string; cellIds: string[]; nonce: number } | null;
  onRunRequestConsumed?: () => void;
  onRunStateChange?: (running: boolean) => void;
  workspaceActions: ReactNode;
  onBeforeRun: (record: NotebookRecord) => Promise<
    WorkspaceFile[] | { inputs: WorkspaceFile[]; notebook: NotebookRecord } | void
  >;
  onInspectSetupInput?: (file: WorkspaceFile) => Promise<CompatibilitySource["schema"]>;
  onLoadParameterChoices?: (record: NotebookRecord) => Promise<ParameterOptions>;
  onPrepareProtocol?: (record: NotebookRecord) => Promise<NotebookRecord>;
  onChange: (record: NotebookRecord) => Promise<void>;
  onFiles: (record: NotebookRecord, files: RuntimeOutput["files"]) => Promise<void>;
  resultFiles?: WorkspaceFile[];
  onRetrieveResult?: (file: WorkspaceFile) => Promise<WorkspaceFile>;
  onCancelRender?: () => void;
  onRenderRequest?: (record: NotebookRecord, preview: unknown) => Promise<RuntimeOutput["files"]>;
  onSelect?: (id: string) => void;
  onEdit?: (record: NotebookRecord) => void;
  theme?: "dark" | "light";
  compatibility?: Compatibility;
  cspNonce?: string;
}

export default function NotebookView(props: Props) {
  const {
    notebook, notebooks = notebook ? [notebook] : [], inputs, runtime, runRequest, workspaceActions,
    onRunRequestConsumed, onRunStateChange,
    onBeforeRun, onPrepareProtocol, onChange, onFiles, onRenderRequest, onSelect
  } = props;
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Notebook code never runs automatically.");
  const configurationCell=useRef<HTMLElement>(null);
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());
  const consumedOpenRequest = useRef<number | null>(null);
  useEffect(() => { setExpandedCells(new Set()); }, [notebook?.id]);
  useEffect(() => {
    const request = props.openCellRequest;
    if (request && request.notebookId === notebook?.id && consumedOpenRequest.current !== request.nonce) {
      consumedOpenRequest.current = request.nonce;
      setExpandedCells(current => new Set([...current, ...request.cellIds]));
    }
  }, [props.openCellRequest, notebook?.id]);
  const lastRunRequest = useRef(0);
  const stopRequested = useRef(false);

  const [editView, setEditView] = useState<"cells" | "source">("cells");
  const [sourceDraft, setSourceDraft] = useState("");
  const [draftError, setDraftError] = useState("");
  const kernelBinding = useRef("");
  const initializedSetup = useRef("");
  const [parameterError, setParameterError] = useState("");
  const [setupDraftDirty, setSetupDraftDirty] = useState(false);
  const executionCount = useRef(0);
  const latest = useRef(notebook);
  latest.current = notebook;
  const prerequisitesBlocked = props.compatibility?.status === "incompatible";
  const executionKey = (value: NotebookRecord | null) => JSON.stringify([value?.id, value?.parameterValues,
    value?.protocolBindings?.map(b => [b.inputId, b.fileId, b.sourceDigest]),
    value ? setupFingerprint(value.document) : "",
    inputs.filter(f => f.source !== "result" && !f.deletedAt).map(f => [f.id, f.sha256])]);
  const bindingKey = executionKey(notebook);
  const draftKey = notebook ? `omero-analysis:notebook-draft:${notebook.workspaceId}:${notebook.id}` : "";

  useEffect(() => {
    if (!notebook) return;
    const saved = localStorage.getItem(draftKey);
    setSourceDraft(saved ?? notebookToSource(notebook.document));
    setDraftError(saved ? "Recovered a local source draft. Apply it to resume editing cells." : "");
    if (saved) setEditView("source");
  }, [notebook?.id]);

  // A changed binding invalidates execution state; changing tabs does not.
  useEffect(() => {
    if (!running && kernelBinding.current && kernelBinding.current !== bindingKey) {
      setStatus("Setup, inputs or run values changed. Initialize setup or Run all before running analysis cells. The next execution starts clean.");
    }
  }, [bindingKey, runtime, running]);

  function keepDraft(value: string) {
    setSourceDraft(value);
    try { localStorage.setItem(draftKey, value); }
    catch { setDraftError("Local draft storage is full. Copy the source before leaving this page."); }
  }

  async function applySource(value = sourceDraft) {
    if (!notebook) return;
    try {
      const document = sourceToNotebook(value, notebook.document);
      parseNotebookProtocol(document);
      await onChange({ ...notebook, document, updatedAt: new Date().toISOString() });
      localStorage.removeItem(draftKey);
      setDraftError("");
      return true;
    } catch (error) {
      setDraftError(`Draft retained; last valid notebook unchanged. ${String(error)}`);
      return false;
    }
  }

  // Keep every keystroke locally; synchronize valid source after a short pause.
  useEffect(() => {
    if (editView !== "source" || !notebook || localStorage.getItem(draftKey) == null) return;
    const timer = window.setTimeout(() => { void applySource(); }, 700);
    return () => window.clearTimeout(timer);
  }, [sourceDraft, editView]);

  async function editCells(cells: NotebookCell[]) {
    if (!notebook || running) return;
    const document = { ...notebook.document, cells };
    const value = notebookToSource(document);
    keepDraft(value);
    try {
      parseNotebookProtocol(document);
      await onChange({ ...notebook, document, updatedAt: new Date().toISOString() });
      localStorage.removeItem(draftKey);
      setDraftError("");
    } catch (error) {
      setEditView("source");
      setDraftError(`Draft retained; correct the source to save. ${String(error)}`);
    }
  }

  function changeCell(index: number, changes: Partial<NotebookCell>) {
    if (!notebook) return;
    if (changes.cell_type === "code") setExpandedCells(current => new Set(current).add(notebook.document.cells[index].id || String(index)));
    void editCells(notebook.document.cells.map((cell, i) => i === index
      ? { ...cell, ...changes, metadata: { ...cell.metadata, "omero-analysis-stale": true } } : cell));
  }

  function addCell() {
    if (!notebook) return;
    const cellId = crypto.randomUUID();
    setExpandedCells(current => new Set(current).add(cellId));
    void editCells([...notebook.document.cells, {
      id: cellId, cell_type: "code", source: "", metadata: {}, outputs: [], execution_count: null
    }]);
  }

  function moveCell(index: number, direction: number) {
    if (!notebook) return;
    const cells = [...notebook.document.cells];
    const target = index + direction;
    if (target < 0 || target >= cells.length) return;
    [cells[index], cells[target]] = [cells[target], cells[index]];
    void editCells(cells);
  }

  async function runCell(index: number) {
    if (!notebook || running || draftError || prerequisitesBlocked || parameterError || setupDraftDirty) return;
    if (protocol && index > 0 && initializedSetup.current !== bindingKey) {
      setStatus("Initialize setup first, or use Run all. Earlier analysis cells will not run automatically."); return;
    }
    stopRequested.current = false;
    setRunning(true);
    onRunStateChange?.(true);
    try {
      let working = notebook;
      if (kernelBinding.current !== bindingKey) {
        await runtime.reset(progress => setStatus(progress.message));
        checkStopped();
        const preparation = await onBeforeRun(working);
        checkStopped();
        if (preparation && !Array.isArray(preparation)) working = preparation.notebook;
        await runtime.syncInputs(Array.isArray(preparation) ? preparation : preparation?.inputs || inputs);
        if (onPrepareProtocol) working = await onPrepareProtocol(working);
        checkStopped();
        kernelBinding.current = executionKey(working);
        initializedSetup.current = "";
        executionCount.current = 0;
      }
      working = beginRun(working, "cell", index);
      await onChange(working);
      setStatus(`Running cell ${index + 1}…`);
      let completed = await executeCell(index, ++executionCount.current, working);
      if (completed) {
        completed = {...completed, protocolRuns: completed.protocolRuns?.map((run, i, runs) => i === runs.length - 1 && run.status === "running"
          ? {...run, status: "success" as const, completedAt: new Date().toISOString()} : run)};
        await onChange(completed);
      }
      if (completed) {
        kernelBinding.current = executionKey(completed);
        if (index === 0 && parseNotebookProtocol(completed.document)) initializedSetup.current = kernelBinding.current;
        setStatus(index === 0 && protocol ? "Setup initialized. Run an analysis cell or Run all." : `Cell ${index + 1} completed. Kernel variables retained.`);
      }
    } catch (error) {
      setStatus(stopRequested.current ? "Notebook stopped." : notebookErrorSummary(error));
    } finally {
      setRunning(false);
      onRunStateChange?.(false);
    }
  }

  function checkStopped() {
    if (stopRequested.current) throw new Error("Notebook stopped");
  }

  async function executeCell(
    index: number,
    count: number,
    base: NotebookRecord | null = notebook
  ): Promise<NotebookRecord | null> {
    if (!base) return null;
    const cell = base.document.cells[index];
    if (cell.cell_type !== "code") return base;
    try {
      const result = await runtime.runNotebookCell(sourceText(cell));
      checkStopped();
      const rendered = await onRenderRequest?.(base, result.preview) || [];
      checkStopped();
      const generated = [...result.files, ...rendered].map(file => file.type === "video/mp4" ? { ...file, resultGroupId: file.resultGroupId || crypto.randomUUID() } : file);
      const combined = { ...result, files: generated };
      const changed: NotebookRecord = {
        ...base,
        document: {
          ...base.document,
          cells: base.document.cells.map((candidate, cellIndex) =>
            cellIndex === index
              ? {
                  ...candidate,
                  metadata: { ...candidate.metadata, "omero-analysis-stale": false },
                  execution_count: count,
                  outputs: executionOutputs(combined, count)
                }
              : candidate
          )
        },
        protocolRuns: base.protocolRuns?.map((run, runIndex, runs) =>
          runIndex === runs.length - 1 && run.status === "running"
            ? {
                ...run,
                outputs: [
                  ...run.outputs,
                  ...generated.map((file) => ({ name: file.name, size: file.data.byteLength }))
                ]
              }
            : run
        ),
        updatedAt: new Date().toISOString()
      };
      await onFiles(changed, generated);
      await onChange(changed);
      return changed;
    } catch (error) {
      const message = String(error instanceof Error ? error.message : error);
      const failed: NotebookRecord = {
        ...base,
        document: {
          ...base.document,
          cells: base.document.cells.map((candidate, cellIndex) =>
            cellIndex === index
              ? { ...candidate, execution_count: count, metadata: { ...candidate.metadata, "omero-analysis-stale": false }, outputs: [notebookError(error)] }
              : candidate
          )
        },
        protocolRuns: base.protocolRuns?.map((run, runIndex, runs) =>
          runIndex === runs.length - 1 && run.status === "running"
            ? { ...run, status: "failed", error: message, completedAt: new Date().toISOString() }
            : run
        ),
        updatedAt: new Date().toISOString()
      };
      await onChange(failed);
      setStatus(stopRequested.current ? "Notebook stopped." : `Stopped at cell ${index + 1}: ${notebookErrorSummary(error)}. See the error below.`);
      return null;
    }
  }

  async function attachInputs(
    record: NotebookRecord,
    startRuntime = true,
    preparedInputs?: WorkspaceFile[]
  ): Promise<NotebookRecord> {
    if (startRuntime && !running) stopRequested.current = false;
    setStatus("Attaching current Workspace input data…");
    const preparation = startRuntime ? await onBeforeRun(record) : undefined;
    checkStopped();
    const preparedRecord = preparation && !Array.isArray(preparation)
      ? preparation.notebook
      : record;
    const currentInputs = startRuntime
      ? Array.isArray(preparation) ? preparation : preparation?.inputs || inputs
      : preparedInputs || inputs;
    await runtime.syncInputs(currentInputs);
    checkStopped();
    const readyInputs = currentInputs.filter(
      (file) => file.source !== "result" && file.state === "ready" &&
        !file.deletedAt && Boolean(file.data)
    );
    const protocol = parseNotebookProtocol(preparedRecord.document);
    const changed = {
      ...preparedRecord,
      document: protocol
        ? preparedRecord.document
        : reattachNotebookDocument(preparedRecord.document, readyInputs),
      selectedDataFileIds: readyInputs.map((file) => file.id),
      updatedAt: new Date().toISOString()
    };
    await onChange(changed);
    setStatus(`Attached ${changed.selectedDataFileIds.length} input file(s).`);
    return changed;
  }

  function beginRun(record: NotebookRecord, mode: "all" | "cell", cellIndex?: number): NotebookRecord {
    const contract = parseNotebookProtocol(record.document);
    return {...record, protocolRuns: [...(record.protocolRuns || []), {
      id: crypto.randomUUID(), mode, cellIndex,
      startedAt: new Date().toISOString(),
      parameters: {...(contract ? parameterDefaults(contract) : {}), ...(record.parameterValues || {})},
      sources: (record.protocolBindings || []).map(binding => ({inputId: binding.inputId, name: binding.name,
        schemaDigest: binding.schemaDigest, sourceDigest: binding.sourceDigest})),
      outputs: [], status: "running"
    }]};
  }

  async function runAll() {
    if (!notebook || running || draftError || prerequisitesBlocked || parameterError || setupDraftDirty) return;
    stopRequested.current = false;
    setRunning(true);
    onRunStateChange?.(true);
    try {
      let working: NotebookRecord | null = {
        ...notebook,
        document: clearNotebookInlineState(notebook.document),
        updatedAt: new Date().toISOString()
      };
      await onChange(working);
      setStatus("Starting browser Python (the first run can take a minute)...");
      // Reset first: onBeforeRun may materialize remote-query CSV bindings in
      // /remote-query. Resetting afterward would delete those files before the
      // first notebook cell can consume them.
      await runtime.reset(progress => setStatus(progress.message));
      checkStopped();
      setStatus("Loading source data and checking query access...");
      const preparation = await onBeforeRun(working);
      checkStopped();
      if (preparation && !Array.isArray(preparation)) working = preparation.notebook;
      const preparedInputs = Array.isArray(preparation)
        ? preparation
        : preparation?.inputs || inputs;
      working = await attachInputs(working, false, preparedInputs);
      setStatus("Binding notebook inputs and preparing queries...");
      if (onPrepareProtocol) working = await onPrepareProtocol(working);
      checkStopped();
      working = beginRun(working, "all");
      await onChange(working);
      kernelBinding.current = executionKey(working);
      initializedSetup.current = "";
      let count = 1;
      for (let index = 0; working && index < working.document.cells.length; index += 1) {
        checkStopped();
        if (working.document.cells[index].cell_type !== "code") continue;
        setStatus(`Running cell ${index + 1}…`);
        working = await executeCell(index, count++, working);
        if (working && index === 0 && parseNotebookProtocol(working.document)) initializedSetup.current = executionKey(working);
        if (!working) break;
      }
      executionCount.current = count - 1;
      if (working && working.protocolRuns?.at(-1)?.status === "running") {
        working = {
          ...working,
          protocolRuns: working.protocolRuns.map((run, index, runs) =>
            index === runs.length - 1
              ? { ...run, status: "success" as const, completedAt: new Date().toISOString() }
              : run
          ),
          updatedAt: new Date().toISOString()
        };
        await onChange(working);
      }
      setStatus((value) => stopRequested.current ? "Notebook stopped." : value.startsWith("Stopped") ? value : "Notebook run completed.");
    } catch (error) {
      setStatus(stopRequested.current ? "Notebook stopped." : `Notebook could not start: ${notebookErrorSummary(error)}`);
    } finally {
      setRunning(false);
      onRunStateChange?.(false);
    }
  }

  async function applySetup(value: NotebookRecord, expected?: string) {
    if (running || !latest.current || value.id !== latest.current.id) throw new Error("Notebook changed; reopen setup.");
    if (expected && setupFingerprint(latest.current.document) !== expected) throw new Error("Python setup changed. Reload setup before applying this draft.");
    await onChange(value);
    initializedSetup.current = "";
    setStatus("Setup saved. Initialize setup or Run all before running analysis cells.");
  }
  async function bindSetupInput(inputId: string, fileId: string) {
    if (!notebook || running) return;
    const input = parseNotebookProtocol(notebook.document)?.inputs.find(i => i.id === inputId);
    const file = inputs.find(f => f.id === fileId);
    const bindings = (notebook.protocolBindings || []).filter(b => b.inputId !== inputId);
    if (input && file) bindings.push({inputId,fileId:file.id,name:file.name,kind:input.kind,
      mode:input.kind === "query" && (file.dataQueryMode === "remote" || !file.data) ? "remote" : "local",
      path:`/input/${file.name}`,annotationId:file.annotationId,originalFileId:file.fileId,sourceDigest:file.sha256});
    await onChange(markNotebookStale({...notebook,protocolBindings:bindings,parameterChoices:{},parameterChoiceLabels:{}}));
    setStatus("Input binding saved. Initialize setup or Run all before running analysis cells.");
  }
  let protocol: NotebookProtocolContract | null = null;
  let protocolError = "";
  try {
    protocol = notebook ? parseNotebookProtocol(notebook.document) : null;
  } catch (error) {
    protocol = null; protocolError = String(error);
  }

  async function stopReset() {
    stopRequested.current = true;
    props.onCancelRender?.();
    runtime.stop();
    kernelBinding.current = "";
    setStatus("Stopping Notebook…");
  }

  async function clearOutputs() {
    if (!notebook) return;
    const changed = {
      ...notebook,
      document: clearNotebookInlineState(notebook.document),
      updatedAt: new Date().toISOString()
    };
    await onChange(changed);
    setStatus("Notebook outputs cleared.");
  }

  useEffect(() => {
    if (
      runRequest &&
      notebook?.id === runRequest.id &&
      runRequest.nonce !== lastRunRequest.current
    ) {
      lastRunRequest.current = runRequest.nonce;
      onRunRequestConsumed?.();
      void runAll();
    }
  }, [runRequest, notebook?.id, onRunRequestConsumed]);

  return (
    <section className="notebook-tab" aria-label="Notebook">
      <div className="notebook-toolbar">
        <select className="notebook-selector" aria-label="Notebook"
          title={notebook?.name || "No notebook selected"}
          value={notebook?.id || ""} disabled={!notebooks.length || running}
          onChange={(event) => onSelect?.(event.target.value)}>
          {!notebooks.length && <option value="">No notebook selected</option>}
          {notebooks.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <div className="notebook-toolbar-actions">
          <Button disabled={!notebook || running || Boolean(draftError) || prerequisitesBlocked || Boolean(parameterError) || Boolean(protocolError) || setupDraftDirty} onClick={() => void runAll()}><ActionIcon name="run" />Run all</Button>
          <Button disabled={!notebook || !running} onClick={() => void stopReset()}><ActionIcon name="stop" />Stop</Button>
          <Button disabled={!notebook || running} onClick={() => void clearOutputs()}><ActionIcon name="clear" />Clear output</Button>
          <Button disabled={!notebook || running}
            onClick={() => notebook && void attachInputs(notebook)}><ActionIcon name="attach" />Reattach input data</Button>
          <Button disabled={!notebook || running} onClick={() => {
            runtime.stop(); kernelBinding.current = ""; executionCount.current = 0;
            setStatus("Kernel restarted. Run a cell or Run all to begin.");
          }}>Restart kernel</Button>
          {editView === "source" && <Button disabled={running} onClick={async () => {
            if (editView === "source" && !await applySource()) return;
            setEditView("cells");
          }}>Return to cells</Button>}
          {workspaceActions}
        </div>
      </div>
      <p className="notebook-status" role="status">{status}</p>
      {props.compatibility && <p role="status"><strong>{compatibilityLabel[props.compatibility.status]}</strong> — {props.compatibility.reasons.join("; ")}</p>}
      {draftError && <p role="alert">{draftError}</p>}
      <div className="notebook-content">
        {notebook && <details><summary>Current input bindings</summary><pre>{JSON.stringify(
          notebook.protocolBindings?.map(b => ({ input: b.inputId, name: b.name, example: `await ctx.query(${JSON.stringify(b.inputId)}, "SELECT 1 AS example")` }))
          || inputs.filter(f => f.source !== "result").map(f => ({ name: f.name, path: `/input/${f.name}` })), null, 2
        )}</pre></details>}
        {notebook?.portabilityWarning && (
          <p className="notebook-portability-warning" role="status">{notebook.portabilityWarning}</p>
        )}
        {notebook && <NotebookSetup key={notebook.id} record={notebook} inputs={inputs}
          disabled={running || Boolean(draftError)} onApply={applySetup} onDraftState={setSetupDraftDirty} onBind={bindSetupInput}
          onInspect={props.onInspectSetupInput} onPython={() => {
            setExpandedCells(current => new Set(current).add(notebook.document.cells[0]?.id || "0"));
            window.requestAnimationFrame(()=>{configurationCell.current?.scrollIntoView?.({block:"start",behavior:"smooth"});configurationCell.current?.querySelector<HTMLElement>("[contenteditable=true],textarea")?.focus();});
          }} />}
        {notebook && protocol && <RunParameters key={`${notebook.id}:parameters`} record={notebook} contract={protocol}
          disabled={running || Boolean(draftError)} onChange={onChange} onValidity={setParameterError} onLoadChoices={props.onLoadParameterChoices} />}
        {protocol && <Button disabled={running || Boolean(draftError) || prerequisitesBlocked || Boolean(parameterError) || setupDraftDirty}
          onClick={() => void runCell(0)}>Initialize setup</Button>}
        {protocolError && <p role="alert">{protocolError}</p>}
        {!notebook ? (
          <div className="notebook-empty">Choose a Notebook from the Workspace explorer.</div>
        ) : editView === "source" ? (
          <section className="notebook-source-editor" aria-label="Notebook source">
            <p>Edit Python and commented Markdown below. Keep the metadata header and cell separators.</p>
            <CodeEditor label="Complete notebook source" value={sourceDraft} language="python" theme={props.theme || "light"}
              cspNonce={props.cspNonce || ""} readOnly={running} onChange={keepDraft} onSave={() => { void applySource(); }} />
          </section>
        ) : (
          <div className="notebook-cells">
          <Button disabled={running} onClick={addCell}>Add cell</Button>
          {notebook.document.cells.map((cell, index) => (
            <article ref={index === 0 ? configurationCell : undefined} className={`notebook-cell ${cell.cell_type}`} key={cell.id || index}>
              <div className="notebook-cell-gutter">
                {cell.cell_type === "code" ? `[${cell.execution_count ?? " "}]` : ""}
              </div>
              <div className="notebook-cell-body">
                <div className="notebook-cell-actions">
                  {cell.cell_type === "code" && <Button className="cell-collapse-button" aria-label={`${expandedCells.has(cell.id || String(index)) ? "Collapse" : "Expand"} Python cell ${index + 1}`}
                    aria-expanded={expandedCells.has(cell.id || String(index))} icon={expandedCells.has(cell.id || String(index)) ? "chevron-down" : "chevron-right"}
                    onClick={() => setExpandedCells(current => { const next = new Set(current); const key = cell.id || String(index); if (next.has(key)) next.delete(key); else next.add(key); return next; })}>
                    Python cell {index + 1}
                  </Button>}

                  <select aria-label={`Cell ${index + 1} type`} value={cell.cell_type === "raw" ? "markdown" : cell.cell_type} disabled={running}
                    onChange={e => changeCell(index, { cell_type: e.target.value as NotebookCell["cell_type"] })}>
                    <option value="code">Python</option><option value="markdown">Markdown</option>
                  </select>
                  {cell.cell_type === "code" && <Button disabled={running || Boolean(draftError) || prerequisitesBlocked || Boolean(parameterError) || Boolean(protocolError) || setupDraftDirty}
                    onClick={() => void runCell(index)}>Run cell {index + 1}</Button>}
                  <Button disabled={running || index === 0} onClick={() => moveCell(index, -1)}>Move up</Button>
                  <Button disabled={running || index === notebook.document.cells.length - 1} onClick={() => moveCell(index, 1)}>Move down</Button>
                  <Button disabled={running} onClick={() => void editCells(notebook.document.cells.filter((_, i) => i !== index))}>Delete cell</Button>
                </div>
                <div className="notebook-cell-source" hidden={cell.cell_type === "code" && !expandedCells.has(cell.id || String(index))}>
                <CodeEditor label={`Cell ${index + 1} source`} value={sourceText(cell)} language={cell.cell_type === "code" ? "python" : cell.cell_type === "markdown" ? "markdown" : "text"}
                  theme={props.theme || "light"} cspNonce={props.cspNonce || ""} readOnly={running}
                  onChange={source => changeCell(index, { source })}
                  onSave={() => {}} onRun={() => { if (cell.cell_type === "code") void runCell(index); }} />
                </div>
                {cell.cell_type === "markdown" && <MarkdownPreview markdown={sourceText(cell)} />}
                {cell.metadata["omero-analysis-stale"] && cell.outputs?.length
                  ? <p role="status">Output is stale: this cell has changed since it ran.</p> : null}
                {cell.cell_type === "code" && (
                  <div className="notebook-outputs">
                    <NotebookOutputs outputs={cell.outputs || []} files={props.resultFiles || []} retrieve={props.onRetrieveResult} />
                  </div>
                )}
              </div>
            </article>
          ))}
          </div>
        )}
      </div>
    </section>
  );
}
