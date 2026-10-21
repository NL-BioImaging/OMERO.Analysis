
import { schemaContext } from "./SkillsView";
import type { WorkspaceFile } from "./types";

it("exports only input names, formats, schema and capabilities", () => {
  const file = { id: "input", name: "measurements.duckdb", source: "omero", dataQueryMode: "remote",
    data: new TextEncoder().encode("private measurements"), token: "secret-token",
    remoteResult: { receipt: "private-receipt" }, output: "private-output" } as unknown as WorkspaceFile;
  const context = schemaContext([file], { input: { tables: [{
    name: "objects", columns: [{ name: "object_id", type: "BIGINT" }],
    rows: [["private-value"]], credentials: "private-key"
  } as any] } });
  expect(context.inputs).toEqual([{ name: "measurements.duckdb", format: "duckdb",
    role: "input", input_kind: "query", input_path: "input/measurements.duckdb", capabilities: ["read-only-remote-query"], tables: [{ name: "objects", columns: [{ name: "object_id", type: "BIGINT" }] }] }]);
  expect(JSON.stringify(context)).not.toMatch(/private|secret|token|receipt|credentials/);
});

it("excludes results and removed inputs even if supplied by a caller", () => {
  expect(schemaContext([
    { id: "output", name: "result.csv", source: "result" },
    { id: "old", name: "old.csv", source: "local", deletedAt: "2026-10-20" },
  ] as WorkspaceFile[], {}).inputs).toEqual([]);
});
