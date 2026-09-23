import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { AnalysisHome } from "./AnalysisHome";
import { AnalysisNavigation } from "./AnalysisNavigation";
import { WorkspacePreparationScreen } from "./WorkspacePreparationScreen";

describe("Analysis shell", () => {
  it("reports Workspace preparation separately from Python loading", () => {
    render(<WorkspacePreparationScreen theme="dark" workspaceName="Plate screen"
      progress={{ percent: 45, message: "Discovering installed analysis skills…" }} error="" />);
    expect(screen.getByRole("progressbar", { name: "Preparing Analysis Workspace" }))
      .toHaveAttribute("value", "45");
    expect(screen.getByText("Plate screen")).toBeVisible();
  });

  it("uses canonical, keyboard-operable Analysis tabs", () => {
    const onNavigate = vi.fn();
    render(<AnalysisNavigation activeTab="home" editorEnabled onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button", { name: "Assistant" }));
    expect(onNavigate).toHaveBeenCalledWith("assistant");
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("gives creation actions artifact-specific accessible names", () => {
    render(<AnalysisHome methods={[]} pipelines={[]} notebooks={[]}
      methodId="" pipelineId="" notebookId="" notebookPipelineId=""
      busy={false} editorEnabled providerReady
      onMethodIdChange={() => undefined} onPipelineIdChange={() => undefined}
      onNotebookIdChange={() => undefined} onNotebookPipelineIdChange={() => undefined}
      onRunMethod={() => undefined} onRunPipeline={() => undefined}
      onOpenNotebook={() => undefined} onOpenAssistant={() => undefined}
      onNewMethod={() => undefined} onCreatePipeline={() => undefined}
      onPipelineToNotebook={() => undefined} onNewNotebook={() => undefined} />);
    expect(screen.getByRole("button", { name: "Create new Method" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Create new Notebook" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Open Notebook" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "New" })).not.toBeInTheDocument();
  });

  it("exposes complete long artifact names as select tooltips", () => {
    const timestamp = "2026-08-12T12:00:00Z";
    const method = {
      id: "method", workspaceId: "workspace", name: "a-very-long-analysis-method-name.py",
      description: "", currentVersion: 3, versions: [], createdAt: timestamp, updatedAt: timestamp
    } as any;
    const pipeline = {
      id: "pipeline", workspaceId: "workspace", name: "a-very-long-analysis-pipeline-name",
      description: "", version: 2, steps: [], createdAt: timestamp, updatedAt: timestamp
    } as any;
    const notebook = {
      id: "notebook", workspaceId: "workspace", name: "a-very-long-analysis-notebook-name.ipynb",
      document: { nbformat: 4, nbformat_minor: 5, metadata: {}, cells: [] },
      attachmentIds: [], selectedDataFileIds: [], createdAt: timestamp, updatedAt: timestamp
    } as any;
    render(<AnalysisHome methods={[method]} pipelines={[pipeline]} notebooks={[notebook]}
      methodId={method.id} pipelineId={pipeline.id} notebookId={notebook.id}
      notebookPipelineId={pipeline.id} busy={false} editorEnabled providerReady
      onMethodIdChange={() => undefined} onPipelineIdChange={() => undefined}
      onNotebookIdChange={() => undefined} onNotebookPipelineIdChange={() => undefined}
      onRunMethod={() => undefined} onRunPipeline={() => undefined}
      onOpenNotebook={() => undefined} onOpenAssistant={() => undefined}
      onNewMethod={() => undefined} onCreatePipeline={() => undefined}
      onPipelineToNotebook={() => undefined} onNewNotebook={() => undefined} />);
    expect(screen.getByRole("combobox", { name: "Method to run" }))
      .toHaveAttribute("title", `${method.name} · v3`);
    expect(screen.getByRole("combobox", { name: "Pipeline to run" }))
      .toHaveAttribute("title", `${pipeline.name} · v2`);
    expect(screen.getByRole("combobox", { name: "Notebook to run" }))
      .toHaveAttribute("title", notebook.name);
    expect(screen.getByRole("combobox", { name: "Pipeline to convert to Notebook" }))
      .toHaveAttribute("title", `${pipeline.name} · v2`);
  });
});
