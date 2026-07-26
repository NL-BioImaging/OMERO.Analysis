import type { RuntimeOutput, WorkspaceFile } from "./types";

interface Pending {
  resolve: (value: any) => void;
  reject: (reason: Error) => void;
  timer: number;
}

const PACKAGES = [
  "micropip",
  "numpy",
  "pandas",
  "matplotlib",
  "duckdb",
  "pyarrow",
  "python-calamine",
  "xlrd"
];

function runtimeWorker(runtimeBase: string): string {
  const base = JSON.stringify(runtimeBase.replace(/\/$/, ""));
  const packages = JSON.stringify(PACKAGES);
  return `
const runtimeBase = ${base};
const send = (id, type, value, transfer = []) => postMessage({source:"oac-runtime", id, type, value}, transfer);
let pyodide;
const mime = (name) => name.endsWith(".png") ? "image/png" : name.endsWith(".svg") ? "image/svg+xml" :
  name.endsWith(".csv") ? "text/csv" : name.endsWith(".json") ? "application/json" :
  name.endsWith(".pdf") ? "application/pdf" : "application/octet-stream";
async function boot() {
  const module = await import(runtimeBase + "/pyodide.mjs");
  pyodide = await module.loadPyodide({indexURL: runtimeBase + "/"});
  await pyodide.loadPackage(${packages});
  pyodide.FS.mkdirTree("/input");
  pyodide.FS.mkdirTree("/output");
}
const ready = boot();
function outputFiles() {
  const values = [];
  function walk(dir) {
    for (const name of pyodide.FS.readdir(dir)) {
      if (name === "." || name === "..") continue;
      const path = dir + "/" + name;
      const stat = pyodide.FS.stat(path);
      if (pyodide.FS.isDir(stat.mode)) walk(path);
      else {
        const bytes = pyodide.FS.readFile(path);
        const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
        values.push({name: path.slice(8), type: mime(name), data: buffer});
      }
    }
  }
  walk("/output");
  return values;
}
const previewCode = \`
import json as _oac_json, math as _oac_math
def _oac_clean(value):
    if value is None or isinstance(value, (str, bool, int)):
        return value
    if isinstance(value, float):
        return value if _oac_math.isfinite(value) else str(value)
    if hasattr(value, "head") and hasattr(value, "to_dict"):
        frame = value.head(100)
        if hasattr(frame, "iloc"):
            frame = frame.iloc[:, :50]
        return {"kind": "table", "data": frame.to_dict(orient="split")}
    if isinstance(value, dict):
        return {str(k): _oac_clean(v) for k, v in list(value.items())[:100]}
    if isinstance(value, (list, tuple)):
        return [_oac_clean(v) for v in value[:100]]
    if hasattr(value, "item"):
        try: return _oac_clean(value.item())
        except Exception: pass
    return str(value)
_oac_json.dumps(_oac_clean(globals().get("result")), ensure_ascii=False)
\`;
addEventListener("message", async (event) => {
  const message = event.data;
  if (!message || message.source !== "oac-parent") return;
  try {
    await ready;
    if (message.type === "ping") {
      send(message.id, "ready", true);
    } else if (message.type === "file") {
      const safe = String(message.value.name).replace(/[^A-Za-z0-9._ -]/g, "_");
      pyodide.FS.writeFile("/input/" + safe, new Uint8Array(message.value.data));
      send(message.id, "file", safe);
    } else if (message.type === "run") {
      let stdout = "", stderr = "";
      pyodide.setStdout({batched: (text) => { stdout += text + "\\n"; }});
      pyodide.setStderr({batched: (text) => { stderr += text + "\\n"; }});
      await pyodide.runPythonAsync(message.value.code);
      const raw = await pyodide.runPythonAsync(previewCode);
      const files = outputFiles();
      const transfers = files.map((file) => file.data);
      send(message.id, "result", {stdout, stderr, preview: JSON.parse(raw), files}, transfers);
    }
  } catch (error) {
    send(message.id, "error", String(error && error.stack || error));
  }
});
`;
}

