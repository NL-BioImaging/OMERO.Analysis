# Conversion workflow

1. Preserve the original. Create `name-omero-analysis.ipynb`.
2. Inventory it with `scripts/inspect_notebook.py`.
3. Add the tagged literal configuration cell as the visible first cell.
4. Replace `Path("input") / ...` and absolute paths with logical
   `ctx.input("id")` calls. Replace `Path("results")` with `ctx.results`.
5. Replace DuckDB/SQLite connections with parameterized
   `await ctx.query("source", sql, parameters)` calls.
6. Replace ipywidgets with contract parameters. Put all declarations in the
   first cell; read values later through `ctx.params`.
7. Separate supporting files from query sources. Avoid registering arbitrary
   pandas relations in the database. Convert small trusted lookup tables to a
   bounded parameterized `VALUES` CTE only after validating columns/cardinality.
8. Review packages against the fixed browser allowlist.
9. Bound transfers. Prefer SQL aggregation, histograms, quantiles, or a stated
   deterministic sample over loading millions of intensity values.
10. Run original and converted copies on the same fixture. Compare important
    tables, numeric tolerances, row counts, and PNG/SVG/CSV output triplets.
11. Run validation with `--write`, then upload and test rebinding against a
    second compatible source.

Mechanical conversion may add the config cell, clear stale outputs, and report
paths/imports/widgets. It must not invent table joins, measurement meanings,
threshold equivalence, units, or biological interpretation. Load a domain
skill for those decisions. If a remote-safe replacement changes a scientific
algorithm, document it and require domain review.

Common failures:

- **Ambiguous binding**: show compatible candidates; do not pick by filename
  when multiple files match.
- **Schema mismatch**: change the requirement only if both schemas are truly
  supported.
- **Worker unavailable**: fail explicitly; never silently download a large
  source.
- **Unsupported package/widget**: replace it or keep the notebook offline-only.
- **Oversized result**: add filters/aggregation; never silently truncate.
- **Legacy notebook**: it may run by filename but cannot portably switch
  between local and remote query sources.
