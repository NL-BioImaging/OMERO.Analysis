import { runLabel, runParametersLabel } from "../notebookResults";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";

import { ChevronRight, FolderClose, Document, Database, Manual, Media, Paperclip, Refresh, Search, CollapseAll, ExpandAll, Trash, Undo } from "@blueprintjs/icons";
import { compatibilityLabel, type Compatibility } from "../notebookCompatibility";
import { resultGroups, resultOwner } from "../ExplorerModel";
import type { NotebookRecord, WorkspaceFile } from "../types";

function SelectionCheckbox({ label, keys, selected, busy, onChange }: {
  label: string; keys: string[]; selected: Set<string>; busy: boolean;
  onChange: (keys: string[], checked: boolean) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const count = keys.filter(key => selected.has(key)).length;
  useEffect(() => { if (input.current) input.current.indeterminate = count > 0 && count < keys.length; }, [count, keys.length]);
  return <input ref={input} type="checkbox" aria-label={`Select ${label}`}
    checked={keys.length > 0 && count === keys.length} disabled={busy || !keys.length}
    onClick={event => event.stopPropagation()} onChange={event => onChange(keys, event.target.checked)} />;
}

export interface ExplorerSource { id: string; name: string; type: string; objectId: number; }
export function WorkspaceExplorer({ name, inputs, notebooks, results, sources = [], selectedSourceId,
  selectedFileId, selectedNotebookId, compatibility, query, onQuery, onFile, onNotebook, onSource,
  onAttach, onRefresh, onDropFiles, onDelete, onUndo, canUndo, busy = false }: {
  name: string; inputs: WorkspaceFile[]; notebooks: NotebookRecord[]; results: WorkspaceFile[];
  sources?: ExplorerSource[]; selectedSourceId?: string | null; onSource?: (id: string) => void;
  selectedFileId: string | null; selectedNotebookId: string | null;
  compatibility: Record<string, Compatibility>; query: string; onQuery: (query: string) => void;
  onFile: (id: string) => void; onNotebook: (id: string) => void;
  onAttach: () => void; onRefresh: () => void; onDropFiles: (files: FileList) => void;
  onDelete?: (items: {kind: "file" | "notebook"; id: string}[]) => void;
  onUndo?: () => void; canUndo?: boolean; busy?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const matches = (value: string) => value.toLowerCase().includes(query.toLowerCase().trim());
  const canRemove = (file: WorkspaceFile) => file.source === "result" || !(/\.(duckdb|sqlite3?|db3?|csv|tsv)$/i.test(file.name) || /csv|sqlite|duckdb/i.test(file.type || ""));
  const selectable = [...inputs.filter(canRemove), ...results].map(f => `file:${f.id}`).concat(notebooks.map(n => `notebook:${n.id}`));
  const selectedItems = [...selected].filter(key => selectable.includes(key));
  const [contextMenu, setContextMenu] = useState<{ label: string; keys: string[]; x: number; y: number; trigger: HTMLElement } | null>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuAction = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!contextMenu) return;
    menuAction.current?.focus();
    const dismiss = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node)) setContextMenu(null); };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); contextMenu.trigger.focus(); setContextMenu(null); }
    };
    const scroll = () => setContextMenu(null);
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    window.addEventListener("scroll", scroll, true);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("scroll", scroll, true);
    };
  }, [contextMenu]);
  useEffect(() => { if (busy) setContextMenu(null); }, [busy]);
  function toggle(keys: string[], checked: boolean) {
    setSelected(current => { const next = new Set(current); keys.forEach(key => checked ? next.add(key) : next.delete(key)); return next; });
  }
  function remove(keys: string[]) {
    if (busy || !onDelete) return;
    const present = [...new Set(keys)].filter(key => selectable.includes(key));
    if (present.length) onDelete(present.map(key => ({kind: key.startsWith("file:") ? "file" : "notebook", id: key.slice(key.indexOf(":") + 1)})));
    toggle(present, false); setContextMenu(null);
  }
  function nodeActions(label: string, keys: string[]) {
    function open(event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) {
      if (!onDelete || busy) return;
      event.preventDefault(); event.stopPropagation();
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const pointer = "clientX" in event && (event.clientX !== 0 || event.clientY !== 0);
      setContextMenu({ label, keys, trigger: target.querySelector<HTMLElement>("button,input") || target,
        x: Math.max(8, Math.min(pointer ? event.clientX : rect.left, window.innerWidth - 268)),
        y: Math.max(8, Math.min(pointer ? event.clientY : rect.bottom, window.innerHeight - 110)) });
    }
    return { onContextMenu: open, onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) open(event);
    } };
  }
  function checkbox(kind: "file" | "notebook", id: string, label: string) {
    return <SelectionCheckbox label={label} keys={[`${kind}:${id}`]} selected={selected} busy={busy} onChange={toggle} />;
  }
  function filesView(files: WorkspaceFile[]) {
    return <ul className="browser-list">{files.filter(f => matches(f.name)).map(file => {
      const TypeIcon = /\.(duckdb|sqlite3?)$/i.test(file.name) ? Database : /\.(png|jpe?g|svg|mp4)$/i.test(file.name) ? Media : Document;
      const size = file.size >= 1048576 ? `${(file.size / 1048576).toFixed(1)} MiB` : file.size >= 1024 ? `${(file.size / 1024).toFixed(1)} KiB` : `${file.size} B`;
      const provenance = file.source === "result" ? `\n${runLabel(file)}\n${runParametersLabel(file, notebooks.find(notebook => notebook.id === resultOwner(file, notebooks)))}` : "";
      const title = `${file.name}${provenance}\n${file.dataQueryMode === "remote" ? "Remote" : file.source === "omero" ? "OMERO" : "Local"} · ${size}${file.state !== "ready" ? ` · ${file.error || file.state}` : ""}`;
      return <li key={file.id} className={`explorer-selectable ${canRemove(file) ? "" : "protected-input"}`} {...(canRemove(file) ? nodeActions(file.name, [`file:${file.id}`]) : {})}>{canRemove(file) && checkbox("file", file.id, file.name)}
        <button className={`compact-file-row ${selectedFileId === file.id ? "selected" : ""}`} title={title}
          aria-pressed={selectedFileId === file.id} onClick={() => onFile(file.id)}>
          <TypeIcon size={15} aria-hidden="true" /><span className="compact-file-name"><strong>{file.name}</strong></span>
        </button></li>;
    })}</ul>;
  }
  function folder(title: string, count: number, children: ReactNode, key = title, selection?: { label: string; files: WorkspaceFile[] }, description?: string) {
    const keys = selection?.files.map(file => `file:${file.id}`) || [];
    return <details key={`${key}:${collapsed}`} className="browser-folder" open={!collapsed || !!query}>
      <summary title={description ? `${title}\n${description}` : title} className={selection ? "selectable-folder" : undefined} {...(selection ? nodeActions(selection.label, keys) : {})}>
        <ChevronRight size={12} className="folder-chevron" aria-hidden="true" />
        {selection && <SelectionCheckbox label={selection.label} keys={keys} selected={selected} busy={busy} onChange={toggle} />}
        <FolderClose size={16} className="icon-folder" aria-hidden="true" /><span className="explorer-folder-label"><strong>{title}</strong></span><small>{count}</small></summary>
      <div className="explorer-children">{children}</div></details>;
  }
  function outputTree(files: WorkspaceFile[], key: string, label: string, title = "Results") {
    const runs = new Map<string, WorkspaceFile[]>();
    for (const file of files) {
      const run = file.notebookRunId || file.notebookRunStartedAt || "legacy";
      runs.set(run, [...(runs.get(run) || []), file]);
    }
    const info = (values: WorkspaceFile[]) => `${runLabel(values[0])}\n${runParametersLabel(values[0], notebooks.find(notebook => notebook.id === key))}`;
    const groups = (values: WorkspaceFile[], prefix: string) => resultGroups(values)
      .filter(group => matches(group.name) || group.files.some(f => matches(f.name)))
      .map(group => folder(group.name, group.files.length, filesView(group.files), `${prefix}:${group.name}`,
        {label: `result group ${group.name} in ${label}`, files: group.files}, info(values)));
    // A single result set needs no additional run row or indentation.
    const children = runs.size === 1 ? groups(files, key) : [...runs].reverse().map(([run, values], index) =>
      folder(`Result set ${index + 1}`, values.length, groups(values, `${key}:${run}`), `${key}:${run}`,
        {label: `result set ${index + 1} in ${label}`, files: values}, info(values)));
    return folder(title, files.length, children, key,
      {label: title === "Other results" ? "other results" : `results for ${label}`, files},
      runs.size === 1 ? info(files) : `${runs.size} result sets. Hover a set to see its run and parameters.`);
  }

  const unassigned = results.filter(file => !resultOwner(file, notebooks));
  return <div className="compact-explorer" onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; }}
    onDrop={event => { event.preventDefault(); onDropFiles(event.dataTransfer.files); }}>
    <div className="file-browser-heading"><h2>Explorer</h2><div className="compact-explorer-actions" role="toolbar" aria-label="Explorer actions">
      <button title="Attach input" aria-label="Attach input" onClick={onAttach}><Paperclip size={15} /></button>
      <button title="Refresh workspace" aria-label="Refresh workspace" onClick={onRefresh}><Refresh size={15} /></button>
      <button title={collapsed ? "Expand folders" : "Collapse folders"} aria-label={collapsed ? "Expand folders" : "Collapse folders"} onClick={() => setCollapsed(!collapsed)}>{collapsed ? <ExpandAll size={15} /> : <CollapseAll size={15} />}</button>
      {onDelete && <button title="Remove selected items from this workspace" aria-label="Remove selected items" disabled={!selectedItems.length || busy} onClick={() => remove(selectedItems)}><Trash size={15} /></button>}
      {onUndo && <button title="Undo last removal" aria-label="Undo last removal" disabled={!canUndo || busy} onClick={onUndo}><Undo size={15} /></button>}
    </div></div>
    <label className="explorer-search compact-explorer-search"><Search size={13} aria-hidden="true" /><input type="search" aria-label="Search workspace files" placeholder="Find a file…" value={query} onChange={event => onQuery(event.target.value)} /></label>
    <div className="explorer-selection"><label><input type="checkbox" aria-label="Select all workspace items" disabled={busy} checked={selectable.length > 0 && selectable.every(key => selected.has(key))}
      onChange={event => setSelected(event.target.checked ? new Set(selectable) : new Set())} />Select all</label><span>{selectedItems.length ? `${selectedItems.length} selected` : ""}</span></div>
    <div className="browser-path" title={name}><FolderClose size={14} aria-hidden="true" /><span>{name}</span></div>
    {folder("Inputs", inputs.length + sources.length, <>{sources.filter(s => matches(s.name)).map(source => <button key={source.id}
      className={`compact-file-row ${source.id === selectedSourceId ? "selected" : ""}`} aria-pressed={source.id === selectedSourceId}
      title={`${source.type} ${source.objectId} · ${source.name}`} onClick={() => onSource?.(source.id)}><Media size={15} /><span className="compact-file-name"><strong>{source.name}</strong></span></button>)}{filesView(inputs)}</>)}
    {folder("Notebooks", notebooks.length, notebooks.filter(notebook => matches(notebook.name) || results.some(file => resultOwner(file, notebooks) === notebook.id && matches(file.name))).map(notebook => {
      const match = compatibility[notebook.id] || {status: "unchecked", reasons: ["Compatibility is being checked"]};
      const owned = results.filter(file => resultOwner(file, notebooks) === notebook.id);
      return <div key={notebook.id} className="explorer-notebook"><div className="explorer-selectable" {...nodeActions(notebook.name, [`notebook:${notebook.id}`])}>{checkbox("notebook", notebook.id, notebook.name)}
        <button className={`compact-file-row ${selectedNotebookId === notebook.id ? "selected" : ""}`} aria-pressed={selectedNotebookId === notebook.id}
          title={`${notebook.name}\n${compatibilityLabel[match.status]}: ${match.reasons.join("; ")}`} onClick={() => onNotebook(notebook.id)}>
          <Manual size={15} className="compact-notebook-icon" /><span className="compact-file-name"><strong>{notebook.name}</strong><small className={`compact-compatibility ${match.status}`}><span className="compatibility-dot" />{compatibilityLabel[match.status]}</small></span>
        </button></div>{owned.length > 0 && outputTree(owned, notebook.id, notebook.name)}</div>;
    }))}
    {unassigned.length > 0 && outputTree(unassigned, "unassigned", "Other results", "Other results")}
    {contextMenu && <div ref={menu} className="browser-context-menu explorer-context-menu" role="menu" aria-label={`Actions for ${contextMenu.label}`}
      style={{left: contextMenu.x, top: contextMenu.y}} onContextMenu={event => event.preventDefault()}
      onKeyDown={event => {
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) { event.preventDefault(); menuAction.current?.focus(); }
        if (event.key === "Tab") setContextMenu(null);
      }}>
      <div className="context-title">{contextMenu.label}</div>
      <button ref={menuAction} role="menuitem" className="danger" disabled={busy}
        title="Remove only this item or folder from this workspace; Undo is available"
        onClick={() => { const trigger = contextMenu.trigger; remove(contextMenu.keys); trigger.focus(); }}><Trash size={14} aria-hidden="true" /> Delete</button>
    </div>}
  </div>;
}
