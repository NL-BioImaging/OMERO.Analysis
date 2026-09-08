import type { OmeroContext, RuntimeOutput, RuntimeProgress, WorkspaceFile } from "./types";
import type {
  NotebookProtocolBinding,
  NotebookProtocolContract
} from "./notebookProtocol";

interface Pending {
  resolve: (value: any) => void;
  reject: (reason: Error) => void;
  timer: number;
}

export interface RemoteQueryRuntimeResult {
  bindingId: string;
  name: string;
  data: ArrayBuffer;
  sourceDigest: string;
}

export interface NotebookQueryRequest {
  source: string;
  sql: string;
  parameters: Record<string, unknown>;
}

export interface NotebookQueryResponse {
  data: ArrayBuffer;
  metadata?: Record<string, unknown>;
}

export interface NotebookRuntimeConfiguration {
  contract: NotebookProtocolContract;
  bindings: NotebookProtocolBinding[];
  parameters: Record<string, boolean | number | string | null>;
}

const PACKAGES = [
  "micropip",
  "numpy",
  "pandas",
  "matplotlib",
  "duckdb"
];
export const RUNTIME_VERSION = "pyodide-314.0.3-oa-0.11";

export function runtimeWorker(runtimeBase: string): string {
  const base = JSON.stringify(runtimeBase.replace(/\/$/, ""));
  const packages = JSON.stringify(PACKAGES);
  return `
const runtimeBase = ${base};
const send = (id, type, value, transfer = []) => postMessage({source:"oa-runtime", id, type, value}, transfer);
const runtimeFetch = globalThis.fetch.bind(globalThis);
const denyNetwork = () => Promise.reject(new Error("Network access is disabled in Analysis Python"));
const loadedPackages = new Set(${packages});
const progress = (percent, message) => postMessage({
  source: "oa-runtime",
  type: "progress",
  value: {percent, message}
});
let pyodide;
let notebookQueryCounter = 0;
const notebookQueries = new Map();
function requestNotebookQuery(source, sql, parameters) {
  const id = "notebook-query-" + (++notebookQueryCounter);
  return new Promise((resolve, reject) => {
    notebookQueries.set(id, {resolve, reject});
    postMessage({
      source: "oa-runtime",
      id,
      type: "notebook_query",
      value: {
        source: String(source),
        sql: String(sql),
        parameters: typeof parameters === "string" ? JSON.parse(parameters) : parameters
      }
    });
  });
}
const inputSecrets = new Set();
const mime = (name) => name.endsWith(".png") ? "image/png" : name.endsWith(".svg") ? "image/svg+xml" :
  name.endsWith(".csv") ? "text/csv" : name.endsWith(".json") ? "application/json" :
  name.endsWith(".pdf") ? "application/pdf" : "application/octet-stream";
async function boot() {
  progress(12, "Loading the browser Python engine…");
  const module = await import(runtimeBase + "/pyodide.mjs");
  progress(28, "Starting the isolated Python runtime…");
  pyodide = await module.loadPyodide({indexURL: runtimeBase + "/"});
  progress(48, "Loading data-analysis packages…");
  await pyodide.loadPackage(${packages});
  await pyodide.runPythonAsync(\`
import os as _oa_os
_oa_os.environ["MPLBACKEND"] = "Agg"
import matplotlib as _oa_matplotlib
_oa_matplotlib.use("Agg", force=True)
\`);
  progress(78, "Loading vendored Python support…");
  const micropip = pyodide.pyimport("micropip");
  try {
    await micropip.install(runtimeBase + "/seaborn-0.13.2-py3-none-any.whl", {deps: false});
    await micropip.install(runtimeBase + "/pypdf-6.14.2-py3-none-any.whl", {deps: false});
    loadedPackages.add("seaborn");
    loadedPackages.add("pypdf");
  } finally {
    micropip.destroy();
  }
  progress(90, "Preparing the browser workspace…");
  pyodide.FS.mkdirTree("/input");
  pyodide.FS.mkdirTree("/output");
  pyodide.FS.mkdirTree("/selected_measurements");
  pyodide.FS.mkdirTree("/remote-query");
  pyodide.FS.mkdirTree("/.omero");
  progress(91, "Installing the notebook query bridge…");
  pyodide.globals.set("_oa_host_query", requestNotebookQuery);
  progress(93, "Installing the portable notebook SDK…");
  await pyodide.runPythonAsync(\`
import sys as _oa_sys, types as _oa_types, json as _oa_json, pathlib as _oa_pathlib, re as _oa_re
_oa_approved_packages = {
    "numpy", "pandas", "matplotlib", "seaborn", "scipy", "duckdb",
    "pyarrow", "python-calamine", "xlrd", "scikit-image"
}
async def _oa_piplite_install(package, *args, **kwargs):
    packages = [package] if isinstance(package, str) else list(package)
    denied = [name for name in packages if name not in _oa_approved_packages]
    if denied:
        raise ValueError("Package download is disabled; not approved: " + ", ".join(denied))
    return None
_oa_piplite = _oa_types.ModuleType("piplite")
_oa_piplite.install = _oa_piplite_install
_oa_sys.modules["piplite"] = _oa_piplite

def _oa_remote_query_csv(binding_id):
    import pathlib
    safe = "".join(ch if ch.isalnum() or ch in "._-" else "_" for ch in str(binding_id))
    path = pathlib.Path("/remote-query") / (safe + ".csv")
    if not path.is_file():
        raise RuntimeError(
            "Remote query binding is not materialized for this run: " + str(binding_id)
        )
    return str(path)

_oa_remote = _oa_types.ModuleType("omero_analysis_remote")
_oa_remote.query_csv = _oa_remote_query_csv
_oa_sys.modules["omero_analysis_remote"] = _oa_remote
\`);
  progress(94, "Installing notebook protocol validation…");
  await pyodide.runPythonAsync(\`

_oa_notebook_config_json = "{}"

def _oa_validate_query(sql):
    clean = _oa_re.sub(r"--[^\\\\n]*|/\\\\*.*?\\\\*/", " ", str(sql), flags=_oa_re.S).strip()
    if not _oa_re.match(r"^(select|with)\\\\b", clean, _oa_re.I) or ";" in clean.rstrip(";"):
        raise ValueError("Notebook queries must contain one SELECT or WITH … SELECT statement")
    if _oa_re.search(r"\\\\b(attach|copy|pragma|install|load|create|alter|drop|insert|update|delete|merge|call|set|reset)\\\\b", clean, _oa_re.I):
        raise ValueError("Notebook query contains a prohibited operation")
    if _oa_re.search(r"\\\\b(read_csv|read_csv_auto|read_parquet|read_json|sqlite_scan|postgres_scan|httpfs|delta_scan|iceberg_scan|shell|system)\\\\s*\\\\(", clean, _oa_re.I):
        raise ValueError("Notebook query contains a prohibited file or external function")
\`);
  progress(95, "Installing notebook context…");
  await pyodide.runPythonAsync(\`

class _OANotebookContext:
    def __init__(self, state):
        self.contract = state["contract"]
        self.params = dict(state.get("parameters", {}))
        self.results = _oa_pathlib.Path("/output")
        self._bindings = {item["inputId"]: item for item in state.get("bindings", [])}

    def input(self, identifier):
        binding = self._bindings.get(str(identifier))
        if not binding:
            raise KeyError("Notebook input is not bound: " + str(identifier))
        if binding.get("kind") == "query" and binding.get("mode") == "remote":
            raise RuntimeError("Remote query sources do not expose a filesystem path; use await ctx.query(...)")
        return _oa_pathlib.Path(binding["path"])

    async def query(self, source, sql, parameters=None):
        _oa_validate_query(sql)
        import time as _oa_query_time
        _oa_total_started = _oa_query_time.perf_counter()
        binding = self._bindings.get(str(source))
        if not binding or binding.get("kind") != "query":
            raise KeyError("Notebook query source is not bound: " + str(source))
        values = dict(parameters or {})
        if binding.get("mode") == "remote":
            response = _oa_json.loads(
                await _oa_host_query(str(source), str(sql), _oa_json.dumps(values))
            )
            path = response["path"]
            import pandas as _oa_pd
            _oa_parse_started = _oa_query_time.perf_counter()
            try:
                frame = _oa_pd.read_csv(str(path))
            finally:
                # Each host query has a private transfer path. The returned
                # DataFrame owns its data; keeping the CSV leaks large buffers.
                _oa_pathlib.Path(path).unlink(missing_ok=True)
            _oa_parse_ms = (_oa_query_time.perf_counter() - _oa_parse_started) * 1000
            metrics = dict(response.get("metadata") or {})
            metrics.update({
                "mode": "remote",
                "parse_ms": _oa_parse_ms,
                "total_ms": (_oa_query_time.perf_counter() - _oa_total_started) * 1000,
                "dataframe_memory_bytes": int(frame.memory_usage(deep=True).sum()),
            })
            byte_count = metrics.get("byte_count")
            total_ms = metrics.get("total_ms")
            if isinstance(byte_count, (int, float)) and isinstance(total_ms, (int, float)) and total_ms > 0:
                metrics["throughput_mib_per_second"] = float(byte_count) / (1024 * 1024) / (float(total_ms) / 1000)
            frame.attrs["omero_analysis_query"] = metrics
            return frame
        def _oa_local_result(frame):
            total_ms = (_oa_query_time.perf_counter() - _oa_total_started) * 1000
            frame.attrs["omero_analysis_query"] = {
                "mode": "local",
                "row_count": int(len(frame)),
                "total_ms": total_ms,
                "dataframe_memory_bytes": int(frame.memory_usage(deep=True).sum()),
            }
            return frame
        path = _oa_pathlib.Path(binding["path"])
        suffix = path.suffix.lower()
        if suffix == ".duckdb":
            import duckdb as _oa_duckdb
            connection = _oa_duckdb.connect(str(path), read_only=True)
            try:
                connection.execute("SET enable_external_access=false")
                connection.execute("SET autoinstall_known_extensions=false")
                connection.execute("SET autoload_known_extensions=false")
                return _oa_local_result(connection.execute(str(sql), values).fetchdf())
            finally:
                connection.close()
        if suffix in {".sqlite", ".sqlite3"}:
            import sqlite3 as _oa_sqlite, pandas as _oa_pd, time as _oa_time
            connection = _oa_sqlite.connect("file:" + path.as_posix() + "?mode=ro", uri=True)
            try:
                connection.execute("PRAGMA query_only=ON")
                denied = {
                    _oa_sqlite.SQLITE_INSERT, _oa_sqlite.SQLITE_UPDATE, _oa_sqlite.SQLITE_DELETE,
                    _oa_sqlite.SQLITE_CREATE_INDEX, _oa_sqlite.SQLITE_CREATE_TABLE,
                    _oa_sqlite.SQLITE_CREATE_TRIGGER, _oa_sqlite.SQLITE_CREATE_VIEW,
                    _oa_sqlite.SQLITE_DROP_INDEX, _oa_sqlite.SQLITE_DROP_TABLE,
                    _oa_sqlite.SQLITE_DROP_TRIGGER, _oa_sqlite.SQLITE_DROP_VIEW,
                    _oa_sqlite.SQLITE_ALTER_TABLE, _oa_sqlite.SQLITE_ATTACH, _oa_sqlite.SQLITE_DETACH,
                }
                connection.set_authorizer(lambda action, *_args: _oa_sqlite.SQLITE_DENY if action in denied else _oa_sqlite.SQLITE_OK)
                deadline = _oa_time.monotonic() + 30
                connection.set_progress_handler(lambda: 1 if _oa_time.monotonic() > deadline else 0, 10000)
                return _oa_local_result(_oa_pd.read_sql_query(str(sql), connection, params=values))
            finally:
                connection.close()
        if suffix == ".csv":
            import duckdb as _oa_duckdb, pandas as _oa_pd
            connection = _oa_duckdb.connect(":memory:")
            try:
                connection.register("data", _oa_pd.read_csv(path))
                connection.execute("SET enable_external_access=false")
                connection.execute("SET autoinstall_known_extensions=false")
                connection.execute("SET autoload_known_extensions=false")
                return _oa_local_result(connection.execute(str(sql), values).fetchdf())
            finally:
                connection.close()
        raise ValueError("Unsupported notebook query source: " + suffix)

    def display_parameters(self):
        # OMERO.Analysis deliberately renders a native host form. Notebook
        # JavaScript/widget state is never loaded in the sandbox.
        return self.params
\`);
  progress(96, "Publishing the portable notebook SDK…");
  await pyodide.runPythonAsync(\`

def _oa_notebook_configure(literal):
    declared = _oa_json.loads(literal) if isinstance(literal, str) else literal
    state = _oa_json.loads(_oa_notebook_config_json)
    if declared.get("schema") != "nl.bioimaging.omero-analysis-notebook.v1":
        raise ValueError("Invalid OMERO.Analysis notebook protocol schema")
    if [item.get("id") for item in declared.get("inputs", [])] != [
        item.get("id") for item in state.get("contract", {}).get("inputs", [])
    ]:
        raise ValueError("Notebook configuration differs from the host-validated contract")
    return _OANotebookContext(state)

_oa_notebook = _oa_types.ModuleType("omero_analysis_notebook")
_oa_notebook.configure = _oa_notebook_configure
_oa_notebook.__version__ = "0.1.0"
_oa_sys.modules["omero_analysis_notebook"] = _oa_notebook
\`);
  progress(98, "Securing the Python runtime…");
  // Package assets are loaded. Generated Python must not use the browser as a
  // network client, even to the public plugin origin.
  globalThis.fetch = denyNetwork;
  globalThis.XMLHttpRequest = class { constructor() { throw new Error("Network access is disabled"); } };
  globalThis.WebSocket = class { constructor() { throw new Error("Network access is disabled"); } };
  globalThis.EventSource = class { constructor() { throw new Error("Network access is disabled"); } };
}
async function ensurePackages(code) {
  const required = [];
  if (/\\b(import|from)\\s+scipy\\b/.test(code)) required.push("scipy");
  if (/\\b(import|from)\\s+pyarrow\\b|read_parquet|to_parquet/.test(code)) required.push("pyarrow");
  if (/read_excel|engine\\s*=\\s*["']calamine|python_calamine/.test(code)) required.push("python-calamine");
  if (/read_excel|\\.xls\\b/.test(code)) required.push("xlrd");
  if (/\\b(import|from)\\s+skimage\\b/.test(code)) required.push("scikit-image");
  const missing = required.filter((name) => !loadedPackages.has(name));
  if (!missing.length) return;
  progress(55, "Loading required package" + (missing.length === 1 ? "" : "s") + ": " + missing.join(", "));
  globalThis.fetch = runtimeFetch;
  try {
    await pyodide.loadPackage(missing);
    missing.forEach((name) => loadedPackages.add(name));
  } finally {
    globalThis.fetch = denyNetwork;
  }
}
async function ensureNotebookRequirements(requirements) {
  const approved = new Set([
    "duckdb", "matplotlib", "numpy", "pandas", "pyarrow", "pypdf",
    "python-calamine", "scikit-image", "scipy", "seaborn", "xlrd"
  ]);
  const requested = Array.from(new Set((Array.isArray(requirements) ? requirements : [])
    .map((item) => String(item).split(/[<>=!~]/, 1)[0].toLowerCase().replace(/[_.]/g, "-"))
    .filter((name) => approved.has(name))));
  const missing = requested.filter((name) => !loadedPackages.has(name));
  if (!missing.length) return;
  progress(55, "Loading notebook requirement" + (missing.length === 1 ? "" : "s") + ": " + missing.join(", "));
  globalThis.fetch = runtimeFetch;
  try {
    await pyodide.loadPackage(missing);
    missing.forEach((name) => loadedPackages.add(name));
  } finally {
    globalThis.fetch = denyNetwork;
  }
}
const ready = boot();
function removeTree(dir) {
  for (const name of pyodide.FS.readdir(dir)) {
    if (name === "." || name === "..") continue;
    const path = dir + "/" + name;
    const stat = pyodide.FS.stat(path);
    if (pyodide.FS.isDir(stat.mode)) {
      removeTree(path);
      pyodide.FS.rmdir(path);
    } else {
      pyodide.FS.unlink(path);
    }
  }
}
function outputState() {
  const values = new Map();
  const fingerprint = (bytes) => {
    let hash = 2166136261;
    for (let index = 0; index < bytes.length; index += 1) {
      hash ^= bytes[index];
      hash = Math.imul(hash, 16777619);
    }
    return String(bytes.length) + ":" + String(hash >>> 0);
  };
  function walk(dir) {
    for (const name of pyodide.FS.readdir(dir)) {
      if (name === "." || name === "..") continue;
      const path = dir + "/" + name;
      const stat = pyodide.FS.stat(path);
      if (pyodide.FS.isDir(stat.mode)) walk(path);
      else values.set(path, fingerprint(pyodide.FS.readFile(path)));
    }
  }
  walk("/output");
  return values;
}
function outputFiles(before) {
  const values = [];
  const fingerprint = (bytes) => {
    let hash = 2166136261;
    for (let index = 0; index < bytes.length; index += 1) {
      hash ^= bytes[index];
      hash = Math.imul(hash, 16777619);
    }
    return String(bytes.length) + ":" + String(hash >>> 0);
  };
  function walk(dir) {
    for (const name of pyodide.FS.readdir(dir)) {
      if (name === "." || name === "..") continue;
      const path = dir + "/" + name;
      const stat = pyodide.FS.stat(path);
      if (pyodide.FS.isDir(stat.mode)) walk(path);
      else {
        const bytes = pyodide.FS.readFile(path);
        if (before.get(path) === fingerprint(bytes)) continue;
        const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
        values.push({name: path.slice(8), type: mime(name), data: buffer});
      }
    }
  }
  walk("/output");
  return values;
}
function modelPayload(preview, stderr, files) {
  const clean = (value, depth = 0) => {
    if (depth > 5 || value == null || typeof value === "boolean" || typeof value === "number") return value;
    if (typeof value === "string") return value.length > 256 ? value.slice(0, 256) + "…" : value;
    if (Array.isArray(value)) return value.slice(0, 100).map((item) => clean(item, depth + 1));
    if (typeof value === "object") {
      const result = {};
      for (const [key, child] of Object.entries(value).slice(0, 100)) {
        result[String(key).slice(0, 128)] = clean(child, depth + 1);
      }
      return result;
    }
    return String(value).slice(0, 256);
  };
  let safePreview = clean(preview);
  let serialized = JSON.stringify(safePreview);
  for (const secret of inputSecrets) {
    if (secret.length >= 16 && serialized.includes(secret)) {
      safePreview = {kind: "withheld", reason: "Result matched complete source-file content"};
      serialized = JSON.stringify(safePreview);
      break;
    }
  }
  let truncated = false;
  if (serialized.length > 48 * 1024) {
    safePreview = {kind: "truncated", preview: serialized.slice(0, 48 * 1024)};
    truncated = true;
  }
  return {
    stderr: String(stderr || "").slice(0, 8192),
    preview: safePreview,
    generatedFiles: files.map((file) => ({
      name: file.name,
      size: file.data.byteLength,
      type: file.type
    })),
    truncated
  };
}
const previewCode = \`
import json as _oa_json, math as _oa_math
def _oa_clean(value):
    if value is None or isinstance(value, (str, bool, int)):
        return value
    if isinstance(value, float):
        return value if _oa_math.isfinite(value) else str(value)
    if hasattr(value, "head") and hasattr(value, "to_dict"):
        frame = value.head(100)
        if hasattr(frame, "iloc"):
            frame = frame.iloc[:, :50]
        return {"kind": "table", "data": frame.to_dict(orient="split")}
    if isinstance(value, dict):
        return {str(k): _oa_clean(v) for k, v in list(value.items())[:100]}
    if isinstance(value, (list, tuple)):
        return [_oa_clean(v) for v in value[:100]]
    if hasattr(value, "item"):
        try: return _oa_clean(value.item())
        except Exception: pass
    return str(value)
_oa_json.dumps(_oa_clean(globals().get("result")), ensure_ascii=False)
\`;
addEventListener("message", async (event) => {
  const message = event.data;
  if (!message || message.source !== "oa-parent") return;
  if (message.type === "notebook_query_result") {
    const pending = notebookQueries.get(message.id);
    if (!pending) return;
    notebookQueries.delete(message.id);
    if (message.error) {
      pending.reject(new Error(String(message.error)));
      return;
    }
    try {
      const bytes = new Uint8Array(message.value.data);
      const safe = String(message.id).replace(/[^A-Za-z0-9._-]/g, "_");
      const path = "/remote-query/" + safe + ".csv";
      pyodide.FS.writeFile(path, bytes);
      pending.resolve(JSON.stringify({
        path,
        metadata: message.value.metadata || {}
      }));
    } catch (error) {
      pending.reject(error);
    }
    return;
  }
  try {
    await ready;
    if (message.type === "ping") {
      send(message.id, "ready", true);
    } else if (message.type === "begin") {
      removeTree("/output");
      await pyodide.runPythonAsync(\`
for _oa_name in list(globals()):
    if not _oa_name.startswith("__"):
        globals().pop(_oa_name, None)
\`);
      send(message.id, "begin", true);
    } else if (message.type === "clear_inputs") {
      removeTree("/input");
      removeTree("/selected_measurements");
      inputSecrets.clear();
      send(message.id, "clear_inputs", true);
    } else if (message.type === "clear_remote_queries") {
      removeTree("/remote-query");
      send(message.id, "clear_remote_queries", true);
    } else if (message.type === "remote_query_file") {
      const bindingId = String(message.value.bindingId || "");
      if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(bindingId)) {
        throw new Error("Invalid remote query binding id");
      }
      const bytes = new Uint8Array(message.value.data);
      pyodide.FS.writeFile("/remote-query/" + bindingId + ".csv", bytes);
      send(message.id, "remote_query_file", bindingId);
    } else if (message.type === "notebook_config") {
      await ensureNotebookRequirements(message.value?.contract?.requirements);
      pyodide.globals.set("_oa_notebook_config_json", JSON.stringify(message.value || {}));
      send(message.id, "notebook_config", true);
    } else if (message.type === "file") {
      const safe = String(message.value.name).replace(/[^A-Za-z0-9._ -]/g, "_");
      const bytes = new Uint8Array(message.value.data);
      pyodide.FS.writeFile("/input/" + safe, bytes);
      pyodide.FS.mkdirTree("/input/selected_measurements");
      pyodide.FS.writeFile("/input/selected_measurements/" + safe, bytes);
      pyodide.FS.writeFile("/selected_measurements/" + safe, bytes);
      if (bytes.length <= 1024 * 1024) {
        try {
          const text = new TextDecoder("utf-8", {fatal: true}).decode(bytes).trim();
          if (text.length >= 16) inputSecrets.add(text);
        } catch {}
        if (bytes.length <= 64 * 1024) {
          let binary = "";
          for (const byte of bytes) binary += String.fromCharCode(byte);
          inputSecrets.add(btoa(binary));
        }
      }
      send(message.id, "file", safe);
    } else if (message.type === "context") {
      const encoded = new TextEncoder().encode(JSON.stringify(message.value || {}));
      pyodide.FS.mkdirTree("/input/.omero");
      pyodide.FS.writeFile("/.omero/context.json", encoded);
      pyodide.FS.writeFile("/input/.omero/context.json", encoded);
      send(message.id, "context", true);
    } else if (message.type === "extract_attachment") {
      const bytes = new Uint8Array(message.value.data);
      if (bytes.length > 25 * 1024 * 1024) throw new Error("Attachment exceeds 25 MiB");
      const safe = String(message.value.name || "attachment").replace(/[^A-Za-z0-9._ -]/g, "_");
      const path = "/tmp/oa-attachment-" + message.id.replace(/[^A-Za-z0-9-]/g, "") + "-" + safe;
      pyodide.FS.writeFile(path, bytes);
      pyodide.globals.set("_oa_attachment_path", path);
      pyodide.globals.set("_oa_attachment_kind", String(message.value.kind || ""));
      try {
        const raw = await pyodide.runPythonAsync(\`
import json as _oa_json, pathlib as _oa_pathlib, zipfile as _oa_zipfile
_oa_path = _oa_pathlib.Path(_oa_attachment_path)
_oa_kind = _oa_attachment_kind
_oa_warnings = []
_oa_text = ""
if _oa_kind == "docx":
    try:
        with _oa_zipfile.ZipFile(_oa_path) as _oa_docx:
            _oa_infos = _oa_docx.infolist()
            if len(_oa_infos) > 2048:
                raise ValueError("DOCX contains too many archive entries")
            _oa_total = sum(_oa_info.file_size for _oa_info in _oa_infos)
            if _oa_total > 100 * 1024 * 1024:
                raise ValueError("DOCX expands beyond the 100 MiB safety limit")
            if any(_oa_info.file_size > max(1024 * 1024, _oa_info.compress_size * 200) for _oa_info in _oa_infos):
                raise ValueError("DOCX contains an unsafe compressed entry")
            _oa_names = set(_oa_docx.namelist())
            if "[Content_Types].xml" not in _oa_names or "word/document.xml" not in _oa_names:
                raise ValueError("DOCX is missing required Office document parts")
            if any(_oa_name.startswith("word/media/") for _oa_name in _oa_names):
                _oa_warnings.append("Embedded images were ignored; OCR is not supported.")
            import xml.etree.ElementTree as _oa_et
            _oa_parts = ["word/document.xml"] + sorted(
                _oa_name for _oa_name in _oa_names
                if _oa_name.startswith(("word/header", "word/footer")) and _oa_name.endswith(".xml")
            ) + [
                _oa_name for _oa_name in ("word/footnotes.xml", "word/endnotes.xml")
                if _oa_name in _oa_names
            ]
            _oa_sections = []
            for _oa_part in _oa_parts:
                _oa_root = _oa_et.fromstring(_oa_docx.read(_oa_part))
                _oa_paragraphs = []
                for _oa_p in _oa_root.iter():
                    if _oa_p.tag.endswith("}p"):
                        _oa_line = "".join(
                            (_oa_node.text or "")
                            for _oa_node in _oa_p.iter()
                            if _oa_node.tag.endswith(("}t", "}tab", "}br"))
                        ).strip()
                        if _oa_line:
                            _oa_paragraphs.append(_oa_line)
                if _oa_paragraphs:
                    _oa_sections.append("\\n".join(_oa_paragraphs))
            _oa_text = "\\n\\n".join(_oa_sections).strip()
    except _oa_zipfile.BadZipFile as _oa_error:
        raise ValueError("DOCX is not a valid ZIP archive") from _oa_error
elif _oa_kind == "pdf":
    from pypdf import PdfReader as _oa_PdfReader
    try:
        _oa_reader = _oa_PdfReader(str(_oa_path), strict=True)
        if _oa_reader.is_encrypted:
            raise ValueError("Encrypted PDFs are not supported")
        _oa_pages = []
        _oa_empty = []
        for _oa_number, _oa_page in enumerate(_oa_reader.pages, 1):
            _oa_page_text = (_oa_page.extract_text() or "").strip()
            if _oa_page_text:
                _oa_pages.append("[Page " + str(_oa_number) + "]\\n" + _oa_page_text)
            else:
                _oa_empty.append(_oa_number)
        _oa_text = "\\n\\n".join(_oa_pages).strip()
        if _oa_empty and _oa_text:
            _oa_warnings.append("No extractable text on PDF page(s): " + ", ".join(map(str, _oa_empty)) + ". OCR is not supported.")
    except ValueError:
        raise
    except Exception as _oa_error:
        raise ValueError("PDF is malformed or unsupported: " + str(_oa_error)[:300]) from _oa_error
else:
    raise ValueError("Unsupported document extractor")
if not _oa_text:
    raise ValueError("No extractable text was found. OCR is not supported.")
_oa_json.dumps({"text": _oa_text, "warnings": _oa_warnings}, ensure_ascii=False)
\`);
        send(message.id, "extract_attachment", JSON.parse(raw));
      } finally {
        pyodide.globals.delete("_oa_attachment_path");
        pyodide.globals.delete("_oa_attachment_kind");
        try { pyodide.FS.unlink(path); } catch {}
      }
    } else if (message.type === "profile") {
      const profileNames = pyodide.FS.readdir("/input").join(" ");
      await ensurePackages(
        profileNames +
        (/\\.parquet\\b/i.test(profileNames) ? " read_parquet" : "") +
        (/\\.xlsx?\\b/i.test(profileNames) ? " read_excel calamine" : "")
      );
      const raw = await pyodide.runPythonAsync(\`
import json as _json
from pathlib import Path as _Path
_profiles = []
for _path in sorted(_Path("/input").iterdir()):
    _entry = {"path": str(_path), "format": _path.suffix.lower().lstrip("."), "size": _path.stat().st_size, "summary": {}}
    try:
        _suffix = _path.suffix.lower()
        if _suffix in {".duckdb", ".sqlite", ".sqlite3"}:
            if _suffix == ".duckdb":
                import duckdb as _db
                _con = _db.connect(str(_path), read_only=True)
                _tables = [r[0] for r in _con.execute("SHOW TABLES").fetchall()]
                _entry["summary"] = {"tables": [{"name": t, "columns": [{"name": r[0], "type": r[1]} for r in _con.execute(f'DESCRIBE SELECT * FROM "{t.replace(chr(34), chr(34)*2)}"').fetchall()]} for t in _tables[:100]]}
                _con.close()
            else:
                import sqlite3 as _sqlite
                _con = _sqlite.connect(f"file:{_path}?mode=ro", uri=True)
                _tables = [r[0] for r in _con.execute("SELECT name FROM sqlite_master WHERE type IN ('table','view') ORDER BY name").fetchall()]
                _entry["summary"] = {"tables": [{"name": t, "columns": [{"name": r[1], "type": r[2]} for r in _con.execute(f'PRAGMA table_info("{t.replace(chr(34), chr(34)*2)}")'.replace("''", "'")).fetchall()]} for t in _tables[:100]]}
                _con.close()
        elif _suffix in {".csv", ".tsv", ".parquet", ".xls", ".xlsx", ".json"}:
            import pandas as _pd
            _sheet_names = []
            _active_sheet = None
            if _suffix == ".parquet": _frame = _pd.read_parquet(_path)
            elif _suffix in {".xls", ".xlsx"}:
                _book = _pd.ExcelFile(_path, engine="calamine")
                _sheet_names = [str(_name) for _name in _book.sheet_names[:100]]
                _active_sheet = _sheet_names[0] if _sheet_names else None
                _frame = _book.parse(sheet_name=_active_sheet)
            elif _suffix == ".json": _frame = _pd.read_json(_path)
            else: _frame = _pd.read_csv(_path, sep="\\t" if _suffix == ".tsv" else ",")
            _preview = _json.loads(_frame.iloc[:100, :50].to_json(orient="split", date_format="iso"))
            _entry["summary"] = {
                "rows": int(len(_frame)),
                "columns": [{"name": str(c), "type": str(_frame[c].dtype), "nulls": int(_frame[c].isna().sum()), "distinct": int(_frame[c].nunique(dropna=True))} for c in list(_frame.columns)[:100]],
                "preview": {
                    "columns": [str(_column) for _column in _preview.get("columns", [])],
                    "data": _preview.get("data", [])
                }
            }
            if _active_sheet is not None:
                _entry["summary"]["sheet"] = _active_sheet
                _entry["summary"]["sheets"] = _sheet_names
        elif _suffix in {".npy", ".npz"}:
            import numpy as _np
            _value = _np.load(_path, allow_pickle=False)
            if hasattr(_value, "files"):
                _entry["summary"] = {"arrays": [{"name": n, "shape": list(_value[n].shape), "dtype": str(_value[n].dtype)} for n in _value.files[:100]]}
            else: _entry["summary"] = {"shape": list(_value.shape), "dtype": str(_value.dtype)}
    except Exception as _error:
        _entry["error"] = str(_error)[:1000]
    _profiles.append(_entry)
_json.dumps(_profiles, ensure_ascii=False)
\`);
      send(message.id, "profile", JSON.parse(raw));
    } else if (message.type === "run") {
      await ensurePackages(String(message.value.code || ""));
      const before = outputState();
      let stdout = "", stderr = "";
      pyodide.setStdout({batched: (text) => { stdout += text + "\\n"; }});
      pyodide.setStderr({batched: (text) => { stderr += text + "\\n"; }});
      if (message.value.createSvgCompanions) {
        await pyodide.runPythonAsync(\`
import pathlib as _oa_svg_pathlib
import matplotlib.figure as _oa_svg_figure
_oa_original_savefig = _oa_svg_figure.Figure.savefig
def _oa_savefig_with_svg(self, fname, *args, **kwargs):
    result = _oa_original_savefig(self, fname, *args, **kwargs)
    path = _oa_svg_pathlib.Path(str(fname))
    if path.suffix.lower() == ".png":
        svg_kwargs = {
            key: value for key, value in kwargs.items()
            if key in {"bbox_inches", "pad_inches", "facecolor", "edgecolor", "transparent", "dpi"}
        }
        _oa_original_savefig(self, path.with_suffix(".svg"), *args, format="svg", **svg_kwargs)
    return result
_oa_svg_figure.Figure.savefig = _oa_savefig_with_svg
\`);
      }
      try {
        await pyodide.runPythonAsync(message.value.code);
      } finally {
        if (message.value.createSvgCompanions) {
          await pyodide.runPythonAsync(\`
_oa_svg_figure.Figure.savefig = _oa_original_savefig
del _oa_original_savefig
\`);
        }
      }
      const raw = await pyodide.runPythonAsync(previewCode);
      const files = outputFiles(before);
      const safePayload = modelPayload(JSON.parse(raw), stderr, files);
      const transfers = files.map((file) => file.data);
      send(message.id, "result", {stdout, stderr, preview: JSON.parse(raw), modelPayload: safePayload, files}, transfers);
    }
  } catch (error) {
    send(message.id, "error", String(error && error.stack || error));
  }
});
`;
}

