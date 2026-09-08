# 10M-row exports and crash recovery

This is an opt-in deployment profile for Analysis 0.14.0 with DataQueryWorker 0.2.0. The normal defaults, request protocols, saved Methods v1/v2, notebook `ctx.query()` and manual saving remain compatible. The release version pair and baseline commits are recorded in [query-version-pair.json](testing/query-version-pair.json).

## Limits and deployment

Apply the worker's `deploy/compose.large-export.yaml` and this repository's matching override after the target deployment passes the gates below. The profiles configure:

| Component | Setting |
| --- | --- |
| Worker result | 10,000,000 rows and 2,147,483,648 CSV bytes, including the header |
| Worker query / ingestion | 900 / 1,800 seconds |
| Worker concurrency | Four queries, one ingestion; excess work receives a bounded rejection |
| DuckDB engine | 256 MB per query; private spill directory inside accounted result staging |
| Analysis worker request / upload | 930 / 1,800 seconds |
| Notebook cell | 3,600 seconds |
| Result token / cached worker result | 3,600 / 86,400 seconds |
| Direct CSV promotion / attachment download | 2 GiB |
| Gunicorn / reverse proxy | 1,800 seconds |

The tested worker container has two CPUs, a 2 GiB memory limit, no swap and 128 PIDs. Four 512 MB DuckDB engines exceeded that container's memory during testing. The 256 MB profile leaves room for Python, serialization and engine overhead. DuckDB spill files previously shared a source-adjacent directory; each query now owns a separate, quota-accounted spill directory. Keep the result cache at least 10 GiB for this profile and place the cache on storage with an enforced filesystem quota. Conversion and execution can temporarily use more disk than the final CSV.

`CONFIG_omero_web_wsgi__timeout=1800` uses the standard OMERO Docker startup translation and sets `omero.web.wsgi_timeout`. Other installations should set that OMERO configuration property directly. Set `proxy_read_timeout 1800s;` and `proxy_send_timeout 1800s;` in the actual nginx location/server that proxies Analysis. Verify the effective Gunicorn command and `nginx -T`; changing only the broker timeout is insufficient.

`OMERO_ANALYSIS_DATA_QUERY_PROMOTION_MAX_BYTES` is independent of the existing manual upload limit. If absent it falls back to that limit. Raising it does not authorize larger arbitrary uploads. Configure persistent, restricted `OMERO_ANALYSIS_DATA_QUERY_STATE_DIR` and audit storage, and preserve Django's signing key across container recreation and rollback.

Ten million is a row ceiling, not a promise that every possible ten-million-row schema fits in memory or 2 GiB. A larger result fails explicitly without publishing a truncated CSV. Direct saving streams through bounded temporary storage and chunked OMERO uploads. Notebook loading still needs memory for the DataFrame; the tested ten-column fixture occupies about 1.04 GB in pandas. The sandbox transfers ownership of CSV buffers and removes its temporary CSV after parsing, including parse errors. It does not retain a second CSV for every subsequent query.

## Durable cache and promotion recovery

Worker source/result publication fsyncs files and directories before acknowledging completion. On startup, an exclusive service lock and engine fence precede recovery. Linux engines install a parent-death signal. Recovery removes abandoned staging immediately, validates retained file checksums and manifest lengths, and discards incomplete/corrupt entries before readiness. Old raw database manifests can be validated against their original digest. Legacy converted CSV entries without a converted-database digest, and results without provenance, are recomputed. Original source files outside the disposable cache are never rewritten.

Analysis records a signed, versioned journal before each OMERO creation and after each returned identifier. Signed operation tags are attached to OriginalFiles and annotations so a lost RPC reply does not lose the artifact's identity. The journal contains IDs, hashes and state; it contains no credentials, raw receipts, result tokens, SQL or parameter values. CSV and recipe uploads use 1 MiB chunks instead of reading the whole file to calculate OMERO's SHA-1 checksum.

