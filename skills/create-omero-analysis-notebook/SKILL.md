---
name: create-omero-analysis-notebook
description: Create, convert, validate, repair, or explain offline-first OMERO.Analysis Jupyter notebooks. Use for .ipynb files that must run locally with input/ and results/ and later rebind DuckDB, SQLite, SQLite3, CSV, or supporting files in OMERO.Analysis.
license: AGPL-3.0-or-later
metadata:
  author: NL-BioImaging
  version: "0.13.3"
---

# Create OMERO.Analysis Notebooks

Build portable notebooks around the literal
`nl.bioimaging.omero-analysis-notebook.v1` contract. Preserve scientific
meaning while replacing machine-specific paths, direct database connections,
and widgets with the protocol SDK.

## Read or edit an open notebook

Use **Edit Notebook → Whole notebook** to read all cells and current unsaved
draft changes in one JSON field; do not collect cells individually when this
interface is available. Follow [references/AUTHORING.md](references/AUTHORING.md)
for the revision-checked source transport and template-file discovery rules.

## Create a notebook

1. Read [references/PROTOCOL.md](references/PROTOCOL.md).
2. Run `scripts/scaffold_notebook.py <destination.ipynb>` or copy
   `assets/portable-notebook-template.ipynb`.
3. Declare every query source, supporting file, parameter, result directory,
   and approved package in the first tagged cell.
4. Put test fixtures under `input/` and write durable output under
   `ctx.results`.
5. Query data through `await ctx.query(...)`; aggregate and bound SQL before
   returning rows to pandas.
6. Save every requested figure below `ctx.results` as a same-stem PNG, SVG,
   and CSV of its plotted data. Use one plotting cell per figure; when separate
   panels are requested, retain the composite and add each panel in its own cell.
   See the plotting example in [references/PROTOCOL.md](references/PROTOCOL.md).
7. Run offline and validate with `scripts/validate_notebook.py --write` so
   stale cell outputs, execution counts, and widget state are removed.

## Convert a notebook

1. Read [references/CONVERSION.md](references/CONVERSION.md).
2. Preserve the source notebook. Create a new `*-omero-analysis.ipynb` copy;
   never overwrite the source without explicit authorization.
3. Run `scripts/inspect_notebook.py` and keep its report with the work.
4. Apply safe mechanical changes separately from scientific/query changes.
5. Replace paths with `ctx.input(...)` and `ctx.results`.
6. Replace database connections with `await ctx.query(...)`.
7. Replace ipywidgets with protocol parameters. OMERO.Analysis renders a
   native form and never executes widget JavaScript.
8. Load a relevant domain skill before changing table, column, relationship,
   unit, threshold, or biological semantics. For CI Segmentation measurement
   databases, load `analyze-cisegmentation-measurements`.
9. Compare bounded tables and generated plots against the original offline
   run. Do not call a conversion successful solely because it executes.
10. Make Matplotlib rendering backend-independent and save durable plots
    below `ctx.results`.
11. Validate and report any remaining unsupported package, unsafe SQL,
    unbounded transfer, missing output, or ambiguous input.

## Guardrails

- Treat DuckDB and SQLite as read-only. Use one parameterized `SELECT` or
  `WITH … SELECT` per query.
- Never guess database semantics or silently replace a scientific algorithm.
- Avoid `SELECT *` and full intensity-vector transfers for large sources.
- Keep query results transient unless the notebook explicitly writes an
  analysis output below `ctx.results`.
- Keep the tagged literal configuration cell first and visible.
- Never upload, publish, release, or overwrite without user authorization.
- If offline output differs, explain the difference and do not claim
  equivalence.

## Verify

Run:

```text
python scripts/inspect_notebook.py notebook.ipynb
python scripts/validate_notebook.py notebook.ipynb --write
```

Run the notebook against the same local fixture as its source or reference
implementation. Compare bounded CSV tables numerically and expected PNG/SVG/CSV
output names. State what was not comparable.

Verify the live figure's attachments, not just files on disk: each PNG should
have its own same-stem SVG and CSV from the same parameter set. Repeat an
unchanged-parameter run to check replacement, and preserve different-parameter
results. Do not delete ambiguous historical outputs to hide duplicate links.

Result sets also include input identities. Equal parameters over changed inputs
must remain distinct. Failed or stopped reruns must preserve the previous
successful set. Superseded output is recoverable in Workspace Trash; do not
interpret its removal from the Dataset attachment list as file deletion.

## CSV identifiers and movies

For supporting CSVs, `ctx.read_csv(input_id, identifiers=["observed_column"], nrows=100)`
preserves declared text identifiers and leading zeros in a bounded preview.
Use ctx.query for aggregated large query sources; declare VARCHAR columns where
identifier inference would be ambiguous. Never infer joins across unrelated files.

Temporal MP4 output uses the existing structured render recipe with
`omero_analysis_render_format="mp4"` and a version-1 sequence declaration.
Default playback is 5 FPS, separate from acquisition timing. ZarrViewer handles
authenticated pixels and browser encoding; Python never invokes an encoder or
network request. See the movie authoring skill and docs/movies.md in the repository.