export function sandboxUrl(runtimeBase: string): string {
  return new URL("../runtime-sandbox/", runtimeBase).toString();
}

export class PythonRuntime {
  private frame: HTMLIFrameElement | null = null;
  private pending = new Map<string, Pending>();
  private inputs: WorkspaceFile[] = [];
  private counter = 0;
  private readyPromise: Promise<void> | null = null;
  private onProgress: ((progress: RuntimeProgress) => void) | null = null;
  private notebookQueryHandler: ((request: NotebookQueryRequest) => Promise<NotebookQueryResponse>) | null = null;

  constructor(
    private readonly runtimeBase: string,
    private readonly context: OmeroContext | null = null,
    private readonly notebookCellTimeoutMs = 300_000
  ) {
    window.addEventListener("message", this.receive);
  }

  async start(
    inputs: WorkspaceFile[],
    onProgress?: (progress: RuntimeProgress) => void
  ): Promise<void> {
    if (onProgress) this.onProgress = onProgress;
    this.inputs = inputs.filter((file) => file.state === "ready" && file.data);
    this.destroyFrame();
    this.report({ percent: 2, message: "Creating the secure Python sandbox…" });
    const frame = document.createElement("iframe");
    frame.hidden = true;
    frame.setAttribute("sandbox", "allow-scripts");
    frame.setAttribute("aria-hidden", "true");
    const loaded = new Promise<void>((resolve) =>
      frame.addEventListener("load", () => resolve(), { once: true })
    );
    const absoluteRuntimeBase = new URL(this.runtimeBase, window.location.href).toString();
    frame.src = sandboxUrl(absoluteRuntimeBase);
    document.body.append(frame);
    this.frame = frame;
    this.readyPromise = (async () => {
      await loaded;
      this.report({ percent: 8, message: "Connecting to the Python worker…" });
      frame.contentWindow?.postMessage(
        { source: "oa-bootstrap", value: runtimeWorker(absoluteRuntimeBase) },
        "*"
      );
      await this.request("ping", true, 120_000);
      await this.request("context", this.context ? {
        object_type: this.context.object_type,
        object_id: this.context.object_id,
        group_id: this.context.group_id
      } : {}, 30_000);
      for (let index = 0; index < this.inputs.length; index += 1) {
        const file = this.inputs[index];
        this.report({
          percent: 92 + Math.round(index / Math.max(1, this.inputs.length) * 7),
          message: `Loading ${index + 1} of ${this.inputs.length} data files into Python…`
        });
        const data = file.data!.slice(0);
        await this.request("file", { name: file.name, data }, 30_000, [data]);
      }
      this.report({ percent: 100, message: "Browser Python is ready" });
    })();
    return this.readyPromise;
  }

