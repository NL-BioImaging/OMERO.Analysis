# Hybrid Server-Side Querying for Large OMERO DuckDB Attachments

## Status

Discussion proposal only. This plan is intentionally not implemented and should first be reviewed with the OMERO and BIOMERO developers.

## Summary

This is advisable and feasible. For newly selected DuckDB FileAnnotations of at least 500 MiB, OMERO.Analysis will default to querying the database server-side and download only bounded query results. Existing local execution remains available and unchanged.

The browser Python sandbox stays network-disabled. Chat uses authenticated query tools, while Methods, Pipelines, and Notebooks receive prefetched CSV query results before local Python execution.

## Implementation changes

### Server-side query service

- Add a configurable service for `.duckdb` FileAnnotations directly attached to the selected Image, Dataset, Plate, or Screen.
- Stream the attachment once into an atomic, read-only server cache keyed by OMERO group, OriginalFile ID, size, and source hash.
- Reuse cached databases with locking, configurable capacity, TTL, and LRU cleanup.
- Execute every query in a disposable subprocess with:
  - DuckDB `read_only=True`;
  - external access and extension loading disabled;
  - locked configuration;
  - bounded memory and threads;
  - a 30-second default timeout;
  - maximum 100,000 rows and 64 MiB per result.
- Accept one parsed, parameterized `SELECT` or `WITH … SELECT` statement only. Reject mutation, `ATTACH`, `COPY`, `PRAGMA`, extension operations, multiple statements, file functions, and network functions.
- Fail rather than silently truncate results exceeding the limits.
- These controls follow DuckDB's documented read-only connection and server-hardening facilities, including disabling external access and locking configuration: [DuckDB security guidance](https://duckdb.org/docs/current/operations_manual/securing_duckdb/overview) and [DuckDB Python API](https://duckdb.org/docs/stable/clients/python/overview).

### APIs and interfaces

Add context-token operations for `database_list`, `database_schema`, `database_query`, and `database_result_download`, with the existing user, session, group, selected-object, and direct-annotation checks.

Add:

- `GET /api/database-sources/<object_type>/<object_id>/`
- `GET /api/database-source/<annotation_id>/schema/`
- `POST /api/database-source/<annotation_id>/query/`
- `GET /api/database-query-result/<result_token>/download/`

A query request contains a versioned schema, SQL, typed scalar parameters, and a requested result name. Its response contains column names and types, row count, a maximum 100-row preview, source fingerprint, SQL hash, timing, and a short-lived signed result token. The result download is a complete bounded CSV.

Extend attachment and Workspace metadata with:

- `queryable` and recommended access mode;
- `accessMode: "local" | "remote"`;
- remote annotation, file, format, fingerprint, and schema digest;
- versioned query bindings containing source file, SQL, parameters, result name, and provenance.

Existing records without these optional fields remain local and require no IndexedDB or archive migration.

### Chat, Methods, Pipelines, and Notebooks

- Add built-in Chat tools for inspecting a remote schema and executing a bounded query.
- Add a bundled, versioned `query-omero-duckdb` skill that explains the tools and schema. It supplies guidance only; authorization and SQL validation remain server code.
- Use the remote schema for measurement-skill matching without downloading the database.
- Materialize successful query results as browser-local CSV artifacts and copy them into `/input/queries/` for local plotting and Python analysis.
- Save remote SQL and typed parameters with a Method version. On rerun, execute the query against the currently bound compatible DuckDB before running Python.
- Resolve each Pipeline step's query bindings before that step executes.
- Store Notebook query bindings in `metadata.omero_analysis.remote_queries`. Before Run, the parent Analysis application fetches their CSV results and attaches them to the isolated runtime.
- Keep Notebook cells unchanged and keep all AI, skill, and network access outside the Notebook sandbox.
- Converted Methods and Pipelines preserve their query bindings in generated Notebooks.
- Uploaded Notebooks that directly open `/input/*.duckdb` are marked as requiring a local download unless they already contain supported remote-query metadata.

### Selection and compatibility behavior

- Add a deployment option with a 500 MiB default threshold.
- Keep the package default disabled for upgrades; explicitly enable it in local Docker/deployment configuration with cache limits.
- When enabled, newly selected DuckDB attachments at or above the threshold default to **Query on OMERO**.
- Provide an explicit **Download locally** override, subject to existing transport, browser-quota, and memory checks.
- Never silently fall back to downloading a large database when remote querying fails.
- Previously downloaded files remain local.
- Existing Methods expecting a real DuckDB path continue to work with local inputs. With a remote input, they show **Needs local database** rather than being rewritten automatically.
- Workspace snapshots retain remote references and query provenance but never include the cached database.
- Workspace synchronization continues excluding source databases.

## Security and operations

- Recheck OMERO readability, group membership, direct attachment membership, and context token on every schema or query request.
- Bind result tokens to the same user, session, group, object, annotation, and source fingerprint; expire them after ten minutes.
- Do not expose cached database paths or provide a general database download endpoint.
- Log request ID, user/group, annotation, normalized SQL hash, duration, rows, bytes, cache status, and outcome—never returned cell values.
- Expose service health and cache usage in Analysis Settings.
- Document cache sizing and warn administrators that querying avoids browser transfer but still requires temporary OMERO.web disk space.

## Test plan

- Verify no browser download or Pyodide file copy occurs for eligible remote DuckDBs.
- Verify small DuckDBs, existing local files, SQLite files, and unsupported formats retain current behavior.
- Test direct-membership, user, group, session, token-expiry, and cross-object isolation.
- Test staging locks, hash verification, atomic cache creation, reuse, eviction, and corrupt database handling.
- Test rejection of writes, multiple statements, file reads, `ATTACH`, `COPY`, extensions, configuration changes, excessive rows, excessive bytes, memory use, and timeouts.
- Test schema-based skill matching and bounded AI payloads.
- Test Chat query-to-plot execution and saved Method reproducibility.
- Test Method parameter binding, Pipeline step ordering, source-fingerprint cache invalidation, and incompatible legacy Methods.
- Test Notebook prefetch, no-auto-run behavior, and confirm the runtime makes no AI, skill, or network requests.
- Test remote references through Workspace export, restore, synchronization, and rebinding.
- Add a real-container smoke test using a DuckDB FileAnnotation larger than the configured threshold.

## Assumptions

- Version one supports DuckDB FileAnnotations only; SQLite remains browser-local and external MySQL is out of scope.
- Remote mode applies only at or above a configurable 500 MiB threshold.
- Query results must be small enough to return completely; users must aggregate or filter larger results.
- This adds an execution path without replacing or removing the current local path.
