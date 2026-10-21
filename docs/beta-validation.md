# Analysis 1.1.0-beta1 validation

Validated locally on 21 October 2026.

## Synchronization and versions

Externally deleted/unlinked OMERO results are reconciled into persistent deletion receipts. Stale browser records and restored snapshots cannot recreate these result IDs. Notebook source, templates, inputs and unrelated objects are preserved.

A successful Run all replaces outputs for the same notebook, input identity and parameter combination. Other combinations remain separate. A successful cell run replaces only the filenames it generated in that combination; failed executions retain previous successful results. Current OMERO names include the notebook, UTC execution time and run identity.

Each workspace has one current recovery snapshot and synchronization manifest; each notebook ID has one current attachment. Orphan versions outside an older manifest are checked using namespace, owner and workspace/content identity. Shared bytes are preserved while obsolete workspace links are detached. Cleanup is journaled before deletion, checkpointed after a batch, and retryable after interruption in either storage mode.

Database and CSV/TSV inputs have no Explorer deletion checkbox or Delete menu and are excluded from bulk removal. Generated CSV results remain removable. Cells track actual writes as well as changed bytes, so explicitly rewritten identical outputs can be regenerated without clearing notebook variables. The manual now contains 20 searchable topics with contents, examples, troubleshooting and keyboard navigation.

## Tests and live acceptance

- 260 frontend tests passed in 58 files.
- 351 backend/notebook-SDK tests passed; 22 optional-integration/platform tests were skipped (Windows symlink restrictions, optional installed providers and separately enabled worker-version matrices).
- Production frontend compilation, wheel packaging, Docker installation and dependency checks passed.
- All 42 installed asset checksums matched: Analysis 12, BIOMERO host 6, ZarrViewer 24.
- An initial transient Windows temporary-file replacement error disappeared with a fresh test directory; the final complete backend suite passed without changing unrelated recovery code.

Chrome acceptance used root's original SolHunt workspace and a separately backed-up acceptance workspace. Original SolHunt retained both notebooks with unchanged content hashes and its source/template references. Its 223 historical result references were reconciled; OMERO confirmed one snapshot, one manifest, no pending cleanup and no cleanup errors. Surviving managed files and the extra historical snapshot were backed up outside the repository before cleanup.

A synthetic count notebook generated CSV, PNG and SVG outputs. Repeating identical settings replaced the prior set; different parameter values retained separate sets. Unlinking only the synthetic plot from its OMERO Dataset removed its set and companions from Explorer, preserving the other setting. An explicit subsequent cell run regenerated the removed set using the existing kernel. Original measurements were not changed.

## Query-service investigation

The worker was healthy. Inspector and notebook checks raced to upload the same approximately 828 MB database. Timestamped logs showed temporary HTTP 429 admission refusals followed by a completed upload and successful queries. There was no evidence of a stuck worker or leaked slots; restarting was not the required remedy.

Analysis now coordinates cold preparation across web processes using a bounded lock keyed by the worker plus existing opaque authorization/source identities. Waiters re-resolve the completed source. Explicit temporary admission errors are retried within the preparation deadline; other failures remain errors. Worker limits and session/owner/group isolation are unchanged. Lock filenames contain hashes, not credentials or raw source names.

Live Chrome validation recorded one successful upload, zero capacity refusals, and multiple successful schema/query requests with original and acceptance workspaces open. First preparation took about 52 seconds. Inspector then displayed the database tables and paged rows. DataQueryWorker code/version was unchanged.

## Packages and rollback

Installed: Analysis 1.1.0b1; BIOMERO host 1.7.0b9+analysis.beta1; OMERO.py 5.23.0; ZarrViewer 0.8.0; WorkflowSkills 0.4.0+analysis.beta1; DataQueryWorker 0.2.2. The independent notebook SDK is 0.2.0.

Final web image: `local/biomero-omeroweb:analysis-beta1`, `sha256:640c632a866ce80e4f424e5fa270cfe33fdf1ba1328244839cd5f935358d977e`.

Rollback image: `local/biomero-omeroweb:before-sync-help-20261021` (pre-change digest starts `a0a8e392`). Select this explicit image with `ANALYSIS_LOCAL_WEB_IMAGE` and recreate only `omeroweb` through the existing base/local Analysis compose configuration, without rebuilding, pulling or restarting dependencies. Code rollback does not reverse OMERO cleanup. Recover content only from the separately retained, checksummed backups after reviewing current deletion receipts; never automatically restore old snapshots over newer notebooks.

Only the Analysis beta branch is published. Companion branches and workflow execution pins are unchanged; no CI Segmentation rebuild, PyPI publication or GitHub release tag is included.


## Run parameter labels and control surfaces — 21 October 2026

Explorer result runs now show their recorded parameter names and values below the run date/ID, including when a run folder is collapsed. These values come from the matching execution record, never current edits or notebook defaults. Runs without parameter definitions say “No run parameters”; unavailable or ambiguous historical provenance says “Parameters not recorded”. Legacy runs with one matching recorded timestamp can also display their settings. Folder tooltips retain the complete run title and settings; settings wrap in the tree.

Dark and light controls use separate Blueprint gray surfaces, borders, hover, disabled and keyboard-focus states. Inputs, selects, textareas and neutral buttons stand out from cards, while Explorer selection rows and connected navigation tabs keep their existing behavior. Semantic action colors are preserved. Contrast checks require at least 3:1 for field boundaries and 4.5:1 for normal/disabled control text.

Validation: 265 frontend tests passed across 58 files. Production type checking, Vite compilation, wheel packaging and Docker build passed. All 42 deployed JS/CSS checksums matched; installed dependencies passed pip check. No backend/SDK source changed; their previously recorded 351-test result remains the baseline.

Local image: `local/biomero-omeroweb:analysis-beta1`, `sha256:69c8b7bb1558df10e4cf20446a477f6a3f05d6d7dc43226032bca579e7bea7c5`. Package versions remain as listed above. Rollback: `local/biomero-omeroweb:before-run-parameters-theme-20261021`, retaining previous image `sha256:640c632a866ce80e4f424e5fa270cfe33fdf1ba1328244839cd5f935358d977e`. Select that explicit image with `ANALYSIS_LOCAL_WEB_IMAGE` and recreate only omeroweb through the existing base/local Analysis compose files with no build/pull/dependency restart. This update requires no data migration or result cleanup.


Chrome acceptance passed as root in the separate SolHunt acceptance workspace (Dataset 851): recorded multiplier=1 and multiplier=2 labels stayed visible with both run folders collapsed; the legacy graphical-setup run displayed minimum=2 and timepoint=0 from its unique historical record. Both themes displayed the parameter form correctly. Computed neutral button surfaces were Blueprint Dark Gray 5 (#404854) and Light Gray 3 (#e5e8eb); field surfaces were Dark Gray 2 (#252a31) and Light Gray 4 (#edeff2). Keyboard navigation produced a 2px blue focus outline in each theme. No analytical code was run or original notebook edited. Screenshots are retained locally outside the repository: outputs/run-parameters-theme-dark.png and outputs/run-parameters-theme-light.png.
