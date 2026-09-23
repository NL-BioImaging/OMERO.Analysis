# Workspace synchronization and multiple-workspace verification — 2026-09-09

Implemented locally on `analysis_integration` in OMERO.Analysis and OMERO.biomero. No registry publication or branch merge was performed.

## Automated verification

- Analysis backend: 152 passed, 18 skipped. Skips: 17 opt-in worker HTTP-matrix cases; one Windows symlink-creation case.
- Analysis frontend: 228 passed across 47 files, including independent workspace records, identity-preserving restore, context rejection, snapshot privacy and stable semantic identity.
- BIOMERO host: 14 passed across the launch/URL and source-panel suites.
- TypeScript/Vite build and packaged frontend/runtime wheel verification passed.
- Recovery tests cover missing tracker events, timeout boundaries, completed Image recovery, concurrent filesystem locking, corrupt manifests, and detached browsing copies.

## Local Docker and Chrome checks

- Created `Analysis 2` on Dataset 551, renamed it `Workspace verification`, and created independent `Analysis 3`.
- Switched between workspaces; names, independent records and successful synchronization persisted.
- The BIOMERO source panel listed all three workspaces and their completed revisions; the OMERO.web middle panel exposed the new-workspace action.
- Downloaded both verification snapshots through the OMERO connection; verified manifest identity, exact archive checksum, embedded file checksums and empty synchronized Assistant messages.
- Removed both verification workspaces (Datasets 657/658) after checking them. Confirmed that their empty Dataset containers were also deleted.
- Opened the existing Screen 152 SolHunt workspace: 112 results, two Methods, one Pipeline and two Notebooks remained. Revision 308 added its reusable snapshot (76 synchronized items).
- Reopened the original benchmark workspace: revision 12 saved 52 items, reused Images 2309–2312, and cleared both pending journals and recovery history. Deleted verification workspaces disappeared from its selector.
- Browser verification used the existing logged-in Chrome session; no analysis code was executed automatically.

## Existing data maintenance

- Backed up `.analysis` to `.local-query-gates/analysis-storage-before-workspaces-20260909` before maintenance.
- Reconciled four existing benchmark PNG imports. All four already existed as OMERO Images; two missing completion events were repaired.
- Moved unpublished completed journals out of the pending queue into recoverable history. Published their four PNGs in `Recovered imports`, then verified that reopening the benchmark committed them to normal results and removed the recovery copies.
- Removed 185 empty technical directories during initial maintenance and two obsolete workspace manifests after confirming that Datasets 632/656 no longer existed.
- Published the four original workspace trees beneath `E:\NL-BIOMERO\web\L-Drive\Project B\.analysis\root--0\+AnalysisWorkspaces`.
- Original content-addressed import paths were retained because OMERO uses in-place OriginalFile references. Browsing copies are detached; their local edits are not imports.

## Reproduction and rollback

See [storage maintenance](../importer-analysis-storage-compatibility.md) for the supported dry-run/apply commands and layout.

Local evidence is retained under `.local-query-gates/workspaces-*`. The local deployment Dockerfile and wheel inputs are under `.local-query-deployment`. It installs both the Analysis 0.14.0 and BIOMERO 1.6.0 integration wheels with `--force-reinstall --no-deps`.

The updated application is installed in `deployment_scenarios-omeroweb-1`; `omero-analysis-web:recovery` contains the same application code for recreation. The previous image is retained as `omero-analysis-web:before-workspaces`. To roll back, point the web service to that image and recreate only that service using the same Compose files. The named browsing copies are disposable; preserve `users/` and the backup. Older UI code will not offer the new workspace selector.

This task did not rerun worker engine-OOM, large-export, power-cut, or the opt-in HTTP version matrix; those components were not changed.
