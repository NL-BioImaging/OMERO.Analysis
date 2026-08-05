import { describe, expect, it } from "vitest";
import { extractInputNames, isInputBindingsCell } from "./artifactBindings";
import { newMethodSource, newNotebookDocument } from "./creationTemplates";
import type { WorkspaceFile } from "./types";

function input(name: string, state: WorkspaceFile["state"] = "ready"): WorkspaceFile {
  return {
    id: name,
    workspaceId: "workspace",
    name,
    logicalPath: `/input/${name}`,
    type: "application/octet-stream",
    size: 1,
    sha256: "hash",
    source: "local",
    state,
    data: new Uint8Array([1]).buffer,
    createdAt: "2026-08-04T00:00:00.000Z"
  };
}

describe("new artifact templates", () => {
  it("creates a Method with explicit bindings for every ready Workspace input", () => {
    const source = newMethodSource([
      input("measurements.duckdb"),
      input("table.csv"),
      input("missing.xlsx", "missing")
    ]);
    expect(extractInputNames(source)).toEqual(["measurements.duckdb", "table.csv"]);
    expect(source).toContain('INPUTS["filename.ext"]');
  });

  it("creates a Notebook with a managed binding cell and an editable code cell", () => {
    const document = newNotebookDocument([input("measurements.duckdb")], "editable");
    expect(document.cells).toHaveLength(2);
    expect(isInputBindingsCell(document.cells[0])).toBe(true);
    expect(document.cells[0].source).toContain("measurements.duckdb");
    expect(document.cells[1]).toMatchObject({ id: "editable", cell_type: "code" });
  });
});
