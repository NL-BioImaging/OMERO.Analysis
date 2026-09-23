# Workspace reliability and lifecycle

The `analysis_integration` implementation preserves browser data when OMERO
content is missing or inaccessible, adds explicit Trash/Restore/permanent
cleanup, and separates recovery metadata from large result bytes. It includes
the earlier uncommitted multiple-workspace and readable-storage work.

## User-visible behavior

- Workspace management includes active and trashed workspaces for the selected
  source. Names retain their source prefix; IDs remain stable across renames.
- Methods, Pipelines and Notebooks use Trash/Restore. Active Pipeline
  dependencies block Method trash. Historical provenance blocks removal of
  versions that are still needed. Trash has no automatic expiry.
- Editors open saved content without rebinding. New Method/Notebook drafts
  persist on Save. A Pipeline can be edited with missing inputs; execution is
  blocked until its pinned inputs are repaired explicitly.
- Plot companions are grouped by directory/stem and execution/run identity.
  PNG is preferred, SVG-only plots remain visible, and every format is retained.
  Notebook cell outputs retain their original semantics.
- Browser saving, OMERO synchronization, pending imports and the readable disk
  copy have separate status. Cleanup failures retain retry targets.

## Lifecycle and recovery contract

`POST` to the workspace status URL plus `lifecycle/` accepts `action` (`trash`,
`restore`, `purge`) and the last observed lifecycle `revision`. Context/session,
group, source identity and annotation permission are checked. Purge requires
Trash first. A stale revision returns `workspace_conflict`; an occupied storage
lock returns `sync_busy`. Purging cannot be restored halfway through cleanup.

Durable state lives in `users/<id>/workspaces/<workspace-id>/lifecycle.json`.
`cleanup.json` retains pending typed object identities, failures, completed and
preserved targets. `pending-cleanup.json` journals replaced objects during
ordinary synchronization. A failure never discards remaining cleanup targets.
Fresh links protect shared results and unrelated annotations. Canonical blobs
are retained; backfill no longer collects them merely because they are absent
from the latest manifest. The readable copy can be rebuilt independently.

Missing or inaccessible remote content pauses republishing and retains the
local workspace. Explicit remote purge also preserves already-open tabs' local
recovery copies. Browser lifecycle revisions and permanent-removal tombstones
reject stale writes. Broadcast notifications and remote checks update open tabs.

Automatic ZIP recovery snapshots contain result identities, sizes and SHA-256
digests rather than result payloads. Result retrieval checks the current source,
group, workspace links, readable OriginalFile and canonical storage scope.
Server and browser verify bytes before use. Explicit portable ZIP export
hydrates available results and enforces its size limit. It never silently
claims to include unavailable or oversized results.

Synchronization plans advertise optional `payloadEncoding: concat-v1`.
Enhanced clients send one multipart file, ordered according to the signed
upload-key list. Each part is bounded by its validated inventory size and
verified checksum. This avoids Django's default 100-file multipart limit
without relaxing it globally. Existing per-item, item-count and changed-byte
limits still apply. Older clients use individual files; enhanced clients retain
that transport for older servers.

## Installation and local deployment

Build from this branch, keeping the prior frontend/runtime version pins:

```powershell
cd C:\rahoebe\biomero\OMERO.Analysis
.venv/Scripts/python scripts/build_frontend.py --skip-install --skip-runtime
.venv/Scripts/python -m build --wheel --no-isolation
.venv/Scripts/python scripts/verify_wheel.py dist/omero_analysis-0.14.0-py3-none-any.whl
```

The build helper cleans setuptools staging to avoid stale hashed bundles.
Install the wheel in OMERO.web's Python environment, run `omero web syncmedia`,
then reload Gunicorn workers. Close/reload old Analysis pages before lifecycle
testing. No OMERO database schema migration is required. The existing
group-mapped durable Analysis storage must be available for lifecycle changes.

The local candidate is `omero-analysis-web:reliability`. Its compose overlay and
Dockerfile are under `.local-query-deployment/reliability/`; the overlay is
machine-specific and intentionally untracked. The running web container was
updated with the same wheel and gracefully reloaded to preserve the login.
The worker and its 10M-row deployment profile are unchanged by this release.

## Retired fixture extension

The exact cleanup allowlist and outcomes are in
[the audit](testing/reliability-2026-09-09.md). Cleanup calls OMERO's supported
[`deleteExperimenter` and `deleteGroup` administrative operations](https://docs.openmicroscopy.org/omero-blitz/5.8.2/javadoc/omero/api/_IAdminOperations.html).
Event/session history is never removed through database edits.

For the packaged Admin filter, configure
`omero_analysis.admin_extension.RetiredTestRecordsMiddleware` in the OMERO.web
middleware list and set `OMERO_ANALYSIS_RETIRED_TEST_RECORDS` to a mounted JSON
file containing `retired.users` and `retired.groups` ID-to-name maps. Only
matching `dqw-test-*` IDs/names are hidden. Invalid configuration reveals all
records. Users can toggle **Show retired test records**; search and sorting still
apply. Other inactive accounts remain visible. The extension is tested against
OMERO.web 5.31.1; verify it when upgrading the web Admin templates.

`scripts/retire_query_fixtures.py` inventories by default and requires a fresh,
exact allowlist for application. `scripts/live_query_probe.py` now requires
`disposable_stack: true`, records created IDs during setup, and journals teardown
failures. Destroy that disposable stack after permission tests.

## Backup and rollback

Before this local migration/cleanup, the backup captured both PostgreSQL
databases, `.analysis`, the tracked patch and uncommitted sources at
`.local-query-gates/reliability-backup-20260909-131923/`. Existing OMERO binary
storage was retained, not deleted. The previous web image is tagged
`omero-analysis-web:before-reliability`.

Before a future rollout, also capture the canonical OMERO binary volumes and
export browser-local work that has not synchronized. Verify backup readability.

Do not roll back just the frontend after lifecycle operations: older clients do
not understand the new recovery references and deletion rules. Close Analysis
tabs, retain/export post-backup work, stop web writes, then restore the matching
database, `.analysis`, browser recovery data and web image as a coordinated set.
Alternatively, forward-fix on this branch while retaining journals and blobs.
Never garbage-collect canonical files as part of rollback or ordinary recovery.

## Reproducible checks

```powershell
.venv/Scripts/python -m pytest -q
cd frontend
npm test
npm run typecheck
npm run smoke:runtime
cd ..
$env:DQW_RUN_INTEGRATION='1'
.venv/Scripts/python -m pytest tests/test_worker_contract.py -q
```

Run the notebook SDK suite from `notebook-sdk` using its documented command.
For live checks, execute `scripts/analysis_reliability_probe.py` using OMERO.web's
Python environment. Supply credentials only over stdin along with `action`:
`setup` returns an exact fixture inventory; pass it as `fixture` to `probe`,
`faults`, `verify-results`, and finally `cleanup`. `probe` creates two workspaces
per source kind; `faults` injects one cleanup failure and verifies retry/shared
object preservation. Keep outputs until cleanup is verified. Use named
synthetic workspaces for Chrome execution tests. Never count inspection as a
successful execution gate.
