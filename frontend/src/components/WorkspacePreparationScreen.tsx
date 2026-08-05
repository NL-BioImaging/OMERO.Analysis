import type { RuntimeProgress } from "../types";
import { BlueprintThemeProvider } from "./BlueprintControls";
import { RuntimeProgressPanel } from "./WorkspacePanels";

export function WorkspacePreparationScreen({
  theme,
  workspaceName,
  progress,
  error
}: {
  theme: "dark" | "light";
  workspaceName: string;
  progress: RuntimeProgress;
  error: string;
}) {
  return (
    <BlueprintThemeProvider theme={theme}>
      <main className="app-shell workspace-boot" data-theme={theme}>
        <header className="workspace-header">
          <div className="header-brand"><h1>OMERO.Analysis</h1><p>{workspaceName}</p></div>
        </header>
        <section className="workspace-preparation" aria-labelledby="workspace-preparation-title">
          <h2 id="workspace-preparation-title">
            {error ? "Workspace could not be prepared" : "Preparing Workspace"}
          </h2>
          <RuntimeProgressPanel progress={progress} label="Preparing Analysis Workspace"
            detail={error || "OMERO data, reusable analyses, settings, and current input bindings are being restored."} />
          {error && <p className="workspace-preparation-error">Reload Analysis from the OMERO middle pane to retry.</p>}
        </section>
      </main>
    </BlueprintThemeProvider>
  );
}
