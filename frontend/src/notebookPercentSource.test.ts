import { notebookToSource, sourceToNotebook } from "./notebookPercentSource";
import type { NotebookDocument } from "./types";

const notebook: NotebookDocument = {
  nbformat: 4, nbformat_minor: 5, metadata: { kernelspec: { language: "python" }, custom: [1, 2] },
  cells: [
    { id: "a", cell_type: "code", metadata: { tags: ["keep"] }, source: 'a = 1\n# %% a comment\n# oa-source-escaped x\n', outputs: [{ output_type: "stream", text: "1" }], execution_count: 1 },
    { id: "b", cell_type: "markdown", metadata: {}, source: "Hello\n\n# %% A heading" }
  ]
};
it("round trips IDs, arbitrary metadata, trailing newlines and delimiter-like content", () => {
  expect(sourceToNotebook(notebookToSource(notebook), notebook)).toEqual(notebook);
});
it("retains outputs and marks them stale after editing", () => {
  const result = sourceToNotebook(notebookToSource(notebook).replace("a = 1", "a = 2"), notebook);
  expect(result.cells[0].outputs).toEqual(notebook.cells[0].outputs);
  expect(result.cells[0].metadata["omero-analysis-stale"]).toBe(true);
});
it("rejects broken separators and duplicate IDs without mutating the last valid notebook", () => {
  const before = JSON.stringify(notebook);
  expect(() => sourceToNotebook(notebookToSource(notebook).replace('"id":"b"', '"id":"a"'), notebook)).toThrow("Duplicate");
  expect(() => sourceToNotebook("# broken", notebook)).toThrow("header");
  expect(JSON.stringify(notebook)).toBe(before);
});
