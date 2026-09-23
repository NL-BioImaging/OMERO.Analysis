import { useEffect, useMemo, useState } from "react";
import type { OmeroBridge } from "../api";
import type { AnalysisWorkspace, SharedLibraryCatalogue, SharedLibraryItem } from "../types";
import { serializeNotebook } from "../NotebookView";
import { sanitizeProtocolNotebook } from "../notebookProtocol";
import { compatibilityLabel, notebookCompatibility, type CompatibilitySource } from "../notebookCompatibility";
import { Input } from "./BlueprintControls";

export function SharedLibrary({ bridge, workspace, onImport, inspectLocal, initialSelection = [] }: {
  bridge: OmeroBridge; workspace: AnalysisWorkspace;
  onImport: (libraryId: string, items: SharedLibraryItem[]) => Promise<void>;
  inspectLocal: () => Promise<Record<string, CompatibilitySource["schema"]>>;
  initialSelection?: Array<{ id: string; revision: string; libraryId: string }>;
}) {
  const [catalogue, setCatalogue] = useState<SharedLibraryCatalogue | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const [query, setQuery] = useState(""), [compatibleOnly, setCompatibleOnly] = useState(false);
  const [schemas, setSchemas] = useState<Record<string, { stamp: string; schema: CompatibilitySource["schema"] }>>({});
  const [history, setHistory] = useState<Record<string, string[]>>({});
  const [file, setFile] = useState<File | null>(null), [name, setName] = useState("");
  const [kind, setKind] = useState<SharedLibraryItem["kind"]>("notebook");
  const [reviewed, setReviewed] = useState(false);
  const load = async (refresh = false) => {
    setBusy(true); setError("");
    try {
      const result = await bridge.sharedLibrary(refresh);
      setCatalogue(result);
      if (!refresh) {
        const matches = initialSelection.filter(ref => ref.libraryId === result.libraryId &&
          result.items.some(i => i.id === ref.id && i.revision === ref.revision && i.available));
        setSelected(new Set(matches.map(i => i.id)));
        if (matches.length !== initialSelection.length) setError("Some selected shared revisions changed or are unavailable. Review the refreshed catalogue before importing.");
      }
    } catch (e) { setError(String(e)); }
    finally { setBusy(false); }
  };
  useEffect(() => { void load(); }, [bridge]);
  const inputs = workspace.files.filter(f => !f.deletedAt && f.state === "ready" && f.source !== "result" && f.role !== "chat-attachment");
  const sources = useMemo(() => [
    ...inputs.map(f => ({ id: f.id, name: f.name, schema: schemas[f.id]?.stamp === `${f.sha256}:${f.remoteSchemaDigest}` ? schemas[f.id].schema : undefined })),
    ...(catalogue?.items || []).filter(i => i.kind === "template" && i.available && selected.has(i.id)).map(i => ({ id: i.id, name: i.name }))
  ], [workspace.files, schemas, catalogue, selected]);
  const check = async () => {
    setBusy(true); setError("");
    const next = { ...schemas }, failures: string[] = [];
    let local: Record<string, CompatibilitySource["schema"]> = {};
    try { local = await inspectLocal(); } catch (e) { failures.push(`Local inspection: ${String(e)}`); }
    for (const input of inputs.filter(f => /\.(csv|duckdb|sqlite3?)$/i.test(f.name))) {
      if (input.data) {
        if (local[input.id]) next[input.id] = { stamp: `${input.sha256}:${input.remoteSchemaDigest}`, schema: local[input.id] };
        else failures.push(`${input.name}: local schema unavailable`);
        continue;
      }
      if (!input.annotationId) { failures.push(`${input.name}: schema unavailable`); continue; }
      try { next[input.id] = { stamp: `${input.sha256}:${input.remoteSchemaDigest}`, schema: await bridge.remoteSchema(input.annotationId) }; }
      catch { failures.push(`${input.name}: schema unavailable`); }
    }
    setSchemas(next); setError(failures.join("; ")); setBusy(false);
  };
  if (catalogue?.disabled) return null;
  const chooseFile = (value: File | null) => {
    setFile(value); setName(value?.name || ""); setKind(value?.name.toLowerCase().endsWith(".ipynb") ? "notebook" : "template"); setReviewed(false);
  };
  const publish = async () => {
    if (!catalogue || !file || !reviewed) return;
    setBusy(true); setError("");
    try {
      const previous = catalogue.items.find(i => i.kind === kind && i.name === name);
      await bridge.publishSharedItem(catalogue, file, kind, name, previous?.revision);
      chooseFile(null); await load(true);
    } catch (e) { setError(String(e)); }
    finally { setBusy(false); }
  };
  return <section className="shared-library" aria-label="Shared library"><details className="library-panel" open>
    <summary><span className="library-panel-toggle" /><strong>Shared notebooks and plate templates</strong><small>{catalogue?.items.filter(i => i.available && selected.has(i.id)).length || 0} selected</small></summary>
    <div className="library-panel-body">
    <p>Copy shared notebooks and plate templates into this Workspace. Your copies keep their own revision.</p>
    {error && <p role="alert">{error}</p>}
    {catalogue && !catalogue.available && <p role="status">{catalogue.error}</p>}
    <div className="shared-library-controls">
      <label className="library-search"><span className="sr-only">Filter shared items</span>
        <Input type="search" placeholder="Filter notebooks and plate templates…" value={query} onChange={e => setQuery(e.target.value)} /></label>
      <button disabled={busy} onClick={() => void load(true)}>Refresh shared library</button>
    </div>
    {catalogue?.available && <>
      <div className="shared-library-controls">
      <label><input type="checkbox" checked={compatibleOnly} onChange={e => setCompatibleOnly(e.target.checked)} />Compatible notebooks only</label>
      <button disabled={busy} onClick={() => void check()}>Check compatibility</button>
      </div>
      <p>Compatibility checks declared inputs, not scientific suitability. Import notebooks to supply missing inputs later.</p>
      <div className="analysis-library-tree">{(["template", "notebook"] as const).map(group => {
        const visible = catalogue.items.filter(i => i.kind === group && i.name.toLowerCase().includes(query.toLowerCase()))
          .filter(i => group !== "notebook" || !compatibleOnly || notebookCompatibility(i.contract, sources).status === "compatible");
        return <details key={group} className="library-tree-group" open>
        <summary><span className="library-tree-chevron">›</span><img className="library-tree-folder" src="/static/webclient/image/folder_yellow16.png" alt="" />
          <strong>{group === "notebook" ? "Notebooks" : "Plate templates"}</strong><small>{visible.length}</small></summary>
        <ul>{visible.map(item => {
          const match = notebookCompatibility(item.contract, sources);
          if (group === "notebook" && compatibleOnly && match.status !== "compatible") return null;
          return <li key={item.id}>
            <label><input type="checkbox" aria-label={item.name} disabled={busy || !item.available} checked={selected.has(item.id)} onChange={e => setSelected(prev => {
              const next = new Set(prev); e.target.checked ? next.add(item.id) : next.delete(item.id); return next;
            })} /><span className={`library-item-icon ${group}`}>{group === "notebook" ? "NB" : "XLS"}</span>
              <span className="library-item-copy"><strong>{item.name}</strong>
                <small>{item.size ?? 0} bytes · {item.revisionCount} revision(s)</small>
                <small className="shared-item-compatibility">{!item.available ? item.error : group === "notebook"
                  ? `${compatibilityLabel[match.status]} — ${match.reasons.join("; ")}` : "Plate template · independent Workspace input"}</small>
              </span></label>
            {item.revisionCount > 0 && <button disabled={busy} onClick={async () => {
              try { const value = await bridge.sharedItemHistory(item.id); setHistory(prev => ({ ...prev, [item.id]: value.revisions.map(r => `${r.revision.slice(0, 12)} · ${new Date(r.observedAt * 1000).toLocaleString()} · ${r.origin}`) })); }
              catch (e) { setError(String(e)); }
            }}>Revision history</button>}
            {history[item.id] && <ul>{history[item.id].map(r => <li key={r}>{r}</li>)}</ul>}
          </li>;
        })}</ul>
        {!visible.length && <p className="library-tree-empty">No matching items.</p>}
      </details>})}</div>
      {!catalogue.items.length && <p>No shared items yet.</p>}
      <button disabled={busy || !catalogue.items.some(i => i.available && selected.has(i.id))} onClick={async () => {
        setBusy(true); setError("");
        try { await onImport(catalogue.libraryId, catalogue.items.filter(i => i.available && selected.has(i.id))); setSelected(new Set()); }
        catch (e) { setError(String(e)); }
        finally { setBusy(false); }
      }}>Import selected shared items</button>
      {catalogue.canPublish && <details className="shared-publish">
        <summary>Publish to shared library</summary>
        <p>Destination: {catalogue.destination}</p>
        <p>Visible to groups: {catalogue.groups?.map(g => `${g.name} (${g.id})`).join(", ")}</p>
        <label>Upload notebook or template <input type="file" accept=".ipynb,.xlsx,.xls,.csv" onChange={e => chooseFile(e.target.files?.[0] || null)} /></label>
        <label>Or choose a Workspace item <select value="" onChange={e => {
          const [type, id] = e.target.value.split(":");
          if (type === "notebook") {
            const record = workspace.notebooks.find(n => n.id === id);
            if (record) chooseFile(new File([serializeNotebook(sanitizeProtocolNotebook(record.document)).slice().buffer as ArrayBuffer], record.name.endsWith(".ipynb") ? record.name : record.name + ".ipynb"));
          } else {
            const record = inputs.find(f => f.id === id);
            if (record?.data) chooseFile(new File([record.data], record.name, { type: record.type }));
          }
        }}><option value="">Choose…</option>
          {workspace.notebooks.filter(n => !n.deletedAt).map(n => <option key={n.id} value={`notebook:${n.id}`}>{n.name}</option>)}
          {inputs.filter(f => f.data && /\.(xlsx?|csv)$/i.test(f.name)).map(f => <option key={f.id} value={`template:${f.id}`}>{f.name}</option>)}
        </select></label>
        {file && <>
          <p>{file.name} · {file.size} bytes · {kind === "notebook" ? "Notebook outputs and widget state are removed." : "The whole plate template is shared."}</p>
          <label>Shared filename <input value={name} onChange={e => { setName(e.target.value); setReviewed(false); }} /></label>
          <p>{catalogue.items.some(i => i.kind === kind && i.name === name) ? "Publishes a new revision of the existing item." : "Publishes a new shared item."}</p>
          <label><input type="checkbox" checked={reviewed} onChange={e => setReviewed(e.target.checked)} />I reviewed this file and its destination groups.</label>
          <button disabled={busy || !reviewed || !name} onClick={() => void publish()}>Publish to shared library</button>
        </>}
      </details>}
    </>}
    </div></details></section>;
}
