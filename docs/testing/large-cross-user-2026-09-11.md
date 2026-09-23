# Large DuckDB cross-user acceptance — 2026-09-11

Passed in Chrome as user2, using the existing local TestGroup permissions and deployed cross-user workspace implementation. No application or permission changes were needed for this test.

- Source: user1's Screen 204 (`user1-solhunt`), containing Plate 304. DuckDB annotation 4245 / OriginalFile 9198 is attached to the **screen**, not the plate.
- File: `solhunt_cisegmentation_measurements.duckdb`, 828,125,184 bytes (789.8 MiB), CI Segmentation schema 3.
- Active policy: remote-query threshold 0 (all supported attachments use the worker), worker source limit 20 GiB. This is a successful test of this 790 MiB file, not a test of the maximum supported size.
- UI path: user2 → user1's screen → Analysis → select attachment → New workspace → upload test notebook → Run, twice → reload → reopen notebook.
- Worker logs confirm a new source upload (HTTP 201), schema requests, query requests and result downloads (HTTP 200). Initial source resolve to ingestion completion: 14:49:52.956–14:51:05.677 UTC, about 72.7 seconds. Subsequent runs reused the source without another upload.
- Notebook remote aggregation plus result retrieval: 3.44 seconds first run; 2.69 seconds second run. These exclude browser Python startup and plot generation.
- Result: 425,094 cells across 24 wells, B2–B9, C2–C9 and D2–D9. All 24 counts match an independent read-only query using objects.object_type rather than the notebook's label_sets join.
- CSV, PNG, SVG and executed notebook saved in user2's Dataset 699, workspace `ee120f4d-6859-4caa-9b6c-89188431c59d`, under +AnalysisWorkspaces. Dataset, result annotations and imported PNG images belong to user2 (137). PNG images 3273 and 3274 imported successfully. No pending imports or save errors remained.
- Reload preserved results, and the notebook did not automatically rerun. Chrome was left on the saved notebook as user2.
- Source screen/plate annotation IDs, owners, namespaces and map values remained identical. Full DuckDB SHA-256 before and after: `9cdc9a5a60ae7ab824b5a1a35f6b4f7f65dd75e5dbc83c97383073b61e0d3636`.

The notebook aggregates objects joined to images and label_sets, filtering `object_type='cells' AND NOT is_point`, grouped by run, well, label-set index and timepoint. Only 24 summary rows enter pandas. `images_measured` counts fields containing at least one matching cell: D9 has 35 such fields, although the images table contains 36 fields per well. No intensity rows or nuclei are counted as cells.

Usability observations: initial preparation stays at 82% with a generic message while the file transfers; byte progress would be clearer. The launcher's generic text says attachments are downloaded into the browser, which is misleading for the active remote route. Neither prevented this analysis. Repeated runs retain result versions (including distinct SVGs); identical CSV and PNG content is reused in synchronization.

Evidence: `large-cross-user-before.json`, `large-cross-user-final.json`, `large-cross-user-reference.json`, `large-cross-user-worker.log`, and `large-cross-user-results/` (actual synchronized artifacts, verified against manifest hashes). No interruption, concurrent-load, worker-restart, or multi-GB limit test was performed in this run.
