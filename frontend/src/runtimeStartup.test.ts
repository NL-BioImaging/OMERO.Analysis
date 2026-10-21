import { PythonRuntime } from "./runtime";

it("settles a pending startup when stopped before the sandbox loads", async () => {
  const runtime = new PythonRuntime("/omero_analysis/runtime/");
  const append = vi.spyOn(document.body, "append").mockImplementation(() => {});
  const startup = runtime.start([]);
  const stopped = expect(startup).rejects.toThrow("Python execution stopped");
  runtime.stop();
  await stopped;
  expect(runtime.started).toBe(false);
  runtime.dispose();
  append.mockRestore();
});

it("reports an actionable timeout when the sandbox never loads", async () => {
  vi.useFakeTimers();
  const runtime = new PythonRuntime("/omero_analysis/runtime/");
  const append = vi.spyOn(document.body, "append").mockImplementation(() => {});
  const startup = runtime.start([]);
  const failed = expect(startup).rejects.toThrow("did not load within 60 seconds");
  await vi.advanceTimersByTimeAsync(60_000);
  await failed;
  runtime.dispose();
  append.mockRestore();
  vi.useRealTimers();
});
