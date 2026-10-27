import { createReadStream, existsSync, readFileSync } from "node:fs";
import { stat, mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { chromium } from "playwright-core";

const root = resolve(import.meta.dirname, "../../src/omero_analysis/static/omero_analysis");
const sandboxTemplate = readFileSync(
  resolve(import.meta.dirname, "../../src/omero_analysis/templates/omero_analysis/runtime_sandbox.html"),
  "utf8"
);
const chrome = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].find((candidate) => candidate && existsSync(candidate));
if (!chrome) throw new Error("Chrome/Chromium was not found; set CHROME_PATH");

const contentTypes = {
  ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".wasm": "application/wasm",
  ".whl": "application/zip", ".zip": "application/zip"
};
const json = (response, value) => {
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(value));
};

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url || "/", "http://smoke.invalid").pathname;
  if (pathname === "/static/webclient/image/folder16.png") {
    response.setHeader("Content-Type", "image/png");
    response.end(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64"));
    return;
  }
  if (pathname === "/favicon.ico") {
    response.statusCode = 204;
    response.end();
    return;
  }
  if (pathname === "/workflow-skills/") {
    json(response, {
      schema: "nl.bioimaging.biomero-workflow-skills.v1",
      generated_at: "", consumer: "omero-analysis", config_hash: "",
      workflows: [], applications: [], diagnostics: []
    });
    return;
  }
  if (pathname === "/zarr-status/") {
    json(response, {
      schema_version: 1, available: false, installed: false, enabled: false,
      version: null, minimum_version: "0.4.0", reason: "not-installed"
    });
    return;
  }
  if (pathname === "/") {
    const styleNonce = "smoke-artifact-editor";
    response.setHeader("Content-Type", "text/html");
    response.setHeader(
      "Content-Security-Policy",
      `default-src 'self'; script-src 'self'; style-src 'self' 'nonce-${styleNonce}'; img-src 'self' data: blob:; ` +
      "connect-src 'self' https: http://localhost:*; worker-src blob:; frame-src 'self' blob:; " +
      "object-src 'none'; base-uri 'self'; form-action 'self'"
    );
    response.end(`<!doctype html><meta charset="utf-8"><title>Analysis smoke</title>
      <link rel="stylesheet" href="/app.css">
      <div id="root"
        data-workflow-skills-url="/workflow-skills/"
        data-zarr-viewer-status-url="/zarr-status/"
        data-style-nonce="${styleNonce}"
        data-runtime-base="/runtime/ASSET"></div>
      <script id="omero-analysis-context" type="application/json">null</script>
      <script type="module" src="/app.js"></script>`);
    return;
  }
  if (pathname === "/runtime-sandbox/") {
    const origin = `http://${request.headers.host}`;
    response.setHeader("Content-Type", "text/html");
    response.setHeader(
      "Content-Security-Policy",
      "default-src 'none'; script-src 'unsafe-inline' 'wasm-unsafe-eval' blob: " + origin + "; " +
      "connect-src " + origin + "; img-src data: blob:; style-src 'unsafe-inline'; " +
      "worker-src blob:; object-src 'none'; base-uri 'none'; form-action 'none'"
    );
    response.end(sandboxTemplate);
    return;
  }

  const relative = pathname.startsWith("/runtime/")
    ? `pyodide/${pathname.slice("/runtime/".length)}`
    : decodeURIComponent(pathname.slice(1));
  const file = resolve(root, relative || "__missing__");
  if (!file.startsWith(root + sep) || !(await stat(file).catch(() => null))?.isFile()) {
    response.statusCode = 404;
    response.end();
    return;
  }
  response.setHeader("Content-Type", contentTypes[extname(file)] || "application/octet-stream");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  createReadStream(file).pipe(response);
});

await new Promise((ready) => server.listen(0, "127.0.0.1", ready));
const { port } = server.address();
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const context = await browser.newContext();
await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
const page = await context.newPage();
const errors = [];
page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
// This isolated browser uses synthetic input only. It never opens a user workspace.
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(String(error)));

