import { bindScriptInputs } from "./App";
import type { WorkspaceFile } from "./types";

function input(name: string): WorkspaceFile {
  return {
    id: name,
    projectId: "project",
    name,
    logicalPath: `OMERO/Dataset-1/inputs/${name}`,
    type: "application/octet-stream",
    size: 1,
    sha256: name,
    source: "local",
    state: "ready",
    data: new ArrayBuffer(1),
    createdAt: "2026-07-26T12:00:00Z"
  };
}

describe("portable saved scripts", () => {
  it("keeps an exact destination input name", () => {
    const result = bindScriptInputs(
      `path = "/input/measurements.duckdb"`,
      [input("measurements.duckdb")]
    );
    expect(result.code).toContain("/input/measurements.duckdb");
    expect(result.bindings).toEqual([]);
  });

  it("binds a missing source name to the only compatible destination input", () => {
    const result = bindScriptInputs(
      `path = "/input/source.duckdb"`,
      [input("new-screen.duckdb"), input("notes.csv")]
    );
    expect(result.code).toContain("/input/new-screen.duckdb");
    expect(result.bindings).toEqual([
      { from: "source.duckdb", to: "new-screen.duckdb" }
    ]);
  });

  it("blocks ambiguous destination bindings", () => {
    expect(() => bindScriptInputs(
      `path = "/input/source.csv"`,
      [input("one.csv"), input("two.csv")]
    )).toThrow(/ambiguous/);
  });
});
