import { Button } from "./BlueprintControls";
import type { WorkspaceRecord } from "../types";
export function WorkspaceHeader({ workspace, disabled, theme, embedded, onRename, onTheme, onHelp }: {
  workspace: WorkspaceRecord; disabled: boolean; theme: "dark" | "light"; embedded: boolean;
  onRename(): void; onTheme(): void; onHelp(): void;
}) {
  return <header className="workspace-header">
    <h1>OMERO.Analysis</h1>
    <strong className="workspace-title" aria-label="Analysis workspace" title={workspace.name}>{workspace.name}</strong>
    <div className="workspace-header-actions" aria-label="Workspace actions">
      <Button icon="edit" title="Rename this analysis" aria-label="Rename workspace" disabled={disabled || Boolean(workspace.deletedAt)} onClick={onRename} />
      {!embedded && <Button icon="contrast" title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} aria-label="Change theme" onClick={onTheme} />}
      <Button icon="help" title="Help with Analysis, data, notebooks and saving" aria-label="Analysis help" onClick={onHelp} />
    </div>
  </header>;
}
