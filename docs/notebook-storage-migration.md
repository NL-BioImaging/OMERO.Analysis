# Notebook-only storage migration (version 3)

Retirement is an explicit administrator maintenance operation. Application startup
does not delete OMERO objects. Complete acceptance in a separate workspace before
applying cleanup to originals. Keep user activity stopped during maintenance;
the command takes per-owner synchronization locks and rejects changed targets.

## Inventory and backup

Use the installed Django environment and its normal OMERO configuration. Supply
the administrator password through the protected process environment
`OMERO_PASSWORD` (or existing `ROOTPASS`), never on the command line.

```console
python manage.py retire_analysis_content --dry-run --backup-dir /private/analysis-backup-review
```

Every run requires a new backup directory. The inventory identifies affected
FileAnnotations by managed namespaces or explicit retired-kind manifest references,
and backs up annotation bytes, hashes, sizes, owner/group identities, links,
managed parent metadata, and affected durable indexes/browsing copies. Signed
OMERO-backed journals are authenticated and inventoried too. The JSON inventory
is marked complete only after backup creation succeeds. Copy it and every content
file to durable storage outside the web container; verify the SHA256 and sizes.

For isolated acceptance, add `--dataset-id <test-workspace-dataset>`. Shared
annotations linked elsewhere are excluded. Project-linked signed journals qualify
only when their authenticated payload identifies that Dataset.

## Apply and verify

```console
python manage.py retire_analysis_content --apply --backup-dir /private/analysis-backup-apply
```

Apply creates a fresh backup, verifies every backup and live target before changing
anything, and runs under the affected owners' group-scoped maintenance sessions.
It rewrites snapshots and synchronization manifests before deleting retired
Methods, Pipelines, assistant/settings/custom-skill records. Stable FileAnnotation
IDs are retained for rewritten snapshots and manifests; file IDs/hashes in retained
references are updated. Notebooks, inputs, plate templates, unrelated objects, and
legacy-origin result files are preserved, including results beneath `Methods/Results`.
No object qualifies for deletion by its name alone. A marked settings container is
deleted only when its checked contents are exclusively managed and obsolete.

Current clients reject retired writes and sanitize imported legacy snapshots.
Published storage views filter retired items even when recovering an old journal.
The browser version-3 upgrade backs up affected records in the same transaction
before clearing them; a failed upgrade aborts without discarding the version-2 data.
Older clients cannot reopen the upgraded database to recreate retired records.

After completion, review `applied.json`, reopen representative notebooks/results
under their owners/groups, and run a new dry-run/apply against a new directory.
The second pass must be a no-op. Never reuse or overwrite an earlier backup.

## Recovery and limits

Keep a normal OMERO database and managed-file-store snapshot before all-user
maintenance for a complete rollback with original object IDs. The command's
content backup is an additional targeted recovery record, not a replacement for
that deployment backup. If apply stops partway, preserve its inventory and logs;
do not restore old manifests over newer user edits. Inventory again before retrying.

Immutable storage blobs are retained because they can still back in-place OMERO
OriginalFiles. Cleanup updates/removes live indexes and browsing copies; it does
not garbage-collect the shared blob store. Preserve needed backups under restricted
access because historical settings and conversations can contain private data.

Reverting the web image restores application code only. Data rollback requires
the deployment snapshot or a reviewed owner/group-preserving restoration from
the targeted backup, including remapping references if annotations are recreated.
