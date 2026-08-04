import { createReadStream, existsSync, readFileSync } from "node:fs";
import { stat } from "node:fs/promises";
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
  if (pathname === "/favicon.ico") {
    response.statusCode = 204;
    response.end();
    return;
  }
  if (pathname === "/workflow-skills/") {
    json(response, {
      schema: "nl.bioimaging.omero-workflow-skills.v1",
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
const page = await browser.newPage();
const errors = [];
let completions = 0;

await page.route("http://localhost:1234/**", (route) => route.fulfill({
  status: 200,
  headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
  body: JSON.stringify({ data: [] })
}));
await page.route("http://localhost:11434/**", (route) => route.fulfill({
  status: 200,
  headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
  body: JSON.stringify({ models: [] })
}));

await page.route("https://provider.example/**", async (route) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization,content-type",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
  };
  if (route.request().method() === "OPTIONS") {
    await route.fulfill({ status: 204, headers: cors });
    return;
  }
  const payload = route.request().postDataJSON();
  if (payload.model !== "smoke-model") throw new Error("Configured model was not sent");
  if (route.request().headers().authorization !== "Bearer smoke-key") {
    throw new Error("Configured bearer credential was not sent");
  }
  if (route.request().postData().includes("group,value\\na,1\\nb,2")) {
    throw new Error("A complete source file was included in the provider request");
  }
  completions += 1;
  const message = completions === 1 ? {
    role: "assistant", content: null, tool_calls: [{
      id: "analysis", type: "function", function: {
        name: "run_python",
        arguments: JSON.stringify({ purpose: "analysis", code: [
          "import pandas as pd",
          "import matplotlib.pyplot as plt",
          "data = pd.read_csv('/input/smoke.csv')",
          "data.to_csv('/output/smoke.csv', index=False)",
          "data.plot.bar(x='group', y='value', legend=False)",
          "plt.tight_layout()",
          "plt.savefig('/output/smoke.png')",
          "plt.close()"
        ].join("\n") })
      }
    }]
  } : {
    role: "assistant",
    content: "## Result\n\nRows analyzed **locally** and plotted reproducibly.",
    tool_calls: []
  };
  await route.fulfill({
    status: 200,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify({
      choices: [{ message }],
      usage: { prompt_tokens: 200, completion_tokens: 50, total_tokens: 250 }
    })
  });
});

page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(String(error)));

const answerDialog = async (answer) => {
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  await dialog.getByRole("textbox").fill(answer);
  await dialog.getByRole("button", { name: "Save" }).click();
};