An authorized retry takes the same cross-process lock, rechecks current source/destination access, then discovers and reconciles the interrupted operation. It reuses a complete, checksum-verified three-annotation graph, or removes only verified incomplete artifacts and starts a new attempt. Cleanup itself is retryable after a crash. Changed ownership/group, external links, retagged artifacts, modified completed results or invalid signed state require operator review. An intent with no returned/discoverable ID waits 30 minutes before cleanup, allowing an uncertain server-side creation to settle.

After a receipt/session expires or permission is revoked, an administrator can reconcile without reusing the user's credentials:

```sh
python manage.py reconcile_query_promotions --host omeroserver --username administrator
python manage.py reconcile_query_promotions --host omeroserver --username administrator \
  --receipt-sha256 <64-character-receipt-hash> --apply
```

Run in the configured OMERO.web environment with the same state volume and signing key. The command prompts for an administrator password; do not put it in a shell argument, file or scheduled service. Default execution is dry-run. Apply preserves complete saves and cleans verified incomplete ones. It does not rerun SQL or recreate an expired receipt. A cleaned expired operation requires the user to run a new query to save a new result. Preserve `.reconciled` journals for the deployment's audit retention period; these are separate from disposable cache retention.

## Reproducing the export and engine gates

Install both repositories' test dependencies, Docker and the Analysis frontend dependencies/runtime. Run from Analysis unless noted. Each Docker gate creates its own cache/container and removes them afterward. Existing output files are rejected to avoid overwriting evidence.

```sh
# Build the candidate worker in the adjacent checkout.
docker build -t omero-data-query-worker:recovery ../OMERO.DataQueryWorker
python scripts/generate_data_query_benchmark.py --help
# Generate the equivalent 10M DuckDB/SQLite/CSV fixture into benchmark-data/10m.
python scripts/generate_data_query_benchmark.py --rows 10000000 --output-dir benchmark-data/10m
python scripts/benchmark_query_release.py --sizes 10000000 --concurrency 1 2 4 8 \
  --repeats 3 --output benchmark-data/release-10m.jsonl
python scripts/benchmark_query_release.py --sizes 1000000 4000000 --concurrency 1 \
  --repeats 3 --output benchmark-data/release-regression.jsonl
python scripts/test_query_export_boundaries.py --output benchmark-data/boundaries.jsonl
python scripts/test_query_engine_faults.py --repeats 3 --output benchmark-data/engine-faults.jsonl
python scripts/test_query_large_omero.py --output benchmark-data/omero-10m.jsonl
python scripts/test_local_omero_queries.py --probe live_query_crash_probe.py \
  --analysis-source src/omero_analysis
QUERY_GATE_EVIDENCE=benchmark-data/release-10m.jsonl \
  node frontend/scripts/test-large-query-runtime.mjs
```

The broker benchmark performs real HTTP queries/downloads. Cold means a new query key over an ingested source, not a flushed OS page cache; source ingestion is timed separately. It records per-request outcomes, p50/p95, transfer sizes, cgroup memory high-water marks, OOM counters and cache usage/evictions. Cgroup memory includes charged file cache. Eight clients intentionally compete for four query slots: 429 is a bounded admission result, not a successful export. Unexpected failures fail the gate. Multiple broad system tests running on the same host affect timings; these measurements establish correctness/capacity on this machine, not a throughput service-level objective.

The formats may run independently using `--formats duckdb`, `--formats sqlite` and `--formats csv`, each with a distinct output file and disposable worker/cache. Publish their union only after every run has a passed verdict. `scripts/summarize_query_release.py --help` lists the required evidence inputs; its `--capacity` accepts one combined file or three format files. It verifies all 540 unique 10M request cases, all 72 single-client 1M/4M regression cases, exact boundary checks, engine faults, live OMERO saves, browser loads and VM recovery outcomes before writing the compact report. Only explicit admission/quota rejection is accepted under concurrent load; row/byte overflow is accepted solely in the dedicated boundary tests.

