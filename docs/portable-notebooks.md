# Offline-first notebooks for OMERO.Analysis

OMERO.Analysis 0.13 introduces a portable notebook contract and the separate
`omero-analysis-notebook` 0.1 SDK. A developer can build and test a normal
Jupyter project on a PC and upload the same notebook. Analysis binds its logical
inputs to the current OMERO Workspace, renders parameters, and executes the
notebook without exposing worker credentials or requiring source-specific
paths.

## Install and start a project

The SDK supports Python 3.10–3.12 and has no OMERO dependency.

```console
python -m venv .venv
.venv/Scripts/pip install "omero-analysis-notebook[widgets,run]==0.1.0"
.venv/Scripts/oan new analysis.ipynb
```

Recommended layout:

```text
analysis-project/
├── analysis.ipynb
├── input/
│   ├── measurements.duckdb   # or .sqlite/.sqlite3/.csv
│   └── template.xlsx         # optional supporting input
└── results/                  # generated PNG/SVG/CSV/PDF files
```

The starter’s first cell is tagged `omero-analysis-config` and contains literal
JSON. Keep it first and visible. Declare stable logical input IDs, not plate
filenames. Use `ctx.input("template")` only for ordinary supporting files and
`await ctx.query("measurements", sql, parameters)` for database or CSV data.
Read parameter values from `ctx.params`; write all durable files below
`ctx.results`.

Locally, `ctx.results` maps to `results/` and query sources open read-only. In
Analysis, supporting files map to `/input`, results map to `/output`, Local
query sources open read-only inside Pyodide, and Remote query calls use the
authenticated OMERO.Analysis broker. The notebook never sees a worker URL,
bearer token, source ID, or result ID.

## Develop, validate, and upload

Use SQL to filter and aggregate before pandas. Keep returned tables within the
server row/byte/time limits. Then run:

```console
oan inspect analysis.ipynb
oan run analysis.ipynb
oan validate analysis.ipynb --write
```

`validate --write` records normalized requirements and removes execution
counts, outputs, and widget state. Upload the validated `.ipynb` into the
Notebook folder. Analysis validates it again before attaching the sanitized
copy.

When opened in Analysis:

1. Choose or confirm each query source and supporting file. Multiple compatible
   candidates always require a choice.
2. Set parameters in the native form above the notebook. Database-backed
   choices are loaded with a bounded query.
3. Run the notebook. Top-level `await` is supported.
4. Retrieve outputs under `Notebooks/Results/<notebook>/`.
5. Rebind the same notebook to another plate’s compatible source without
   changing code.

Each run captures parameter values, source/schema digests, output names/sizes,
timestamps, and status. Query CSV transport remains transient and never appears
in Workspace Input. Attaching an executed notebook remains an explicit action.

## Convert an existing notebook

1. Preserve the original and create `name-omero-analysis.ipynb`.
2. Run `oan inspect` on the copy.
3. Add the tagged literal configuration cell.
4. Replace relative/absolute input paths with `ctx.input(...)`; replace the
   result directory with `ctx.results`.
5. Replace direct DuckDB/SQLite connections with `await ctx.query(...)`.
6. Replace ipywidgets with parameter declarations in the first cell.
7. Resolve unsupported packages and unbounded/full-table queries.
8. Run original and converted notebooks with identical fixtures and compare
   bounded tables and plots.
9. Run `oan validate --write`.
10. Upload, rebind, and verify against a second compatible source.

`oan convert` performs only safe mechanical work: it preserves the source,
creates a sanitized copy, inserts a starter config when absent, and reports
semantic work. It deliberately does not invent joins, units, thresholds, or
biological meaning.

```console
oan convert legacy.ipynb --output legacy-omero-analysis.ipynb
```

For domain data, combine the generic
`create-omero-analysis-notebook` Agent Skill with a domain skill. The converted
SolHunt example uses `analyze-cisegmentation-measurements` to preserve CI
Segmentation object/channel/relationship semantics. Its template join becomes
a validated bounded `VALUES` lookup; large intensity transfers become SQL
statistics and bounded histogram bins.

## Examples

- `docs/examples/portable-notebooks/starter.ipynb`
- `docs/examples/portable-notebooks/duckdb-mini.ipynb`
- `docs/examples/portable-notebooks/sqlite-mini.ipynb`
- `docs/examples/portable-notebooks/csv-mini.ipynb`
- `docs/examples/portable-notebooks/SolHuntMarkers_DuckDB_Analysis-omero-analysis.ipynb`

The converted SolHunt example was executed read-only against the 828 MB source
fixture. It generated both documented PNG/SVG/CSV triplets; all 96 per-well
cell counts exactly matched the existing `number_of_cells.csv`. Its intensity
histogram is intentionally a bounded 100-bin representation rather than the
original unbounded value transfer.

The original SolHunt notebook on the developer’s data drive is not modified.

## Troubleshooting

**Ambiguous binding.** Select the source or supporting file explicitly. Rename
files only for clarity; logical compatibility is based on declared format and,
when present, normalized tables/columns.

**Schema mismatch.** Compare the current schema with the contract. Do not loosen
the requirement unless the code really supports both schemas.

**Worker unavailable.** Remote execution fails explicitly. It never silently
downloads a large source or changes scientific execution mode.

**Unsupported package.** Use the fixed browser set (NumPy, pandas, Matplotlib,
seaborn, SciPy, scikit-image, DuckDB, PyArrow, python-calamine, xlrd, pypdf), refactor,
or keep the notebook offline-only. Arbitrary pip/network installation is
blocked.

**Oversized result.** Aggregate, filter, bin, or use a scientifically justified
deterministic sample in SQL. Results fail rather than truncate.

**Legacy warning.** An unmarked notebook can still use filename rebinding, but
cannot transparently switch between a small Local and large Remote database.
Convert it to the protocol for that guarantee.

**Widget missing.** Analysis never loads notebook widget JavaScript. Declare
parameters in the first cell; `ctx.display_parameters()` remains optional for
local Jupyter only.

The complete machine-facing rules are in
`skills/create-omero-analysis-notebook/references/PROTOCOL.md` and the conversion
rules are in `skills/create-omero-analysis-notebook/references/CONVERSION.md`.
