// Real Chromium/Pyodide ctx.query() acceptance against checksum-verified worker CSV bytes.
import { createHash } from "node:crypto";
import { createReadStream, existsSync, readFileSync, appendFileSync, mkdirSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { resolve, extname, sep } from "node:path";
import ts from "typescript";
import { chromium } from "playwright-core";

const repo = resolve(import.meta.dirname, "../..");
const csv = resolve(process.env.QUERY_GATE_CSV || resolve(repo, "benchmark-data/10m/dataquery-benchmark.csv"));
const evidence = resolve(process.env.QUERY_GATE_EVIDENCE || resolve(repo, "benchmark-data/release-10m-single.jsonl"));
const output = resolve(process.env.QUERY_GATE_OUTPUT || resolve(repo, "benchmark-data/browser-10m.jsonl"));
if (existsSync(output)) throw new Error("Select a new QUERY_GATE_OUTPUT evidence file");
mkdirSync(resolve(output, ".."), { recursive: true });
const hash = createHash("sha256");
for await (const chunk of createReadStream(csv)) hash.update(chunk);
const digest = hash.digest("hex");
const results = readFileSync(evidence, "utf8").trim().split("\n").map(JSON.parse);
for (const format of ["duckdb", "sqlite", "csv"]) {
  if (!results.some(r => r.event === "request" && r.format === format && r.row_count === 10000000 && r.sha256 === digest)) {
    throw new Error(`CSV has not been verified against a 10M-row ${format} worker result`);
  }
}
const staticRoot = resolve(repo, "src/omero_analysis/static/omero_analysis");
const source = readFileSync(resolve(repo, "frontend/src/runtime.ts"), "utf8");
const module = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const sandbox = readFileSync(resolve(repo, "src/omero_analysis/templates/omero_analysis/runtime_sandbox.html"), "utf8");
const types = { ".js": "text/javascript", ".mjs": "text/javascript", ".wasm": "application/wasm", ".json": "application/json" };
const server = createServer((request, response) => {
  const path = new URL(request.url, "http://gate.invalid").pathname;
  response.setHeader("Access-Control-Allow-Origin", "*");
  if (path === "/") { response.setHeader("Content-Type", "text/html"); response.end("<!doctype html><title>Query runtime gate</title>"); return; }
  if (path === "/runtime.js") { response.setHeader("Content-Type", "text/javascript"); response.end(module); return; }
  if (path === "/runtime-sandbox/") {
    const origin = `http://${request.headers.host}`;
    response.setHeader("Content-Type", "text/html");
    response.setHeader("Content-Security-Policy", "default-src 'none'; script-src 'unsafe-inline' 'wasm-unsafe-eval' blob: " + origin + "; connect-src " + origin + "; img-src data: blob:; style-src 'unsafe-inline'; worker-src blob:; object-src 'none'; base-uri 'none'; form-action 'none'");
    response.end(sandbox); return;
  }
  let file;
  if (path === "/result.csv") file = csv;
  else if (path.startsWith("/runtime/")) file = resolve(staticRoot, "pyodide", path.slice("/runtime/".length));
  if (!file || (!file.startsWith(staticRoot + sep) && file !== csv) || !existsSync(file)) { response.writeHead(404); response.end(); return; }
  response.setHeader("Content-Type", types[extname(file)] || "application/octet-stream");
  response.setHeader("Content-Length", statSync(file).size);
  createReadStream(file).pipe(response);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const chrome = [process.env.CHROME_PATH, "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "/usr/bin/chromium", "/usr/bin/google-chrome"].find(p => p && existsSync(p));
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage();
page.on("console", message => { if (message.type() === "error") console.error(message.text()); });
page.on("pageerror", error => console.error(String(error)));
page.on("requestfailed", request => console.error(request.url(), request.failure()?.errorText));
try {
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.evaluate(async () => {
    const { PythonRuntime } = await import("/runtime.js");
    window.runtime = new PythonRuntime(location.origin + "/runtime/", null, 3600000);
    await window.runtime.start([]);
    const contract = { schema: "nl.bioimaging.omero-analysis-notebook.v1", inputs: [{id:"source",kind:"query"}], results:{path:"results"}, parameters:[], requirements:["pandas"] };
    await window.runtime.configureNotebook({contract, bindings:[{inputId:"source",kind:"query",mode:"remote",name:"result.csv"}], parameters:{}});
    window.runtime.setNotebookQueryHandler(async () => ({data:await (await fetch("/result.csv")).arrayBuffer(),metadata:{row_count:10000000}}));
  });
  for (const format of ["duckdb", "sqlite", "csv"]) {
    const started = Date.now();
    const result = await page.evaluate(async () => window.runtime.runNotebookCell(`
from omero_analysis_notebook import configure
import gc, pathlib
ctx = configure({"schema":"nl.bioimaging.omero-analysis-notebook.v1","inputs":[{"id":"source"}]})
frame = await ctx.query("source", "SELECT * FROM measurements")
assert len(frame) == 10000000
assert int(frame.row_id.sum()) == 49999995000000
assert len(frame.columns) == 10
assert not list(pathlib.Path('/remote-query').iterdir())
metrics = dict(frame.attrs['omero_analysis_query'])
del frame
gc.collect()
metrics
`));
    const row = {format, status:"passed", sha256:digest, seconds:(Date.now()-started)/1000, result};
    appendFileSync(output, JSON.stringify(row) + "\n");
    console.log(`${format} browser 10M parse passed (${row.seconds}s)`);
  }
  await page.evaluate(async () => {
    window.runtime.setNotebookQueryHandler(async () => ({data:new ArrayBuffer(0)}));
    return window.runtime.runNotebookCell("try:\n    await ctx.query('source', 'SELECT 1')\nexcept Exception:\n    pass\nassert not list(pathlib.Path('/remote-query').iterdir())");
  });
} catch (error) {
  appendFileSync(output, JSON.stringify({status:"failed",error:String(error)})+"\n");
  throw error;
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
