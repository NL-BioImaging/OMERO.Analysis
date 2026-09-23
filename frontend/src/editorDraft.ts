import type { ArtifactEditorSession, EditorOriginTab } from "./ArtifactEditor";
import type { AnalysisWorkspace } from "./types";

/** Opening an editor is a read: binding changes require an explicit action. */
export function editorDraft(workspace: AnalysisWorkspace, kind: ArtifactEditorSession["kind"],
  artifactId: string, originTab: EditorOriginTab): ArtifactEditorSession {
  const base = { id: artifactId, kind, originTab, bindingCount: 0, dirty: false };
  if (kind === "method") {
    const original = workspace.methods.find(item => item.id === artifactId && !item.deletedAt);
    const version = original?.versions.find(item => item.version === original.currentVersion);
    if (!original || !version) throw new Error("Method is unavailable");
    return { ...base, kind, original, name: original.name, draftCode: version.code };
  }
  if (kind === "pipeline") {
    const original = workspace.pipelines.find(item => item.id === artifactId && !item.deletedAt);
    if (!original) throw new Error("Pipeline is unavailable");
    return { ...base, kind, original, name: original.name, draft: structuredClone(original) };
  }
  const original = workspace.notebooks.find(item => item.id === artifactId && !item.deletedAt);
  if (!original) throw new Error("Notebook is unavailable");
  return { ...base, kind, original, name: original.name, draft: structuredClone(original) };
}
