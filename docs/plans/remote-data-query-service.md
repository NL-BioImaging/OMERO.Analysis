# Remote Data Query Service

## Status

The standalone execution service was implemented first in the independent
public repository
[`NL-BioImaging/OMERO.DataQueryWorker`](https://github.com/NL-BioImaging/OMERO.DataQueryWorker).
Its `v0.1.0` API, security checks, image, and real-container smoke tests have
passed. OMERO.Analysis `v0.12.0` adds the broker, remote-source policy,
Workspace query bindings, and authenticated browser APIs described below.

This delivery order is not an architectural dependency. Later querying must
work in standalone OMERO.Analysis and when Analysis is embedded in BIOMERO,
regardless of `INTEGRATE_DATA_ANALYSIS`.

## Architecture and ownership

```text
OMERO.Analysis browser
        | authenticated OMERO.Analysis API
        v
OMERO.Analysis query broker
  - OMERO session, group, object, and annotation authorization
  - opaque worker source references
  - public result tokens, provenance, and Workspace bindings
        | private authenticated omero-data-query-worker-v1 API
        v
OMERO.DataQueryWorker container
  - immutable DuckDB, SQLite, and CSV source cache
  - SQL validation and typed parameters
  - disposable query subprocesses and resource limits
  - deterministic bounded-result cache
```

- Keep the worker OMERO-agnostic. It receives no OMERO credentials, sessions,
  object IDs, filesystem paths supplied in SQL, or end-user authorization
  decisions.
- Keep the OMERO-aware broker, public browser API, result tokens, Workspace
  bindings, Methods, Pipelines, Notebooks, and Chat tools in OMERO.Analysis.
- Deploy the worker as a private companion container with its own persistent
  cache volume, read-only root filesystem, internal network, dropped
  capabilities, and CPU, memory, and process limits.
- Do not install the worker in the OMERO.web image, route it through
  OMERO.biomero, or distribute it through BIOMERO.WorkflowSkills.

## Standalone worker gate

The first release of OMERO.DataQueryWorker must provide:

- `GET /health/live` and `GET /health/ready` with minimal public responses;
- bearer-authenticated `/v1/capabilities`, source resolve/upload/schema,
  query, result download, and cache-status operations;
- immutable `.duckdb`, `.sqlite`, `.sqlite3`, and single-file `.csv` sources;
- CSV ingestion into one internal DuckDB table named `data`;
- native SQLite read-only/query-only execution without DuckDB's SQLite
  extension;
- one parsed, parameterized `SELECT` or `WITH ... SELECT` statement per query;
- rejection of mutation, multiple statements, `ATTACH`, `COPY`, `PRAGMA`,
  extensions, configuration changes, file functions, and network functions;
- disposable subprocesses with 30-second, 100,000-row, and 64-MiB defaults;
- a 100-GiB/7-day source cache and 10-GiB/24-hour result cache, both atomic,
  configurable, TTL/LRU-managed, and stored on the worker volume;
- deterministic query caching keyed by scope, source and schema digests,
  normalized SQL, typed parameters, policy/engine versions, and limits;
- volatile-query cache bypass and single-flight coalescing of concurrent
  identical deterministic misses; and
- unit, integration, security, and real-container restart-persistence smoke
  tests in the worker repository.

The worker is versioned and released independently as
`ghcr.io/nl-bioimaging/omero-data-query-worker`. Its v1 source IDs and result
IDs are private service identifiers and must never be sent to the browser.

## OMERO.Analysis integration

The integration provides:

- `GET /api/data-query/capabilities/`
- `GET /api/data-source/<annotation_id>/schema/`
- `POST /api/data-source/<annotation_id>/query/`
- `GET /api/data-query-result/<result_token>/download/`

The broker will recheck OMERO readability, current group, direct attachment
membership, selected-object context, session, and short-lived context token on
every schema or query request. It derives opaque worker scope/source
references, resolves or streams the attachment, and maps worker results to
user/session/group/object/annotation-bound tokens that expire after ten
minutes.

Use the versioned `omero-data-query-v1` capability for DuckDB, SQLite, and CSV.
When enabled, newly selected supported attachments of at least the configurable
100-MiB threshold default to **Query on OMERO**. Smaller sources, previously
downloaded files, and explicit **Download locally** selections retain the
current browser-local behavior. A threshold of zero forces every supported
OMERO attachment remote and disables local override. Remote failures never
silently download a source.

Chat may inspect schemas and run bounded queries. Successful results become
browser-local CSV artifacts. Methods, Pipelines, and Notebooks store versioned
query bindings and receive prefetched CSV results before local sandboxed Python
execution. The Notebook runtime remains network-disabled and never calls AI,
skills, or the worker directly.

## Integration security and operations

- OMERO.Analysis streams authorized sources without persisting them on
  ordinary OMERO.web temporary disk; persistent source and result storage
  belongs to the worker volume.
- The broker authenticates to the worker with a deployment secret over the
  private container network. The browser never receives this credential.
- Log request identity, source/query hashes, cache status, duration, rows,
  bytes, and outcome, but never returned cell values.
- Expose worker readiness and aggregate cache usage in Analysis Settings.
- Pin the released worker image digest in NL-BIOMERO on a private internal
  network with a dedicated persistent cache volume.

## Assumptions and exclusions

- The cache volume is trusted plaintext server storage and one worker replica
  owns a volume.
- Query results must fit completely within configured limits; clients must
  aggregate or filter larger results.
- Encryption at rest, shared multi-replica caches, CSV collections, TSV,
  external databases, direct worker-to-OMERO access, and a general-purpose MCP
  query server are outside version one.
- Existing local execution and saved records remain compatible; no browser
  database or archive migration is required for records without remote-query
  fields.
