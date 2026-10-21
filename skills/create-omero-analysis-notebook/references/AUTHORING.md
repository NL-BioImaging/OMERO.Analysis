# Authoring in OMERO.Analysis

Use the Notebooks tab. Cells and Source are inline views of the same notebook.
Source uses Python/Markdown cell separators and preserves cell metadata/IDs.
Keep the literal `omero-analysis-config` code cell first.

Use `await ctx.query(input_id, sql, parameters)` for query inputs and
`ctx.input(input_id)` for ordinary supporting files. Read the actual input
binding examples in the notebook, and declare file/table/column requirements
before referring to them. Use a user-selected input when multiple choices are
ambiguous. Never invent local paths for remote databases.

Run cell preserves current kernel state and does not run earlier analytical
cells automatically. Run all starts clean. Changing inputs or notebooks
resets state. Edit invalid source safely as a draft, then correct it before
running or synchronizing it as a valid notebook.

For external AI authoring, use the Skills download and optional schema
summary. Produce an unexecuted portable `.ipynb`; exclude credentials,
tokens, raw measurements, and notebook outputs unless deliberately supplied
for an explicitly authorized purpose.


## Graphical setup and run values

Analysis exposes the tagged literal configuration as Notebook setup. Keep a
unique first code cell tagged omero-analysis-config, calling oan.configure with
one literal JSON argument. Surrounding Python and unknown fields are preserved
when the form edits that literal. Declare supported inputs, formats, required
tables/columns and optional bounded readiness checks accurately. Supporting
Excel files use kind=file and ctx.input(...). Parameter definitions/defaults
live in the contract; Run parameters stores selected values separately. Do not
add a duplicate in-notebook input form. No parameters are needed for a starter
that can run from its bound data alone. Initialize setup is explicit; a single
analysis cell does not execute preceding analytical cells automatically.
