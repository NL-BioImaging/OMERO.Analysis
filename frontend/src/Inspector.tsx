import { useEffect, useMemo, useRef, useState } from "react";
import { SchemaDiagram } from "./SchemaDiagram";
import { CodeEditor } from "./CodeEditor";
import { Button } from "./components/BlueprintControls";
import { ArtifactInspector } from "./components/WorkspacePanels";
import { OmeroBridge } from "./api";
import { PythonRuntime } from "./runtime";
import { runtimeInputName } from "./runtimePaths";
import { browseQuery, pageQuery, quoteIdentifier, resultCsv, PAGE_SIZE } from "./inspectorQuery";
import type { Bootstrap, DataProfile, NotebookDocument, WorkspaceFile } from "./types";
import { NOTEBOOK_PROTOCOL_SCHEMA, type NotebookProtocolContract } from "./notebookProtocol";

type Table = { name: string; columns?: { name: string; type?: string }[] };
type Rows = { columns: string[]; rows: unknown[][] };
export function queryNotebook(file: WorkspaceFile, sql: string, parameters: Record<string, { type: string; value: unknown }> = {}): NotebookDocument {
  const extension = file.name.split(".").pop()!;
  const contract = { schema: NOTEBOOK_PROTOCOL_SCHEMA, inputs: [{
    id: "data", kind: "query", path: `input/${file.name}`, formats: [extension], required: true
  }], results: { path: "results" }, parameters: [], requirements: ["pandas"] };
  return { nbformat: 4, nbformat_minor: 5, metadata: { kernelspec: { name: "python3", language: "python", display_name: "Python 3" } },
    cells: [
      { id: crypto.randomUUID(), cell_type: "code", metadata: { tags: ["omero-analysis-config"] },
        source: `import omero_analysis_notebook as oan\nctx = oan.configure(r'''${JSON.stringify(contract, null, 2)}''')`, outputs: [], execution_count: null },
      { id: crypto.randomUUID(), cell_type: "code", metadata: {},
        source: `import json\ndata = await ctx.query("data", ${JSON.stringify(sql)}, json.loads(${JSON.stringify(JSON.stringify(Object.fromEntries(Object.entries(parameters).map(([key, p]) => [key, p.value]))))}))\ndata`, outputs: [], execution_count: null }
    ] };
}

