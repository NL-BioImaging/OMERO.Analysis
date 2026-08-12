---
name: create-omero-analysis-notebook
description: Create, convert, validate, repair, or explain offline-first OMERO.Analysis Jupyter notebooks. Use for .ipynb files that must run locally with input/ and results/ and later rebind DuckDB, SQLite, SQLite3, CSV, or supporting files in OMERO.Analysis.
license: AGPL-3.0-or-later
metadata:
  author: NL-BioImaging
  version: "0.13.0"
---

# Create OMERO.Analysis Notebooks

Build portable notebooks around the literal
`nl.bioimaging.omero-analysis-notebook.v1` contract. Preserve scientific
meaning while replacing machine-specific paths, direct database connections,
and widgets with the protocol SDK.

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
6. Run offline and validate with `scripts/validate_notebook.py --write`.

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
10. Validate and report any remaining unsupported package, unsafe SQL,
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
