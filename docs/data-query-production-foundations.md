# Data query production foundations

Candidate pair: **Analysis 0.14.0**, based on `analysis_integration` commit `4db7f8b`, with **DataQueryWorker 0.2.0**, based on `2115594`. Existing notebook results, manual saving, Methods v1/v2 and local/remote query selection are retained. The new worker can be deployed first; the new Analysis broker accepts workers without provenance capability and hides direct saving for those results.

## Authorization and exact CSV saving

Schema, execution, download and promotion use one authorization function. It checks the current browser/session token, active group, readable selected context, linked source annotation (including Dataset→Image and Screen→Plate discovery), readable OriginalFile and current source identity. Native OMERO checksum algorithms are loaded through the supported query service when necessary. Only a declared SHA-256 is supplied as an expected SHA-256; other native checksums contribute to source revision, and the worker's computed SHA-256 is recorded separately.

Fresh membership rows are checked because OMERO's session membership can lag group removal. Users must still belong to the built-in `user` group and the data group, or have current system-group membership. Save authorization additionally uses OMERO's effective `canAnnotate()` result; it does not reconstruct annotation permission from a role matrix. Permission behavior is based on [OMERO's documented group permissions](https://omero.readthedocs.io/en/stable/sysadmins/server-permissions.html). The locally tested private-group PI/admin could read another owner's source but could not annotate it; the implementation follows that effective server decision.

An enhanced query response includes an encrypted/authenticated `provenance_receipt` alongside the existing result token. The receipt binds the exact token, browser session, user/group, context, original source parent/file/annotation, source revision, SQL, typed parameters and worker execution metadata. Receipts expire on the result-token schedule. They remain in browser memory, are cleared on workspace changes and never enter portable Methods, notebook contracts or exports. Hiding Explorer preserves the mounted receipt state.

The **Save query result to OMERO** action calls `POST /api/data-query-result/promote/` with `result_token`, `receipt` and optional `.csv` filename in the JSON body. The destination is always the original context. The server reauthorizes before downloading and immediately before writing, streams within the Analysis upload limit, and verifies exact byte count and SHA-256. An expired/missing result requires a rerun; saving never reruns SQL implicitly.

Promotion creates and links three annotations in the destination's group:

* The exact worker CSV under the existing Analysis result namespace.
* A JSON FileAnnotation under `nl.bioimaging.analysis.data-query.provenance.v1`, containing the full SQL/typed recipe, selected context and source parent, IDs, hashes, actual engine/parser/worker/policy versions, limits, user/group, original execution and access/save times, counts and correlation IDs.
* A searchable MapAnnotation summary with IDs/hashes and a signed completion marker.

Success is returned only after all links exist. A failed attempt deletes annotations it created. OS file locks coordinate duplicate saves across web processes; a completed receipt reuses the linked annotations after verifying both CSV and recipe checksums. A tampered/deleted completion cannot manufacture a verified result. Multiple web hosts require a shared locking-capable state directory. A process/host crash between OMERO writes is not an OMERO transaction: inspect incomplete artifacts before production rollout and apply a deployment-specific orphan reconciliation procedure. The synchronous exception cleanup and duplicate retry tests do not establish crash-atomic cross-service writes.

Only the exact remote CSV gets this provenance. A transformed DataFrame or notebook output continues to use the existing saving workflow. SQL and parameter values are intentionally present in the protected JSON recipe, so the provenance has the same confidentiality requirements as the dataset/results.

## Server configuration

Existing bearer URL/token settings and their defaults remain valid. Optional settings are available through Django configuration or environment:

| Setting | Purpose |
| --- | --- |
| `OMERO_ANALYSIS_DATA_QUERY_CA_FILE` | CA bundle for worker HTTPS, including readiness |
| `OMERO_ANALYSIS_DATA_QUERY_CLIENT_CERT_FILE` | Client certificate for mTLS |
| `OMERO_ANALYSIS_DATA_QUERY_CLIENT_KEY_FILE` | Matching private key; both client settings required |
| `OMERO_ANALYSIS_DATA_QUERY_AUDIT_FILE` | Persistent JSON-lines audit file outside worker cache |
| `OMERO_ANALYSIS_DATA_QUERY_STATE_DIR` | Restricted lock directory shared by web processes |

TLS settings require an HTTPS worker URL. Certificate verification stays enabled; stricter transport is not automatically enabled on upgrade. Use the worker's `deploy/compose.mtls.yaml` and reverse-proxy profile with no public worker port. Put CA/client files in server-only mounts and keep the broker on the private network. Certificates, bearer tokens, result tokens and receipts are never emitted in audit events.

Configure an audit file on persistent storage for production, owned by the web service with mode 0600 and restricted parent directory. Newly created files/directories use 0600/0700; review permissions on pre-existing mounts. The logger fallback is suitable only when a persistent restricted Django logging handler is configured. Audit events contain request IDs, user/group/object/file IDs, hashes, counts, timing and outcome, excluding SQL and parameter values. Configure retention, encryption/backups and external rotation independently of cache eviction. Audit writes use append/fsync; a storage failure is an operational error, not silently ignored.

Correlation IDs accept only 1–80 ASCII letters/digits/dot/underscore/hyphen, otherwise a new ID is generated. Existing public error codes are preserved. Optional `worker_code` and `request_id` provide diagnostics. Broker responses are closed on success/error and streaming completion/disconnect.

## Reproducible acceptance commands

From Analysis, with the worker checkout adjacent:

```sh
python -m pytest
DQW_RUN_INTEGRATION=1 python -m pytest tests/test_worker_contract.py
python -m pytest notebook-sdk/tests
npm --prefix frontend test
npm --prefix frontend run typecheck
python scripts/build_frontend.py --skip-install --skip-runtime
python -m build --wheel --no-isolation
python scripts/verify_wheel.py dist/omero_analysis-0.14.0-py3-none-any.whl
npm --prefix frontend run smoke:runtime
npm --prefix frontend run smoke:browser
python scripts/test_local_omero_queries.py
python scripts/test_query_mtls.py
python -m pip install psutil
python scripts/benchmark_query_capacity.py --rows 100000 --repeats 3
```

Use `$env:DQW_RUN_INTEGRATION='1'` in PowerShell. The HTTP harness accepts `DQW_REPO` and `DQW_PYTHON`; it does not require a live OMERO server. The GitHub `query-compatibility` workflow takes an exact worker ref for paired CI. The live scripts accept container/network overrides. The local permission script obtains the configured local Docker root credential through a private pipe; it never prints or stores it. Run only against a development/disposable OMERO stack. It creates uniquely named test groups/accounts/data, deletes synthetic data and deactivates accounts. OMERO retains its immutable account/session/event history; test groups and inactive accounts remain for that history.

The capacity script reuses the existing generator's equivalent mixed numeric/text schemas and starts its own HTTP worker/cache. It records 1/2/4/8 clients, cold/warm query keys, per-request outcomes, p50/p95, sampled worker/child RSS, disk/cache eviction and transferred bytes. It deliberately uses the default 100,000-row query limit and a 16 MiB result cache to exercise pressure. Cold is a new result key over an ingested source, not an OS cache flush. Sampled RSS sums shared pages and is not an exclusive-memory measurement. More rows can produce an explicit limit failure; this is recorded rather than treated as a successful truncated export. The generated portable benchmark notebook links to this independent concurrency gate.

## Tested locally on 2026-09-08

* Worker: 51 tests on Windows and Linux; lint, format and strict type checks. Linux probes cover read-only root, blocked egress, PID pressure and cgroup OOM. Query tests cover timeout, disconnect, child crash/reaping, oversized output, corrupt files, quota and active leases.
* Analysis: 129 backend tests, including 18 provenance/download tests, 230 frontend tests, 16 notebook SDK tests, runtime/browser smoke and wheel validation.
* Joint HTTP: 17 tests covering both versions in both directions and rollback cache reuse/recomputation; baseline broker source is frozen, not a mock HTTP response.
* Live OMERO: private/read-only/read-annotate/read-write group owners, members, PIs and administrator; query/schema/download; permitted saves and duplicate reuse; denied saves without artifacts; cross-session/group token rejection; source unlinking; permission downgrade, membership revocation, moved contexts and revoked OMERO sessions.
* Optional mTLS: actual installed broker readiness and authenticated capabilities succeed with the client certificate; missing client certificate and wrong CA are rejected. This does not change the running broker's transport profile.
* Capacity: the checked-in [100,000-row report](testing/query-capacity-2026-09-08.json) records the local Windows HTTP measurements and explicit admission failures. It is a smoke capacity baseline, not a production throughput promise.

The release acceptance target is full compatibility, not a claim established by these selected cases. Target-hardware large exports, all production data/file versions, engine-specific OOM recovery, host-crash reconciliation and the complete deployment-specific permission/fault matrix remain rollout gates. Do not publish a production-ready claim until those gates pass.

## Deployment and rollback

Build paired images/wheels from the reviewed commits and record their digests. Deploy worker first and verify the current Analysis, then deploy enhanced Analysis from `analysis_integration`. Verify direct saving with a disposable source before enabling the optional mTLS profile and rotating credentials. Persistent audit and lock storage must be configured independently from worker cache. Keep old/new keyring credentials overlapping while switching the broker; remove the old credential only after all callers have moved.

For rollback, restore the saved image references and matching bearer/TLS configuration. Keep OMERO result/provenance annotations, Analysis audit/state and worker cache volumes. Old Analysis safely ignores additional response fields; saved Methods and notebooks retain their existing protocols. The worker computes version-specific result keys, so rollback safely reuses readable sources or recomputes results. No registry publication or production rollout is performed by these scripts.