try {
  await page.goto(`http://127.0.0.1:${port}/`);
  const notebookTab = page.getByRole("button", { name: "Notebooks", exact: true });
  await notebookTab.waitFor({ timeout: 15_000 });
  if (await page.locator('iframe[title="OMERO Analysis Python runtime"]').count()) {
    throw new Error("Opening Analysis eagerly created the Python runtime");
  }
  for (const tab of ["Inspector", "Libraries", "Skills"]) {
    await page.getByRole("button", { name: tab, exact: true }).waitFor();
  }
  await notebookTab.focus();
  await page.keyboard.press("Enter");
  if (await notebookTab.getAttribute("aria-current") !== "page") {
    throw new Error("Notebooks tab was not keyboard accessible");
  }
  await page.locator('input[type="file"]:not([accept])').setInputFiles({
    name: "smoke.csv", mimeType: "text/csv", buffer: Buffer.from("group,value\na,1\nb,2\n")
  });
  await page.locator('.compact-file-name strong').getByText("smoke.csv", { exact: true }).waitFor();
  const portableContract = {
    schema: "nl.bioimaging.omero-analysis-notebook.v1",
    inputs: [{ id: "measurements", kind: "query", path: "input/smoke.csv", formats: ["csv"], required: true }],
    results: { path: "results" },
    parameters: [{ name: "minimum", type: "integer", default: 1, minimum: 0, label: "Minimum value" }],
    requirements: ["pandas", "matplotlib"]
  };
  const portableNotebook = {
    nbformat: 4, nbformat_minor: 5,
    metadata: {
      kernelspec: { display_name: "Python 3", language: "python", name: "python3" },
      language_info: { name: "python" }
    },
    cells: [{
      id: "config", cell_type: "code", metadata: { tags: ["omero-analysis-config"] },
      execution_count: null, outputs: [],
      source: `import omero_analysis_notebook as oan\nctx = oan.configure(r'''${JSON.stringify(portableContract)}''')\nctx.display_parameters()\n`
    }, {
      id: "query", cell_type: "code", metadata: {}, execution_count: null, outputs: [],
      source: [
        "import matplotlib.pyplot as plt",
        "rows = await ctx.query('measurements', 'SELECT \"group\", value FROM data WHERE value >= $minimum ORDER BY \"group\" LIMIT 10', {'minimum': ctx.params['minimum']})",
        "rows.to_csv(ctx.results / 'portable-summary.csv', index=False)",
        "fig, ax = plt.subplots()",
        "ax.bar(rows['group'], rows['value'])",
        "fig.savefig(ctx.results / 'portable-summary.png')",
        "fig.savefig(ctx.results / 'portable-summary.svg')",
        "plt.close(fig)",
        "assert len(rows) == 2 and rows['value'].sum() == 3",
        "print('Synthetic query and plot verified')"
      ].join("\n")
    }]
  };
  await page.locator('input[accept^=".ipynb"]').setInputFiles({
    name: "portable-smoke.ipynb", mimeType: "application/x-ipynb+json",
    buffer: Buffer.from(JSON.stringify(portableNotebook))
  });
  await page.getByRole("combobox", { name: "Notebook", exact: true }).selectOption({ label: "portable-smoke.ipynb" });
  await page.getByRole("button", { name: "Run all", exact: true }).waitFor();
  if (await page.getByText("Notebook run completed.", { exact: true }).count()) throw new Error("Import executed the notebook");
  await page.getByRole("button", { name: "Run all", exact: true }).click();
  await page.getByText("Notebook run completed.", { exact: true }).waitFor({ timeout: 120_000 });
  for (const extension of ["csv", "png", "svg"]) {
    await page.locator(".compact-file-name strong").getByText(`portable-summary.${extension}`, { exact: true }).waitFor({ state: "attached" });
  }
  if (errors.length) throw new Error(`Browser console errors:\n${errors.join("\n")}`);
  console.log("Browser smoke passed: notebook navigation, input attachment, portable import without execution, real Python startup, bounded query and PNG/SVG/CSV results");
} catch (error) {
  await mkdir("test-results", { recursive: true });
  await page.screenshot({ path: "test-results/smoke-failure.png", fullPage: true }).catch(() => {});
  await context.tracing.stop({ path: "test-results/smoke-trace.zip" }).catch(() => {});
  await writeFile("test-results/smoke-errors.txt", `${String(error)}\n${errors.join("\n")}`);
  console.error("Visible page:", await page.locator("body").innerText().catch(() => ""));
  console.error("Browser errors:", errors.join("\n"));
  throw error;
} finally {
  await browser.close();
  await new Promise((closed) => server.close(closed));
}
