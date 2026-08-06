# Hybrid Server-Side Querying for Large OMERO DuckDB Attachments

## Status

Discussion proposal and implementation priority 2. This plan is intentionally
not implemented and should first be reviewed with the OMERO and BIOMERO
developers. Make it the next implementation focus after the completion gate in
`biomero-integrated-data-analysis.md` has passed.

That ordering is a delivery sequence, not an architectural dependency. Remote
querying must work in standalone OMERO.Analysis and when Analysis is embedded
in BIOMERO, regardless of `INTEGRATE_DATA_ANALYSIS`.

## Summary

This is advisable and feasible. For newly selected DuckDB FileAnnotations of at least 500 MiB, OMERO.Analysis will default to querying the database server-side and download only bounded query results. Existing local execution remains available and unchanged.

The browser Python sandbox stays network-disabled. Chat uses authenticated query tools, while Methods, Pipelines, and Notebooks receive prefetched CSV query results before local Python execution.

The query core will be transport-neutral. OMERO.Analysis routes are the first
adapter, but authorization, source resolution, SQL policy, execution, result
limits, and provenance will not depend on Django views, HTTP, or MCP. This
keeps an optional future MCP adapter possible without making a general-purpose
MCP server part of the trusted execution boundary.

Use the source/context contract and pinned OMERO.Analysis deployment established
by `biomero-integrated-data-analysis.md`, but do not route queries through
OMERO.biomero or its iframe host. The same OMERO.Analysis APIs, tools, Workspace
metadata, and authorization checks apply in both launch modes.

## Architecture and ownership

```text
OMERO.Analysis browser
        | authenticated OMERO.Analysis API
        v
OMERO query broker
  - OMERO authorization and source resolution
  - attachment staging, cache identity, and provenance
  - SQL validation, parameters, and result policy
        | opaque cache/source identifier, never a caller-supplied path
        v
Disposable hardened DuckDB worker
```

- Keep the transport-neutral query core and OMERO integration in
  OMERO.Analysis. NL-BIOMERO may deploy the worker or broker as a private
  companion service when process separation or independent resource limits are
  preferable.
- Expose the core through the authenticated OMERO.Analysis API in version one.
  An optional MCP adapter may later call the same broker, but must expose the
  same bounded OMERO operations and must not accept arbitrary filesystem paths
  or a generic unrestricted `execute_query` operation.
- Keep authorization, cache resolution, SQL validation, result tokens, and
  audit logging in the broker even when execution runs in a companion service.
  The disposable worker receives only an already-authorized opaque source or
  cache identifier and the validated query request.
- Do not package or deploy executable query services through
  BIOMERO.WorkflowSkills. That catalog distributes portable instructions and
  capability requirements; it does not grant execution or OMERO access.

## Implementation changes

### Server-side query service

- Add a configurable, transport-neutral query broker for `.duckdb`
  FileAnnotations directly attached to the selected Image, Dataset, Plate, or
  Screen. Keep transport adapters separate from the query-policy and execution
  core.
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

These operations form the stable broker contract. The OMERO.Analysis HTTP
routes below are its version-one transport adapter. Any future MCP adapter must
map to these operations rather than exposing the underlying DuckDB connection.

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
- Add an OMERO.Analysis-owned, versioned `query-omero-duckdb` skill that
  explains the tools and remote-source behavior. It supplies guidance only;
  authorization and SQL validation remain server code.
- Document `omero-duckdb-query-v1` as a stable host capability in the
  BIOMERO.WorkflowSkills contract. Update measurement skills to choose the
  remote schema/query tools when this capability and a remote source are
  present, while retaining their existing local read-only DuckDB path for
  downloaded files. These are the only WorkflowSkills-related changes; the
  executable service belongs to OMERO.Analysis and its NL-BIOMERO deployment.
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

## Implementation gates

Implement this plan in the following gated order:

1. Confirm the integrated-data-analysis completion gate and its pinned
   OMERO.Analysis/NL-BIOMERO deployment baseline. Standalone mode must remain in
   the test matrix.
2. Stabilize and test the transport-neutral broker contract, SQL policy,
   disposable worker, cache identity, authorization, and bounded result format.
3. Add the OMERO.Analysis HTTP adapter and make the same remote tools available
   in standalone and embedded Chat.
4. Add query bindings and prefetched CSV results to Methods, Pipelines, and
   Notebooks only after the basic schema/query flow is stable.
5. Document `omero-duckdb-query-v1` in BIOMERO.WorkflowSkills and update
   measurement skills only after the broker/tool contract is versioned and
   stable.
6. Enable the service in NL-BIOMERO only after security, resource-limit,
   authorization, cache, and real-container smoke tests pass.

## Assumptions

- Version one supports DuckDB FileAnnotations only; SQLite remains browser-local and external MySQL is out of scope.
- Remote mode applies only at or above a configurable 500 MiB threshold.
- Query results must be small enough to return completely; users must aggregate or filter larger results.
- This adds an execution path without replacing or removing the current local path.
