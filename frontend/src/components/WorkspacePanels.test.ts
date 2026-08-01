import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import {
  ArtifactInspector,
  ComposerPanel,
  delimitedShape,
  MarkdownPreview,
  parseDelimited,
  usageSummary
} from "./WorkspacePanels";
import type { NotebookRecord, WorkspaceFile } from "../types";

describe("artifact delimited previews", () => {
  it("renders bounded CSV rows and preserves quoted delimiters", () => {
    expect(parseDelimited('well,label,value\nA1,"cells, total",12\n', ",")).toEqual([
      ["well", "label", "value"],
      ["A1", "cells, total", "12"]
    ]);
  });

  it("limits previews to one header and one hundred data rows", () => {
    const source = ["value", ...Array.from({ length: 150 }, (_, index) => String(index))].join("\n");
    expect(parseDelimited(source, ",")).toHaveLength(101);
  });

  it("counts quoted CSV rows and columns without treating embedded newlines as rows", () => {
    expect(delimitedShape('a,b\n1,"two\nlines"\n3,4\n', ",")).toEqual({
      rows: 2,
      columns: 2
    });
  });

  it("renders Chat Markdown without activating embedded HTML or unsafe links", () => {
    const { container } = render(MarkdownPreview({
      markdown: "# Chat\n\n**Result**\n\n<script>alert(1)</script>\n\n[unsafe](javascript:alert(1))"
    }));
    expect(screen.getByRole("heading", { name: "Chat" })).toBeInTheDocument();
    expect(screen.getByText("Result")).toBeInTheDocument();
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("a")).toBeNull();
    expect(screen.getByText(/<script>alert/)).toBeInTheDocument();
  });

  it("shows local CSV dimensions from the bounded data profile", () => {
    const file: WorkspaceFile = {
      id: "csv", workspaceId: "workspace", name: "values.csv",
      logicalPath: "Workspace/Input/values.csv", type: "text/csv", size: 12,
      sha256: "hash", source: "local", state: "ready",
      data: new TextEncoder().encode("a,b\n1,2\n").buffer,
      createdAt: "2026-07-29T10:00:00Z"
    };
    render(createElement(ArtifactInspector, {
      item: { kind: "file", title: file.name, file },
      profiles: [{
        path: "/input/values.csv", format: "csv", size: 12,
        summary: {
          rows: 240,
          columns: [{ name: "a", type: "int64" }, { name: "b", type: "int64" }]
        }
      }],
      canUpload: false,
      onDownload: () => undefined,
      onAttach: () => undefined
    }));
    expect(screen.getByText("240")).toBeInTheDocument();
    expect(screen.getByText("Columns").nextElementSibling).toHaveTextContent("2");
  });

  it("renders a bounded XLSX template preview from its local data profile", () => {
    const file: WorkspaceFile = {
      id: "xlsx", workspaceId: "workspace", name: "screen-template.xlsx",
      logicalPath: "Workspace/Input/screen-template.xlsx",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: 200, sha256: "hash", source: "local", state: "ready",
      data: new ArrayBuffer(200),
      createdAt: "2026-07-30T10:00:00Z"
    };
    render(createElement(ArtifactInspector, {
      item: { kind: "file", title: file.name, file },
      profiles: [{
        path: "/input/screen-template.xlsx", format: "xlsx", size: 200,
        summary: {
          rows: 2,
          sheet: "Plate layout",
          sheets: ["Plate layout", "Notes"],
          columns: [
            { name: "Well", type: "object" },
            { name: "Condition", type: "object" }
          ],
          preview: {
            columns: ["Well", "Condition"],
            data: [["A1", "Control"], ["A2", "Treatment"]]
          }
        }
      }],
      canUpload: false,
      onDownload: () => undefined,
      onAttach: () => undefined
    }));

    expect(screen.getByText("Plate layout")).toBeInTheDocument();
    expect(screen.getByText(/2 sheets in workbook/)).toBeInTheDocument();
    expect(screen.getByText("A1")).toBeInTheDocument();
    expect(screen.getByText("Treatment")).toBeInTheDocument();
  });

  it("shows DuckDB tables and columns instead of an opaque binary preview", () => {
    const file: WorkspaceFile = {
      id: "db", workspaceId: "workspace", name: "measurements.duckdb",
      logicalPath: "Workspace/Input/measurements.duckdb",
      type: "application/octet-stream", size: 100, sha256: "hash",
      source: "local", state: "ready", data: new ArrayBuffer(1),
      createdAt: "2026-07-29T10:00:00Z"
    };
    render(createElement(ArtifactInspector, {
      item: { kind: "file", title: file.name, file },
      profiles: [{
        path: "/input/measurements.duckdb", format: "duckdb", size: 100,
        summary: {
          tables: [{
            name: "object_features",
            columns: [{ name: "object_id", type: "BIGINT" }]
          }]
        }
      }],
      canUpload: false,
      onDownload: () => undefined,
      onAttach: () => undefined
    }));
    expect(screen.getByText("Database schema")).toBeInTheDocument();
    expect(screen.getByText(/object_features/)).toBeInTheDocument();
  });

  it("presents Notebook cells and safe outputs without dumping encoded JSON", () => {
    const notebook = {
      id: "notebook", workspaceId: "workspace", name: "analysis.ipynb",
      attachmentIds: [], selectedDataFileIds: [],
      document: {
        nbformat: 4, nbformat_minor: 5, metadata: {},
        cells: [{
          id: "cell", cell_type: "code", source: "value = 1",
          metadata: {}, execution_count: 1,
          outputs: [{
            output_type: "display_data", metadata: {},
            data: { "image/png": "aGVsbG8=" }
          }]
        }]
      },
      createdAt: "2026-07-29T10:00:00Z",
      updatedAt: "2026-07-29T10:00:00Z"
    } as NotebookRecord;
    const { container } = render(createElement(ArtifactInspector, {
      item: { kind: "notebook", title: notebook.name, notebook },
      profiles: [],
      canUpload: false,
      onDownload: () => undefined,
      onAttach: () => undefined
    }));
    expect(container).toHaveTextContent("value = 1");
    expect(container.querySelector("img[alt='Notebook PNG output']")).not.toBeNull();
    expect(screen.queryByText(/aGVsbG8=/)).toBeNull();
  });
});

