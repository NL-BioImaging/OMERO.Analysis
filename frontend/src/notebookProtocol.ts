import type { NotebookCell, NotebookDocument, WorkspaceFile } from "./types";

export const NOTEBOOK_PROTOCOL_SCHEMA = "nl.bioimaging.omero-analysis-notebook.v1" as const;
export const NOTEBOOK_CONFIG_TAG = "omero-analysis-config";
export const APPROVED_NOTEBOOK_PACKAGES = new Set([
  "duckdb", "matplotlib", "numpy", "pandas", "pyarrow", "pypdf",
  "python-calamine", "scikit-image", "scipy", "seaborn", "xlrd"
]);

export type NotebookQueryFormat = "duckdb" | "sqlite" | "sqlite3" | "csv";
export type NotebookParameterType = "boolean" | "integer" | "number" | "string" | "choice";

export interface NotebookQueryInput {
  id: string;
  kind: "query";
  path: string;
  formats: NotebookQueryFormat[];
  required: boolean;
  schema?: { tables?: Array<{ name: string; columns?: Array<{ name: string; type?: string }> }> };
}

export interface NotebookFileInput {
  id: string;
  kind: "file";
  path: string;
  extensions: string[];
  required: boolean;
}

export type NotebookProtocolInput = NotebookQueryInput | NotebookFileInput;

export interface NotebookChoicesQuery {
  source: string;
  sql: string;
  limit: number;
  value_column?: string;
  label_column?: string;
}

export interface NotebookParameter {
  name: string;
  type: NotebookParameterType;
  default?: boolean | number | string;
  label?: string;
  help?: string;
  minimum?: number;
  maximum?: number;
  step?: number;
  choices?: Array<boolean | number | string>;
  choices_query?: NotebookChoicesQuery;
}

export interface NotebookProtocolContract {
  schema: typeof NOTEBOOK_PROTOCOL_SCHEMA;
  inputs: NotebookProtocolInput[];
  results: { path: string };
  parameters: NotebookParameter[];
  requirements: string[];
}

export interface NotebookProtocolBinding {
  inputId: string;
  fileId: string;
  name: string;
  kind: "query" | "file";
  mode: "local" | "remote";
  path: string;
  format?: NotebookQueryFormat;
  annotationId?: number;
  originalFileId?: number;
  schemaDigest?: string;
  sourceDigest?: string;
}

export interface NotebookRunProvenance {
  startedAt: string;
  completedAt?: string;
  parameters: Record<string, boolean | number | string | null>;
  sources: Array<{
    inputId: string;
    name: string;
    schemaDigest?: string;
    sourceDigest?: string;
  }>;
  outputs: Array<{ name: string; size: number; sha256?: string }>;
  status: "running" | "success" | "failed";
  error?: string;
}

function sourceText(cell: NotebookCell): string {
  return Array.isArray(cell.source) ? cell.source.join("") : cell.source;
}

