import { fireEvent, render, waitFor } from "@testing-library/react";
import { createElement } from "react";
import NotebookView, {
  duckDbProgressSummary,
  clearNotebookInlineState,
  isDuckDbTechnicalOutput,
  parseNotebook,
  reattachNotebookDocument,
  serializeNotebook
} from "./NotebookView";
import type { PythonRuntime } from "./runtime";
import type { NotebookDocument, NotebookOutput, NotebookRecord, WorkspaceFile } from "./types";

function bytes(value: unknown): ArrayBuffer {
  return new TextEncoder().encode(JSON.stringify(value)).buffer;
}

describe("run-only notebook validation", () => {
  it("does not resume after Stop while asynchronous input preparation finishes", async () => {
    let finishPreparation!: () => void;
    const onBeforeRun = vi.fn(() => new Promise<void>(resolve => { finishPreparation = resolve; }));
    const runNotebookCell = vi.fn();
    const stop = vi.fn();
    const notebook = {
      id: "stop-test", workspaceId: "workspace", name: "stop.ipynb",
      attachmentIds: [], selectedDataFileIds: [],
      document: { nbformat: 4, nbformat_minor: 5, metadata: {},
        cells: [{ id: "cell", cell_type: "code", metadata: {}, source: "print('must not execute')", outputs: [] }] },
      createdAt: "2026-09-09", updatedAt: "2026-09-09"
    } as NotebookRecord;
    const view = render(createElement(NotebookView, {
      notebook, inputs: [], runtime: { reset: async () => undefined, stop, runNotebookCell } as unknown as PythonRuntime,
      runRequest: null, workspaceActions: null, onBeforeRun,
      onChange: async () => undefined, onFiles: async () => undefined
    }));
    fireEvent.click(view.getByRole("button", { name: "Run" }));
    await waitFor(() => expect(onBeforeRun).toHaveBeenCalled());
    fireEvent.click(view.getByRole("button", { name: "Stop" }));
    finishPreparation();
    await waitFor(() => expect(view.getByText("Notebook stopped.")).toBeTruthy());
    expect(stop).toHaveBeenCalledOnce();
    expect(runNotebookCell).not.toHaveBeenCalled();
    expect((view.getByRole("button", { name: "Run" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("clears only code-cell outputs and execution counts", () => {
    const document = {
      nbformat: 4, nbformat_minor: 5, metadata: {},
      cells: [
        { id: "text", cell_type: "markdown", metadata: {}, source: "Result notes" },
        {
          id: "code", cell_type: "code", metadata: {}, source: "print('old')",
          execution_count: 7,
          outputs: [{ output_type: "stream", name: "stdout", text: "old\n" }]
        }
      ]
    } as NotebookDocument;

    const cleared = clearNotebookInlineState(document);

    expect(cleared.cells[0]).toEqual(document.cells[0]);
    expect(cleared.cells[1]).toMatchObject({ execution_count: null, outputs: [] });
  });

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

  it("collapses code source by default while keeping output visible", () => {
    const notebook = {
      id: "notebook", workspaceId: "workspace", name: "result.ipynb",
      attachmentIds: [], selectedDataFileIds: [],
      document: {
        nbformat: 4, nbformat_minor: 5, metadata: {},
        cells: [{
          id: "cell", cell_type: "code", metadata: {}, source: "value = 1",
          execution_count: 1,
          outputs: [{ output_type: "stream", name: "stdout", text: "visible result" }]
        }]
      },
      createdAt: "2026-08-12T10:00:00Z", updatedAt: "2026-08-12T10:00:00Z"
    } as NotebookRecord;
    const { container } = render(createElement(NotebookView, {
      notebook, inputs: [], runtime: {} as PythonRuntime, runRequest: null,
      workspaceActions: null, onBeforeRun: async () => undefined,
      onChange: async () => undefined, onFiles: async () => undefined
    }));

    const code = container.querySelector(".notebook-code") as HTMLDetailsElement;
    expect(code.open).toBe(false);
    expect(container.querySelector(".notebook-outputs")?.textContent).toContain("visible result");
    fireEvent.click(code.querySelector("summary")!);
    expect(code.open).toBe(true);
  });

  it("persists cleared inline state before starting a run", async () => {
    const notebook = {
      id: "notebook", workspaceId: "workspace", name: "rerun.ipynb",
      attachmentIds: [], selectedDataFileIds: [],
      document: {
        nbformat: 4, nbformat_minor: 5, metadata: {},
        cells: [{
          id: "cell", cell_type: "code", metadata: {}, source: "value = 1",
          execution_count: 9,
          outputs: [{ output_type: "stream", name: "stdout", text: "stale" }]
        }]
      },
      createdAt: "2026-08-12T10:00:00Z", updatedAt: "2026-08-12T10:00:00Z"
    } as NotebookRecord;
    const onChange = vi.fn(async (_record: NotebookRecord) => undefined);
    const reset = vi.fn(async () => undefined);
    const onBeforeRun = vi.fn(async () => undefined);
    const onRunStateChange = vi.fn();
    const runtime = {
      reset,
      syncInputs: vi.fn(async () => undefined),
      runNotebookCell: vi.fn(async () => ({
        stdout: "", stderr: "", preview: null, modelPayload: {} as never, files: []
      }))
    } as unknown as PythonRuntime;
    const { getByRole } = render(createElement(NotebookView, {
      notebook, inputs: [], runtime, runRequest: null,
      workspaceActions: null, onBeforeRun,
      onChange, onFiles: async () => undefined, onRunStateChange
    }));

    fireEvent.click(getByRole("button", { name: "Run" }));
    await waitFor(() => expect(reset).toHaveBeenCalled());

    const firstChange = onChange.mock.calls[0][0] as NotebookRecord;
    expect(firstChange.document.cells[0]).toMatchObject({ execution_count: null, outputs: [] });
    expect(onChange.mock.invocationCallOrder[0]).toBeLessThan(reset.mock.invocationCallOrder[0]);
    expect(reset.mock.invocationCallOrder[0]).toBeLessThan(onBeforeRun.mock.invocationCallOrder[0]);
    await waitFor(() => expect(onRunStateChange).toHaveBeenLastCalledWith(false));
    expect(onRunStateChange.mock.calls.map(([value]) => value)).toEqual([true, false]);
  });

  it("releases the synchronization barrier when notebook startup fails", async () => {
    const notebook = {
      id: "notebook", workspaceId: "workspace", name: "failed.ipynb",
      attachmentIds: [], selectedDataFileIds: [],
      document: { nbformat: 4, nbformat_minor: 5, metadata: {}, cells: [] },
      createdAt: "2026-08-12T10:00:00Z", updatedAt: "2026-08-12T10:00:00Z"
    } as NotebookRecord;
    const onRunStateChange = vi.fn();
    const runtime = {
      reset: vi.fn(async () => { throw new Error("kernel failed"); }),
      syncInputs: vi.fn(async () => undefined)
    } as unknown as PythonRuntime;
    const { getByRole } = render(createElement(NotebookView, {
      notebook, inputs: [], runtime, runRequest: null,
      workspaceActions: null, onBeforeRun: async () => undefined,
      onChange: async () => undefined, onFiles: async () => undefined,
      onRunStateChange
    }));

    fireEvent.click(getByRole("button", { name: "Run" }));
    await waitFor(() => expect(onRunStateChange).toHaveBeenLastCalledWith(false));
    expect(onRunStateChange.mock.calls.map(([value]) => value)).toEqual([true, false]);
  });

  it("keeps the synchronization barrier until a stopped run has unwound", async () => {
    const notebook = {
      id: "notebook", workspaceId: "workspace", name: "stopped.ipynb",
      attachmentIds: [], selectedDataFileIds: [],
      document: { nbformat: 4, nbformat_minor: 5, metadata: {}, cells: [{
        id: "cell", cell_type: "code", metadata: {}, source: "long_run()",
        execution_count: null, outputs: []
      }] },
      createdAt: "2026-08-12T10:00:00Z", updatedAt: "2026-08-12T10:00:00Z"
    } as NotebookRecord;
    let rejectCell: ((error: Error) => void) | undefined;
    const onRunStateChange = vi.fn();
    const runtime = {
      reset: vi.fn(async () => undefined),
      syncInputs: vi.fn(async () => undefined),
      runNotebookCell: vi.fn(() => new Promise((_resolve, reject) => { rejectCell = reject; })),
      stop: vi.fn(() => rejectCell?.(new Error("stopped"))),
      start: vi.fn(async () => undefined)
    } as unknown as PythonRuntime;
    const { getByRole } = render(createElement(NotebookView, {
      notebook, inputs: [], runtime, runRequest: null,
      workspaceActions: null, onBeforeRun: async () => undefined,
      onChange: async () => undefined, onFiles: async () => undefined,
      onRunStateChange
    }));

    fireEvent.click(getByRole("button", { name: "Run" }));
    await waitFor(() => expect(runtime.runNotebookCell).toHaveBeenCalled());
    expect(onRunStateChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(getByRole("button", { name: "Stop" }));
    await waitFor(() => expect(onRunStateChange).toHaveBeenLastCalledWith(false));
    expect(onRunStateChange.mock.calls.map(([value]) => value)).toEqual([true, false]);
  });

  it("consumes a requested run so remounting cannot execute it again", async () => {
    const notebook = {
      id: "notebook", workspaceId: "workspace", name: "requested.ipynb",
      attachmentIds: [], selectedDataFileIds: [],
      document: { nbformat: 4, nbformat_minor: 5, metadata: {}, cells: [] },
      createdAt: "2026-08-12T10:00:00Z", updatedAt: "2026-08-12T10:00:00Z"
    } as NotebookRecord;
    const consumed = vi.fn();
    const runtime = {
      reset: vi.fn(async () => undefined),
      syncInputs: vi.fn(async () => undefined)
    } as unknown as PythonRuntime;

    render(createElement(NotebookView, {
      notebook, inputs: [], runtime,
      runRequest: { id: notebook.id, nonce: 42 },
      onRunRequestConsumed: consumed,
      workspaceActions: null, onBeforeRun: async () => undefined,
      onChange: async (_record: NotebookRecord) => undefined,
      onFiles: async () => undefined
    }));

    await waitFor(() => expect(consumed).toHaveBeenCalledTimes(1));
    expect(runtime.reset).toHaveBeenCalledTimes(1);
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

  it("summarizes noisy DuckDB progress and classifies its technical outputs", () => {
    const stream = {
      output_type: "stream", name: "stdout",
      text: "20% (~7 seconds remaining)\r45% (~4 seconds remaining)\r100% (00:00:03.87 elapsed)"
    } as NotebookOutput;
    const result = {
      output_type: "execute_result", execution_count: 1, metadata: {},
      data: { "application/json": { engine: "DuckDB", row_count: 24 } }
    } as NotebookOutput;

    expect(duckDbProgressSummary(stream.text)).toEqual({ percent: 100, elapsed: "00:00:03.87" });
    expect(isDuckDbTechnicalOutput(stream)).toBe(true);
    expect(isDuckDbTechnicalOutput(result)).toBe(true);
  });

  it("hides DuckDB details by default while leaving visual output outside the card", () => {
    const notebook = {
      id: "notebook", workspaceId: "workspace", name: "duckdb.ipynb",
      attachmentIds: [], selectedDataFileIds: [],
      document: {
        nbformat: 4, nbformat_minor: 5, metadata: {},
        cells: [{
          id: "cell", cell_type: "code", metadata: {}, source: "query()",
          execution_count: 1,
          outputs: [
            {
              output_type: "stream", name: "stdout",
              text: "50% (~2 seconds remaining)\r100% (00:00:03.87 elapsed)"
            },
            {
              output_type: "execute_result", execution_count: 1, metadata: {},
              data: { "application/json": { engine: "DuckDB", row_count: 24 } }
            },
            {
              output_type: "display_data", metadata: {},
              data: { "image/png": "aGVsbG8=" }
            }
          ]
        }]
      },
      createdAt: "2026-08-05T10:00:00Z", updatedAt: "2026-08-05T10:00:00Z"
    } as NotebookRecord;
    const { container } = render(createElement(NotebookView, {
      notebook, inputs: [], runtime: {} as PythonRuntime, runRequest: null,
      workspaceActions: null, onBeforeRun: async () => undefined,
      onChange: async () => undefined, onFiles: async () => undefined
    }));

    const details = container.querySelector(".notebook-duckdb-output") as HTMLDetailsElement;
    expect(details).not.toBeNull();
    expect(details.open).toBe(false);
    expect(details.textContent).toContain("Completed · 100% · 00:00:03.87");
    expect(container.querySelector(".notebook-image")).not.toBeNull();
    expect(container.querySelectorAll(".notebook-duckdb-progress")).toHaveLength(1);
  });
});
