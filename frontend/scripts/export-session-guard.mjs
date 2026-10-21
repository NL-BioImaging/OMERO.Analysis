import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import ts from "typescript";

const destination = process.argv[2];
if (!destination) throw new Error("Usage: node scripts/export-session-guard.mjs <host-file> [--check]");
const source = await readFile(new URL("../src/sessionGuard.ts", import.meta.url), "utf8");
const digest = createHash("sha256").update(source).digest("hex");
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 }
}).outputText;
const output = `// Generated from OMERO.Analysis/frontend/src/sessionGuard.ts\n// Source SHA-256: ${digest}\n// Regenerate with frontend/scripts/export-session-guard.mjs; do not edit this copy.\n${compiled}`;
if (process.argv.includes("--check")) {
  if (await readFile(resolve(destination), "utf8") !== output) throw new Error("Host session guard differs from the shared Analysis implementation");
  console.log("Host session guard matches the shared source.");
} else await writeFile(resolve(destination), output, "utf8");
