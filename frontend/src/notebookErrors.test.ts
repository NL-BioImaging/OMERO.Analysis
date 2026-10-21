import { notebookError, notebookErrorSummary } from "./notebookErrors";

describe("readable notebook errors", () => {
  it("keeps the Python exception and traceback without browser stack frames", () => {
    const result = notebookError(new Error('PythonError: Traceback (most recent call last):\n  File "<notebook-cell>", line 1\nValueError: Choose a measured label set\n    at wasm://wasm/test:1\n    at bridge.js:2'));
    expect(result.ename).toBe("ValueError");
    expect(result.evalue).toBe("Choose a measured label set");
    expect(result.traceback?.join("\n")).toContain('File "<notebook-cell>"');
    expect(result.traceback?.join("\n")).not.toContain("wasm");
  });
  it("uses the final chained Python exception", () => {
    const result = notebookError("KeyError: old\nDuring handling of the above exception:\nTraceback:\nRuntimeError: Missing column");
    expect(result.ename).toBe("RuntimeError");
    expect(result.evalue).toBe("Missing column");
  });
  it("preserves an ordinary broker or network explanation", () => {
    expect(notebookErrorSummary(new Error("Worker unavailable. Retry shortly.")))
      .toBe("Error: Worker unavailable. Retry shortly.");
  });
  it("keeps a long message in the expandable traceback while bounding the summary", () => {
    const result = notebookError(`ValueError: ${"detail ".repeat(400)}`);
    expect(result.evalue!.length).toBe(1000);
    expect(result.traceback![0].length).toBeGreaterThan(1000);
  });
});
