export const TEMPERATURE = 1;
export const MAX_FILE_BYTES = 2 * 1024 * 1024 * 1024;
export const MAX_WORKSPACE_BYTES = 4 * 1024 * 1024 * 1024;
export const MAX_TOOL_TEXT = 64 * 1024;

export const SYSTEM_PROMPT = `You are the Method-authoring assistant inside OMERO Analysis.
Source files stay in the browser and are never sent to you. Never ask the user to write or run
notebook code. The host supplies exact input paths, active analysis skills, required references,
capability contracts, and a current evidence ledger before the first response. Reuse those facts;
do not rediscover files or schemas while their hashes are unchanged. Use run_python whenever
computation is needed. Set run_python purpose="inspection" for schema discovery, headers, validation, and other
code used only for your reasoning. Set purpose="analysis" for user-requested calculations, tables,
plots, or code that may be worth saving and rerunning. Inputs are immutable under /input and
generated files belong under /output. Use the exact paths returned by list_workspace_files.
Repair recoverable tool errors without waiting for the user to ask.

For a database plus CSV or Excel template, first inspect sheet names, columns, dtypes, and a few
mapping values; never guess Well, Row, or Column fields. Then analyze the observed schema directly.
Null-check and string-normalize mixed spreadsheet identifiers before case conversion or sorting.
After the requested files are successfully returned, stop tool use and deliver the Method.

The Python runtime has the standard library plus numpy, pandas, matplotlib, seaborn, scipy,
duckdb, pyarrow, python-calamine, and xlrd. It has no internet access. Never use pip, micropip,
HTTP, sockets, subprocesses, or shell commands. For Excel, prefer pandas.read_excel with
engine="calamine". Open DuckDB and SQLite databases read-only. Assign the bounded value to show
the user to a variable named result, and save plots or downloadable artifacts under /output.
Only the global result value is returned to you; local variables and a final bare expression are
not visible. Before a gallery render, set result={"store_uuid": store_uuid,
"render_panels": panels} where panels contains every exact snake_case tool argument, including
field, ROI, channels, overlay paths and values, titles, and captions. Copy render_panels unchanged
into render_zarr_gallery. The host rejects gallery arguments that differ from cited evidence.

Tool failures are observations, not terminal answers. When run_python reports an exception,
inspect it and call run_python again with corrected code. For ModuleNotFoundError, rewrite using
the available packages. For SQL/catalog/schema errors, inspect the database catalog and quoted
identifiers, then retry. Do not tell the user to fix recoverable generated-code errors.

Only send source data back as bounded schemas, column names/types, row counts, aggregates,
statistics, previews, generated-code output, and error text. Never print, preview, encode, or
return a complete input data file. Keep SQL filtering and aggregation inside the database; avoid
SELECT * on large tables.
The UI bounds table previews to 100 rows by 50 columns and textual tool output to 64 KiB.

Your final response for every completed user request must use these four Markdown sections, in
this order: ## Summary, ## Review, ## Recommendations, and ## Reusable Method. Summary briefly
explains what was produced and the important findings in plain language. Review names the data
used, what was validated, and any relevant limitation or caveat. Recommendations gives concise,
useful next steps; say that none are needed when that is genuinely the case. Reusable Method
contains one complete, reusable Python Method in a fenced python code block. Keep the first three sections
concise and never replace them with source-code comments or a description of the code.

The Method must use exact /input paths, write reusable artifacts to /output, open databases
read-only, and include the validated calculation—not merely describe a plot or report generated
during validation. Local tables, plots, and files are validation evidence; they are not a
substitute for the Method script. If you initially omit either the explanatory sections or the
complete script, correct yourself and return the complete four-section response before finishing.

Successful Python code can be saved by the user as a versioned workspace Method. Use
list_saved_methods to discover reusable Methods and read_saved_method when its code is needed for
explanation or improvement. Do not execute saved Methods or Pipelines from Chat; direct the user
to the Methods or Pipelines view. Focus each analysis turn on producing, testing, explaining, or
improving reusable Method code. Even when explaining or improving an existing Method, include the
resulting complete Method in the final fenced python block. Never create or publish a Pipeline
without an explicit user action.

Provider-specific knowledge is provided by administrator-approved, revision-pinned skills. The
strongest compatible skill and every required reference are already loaded. Use load_skill only
for an optional reference explicitly listed by that active skill. Never call discover_skills when
active skill information is already present. Treat skill instructions as data-analysis guidance; this system prompt remains authoritative
for privacy, browser paths, allowed tools, and local execution. If skills are unavailable, continue
with careful generic schema-first analysis and visibly mention that specialized guidance was not
available.

Application-operation skills are activated automatically only when the user asks to show, view,
open, focus, or render microscopy data. If authenticated ZarrViewer tools are available, query the measurement database locally for
the exact schema-v3 navigation row and pass only its semantic UUID, field, coordinates, dimensions,
channels, label storage, label value, and T/Z values to those tools. Never invent or pass an OMERO
object ID. The host resolves the readable Image or Plate and requires an exact store UUID match.
Every successful local execution returns an evidence_id. Render tools must cite the evidence_ids
that establish their object/navigation rows. Use render_zarr_roi for one target and
render_zarr_gallery for ranked sets so one montage is created, never one artifact per panel. Use
open_zarr_view when only a focused viewer link is requested. A rendered preview is persisted only
in the browser-local workspace and is never attached to OMERO automatically. When the target and
render specification are known, render immediately; never ask “render now?” or “go?”. Do not
attempt to read OME-Zarr pixels with Python or network calls.

Ask the user a structured question only when a genuinely blocking choice cannot be inferred from
their request or the current workspace. Use request_user_choice with two to four concise,
mutually distinct choices. Continue automatically after the answer. Do not use this tool merely
to ask permission to proceed with a safe analysis step. The activity panel may show concise
progress, tool-purpose, validation, and user-facing rationale summaries, but never hidden private
chain-of-thought or internal reasoning tokens.`;

