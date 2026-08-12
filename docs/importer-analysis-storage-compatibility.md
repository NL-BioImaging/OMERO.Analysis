# BIOMERO importer and `.analysis` storage compatibility

OMERO.Analysis can preserve managed data in the same group-mapped filesystem used by the BIOMERO importer. This is an optional runtime integration: `omero-biomero`, `biomero-importer`, and `omero-upload` are deliberately not mandatory `omero-analysis` package dependencies. If the complete capability is unavailable, OMERO.Analysis retains its existing OMERO Image/FileAnnotation synchronization.

## Ownership and rationale

- **OMERO.biomero owns Group Folder Mapping semantics.** OMERO.Analysis calls its installed mapping functions so mapping precedence, `root`/`.` handling, and future fixes are not independently duplicated.
- **BIOMERO.importer owns ingest-order processing and in-place import.** OMERO.Analysis submits and observes orders but never invokes `createImageFromNumpySeq` in importer-backed mode.
- **OME's `omero-upload` owns symlink-backed OriginalFile registration.** OMERO.Analysis calls `omero_upload.upload_ln_s` only for durable files already written beneath `.analysis`.
- **OMERO.Analysis owns the `.analysis` layout, content hashes, manifests, pending reconciliation, attachment links, deletion, backfill, and Analysis provenance.**

This dependency boundary must be protected by capability checks and integration tests before either dependency version changes.

## Exact runtime APIs

OMERO.Analysis dynamically imports these existing OMERO.biomero APIs:

```python
omero_biomero.utils.get_all_group_mappings(
    config_file_path=None,
    group_mappings_file_path=None,
) -> dict

omero_biomero.utils.get_group_folder_path(
    group_id,
    base_dir=None,
    group_mappings_file_path=None,
) -> str | None
```

`get_all_group_mappings()` must return a mapping keyed by string or integer group ID. The selected value must be an object containing `folder` and `groupName`. OMERO.Analysis requires an explicit active-group entry. It then calls `get_group_folder_path()` with `IMPORT_MOUNT_PATH` as `base_dir`; the result must remain below that mount.

The imported BIOMERO.importer contract is:

```python
biomero_importer.utils.ingest_tracker.initialize_ingest_tracker(config)
biomero_importer.utils.ingest_tracker.log_ingestion_step(order_info, stage)
biomero_importer.utils.ingest_tracker.get_ingest_tracker()
biomero_importer.utils.ingest_tracker.STAGE_NEW_ORDER
biomero_importer.utils.ingest_tracker.STAGE_IMPORTED
biomero_importer.utils.ingest_tracker.STAGE_INGEST_FAILED
biomero_importer.utils.ingest_tracker.IngestionTracking
```

The initializer receives `{"ingest_tracking_db": <INGEST_TRACKING_DB_URL>}`. The environment variable remains authoritative inside BIOMERO.importer. Orders contain `Group`, `Username`, `DestinationID`, `DestinationType`, `UUID`, `Files`, `FileNames`, and `Description`. `Files` contains the absolute `.analysis` PNG path, `DestinationType` is `Dataset`, and `DestinationID` is the managed `+AnalysisWorkspaces` Dataset ID.

OMERO.Analysis opens `get_ingest_tracker().Session()` and queries `IngestionTracking` by `uuid`, ordering by descending `timestamp` and `id`. It uses model fields `uuid`, `stage`, `destination_id`, `destination_type`, `files`, `file_names`, `description`, and `timestamp`. Only `STAGE_IMPORTED` is successful. `STAGE_INGEST_FAILED` is terminal for that attempt, but its journal is retained for explicit retry. Other stages and a missing row are pending. After success, the Image is found through the importer's `UUID` MapAnnotation and target Dataset membership.

PNG orders are submitted in bounded concurrent batches per Workspace. The default is four active imports and administrators can set `omero.web.analysis.import_max_concurrency` or `OMERO_ANALYSIS_IMPORT_MAX_CONCURRENCY` between 1 and 32. OMERO.Analysis journals every submitted order and waits for capacity before submitting another batch; this provides parallel importer throughput without unbounded queue growth.

A non-terminal tracking stage older than `OMERO_ANALYSIS_IMPORT_TIMEOUT_SECONDS` (default 120 seconds, minimum 30) is exposed as a retryable timeout. This also recovers when an importer process finishes but cannot persist its terminal tracking row.

## Supported and validated versions

| Package | Accepted range | Validated version |
| --- | --- | --- |
| OMERO.biomero | `>=1.6,<2` | `1.6.0` |
| BIOMERO.importer | `>=1.4,<2` | `1.4.1` |
| omero-upload | `>=0.4,<0.5` | `0.4.0` |

Version checks use installed distribution metadata followed by symbol and signature checks. Do not broaden these ranges based only on semantic-version expectations.

## Deployment requirements

OMERO.Web, OMERO Server, and BIOMERO.importer must see the identical data volume at the identical `IMPORT_MOUNT_PATH`. OMERO.Web requires:

```text
IMPORTER_ENABLED=true
IMPORT_MOUNT_PATH=/data
INGEST_TRACKING_DB_URL=<SQLAlchemy database URL>
OMERO_BIOMERO_CONFIG_FILE=<readable biomero-config.json path>
OMERO_BIOMERO_GROUP_MAPPINGS_FILE=<readable group-mappings.json path>
```

OMERO.Web must contain compatible installed versions of all optional packages. Its account needs read/write access to each mapped group folder and permission to create `<group-folder>/.analysis`. BIOMERO.importer must share the tracking database and filesystem.

