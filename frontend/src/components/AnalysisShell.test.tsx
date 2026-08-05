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
      onRunNotebook={() => undefined} onOpenAssistant={() => undefined}
      onNewMethod={() => undefined} onCreatePipeline={() => undefined}
      onPipelineToNotebook={() => undefined} onNewNotebook={() => undefined} />);
    expect(screen.getByRole("button", { name: "Create new Method" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Create new Notebook" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "New" })).not.toBeInTheDocument();
  });
});
