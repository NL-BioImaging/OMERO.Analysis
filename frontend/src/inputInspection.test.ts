import { inspectInput, queryInputChoices } from "./inputInspection";
import type { WorkspaceFile } from "./types";
import type { PythonRuntime } from "./runtime";
import type { OmeroBridge } from "./api";
import type { NotebookProtocolInput } from "./notebookProtocol";

const file = { id: "source", name: "measurements.duckdb", data: new ArrayBuffer(1) } as WorkspaceFile;
const input = { id: "measurements", kind: "query", formats: ["duckdb"], required: true,
  schema: { tables: [{ name: "objects", columns: [{ name: "object_id" }] }] } } as NotebookProtocolInput;

it("checks the selected input schema even when another file profile precedes it", async () => {
  const runtime = { syncInputs: vi.fn(async () => {}), profileInputs: vi.fn(async () => [
    { path: "/input/.omero", summary: {} },
    { path: "/input/another.duckdb", summary: { tables: [{ name: "wrong_table" }] } },
    { path: "/input/measurements.duckdb", summary: { tables: [{ name: "objects", columns: [{ name: "object_id" }] }] } },
  ]) };
  const source = await inspectInput(file, input, {} as OmeroBridge, runtime as unknown as PythonRuntime);
  expect(source.schema?.tables?.map(table => table.name)).toEqual(["objects"]);
  expect(source.error).toBeUndefined();
  expect(runtime.syncInputs).toHaveBeenCalledWith([file]);
});

it("retains a selected input's parser error for the compatibility explanation", async () => {
  const runtime = { syncInputs: vi.fn(async () => {}), profileInputs: vi.fn(async () => [
    { path: "/input/measurements.duckdb", summary: {}, error: "Database cannot be read" },
  ]) };
  const source = await inspectInput(file, input, {} as OmeroBridge, runtime as unknown as PythonRuntime);
  expect(source.error).toBe("Database cannot be read");
  expect(source.schema).toBeUndefined();
});

it("loads remote choices through the bounded broker without starting notebook Python",async()=>{
 const remote={...file,annotationId:752,data:undefined,dataQueryMode:"remote"} as WorkspaceFile;
 const bridge={remoteQuery:vi.fn(async()=>({columns:[{name:"t"}],preview:[[0]],row_count:1}))};
 const runtime={syncInputs:vi.fn(),runNotebookCell:vi.fn()};
 expect(await queryInputChoices(remote,"SELECT * FROM (SELECT 0 AS t) AS choices LIMIT 5",bridge as unknown as OmeroBridge,runtime as unknown as PythonRuntime)).toEqual({columns:["t"],rows:[[0]]});
 expect(runtime.syncInputs).not.toHaveBeenCalled();expect(bridge.remoteQuery.mock.calls[0]).toBeTruthy();
 await expect(queryInputChoices(remote,"DELETE FROM objects",bridge as unknown as OmeroBridge,runtime as unknown as PythonRuntime)).rejects.toThrow(/read-only/);
 expect(bridge.remoteQuery).toHaveBeenCalledTimes(1);
});
