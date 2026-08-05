import { bindNotebookInputsStrict, readyWorkspaceInputs } from "./artifactBindings";
import type { NotebookDocument, WorkspaceFile } from "./types";

export function newMethodSource(files: WorkspaceFile[]): string {
  const inputs = readyWorkspaceInputs(files);
  const entries = inputs.map((file) =>
    `    ${JSON.stringify(file.name)}: Path(${JSON.stringify(`/input/${file.name}`)}),`
  );
  return [
    "# New analysis method",
    "from pathlib import Path",
    "",
    'OUTPUT_DIR = Path("/output")',
    "INPUTS = {",
    ...entries,
    "}",
    "",
    "# Use INPUTS[\"filename.ext\"] to access attached Workspace data.",
    ""
  ].join("\n");
}

export function newNotebookDocument(
  files: WorkspaceFile[],
  editableCellId: string
): NotebookDocument {
  const base: NotebookDocument = {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: {
      kernelspec: {
        display_name: "Python (Pyodide)",
        language: "python",
        name: "python"
      },
      language_info: { name: "python" }
    },
    cells: [{
      id: editableCellId,
      cell_type: "code",
      source: "# Use OA_ATTACHED_INPUTS to access attached Workspace data.\n",
      metadata: {},
      execution_count: null,
      outputs: []
    }]
  };
  return bindNotebookInputsStrict(base, files).document;
}
