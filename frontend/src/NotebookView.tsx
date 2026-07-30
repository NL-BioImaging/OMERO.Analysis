import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { PythonRuntime } from "./runtime";
import { MarkdownPreview, PythonPreview } from "./components/WorkspacePanels";
import { ActionIcon } from "./components/ActionIcon";
import { Button } from "./components/BlueprintControls";
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
  if (result.preview != null) {
    outputs.push({
      output_type: "execute_result",
      execution_count: count,
      metadata: {},
      data: { "application/json": result.preview }
    });
  }
  for (const file of result.files) {
    if (file.type === "image/png") {
      outputs.push({
        output_type: "display_data",
        metadata: {},
        data: { "image/png": base64(file.data) }
      });
    }
  }
  return outputs;
}

function errorOutput(error: unknown): NotebookOutput {
  const message = String(error instanceof Error ? error.message : error);
  return {
    output_type: "error",
    ename: error instanceof Error ? error.name : "Error",
    evalue: message,
    traceback: message.split(/\r?\n/)
  };
}

function textValue(value: unknown): string {
  return Array.isArray(value) ? value.join("") : String(value ?? "");
}

function OutputView({ output }: { output: NotebookOutput }) {
  if (output.output_type === "stream") {
    return <pre className={`notebook-stream ${output.name || ""}`}>{textValue(output.text)}</pre>;
  }
  if (output.output_type === "error") {
    return <pre className="notebook-error">{(output.traceback || [output.evalue || "Error"]).join("\n")}</pre>;
  }
  const data = output.data || {};
  const png = data["image/png"];
  if (typeof png === "string" && /^[A-Za-z0-9+/=\s]+$/.test(png)) {
    return <img className="notebook-image" alt="Notebook PNG output"
      src={`data:image/png;base64,${png.replace(/\s/g, "")}`} />;
  }
  if ("application/json" in data) {
    return <pre className="notebook-json">{JSON.stringify(data["application/json"], null, 2)}</pre>;
  }
  if ("text/plain" in data) {
    return <pre>{textValue(data["text/plain"])}</pre>;
  }
  // text/html and JavaScript MIME bundles are intentionally never rendered.
  return <p className="notebook-unsupported-output">Unsupported output hidden for safety.</p>;
}

interface Props {
  notebook: NotebookRecord | null;
  inputs: WorkspaceFile[];
  runtime: PythonRuntime;
  runRequest: { id: string; nonce: number } | null;
  workspaceActions: ReactNode;
  onChange: (record: NotebookRecord) => Promise<void>;
  onFiles: (record: NotebookRecord, files: RuntimeOutput["files"]) => Promise<void>;
}

export default function NotebookView(props: Props) {
  const {
    notebook, inputs, runtime, runRequest, workspaceActions,
    onChange, onFiles
  } = props;
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Notebook code never runs automatically.");
  const lastRunRequest = useRef(0);

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
      const changed: NotebookRecord = {
        ...base,
        document: {
          ...base.document,
          cells: base.document.cells.map((candidate, cellIndex) =>
            cellIndex === index
              ? {
                  ...candidate,
                  execution_count: count,
                  outputs: executionOutputs(result, count)
                }
              : candidate
          )
        },
        updatedAt: new Date().toISOString()
      };
      await onFiles(changed, result.files);
      await onChange(changed);
      return changed;
    } catch (error) {
      const failed: NotebookRecord = {
        ...base,
        document: {
          ...base.document,
          cells: base.document.cells.map((candidate, cellIndex) =>
            cellIndex === index
              ? { ...candidate, execution_count: count, outputs: [errorOutput(error)] }
              : candidate
          )
        },
        updatedAt: new Date().toISOString()
      };
      await onChange(failed);
      setStatus(`Stopped at cell ${index + 1}: ${String(error)}`);
      return null;
    }
  }

  async function attachInputs(record: NotebookRecord): Promise<NotebookRecord> {
    setStatus("Attaching current Workspace input data…");
    await runtime.syncInputs(inputs);
    const readyInputs = inputs.filter(
      (file) => file.source !== "result" && file.state === "ready" &&
        !file.deletedAt && Boolean(file.data)
    );
    const changed = {
      ...record,
      document: reattachNotebookDocument(record.document, readyInputs),
      selectedDataFileIds: readyInputs.map((file) => file.id),
      updatedAt: new Date().toISOString()
    };
    await onChange(changed);
    setStatus(`Attached ${changed.selectedDataFileIds.length} input file(s).`);
    return changed;
  }

  async function runAll() {
    if (!notebook || running) return;
    setRunning(true);
    setStatus("Preparing the notebook and current input data…");
    await runtime.reset();
    let working: NotebookRecord | null = await attachInputs(notebook);
    let count = 1;
    for (let index = 0; working && index < working.document.cells.length; index += 1) {
      if (working.document.cells[index].cell_type !== "code") continue;
      setStatus(`Running cell ${index + 1}…`);
      working = await executeCell(index, count++, working);
      if (!working) break;
    }
    setRunning(false);
    setStatus((value) => value.startsWith("Stopped") ? value : "Notebook run completed.");
  }

  async function stopReset() {
    runtime.stop();
    setRunning(false);
    setStatus("Execution stopped; restoring the isolated Python kernel…");
    await runtime.start(inputs);
    setStatus("Execution stopped. The kernel is ready.");
  }

  async function clearOutputs() {
    if (!notebook) return;
    const changed = {
      ...notebook,
      document: {
        ...notebook.document,
        cells: notebook.document.cells.map((cell) =>
          cell.cell_type === "code"
            ? { ...cell, execution_count: null, outputs: [] }
            : cell
        )
      },
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
      void runAll();
    }
  }, [runRequest, notebook?.id]);

  return (
    <section className="notebook-tab" aria-label="Notebook">
      <div className="notebook-toolbar">
        <strong>{notebook?.name || "No notebook selected"}</strong>
        <Button disabled={!notebook || running} onClick={() => void runAll()}><ActionIcon name="run" />Run</Button>
        <Button disabled={!notebook || !running} onClick={() => void stopReset()}><ActionIcon name="stop" />Stop</Button>
        <Button disabled={!notebook || running} onClick={() => void clearOutputs()}><ActionIcon name="clear" />Clear output</Button>
        <Button disabled={!notebook || running}
          onClick={() => notebook && void attachInputs(notebook)}><ActionIcon name="attach" />Reattach input data</Button>
        {workspaceActions}
      </div>
      <p className="notebook-status" role="status">{status}</p>
      {!notebook ? (
        <div className="notebook-empty">Choose a Notebook from the Workspace explorer.</div>
      ) : (
        <div className="notebook-cells">
          {notebook.document.cells.map((cell, index) => (
            <article className={`notebook-cell ${cell.cell_type}`} key={cell.id || index}>
              <div className="notebook-cell-gutter">
                {cell.cell_type === "code" ? `[${cell.execution_count ?? " "}]` : ""}
              </div>
              <div className="notebook-cell-body">
                {cell.cell_type === "markdown" ? (
                  <div className="notebook-markdown">
                    <MarkdownPreview markdown={sourceText(cell)} />
                  </div>
                ) : cell.cell_type === "code" ? (
                  <div className="notebook-source">
                    <PythonPreview code={sourceText(cell)} />
                  </div>
                ) : (
                  <pre className="notebook-source">{sourceText(cell)}</pre>
                )}
                {cell.cell_type === "code" && (
                  <div className="notebook-outputs">
                    {(cell.outputs || []).map((output, outputIndex) =>
                      <OutputView output={output} key={outputIndex} />)}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
