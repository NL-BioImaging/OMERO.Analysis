# Reliability implementation audit — 9 September 2026

Work was performed on `analysis_integration`, preserving and incorporating the
existing uncommitted workspace improvements. This is an implementation audit,
not a claim that every proposed acceptance permutation has passed.

## Automated verification

| Check | Outcome |
|---|---|
| Backend | 171 passed; 18 skipped in the normal run |
| Frontend | 243 passed across 50 files |
| TypeScript / Vite | Passed |
| Notebook SDK | 16 passed |
| Pyodide runtime smoke | Passed, including CSV/JSON/SQLite/DuckDB/Excel/Parquet/NPY/NPZ and plotting |
| Wheel contents | Passed; installed package files also matched the wheel byte-for-byte |
| Actual HTTP old/new broker-worker matrix | 16 passed initially; one old-worker Windows file-replacement failure passed on isolated rerun |

The normal backend skips comprise one Windows symlink-creation test and 17
opt-in worker HTTP tests. The worker matrix was run separately. The initial
matrix failure was `WinError 5` replacing the baseline worker's cache manifest;
it is recorded rather than erased by the passing rerun.

Regression coverage includes remote absence preserving local work; lifecycle
revisions and stale browser writes; dependency-protected Trash; unchanged
editor drafts; pinned Pipeline input diagnostics; plot grouping; metadata-only
large-result recovery snapshots; cleanup retry and typed IDs; shared-object
preservation; current source/group/OriginalFile access and result checksum
checks; the exact retired-record filter; and a 102-item single-file upload
bundle with unchanged individual size/hash validation.

## Live OMERO and Chrome outcomes

All new execution tests used `Analysis-QA-205e68df` synthetic sources. Existing
SolHunt code, scientific parameters and historical outputs were not edited.

| Area | Passed evidence | Not yet verified in this audit |
|---|---|---|
| Workspaces | Two workspaces per Screen, Plate, Dataset and Image through real OMERO/storage services; CSV recovery; Trash, stale-write rejection, Restore and purge. Chrome: create, rename with source prefix, switch/reload, Trash/Restore across two tabs, permanent removal and retained recovery view in the other tab. | Browser-only execution of every action on all four source types; remote-only restore in a fresh browser profile |
| Methods | Untouched draft cancellation leaves no file; manual create/save/run, rename, edit to v2; opening saved content stays clean; active Pipeline dependency blocks Trash; Assistant-generated Method saved; duplicate-save confirmation cancels without another version. PNG/SVG/CSV and SVG-only previews. Method/Pipeline Trash and ordered Restore preserve pinned history; restoring a Pipeline before its Method is explicitly blocked. | Exhaustive historical-version permutations |
| Pipelines | Create and run two steps; edit/reorder; explicitly change a pinned Method from v1 to v2; run updated Pipeline; old SolHunt Pipeline opens Saved and exposes missing inputs with Run disabled. Conversion to a Notebook preserves Method v1/v2 pins and executes successfully. Selecting the historical Pipeline v1 still shows its original two Method-v1 steps after Pipeline v2 was saved and restored. | Stop and injected failure/retry |
| Notebooks | New draft cancellation; create/save/run; Trash, historical-provenance purge block, Restore; restored editor opens Saved. Original `test1.ipynb` opens Saved. Converted Notebook rename, added/reordered cell, clear outputs and permanent deletion of a separate unreferenced Notebook passed. Final Chrome checks show “Notebook stopped.” with Run enabled after Stop during preparation, and a newly saved draft remains selected. | Upload, parameter edits and execution-stage Stop (preparation-stage Stop passed in the final Chrome build) |
| Assistant | Synthetic generation/execution, one PNG preview with three formats, Save as Method, duplicate-save protection, rename/new/delete chat, clarification prompt, Stop and return to Ready. | Live attachment/provider-failure injection and every evidence-navigation/retry permutation |
| Synchronization | Actual interrupted-cleanup injection, persisted failure journal, successful retry, shared result and unrelated annotation preserved, canonical CSV checksum unchanged; nine synchronized CSV/PNG/SVG result checksums verified; source isolation denied. | Full live permission-loss/revocation and interrupted-import/restart matrix for this lifecycle implementation |
| Presentation | Methods/Pipelines/Assistant plot grouping, SVG-only output, Notebook parameters in light and dark themes, visible actions with Explorer hidden, dialog keyboard activation. Help's off-screen initial position was found and fixed; Close is visible. Light-theme Settings and automatic saved status checked. | Exhaustive embedded/standalone, browser-zoom and keyboard traversal combinations |
| Admin | Default users/groups hide only the exact retired fixture registry. Toggle exposes them. Search and sort work with the toggle. Standard groups and inactive guest remain visible. | Different OMERO.web Admin template versions |

