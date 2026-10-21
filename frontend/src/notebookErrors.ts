import type { NotebookOutput } from "./types";

/** Keep the Python exception readable; put technical details behind disclosure. */
export function notebookError(error: unknown): NotebookOutput {
  const raw = String(error instanceof Error ? error.message : error)
    .replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "");
  const lines = raw.split(/\r?\n/);
  const stackStart = lines.findIndex(line => /^\s+at\s/.test(line));
  const traceback = (stackStart < 0 ? lines : lines.slice(0, stackStart))
    .map(line => line.replace(/^PythonError:\s*(?=Traceback)/, ""));
  const exception = [...traceback].reverse().find(line =>
    /^[\w.]+(?:Error|Exception|Interrupt|Exit|Warning):(?:\s|$)/.test(line.trim()));
  const summary = (exception || traceback.find(line => line.trim()) || "Execution failed").trim();
  const match = summary.match(/^([\w.]+):\s*([\s\S]*)$/);
  return {
    output_type: "error",
    ename: match?.[1] || (error instanceof Error ? error.name : "Error"),
    evalue: (match?.[2] || summary).slice(0, 1000),
    traceback
  };
}

export function notebookErrorSummary(error: unknown): string {
  const output = notebookError(error);
  return `${output.ename}: ${output.evalue}`;
}
