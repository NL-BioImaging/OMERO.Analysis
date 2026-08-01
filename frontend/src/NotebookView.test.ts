import { fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
import NotebookView, {
  parseNotebook,
  reattachNotebookDocument,
  serializeNotebook
} from "./NotebookView";
import type { PythonRuntime } from "./runtime";
import type { NotebookDocument, NotebookRecord, WorkspaceFile } from "./types";

function bytes(value: unknown): ArrayBuffer {
  return new TextEncoder().encode(JSON.stringify(value)).buffer;
}

describe("run-only notebook validation", () => {
  it("accepts Python nbformat 4 without changing source cells", () => {
    const source = ["value = 1\n", "value + 1"];
    const document = parseNotebook(bytes({
      nbformat: 4,
      nbformat_minor: 5,
      metadata: {
        kernelspec: { language: "python" },
        language_info: { name: "python" }
      },
      cells: [{
        cell_type: "code",
        metadata: {},
        source,
        execution_count: null,
        outputs: []
      }]
    }));
    expect(document.cells[0].source).toEqual(source);
    expect(JSON.parse(new TextDecoder().decode(serializeNotebook(document))).nbformat).toBe(4);
  });

  it("rejects non-Python kernels and malformed cell sources", () => {
    expect(() => parseNotebook(bytes({
      nbformat: 4,
      metadata: {
        kernelspec: { language: "R" },
        language_info: { name: "R" }
      },
      cells: []
    }))).toThrow(/Only Python notebooks/);
    expect(() => parseNotebook(bytes({
      nbformat: 4,
      metadata: {},
      cells: [{ cell_type: "code", metadata: {}, source: [42] }]
    }))).toThrow(/source must be text/);
  });

  it("does not execute when a Notebook cell is clicked", () => {
    const runNotebookCell = vi.fn();
    const notebook = {
      id: "notebook", workspaceId: "workspace", name: "safe.ipynb",
      attachmentIds: [], selectedDataFileIds: [],
      document: {
        nbformat: 4, nbformat_minor: 5, metadata: {},
        cells: [{
          id: "cell", cell_type: "code", metadata: {}, source: "value = 1",
          execution_count: null, outputs: []
        }]
      },
      createdAt: "2026-07-29T10:00:00Z",
      updatedAt: "2026-07-29T10:00:00Z"
    } as NotebookRecord;
    const { container } = render(createElement(NotebookView, {
      notebook,
      inputs: [],
      runtime: { runNotebookCell } as unknown as PythonRuntime,
      runRequest: null,
      workspaceActions: null,
      onBeforeRun: async () => undefined,
      onChange: async () => undefined,
      onFiles: async () => undefined
    }));
    fireEvent.click(container.querySelector(".notebook-cell")!);
    expect(runNotebookCell).not.toHaveBeenCalled();
  });

  it("adds a visible input binding cell and rebinds unambiguous input paths", () => {
    const document = {
      nbformat: 4,
      nbformat_minor: 5,
      metadata: {},
      cells: [{
        id: "analysis",
        cell_type: "code",
        metadata: {},
        source: 'DB_PATH = "/input/old-measurements.duckdb"\n',
        execution_count: null,
        outputs: []
      }]
    } as NotebookDocument;
    const input = {
      id: "new-db",
      workspaceId: "workspace",
      name: "current-measurements.duckdb",
      logicalPath: "/input/current-measurements.duckdb",
      type: "application/octet-stream",
      size: 4,
      sha256: "hash",
      source: "omero",
      state: "ready",
      data: new Uint8Array([1, 2, 3, 4]).buffer,
      createdAt: "2026-07-30T10:00:00Z"
    } as WorkspaceFile;

    const attached = reattachNotebookDocument(document, [input]);

    expect(attached.cells[0].source).toContain("OA_ATTACHED_INPUTS");
    expect(attached.cells[0].source).toContain("current-measurements.duckdb");
    expect(attached.cells[1].source).toContain(
      'DB_PATH = "/input/current-measurements.duckdb"'
    );
    expect(
      reattachNotebookDocument(attached, [input]).cells.filter((cell) =>
        (cell.metadata.omero_analysis as { kind?: string } | undefined)?.kind ===
          "input-bindings"
      )
    ).toHaveLength(1);
  });
});
