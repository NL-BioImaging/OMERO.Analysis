import { PythonRuntime } from "./runtime";

it("enables plot-data companions for every notebook cell without a settings switch", async () => {
  const runtime = new PythonRuntime("/runtime/");
  const run = vi.spyOn(runtime, "run").mockResolvedValue({ stdout: "", stderr: "", files: [], preview: null } as any);
  await runtime.runNotebookCell("print('example')");
  expect(run).toHaveBeenCalledWith(expect.any(String), expect.any(Number), true);
  runtime.dispose();
});

it("requests only the selected spreadsheet sheet without sharing the notebook kernel", async () => {
  const runtime = new PythonRuntime("/runtime/");
  (runtime as any).readyPromise = Promise.resolve();
  const request = vi.spyOn(runtime as any, "request").mockResolvedValue([]);
  await runtime.profileInputs({ "measurements.xlsx": "Second sheet" });
  expect(request).toHaveBeenCalledWith("profile", { sheets: { "measurements.xlsx": "Second sheet" } }, 30_000);
  runtime.dispose();
});
