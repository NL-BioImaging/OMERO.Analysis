import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
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
    render(<AnalysisNavigation activeTab="inspector" onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button", { name: "Skills" }));
    expect(onNavigate).toHaveBeenCalledWith("skills");
    expect(screen.getByRole("button", { name: "Inspector" })).toHaveAttribute("aria-current", "page");
  });

});