export function sandboxDocument(runtimeBase: string): string {
  const origin = new URL(runtimeBase).origin;
  const worker = JSON.stringify(runtimeWorker(runtimeBase));
  return `<!doctype html><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'wasm-unsafe-eval' blob: ${origin}; connect-src ${origin}; img-src data: blob:; style-src 'unsafe-inline'; worker-src blob:">
<script>
const source = ${worker};
const worker = new Worker(URL.createObjectURL(new Blob([source], {type: "text/javascript"})));
worker.addEventListener("error", (event) => {
  console.error("Analysis Chat runtime worker failed:", event.message, event.filename, event.lineno);
});
worker.addEventListener("messageerror", (event) => {
  console.error("Analysis Chat runtime worker message failed:", event.data);
});
worker.addEventListener("message", (event) => {
  const files = event.data && event.data.value && event.data.value.files || [];
  parent.postMessage(event.data, "*", files.map((file) => file.data));
});
addEventListener("message", (event) => {
  const message = event.data;
  if (!message || message.source !== "oac-parent") return;
  const transfer = message.type === "file" && message.value && message.value.data
    ? [message.value.data] : [];
  worker.postMessage(message, transfer);
});
<\/script>`;
}

export class PythonRuntime {
  private frame: HTMLIFrameElement | null = null;
  private pending = new Map<string, Pending>();
  private inputs: WorkspaceFile[] = [];
  private counter = 0;
  private readyPromise: Promise<void> | null = null;

  constructor(private readonly runtimeBase: string) {
    window.addEventListener("message", this.receive);
  }

  async start(inputs: WorkspaceFile[]): Promise<void> {
    this.inputs = inputs.filter((file) => file.state === "ready" && file.data);
    this.destroyFrame();
    const frame = document.createElement("iframe");
    frame.hidden = true;
    frame.setAttribute("sandbox", "allow-scripts");
    frame.setAttribute("aria-hidden", "true");
    const loaded = new Promise<void>((resolve) =>
      frame.addEventListener("load", () => resolve(), { once: true })
    );
    frame.srcdoc = sandboxDocument(
      new URL(this.runtimeBase, window.location.href).toString()
    );
    document.body.append(frame);
    this.frame = frame;
    this.readyPromise = (async () => {
      await loaded;
      await this.request("ping", true, 120_000);
      for (const file of this.inputs) {
        const data = file.data!.slice(0);
        await this.request("file", { name: file.name, data }, 30_000, [data]);
      }
    })();
    return this.readyPromise;
  }

  async run(code: string): Promise<RuntimeOutput> {
    if (!this.readyPromise) await this.start(this.inputs);
    await this.readyPromise;
    return this.request("run", { code }, 120_000);
  }

  async reset(): Promise<void> {
    return this.start(this.inputs);
  }

  stop(): void {
    for (const item of this.pending.values()) {
      clearTimeout(item.timer);
      item.reject(new Error("Python execution stopped"));
    }
    this.pending.clear();
    this.destroyFrame();
  }

  dispose(): void {
    this.stop();
    this.destroyFrame();
    window.removeEventListener("message", this.receive);
  }

  private destroyFrame(): void {
    this.frame?.remove();
    this.frame = null;
    this.readyPromise = null;
  }

  private request(
    type: string,
    value: unknown,
    timeout: number,
    transfer: Transferable[] = []
  ): Promise<any> {
    const id = `runtime-${++this.counter}`;
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${type} exceeded ${timeout / 1000} seconds`));
        if (type === "run") void this.start(this.inputs);
      }, timeout);
      this.pending.set(id, { resolve, reject, timer });
      this.frame?.contentWindow?.postMessage(
        { source: "oac-parent", id, type, value },
        "*",
        transfer
      );
    });
  }

  private receive = (event: MessageEvent): void => {
    if (event.source !== this.frame?.contentWindow) return;
    const message = event.data;
    if (!message || message.source !== "oac-runtime") return;
    const pending = this.pending.get(message.id);
    if (!pending) return;
    clearTimeout(pending.timer);
    this.pending.delete(message.id);
    if (message.type === "error") pending.reject(new Error(message.value));
    else pending.resolve(message.value);
  };
}