function portablePath(value: unknown, prefix: "input" | "results", field: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} must be a relative path`);
  const normalized = value.replace(/\\/g, "/");
  const parts = normalized.split("/");
  if (normalized.startsWith("/") || parts[0] !== prefix || parts.includes("..")) {
    throw new Error(`${field} must stay inside ${prefix}/`);
  }
  return normalized;
}

function selectOnly(sql: unknown): string {
  if (typeof sql !== "string" || !sql.trim()) throw new Error("choices_query.sql is required");
  const clean = sql.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, " ").trim();
  if (!/^(select|with)\b/i.test(clean) || clean.replace(/;\s*$/, "").includes(";")) {
    throw new Error("choices_query must contain one SELECT or WITH … SELECT statement");
  }
  if (/\b(attach|copy|pragma|install|load|create|alter|drop|insert|update|delete|merge|call|set|reset)\b/i.test(clean)) {
    throw new Error("choices_query contains a prohibited operation");
  }
  if (/\b(read_csv|read_csv_auto|read_parquet|read_json|sqlite_scan|postgres_scan|httpfs|delta_scan|iceberg_scan|shell|system)\s*\(/i.test(clean)) {
    throw new Error("choices_query contains a prohibited file or external function");
  }
  return sql;
}

function literalConfiguration(source: string): unknown {
  const call = source.match(/\b(?:oan\.)?configure\s*\(\s*(?:[rubfRUBF]*)('''|""")([\s\S]*?)\1\s*\)/);
  if (!call) throw new Error("Configuration cell must call oan.configure() with a triple-quoted literal JSON string");
  try {
    return JSON.parse(call[2]);
  } catch (error) {
    throw new Error(`Configuration is not literal JSON: ${String(error)}`);
  }
}

export function validateNotebookContract(value: unknown): NotebookProtocolContract {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Notebook configuration must be an object");
  const raw = value as Record<string, any>;
  if (raw.schema !== NOTEBOOK_PROTOCOL_SCHEMA) throw new Error(`schema must equal ${NOTEBOOK_PROTOCOL_SCHEMA}`);
  if (!Array.isArray(raw.inputs) || !raw.inputs.length) throw new Error("inputs must be a non-empty list");
  const ids = new Set<string>();
  const inputs = raw.inputs.map((candidate: any, index: number): NotebookProtocolInput => {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) throw new Error(`inputs[${index}] must be an object`);
    if (typeof candidate.id !== "string" || !/^[a-z][a-z0-9_-]{0,63}$/.test(candidate.id)) throw new Error(`inputs[${index}].id is invalid`);
    if (ids.has(candidate.id)) throw new Error(`Duplicate input id: ${candidate.id}`);
    ids.add(candidate.id);
    const path = portablePath(candidate.path, "input", `Input ${candidate.id} path`);
    const required = candidate.required ?? true;
    if (typeof required !== "boolean") throw new Error(`Input ${candidate.id} required must be boolean`);
    if (candidate.kind === "query") {
      const allowed = new Set<NotebookQueryFormat>(["duckdb", "sqlite", "sqlite3", "csv"]);
      if (!Array.isArray(candidate.formats) || !candidate.formats.length || candidate.formats.some((format: unknown) => !allowed.has(format as NotebookQueryFormat))) {
        throw new Error(`Input ${candidate.id} formats are invalid`);
      }
      return { ...candidate, path, required, formats: Array.from(new Set(candidate.formats)) };
    }
    if (candidate.kind === "file") {
      if (!Array.isArray(candidate.extensions) || !candidate.extensions.length || candidate.extensions.some((extension: unknown) => typeof extension !== "string" || !/^\.[A-Za-z0-9][A-Za-z0-9._-]*$/.test(extension))) {
        throw new Error(`Input ${candidate.id} extensions are invalid`);
      }
      return { ...candidate, path, required, extensions: candidate.extensions.map((extension: string) => extension.toLowerCase()) };
    }
    throw new Error(`Input ${candidate.id} kind must be query or file`);
  });
  if (!raw.results || typeof raw.results !== "object" || Array.isArray(raw.results)) throw new Error("results must be an object");
  const results = { ...raw.results, path: portablePath(raw.results.path, "results", "results.path") };
  if (raw.parameters != null && !Array.isArray(raw.parameters)) throw new Error("parameters must be a list");
  const parameterNames = new Set<string>();
  const parameters = (raw.parameters || []).map((candidate: any, index: number): NotebookParameter => {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) throw new Error(`parameters[${index}] must be an object`);
    if (typeof candidate.name !== "string" || !/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(candidate.name)) throw new Error(`parameters[${index}].name is invalid`);
    if (parameterNames.has(candidate.name)) throw new Error(`Duplicate parameter name: ${candidate.name}`);
    parameterNames.add(candidate.name);
    if (!["boolean", "integer", "number", "string", "choice"].includes(candidate.type)) throw new Error(`Parameter ${candidate.name} type is invalid`);
    if (candidate.label != null && typeof candidate.label !== "string") throw new Error(`Parameter ${candidate.name} label must be a string`);
    if (candidate.help != null && typeof candidate.help !== "string") throw new Error(`Parameter ${candidate.name} help must be a string`);
    if (candidate.type === "boolean" && candidate.default != null && typeof candidate.default !== "boolean") throw new Error(`Parameter ${candidate.name} default must be boolean`);
    if (candidate.type === "integer" && candidate.default != null && !Number.isSafeInteger(candidate.default)) throw new Error(`Parameter ${candidate.name} default must be integer`);
    if (candidate.type === "number" && candidate.default != null && (typeof candidate.default !== "number" || !Number.isFinite(candidate.default))) throw new Error(`Parameter ${candidate.name} default must be numeric`);
    if (candidate.type === "string" && candidate.default != null && typeof candidate.default !== "string") throw new Error(`Parameter ${candidate.name} default must be a string`);
    if (["integer", "number"].includes(candidate.type)) {
      for (const key of ["minimum", "maximum", "step"] as const) {
        if (candidate[key] != null && (typeof candidate[key] !== "number" || !Number.isFinite(candidate[key]))) throw new Error(`Parameter ${candidate.name} ${key} must be numeric`);
      }
      if (candidate.minimum != null && candidate.maximum != null && candidate.minimum > candidate.maximum) throw new Error(`Parameter ${candidate.name} minimum exceeds maximum`);
      if (candidate.step != null && candidate.step <= 0) throw new Error(`Parameter ${candidate.name} step must be positive`);
    }
    if (candidate.type === "choice") {
      if (!candidate.choices && !candidate.choices_query) throw new Error(`Parameter ${candidate.name} requires choices or choices_query`);
      if (candidate.choices && (!Array.isArray(candidate.choices) || !candidate.choices.length || candidate.choices.some((choice: unknown) => !["boolean", "number", "string"].includes(typeof choice)))) {
        throw new Error(`Parameter ${candidate.name} choices must be a non-empty scalar list`);
      }
      if (candidate.default != null && !["boolean", "number", "string"].includes(typeof candidate.default)) throw new Error(`Parameter ${candidate.name} default must be scalar`);
      if (candidate.choices_query) {
        if (!ids.has(candidate.choices_query.source)) throw new Error(`Parameter ${candidate.name} choices_query source is unknown`);
        if (typeof candidate.choices_query.sql !== "string" || !candidate.choices_query.sql.trim()) throw new Error(`Parameter ${candidate.name} choices_query sql is required`);
        for (const key of ["value_column", "label_column"] as const) {
          if (candidate.choices_query[key] != null && typeof candidate.choices_query[key] !== "string") throw new Error(`Parameter ${candidate.name} choices_query ${key} must be a string`);
        }
        const limit = candidate.choices_query.limit ?? 100;
        if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1000) throw new Error(`Parameter ${candidate.name} choices_query limit must be 1..1000`);
        candidate = { ...candidate, choices_query: { ...candidate.choices_query, limit, sql: selectOnly(candidate.choices_query.sql) } };
      }
    }
    return { ...candidate };
  });
  if (raw.requirements != null && (!Array.isArray(raw.requirements) || raw.requirements.some((item: unknown) => typeof item !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._<>=!~,-]*$/.test(item)))) {
    throw new Error("requirements must contain package requirement strings");
  }
  const requirements = Array.from(new Set<string>(raw.requirements || []));
  const unsupported = requirements
    .map((item) => item.split(/[<>=!~]/, 1)[0].toLowerCase().replace(/[_.]/g, "-"))
    .filter((item) => !APPROVED_NOTEBOOK_PACKAGES.has(item));
  if (unsupported.length) {
    throw new Error(`Unsupported package requirement(s): ${Array.from(new Set(unsupported)).sort().join(", ")}`);
  }
  return { ...raw, schema: NOTEBOOK_PROTOCOL_SCHEMA, inputs, results, parameters, requirements };
}

export function parseNotebookProtocol(document: NotebookDocument): NotebookProtocolContract | null {
  const marked = document.cells.filter((cell) =>
    cell.cell_type === "code" && Array.isArray(cell.metadata?.tags) && cell.metadata.tags.includes(NOTEBOOK_CONFIG_TAG)
  );
  if (!marked.length) return null;
  if (marked.length !== 1 || document.cells[0] !== marked[0]) throw new Error("The configuration cell must be the first cell and uniquely tagged omero-analysis-config");
  const contract = validateNotebookContract(literalConfiguration(sourceText(marked[0])));
  const requirements = document.metadata?.omero_analysis?.schema_requirements;
  if (!requirements || typeof requirements !== "object" || Array.isArray(requirements)) return contract;
  return {
    ...contract,
    inputs: contract.inputs.map((input) => input.kind === "query" && requirements[input.id]?.tables
      ? { ...input, schema: { tables: requirements[input.id].tables } }
      : input)
  };
}

export function sanitizeProtocolNotebook(document: NotebookDocument): NotebookDocument {
  const metadata = { ...document.metadata };
  delete metadata.widgets;
  return {
    ...document,
    metadata,
    cells: document.cells.map((cell) => cell.cell_type === "code"
      ? { ...cell, execution_count: null, outputs: [] }
      : cell)
  };
}

export function parameterDefaults(contract: NotebookProtocolContract): Record<string, boolean | number | string | null> {
  return Object.fromEntries(contract.parameters.map((parameter) => [parameter.name, parameter.default ?? null]));
}

export function validateParameterValues(
  contract: NotebookProtocolContract,
  values: Record<string, boolean | number | string | null>,
  dynamicChoices: Record<string, Array<boolean | number | string>> = {}
): Record<string, boolean | number | string | null> {
  const normalized = parameterDefaults(contract);
  for (const parameter of contract.parameters) {
    const value = values[parameter.name] ?? normalized[parameter.name];
    if (value == null) {
      normalized[parameter.name] = null;
      continue;
    }
    if (parameter.type === "boolean" && typeof value !== "boolean") throw new Error(`Parameter ${parameter.name} must be boolean`);
    if (parameter.type === "integer" && !Number.isSafeInteger(value)) throw new Error(`Parameter ${parameter.name} must be integer`);
    if (parameter.type === "number" && (typeof value !== "number" || !Number.isFinite(value))) throw new Error(`Parameter ${parameter.name} must be numeric`);
    if (parameter.type === "string" && typeof value !== "string") throw new Error(`Parameter ${parameter.name} must be a string`);
    if ((parameter.type === "integer" || parameter.type === "number") && typeof value === "number") {
      if (parameter.minimum != null && value < parameter.minimum) throw new Error(`Parameter ${parameter.name} is below its minimum`);
      if (parameter.maximum != null && value > parameter.maximum) throw new Error(`Parameter ${parameter.name} exceeds its maximum`);
    }
    if (parameter.type === "choice") {
      const options = parameter.choices || dynamicChoices[parameter.name] || [];
      if (options.length && !options.some((option) => Object.is(option, value))) throw new Error(`Parameter ${parameter.name} is not an available choice`);
    }
    normalized[parameter.name] = value;
  }
  return normalized;
}

export function extensionOf(name: string): string {
  return name.toLowerCase().match(/(\.[^.\\/]+)$/)?.[1] || "";
}

export function inputCandidates(input: NotebookProtocolInput, files: WorkspaceFile[]): WorkspaceFile[] {
  const extensions = input.kind === "query"
    ? input.formats.flatMap((format) => format === "sqlite" ? [".sqlite"] : format === "sqlite3" ? [".sqlite3"] : [`.${format}`])
    : input.extensions;
  return files.filter((file) => file.source !== "result" && !file.deletedAt && file.state === "ready" && extensions.includes(extensionOf(file.name)));
}
