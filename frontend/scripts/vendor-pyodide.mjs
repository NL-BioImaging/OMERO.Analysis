import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const frontend = resolve(import.meta.dirname, "..");
const source = resolve(frontend, "node_modules/pyodide");
const destination = resolve(
  frontend,
  "../src/omero_analysis_chat/static/omero_analysis_chat/pyodide"
);
const version = JSON.parse(await readFile(resolve(source, "package.json"), "utf8")).version;
const lock = JSON.parse(await readFile(resolve(source, "pyodide-lock.json"), "utf8"));
const roots = [
  "micropip",
  "numpy",
  "pandas",
  "matplotlib",
  "duckdb",
  "pyarrow",
  "python-calamine",
  "xlrd"
];
const selected = new Set();

function include(name) {
  if (selected.has(name)) return;
  const record = lock.packages[name];
  if (!record) throw new Error(`Pyodide ${version} does not provide ${name}`);
  selected.add(name);
  for (const dependency of record.depends || []) include(dependency);
}
roots.forEach(include);

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const name of [
  "pyodide.mjs",
  "pyodide.asm.mjs",
  "pyodide.asm.wasm",
  "python_stdlib.zip"
]) {
  await cp(resolve(source, name), resolve(destination, name));
}

const packages = Object.fromEntries(
  [...selected].sort().map((name) => [name, lock.packages[name]])
);
await writeFile(
  resolve(destination, "pyodide-lock.json"),
  `${JSON.stringify({ info: lock.info, packages })}\n`
);

for (const [name, record] of Object.entries(packages)) {
  const output = resolve(destination, basename(record.file_name));
  const url = `https://cdn.jsdelivr.net/pyodide/v${version}/full/${record.file_name}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} downloading ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== record.sha256) {
    throw new Error(`Checksum mismatch for ${name}: ${actual} != ${record.sha256}`);
  }
  await writeFile(output, bytes);
  process.stdout.write(`Vendored ${name} ${record.version}\n`);
}
await writeFile(
  resolve(destination, "RUNTIME.json"),
  `${JSON.stringify({ pyodide: version, packages: Object.fromEntries(
    Object.entries(packages).map(([name, value]) => [name, value.version])
  ) }, null, 2)}\n`
);
console.log(`Vendored Pyodide ${version} with ${selected.size} packages in ${destination}`);

