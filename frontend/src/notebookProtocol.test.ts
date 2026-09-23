import { describe, expect, it } from "vitest";
import type { NotebookDocument } from "./types";
import {
  NOTEBOOK_PROTOCOL_SCHEMA,
  inputCandidates,
  parameterDefaults,
  parseNotebookProtocol,
  sanitizeProtocolNotebook,
  validateParameterValues
} from "./notebookProtocol";

function document(json: Record<string, unknown>): NotebookDocument {
  return {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: { language_info: { name: "python" }, kernelspec: { language: "python" }, widgets: { state: {} } },
    cells: [{
      id: "config",
      cell_type: "code",
      metadata: { tags: ["omero-analysis-config"] },
      execution_count: 4,
      outputs: [{ output_type: "stream", text: "stale" }],
      source: `import omero_analysis_notebook as oan\nctx = oan.configure(r'''${JSON.stringify(json)}''')`
    }]
  };
}

const contract = {
  schema: NOTEBOOK_PROTOCOL_SCHEMA,
  inputs: [{ id: "measurements", kind: "query", path: "input/measurements.duckdb", formats: ["duckdb", "sqlite", "sqlite3", "csv"] }],
  results: { path: "results" },
  parameters: [{ name: "minimum", type: "integer", default: 2 }],
  requirements: ["pandas"]
};

describe("portable notebook protocol", () => {
  it("parses a literal first tagged cell", () => {
    const parsed = parseNotebookProtocol(document(contract));
    expect(parsed?.schema).toBe(NOTEBOOK_PROTOCOL_SCHEMA);
    expect(parameterDefaults(parsed!)).toEqual({ minimum: 2 });
  });

  it("rejects a marked invalid notebook instead of treating it as legacy", () => {
    const value = document(contract);
    value.cells[0].source = "ctx = oan.configure(build_config())";
    expect(() => parseNotebookProtocol(value)).toThrow(/triple-quoted literal JSON/);
  });

  it("sanitizes execution and widget state", () => {
    const clean = sanitizeProtocolNotebook(document(contract));
    expect(clean.metadata.widgets).toBeUndefined();
    expect(clean.cells[0].outputs).toEqual([]);
    expect(clean.cells[0].execution_count).toBeNull();
  });

  it("matches all supported query source extensions", () => {
    const parsed = parseNotebookProtocol(document(contract))!;
    const files = ["a.duckdb", "b.sqlite", "c.sqlite3", "d.csv", "e.xlsx"].map((name, index) => ({
      id: String(index), workspaceId: "w", name, logicalPath: name, type: "application/octet-stream",
      size: 1, sha256: String(index), source: "local" as const, state: "ready" as const, createdAt: "now"
    }));
    expect(inputCandidates(parsed.inputs[0], files).map((file) => file.name)).toEqual(["a.duckdb", "b.sqlite", "c.sqlite3", "d.csv"]);
  });

  it("rejects requirements outside the fixed browser allowlist", () => {
    const unsupported = structuredClone(contract);
    unsupported.requirements = ["requests>=2"];
    expect(() => parseNotebookProtocol(document(unsupported))).toThrow(/Unsupported package/);
  });

  it("rejects invalid typed parameter defaults", () => {
    const invalid = structuredClone(contract);
    invalid.parameters = [{ name: "minimum", type: "integer", default: "two" }] as any;
    expect(() => parseNotebookProtocol(document(invalid))).toThrow(/default must be integer/);
  });

  it("rejects persisted values outside typed bounds", () => {
    const parsed = parseNotebookProtocol(document({
      ...contract,
      parameters: [{ name: "minimum", type: "integer", default: 2, minimum: 0, maximum: 5 }]
    }))!;
    expect(() => validateParameterValues(parsed, { minimum: 6 })).toThrow(/maximum/);
  });
});
