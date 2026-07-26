import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
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
      <div id="root"></div>
      <script>window.OMERO_ANALYSIS_CHAT = {
        context: null,
        tokenUrl: "/unused",
        contextTemplate: "/unused",
        attachmentsTemplate: "/unused",
        downloadTemplate: "/unused",
        uploadTemplate: "/unused",
        runtimeBase: "/runtime/"
      };</script>
      <script type="module" src="/app.js"></script>`);
    return;
  }
  const relative = request.url === "/app.js"
    ? "app.js"
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
                  "sns.set_theme()",
                  "result = pd.read_csv('/input/smoke.csv')",
                  "result.groupby('group', as_index=False)['value'].sum().to_csv('/output/summary.csv', index=False)"
                ].join("\n")
              })
            }
          }]
      };
    } else {
      message = { role: "assistant", content: "Rows analyzed locally.", tool_calls: [] };
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
  await page.getByText("Ready — analysis runs locally in this browser").waitFor({
    timeout: 45_000
  });
  await page.locator('input[type="file"]').setInputFiles({
    name: "smoke.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("group,value\na,1\nb,2\n")
  });
  await page.getByText("Ready — analysis runs locally in this browser").waitFor({
    timeout: 45_000
  });
  await page.getByText("smoke.csv").waitFor();
  await page.getByRole("button", { name: "AI settings" }).click();
  await page.getByLabel("Deployment/model").fill("gpt-5-smoke");
  await page.getByLabel("API key").fill("smoke-key");
  await page.getByLabel("Model context window (optional)").fill("1000");
  await page.getByPlaceholder("Ask a question about the loaded data…").fill(
    "Show me the uploaded rows and save a summary."
  );
  await page.getByRole("button", { name: "Send" }).click();
  await page.getByText("Rows analyzed locally.").waitFor({ timeout: 120_000 });
  await page.getByText("summary.csv", { exact: true }).waitFor();
  await page.getByRole("columnheader", { name: "group" }).waitFor();
  await page.getByText(/Python failed locally/).waitFor();
  await page.getByText(/25% of 1,000/).waitFor();
  await page.getByText(/session: 750/).waitFor();
  if (completions !== 3) throw new Error(`Expected three AI rounds; got ${completions}`);
  if (errors.length) throw new Error(`Browser console errors:\n${errors.join("\n")}`);
  console.log(
    "Browser smoke passed: opaque iframe/worker, CSP, file transfer, fixed Azure contract, " +
    "local Python error repair, seaborn, token usage, table preview, and generated result"
  );
} catch (error) {
  console.error("Visible page:", await page.locator("body").innerText().catch(() => ""));
  console.error("Browser errors:", errors.join("\n"));
  throw error;
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}
