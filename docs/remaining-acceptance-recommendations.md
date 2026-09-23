# Remaining acceptance recommendations

Recorded on 9 September 2026 for the reliability and interface changes on
`analysis_integration`.

These items are primarily **verification gaps, not confirmed bugs**. Normal
workflows passed, but the remaining checks are needed to establish confidence
in recovery, authorization and less common interactions. See the
[implementation audit](testing/reliability-2026-09-09.md) for completed tests,
evidence and the full acceptance matrix.

## Priorities and estimated effort

The estimates below cover verification and small fixes. They are rough
engineering estimates, not known repair times or commitments. Tests may find no
defect; deeper concurrency or recovery defects could take longer.

| Remaining check | Importance and purpose | Estimated effort |
|---|---|---|
| Permission loss and session revocation | **Critical for shared use.** Confirm that losing access prevents further reads and writes while preserving local work. | Medium: **½–1 day**, using a disposable OMERO stack. |
| Interrupted uploads and container restarts | **Critical for reliability.** Confirm that recovery produces complete results without duplicates or permanently pending uploads. | Hardest: **1–2 days**; concurrency defects could extend this. |
| Restore from OMERO in a fresh browser | **High.** Prove recovery works without depending on files already cached in the browser, especially with metadata-only snapshots. | Relatively straightforward: **2–4 hours**. |
| Pipeline Stop/failure/retry; Notebook upload, parameter edits and Stop during execution | **Medium–high.** Confirm failures and cancellation leave clear, recoverable run states. Notebook Stop during preparation already passed. | Usually straightforward: **½–1 day** combined. |
| Assistant attachments, provider failures, retry and evidence links | **Medium.** Verify usability and recovery from external-service errors. | Usually straightforward: **3–6 hours**. |
| Remaining historical-version, source-type, zoom, keyboard and embedded-layout combinations | **Medium overall.** Historical provenance is more important than cosmetic layout differences. | Mostly testing and small fixes: **½–1 day**. |
| Admin filter on other OMERO.web versions | **Low for the current stack.** OMERO.web 5.31.1 was tested. Verify additional versions before claiming support or upgrading. | Depends on the target version; can be deferred for the current deployment. |

## Recommended execution order

1. **Fresh-browser recovery:** restore a synchronized workspace without its
   existing browser cache. Verify reusable artifacts, on-demand result retrieval,
   and CSV/PNG/SVG checksums.
2. **Permission changes and revocation:** use a disposable OMERO stack to verify
   access denial, preservation of local work, and suspension of automatic
   republishing after access is lost.
3. **Interrupted synchronization and restart:** interrupt uploads and restart
   services at controlled points. Verify complete recovery, retryable cleanup,
   and the absence of duplicate objects or permanently pending work.
4. Complete execution-control and Assistant failure-path checks.
5. Complete the remaining provenance and presentation combinations. Test other
   Admin template versions when those versions become deployment targets.

Include the observed **`sync_busy` contention** in interruption testing. It
recovered but sometimes required a manual retry. Check whether retry behavior
and progress feedback can be improved without weakening synchronization locks
or lifecycle revision checks.

## Acceptance and deployment guidance

Local testing can continue. Keep production sign-off open until fresh-browser
recovery, permission changes, and interrupted-sync/restart checks pass. This
prioritization does not mark the other outstanding acceptance cases as passed
or waive them from the agreed release scope.

Record each live case as passed, failed or blocked, with reproducible steps and
evidence. Do not substitute code inspection or unit coverage for a successful
live test. Use clearly named synthetic fixtures and remove them after testing;
run destructive permission tests on a disposable stack so they do not add
fixture accounts to the shared local stack.
