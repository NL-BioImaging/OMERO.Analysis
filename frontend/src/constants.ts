export const PROVIDER_NAME = "AmsterdamUMC";
export const BASE_URL =
  "https://aumc-aicode-openai-swedencentral-oai.openai.azure.com/openai/v1";
export const CHAT_URL = `${BASE_URL}/chat/completions`;
export const TEMPERATURE = 1;
export const MAX_FILE_BYTES = 256 * 1024 * 1024;
export const MAX_WORKSPACE_BYTES = 512 * 1024 * 1024;
export const MAX_TOOL_TEXT = 64 * 1024;

export const SYSTEM_PROMPT = `You are the analysis assistant inside OMERO Analysis Chat.
All source data stays in the browser. Never ask the user to write or run notebook code.
Use list_workspace_files before analysis and run_python whenever computation is needed.
Only bounded schemas, previews, summaries, generated code, and tool results are sent to you.
Python inputs are immutable under /input and generated files belong under /output.
Always show your reasoning briefly, use read-only database connections, and assign a useful
table/scalar/dict to a variable named result. Save plots and downloadable artifacts in /output.
For CI Segmentation DuckDB/SQLite data, first inspect tables and schemas. Do not assume table or
column names. Identify object morphology, per-channel intensity statistics, label sets, image or
HCS metadata, mask relationships, and focus assignments from the discovered schema. Quote SQL
identifiers safely, avoid SELECT * for large tables, aggregate before previewing, and explain the
biological and measurement meaning of results without overstating causality.`;

export const TOOLS = [
  {
    type: "function",
    function: {
      name: "list_workspace_files",
      description: "List browser-local input and generated files with paths and sizes.",
      parameters: { type: "object", properties: {}, additionalProperties: false }
    }
  },
  {
    type: "function",
    function: {
      name: "run_python",
      description: "Run Python locally in the isolated browser runtime. Set result for a preview.",
      parameters: {
        type: "object",
        properties: { code: { type: "string" } },
        required: ["code"],
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "reset_python",
      description: "Reset Python state and restore canonical input files.",
      parameters: { type: "object", properties: {}, additionalProperties: false }
    }
  }
] as const;

