import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LibraryDataset } from "../types";
import { WorkspaceLibraryTree } from "./WorkspaceLibraryTree";

const datasets: LibraryDataset[] = [{
  projectId: 1,
  datasetId: 2,
  datasetName: "Screen-151 — Cells",
  workspaceId: "workspace",
  workspaceName: "Cells",
  sourceObjectType: "Screen",
  sourceObjectId: 151,
  sourceObjectName: "Cells",
  revision: 3,
  updatedAt: "2026-07-29T12:00:00Z",
  items: [{
    key: "method:cells",
    kind: "method",
    name: "count-cells.oa-method.json",
    description: "Count cells",
    version: 1,
    sha256: "a".repeat(64),
    size: 1200,
    annotationId: 44,
    mimetype: "application/json",
    requiredCapabilities: [],
    requiredFormats: ["duckdb"],
    dependencies: []
  }, {
    key: "notebook:cells",
    kind: "notebook",
    name: "count-cells.ipynb",
    description: "",
    version: 1,
    sha256: "b".repeat(64),
    size: 2400,
    annotationId: 45,
    mimetype: "application/x-ipynb+json",
    requiredCapabilities: [],
    requiredFormats: [],
    dependencies: []
  }]
}];

describe("WorkspaceLibraryTree", () => {
  it("groups reusable items below their Analysis Workspace Dataset", () => {
    render(
      <WorkspaceLibraryTree
        datasets={datasets}
        query=""
        selected={new Set()}
        openDatasets={new Set([2])}
        availableFormats={new Set(["duckdb"])}
        zarrViewerAvailable={false}
        onToggleDataset={vi.fn()}
        onToggleItem={vi.fn()}
      />
    );
    expect(screen.getByText("+AnalysisWorkspaces")).toBeInTheDocument();
    expect(screen.getByText("Screen-151 — Cells")).toBeInTheDocument();
    expect(screen.getByText("Methods")).toBeInTheDocument();
    expect(screen.getByText("Notebooks")).toBeInTheDocument();
    expect(document.querySelector('img[src="/static/webclient/image/folder16.png"]'))
      .toBeInTheDocument();
    expect(document.querySelector('img[src="/static/webclient/image/folder_image16.png"]'))
      .toBeInTheDocument();
  });

  it("selects an item and filters the tree", () => {
    const toggle = vi.fn();
    const { rerender } = render(
      <WorkspaceLibraryTree
        datasets={datasets}
        query=""
        selected={new Set()}
        openDatasets={new Set([2])}
        availableFormats={new Set()}
        zarrViewerAvailable={false}
        onToggleDataset={vi.fn()}
        onToggleItem={toggle}
      />
    );
    fireEvent.click(screen.getByRole("checkbox", { name: /count-cells\.oa-method/ }));
    expect(toggle).toHaveBeenCalledWith("2:method:cells");

    rerender(
      <WorkspaceLibraryTree
        datasets={datasets}
        query="ipynb"
        selected={new Set()}
        openDatasets={new Set()}
        availableFormats={new Set()}
        zarrViewerAvailable={false}
        onToggleDataset={vi.fn()}
        onToggleItem={toggle}
      />
    );
    expect(screen.queryByText("count-cells.oa-method.json")).not.toBeInTheDocument();
    expect(screen.getByText("count-cells.ipynb")).toBeInTheDocument();
  });

  it("collapses the root and reusable-item groups", () => {
    render(
      <WorkspaceLibraryTree
        datasets={datasets}
        query=""
        selected={new Set()}
        openDatasets={new Set([2])}
        availableFormats={new Set(["duckdb"])}
        zarrViewerAvailable={false}
        onToggleDataset={vi.fn()}
        onToggleItem={vi.fn()}
      />
    );
    const rootSummary = screen.getByText("+AnalysisWorkspaces").closest("summary");
    const root = rootSummary?.closest("details");
    expect(root).toHaveAttribute("open");
    fireEvent.click(rootSummary!);
    expect(root).not.toHaveAttribute("open");

    fireEvent.click(rootSummary!);
    const methodsSummary = screen.getByText("Methods").closest("summary");
    const methods = methodsSummary?.closest("details");
    expect(methods).toHaveAttribute("open");
    fireEvent.click(methodsSummary!);
    expect(methods).not.toHaveAttribute("open");
  });
});
