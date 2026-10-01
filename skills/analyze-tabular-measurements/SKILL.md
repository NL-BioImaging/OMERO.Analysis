---
name: analyze-tabular-measurements
description: Inspect and analyze generic CSV or database measurements, including CellProfiler CSV exports, without guessing table relationships, experimental units, or measurement semantics.
license: AGPL-3.0-or-later
---

# Analyze Tabular Measurements

Inspect headers, types, a bounded preview, row counts, units, and missing values.
Preserve text identifiers, leading zeros, quoted fields, and metadata columns.
Methods use pandas with explicit identifier dtypes. Portable Notebooks can use
`ctx.read_csv(..., identifiers=[...], nrows=...)`; inspect the real columns before supplying names.

CellProfiler exports are ordinary related CSV inputs. Image/object identifiers
are scoped to their source; matching-looking numbers across exports do not prove
a valid relationship. Declare join keys and verify uniqueness/cardinality and
unmatched rows before joining. Never invent a fixed export schema or treat an
object as an independent biological replicate without justification.

Query large sources with bounded SELECT statements and explicit columns. Keep
units and experimental grouping visible; distinguish missing from zero and
state exclusions. Write durable results and compare calculations to a small
known fixture. Use a domain skill only when its schema requirements actually
match. Do not run CellProfiler or change BIOMERO workflows.