The scripted eight-workspace outcomes are in
[reliability-lifecycle-2026-09-09.json](reliability-lifecycle-2026-09-09.json).
The nine exact result checksums are in
[reliability-result-checksums-2026-09-09.json](reliability-result-checksums-2026-09-09.json).
The injected cleanup case used workspace
`c5d689e2-3f51-4ed8-9f52-8d6a9e65c17a`, Dataset 673 and result annotation 3664.
It passed partial cleanup, retry, shared-result preservation, unrelated
annotation preservation and source isolation. Its preserved CSV SHA-256 was
`e642f71729782d3a01113233973eacdad72f4ddf49d5e9b9535c28ae82fceef5`.
Its deliberately preserved synthetic objects were then explicitly removed.

## Findings fixed during acceptance

- A marker update left a stale Dataset wrapper during lifecycle renaming;
  refreshing the wrapper fixed the live optimistic-lock failure.
- A Pipeline with an empty binding map incorrectly claimed it had no inputs.
  Inputs now come from its pinned code without rewriting it on open.
- Selector names could lag behind workspace renaming.
- Restoring lifecycle state needed to schedule a new sync check.
- Permanent removal used to create an unsolicited empty workspace. It now
  leaves a removed-state view and an explicit New workspace action.
- Pipeline Restore allowed a trashed Method dependency. It now names the
  required Methods and leaves the Pipeline in Trash until they are restored.
- Stopping a Notebook during preparation could allow a late preparation result
  to continue. Stop now guards asynchronous preparation and cell boundaries;
  it reports an intentional stop without automatically restarting the kernel.
- Saving a new draft now selects that saved Method/Notebook when leaving the
  editor. Plot format downloads in run history use verified lazy recovery.
- Help wording now describes explicit binding repair and draft saving. Its
  paragraphs/list items are unwrapped in the maintained source so the embedded
  renderer preserves bold labels and sequential numbering.
- Help initially extended past the right edge, hiding Close. It now stays
  within the viewport, including after resizing.
- Original SolHunt synchronization hit Django's 100-file multipart limit.
  The optional bounded `concat-v1` upload avoids that limit without globally
  increasing it. SolHunt reached revision 309 with 232 synchronized items,
  zero pending imports and an available filesystem copy in Chrome.

Lock contention was observed while the synthetic service harness and browser
sync ran together. It produces a visible retryable `sync_busy`, not data loss.
Ordinary synchronization retries are bounded; lifecycle management reports the
conflict and allows an explicit retry.

## Fixture-account cleanup

The fresh allowlist contained **34 disabled users and 48 groups**, all named
`dqw-test-*`. Scientific object/file/annotation inventories were empty and no
non-test group members were found. Supported OMERO admin deletion produced:

- **Deleted:** 0 users and groups 67, 68 and 69.
- **Retained:** 34 disabled users and 45 groups, marked as retired fixtures.
  OMERO refused deletion because of retained session/event/membership history.
- No direct database removal of event history was attempted.

Exact IDs, names, dependency checks and per-record refusal messages are in
[the fresh allowlist](reliability-fixture-allowlist-2026-09-09.json) and
[the cleanup results](reliability-fixture-cleanup-2026-09-09.json).
Groups 99–103 (`dqw-crash-*` / `dqw-large-*`) are outside that reviewed allowlist
and remain visible. They were not silently included in a prefix-based deletion.

## Acceptance-fixture teardown

The synthetic primary workspace reached revision 14 with 21 synchronized items
and zero pending imports. Its permanent cleanup journal finished with 21 targets
processed, no pending targets and no errors. The other QA workspace mirrors were
also purged, followed by Screen 201, Plate 301, Dataset 661 and Image 2354.
A fresh OMERO read confirmed all four source objects were absent and the six
pre-existing managed workspace Datasets were still present. The readable tree
contains only those six original workspaces. Canonical blobs and lifecycle
journals remain protected; they were not garbage-collected. The synthetic Chrome
tabs were closed and SolHunt was left open.

Exact removed/preserved IDs are in
[the teardown verification](reliability-acceptance-cleanup-2026-09-09.json).

## Deployment and recovery evidence

The backup is
`C:\rahoebe\biomero\OMERO.Analysis\.local-query-gates\reliability-backup-20260909-131923`.
It contains both database dumps, `.analysis` storage, tracked changes and
uncommitted sources. Canonical OMERO binary storage was not deleted. This local
backup is not a substitute for a full production binary-volume backup.

[The tested version record](reliability-version-pair-2026-09-09.json) identifies
the exact wheel checksum, local image, OMERO.web version and unchanged worker
commit. The running web container received that wheel, static files were
collected, and Gunicorn was gracefully reloaded. A corresponding image was
rebuilt for subsequent container recreation. Nothing was published to a registry.

See [deployment and rollback instructions](../workspace-reliability.md).
Remaining live permutations in the table are release gates; unit coverage is
not represented as a successful browser or permission test.
