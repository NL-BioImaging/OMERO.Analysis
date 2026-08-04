import { bindMethodInputs, methodUsesZarrViewer, nextUntitledName } from "./App";
import type { MethodRecord, WorkspaceFile } from "./types";

function input(name: string): WorkspaceFile {
  return {
    id: name,
    workspaceId: "workspace",
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

describe("portable saved methods", () => {
  it("keeps an exact destination input name", () => {
    const result = bindMethodInputs(
      `path = "/input/measurements.duckdb"`,
      [input("measurements.duckdb")]
    );
    expect(result.code).toContain("/input/measurements.duckdb");
    expect(result.bindings).toEqual([]);
  });

  it("binds a missing source name to the only compatible destination input", () => {
    const result = bindMethodInputs(
      `path = "/input/source.duckdb"`,
      [input("new-screen.duckdb"), input("notes.csv")]
    );
    expect(result.code).toContain("/input/new-screen.duckdb");
    expect(result.bindings).toEqual([
      { from: "source.duckdb", to: "new-screen.duckdb" }
    ]);
  });

  it("blocks ambiguous destination bindings", () => {
    expect(() => bindMethodInputs(
      `path = "/input/source.csv"`,
      [input("one.csv"), input("two.csv")]
    )).toThrow(/ambiguous/);
  });

  it("identifies ZarrViewer-dependent Methods so Notebook conversion can skip them", () => {
    const method = {
      requiredCapabilities: ["zarrviewer"]
    } as MethodRecord;
    expect(methodUsesZarrViewer(method, "print('ordinary Python')")).toBe(true);
    expect(methodUsesZarrViewer({} as MethodRecord, "render_panels(store_uuid)")).toBe(true);
    expect(methodUsesZarrViewer({} as MethodRecord, "print('ordinary Python')")).toBe(false);
  });

  it("allocates the first free zero-padded untitled artifact name", () => {
    expect(nextUntitledName([], ".py")).toBe("untitled01.py");
    expect(nextUntitledName(["untitled01.py", "Untitled02.py", "other.py"], ".py"))
      .toBe("untitled03.py");
    expect(nextUntitledName(["untitled01.ipynb"], ".ipynb")).toBe("untitled02.ipynb");
  });
});
