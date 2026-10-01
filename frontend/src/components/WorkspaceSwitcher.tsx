import { useEffect, useRef, useState } from "react";
import { Icon } from "@blueprintjs/core";
import { Button } from "./BlueprintControls";
import { listContextWorkspaces } from "../storage";
import type { OmeroContext, WorkspaceRecord, LibraryDataset } from "../types";

export function WorkspaceSwitcher({ workspace, context, bridge, disabled, onOpen, onRename, onTrash, onLifecycle, onExport, onImport, onLibrary }: {
  workspace: WorkspaceRecord;
  context: OmeroContext | null;
  bridge: { workspaceLibrary(): Promise<LibraryDataset[]> };
  disabled: boolean;
  onOpen(id?: string): void;
  onRename(): void;
  onTrash(): void;
  onExport?(): void;
  onImport?(): void;
  onLibrary?(): void;
  onLifecycle(id: string, action: "trash" | "restore" | "purge"): Promise<void>;
}) {
  const [choices, setChoices] = useState<Array<{ id: string; name: string; state: string }>>([]);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => { if (menu.current) menu.current.open = false; };
  useEffect(() => {
    let alive = true;
    void Promise.all([
      listContextWorkspaces(context), bridge.workspaceLibrary()
    ]).then(([local, remote]) => {
      const names = new Map(local.filter(item => !item.purgedAt).map(item => [item.id, { id: item.id, name: item.name, state: item.deletedAt ? "trashed" : "active" }]));
      for (const item of remote) {
        if (item.sourceObjectType === context?.object_type &&
            item.sourceObjectId === context?.object_id) {
          names.set(item.workspaceId, { id: item.workspaceId,
            name: names.get(item.workspaceId)?.name || item.workspaceName, state: item.lifecycle || "active" });
        }
      }
      if (alive) setChoices([...names.values()]);
    }).catch(err => { if (alive) setError(String(err)); });
    return () => { alive = false; };
  }, [workspace.id, workspace.name, workspace.deletedAt, workspace.lifecycleRevision, context, bridge, refresh]);
  return <div className="workspace-switcher">
    <select aria-label="Analysis workspace" title={workspace.name} value={workspace.id} disabled={disabled}
      onChange={event => onOpen(event.target.value)}>
      {workspace.purgedAt && !choices.some(item => item.id === workspace.id) && <option value={workspace.id} disabled>{workspace.name} (removed)</option>}
      {choices.length ? choices.filter(item => item.state === "active" || item.id === workspace.id).map(item => <option key={item.id} value={item.id}>{item.id === workspace.id ? workspace.name : item.name}</option>)
        : <option value={workspace.id}>{workspace.name}</option>}
    </select>
    <details className="workspace-control-menu" ref={menu}>
      <summary aria-label="Workspace actions"><Icon icon="folder-open" /> Workspace <Icon icon="caret-down" /></summary>
      <div className="workspace-control-menu-items">
        <Button aria-label="New workspace" disabled={disabled} onClick={() => { closeMenu(); onOpen(); }}><Icon icon="add" /> New workspace</Button>
        <Button aria-label="Rename workspace" disabled={disabled || Boolean(workspace.deletedAt)} onClick={() => { closeMenu(); onRename(); }}><Icon icon="edit" /> Rename workspace</Button>
        <Button aria-label="Open Trash" onClick={() => { closeMenu(); onTrash(); }}><Icon icon="trash" /> Open Trash</Button>
        <Button aria-label="Manage workspaces" disabled={disabled} onClick={() => { closeMenu(); setOpen(true); setRefresh(value => value + 1); }}><Icon icon="list" /> Manage workspaces</Button>
        {onExport && <Button disabled={disabled} onClick={() => { closeMenu(); onExport(); }}><Icon icon="download" />Download workspace archive</Button>}
        {onImport && <Button disabled={disabled} onClick={() => { closeMenu(); onImport(); }}><Icon icon="import" />Import workspace archive</Button>}
        {onLibrary && <Button disabled={disabled} onClick={() => { closeMenu(); onLibrary(); }}><Icon icon="import" />Reuse analyses and templates</Button>}
      </div>
    </details>
    {open && <div className="dialog-backdrop"><section className="app-dialog trash-dialog" role="dialog" aria-modal="true" aria-label="Manage workspaces">
      <h2>Manage workspaces</h2><p>Trash is recoverable. Permanent deletion removes only this workspace's managed data.</p>
      {error && <p role="alert">{error}</p>}
      {choices.map(item => <div key={item.id} className="trash-row"><span>{item.name} <small>{item.state}</small></span>
        <Button disabled={working} onClick={() => { setOpen(false); onOpen(item.id); }}>Open</Button>
        {(item.state === "active" ? ["trash"] : item.state === "purging" ? ["purge"] : ["restore", "purge"]).map(action =>
          <Button key={action} disabled={working} onClick={async () => {
            setWorking(true); setError("");
            try { await onLifecycle(item.id, action as "trash" | "restore" | "purge"); setRefresh(value => value + 1); }
            catch (err) { setError(String(err)); }
            finally { setWorking(false); }
          }}>{action === "trash" ? "Move to Trash" : action === "restore" ? "Restore" : "Delete permanently"}</Button>)}
      </div>)}
      <Button disabled={working} onClick={() => setOpen(false)}>Close management</Button>
    </section></div>}
  </div>;
}
