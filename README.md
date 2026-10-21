# OMERO.Analysis

OMERO.Analysis is a notebook-focused research workspace for OMERO.web.
This branch develops **1.1.0-beta1**. It is a local development version, not
a published release.

The workspace has four tabs:

- **Inspector** opens the selected input. Browse database tables and CSV data,
  inspect schema, filter and sort bounded pages, run read-only SQL, export a
  result, or create a notebook from a query.
- **Notebooks** edits and runs Python notebooks in one place. Switch between
  individual cells and a complete Python/Markdown source document.
- **Libraries** provides saved workspaces, notebooks, templates, shared content,
  and examples supplied by configured workflows.
- **Skills** previews and downloads notebook, workflow, and viewer guidance for
  use in an external AI chat. Optional context contains schema, not measurements.

The compact Explorer opens by default and selects the first database or CSV
input. Explicit notebook and library links retain their destination.
Analysis is workflow-agnostic: CI Segmentation owns its measurement examples
and compatibility requirements in the cisegmentation repository.

## Notebooks and execution

Use portable Python nbformat-4 notebooks with the
`omero-analysis-notebook` SDK. Declare logical inputs, required formats,
tables/columns, packages, and optional read-only readiness checks.
Analysis displays **Ready**, **Missing requirements**, **Not checked**, or
**Choose input**, with reasons, before execution.

**Run cell** preserves the current notebook kernel. **Run all** starts clean.
Switching tabs preserves state; changing the notebook or input bindings resets
it. Invalid source remains a local draft and cannot replace the last valid
notebook. Valid changes and results synchronize automatically to OMERO.

Python runs in a sandbox. Remote databases remain behind the authenticated
DataQueryWorker broker; inspecting a large database does not download it to
the browser. Inspector queries use a separate runtime from notebook execution.
Raw notebook JavaScript and arbitrary package downloads are not supported.
Plot-data CSV companions remain enabled.

## Integration and storage

Image, Dataset, Plate, and Screen sources are supported. Managed workspaces
live below `+AnalysisWorkspaces`, identified by namespaces and ownership rather
than names alone. Existing ownership, group access, and publishing permissions
still apply. Library imports create workspace copies.

With `INTEGRATE_DATA_ANALYSIS=TRUE` and a compatible OMERO.biomero host,
Analysis runs in a same-origin iframe and follows the host theme. Standalone
Analysis retains its theme control. Expired sessions preserve local drafts
before returning to OMERO login.

The beta removes Methods, Pipelines, the in-app assistant, custom skill upload,
AI credentials/settings, and `~AnalysisSettings` synchronization. Migration
must inventory and back up managed content before cleanup; notebooks, inputs,
results, templates, and unrelated OMERO content must be retained.

## Documentation

- [User manual](docs/MANUAL.md)
- [Portable notebook contract and SDK](docs/portable-notebooks.md)
- [Notebook-authoring skill](skills/create-omero-analysis-notebook/SKILL.md)
- [Workflow skills and examples](docs/workflow-skills.md)
- [Shared libraries and permissions](docs/shared-library.md)
- [DataQueryWorker deployment](docs/data-query-production-foundations.md)
- [Importer storage contract](docs/importer-analysis-storage-compatibility.md)
- [NL-BIOMERO deployment](docs/deployment-nl-biomero.md)
- [Release checks](docs/release-readiness.md)

Historical testing reports describe the versions tested at the time; they do
not document the beta interface.
