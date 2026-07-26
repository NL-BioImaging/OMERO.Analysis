import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { chromium } from "playwright-core";

const root = resolve(
  import.meta.dirname,
  "../../src/omero_analysis_chat/static/omero_analysis_chat"
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
const types = {
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".wasm": "application/wasm",
  ".json": "application/json",
  ".zip": "application/zip",
  ".whl": "application/zip",
  ".css": "text/css"
};
const server = createServer(async (request, response) => {
  if (request.url === "/favicon.ico") {
    response.statusCode = 204;
    response.end();
    return;
  }
  if (request.url === "/") {
    response.setHeader("Content-Type", "text/html");
    response.end(`<!doctype html><meta charset="utf-8"><title>Analysis Chat smoke</title>
      <link rel="stylesheet" href="/app.css">
      <div id="root"></div>
      <script>window.OMERO_ANALYSIS_CHAT = {
        context: null,
        tokenUrl: "/unused",
        contextTemplate: "/unused",
        attachmentsTemplate: "/unused",
        downloadTemplate: "/unused",
        uploadTemplate: "/unused",
        snapshotsTemplate: "/unused",
        snapshotUploadTemplate: "/unused",
        snapshotDownloadTemplate: "/unused",
        runtimeBase: "/runtime/"
      };</script>
      <script type="module" src="/app.js"></script>`);
    return;
  }
  const relative = request.url === "/app.js" || request.url === "/app.css"
    ? request.url.slice(1)
    : request.url?.startsWith("/runtime/")
      ? `pyodide/${request.url.slice("/runtime/".length)}`
      : "";
  const file = resolve(root, relative || "__missing__");
  if (!file.startsWith(root + sep) || !(await stat(file).catch(() => null))?.isFile()) {
    response.statusCode = 404;
    response.end();
    return;
  }
  response.setHeader("Content-Type", types[extname(file)] || "application/octet-stream");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  createReadStream(file).pipe(response);
});

await new Promise((resolveReady) => server.listen(0, "127.0.0.1", resolveReady));
const { port } = server.address();
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage();
const errors = [];
let completions = 0;
await page.route(
  "https://aumc-aicode-openai-swedencentral-oai.openai.azure.com/**",
  async (route) => {
    const request = route.request();
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "api-key,content-type",
      "Access-Control-Allow-Methods": "POST,OPTIONS"
    };
    if (request.method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: cors });
      return;
    }
    const payload = request.postDataJSON();
    if (payload.temperature !== 1 || payload.model !== "gpt-5-smoke") {
      throw new Error(`Unexpected provider payload: ${JSON.stringify(payload)}`);
    }
    if (request.headers()["api-key"] !== "smoke-key") {
      throw new Error("Azure api-key header was not preserved");
    }
    completions += 1;
    if (request.postData().includes("group,value\\na,1\\nb,2")) {
      throw new Error("A complete source file was included in the Azure request");
    }
    let message;
    if (completions === 1) {
      message = {
          role: "assistant",
          content: null,
          tool_calls: [{
            id: "call-failing",
            type: "function",
            function: {
              name: "run_python",
              arguments: JSON.stringify({
                code: "import package_that_is_not_available"
              })
            }
          }]
        };
    } else if (completions === 2) {
      const toolMessage = payload.messages.at(-1);
      if (
        toolMessage?.role !== "tool" ||
        !toolMessage.content.includes("ModuleNotFoundError") ||
        !toolMessage.content.includes("available_packages")
      ) {
        throw new Error(`Python failure was not returned for repair: ${JSON.stringify(toolMessage)}`);
      }
      message = {
        role: "assistant",
        content: null,
        tool_calls: [{
          id: "call-corrected",
          type: "function",
          function: {
            name: "run_python",
            arguments: JSON.stringify({
                code: [
                  "import pandas as pd",
                  "import seaborn as sns",
                  "import matplotlib.pyplot as plt",
                  "sns.set_theme()",
                  "result = pd.read_csv('/input/smoke.csv')",
                  "sns.barplot(data=result, x='group', y='value')",
                  "plt.savefig('/output/smoke.png')",
                  "plt.close()",
                  "result.groupby('group', as_index=False)['value'].sum().to_csv('/output/summary.csv', index=False)"
                ].join("\n")
              })
            }
          }]
      };
    } else if (completions === 3) {
      const toolMessage = payload.messages.at(-1);
      if (
        toolMessage?.role !== "tool" ||
        !toolMessage.content.includes("smoke.csv") ||
        !toolMessage.content.includes("Plot data CSV required")
      ) {
        throw new Error(`Missing plot CSV was not returned for repair: ${JSON.stringify(toolMessage)}`);
      }
      message = {
        role: "assistant",
        content: null,
        tool_calls: [{
          id: "call-plot-csv",
          type: "function",
          function: {
            name: "run_python",
            arguments: JSON.stringify({
              code: "result.to_csv('/output/smoke.csv', index=False)"
            })
          }
        }]
      };
    } else if (completions === 4) {
      message = { role: "assistant", content: "Rows analyzed locally.", tool_calls: [] };
    } else if (completions === 5) {
      message = {
        role: "assistant",
        content: null,
        tool_calls: [{
          id: "call-duplicate",
          type: "function",
          function: {
            name: "run_python",
            arguments: JSON.stringify({
              code: [
                "import pandas as pd",
                "import seaborn as sns",
                "import matplotlib.pyplot as plt",
                "sns.set_theme()",
                "result = pd.read_csv('/input/smoke.csv')",
                "sns.barplot(data=result, x='group', y='value')",
                "plt.savefig('/output/smoke.png')",
                "plt.close()",
                "result.groupby('group', as_index=False)['value'].sum().to_csv('/output/summary.csv', index=False)"
              ].join("\n")
            })
          }
        }]
      };
    } else {
      const toolMessage = payload.messages.at(-1);
      if (toolMessage?.role !== "tool" || !toolMessage.content.includes('"reused":true')) {
        throw new Error(`Duplicate execution was not reused: ${JSON.stringify(toolMessage)}`);
      }
      message = { role: "assistant", content: "Reused the prior calculation.", tool_calls: [] };
    }
    await route.fulfill({
      status: 200,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({
        choices: [{ message }],
        usage: { prompt_tokens: 200, completion_tokens: 50, total_tokens: 250 }
      })
    });
  }
);
page.on("console", (message) => {
  console.log(`browser ${message.type()}: ${message.text()}`);
  if (message.type() === "error") errors.push(message.text());
});
page.on("requestfailed", (request) => console.log("request failed:", request.url(), request.failure()));
page.on("pageerror", (error) => errors.push(String(error)));
try {
  await page.goto(`http://127.0.0.1:${port}/`);
  await page.locator(".runtime-progress progress").waitFor({ timeout: 5_000 });
  if (!(await page.getByPlaceholder(/please wait/i).isDisabled())) {
    throw new Error("Composer was enabled while browser Python was loading");
  }
  await page.getByText("Ready — analysis runs locally in this browser").waitFor({
    timeout: 45_000
  });
  await page.locator('.file-browser-toolbar input[type="file"]').setInputFiles({
    name: "smoke.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("group,value\na,1\nb,2\n")
  });
  await page.getByText("Local inputs added; browser Python is ready").waitFor({
    timeout: 45_000
  });
  await page.getByText("smoke.csv").waitFor();
  await page.getByRole("button", { name: "AI settings" }).click();
  await page.getByLabel("Deployment/model").fill("gpt-5-smoke");
  await page.getByLabel("API key").fill("smoke-key");
  await page.getByLabel("Model context window (optional)").fill("1000");
  await page.getByRole("button", { name: "AI settings" }).click();
  await page.getByPlaceholder("Ask a question about the loaded data…").fill(
    "Show me the uploaded rows and save a summary."
  );
  await page.getByRole("button", { name: "Send" }).click();
  await page.getByText("Rows analyzed locally.").waitFor({ timeout: 120_000 });
  await page.getByText("summary.csv", { exact: true }).waitFor();
  await page.getByRole("img", { name: "smoke.png" }).waitFor();
  await page.getByText(/ModuleNotFoundError/).waitFor({ state: "attached" });
  await page.getByText(/25% of 1,000/).waitFor();
  await page.getByText(/session: 1,000/).waitFor();
  await page.getByText("Ready — you can ask a question").waitFor();
  const disclosures = page.locator("section.execution-details");
  if (await disclosures.count() < 3) {
    throw new Error("Expected collapsed Python execution disclosures");
  }
  for (let index = 0; index < await disclosures.count(); index += 1) {
    if (await disclosures.nth(index).getAttribute("data-expanded") !== "false") {
      throw new Error("An execution disclosure was expanded by default");
    }
  }
  const scrollState = await page.locator(".messages").evaluate((element) => ({
    bottom: Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop),
    overflow: getComputedStyle(element).overflowY,
    bodyOverflow: getComputedStyle(document.body).overflow
  }));
  if (scrollState.bottom > 4 || scrollState.overflow !== "auto" || scrollState.bodyOverflow !== "hidden") {
    throw new Error(`Chat scrolling is not contained: ${JSON.stringify(scrollState)}`);
  }
  await disclosures.last().getByRole("button", { name: "Show details" }).click();
  if (
    await disclosures.last().getByRole("button", { name: "Collapse" }).count() !== 2 ||
    await disclosures.last().getByRole("button", { name: "Rerun" }).count() !== 2
  ) {
    throw new Error("Execution controls were not duplicated above and below the code");
  }
  await page.getByRole("columnheader", { name: "group" }).waitFor();
  const outputCount = await page.locator(".project-tree details").nth(1).locator("li").count();
  await page.getByPlaceholder("Ask a question about the loaded data…").fill(
    "Repeat exactly the same analysis."
  );
  await page.getByRole("button", { name: "Send" }).click();
  await page.getByText("Reused the prior calculation.").waitFor({ timeout: 60_000 });
  await page.getByText(/Reused prior execution/).waitFor();
  const outputCountAfterReuse = await page.locator(".project-tree details").nth(1).locator("li").count();
  if (outputCountAfterReuse !== outputCount) {
    throw new Error(`Reused run duplicated outputs: ${outputCount} -> ${outputCountAfterReuse}`);
  }
  if (completions !== 6) throw new Error(`Expected six AI rounds; got ${completions}`);
  const dialogAnswers = [
    "smoke-analysis.py",
    "Reusable smoke analysis",
    "smoke-analysis-2.py",
    "Second reusable smoke analysis",
    "combined-smoke.py",
    "Combined smoke analysis",
    "Renamed smoke chat"
  ];
  page.on("dialog", async (dialog) => dialog.accept(dialogAnswers.shift() || ""));
  await page.getByRole("button", { name: "Save as script" }).last().click();
  await page.getByText("smoke-analysis.py", { exact: true }).waitFor();
  await page.locator(".message.execution.success").last()
    .getByRole("button", { name: "Save as script" }).first().click();
  await page.getByText("smoke-analysis-2.py", { exact: true }).waitFor();
  await page.getByLabel("Select smoke-analysis.py").check();
  await page.getByLabel("Select smoke-analysis-2.py").check();
  await page.getByRole("button", { name: "Combine" }).click();
  await page.getByText("combined-smoke.py", { exact: true }).waitFor();
  await page.getByText("combined-smoke.py", { exact: true }).click({ button: "right" });
  await page.getByRole("menuitem", { name: "Run" }).waitFor();
  await page.getByRole("menuitem", { name: "Delete script" }).waitFor();
  await page.keyboard.press("Escape");
  await page.locator(".browser-row", { hasText: "summary.csv" }).click({ button: "right" });
  await page.getByRole("menuitem", { name: "Delete output" }).waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Up to OMERO object projects" }).click();
  await page.locator(".project-row.active").waitFor();
  await page.locator(".project-row.active").dblclick();

  await page.evaluate(() => {
    window.__oacDownloadPromise = null;
    HTMLAnchorElement.prototype.click = function captureDownload() {
      window.__oacDownloadPromise = fetch(this.href)
        .then((response) => response.arrayBuffer())
        .then((buffer) => Array.from(new Uint8Array(buffer)));
    };
  });
  await page.getByRole("button", { name: "Download project ZIP" }).click();
  await page.waitForFunction(() => Boolean(window.__oacDownloadPromise));
  const archiveBytes = await page.evaluate(() => window.__oacDownloadPromise);
  const archiveEntries = unzipSync(new Uint8Array(archiveBytes));
  const projectManifest = JSON.parse(strFromU8(archiveEntries["project.json"]));
  if (JSON.stringify(projectManifest).toLowerCase().includes("smoke-key")) {
    throw new Error("Project snapshot leaked the Azure API key");
  }
  if (!Object.keys(archiveEntries).some((name) => name.includes("inputs/local/"))) {
    throw new Error("Project snapshot omitted its eligible local input");
  }
  const chatSelect = page.getByLabel("Chat");
  const originalChatId = await chatSelect.inputValue();
  await page.getByRole("button", { name: "New chat" }).click();
  if (await chatSelect.locator("option").count() < 2) {
    throw new Error("Named chat creation did not persist a second chat");
  }
  await chatSelect.selectOption(originalChatId);
  await page.getByText("Rows analyzed locally.").waitFor();
  await page.getByRole("button", { name: "Rename chat" }).click();
  await chatSelect.getByRole("option", { name: "Renamed smoke chat" }).waitFor({ state: "attached" });
  if (errors.length) throw new Error(`Browser console errors:\n${errors.join("\n")}`);
  console.log(
    "Browser smoke passed: opaque iframe/worker, CSP, file transfer, fixed Azure contract, " +
    "local Python and plot-CSV repair, seaborn, token usage, table preview, and generated result"
  );
} catch (error) {
  console.error("Visible page:", await page.locator("body").innerText().catch(() => ""));
  console.error("Browser errors:", errors.join("\n"));
  throw error;
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}
