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
