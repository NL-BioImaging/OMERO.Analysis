---
name: create-omero-analysis-method
description: Create, repair, or validate reusable Python Methods for OMERO.Analysis with explicit inputs, parameters, bounded queries, and durable outputs.
license: AGPL-3.0-or-later
---

# Create an Analysis Method

Use `assets/method.py` as a small starting point. Declare native parameters in
the literal `OA_METHOD_PARAMETERS_JSON` block. Execution supplies the validated
values through `OA_PARAMETERS`; do not overwrite them with defaults.

Inspect real input headers, schemas, units, and identifiers before adapting the
example. Keep `/input` immutable and write results under `/output`. Ordinary
local files use explicit paths; OMERO query sources use the portable loader
provided by Analysis. Filter and aggregate large sources before transfer.

The host captures code, bindings, parameter definitions, and required
capabilities with each new Method version. Preserve those when editing a bundle.
Use numeric comparisons and a small fixture to check the scientific calculation,
including missing values and empty selections. Do not infer biological meaning
from a filename or silently change an algorithm.

Validate with `scripts/validate_method.py path.py`. This checks syntax and the
parameter declaration without executing code. Run the Method separately against
the fixture and report the observed output. Save plots as PNG/SVG with the plotted
data when requested. Movie outputs use the movie skill's authenticated host recipe.