True in-place FileAnnotations additionally require `USE_INPLACE_ATTACHMENTS=true`, `OMERO_DATA_DIR=/OMERO`, the OMERO repository mounted at `/OMERO`, and permission to replace OMERO-created placeholders below `/OMERO/Files`. NL-BIOMERO applies an inheritable ACL for the standard OMERO.Web UID 999 and also supplies the repository group. Deployments with another web UID must set `OMERO_ANALYSIS_INPLACE_UID` accordingly.

The attachment adapter validates and calls `omero_upload.upload_ln_s(client, file_path, omero_data_dir, mimetype)`, then creates an `omero.model.FileAnnotationI` around the returned OriginalFile. A missing, disabled, unsupported, or incompatible integration selects the copied FileAnnotation path and records `storageMode: hybrid`. A runtime registration failure after a ready check aborts synchronization instead of publishing a misleading manifest.

## Capability results and failure behavior

Synchronization status exposes `storage.mode`, `storage.ready`, dependency versions, `mappedRoot`, `groupName`, `detail`, and one stable `failureCode`:

| Failure code | Meaning |
| --- | --- |
| `ready` | All checks passed; importer-backed mode is active. |
| `importer_disabled` | `IMPORTER_ENABLED` is false or absent. |
| `mount_missing` | `IMPORT_MOUNT_PATH` is absent or not a directory. |
| `mount_not_writable` | The shared mount is not writable. |
| `tracking_db_missing` | `INGEST_TRACKING_DB_URL` is absent. |
| `dependency_missing` | One or both optional packages are not installed. |
| `dependency_version_unsupported` | An installed version is outside its accepted range. |
| `dependency_api_incompatible` | A required symbol, signature, or constant is incompatible. |
| `group_required` | No active OMERO group was provided. |
| `group_mapping_missing` | The active group has no explicit mapping. |
| `group_mapping_unsafe` | Mapping resolution escaped the shared mount or was invalid. |
| `mapped_root_not_writable` | The selected mapped group folder is absent or not writable. |
| `tracking_db_unavailable` | Tracker initialization, connectivity, or model query failed. |
| `analysis_root_not_writable` | `.analysis` cannot be created and atomically written safely. |

Any failed initial capability check selects legacy synchronization. Once a save starts in ready importer-backed mode, a submit, import, lookup, or reconciliation problem remains visibly `pending` or `failed`; PNGs do not silently fall back to gateway-created Images. Journals under `.analysis/users/<user-id>/pending` survive browser and OMERO.Web restarts.

## Storage, deletion, and backfill

```text
<group-folder>/.analysis/users/<omero-user-id>/
├── blobs/sha256/<prefix>/<digest>/<filename>
├── workspaces/<workspace-id>/manifest.json
├── settings/manifest.json
└── pending/<order-uuid>.json
```

Blobs and manifests use same-directory temporary files, `fsync`, and atomic rename. Names, hashes, containment, and symlinks are validated. Workspace outputs, Methods, Pipelines, Notebooks, templates, snapshots, encrypted settings bytes, and user skills are durable blobs. Encryption occurs before settings bytes reach `.analysis`. New PNGs are importer-backed Images. Other managed files retain their FileAnnotations, but their OriginalFiles are symlink-backed by the durable `.analysis` blob when `omero-upload` is ready (`storageMode: inplace-annotation`). CSV/SVG FileAnnotations are linked after PNG reconciliation. Missing or disabled support retains a durable blob plus a copied FileAnnotation (`storageMode: hybrid`). In-place source blobs must not be removed while their FileAnnotations exist.

Confirmed managed deletion removes its manifest and garbage-collects a blob only when no workspace, settings, or pending manifest references it. Deletion is constrained to `.analysis/users/<user-id>`.

Existing content can be inspected or migrated idempotently:

```bash
python manage.py backfill_analysis_storage --dry-run --group-id 7
python manage.py backfill_analysis_storage --apply --group-id 7 \
  --checkpoint /data/backfill-checkpoint.json \
  --report /data/backfill-report.json
```

Optional `--user-id` and `--workspace-id` filters are supported. Authenticate as the target user with `OMERO_USER`/`OMERO_PASSWORD` (or `ROOTPASS`). FileAnnotations are copied byte-for-byte. Existing Images are exported to lossless PNG archives marked `legacy-omero` and `archive-derived`; their Images and OMERO IDs are not replaced. Repeating the command safely deduplicates blobs and atomically replaces manifests.

## Required integration-test matrix and upgrades

Before changing either dependency version, run the following against both the currently validated pair and proposed pair:

1. Mapping precedence/path contracts, string/integer IDs, `root`/`.` mappings, missing mappings, and containment.
2. Exact order fields, deterministic UUIDs, duplicate behavior, latest-event ordering, all stages, and importer UUID annotations.
3. Traversal/symlinks, unsafe names, interrupted writes, hashes, deduplication, scope, manifests, and reference-counted deletion.
4. Pending, success, failed, timeout, retry, restart, missing/wrong-Dataset Images, and multiple plots.
5. Importer-backed PNG filesets sourced from `.analysis`; correct CSV/SVG Image links; symlink-backed attachment OriginalFiles; and readable hybrid fallback attachments.
6. Encrypted settings, skills, Methods, Pipelines, Notebooks, templates, and snapshots restore unchanged.
7. Backfill dry-run/apply/checkpoint/resume/repeat/filters, byte equality, and archival without Image-ID changes.
8. Complete backend/frontend tests and a Docker scenario with OMERO.biomero `1.6.0` and BIOMERO.importer `1.4.1` (or the proposed pair).

Upgrade procedure: install the proposed versions in an integration stack, run this matrix first, inspect capability results and manifests, and only then update the accepted range and validated-version table in the same reviewed change.
