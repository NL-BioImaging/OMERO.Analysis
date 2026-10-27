import { useMemo, useState } from "react";
import { runtimeInputName } from "./runtimePaths";
import { strToU8, zipSync } from "fflate";
import { assistantNotebook, browserHandoffPrompt, workspaceSkillsUrl, BROWSER_TAB_GUIDANCE } from "./browserHandoff";
import { Button } from "./components/BlueprintControls";
import { MarkdownPreview } from "./components/WorkspacePanels";
import type { OmeroBridge } from "./api";
import type { CompatibilitySource } from "./notebookCompatibility";
import type { AnalysisSkillProviderCatalog, WorkflowSkillCatalog, WorkflowSkillPackage, WorkspaceFile } from "./types";

export const AUTHORING_GUIDANCE = `# OMERO.Analysis notebook authoring

${BROWSER_TAB_GUIDANCE}

Create a Python nbformat 4 .ipynb with Markdown explanations and code cells.
The first cell must be a code cell and have metadata.tags containing "omero-analysis-config".
Import omero_analysis_notebook as oan and set ctx = oan.configure(r"""CONFIG_JSON""").
CONFIG_JSON is literal JSON with schema "nl.bioimaging.omero-analysis-notebook.v1",
inputs, results, parameters and requirements.
Analysis presents these declarations in Notebook setup while keeping the Python cell editable.
Run parameters stores chosen run values separately; never hard-code those values over defaults.
A single analytical cell requires explicit Initialize setup; it does not execute preceding analysis cells.
Each input declares id, kind ("query" or "file"), path under input/, and required.
Query inputs declare formats (duckdb, sqlite, sqlite3, csv) and optional schema.tables
with table names and column names/types. File inputs declare extensions such as ".xlsx".
Set results to {"path":"results"}, parameters to [] unless needed, and requirements to
packages actually used. Approved packages: numpy, pandas, scipy, matplotlib, seaborn,
duckdb, pyarrow, python-calamine, xlrd, scikit-image, pypdf.
Use await ctx.query("input_id", "SELECT ...", {"parameter": value}) for databases,
including remote sources. SQL must be a bounded, read-only SELECT; never download
or open a remote database directly. CSV query inputs expose a table named data.
Use ctx.input("file_id") for local file inputs and ctx.results for result files.
Use every relevant supporting input listed in Workspace inputs, including plate templates.
For plate_template.xlsx declare a required file input, for example
{"id":"plate_template","kind":"file","path":"input/plate_template.xlsx","extensions":[".xlsx"],"required":true}.
Include pandas and python-calamine in requirements; read its sheet names with
pd.ExcelFile(ctx.input("plate_template"), engine="calamine").sheet_names, then use
pd.read_excel(ctx.input("plate_template"), sheet_name="actual sheet", engine="calamine").
Inspect the actual template before assuming sheet names, headers, well identifiers or treatments.
Keep raw measurements out of the conversation unless the user deliberately supplies them.
Do not infer zero from missing data, or assume cell segmentation or tracking exists.
Declare requirements for the actual schema. Describe unavailable inputs explicitly.
Optional query-input readiness checks use {"sql":"SELECT ... LIMIT 1","message":"What is missing"}.
Each check must be bounded and read-only. It passes when the query returns at least one row.
Do not use SELECT FALSE to signal failure: a returned row still passes the check.
Avoid notebook widgets, shell commands, network access, arbitrary package installs,
credentials, OMERO tokens and hard-coded server paths. Do not include executed outputs.
For image overlays use source={"kind":"image-input"} in the render recipe.
Analysis uses the user's selected OMERO Image input; image and table inputs are
independent. No shared UUID, workflow metadata or source/result relationship is
required. Check native coordinates, dimensions, channels and zero-based frames/Z.
Legacy workflow references describing UUID navigation do not restrict this
independent image-input mode. Multiple image inputs open a host chooser.

Minimal CSV example (adapt formats and schema to the actual approved inputs):
First code cell metadata: {"tags":["omero-analysis-config"]}
First code cell source:
import omero_analysis_notebook as oan
ctx = oan.configure(r'''{"schema":"nl.bioimaging.omero-analysis-notebook.v1","inputs":[{"id":"table","kind":"query","path":"input/data.csv","formats":["csv"],"required":true}],"results":{"path":"results"},"parameters":[],"requirements":["pandas"]}''')
Next code cell source:
rows = await ctx.query("table", "SELECT * FROM data LIMIT 100")
rows
Use actual database table names for DuckDB/SQLite, not the CSV-only data table.
Use code or markdown cells only, with unique cell IDs, empty outputs and null execution_count.
`;

