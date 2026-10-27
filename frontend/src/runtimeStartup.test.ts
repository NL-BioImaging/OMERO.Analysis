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


it("accepts a ready handshake only from its own sandbox frame", async () => {
  vi.useFakeTimers();
  const runtime = new PythonRuntime("/omero_analysis/runtime/");
  const request = vi.spyOn(runtime as any, "request").mockResolvedValue(undefined);
  const startup = runtime.start([]);
  expect(runtime.ready).toBe(false);
  const frame = document.querySelector("iframe")!;
  let completed = false;
  void startup.then(() => { completed = true; });
  window.dispatchEvent(new MessageEvent("message", {
    source: window,
    data: { source: "oa-sandbox", type: "ready" }
  }));
  await Promise.resolve();
  expect(completed).toBe(false);
  window.dispatchEvent(new MessageEvent("message", {
    source: frame.contentWindow,
    data: { source: "oa-sandbox", type: "ready" }
  }));
  await vi.advanceTimersByTimeAsync(0);
  expect(completed).toBe(true);
  expect(runtime.ready).toBe(true);
  expect(request).toHaveBeenCalledWith("ping", true, 120_000);
  expect(frame.getAttribute("sandbox")).toBe("allow-scripts");
  expect(frame.loading).toBe("eager");
  expect(frame.hidden).toBe(false);
  expect(frame.getAttribute("aria-hidden")).toBe("true");
  expect(frame.tabIndex).toBe(-1);
  runtime.dispose();
  request.mockRestore();
  vi.useRealTimers();
});

it("cleans up a failed startup so the next operation can retry", async () => {
  vi.useFakeTimers();
  const runtime = new PythonRuntime("/omero_analysis/runtime/");
  const request = vi.spyOn(runtime as any, "request").mockResolvedValue(undefined);
  const startup = runtime.start([]);
  const failed = expect(startup).rejects.toThrow("did not load within 60 seconds");
  await vi.advanceTimersByTimeAsync(60_000);
  await failed;
  expect(runtime.started).toBe(false);
  expect(runtime.ready).toBe(false);
  expect(document.querySelector("iframe")).toBeNull();
  const retry = runtime.syncInputs([]);
  const frame = document.querySelector("iframe")!;
  window.dispatchEvent(new MessageEvent("message", {
    source: frame.contentWindow,
    data: { source: "oa-sandbox", type: "ready" }
  }));
  await retry;
  expect(runtime.started).toBe(true);
  runtime.dispose();
  request.mockRestore();
  vi.useRealTimers();
});

it("rejects pending requests immediately when restarting the kernel", async () => {
  const runtime = new PythonRuntime("/omero_analysis/runtime/");
  const request = vi.spyOn(runtime as any, "request").mockResolvedValue(undefined);
  const startup = runtime.start([]);
  const frame = document.querySelector("iframe")!;
  frame.dispatchEvent(new Event("load"));
  await startup;
  request.mockRestore();
  const run = runtime.run("1");
  const interrupted = expect(run).rejects.toThrow("Python execution stopped");
  await Promise.resolve();
  const restart = runtime.start([]);
  const stopped = expect(restart).rejects.toThrow("Python execution stopped");
  await interrupted;
  runtime.stop();
  await stopped;
  runtime.dispose();
});

it("retries a stalled sandbox navigation once before the startup deadline", async () => {
  vi.useFakeTimers();
  const runtime = new PythonRuntime("/omero_analysis/runtime/");
  const request = vi.spyOn(runtime as any, "request").mockResolvedValue(undefined);
  const startup = runtime.start([]);
  const frame = document.querySelector("iframe")!;
  const initial = frame.src;
  await vi.advanceTimersByTimeAsync(5_000);
  expect(frame.src).not.toBe(initial);
  expect(new URL(frame.src).searchParams.has("startup_retry")).toBe(true);
  const retry = frame.src;
  frame.dispatchEvent(new Event("load"));
  await startup;
  await vi.advanceTimersByTimeAsync(60_000);
  expect(frame.src).toBe(retry);
  expect(runtime.started).toBe(true);
  runtime.dispose();
  request.mockRestore();
  vi.useRealTimers();
});
