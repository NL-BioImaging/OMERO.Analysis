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
execution counts, and `metadata.widgets`.

Approved browser packages include NumPy, pandas, Matplotlib, seaborn, SciPy,
scikit-image, DuckDB, PyArrow, python-calamine, xlrd, and pypdf. Declaring a package
does not permit network installation.
