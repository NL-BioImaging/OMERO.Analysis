import type {
  ExecutionRecord,
  MethodRecord,
  NotebookCell,
  NotebookDocument,
  PipelineRecord,
  WorkspaceFile
} from "./types";

export const INPUT_BINDINGS_KIND = "input-bindings";

export interface InputBinding {
  from: string;
  to: string;
  source: "workspace" | "pipeline-output";
}

interface BindingCandidate {
  name: string;
  source: InputBinding["source"];
}

export class ArtifactBindingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArtifactBindingError";
  }
}

const inputPattern = /(["'])\/input\/(?:selected_measurements\/)?([^"']+)\1/g;
const outputPattern = /["']\/output\/([^"']+)["']/g;

function extension(name: string): string {
  return name.toLowerCase().match(/(\.[^.\\/]+)$/)?.[1] || "";
}

function uniqueCandidates(candidates: BindingCandidate[]): BindingCandidate[] {
  const values = new Map<string, BindingCandidate>();
  for (const candidate of candidates) {
    if (!values.has(candidate.name)) values.set(candidate.name, candidate);
  }
  return Array.from(values.values());
}

function resolveCandidate(
  referencedName: string,
  candidates: BindingCandidate[],
  preferredName?: string
): BindingCandidate {
  const basename = referencedName.replace(/\\/g, "/").split("/").at(-1) || referencedName;
  const available = uniqueCandidates(candidates);
  if (preferredName) {
    const preferred = available.find((candidate) => candidate.name === preferredName);
    if (!preferred) {
      throw new ArtifactBindingError(
        `Input ${basename} is bound to ${preferredName}, but that file is not available.`
      );
    }
    return preferred;
  }
  const exact = available.find((candidate) => candidate.name === basename);
  if (exact) return exact;
  const suffix = extension(basename);
  const compatible = suffix
    ? available.filter((candidate) => extension(candidate.name) === suffix)
    : [];
  if (compatible.length === 1) return compatible[0];
  if (!compatible.length) {
    throw new ArtifactBindingError(
      `Input ${basename} has no ready compatible Workspace file.`
    );
  }
  throw new ArtifactBindingError(
    `Input ${basename} is ambiguous. Compatible files: ${compatible.map((item) => item.name).join(", ")}.`
  );
}

export function readyWorkspaceInputs(files: WorkspaceFile[]): WorkspaceFile[] {
  return files.filter((file) =>
    file.source !== "result" && file.role !== "chat-attachment" &&
    file.state === "ready" && !file.deletedAt && Boolean(file.data)
  );
}

function workspaceCandidates(files: WorkspaceFile[]): BindingCandidate[] {
  return readyWorkspaceInputs(files).map((file) => ({
    name: file.name,
    source: "workspace"
  }));
}

export function extractInputNames(code: string): string[] {
  return Array.from(new Set(
    Array.from(code.matchAll(inputPattern), (match) => match[2])
  ));
}

export function extractOutputNames(code: string): string[] {
  return Array.from(new Set(
    Array.from(code.matchAll(outputPattern), (match) => match[1])
  ));
}

function bindCodeWithCandidates(
  code: string,
  candidates: BindingCandidate[],
  preferred: Record<string, string> = {}
): { code: string; bindings: InputBinding[] } {
  const bindings = new Map<string, InputBinding>();
  const rebound = code.replace(
    inputPattern,
    (_value, quote: string, referencedName: string) => {
      const candidate = resolveCandidate(
        referencedName,
        candidates,
        preferred[referencedName]
      );
      bindings.set(referencedName, {
        from: referencedName,
        to: candidate.name,
        source: candidate.source
      });
      return `${quote}/input/${candidate.name}${quote}`;
    }
  );
  return { code: rebound, bindings: Array.from(bindings.values()) };
}

export function bindPythonInputsStrict(
  code: string,
  files: WorkspaceFile[],
  preferred: Record<string, string> = {}
): { code: string; bindings: InputBinding[] } {
  return bindCodeWithCandidates(code, workspaceCandidates(files), preferred);
}

function sourceText(cell: NotebookCell): string {
  return Array.isArray(cell.source) ? cell.source.join("") : cell.source;
}

function bindingCell(files: WorkspaceFile[]): NotebookCell {
  const inputs = readyWorkspaceInputs(files);
  return {
    id: "omero-analysis-input-bindings",
    cell_type: "code",
    source: [
      "# OMERO.Analysis input bindings — maintained by Reattach input data",
      "from pathlib import Path as _OAPath",
      'OA_INPUT_DIR = _OAPath("/input")',
      "OA_ATTACHED_INPUTS = {",
      ...inputs.map((file) =>
        `    ${JSON.stringify(file.name)}: OA_INPUT_DIR / ${JSON.stringify(file.name)},`
      ),
      "}",
      ""
    ].join("\n"),
    metadata: { omero_analysis: { kind: INPUT_BINDINGS_KIND } },
    execution_count: null,
    outputs: []
  };
}

export function isInputBindingsCell(cell: NotebookCell): boolean {
  return (cell.metadata?.omero_analysis as { kind?: string } | undefined)?.kind ===
    INPUT_BINDINGS_KIND;
}

export function bindNotebookInputsStrict(
  document: NotebookDocument,
  files: WorkspaceFile[]
): { document: NotebookDocument; bindings: InputBinding[] } {
  const candidates = workspaceCandidates(files);
  const bindings: InputBinding[] = [];
  const cells = document.cells
    .filter((cell) => !isInputBindingsCell(cell))
    .map((cell) => {
      if (cell.cell_type !== "code") return { ...cell };
      const rebound = bindCodeWithCandidates(sourceText(cell), candidates);
      bindings.push(...rebound.bindings);
      return { ...cell, source: rebound.code };
    });
  return {
    document: { ...document, cells: [bindingCell(files), ...cells] },
    bindings
  };
}

export function bindPipelineInputsStrict(
  pipeline: PipelineRecord,
  methods: MethodRecord[],
  files: WorkspaceFile[]
): { pipeline: PipelineRecord; bindings: InputBinding[] } {
  const candidates = workspaceCandidates(files);
  const allBindings: InputBinding[] = [];
  const steps = pipeline.steps.map((step) => {
    const method = methods.find((item) => item.id === step.methodId && !item.deletedAt);
    const version = method?.versions.find((item) => item.version === step.methodVersion);
    if (!method || !version) {
      throw new ArtifactBindingError(`Pipeline step ${step.name} refers to an unavailable Method version.`);
    }
    const rebound = bindCodeWithCandidates(version.code, candidates, step.inputBindings);
    allBindings.push(...rebound.bindings);
    for (const name of extractOutputNames(version.code)) {
      candidates.push({ name, source: "pipeline-output" });
    }
    return {
      ...step,
      inputBindings: Object.fromEntries(rebound.bindings.map((binding) => [binding.from, binding.to]))
    };
  });
  return { pipeline: { ...pipeline, steps }, bindings: allBindings };
}

export function bindPipelineStepCodeStrict(
  code: string,
  files: WorkspaceFile[],
  inputBindings: Record<string, string>
): { code: string; bindings: InputBinding[] } {
  return bindCodeWithCandidates(code, [
    ...files
      .filter((file) => file.state === "ready" && !file.deletedAt)
      .map((file) => ({
        name: file.name,
        source: file.source === "result" ? "pipeline-output" as const : "workspace" as const
      }))
  ], inputBindings);
}

/**
 * Add only the files produced by the executions for the completed Pipeline
 * step. Output ownership can point at an earlier run when an execution was
 * reused, so execution output IDs are the durable source of truth here.
 */
export function extendPipelineInputs(
  inputs: WorkspaceFile[],
  stepExecutions: ExecutionRecord[],
  files: WorkspaceFile[]
): WorkspaceFile[] {
  const outputIds = new Set(stepExecutions.flatMap((execution) => execution.outputFileIds));
  const includedIds = new Set(inputs.map((file) => file.id));
  const produced = files.filter((file) =>
    outputIds.has(file.id) && file.source === "result" && file.state === "ready" &&
    !file.deletedAt && !includedIds.has(file.id)
  );
  return [...inputs, ...produced];
}

export function clearNotebookOutputs(document: NotebookDocument): NotebookDocument {
  return {
    ...document,
    cells: document.cells.map((cell) => cell.cell_type === "code"
      ? { ...cell, execution_count: null, outputs: [] }
      : cell)
  };
}