The engine suite forces actual DuckDB engine-limit errors, DuckDB/SQLite/CSV-conversion kernel OOM, whole-worker group OOM and active-query container SIGKILL. It requires evidence of `oom_kill` or `OOMKilled` for kernel cases, then verifies cached bytes, a fresh uncached query, a new upload/query and released staging/slots. Merely allocating Python memory is not considered an engine OOM test.

The live OMERO and browser gates are complementary: the former queries, downloads, verifies and saves the exact CSV through real OMERO; the latter feeds those checksum-matched bytes through the real headless Chrome/Pyodide sandbox three times and verifies row count, row-ID sum and temporary-file cleanup. The latter is not a browser network load test of OMERO. Source fixtures have no embedded line breaks, allowing the transfer counter to count lines; general CSV quoting/Unicode is covered by the HTTP contract suite.

## Isolated host power-cut gate

Use a disposable VM, never the active Docker/OMERO host. The scripts guard the exact VM name `analysis-query-crash-gate` and Compose project `query-powercut`. No production volumes or host ports are attached. The tested guest is Ubuntu 24.04 (cloud image dated 2026-08-26), four vCPUs, fixed 8 GiB RAM and a 64 GiB virtual disk. The image SHA-256 is checked before conversion. Docker packages and images are transferred from the host, so guest Internet connectivity is unnecessary.

Build `omero-analysis-web:recovery` from the verified candidate wheel in your normal OMERO.web image before bootstrapping. Select an unused guest address in the Hyper-V Default Switch subnet; the gateway is the Windows adapter's address:

```powershell
Get-NetIPAddress -InterfaceAlias 'vEthernet (Default Switch)' -AddressFamily IPv4
./scripts/provision_query_gate_vm.ps1 -Address 172.29.128.250/20 -Gateway 172.29.128.1
python scripts/bootstrap_query_gate_vm.py --host 172.29.128.250
python scripts/test_query_vm_powercut.py --host 172.29.128.250 --repair-search-index \
  --output benchmark-data/vm-promotions.jsonl
python scripts/test_query_vm_cache_powercut.py --host 172.29.128.250 \
  --output benchmark-data/vm-cache.jsonl
python scripts/test_query_vm_cache_powercut.py --host 172.29.128.250 \
  --points sources:after-fsync results:after-fsync --output benchmark-data/vm-cache-durable.jsonl
python scripts/test_query_vm_powercut.py --host 172.29.128.250 --points csv_file:created \
  --output benchmark-data/vm-first-directory.jsonl
Stop-VM -Name analysis-query-crash-gate
```

In PowerShell, use a backtick or one line instead of the displayed shell continuation backslash. Hyper-V provisioning requires an elevated host shell. The image/tool downloads require host Internet access and several GB of free space. SSH keys, private test credentials, VM disks and raw evidence stay in ignored `.local-query-gates`/`benchmark-data` directories. Preserve the VM disk/environment for investigation; do not commit them.

The controller first synchronizes the **baseline** images, harness and original source. It does not synchronize after the tested operation starts or reaches its barrier. It then uses Hyper-V `TurnOff`, restarts the guest, waits for actual OMERO authentication/worker readiness and checks recovery. Production code has no fault-injection API or environment switch: the test uses private Python processes and a test-only worker entrypoint. Cache tests cover before rename, after rename and after directory fsync for both source and result publication. Promotion tests cover creation, file upload, each attachment link and completion before the response.

Each promotion run uses a fresh journal directory created after the baseline sync. The barrier lives outside that directory and its parent, so syncing the test marker cannot hide missing production directory fsyncs. To repeat the first-use checkpoint, run `test_query_vm_powercut.py --points csv_file:created`. The after-fsync cache checkpoints also assert that the published entry still exists after reboot, rather than accepting recomputation alone.

Once these commands and the export/browser commands above complete, validate and publish their evidence (use the actual browser output path if overridden):

