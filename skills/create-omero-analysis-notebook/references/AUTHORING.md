# Whole-notebook source transport

The editor exposes a versioned draft API through **Whole notebook**. It works
inside the existing authenticated UI and includes unsaved editor changes. It is
not a new REST endpoint or a privileged browser global. Existing notebook
download endpoints return saved attachments, which may lag behind an open draft.

1. Open the requested notebook's editor and choose **Whole notebook**.
2. Read the complete value of the textbox labelled **Whole notebook JSON** in
   one operation. A DOM-based browser tool can read the textarea's `value`;
   its visible text layout does not limit which cells are returned.
3. Edit `document.cells` and necessary notebook metadata. Keep `schema`,
   `notebook_id` and `base_revision` unchanged. The schema is
   `nl.bioimaging.notebook-source.v1`. The source document omits execution
   outputs and widget state to keep the read bounded and avoid stale displays.
   When inputs change, refresh cached `metadata.omero_analysis.input_requirements`
   and `schema_requirements` too; a removed input must not remain there.
4. Replace that single textbox value and choose **Apply source to draft**.
   The host validates notebook structure and any portable config. Invalid JSON,
   wrong notebook identity, a stale revision, or source larger than 32 MiB fails
   without replacing the draft. On a stale revision, read the latest source and
   reapply the intended changes; do not overwrite intervening user edits.
5. Use the ordinary **Save**, or **Save and Run** when execution is requested.
   Applying source alone neither saves nor executes it. Verify the saved result.

For application integrations, `frontend/src/notebookSource.ts` exports
`exportNotebookSource(record)` and `applyNotebookSource(record, source)`.
The latter returns a validated source document; normal editor save and OMERO
synchronization retain ownership, bindings, and run history. These functions
are not an instruction to inspect private browser state or invoke hidden globals.

# Template filename discovery

Declare formats the notebook can actually parse, for example:

```json
{
  "id": "template",
  "kind": "file",
  "path": "input/plate-template.xlsx",
  "extensions": [".xlsx", ".csv"],
  "filename_globs": ["*template*.xlsx", "*template*.csv"],
  "required": true
}
```

Patterns match basenames case-insensitively and support `*` and `?`. The exact
declared basename remains acceptable. Only ready, non-result workspace inputs
and accessible current-source attachments are candidates; this does not scan
arbitrary local directories or other OMERO sources. A valid saved binding wins.
One candidate binds automatically; multiple matches require a user choice.
During initial workspace loading an ambiguous attachment match is deferred to
the run-time chooser, so a hidden loading dialog cannot stall the workspace.
Without `filename_globs`, existing extension-based workspace binding and exact
attachment discovery remain unchanged. Local SDK runs still use declared paths.

CSV recognition is not a CSV parser. Adapt the notebook's reader and validate
the real template schema before advertising `.csv`. Preserve identifiers and
well coordinates; do not interpret a filename as proof of experimental roles.
