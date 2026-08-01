import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ExecutionCard } from "./ExecutionCard";
import type { ExecutionRecord, WorkspaceFile } from "../types";

Object.defineProperty(URL, "createObjectURL", {
  configurable: true,
  value: vi.fn(() => "blob:test")
});
Object.defineProperty(URL, "revokeObjectURL", {
  configurable: true,
  value: vi.fn()
});

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
  it("shows one reusable Analysis card with one set of actions", () => {
    render(
      <ExecutionCard
        execution={execution({ purpose: "analysis", durationMs: 2_000 })}
        files={[]}
        onSave={vi.fn()}
        onRerun={vi.fn()}
      />
    );

    expect(screen.getByText("Analysis (local)")).toBeInTheDocument();
    expect(screen.getByText("Worked for 2.0 sec")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Save as method" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Rerun" })).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Show details" }));
    expect(screen.getByText("Reusable Python")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Save as method" })).toHaveLength(1);
  });

  it("keeps inspection and repair attempts inside supporting diagnostics", () => {
    const primary = execution({ id: "final", purpose: "analysis" });
    const inspection = execution({
      id: "probe",
      purpose: "inspection",
      code: "result = inspect_schema()",
      createdAt: "2026-07-27T11:59:00Z"
    });
    render(
      <ExecutionCard
        execution={primary}
        relatedExecutions={[inspection, primary]}
        files={[]}
        onSave={vi.fn()}
        onRerun={vi.fn()}
      />
    );

    expect(screen.getByText(/1 supporting local step hidden/)).toBeInTheDocument();
    expect(screen.queryByText("AI data inspection (local)")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show details" }));
    expect(screen.getByText("Supporting diagnostics (1)")).toBeInTheDocument();
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

  it("renders the output owned by the selected reusable execution", () => {
    const file: WorkspaceFile = {
      id: "plot",
      workspaceId: "workspace",
      chatId: "chat",
      executionId: "execution",
      name: "result.png",
      logicalPath: "/output/result.png",
      type: "image/png",
      size: 3,
      sha256: "abc",
      source: "result",
      state: "ready",
      data: new Uint8Array([1, 2, 3]).buffer,
      createdAt: "2026-07-27T12:00:00Z"
    };
    render(
      <ExecutionCard
        execution={execution({ outputFileIds: [file.id] })}
        files={[file]}
        onSave={vi.fn()}
        onRerun={vi.fn()}
      />
    );

    expect(screen.getByRole("img", { name: "result.png" })).toBeInTheDocument();
  });
});