```sh
python scripts/summarize_query_release.py --capacity benchmark-data/release-10m.jsonl \
  --regression benchmark-data/release-regression.jsonl --engines benchmark-data/engine-faults.jsonl \
  --boundaries benchmark-data/boundaries.jsonl --omero benchmark-data/omero-10m.jsonl \
  --browser benchmark-data/browser-10m.jsonl --vm-promotions benchmark-data/vm-promotions.jsonl \
  --vm-cache benchmark-data/vm-cache.jsonl --vm-cache-durable benchmark-data/vm-cache-durable.jsonl \
  --vm-first-directory benchmark-data/vm-first-directory.jsonl --output docs/testing/query-large-export.json
```

During early power-cut testing, OMERO 5.6.18's Lucene index failed with `read past EOF`, preventing Blitz startup. PostgreSQL recovered its WAL and worker cache recovery succeeded. `scripts/repair_query_gate_search.py` is a guarded, explicit disposable-stack procedure: stop OMERO, quarantine the damaged FullText directory, restart and run OMERO's documented reindex preparation/reset/finish sequence. It preserves the old index. The controller invokes it only with `--repair-search-index` and recognized index corruption, and records operator-assisted recovery separately. See [OMERO's reindexing instructions](https://omero.readthedocs.io/en/stable/sysadmins/search.html#re-indexing) for production administration. Do not generalize this helper into an automatic production index deletion job.

## Observed acceptance and rollback

Local evidence on 2026-09-08 establishes:

* Exact 10M results through real OMERO for DuckDB, SQLite and CSV: each CSV is 609,383,573 bytes with SHA-256 `dfeff01c13a1ea8acee600f4f14738864da7179fe279ebf13f54d5b7fd454b45`. Query/save times were respectively 82.46/8.54, 118.46/10.05 and 113.06/9.66 seconds. Duplicate saves reused the verified result.
* Exactly 10M rows and exactly 2 GiB pass. 10M+1 rows and 2 GiB+1 byte fail explicitly with `query_limit_exceeded`.
* Eighteen engine/restart cases pass (six cases repeated three times). Nineteen live process-kill checkpoints, including interrupted cleanup, and an actual operator dry-run/apply pass.
* Ten promotion VM power cuts pass; completed saves are reused. Six cache-publication cuts pass, with additional checks that fsynced source/result entries survive. The final promotion run required no search-index repair; earlier index corruption and its manual recovery remain documented above.
* Browser/Pyodide loads all three 10M results in 19.23, 16.54 and 14.58 seconds, verifies all rows and removes temporary CSVs, including after a parse error.
* The upgraded local OMERO stack advertises 10M rows/2 GiB/900 seconds, with 930-second broker and 1,800-second Gunicorn/nginx timeouts. The user's logged-in Chrome session ran a synthetic notebook query and saved the CSV/provenance; the stored bytes, SQL recipe and effective 10M limit were verified. The synthetic source, saved annotations and synchronized test library were then removed.

The repeated concurrency matrix is a separate required artifact; its final outcome must accompany the paired release. Repeat permission, storage and timeout checks on the actual production deployment. Host-filesystem guarantees, historical database engine versions and different OMERO server builds require their own acceptance evidence.

Upgrade worker first, verify the existing Analysis, then install the reviewed Analysis wheel from the `analysis_integration` line and enable the large-export profile. Check effective web/proxy timeouts and a permitted/denied synthetic save before use. mTLS remains a separate optional deployment change with overlapping bearer credentials during transition.

For rollback, restore the recorded image references, timeout/limit overrides and matching transport profile. Preserve OMERO CSV/provenance annotations, Analysis state/audit/signing key and worker cache. Older workers safely reuse compatible sources or recompute; older Analysis ignores additive metadata and retains manual saving. Reconcile pending new-version promotions before removing the new management code, or retain its verified image for explicit operator recovery. Never delete the persistent journals merely to make a rollback appear clean.