export function schemaContext(inputs: WorkspaceFile[], schemas: Record<string, CompatibilitySource["schema"]>) {
  return { schema: "nl.bioimaging.analysis-schema-context.v1", inputs: inputs.filter(file => file.source !== "result" && file.role !== "chat-attachment" && !file.deletedAt).map(file => ({
    name: file.name, format: file.name.split(".").pop()?.toLowerCase() || "",
    role: file.role || "input", input_kind: file.role !== "template-input" && /\.(duckdb|sqlite3?|csv)$/i.test(file.name) ? "query" : "file",
    input_path: `input/${runtimeInputName(file.name)}`,

    capabilities: file.dataQueryMode === "remote" ? ["read-only-remote-query"] : ["local-preview"],
    tables: schemas[file.id]?.tables?.map(table => ({ name: table.name, columns: table.columns?.map(c => ({ name: c.name, type: c.type })) })) ?? null
  })) };
}
function download(name: string, content: string | Uint8Array) {
  const url = URL.createObjectURL(new Blob([typeof content === "string" ? content : new Uint8Array(content)], { type: typeof content === "string" ? "text/plain;charset=utf-8" : "application/zip" }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function canDownloadSupportingInput(file: WorkspaceFile) {
  return file.source !== "result" && !file.deletedAt && file.role !== "chat-attachment"
    && !/\.(duckdb|sqlite3?|parquet)$/i.test(file.name)
    && (file.role === "template-input" || /\.xlsx?$/i.test(file.name))
    && file.size <= 32 * 1024 * 1024 && Boolean(file.data || file.annotationId);
}

export function SkillsView({ bridge, catalog, viewerCatalog, inputs, schemas, workspaceId, onImport, onDownloadInput }:  {
  bridge: OmeroBridge; catalog: WorkflowSkillCatalog | null; viewerCatalog: AnalysisSkillProviderCatalog | null;
  inputs: WorkspaceFile[]; schemas: Record<string, CompatibilitySource["schema"]>; workspaceId?: string;
  onImport?: (file: File) => Promise<void>;
  onDownloadInput?: (file: WorkspaceFile) => Promise<void>;
}) {
  const [task, setTask] = useState("");
  const [includeContext, setIncludeContext] = useState(true);
  const [client, setClient] = useState("chatgpt");
  const [guidance, setGuidance] = useState("");
  const [status, setStatus] = useState(""), [busy, setBusy] = useState(false);
  const [filename, setFilename] = useState("analysis.ipynb"), [notebookJson, setNotebookJson] = useState("");
  const [packages, setPackages] = useState<Record<string, WorkflowSkillPackage>>({});
  const [loadedSchemas, setLoadedSchemas] = useState<Record<string, { version: string; schema: CompatibilitySource["schema"] }>>({});
  const sourceVersion = (file: WorkspaceFile) => `${file.annotationId}:${file.sha256}:${file.state}`;
  const context = useMemo(() => {
    const current = { ...schemas };
    for (const file of inputs) if (loadedSchemas[file.id]?.version === sourceVersion(file)) current[file.id] = loadedSchemas[file.id].schema;
    return JSON.stringify(schemaContext(inputs, current), null, 2);
  }, [inputs, schemas, loadedSchemas]);
  const skills = catalog?.workflows.flatMap(entry => entry.skills) || [];
  const url = workspaceSkillsUrl(window.location.href, workspaceId);
  const prompt = browserHandoffPrompt(url, task, includeContext, client);

  async function load(key: string, loader: () => Promise<WorkflowSkillPackage>) {
    const value = packages[key] || await loader();
    setPackages(current => ({ ...current, [key]: value }));
    return value;
  }
  async function action(operation: () => Promise<void>) {
    setBusy(true); setStatus("");
    try { await operation(); } catch (error) { setStatus(String(error)); }
    finally { setBusy(false); }
  }
  function packageText(value: WorkflowSkillPackage) {
    return `Source: ${JSON.stringify(value.source)}\nSHA256: ${value.skill.sha256}\n\n` + value.files.map(file => `# ${file.path}\n\n${file.content}`).join("\n\n");
  }
  function packageFiles(value: WorkflowSkillPackage) {
    const files: Record<string, Uint8Array> = {};
    for (const file of value.files) {
      if (file.path.startsWith("/") || file.path.includes("\\") || file.path.split("/").includes("..")) throw new Error("Unsafe skill path");
      files[file.path] = strToU8(file.content);
    }
    files["provenance.json"] = strToU8(JSON.stringify({ source: value.source, sha256: value.skill.sha256 }, null, 2));
    return files;
  }
  async function readGuidance() {
    // Publish one complete snapshot only after every configured package was retrieved.
    setGuidance("");
    const texts = [AUTHORING_GUIDANCE];
    for (const skill of skills) {
      const value = await load(`${skill.workflow_key}:${skill.name}`, () => bridge.loadWorkflowSkill(skill.workflow_key, skill.name));
      texts.push(packageText(value));
    }
    if (viewerCatalog?.skills.length) texts.push(packageText(await load("viewer", () => bridge.loadZarrViewerSkill())));
    const text = texts.join("\n\n---\n\n");
    if (includeContext) {
      // Only schema metadata is requested; no row query or browser Python runtime.
      const collected: typeof loadedSchemas = {};
      for (const file of inputs) if (!file.deletedAt && file.source !== "result" && file.annotationId && file.dataQueryMode === "remote") {
        const value = await bridge.remoteSchema(file.annotationId);
        collected[file.id] = { version: sourceVersion(file), schema: { tables: value.tables?.map((table: any) => ({ name: String(table.name), columns: table.columns?.map((column: any) => ({ name: String(column.name), type: column.type == null ? undefined : String(column.type) })) })) } };
      }
      setLoadedSchemas(collected);
    }
    setGuidance(text);
    setStatus("Guidance is ready below. The browser assistant can read it directly.");
    return text;
  }
  return <section className="skills-tab"><div className="skills-handoff">
    <h2>Let your browser assistant make a notebook</h2>
    <p>Tell ChatGPT or Claude what you want. It can read the skills here, create a notebook and import it into this workspace for your review.</p>
    <label>What would you like to analyse?<textarea className="skills-question" aria-label="Your analysis question" placeholder="For example: plot the number of cells per well, keeping timepoints separate." value={task} onChange={e => setTask(e.target.value)} /></label>
    <label>Use <select aria-label="External chat application" value={client} onChange={e => setClient(e.target.value)}><option value="chatgpt">ChatGPT with Chrome</option><option value="claude">Claude in Chrome</option></select></label>
    <label><input type="checkbox" checked={includeContext} onChange={e => setIncludeContext(e.target.checked)} /> Share input names and table structure</label>
    <p className="muted">Optional schema context only: no measurement rows, images, notebook outputs, passwords or tokens.</p>
    {includeContext && <details className="skills-context"><summary>Preview the schema to share</summary><pre>{context}</pre><p>Read guidance also retrieves approved remote input schemas automatically. Local schemas that remain missing must first be inspected in Analysis.</p></details>}
    <Button disabled={busy} onClick={() => void action(async () => {
      await navigator.clipboard.writeText(prompt);
      setStatus("Instruction copied. Paste it into your browser-enabled chat to start.");
    })}>Copy browser instruction</Button>
    <p>Paste it into {client === "chatgpt" ? "ChatGPT desktop with @Chrome" : "Claude with its Chrome extension"}. Allow access to this Analysis page. The assistant imports the notebook; you review it before running.</p>
    <details><summary>First time using a browser assistant?</summary>
      <p>Keep this workspace open and signed in. Enable browser access in your chat application and approve access to this site. Analysis cannot start a chat or grant browser permissions for you. A cloud-only browser cannot reach this local workspace.</p>
      <p><a href="https://learn.chatgpt.com/use-cases/use-your-computer-with-codex" target="_blank" rel="noreferrer">ChatGPT browser setup</a> · <a href="https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome" target="_blank" rel="noreferrer">Claude in Chrome setup</a></p>
      <label>Instruction to copy<textarea className="skills-prompt" aria-label="External chat prompt" readOnly value={prompt} /></label>
    </details>
    <details className="skills-inputs"><summary>Workspace inputs ({inputs.filter(file => !file.deletedAt && file.source !== "result" && file.role !== "chat-attachment").length})</summary>
      <p>All attached inputs are listed here, including plate templates. Supporting spreadsheets/templates can be downloaded for your browser assistant to read. Downloads contain the file contents; they only happen when requested. Databases stay remote and use read-only queries.</p>
      <ul>{inputs.filter(file => !file.deletedAt && file.source !== "result" && file.role !== "chat-attachment").map(file => <li key={file.id}>
        <div><strong>{file.name}</strong><small>{file.role === "template-input" ? "Plate template / supporting input" : "Input"} · {file.name.split(".").pop()?.toUpperCase()}<br /><code>{`input/${runtimeInputName(file.name)}`}</code></small></div>
        {onDownloadInput && canDownloadSupportingInput(file) && <Button disabled={busy || !includeContext} title={includeContext ? `Download ${file.name} for the assistant to read` : "Enable input sharing before downloading for your assistant"}
          onClick={() => void action(async () => { await onDownloadInput(file); setStatus(`Downloaded ${file.name}. The assistant can read it and declare its file input in the notebook.`); })}>Download input {file.name}</Button>}
      </li>)}</ul>
      {!inputs.length && <p>Attach inputs using Explorer before asking for an analysis notebook.</p>}
    </details>
    <details className="skills-agent-area"><summary>Browser assistant area</summary>
      <p>For the assistant: read the guidance and any approved schema above, then submit a new notebook below. Reading guidance does not query measurements or start Python.</p>
      <Button disabled={busy} onClick={() => void action(async () => { await readGuidance(); })}>Read guidance</Button>
      {guidance && <pre className="skills-agent-guide" aria-label="Notebook and workflow guidance">{guidance}</pre>}
      <div className="skills-agent-return">
        <h3>Return the created notebook</h3>
        <label>Notebook filename<input aria-label="Notebook filename" value={filename} onChange={e => setFilename(e.target.value)} /></label>
        <label>Notebook JSON<textarea className="skills-agent-json" aria-label="Notebook JSON" placeholder="Paste the complete nbformat 4 .ipynb JSON" value={notebookJson} onChange={e => setNotebookJson(e.target.value)} /></label>
        <Button disabled={busy || !onImport || !notebookJson.trim()} onClick={() => void action(async () => {
          const file = assistantNotebook(filename, notebookJson);
          await onImport!(file);
          setNotebookJson("");
          setStatus(`Imported ${file.name}. Review compatibility in Notebooks before running.`);
        })}>Import created notebook</Button>
        <p>Uses the usual notebook validation and automatic saving. Creates a new notebook, clears execution outputs and never runs code.</p>
      </div>
    </details>
    <details><summary>Read or download skills manually</summary>
      <p>You can also attach guidance to a chat without browser access, then use Notebooks → Upload for its .ipynb.</p>
      <div className="skills-actions"><Button onClick={() => download("notebook-authoring.md", AUTHORING_GUIDANCE)}>Download authoring guidance</Button>
        <Button disabled={busy} onClick={() => void action(async () => {
          const text = await readGuidance();
          const files: Record<string, Uint8Array> = { "guidance.md": strToU8(text), "prompt.txt": strToU8("Create a compatible, unexecuted .ipynb using guidance.md. " + (task.trim() || "Ask me for my analysis question.") + " Return the .ipynb for Notebooks > Upload."), "START-HERE.txt":strToU8("Attach guidance.md and optional workspace-schema.json to your chat. Request an unexecuted .ipynb, then use Notebooks > Upload and review compatibility before running.") };
          if (includeContext) files["workspace-schema.json"] = strToU8(context);
          download("analysis-guidance.zip", zipSync(files));
          setStatus("Guidance bundle downloaded. Attach the extracted files to your chat.");
        })}>Download guidance bundle</Button></div>
      <details><summary>Notebook authoring guidance</summary><MarkdownPreview markdown={AUTHORING_GUIDANCE} /></details>
      {skills.map(skill => <details key={`${skill.workflow_key}:${skill.name}`}><summary>{skill.name.replace(/[-_]/g," ")}</summary><p>{skill.description}</p>
        <Button disabled={busy} onClick={() => void action(async () => { setGuidance(packageText(await load(`${skill.workflow_key}:${skill.name}`, () => bridge.loadWorkflowSkill(skill.workflow_key,skill.name)))); })}>Preview guidance</Button>
        <Button disabled={busy} onClick={() => void action(async () => { const value = await load(`${skill.workflow_key}:${skill.name}`, () => bridge.loadWorkflowSkill(skill.workflow_key,skill.name)); download(`${skill.name}.zip`,zipSync(packageFiles(value))); })}>Download skill</Button>
      </details>)}
      {guidance && <details><summary>Guidance preview</summary><pre className="skills-agent-guide">{guidance}</pre></details>}
    </details>
    <p role="status" aria-live="polite">{status}</p>
  </div></section>;
}