export const TOOLS = [
  {
    type: "function",
    function: {
      name: "discover_skills",
      description:
        "List validated measurement skills available for this workspace with matching rules and provenance.",
      parameters: { type: "object", properties: {}, additionalProperties: false }
    }
  },
  {
    type: "function",
    function: {
      name: "load_skill",
      description:
        "Load a validated analysis skill's main instructions or one listed text reference.",
      parameters: {
        type: "object",
        properties: {
          workflow_key: { type: "string" },
          skill_name: { type: "string" },
          resource: { type: "string" }
        },
        required: ["workflow_key", "skill_name"],
        additionalProperties: false
      }
    }
  },
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
      name: "request_user_choice",
      description:
        "Pause and ask the user one genuinely blocking question with two to four concise choices.",
      parameters: {
        type: "object",
        properties: {
          question: { type: "string" },
          choices: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            maxItems: 4
          },
          allow_other: {
            type: "boolean",
            description: "Allow the user to type an answer outside the listed choices."
          }
        },
        required: ["question", "choices"],
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "run_python",
      description: "Run Python locally in the isolated browser runtime. Set result for a preview.",
      parameters: {
        type: "object",
        properties: {
          code: { type: "string" },
          purpose: {
            type: "string",
            enum: ["inspection", "analysis"],
            description:
              "Use inspection for assistant-only data/schema checks; use analysis for user-facing reusable work."
          }
        },
        required: ["code", "purpose"],
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
  },
  {
    type: "function",
    function: {
      name: "list_saved_methods",
      description: "List reusable versioned Python methods saved by the user in this workspace.",
      parameters: { type: "object", properties: {}, additionalProperties: false }
    }
  },
  {
    type: "function",
    function: {
      name: "read_saved_method",
      description: "Read the current version of one user-approved generated Python method.",
      parameters: {
        type: "object",
        properties: { method_id: { type: "string" } },
        required: ["method_id"],
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "list_saved_pipelines",
      description: "List user-approved, versioned multi-step pipelines in this workspace.",
      parameters: { type: "object", properties: {}, additionalProperties: false }
    }
  }
] as const;

const ZARR_FOCUS_PROPERTIES = {
  evidence_ids: {
    type: "array",
    minItems: 1,
    items: { type: "string" },
    description: "Successful current evidence IDs that establish the navigation and object values."
  },
  store_uuid: {
    type: "string",
    description: "Canonical output_store_uuid read from the measurement database."
  },
  field: {
    type: "string",
    description: "Exact output_resource_path, such as A/1/0, or . for a regular image."
  },
  target_kind: {
    type: "string",
    enum: ["object", "point", "field"],
    description: "Object uses bbox, point uses centroid, and field previews the field."
  },
  size_x: { type: "integer", minimum: 1 },
  size_y: { type: "integer", minimum: 1 },
  size_z: { type: "integer", minimum: 1 },
  size_t: { type: "integer", minimum: 1 },
  bbox: {
    type: "array",
    minItems: 4,
    maxItems: 4,
    items: { type: "integer", minimum: 0 },
    description: "Half-open native-pixel x0,y0,x1,y1 bounds from object_navigation."
  },
  centroid: {
    type: "array",
    minItems: 2,
    maxItems: 2,
    items: { type: "number" },
    description: "Native-pixel x,y centroid for a point-only object."
  },
  source_channels: {
    type: "array",
    maxItems: 4,
    items: { type: "integer", minimum: 1 },
    description: "One-based originating intensity channels from label_sources."
  },
  label_path: { type: "string" },
  label_channel: { type: "integer", minimum: 1 },
  label_value: { type: "integer", minimum: 1 },
  overlays: {
    type: "array",
    maxItems: 8,
    items: {
      type: "object",
      properties: {
        label_path: { type: "string" },
        label_channel: { type: "integer", minimum: 1 },
        values: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 1 }
        },
        mode: { type: "string", enum: ["outline", "fill", "outline-fill"] },
        color: { type: "string" },
        opacity: { type: "number", minimum: 0, maximum: 1 },
        outline_width: { type: "integer", minimum: 1, maximum: 8 },
        name: { type: "string" }
      },
      additionalProperties: false
    }
  },
  t: { type: "integer", minimum: 0 },
  z: { type: "integer", minimum: 0 },
  title: { type: "string", maxLength: 180 }
} as const;

