import { readOnlyQuery } from "./inspectorQuery";
import { OmeroBridge } from "./api";
import { PythonRuntime } from "./runtime";
import { runtimeInputName } from "./runtimePaths";
import { inputCompatibility, type CompatibilitySource } from "./notebookCompatibility";
import { NOTEBOOK_PROTOCOL_SCHEMA, type NotebookProtocolInput, type NotebookProtocolContract } from "./notebookProtocol";
import type { WorkspaceFile } from "./types";

/** Shared read-only inspection service. It must receive a dedicated runtime. */
export async function inspectInput(file: WorkspaceFile, input: NotebookProtocolInput, bridge: OmeroBridge, runtime: PythonRuntime): Promise<CompatibilitySource> {
  const source: CompatibilitySource = { id: file.id, name: file.name };
  if (input.kind === "file") return source;
  if (!input.formats.some(format => file.name.toLowerCase().endsWith(`.${format}`))) return source;
  const remote = file.dataQueryMode === "remote" && !!file.annotationId;
  if (remote) source.schema = await bridge.remoteSchema(file.annotationId!);
  else if (file.data) {
    await runtime.syncInputs([file]);
    const profiles = await runtime.profileInputs();
    const profile = profiles.find(value => value.path === `/input/${runtimeInputName(file.name)}`);
    if (!profile) return { ...source, error: "No schema was returned for the selected input" };
    if (profile.error) return { ...source, error: profile.error };
    const summary = profile.summary;
    source.schema = { tables: summary?.tables as any };
    if (/\.csv$/i.test(file.name) && !source.schema.tables?.length) {
      const preview = summary?.preview as { columns?: string[] } | undefined;
      source.schema = { tables: [{ name: "data", columns: preview?.columns?.map(name => ({ name })) }] };
    }
  } else return { ...source, error: file.error || "Input data is unavailable" };
  const schemaMatch = inputCompatibility({ ...input, readiness: undefined }, source);
  if (schemaMatch.status !== "compatible") return source;
  source.readiness = {};
  if (!remote && input.readiness?.length) {
    const contract: NotebookProtocolContract = { schema: NOTEBOOK_PROTOCOL_SCHEMA, inputs: [input],
      results: { path: "results" }, parameters: [], requirements: [] };
    await runtime.configureNotebook({ contract, parameters: {}, bindings: [{
      inputId: input.id, fileId: file.id, name: file.name, kind: "query", mode: "local",
      path: `/input/${runtimeInputName(file.name)}`, format: file.name.split(".").pop() as any
    }] });
  }
  for (const check of input.readiness || []) {
    const sql = `SELECT * FROM (${check.sql.trim().replace(/;\s*$/, "")}) AS readiness LIMIT 1`;
    if (remote) {
      const result = await bridge.remoteQuery(file.annotationId!, sql, {});
      source.readiness[check.sql] = Array.isArray(result.preview) && result.preview.length > 0;
    } else {
      const result = await runtime.runNotebookCell(`_readiness = await ctx.query(${JSON.stringify(input.id)}, ${JSON.stringify(sql)})\nlen(_readiness) > 0`);
      source.readiness[check.sql] = result.preview === true;
    }
  }
  return source;
}

/** A bounded choices query in the inspection kernel, never the notebook kernel. */
export async function queryInputChoices(file: WorkspaceFile, sql: string, bridge: OmeroBridge, runtime: PythonRuntime): Promise<{columns:string[];rows:unknown[][]}> {
  sql=readOnlyQuery(sql);
  if (file.dataQueryMode === "remote" && file.annotationId) {
    const result = await bridge.remoteQuery(file.annotationId, sql, {});
    const columns = (result.columns || []).map((c:any) => String(c.name ?? c));
    const rows = result.preview || [];
    if (Number(result.row_count) <= rows.length || !result.result_token) return {columns,rows};
    // Only the bounded query result is downloaded, never the source database.
    const data = await bridge.downloadRemoteResult(String(result.result_token));
    const temporary = {...file,id:`${file.id}:choices`,name:"notebook-choices.arrow",logicalPath:"notebook-choices.arrow",source:"local" as const,data,size:data.byteLength};
    await runtime.syncInputs([temporary]);
    const output = await runtime.runNotebookCell(`import pyarrow as _choice_pa, pyarrow.ipc as _choice_ipc, json as _choice_json\n_choice_buffer = _choice_pa.py_buffer(open("/input/notebook-choices.arrow", "rb").read())\ntry:\n    _choice_frame = _choice_ipc.open_file(_choice_buffer).read_all().to_pandas()\nexcept _choice_pa.ArrowInvalid:\n    _choice_frame = _choice_ipc.open_stream(_choice_buffer).read_all().to_pandas()\n_choice_json.loads(_choice_frame.to_json(orient="split"))`);
    const value:any=(output.preview as any)?.value ?? output.preview;
    if (!Array.isArray(value?.columns) || !Array.isArray(value?.data)) throw new Error("Choices query returned an invalid preview");
    return {columns:value.columns,rows:value.data};
  }
  if (!file.data) throw new Error("Input is unavailable. Attach or inspect it first.");
  const format=file.name.split(".").pop() as any;
  const contract:NotebookProtocolContract={schema:NOTEBOOK_PROTOCOL_SCHEMA,inputs:[{id:"choices",kind:"query",path:`input/${file.name}`,formats:[format],required:true}],results:{path:"results"},parameters:[],requirements:[]};
  await runtime.syncInputs([file]);
  await runtime.configureNotebook({contract,parameters:{},bindings:[{inputId:"choices",fileId:file.id,name:file.name,kind:"query",mode:"local",path:`/input/${runtimeInputName(file.name)}`,format}]});
  const output=await runtime.runNotebookCell(`import json as _choice_json\n_choice_frame = await ctx.query("choices", ${JSON.stringify(sql)})\n_choice_json.loads(_choice_frame.to_json(orient="split"))`);
  const value:any=(output.preview as any)?.value ?? output.preview;
  if (!Array.isArray(value?.columns) || !Array.isArray(value?.data)) throw new Error("Choices query returned an invalid preview");
  return {columns:value.columns,rows:value.data};
}
