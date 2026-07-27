import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ExecutionCard } from "./ExecutionCard";
import type { ExecutionRecord } from "../types";

function execution(overrides: Partial<ExecutionRecord> = {}): ExecutionRecord {
  return {
    id: "execution",
    projectId: "project",
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
    expect(screen.getByText(/not a reusable analysis script/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save as script" })).not.toBeInTheDocument();
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
    expect(screen.getAllByRole("button", { name: "Save as script" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Rerun" })).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Show details" }));
    expect(screen.getAllByRole("button", { name: "Save as script" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Rerun" })).toHaveLength(2);
  });
});
