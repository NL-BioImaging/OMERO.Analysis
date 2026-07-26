import { readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const output = resolve(import.meta.dirname, "../../src/omero_analysis_chat/static/omero_analysis_chat");
for (const name of await readdir(output).catch(() => [])) {
  if (
    name !== "pyodide" &&
    name !== "center_plugin.js.html" &&
    name !== "panel.css"
  ) {
    await rm(resolve(output, name), { recursive: true, force: true });
  }
}
