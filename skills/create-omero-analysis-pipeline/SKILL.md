---
name: create-omero-analysis-pipeline
description: Build or validate an OMERO.Analysis Pipeline from existing versioned Methods, preserving step order, explicit bindings, and parameter overrides.
license: AGPL-3.0-or-later
---

# Create an Analysis Pipeline

Read the actual Method bundles and their pinned execution contracts. Do not
invent Method IDs, versions, input filenames, or compatible schemas.

`scripts/scaffold_pipeline.py output.oa-pipeline.json method1.json method2.json`
creates a bundle with ordered steps and the supplied Methods. Fill inputBindings
explicitly where a later step consumes an earlier output. Steps use fresh Python
namespaces; only declared files pass between steps. Set overrides in each step's
`parameters` object and validate them against that pinned Method version.

Validate with `scripts/scaffold_pipeline.py --validate pipeline.oa-pipeline.json`.
Run against a small fixture and check actual outputs, Stop, and failure behavior.
Historical steps must keep their original Method versions and contracts.