try {
  await page.goto(`http://127.0.0.1:${port}/`);
  await page.getByText("Ready — browser Python will start when needed").waitFor({ timeout: 15_000 });
  if (await page.locator('iframe[title="OMERO Analysis Python runtime"]').count()) {
    throw new Error("Opening Analysis eagerly created the Python runtime");
  }
  const rootFolders = await page.locator(".workspace-tree > details > summary strong").allTextContents();
  if (JSON.stringify(rootFolders) !== JSON.stringify(["Input", "Chat", "Methods", "Pipelines", "Notebooks"])) {
    throw new Error(`Unexpected Workspace folder order: ${rootFolders.join(", ")}`);
  }
  if (await page.getByRole("button", { name: "Editor", exact: true }).count()) {
    throw new Error("Artifact Editor was enabled by default");
  }
  const notebookTab = page.getByRole("button", { name: "Notebook" });
  await notebookTab.focus();
  await page.keyboard.press("Enter");
  if (await notebookTab.getAttribute("aria-current") !== "page") {
    throw new Error("Notebook tab was not keyboard accessible");
  }
  const chatTab = page.getByRole("button", { name: "Chat" });
  await chatTab.focus();
  await page.keyboard.press("Enter");
  const themeToggle = page.getByRole("button", { name: "Switch to light theme" });
  await themeToggle.click();
  if (await page.locator(".app-shell").getAttribute("data-theme") !== "light") {
    throw new Error("Light theme did not activate");
  }
  await page.getByRole("button", { name: "Switch to dark theme" }).click();

  await page.locator('.file-browser-toolbar input[type="file"]').setInputFiles({
    name: "smoke.csv", mimeType: "text/csv", buffer: Buffer.from("group,value\na,1\nb,2\n")
  });
  await page.getByText("smoke.csv", { exact: true }).waitFor();
  const explorerBox = await page.locator(".workspace-tree").boundingBox();
  if (!explorerBox || explorerBox.width < 475) {
    throw new Error(`Workspace explorer did not use its wider default: ${explorerBox?.width}`);
  }
  if (await page.locator('.workspace-tree .browser-name strong[title="smoke.csv"]').count() !== 1) {
    throw new Error("Explorer items do not expose their full name as a tooltip");
  }
  await page.getByRole("button", { name: /Settings/ }).click();
  await page.getByRole("checkbox", { name: /Enable artifact editor/ }).check();
  await page.getByRole("button", { name: "Editor", exact: true }).waitFor();
  await page.getByText("AI Settings", { exact: true }).click();
  await page.getByLabel("API endpoint").fill("https://provider.example/v1");
  await page.getByLabel("Model or deployment").fill("smoke-model");
  await page.getByLabel("API key").fill("smoke-key");
  await page.getByRole("button", { name: "Chat" }).click();
  await page.getByPlaceholder("Ask a question about the loaded data…").fill("Plot the uploaded values.");
  await page.getByRole("button", { name: /Send/ }).click();

  await page.getByRole("heading", { name: "Result" }).waitFor({ timeout: 120_000 });
  await page.locator(".message.assistant .message-markdown")
    .getByText("Rows analyzed locally and plotted reproducibly.", { exact: true })
    .waitFor();
  if (await page.getByRole("button", { name: "Copy user message" }).count() !== 1) {
    throw new Error("User messages do not expose the copy control");
  }
  await page.getByRole("img", { name: "smoke.png" }).waitFor();
  await page.getByText("Data: smoke.csv", { exact: true }).waitFor();
  await page.getByText("Data: smoke.csv", { exact: true }).click();
  await page.locator(".artifact-inspector").getByText("smoke.csv", { exact: true }).waitFor();
  if (await page.locator(".ai-activity-card").count() !== 1) {
    throw new Error("The Chat turn did not consolidate AI activity into one card");
  }
  if (await page.locator(".message.execution").count() !== 1) {
    throw new Error("The Chat turn did not present one primary execution card");
  }

  await page.getByRole("button", { name: "Save as method" }).click();
  await answerDialog("smoke-analysis.py");
  await answerDialog("Reusable smoke analysis");
  await page.getByText("smoke-analysis.py", { exact: true }).waitFor();
  await page.getByText("smoke-analysis.py", { exact: true }).click();
  const methodInspector = page.locator(".artifact-inspector");
  await methodInspector.getByRole("button", { name: "Edit" }).click();
  await page.getByRole("region", { name: "Editor" }).waitFor();
  if (await page.locator(".editor-method .cm-editor").count() !== 1) {
    throw new Error("Method Editor did not create its syntax editor");
  }
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: "Actions for smoke-analysis.py" }).click();
  await page.getByRole("menuitem", { name: "Edit" }).click();
  await page.getByRole("region", { name: "Editor" }).waitFor();
  await page.getByRole("button", { name: "Close" }).click();
  if (await page.getByText("Copy to…", { exact: true }).count()) {
    throw new Error("Removed Method transfer UI is still visible");
  }
  await page.getByLabel("Select smoke-analysis.py").check();
  await page.getByRole("button", { name: "To Notebook" }).click();
  await answerDialog("smoke-notebook.ipynb");
  await page.locator(".workspace-tree .browser-name")
    .getByText("smoke-notebook.ipynb", { exact: true })
    .waitFor();
  if (completions !== 2) throw new Error(`Expected two provider rounds; got ${completions}`);
  if (errors.length) throw new Error(`Browser console errors:\n${errors.join("\n")}`);
  console.log("Browser smoke passed: lazy runtime, safe provider boundary, Artifact Editor, Markdown, consolidated execution, Method, and Notebook conversion");
} catch (error) {
  console.error("Visible page:", await page.locator("body").innerText().catch(() => ""));
  console.error("Browser errors:", errors.join("\n"));
  throw error;
} finally {
  await browser.close();
  await new Promise((closed) => server.close(closed));
}
