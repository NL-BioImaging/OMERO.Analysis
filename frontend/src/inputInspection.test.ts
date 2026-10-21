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

it("uses the same safe runtime name for schema, readiness and parameter choices",async()=>{
  const selected={...file,name:"marker+_cells.csv"};
  const declared={id:"measurements",kind:"query",formats:["csv"],required:true,
    schema:{tables:[{name:"data",columns:[{name:"count"}]}]},readiness:[{sql:"SELECT 1 AS present"}]} as NotebookProtocolInput;
  const runtime={syncInputs:vi.fn(),profileInputs:vi.fn(async()=>[{path:"/input/marker__cells.csv",summary:{preview:{columns:["count"]}}}]),
    configureNotebook:vi.fn(),runNotebookCell:vi.fn(async()=>({preview:true}))};
  const source=await inspectInput(selected,declared,{} as OmeroBridge,runtime as unknown as PythonRuntime);
  expect(source.error).toBeUndefined();
  expect(source.readiness?.["SELECT 1 AS present"]).toBe(true);
  expect(runtime.configureNotebook).toHaveBeenCalledWith(expect.objectContaining({bindings:[expect.objectContaining({path:"/input/marker__cells.csv"})]}));
  runtime.runNotebookCell.mockResolvedValueOnce({preview:{columns:["count"],data:[[12]]}} as any);
  expect(await queryInputChoices(selected,"SELECT count FROM data LIMIT 1",{} as OmeroBridge,runtime as unknown as PythonRuntime)).toEqual({columns:["count"],rows:[[12]]});
  expect(runtime.configureNotebook).toHaveBeenLastCalledWith(expect.objectContaining({bindings:[expect.objectContaining({path:"/input/marker__cells.csv"})]}));
});
