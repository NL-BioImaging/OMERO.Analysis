import type { NotebookCell, NotebookDocument } from "./types";
import { parseNotebookProtocol } from "./notebookProtocol";

const HEADER = "# OMERO.Analysis notebook ";
const ESCAPE = "# oa-source-escaped ";
const text = (cell: NotebookCell) => Array.isArray(cell.source) ? cell.source.join("") : cell.source;

/** A readable percent document; metadata travels with each cell, never in outputs. */
export function notebookToSource(document: NotebookDocument): string {
  return HEADER + JSON.stringify({ nbformat: document.nbformat, nbformat_minor: document.nbformat_minor, metadata: document.metadata }) +
    "\n" + document.cells.map(cell => {
      const { source: _, outputs: _outputs, execution_count: _count, ...attributes } = cell;
      const body = text(cell).split("\n").map(line => cell.cell_type === "code"
        ? (/^# %%|^# oa-source-escaped /.test(line) ? ESCAPE + line : line)
        : "# " + line).join("\n");
      return "# %% " + JSON.stringify(attributes) + "\n" + body;
    }).join("\n");
}

export function sourceToNotebook(source: string, previous: NotebookDocument): NotebookDocument {
  const lines = source.split(/\r?\n/);
  if (!lines[0]?.startsWith(HEADER)) throw new Error("Keep the notebook metadata header on the first line.");
  const header = JSON.parse(lines.shift()!.slice(HEADER.length));
  if (header.nbformat !== 4 || !header.metadata || typeof header.metadata !== "object" || Array.isArray(header.metadata))
    throw new Error("The notebook header must contain nbformat 4 and metadata.");
  const cells: NotebookCell[] = [];
  let attributes: NotebookCell | null = null, body: string[] = [];
  const ids = new Set<string>();
  const flush = () => {
    if (!attributes) return;
    const cell = attributes;
    if (!["code", "markdown", "raw"].includes(cell.cell_type)) throw new Error("Unknown cell type in separator.");
    if (!cell.id) cell.id = crypto.randomUUID();
    if (ids.has(cell.id)) throw new Error(`Duplicate cell ID: ${cell.id}`);
    ids.add(cell.id);
    const content = body.map(line => cell.cell_type === "code"
      ? (line.startsWith(ESCAPE) ? line.slice(ESCAPE.length) : line)
      : (line.startsWith("# ") ? line.slice(2) : (() => { throw new Error("Markdown and raw source lines must start with '# '."); })())).join("\n");
    const old = previous.cells.find(item => item.id === cell.id);
    const changed = old && (text(old) !== content || old.cell_type !== cell.cell_type);
    cells.push({
      ...cell, source: content, metadata: { ...(cell.metadata || {}), ...(changed ? { "omero-analysis-stale": true } : {}) },
      ...(cell.cell_type === "code" ? { outputs: old?.outputs || [], execution_count: old?.execution_count ?? null } : {})
    });
  };
  for (const line of lines) {
    if (line.startsWith("# %% ")) {
      flush();
      attributes = JSON.parse(line.slice(5));
      if (!attributes || typeof attributes !== "object" || Array.isArray(attributes)) throw new Error("Invalid cell separator.");
      body = [];
    } else {
      if (!attributes) throw new Error("Each cell must start with a '# %% ' separator.");
      body.push(line);
    }
  }
  flush();
  if (cells.length > 10000) throw new Error("Notebook exceeds 10000 cells.");
  const document: NotebookDocument = { ...previous, ...header, cells };
  parseNotebookProtocol(document); // invalid input contracts cannot overwrite a valid notebook
  return document;
}
