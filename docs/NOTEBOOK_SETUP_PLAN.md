# Graphical notebook setup and separate run parameters

Implemented design for OMERO.Analysis 1.1.0-beta1. Notebook setup and Run
parameters are separate sections inside Notebooks. The four main tabs remain.

## What the researcher sees

Inside Notebooks, place two separate, collapsible sections above the cells:

1. **Notebook setup** — authoring: what data this notebook accepts and needs.
   Its collapsed summary might read “Measurements + optional plate template ·
   3 packages · Ready”. Opening it gives an ordinary form, not JSON.
2. **Run parameters** — use: the values for this particular analysis run.
   For example Timepoint, Object type, Minimum count, or a condition column.
   Show only parameters actually declared by the notebook; no parameter form
   for the zero-configuration starters. Keep this section independent of setup.

The original tagged Python configuration cell stays first in the notebook.
Its source is still available through its normal code disclosure. A researcher
can use the form; an author or external AI can still edit the same source.
No separate Editor screen, modal wizard or additional main tab is needed.

## Setup form

| Section | Simple controls | Advanced controls |
| --- | --- | --- |
| Inputs | Add a database/table input or supporting file; choose an attached input; Required switch | Portable ID/path, accepted formats/extensions, filename patterns |
| Required structure | Select tables and columns from the inspected schema | Optional column types and custom read-only readiness checks with failure messages |
| Parameter definitions | Add a labelled number, whole number, text, checkbox or choice; default, help and bounds | Choices from a bounded database query; value/label columns |
| Packages | Select from packages supported by the local notebook runtime | Inspect declared version constraints and explain unsupported packages |
| Results | Explain where exports are saved | Portable results subfolder; retain the results/ restriction |

Keep technical fields behind Advanced. The protocol schema string is a fixed,
read-only version detail; users should not have to type it. Display current
compatibility and precise unmet requirements next to the relevant input.

Input declarations and input bindings are distinct. A declaration describes
what a reusable notebook requires; a binding selects a file in this workspace.
Selecting a different file should normally change the binding, not rewrite a
portable notebook's accepted formats or table requirements. Supporting inputs
such as plate_template.xlsx use kind=file and their real portable paths.

Show a preview of proposed requirements inferred from the inspected schema.
Require an explicit selection before declaring them; do not make every column
mandatory. Missing schemas stay “Not checked” with an Inspect input action.
Do not download the remote database to populate this form.

## Parameter definitions versus run values

Editing a definition belongs in Notebook setup. Choosing a value belongs in
Run parameters. For instance, the definition “Minimum count: integer, default
0, minimum 0” generates a numeric run control. Choosing 10 does not change the
default or the Python configuration source.

Store chosen values with the current notebook's workspace state and record
the effective values in run provenance. Reopening restores those choices;
Reset to defaults is explicit. Validate values and dynamic choices using the
existing protocol rules. Dynamic options use bounded, read-only queries via
the current input binding; never run analytical cells to discover choices.
Give these controls their own loading, error and retry states.

Parameter changes mark dependent outputs stale. Setup/binding changes must
make the next execution start with matching configuration, while preserving
drafts. Explain when a kernel restart is required. Opening forms or switching
tabs must not restart the notebook kernel. Running one cell must not silently
execute earlier analysis: if initialization is missing, offer an explicit
Initialize setup action (configuration only) or Run all.

## Preserve the source and portability

Use the existing v1 contract, not a second configuration format or a form-only
copy. Parse the unique first code cell tagged omero-analysis-config without
executing Python. Validate the extracted literal with the frontend and SDK
validators. The form edits a draft; Apply validates and updates only the JSON
literal passed to oan.configure(...), preserving the surrounding Python,
cell ID, tags, metadata and other cells. Do not regenerate the entire cell.

Use a syntax-aware locator for the exact supported call/literal range. If it
is computed, ambiguous or otherwise unsupported, show “Edit setup in Python”
and leave the code untouched. Syntax errors remain recoverable drafts and
cannot overwrite the last valid configuration. Preserve unknown fields and
do not silently discard unsupported constructs. Source edits update the form
after successful parsing; concurrent form/source drafts require a visible
resolution instead of last-write-wins replacement.

Current compatibility parsing also permits metadata.omero_analysis.
schema_requirements to override input schema declarations. Reconcile that
legacy representation explicitly on Apply so it cannot silently override
new form selections. Include the effective before/after requirements in the
preview, preserve unrelated metadata, and test frontend/SDK agreement.

Do not rename input IDs or parameter names by default: analytical Python may
refer to them. An advanced rename must explain the affected references and
require review; arbitrary Python reference rewriting is outside the first
version. Similarly, attaching a different file should not rename an input ID.

Legacy notebooks using OA_ATTACHED_INPUTS remain editable and runnable through
their existing path. Offer explicit conversion to the portable configuration
as a separate reviewed operation; do not silently insert or replace setup
cells when opening an old notebook.

## Delivery steps and acceptance

1. Separate the existing run-parameter UI from authoring and give it a clear
   Run parameters heading, saved values, defaults and validation. Keep notebooks
   without declared parameters uncluttered.
2. Implement safe literal extraction/replacement and round-trip fixtures first.
   Then expose Inputs, accepted formats, Required structure and Packages in
   Notebook setup, plus a proposed-source preview and Apply/Cancel.
3. Add parameter-definition editing and advanced choices/readiness controls,
   reusing the same validators and bounded query services.
4. Update authoring skills and test the built local Docker deployment in Chrome
   with root's separate SolHunt acceptance workspace before general use.

Acceptance covers query + Excel inputs, ambiguous binding, missing tables,
optional inputs, no parameters, typed/static/dynamic parameters, unsupported
packages, metadata schema overrides, invalid/manual Python, custom surrounding
setup code, unknown fields, special characters in JSON, source/form conflicts,
draft recovery, and portable SDK round trips. Verify that setup opening does
not reload Python, parameter values do not rewrite defaults, setup changes
invalidate old execution state, and single-cell execution never runs preceding
analytical cells automatically. No workflow-specific logic goes into the editor.