  async run(
    code: string,
    timeout = 120_000,
    createSvgCompanions = false
  ): Promise<RuntimeOutput> {
    if (!this.readyPromise) await this.start(this.inputs);
    await this.readyPromise;
    return this.request("run", { code, createSvgCompanions }, timeout);
  }

  async runNotebookCell(source: string): Promise<RuntimeOutput> {
    if (/^\s*[!%]/m.test(source)) {
      throw new Error("Notebook magics and shell commands are disabled");
    }
    const packageRequests = Array.from(
      source.matchAll(/piplite\.install\(\s*["']([^"']+)["']/g),
      (match) => match[1]
    );
    const approved = new Set([
      "numpy", "pandas", "matplotlib", "seaborn", "scipy", "duckdb",
      "pyarrow", "python-calamine", "xlrd", "scikit-image"
    ]);
    const denied = packageRequests.find((name) => !approved.has(name));
    if (denied) {
      throw new Error(`Package ${denied} is not in the approved notebook package set`);
    }
    const encoded = JSON.stringify(source);
    return this.run(`
import ast as _oa_ast, inspect as _oa_inspect, warnings as _oa_warnings
globals().pop("result", None)
_oa_warnings.filterwarnings(
    "ignore",
    message="FigureCanvasAgg is non-interactive, and thus cannot be shown",
    category=UserWarning,
)
_oa_source = ${encoded}
_oa_tree = _oa_ast.parse(_oa_source, filename="<notebook-cell>", mode="exec")
if _oa_tree.body and isinstance(_oa_tree.body[-1], _oa_ast.Expr):
    _oa_tree.body[-1] = _oa_ast.Assign(
        targets=[_oa_ast.Name(id="result", ctx=_oa_ast.Store())],
        value=_oa_tree.body[-1].value,
    )
    _oa_ast.fix_missing_locations(_oa_tree)
_oa_compiled = compile(
    _oa_tree,
    "<notebook-cell>",
    "exec",
    flags=_oa_ast.PyCF_ALLOW_TOP_LEVEL_AWAIT,
)
_oa_awaitable = eval(_oa_compiled, globals(), globals())
if _oa_inspect.isawaitable(_oa_awaitable):
    await _oa_awaitable
try:
    import matplotlib.pyplot as _oa_plt
    for _oa_figure_number in _oa_plt.get_fignums():
        _oa_plt.figure(_oa_figure_number).savefig(
            f"/output/notebook-figure-{_oa_figure_number}.png",
            format="png",
            bbox_inches="tight",
        )
except Exception:
    pass
`, this.notebookCellTimeoutMs);
  }

  setNotebookQueryHandler(
    handler: ((request: NotebookQueryRequest) => Promise<NotebookQueryResponse>) | null
  ): void {
    this.notebookQueryHandler = handler;
  }

  async configureNotebook(configuration: NotebookRuntimeConfiguration): Promise<void> {
    if (!this.readyPromise) await this.start(this.inputs, this.onProgress || undefined);
    await this.readyPromise;
    await this.request("notebook_config", configuration, 30_000);
  }

  async syncInputs(inputs: WorkspaceFile[]): Promise<void> {
    this.inputs = inputs.filter((file) => file.state === "ready" && file.data);
    if (!this.readyPromise) {
      await this.start(this.inputs, this.onProgress || undefined);
      return;
    }
    await this.readyPromise;
    await this.request("clear_inputs", true, 30_000);
    await this.request("context", this.context ? {
      object_type: this.context.object_type,
      object_id: this.context.object_id,
      group_id: this.context.group_id
    } : {}, 30_000);
    for (let index = 0; index < this.inputs.length; index += 1) {
      const file = this.inputs[index];
      this.report({
        percent: 92 + Math.round(index / Math.max(1, this.inputs.length) * 7),
        message: `Synchronizing ${index + 1} of ${this.inputs.length} input files…`
      });
      const data = file.data!.slice(0);
      await this.request("file", { name: file.name, data }, 30_000, [data]);
    }
    this.report({ percent: 100, message: "Browser Python is ready" });
  }

  async syncRemoteQueries(results: RemoteQueryRuntimeResult[]): Promise<void> {
    if (!this.readyPromise) await this.start(this.inputs, this.onProgress || undefined);
    await this.readyPromise;
    await this.request("clear_remote_queries", true, 30_000);
    for (const result of results) {
      const data = result.data.slice(0);
      await this.request("remote_query_file", {
        bindingId: result.bindingId,
        name: result.name,
        data
      }, 30_000, [data]);
    }
  }

  async profileInputs(): Promise<import("./types").DataProfile[]> {
    if (!this.readyPromise) await this.start(this.inputs);
    await this.readyPromise;
    return this.request("profile", true, 120_000);
  }

  async extractAttachment(
    name: string,
    kind: "docx" | "pdf",
    source: ArrayBuffer
  ): Promise<{ text: string; warnings: string[] }> {
    if (!this.readyPromise) await this.start(this.inputs);
    await this.readyPromise;
    const data = source.slice(0);
    return this.request("extract_attachment", { name, kind, data }, 120_000, [data]);
  }

  async beginTurn(): Promise<void> {
    if (!this.readyPromise) await this.start(this.inputs);
    await this.readyPromise;
    await this.request("begin", true, 30_000);
  }

  async reset(): Promise<void> {
    return this.start(this.inputs, this.onProgress || undefined);
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
        { source: "oa-parent", id, type, value },
        "*",
        transfer
      );
    });
  }

  private receive = (event: MessageEvent): void => {
    if (event.source !== this.frame?.contentWindow) return;
    const message = event.data;
    if (!message || message.source !== "oa-runtime") return;
    if (message.type === "progress") {
      this.report(message.value);
      return;
    }
    if (message.type === "notebook_query") {
      const respond = async () => {
        try {
          if (!this.notebookQueryHandler) throw new Error("Notebook query bridge is not configured");
          const result = await this.notebookQueryHandler({
            source: String(message.value?.source || ""),
            sql: String(message.value?.sql || ""),
            parameters: message.value?.parameters && typeof message.value.parameters === "object"
              ? message.value.parameters
              : {}
          });
          // Transfer the downloaded result directly. Cloning here would briefly
          // double browser memory for the benchmark's several-hundred-MiB CSVs.
          const data = result.data;
          this.frame?.contentWindow?.postMessage({
            source: "oa-parent",
            id: message.id,
            type: "notebook_query_result",
            value: { data, metadata: result.metadata || {} }
          }, "*", [data]);
        } catch (error) {
          this.frame?.contentWindow?.postMessage({
            source: "oa-parent",
            id: message.id,
            type: "notebook_query_result",
            error: String(error)
          }, "*");
        }
      };
      void respond();
      return;
    }
    const pending = this.pending.get(message.id);
    if (!pending) return;
    clearTimeout(pending.timer);
    this.pending.delete(message.id);
    if (message.type === "error") pending.reject(new Error(message.value));
    else pending.resolve(message.value);
  };

  private report(progress: RuntimeProgress): void {
    this.onProgress?.({
      percent: Math.max(0, Math.min(100, Number(progress.percent) || 0)),
      message: String(progress.message || "Preparing browser Python…")
    });
  }
}