describe("ComposerPanel provider readiness", () => {
  it("does not require an API key for a keyless local profile", () => {
    render(createElement(ComposerPanel, {
      runtimeReady: true,
      runtimeProgress: { percent: 100, message: "Ready" },
      status: "Ready",
      usage: null,
      settings: {
        protocol: "openai",
        endpoint: "http://localhost:1234/v1",
        authMode: "none",
        apiKey: "",
        model: "local-model",
        contextWindow: 0,
        rememberKey: false
      },
      blocked: false,
      canChat: true,
      composerPlaceholder: "Ask",
      prompt: "",
      busy: false,
      onPromptChange: () => undefined,
      onSend: () => undefined,
      onStop: () => undefined,
      onReset: () => undefined
    }));

    expect(screen.queryByText(/Enter an AI endpoint/)).not.toBeInTheDocument();
    expect(screen.getByText("Ready — you can ask a question")).toBeInTheDocument();
  });
});

describe("AI context usage", () => {
  it("shows real token counts, percentage, and compaction state", () => {
    expect(usageSummary({
      promptTokens: 32_000,
      completionTokens: 800,
      totalTokens: 32_800,
      sessionTokens: 91_000,
      estimated: false,
      contextWindow: 128_000,
      compactionThreshold: 76_800,
      compactedMessages: 14,
      compacted: true
    }, 0)).toContain("32,000 / 128,000 tokens (25.0%)");
    expect(usageSummary({
      promptTokens: 32_000,
      completionTokens: 800,
      totalTokens: 32_800,
      sessionTokens: 91_000,
      estimated: false,
      contextWindow: 128_000,
      compactionThreshold: 76_800,
      compactedMessages: 14,
      compacted: true
    }, 0)).toContain("Compacted 14 earlier messages");
  });
});