export function Inspector({ file, bridge, bootstrap, theme, onAttach, onNotebook, onSchema, onDownload }: {
  file: WorkspaceFile | null; bridge: OmeroBridge; bootstrap: Bootstrap; theme: "dark" | "light";
  onDownload: (file: WorkspaceFile) => void;
  onAttach: () => void; onNotebook: (document: NotebookDocument) => void;
  onSchema?: (file: WorkspaceFile, tables: Table[]) => void;
}) {
  // This runtime belongs solely to the Inspector and is never shared with NotebookView.
  const runtime = useMemo(() => new PythonRuntime(bootstrap.runtimeBase, bootstrap.context, 30000), [bootstrap]);
  const [tables, setTables] = useState<Table[]>([]), [table, setTable] = useState("");
  const [columns, setColumns] = useState<string[]>([]), [sort, setSort] = useState("");
  const [descending, setDescending] = useState(false), [filterColumn, setFilterColumn] = useState("");
  const [filter, setFilter] = useState(""), [page, setPage] = useState(0);
  const [mode, setMode] = useState<"browse" | "sql">("browse"), [sql, setSql] = useState("SELECT 1 AS example");
  const [queryRevision, setQueryRevision] = useState(0);
  const [schemaRevision, setSchemaRevision] = useState(0);
  const [executedSql, setExecutedSql] = useState("SELECT 1 AS example");
  const [result, setResult] = useState<Rows>({ columns: [], rows: [] });
  const [profiles, setProfiles] = useState<DataProfile[]>([]);
  const runtimeName = file ? runtimeInputName(file.name) : "";
  const selectedProfile = profiles.find(profile => profile.path === `/input/${runtimeName}`);
  const [status, setStatus] = useState(""), [error, setError] = useState(""), [ready, setReady] = useState(false);
  const [summary, setSummary] = useState<Rows | null>(null), [busy, setBusy] = useState(false);
  const localQueue = useRef<Promise<unknown>>(Promise.resolve());
  const [diagram, setDiagram] = useState(false);
  const generation = useRef(0), queryGeneration = useRef(0);
  const schemaCallback = useRef(onSchema); schemaCallback.current = onSchema;
  const isTabular = !!file && /\.(duckdb|sqlite3?|csv)$/i.test(file.name);
  useEffect(() => () => runtime.dispose(), [runtime]);

  useEffect(() => {
    const current = ++generation.current;
    queryGeneration.current++;
    setDiagram(false); setReady(false); setTables([]); setTable(""); setPage(0); setColumns([]);
    setResult({ columns: [], rows: [] }); setProfiles([]); setSummary(null); setError(""); setFilter(""); setSort(""); setFilterColumn("");
    if (!file) { setBusy(false); setStatus(""); return; }
    setStatus("Loading input schema…"); setBusy(true);
    // Remote schema requests never touch Python and must not hold its queue
    // after the user has selected a different, local file.
    const remote = !!file.annotationId && file.dataQueryMode === "remote";
    const operation = (remote ? Promise.resolve() : localQueue.current.catch(() => undefined)).then(async () => {
      if (current !== generation.current) return;
      let found: Table[] = [];
      if (file.annotationId && file.dataQueryMode === "remote") {
        const schema = await bridge.remoteSchema(file.annotationId, p => {
          if (current === generation.current) setStatus(String(p.message || "Reading remote database schema…"));
        });
        found = schema.tables || [];
      } else if (file.data && /\.(duckdb|sqlite3?|csv|xlsx?|parquet|npy|npz)$/i.test(file.name)) {
        setStatus("Preparing local preview with the shared Inspector runtime…");
        await runtime.syncInputs([file]);
        const discovered = await runtime.profileInputs();
        if (current !== generation.current) return;
        const profile = discovered.find(value => value.path === `/input/${runtimeName}`);
        if (!profile) throw new Error("No preview was returned for the selected input. Retry inspection.");
        if (profile.error) throw new Error(profile.error);
        setProfiles(discovered);
        found = (profile.summary?.tables as Table[] | undefined) || [];
        if (/\.csv$/i.test(file.name)) {
          const preview = profile.summary?.preview as { columns?: string[] } | undefined;
          found = [{ name: "data", columns: (preview?.columns || []).map(name => ({ name })) }];
        }
        if (isTabular) {
          const format = file.name.split(".").pop() as "duckdb" | "sqlite" | "sqlite3" | "csv";
          const contract: NotebookProtocolContract = { schema: NOTEBOOK_PROTOCOL_SCHEMA,
            inputs: [{ id: "data", kind: "query", path: `input/${file.name}`, formats: [format], required: true }],
            results: { path: "results" }, requirements: [], parameters: [] };
          await runtime.configureNotebook({ contract, bindings: [{
            inputId: "data", fileId: file.id, name: file.name, kind: "query", mode: "local", path: `/input/${runtimeName}`, format
          }], parameters: {} });
        }
      } else if (file.data) {
        setReady(true); setStatus("Preview ready."); return;
      } else throw new Error(file.error || "This input is unavailable. Reattach or retry the input from Explorer.");
      if (current !== generation.current) return;
      setTables(found); setTable(found[0]?.name || ""); setReady(true);
      if (found[0]) { const initialSql = `SELECT * FROM ${quoteIdentifier(found[0].name)}`; setSql(initialSql); setExecutedSql(initialSql); setMode("browse"); }
      schemaCallback.current?.(file, found); setStatus(found.length ? "Schema loaded." : "Preview ready.");
    }).catch(e => { if (current === generation.current) { setError(String(e)); setStatus("Inspection failed. Retry below."); } })
      .finally(() => { if (current === generation.current) setBusy(false); });
    if (!remote) localQueue.current = operation;
  }, [file?.id, file?.sha256, file?.state, file?.data, runtime, bridge, schemaRevision]);

  async function query(statement: string, parameters: Record<string, { type: string; value: unknown }> = {}): Promise<Rows> {
    if (!file) throw new Error("Choose an input");
    if (file.annotationId && file.dataQueryMode === "remote") {
      const value = await bridge.remoteQuery(file.annotationId, statement, parameters);
      return { columns: (value.columns || []).map((c: any) => String(c.name ?? c)), rows: value.preview || [] };
    }
    const values = Object.fromEntries(Object.entries(parameters).map(([key, p]) => [key, p.value]));
    const operation = localQueue.current.catch(() => undefined).then(async () => {
      const output = await runtime.runNotebookCell(`import json as _inspector_json\n_inspector_frame = await ctx.query("data", ${JSON.stringify(statement)}, _inspector_json.loads(${JSON.stringify(JSON.stringify(values))}))\n_inspector_json.loads(_inspector_frame.to_json(orient="split", date_format="iso"))`);
    const preview = output.preview as { value?: any };
    const value = preview?.value ?? output.preview;
    if (!value || !Array.isArray((value as any).columns)) throw new Error("Query returned an invalid table preview");
    return { columns: (value as any).columns, rows: (value as any).data || [] };
    });
    localQueue.current = operation.catch(() => undefined);
    return operation;
  }

  const browse = browseQuery(table, columns, filterColumn, filter, sort, descending);
  const activeSql = mode === "browse" ? browse.sql : executedSql;
  useEffect(() => {
    if (!ready || !isTabular || !table) return;
    const current = ++queryGeneration.current;
    setBusy(true); setResult({ columns: [], rows: [] }); setSummary(null);
    setStatus(`Loading rows ${page * PAGE_SIZE + 1}–${(page + 1) * PAGE_SIZE}…`);
    const timer = window.setTimeout(() => {
      setBusy(true); setError(""); setStatus(`Loading rows ${page * PAGE_SIZE + 1}–${(page + 1) * PAGE_SIZE}…`);
      Promise.resolve().then(() => query(pageQuery(activeSql, page), mode === "browse" ? browse.parameters : {})).then(value => {
        if (current === queryGeneration.current) { setResult(value); setStatus(`${value.rows.length} rows shown. Results are bounded to ${PAGE_SIZE} rows per page.`); }
      }).catch(e => { if (current === queryGeneration.current) setError(String(e)); })
        .finally(() => { if (current === queryGeneration.current) setBusy(false); });
    }, 250);
    return () => { window.clearTimeout(timer); queryGeneration.current++; };
  }, [ready, file?.id, table, activeSql, JSON.stringify(browse.parameters), page, mode, queryRevision]);

  async function selectSheet(name: string) {
    if (!file || busy) return;
    const current = generation.current;
    setBusy(true); setError(""); setStatus(`Loading sheet ${name}…`);
    try {
      const discovered = await runtime.profileInputs({ [runtimeName]: name });
      if (current !== generation.current) return;
      const profile = discovered.find(value => value.path === `/input/${runtimeName}`);
      if (!profile) throw new Error("No preview was returned for the selected sheet.");
      if (profile.error) throw new Error(profile.error);
      setProfiles(discovered); setStatus(`Sheet ${name}: preview limited to 100 rows.`);
    } catch (e) {
      if (current === generation.current) setError(String(e));
    } finally {
      if (current === generation.current) setBusy(false);
    }
  }
  async function summarize(name: string) {
    if (busy) return;
    const current = generation.current;
    setBusy(true); setError("");
    try {
      const identifier = quoteIdentifier(name);
      const value = await query(`SELECT COUNT(*) AS rows, COUNT(${identifier}) AS measured, COUNT(*) - COUNT(${identifier}) AS missing, COUNT(DISTINCT ${identifier}) AS distinct_values, MIN(${identifier}) AS minimum, MAX(${identifier}) AS maximum FROM (${mode === "browse" ? browseQuery(table, [], filterColumn, filter).sql : activeSql}) AS summary_source`, mode === "browse" ? browse.parameters : {});
      if (current === generation.current) setSummary(value);
    } catch (e) { if (current === generation.current) setError(String(e)); }
    finally { if (current === generation.current) setBusy(false); }
  }
  function grid(value: Rows) {
    return <div className="inspector-grid"><table><thead><tr>{value.columns.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
      <tbody>{value.rows.map((row, i) => <tr key={i}>{row.map((v, j) => <td key={j}>{v == null ? <em>NULL</em> : String(v)}</td>)}</tr>)}</tbody></table></div>;
  }
  if (!file) return <section className="inspector-tab"><h2>Inspect input data</h2><p>Select an input from Explorer, or attach a database, CSV or spreadsheet.</p><Button onClick={onAttach}>Attach input</Button></section>;
  return <section className="inspector-tab" aria-label="Input Inspector">
    <h2>{file.name}</h2>
    <p role="status">{status}</p>{busy && <progress aria-label="Loading Inspector" />}
    {error && <div role="alert"><p>{error}</p>
      <Button disabled={busy} onClick={() => {
        // Restart only an explicitly retried failed local engine, never on selection.
        if (!ready && file?.data && file.dataQueryMode !== "remote" && /sandbox|worker|runtime/i.test(error)) runtime.stop();
        if (ready) setQueryRevision(value => value + 1); else setSchemaRevision(value => value + 1);
      }}>Retry inspection</Button>
    </div>}
    {isTabular && <>
      <div className="inspector-toolbar">
        <Button aria-pressed={diagram} onClick={() => setDiagram(value => !value)}>Diagram</Button>
        <label>Table or view <select aria-label="Table or view" value={table} onChange={e => { setTable(e.target.value); setPage(0); setColumns([]); setSort(""); setFilterColumn(""); setSummary(null); }}>
          {tables.map(t => <option key={t.name}>{t.name}</option>)}</select></label>
        <Button aria-pressed={mode === "browse"} onClick={() => { setMode("browse"); setPage(0); }}>Browse</Button>
        <Button aria-pressed={mode === "sql"} onClick={() => { setMode("sql"); setPage(0); }}>SQL</Button>
      </div>
      {diagram && <SchemaDiagram tables={tables} selected={table} onSelect={name => { setTable(name); setPage(0); setColumns([]); setSort(""); setFilterColumn(""); setMode("browse"); setDiagram(false); }} />}
      <details><summary>Schema and columns</summary><table><thead><tr><th>Show</th><th>Column</th><th>Type</th><th>Summary</th></tr></thead>
        <tbody>{tables.find(t => t.name === table)?.columns?.map(c => <tr key={c.name}>
          <td><input type="checkbox" aria-label={`Show ${c.name}`} checked={!columns.length || columns.includes(c.name)} disabled={columns.length === 1 && columns[0] === c.name}
            onChange={e => { const all = tables.find(t => t.name === table)?.columns?.map(c => c.name) || []; const chosen = columns.length ? columns : all;
              setColumns(e.target.checked ? [...chosen, c.name] : chosen.filter(n => n !== c.name)); setPage(0); }} /></td>
          <td>{c.name}</td><td>{c.type || "Not specified"}</td><td><Button disabled={busy} onClick={() => void summarize(c.name)}>Summarize</Button></td></tr>)}</tbody></table></details>
      {summary && <section aria-label="Column summary">{grid(summary)}</section>}
      {mode === "browse" ? <div className="inspector-toolbar">
        <label>Filter column <select aria-label="Filter column" value={filterColumn} onChange={e => { setFilterColumn(e.target.value); setPage(0); }}><option value="">Choose column</option>
          {tables.find(t => t.name === table)?.columns?.map(c => <option key={c.name}>{c.name}</option>)}</select></label>
        <input aria-label="Filter contains" placeholder="Contains…" value={filter} onChange={e => { setFilter(e.target.value); setPage(0); }} />
        <label>Sort <select aria-label="Sort" value={sort} onChange={e => { setSort(e.target.value); setPage(0); }}><option value="">Unsorted</option>
          {tables.find(t => t.name === table)?.columns?.map(c => <option key={c.name}>{c.name}</option>)}</select></label>
        <label><input type="checkbox" checked={descending} onChange={e => { setDescending(e.target.checked); setPage(0); }} />Descending</label>
      </div> : <div className="inspector-sql">
        <CodeEditor value={sql} onChange={setSql} language="sql" theme={theme} cspNonce={bootstrap.styleNonce || ""}
          onSave={() => { setExecutedSql(sql); setPage(0); setQueryRevision(value => value + 1); }} />
        <Button disabled={busy} onClick={() => { setExecutedSql(sql); setPage(0); setQueryRevision(value => value + 1); }}>Run query</Button>
      </div>}
      {!busy && grid(result)}
      <div className="inspector-toolbar">
        <Button disabled={busy || page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button><span>Page {page + 1}</span>
        <Button disabled={busy || result.rows.length < PAGE_SIZE} onClick={() => setPage(p => p + 1)}>Next</Button>
        <Button disabled={!result.columns.length || busy} onClick={() => {
          const url = URL.createObjectURL(new Blob([resultCsv(result.columns, result.rows)], { type: "text/csv;charset=utf-8" }));
          const a = document.createElement("a"); a.href = url; a.download = "inspector-page.csv"; a.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        }}>Export this page as CSV</Button>
        <Button disabled={busy || !!error || !ready} onClick={() => onNotebook(queryNotebook(file, pageQuery(activeSql, page), mode === "browse" ? browse.parameters : {}))}>Create notebook from query</Button>
      </div>
    </>}
    {!isTabular && /\.xlsx?$/i.test(file.name) && Array.isArray(selectedProfile?.summary?.sheets) && <label>Sheet
      <select aria-label="Spreadsheet sheet" disabled={busy} value={String(selectedProfile?.summary?.sheet || "")}
        onChange={event => void selectSheet(event.target.value)}>
        {(selectedProfile!.summary.sheets as string[]).map(name => <option key={name}>{name}</option>)}
      </select>
    </label>}
    {!isTabular && <ArtifactInspector item={{ kind: "file", title: file.name, file }} profiles={profiles} canUpload={false} onDownload={onDownload} onAttach={() => {}} />}
  </section>;
}
