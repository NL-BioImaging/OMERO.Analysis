import {
  ArtifactBindingError,
  bindNotebookInputsStrict,
  bindPipelineInputsStrict,
  bindPythonInputsStrict,
  downloadableWorkspaceInputs,
  extendPipelineInputs,
  isInputBindingsCell
} from "./artifactBindings";
import type {
  ExecutionRecord,
  MethodRecord,
  NotebookDocument,
  PipelineRecord,
  WorkspaceFile
} from "./types";

const createdAt = "2026-08-03T10:00:00Z";

function input(name: string, state: WorkspaceFile["state"] = "ready"): WorkspaceFile {
  return {
    id: name,
    workspaceId: "workspace",
    name,
    logicalPath: `OMERO/Dataset-1/Input/${name}`,
    type: "application/octet-stream",
    size: 1,
    sha256: name,
    source: "local",
    state,
    data: state === "ready" ? new ArrayBuffer(1) : undefined,
    createdAt
  };
}

function method(id: string, code: string): MethodRecord {
  return {
    id,
    workspaceId: "workspace",
    name: `${id}.py`,
    description: id,
    currentVersion: 1,
    versions: [{ version: 1, code, codeHash: id, executionId: "", createdAt }],
    createdAt,
    updatedAt: createdAt
  };
}

describe("strict artifact input binding", () => {
  it("prefers an exact ready filename and otherwise uses one compatible extension", () => {
    const exact = bindPythonInputsStrict('db = "/input/current.duckdb"', [input("current.duckdb")]);
    expect(exact.code).toContain("/input/current.duckdb");
    expect(exact.bindings[0].to).toBe("current.duckdb");

    const rebound = bindPythonInputsStrict('db = "/input/old.duckdb"', [
      input("screen.duckdb"), input("layout.csv")
    ]);
    expect(rebound.code).toContain("/input/screen.duckdb");
  });

  it("allows code without input references", () => {
    expect(bindPythonInputsStrict("print('hello')", []).bindings).toEqual([]);
  });

  it("rejects missing, unavailable, and ambiguous relevant inputs", () => {
    expect(() => bindPythonInputsStrict('p = "/input/x.csv"', []))
      .toThrow(ArtifactBindingError);
    expect(() => bindPythonInputsStrict('p = "/input/x.csv"', [input("x.csv", "missing")]))
      .toThrow(/no ready compatible/);
    expect(() => bindPythonInputsStrict('p = "/input/x.csv"', [input("a.csv"), input("b.csv")]))
      .toThrow(/ambiguous/);
  });

  it("identifies a missing input so the UI can offer an explicit local fallback", () => {
    try {
      bindPythonInputsStrict('p = "/input/legacy.duckdb"', []);
      throw new Error("Expected binding to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(ArtifactBindingError);
      expect((error as ArtifactBindingError).referencedName).toBe("legacy.duckdb");
    }
  });

  it("finds an undownloaded OMERO database for legacy Method, Pipeline, and Notebook recovery", () => {
    const remoteOnly: WorkspaceFile = {
      ...input("current-measurements.duckdb"),
      source: "omero",
      annotationId: 42,
      dataQueryMode: "local",
      data: undefined,
      sha256: ""
    };
    expect(downloadableWorkspaceInputs("legacy-name.duckdb", [remoteOnly]))
      .toEqual([remoteOnly]);
    expect(downloadableWorkspaceInputs("legacy-name.csv", [remoteOnly])).toEqual([]);
    expect(downloadableWorkspaceInputs("legacy-name.duckdb", [
      { ...remoteOnly, state: "failed" }
    ])).toEqual([]);
  });

  it("replaces one managed Notebook binding cell and strictly rebinds code cells", () => {
    const document: NotebookDocument = {
      nbformat: 4,
      nbformat_minor: 5,
      metadata: {},
      cells: [{
        id: "code",
        cell_type: "code",
        source: 'db = "/input/old.duckdb"',
        metadata: {},
        execution_count: 2,
        outputs: []
      }]
    };
    const rebound = bindNotebookInputsStrict(document, [input("screen.duckdb")]);
    expect(rebound.document.cells.filter(isInputBindingsCell)).toHaveLength(1);
    expect(rebound.document.cells[1].source).toContain("/input/screen.duckdb");
  });

  it("preserves a portable protocol configuration cell instead of inserting a legacy binding cell", () => {
    const literal = JSON.stringify({
      schema: "nl.bioimaging.omero-analysis-notebook.v1",
      inputs: [{ id: "measurements", kind: "query", path: "input/old.duckdb", formats: ["duckdb"] }],
      results: { path: "results" },
      parameters: [],
      requirements: []
    });
    const document: NotebookDocument = {
      nbformat: 4,
      nbformat_minor: 5,
      metadata: {},
      cells: [{
        id: "config",
        cell_type: "code",
        source: `import omero_analysis_notebook as oan\nctx = oan.configure(r'''${literal}''')`,
        metadata: { tags: ["omero-analysis-config"] },
        execution_count: null,
        outputs: []
      }]
    };
    const rebound = bindNotebookInputsStrict(document, [input("screen.duckdb")]);
    expect(rebound.document).toBe(document);
    expect(rebound.document.cells.filter(isInputBindingsCell)).toHaveLength(0);
  });

  it("recognizes literal outputs from earlier Pipeline steps as staged inputs", () => {
    const methods = [
      method("first", 'db = "/input/source.duckdb"\nout = "/output/table.csv"'),
      method("second", 'table = "/input/table.csv"')
    ];
    const pipeline: PipelineRecord = {
      id: "pipeline",
      workspaceId: "workspace",
      name: "pipeline",
      description: "",
      version: 1,
      steps: methods.map((item) => ({
        id: item.id,
        methodId: item.id,
        methodVersion: 1,
        name: item.name,
        inputBindings: {},
        parameters: {}
      })),
      createdAt,
      updatedAt: createdAt
    };
    const rebound = bindPipelineInputsStrict(pipeline, methods, [input("screen.duckdb")]);
    expect(rebound.pipeline.steps[0].inputBindings).toEqual({ "source.duckdb": "screen.duckdb" });
    expect(rebound.pipeline.steps[1].inputBindings).toEqual({ "table.csv": "table.csv" });
  });
});

describe("Pipeline staged outputs", () => {
  it("uses step execution outputs, including reused files, without duplicates", () => {
    const workspaceInput = input("measurements.duckdb");
    const reusedOutput: WorkspaceFile = {
      ...input("counts.csv"),
      id: "counts-output",
      source: "result",
      runId: "older-run"
    };
    const execution = {
      id: "execution",
      workspaceId: "workspace",
      runId: "current-run",
      code: "",
      codeHash: "hash",
      cacheKey: "cache",
      status: "reused",
      stdout: "",
      stderr: "",
      outputFileIds: [reusedOutput.id],
      missingPlotCsv: [],
      inputHashes: [],
      runtimeVersion: "test",
      model: "test",
      createdAt
    } satisfies ExecutionRecord;

    const extended = extendPipelineInputs(
      [workspaceInput, reusedOutput],
      [execution],
      [workspaceInput, reusedOutput]
    );
    expect(extended.map((file) => file.id)).toEqual([workspaceInput.id, reusedOutput.id]);

    const newlyExtended = extendPipelineInputs(
      [workspaceInput],
      [execution],
      [workspaceInput, reusedOutput]
    );
    expect(newlyExtended.map((file) => file.id)).toEqual([workspaceInput.id, reusedOutput.id]);
  });
});
