# Local acceptance evidence, 2026-09-08

The implementation pair is recorded in [query-version-pair.json](query-version-pair.json). The installed local Analysis backend was compared byte-for-byte with `data_query.py`, `data_query_provenance.py`, `data_query_audit.py` and `views.py` in that checkout. The local worker is 0.2.0 and Analysis is 0.14.0. The web audit file is owned by `omero-web` with mode 0600 on persistent storage.

## Live Docker OMERO

The reproducible `scripts/test_local_omero_queries.py` run passed:

* Schema, query, download and exact CSV checksum for owners, ordinary members, group owners and administrator across private, read-only, read-annotate and read-write groups.
* Private-group ordinary member cannot read another owner's data. Effective annotate permission controls saving; denied saves leave no new annotations.
* Successful saves have CSV, complete JSON recipe and searchable summary links in the context group. The same completed receipt is reused.
* Changed browser sessions/groups, unlinked sources, reduced annotate permissions, revoked membership, moved contexts and revoked OMERO sessions deny the corresponding operation.

Synthetic datasets/annotations were removed and synthetic accounts deactivated. Historical groups/accounts remain because OMERO retains session/event history. Two early harness attempts encountered OMERO fixture setup/cleanup constraints; their remaining accounts were also deactivated. Existing user datasets and permissions were not changed.

## Live Chrome notebook and saving

In the logged-in local OMERO/BIOMERO Analysis UI, a temporary Dataset held a two-row CSV and a valid portable notebook. `await ctx.query('source', 'SELECT id, area FROM data ORDER BY id')` completed with the expected two rows. The new action was visible in Explorer. Hiding/reopening Explorer preserved the receipt. Clicking **Save query result to OMERO** displayed **Saved CSV and provenance**.

The saved annotations were then read through OMERO.py: CSV bytes matched exactly, the SHA-256 matched execution provenance, and the recovered full SQL recipe and source/context IDs were correct. The temporary source/result annotations, test dataset and its automatically synced workspace were deleted. Chrome was returned to the logged-in data browser.

## Transport, compatibility and CI

`scripts/test_query_mtls.py` passed with the actual installed broker through a disposable private nginx proxy: readiness and bearer-authenticated capabilities succeeded with trusted client/server certificates; missing client certificate and wrong CA failed. No host port was published. The running stack retains its legacy private-network bearer configuration.

The local 17-case HTTP matrix passed for both brokers against both worker versions and cache reuse/recomputation after rollback. Worker GitHub CI passed Python 3.11/3.12 tests, lint/types, container smoke, Linux fault probes and image-security checks. Analysis PR CI passed backend tests on Python 3.10/3.11/3.12, the joint HTTP matrix and frontend/runtime/browser/wheel validation. The remote deployment-smoke job is conditional on repository secrets and was skipped; the authorized local live checks above supply separate evidence.

Capacity results are in [query-capacity-2026-09-08.json](query-capacity-2026-09-08.json). The deliberately small 16 MiB result cache rejects overlapping full exports explicitly. These are local development measurements with background activity, not isolated hardware throughput measurements. See [the release guide](../data-query-production-foundations.md) for remaining production gates and rollback instructions.
