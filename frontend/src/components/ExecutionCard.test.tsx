import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ExecutionCard } from "./ExecutionCard";
import type { ExecutionRecord } from "../types";

function execution(overrides: Partial<ExecutionRecord> = {}): ExecutionRecord {
  return {
    id: "execution",
    workspaceId: "workspace",
    chatId: "chat",
    promptId: "prompt",
    code: "result = 1",
    codeHash: "1234567890abcdef",
    cacheKey: "cache",
    status: "success",
    stdout: "",
    stderr: "",
    outputFileIds: [],
    missingPlotCsv: [],
    inputHashes: [],
    runtimeVersion: "pyodide-test",
    model: "gpt-5",
    createdAt: "2026-07-27T12:00:00Z",
    ...overrides
  };
}

describe("ExecutionCard", () => {
  it("marks assistant-only inspection and hides reusable code actions", () => {
    render(
      <ExecutionCard
        execution={execution({ purpose: "inspection", durationMs: 1_250 })}
        files={[]}
        onSave={vi.fn()}
        onRerun={vi.fn()}
      />
    );

    expect(screen.getByText("AI data inspection (local)")).toBeInTheDocument();
    expect(screen.getByText(/for AI data inspection/)).toBeInTheDocument();
    expect(screen.getByText(/not a reusable analysis method/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save as method" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Rerun" })).not.toBeInTheDocument();
  });

  it("keeps analysis actions at the top and bottom", () => {
    render(
      <ExecutionCard
        execution={execution({ purpose: "analysis", durationMs: 2_000 })}
        files={[]}
        onSave={vi.fn()}
        onRerun={vi.fn()}
      />
    );

    expect(screen.getByText("Worked for 2.0 sec")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Save as method" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Rerun" })).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Show details" }));
    expect(screen.getAllByRole("button", { name: "Save as method" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Rerun" })).toHaveLength(2);
  });

  it("shows render preparation as an intermediate step without reusable actions", () => {
    render(
      <ExecutionCard
        execution={execution({
          purpose: "analysis",
          code: 'result = {"store_uuid": "store", "render_panels": []}'
        })}
        files={[]}
        onSave={vi.fn()}
        onRerun={vi.fn()}
        viewerPreparation
      />
    );

    expect(screen.getByText("Zarr render preparation (local)")).toBeInTheDocument();
    expect(screen.getByText(/Save the complete analysis and render/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save as method" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Rerun" })).not.toBeInTheDocument();
  });

  it("waits for the assistant summary before allowing a Method save", () => {
    render(
      <ExecutionCard
        execution={execution({ purpose: "analysis" })}
        files={[]}
        onSave={vi.fn()}
        onRerun={vi.fn()}
        saveDisabled
      />
    );

    expect(screen.getByRole("button", { name: "Save as method" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save as method" }))
      .toHaveAttribute("title", expect.stringMatching(/assistant has finished/i));
  });
});