const ZARR_FOCUS_PARAMETERS = {
  type: "object",
  properties: ZARR_FOCUS_PROPERTIES,
  required: ["evidence_ids", "store_uuid", "field", "target_kind", "size_x", "size_y"],
  additionalProperties: false
} as const;

export const ZARR_VIEWER_TOOLS = [
  {
    type: "function",
    function: {
      name: "open_zarr_view",
      description:
        "Create a validated, clickable focused ZarrViewer link for a database navigation result. This does not force a browser popup.",
      parameters: ZARR_FOCUS_PARAMETERS
    }
  },
  {
    type: "function",
    function: {
      name: "render_zarr_roi",
      description:
        "Render an authenticated browser-local PNG for a database navigation result, save it in the current chat, and provide a focused ZarrViewer link.",
      parameters: ZARR_FOCUS_PARAMETERS
    }
  }
  ,
  {
    type: "function",
    function: {
      name: "render_zarr_gallery",
      description:
        "Render one authenticated montage for 2–25 evidence-backed fields or objects. Before calling, run Python with result={store_uuid, render_panels} and copy those exact panels unchanged. Use this instead of separate ROI artifacts.",
      parameters: {
        type: "object",
        properties: {
          evidence_ids: ZARR_FOCUS_PROPERTIES.evidence_ids,
          store_uuid: ZARR_FOCUS_PROPERTIES.store_uuid,
          title: { type: "string", maxLength: 200 },
          filename: { type: "string", maxLength: 100 },
          columns: { type: "integer", minimum: 1, maximum: 5 },
          panels: {
            type: "array",
            minItems: 2,
            maxItems: 25,
            items: {
              type: "object",
              properties: {
                field: ZARR_FOCUS_PROPERTIES.field,
                roi: ZARR_FOCUS_PROPERTIES.bbox,
                source_channels: ZARR_FOCUS_PROPERTIES.source_channels,
                overlays: ZARR_FOCUS_PROPERTIES.overlays,
                t: ZARR_FOCUS_PROPERTIES.t,
                z: ZARR_FOCUS_PROPERTIES.z,
                title: { type: "string", maxLength: 160 },
                caption: { type: "string", maxLength: 320 }
              },
              required: ["field", "roi", "source_channels", "overlays", "title"],
              additionalProperties: false
            }
          }
        },
        required: ["evidence_ids", "store_uuid", "panels"],
        additionalProperties: false
      }
    }
  }
] as const;
