# Portable notebook protocol

The first cell must be a visible code cell tagged `omero-analysis-config`. It
must call `oan.configure()` with a triple-quoted literal JSON string using
schema `nl.bioimaging.omero-analysis-notebook.v1`. Analysis parses this cell
without executing it. A marked invalid notebook is rejected; an unmarked
notebook is legacy and receives a portability warning.

## Contract

```python
import omero_analysis_notebook as oan
ctx = oan.configure(r'''{
  "schema": "nl.bioimaging.omero-analysis-notebook.v1",
  "inputs": [
    {
      "id": "measurements",
      "kind": "query",
      "path": "input/measurements.duckdb",
      "formats": ["duckdb", "sqlite", "sqlite3", "csv"],
      "required": true
    },
    {
      "id": "template",
      "kind": "file",
      "path": "input/template.xlsx",
      "extensions": [".xlsx"],
      "required": true
    }
  ],
  "results": {"path": "results"},
  "parameters": [
    {
      "name": "minimum_count",
      "type": "integer",
      "default": 1,
      "minimum": 0,
      "maximum": 1000,
      "step": 1,
      "label": "Minimum count",
      "help": "Exclude smaller groups."
    }
  ],
  "requirements": ["pandas", "matplotlib"]
}''')
ctx.display_parameters()
```

Input and result paths must be relative and stay below `input/` and `results/`.
Input IDs are stable logical names; physical files are rebound per Workspace.
Query inputs accept DuckDB, SQLite, SQLite3, and single-table CSV (`data`). File
inputs declare explicit extensions.

Inputs may declare `filename_globs` for case-insensitive basename discovery in
the host (`*` and `?`, 1–20 patterns). The exact declared basename and valid
saved binding remain accepted. See [AUTHORING.md](AUTHORING.md) for selection
and ambiguity behavior; the offline SDK continues to use the declared path.

Parameter types are `boolean`, `integer`, `number`, `string`, and `choice`.
Numeric parameters may declare `minimum`, `maximum`, and positive `step`.
Choices may be static or loaded through a bounded `choices_query` with
`source`, one read-only SQL statement, `limit` 1..1000, and optional
`value_column`/`label_column`.

## SDK surface

- `ctx.params["name"]` returns the current host/offline value.
- `ctx.input("template")` returns a supporting-file path.
- `ctx.results` is `results/` offline and `/output` in Analysis.
- `await ctx.query("measurements", sql, parameters)` returns a pandas DataFrame.
- `ctx.display_parameters()` optionally shows ipywidgets offline; Analysis
  renders a native form and returns the parameter mapping.

Top-level `await` is supported in Analysis. Query SQL must be one `SELECT` or
`WITH … SELECT`. Writes, multiple statements, ATTACH, COPY, PRAGMA, extension
operations, configuration changes, file/network functions, arbitrary pip, and
network access are prohibited. Aggregate/filter in SQL. Worker row/byte/time
limits fail the cell instead of truncating it.

Analysis stores query downloads transiently outside Workspace Input. Durable
outputs must be written below `ctx.results`; Analysis collects them under
`Notebooks/Results/<notebook>/`. Upload sanitation removes cell outputs,
execution counts, and `metadata.widgets`. Analysis also clears all inline
outputs and execution counts immediately before every run, then records only
the current run's output.

Approved browser packages include NumPy, pandas, Matplotlib, seaborn, SciPy,
scikit-image, DuckDB, PyArrow, python-calamine, xlrd, and pypdf. Analysis loads
declared approved packages from its vendored/Pyodide assets before execution;
declaration never permits arbitrary network installation.

Plots must work without a desktop display. Use a non-interactive Matplotlib
backend (Analysis configures `Agg`) and save PNG/SVG files below `ctx.results`.
Do not rely on an interactive window or on `plt.show()` as the durable result.
Analysis suppresses the harmless `FigureCanvasAgg is non-interactive` warning,
but portable notebooks should omit unnecessary `plt.show()` calls.

## Figure companions and reruns

Use a stable, unique stem for each figure and its PNG, SVG and plotted-data CSV.
The CSV must contain the actual plotted values, identifiers, grouping and units;
include thresholds/parameters needed to interpret the figure. For heatmaps,
retain well coordinates and distinguish masked/unmeasured values from zero.
A general summary CSV with a different filename is not attached to that figure.

```python
# plot_data is the bounded table used to draw this figure.
stem = "control-stability"
plot_data.to_csv(ctx.results / f"{stem}.csv", index=False)
fig.savefig(ctx.results / f"{stem}.png", dpi=160, bbox_inches="tight")
fig.savefig(ctx.results / f"{stem}.svg", bbox_inches="tight",
            metadata={"Date": None})
plt.close(fig)
```

Place each requested figure in its own plotting cell. Keep composites when
adding separate panels, and save a distinct CSV for each panel's subset. The
host previews saved PNGs; the SVG and CSV are download companions. Do not embed
arbitrary HTML or file links to create attachment buttons.

Portable notebook outputs are grouped by effective parameters and bound input
identity. Different settings remain separate even if they render identical
pixels. After a successful repeat with the same settings and inputs, prior
outputs move to Workspace Trash; a failed replacement preserves the prior set.
Do not encode changing timestamps in plot filenames to work around reruns.

## Supporting CSV preview

`ctx.read_csv("input_id", identifiers=["actual_identifier_column"], nrows=100)`
loads a supporting CSV using explicit string dtypes for named identifiers.
Missing declared columns fail clearly. The same helper exists in browser and
local SDK contexts. Remote query sources use ctx.query instead of filesystem access.
