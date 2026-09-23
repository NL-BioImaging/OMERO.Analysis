# Shared notebooks and plate templates

The Shared library is available when `IMPORTER_ENABLED=true` **and** the selected
source's importer storage capability is ready. Disabled importer mode hides the
chooser and rejects its endpoints. A requested but unavailable importer displays
the capability error. Imported workspace copies remain usable in either mode.

Open **Libraries** in the Analysis Explorer. The shared-folder library and the
synced `+AnalysisWorkspaces` library are separate collapsible panels. The same
panels appear under **Add reusable analyses (optional)** in the middle pane.
Select shared items, then **Import selected shared items** to create workspace
copies. **Publish to shared library** is inside the shared panel for full admins.

## Storage and visibility

```text
<resolved Group Folder Mapping location>/
  .analysis_notebooks_templates/
    notebooks/       # Python nbformat-4 .ipynb
    templates/       # .xlsx, .xls, UTF-8 .csv
    .catalogue/      # Analysis-managed index, immutable revisions, journal, lock
```

The two content directories are flat. Hidden/temporary files and unsupported
extensions are ignored. Missing folders mean an empty library; first administrator
publication creates them. Files with validation errors appear unavailable with a
reason, without hiding other items. Refresh scans on opening (five-second cache)
or on **Refresh shared library**. No notebook cells execute during discovery,
publication, or import. Notebook outputs, execution counters and widget state are
removed from published/imported revisions; notebook source and markdown may still
contain private information, so review them before publishing.

Groups mapped to the **same resolved location share the same library**. Distinct
locations are isolated. Mapping, source access and fresh group membership are
checked on every request. A mapping change changes library identity; an old
selection cannot be used to read files in another location. Only full OMERO
administrators receive destination paths, sharing-group summaries and publishing
controls. Group owners and restricted administrators are not publishers.

All web hosts must see the same mount at the same resolved path, use the same
Django signing secret, and share a locking-capable filesystem. The web service
account needs write access to `.catalogue` even for discovery of filesystem
publications, and to both content directories for administrator publication.
Use a shared OS group/ACL for filesystem publishers; OMERO roles do not grant OS
permissions. Do not replace or edit `.catalogue` manually. Symlinks and non-regular
files within the library are rejected. On POSIX, reads and replacements pin
directory descriptors and do not follow directory-component symlinks.

## Two publishing routes

1. **Filesystem:** copy into `notebooks/` or `templates/` with the final supported
   extension. Prefer writing a hidden temporary file on the same filesystem,
   flushing it, then atomically renaming it into place. Copy-in-progress or invalid
   files are unavailable; the last valid observed revision remains archived.
2. **OMERO administrator:** open a workspace, then **Reuse analyses and plate
   templates → Shared library → Publish to shared library**. Upload a file or
   choose a workspace notebook or downloaded spreadsheet/CSV input. Review the
   contents, destination and all sharing groups, then confirm publication. Existing
   filenames publish a revision only if the displayed revision and destination
   groups are still current; conflicts return HTTP 409 and require Refresh.

Publication archives the previous revision, journals the intended revision, and
atomically replaces the live file and catalogue under a location-wide lock. An
interrupted publication can be recovered by refreshing. Filesystem writers do not
participate in the web lock: avoid editing a file concurrently with an administrator
publication. Analysis rechecks source bytes immediately before replacement but
cannot provide cross-application compare-and-swap for uncooperative OS writers.

External changes become revisions when observed. History cannot reconstruct
intermediate versions never seen by Analysis. Revision IDs are SHA-256 hashes of
the sanitized notebook or exact template bytes. Output-only notebook changes may
therefore have the same revision. Removing the live file hides its item; existing
workspace copies survive. Deletion and rollback controls are not included.

## Reuse and compatibility

The middle pane's optional reuse section and workspace reuse dialog both provide
**Shared library → Plate templates / Notebooks**. The existing synchronized
workspace library remains available. Select shared templates explicitly; merely
being present in the catalogue never satisfies a notebook input requirement.

Middle-pane selections are offered for import after standalone or embedded launch.
The Analysis-owned browser handoff stores only opaque library/item/revision
references, expires after 15 minutes, and is scoped to user, group, source and target
workspace. Changed selections must be reviewed again. Successful imports clear the
corresponding handoff entries.

Imports create independent copies, preserve library/item/revision/hash provenance,
and skip an already-imported revision. A newer revision is an additional copy with
a unique name, never an automatic update of an analysis. Templates have an explicit
`template-input` role and synchronize even if their filename lacks “template”.
Recovery snapshots reference the synchronized OMERO payload; restoration does not
require the shared original or importer mode. Old filename-based templates continue
to synchronize.

Notebook badges show **Compatible**, **Incompatible**, or **Not checked**. All valid
notebooks are shown and importable by default, including incompatible notebooks;
**Compatible notebooks only** is optional. Checks cover declared formats, required
supporting files, tables/columns/types and allowed runtime package names. Missing
metadata is not treated as a match. Package version constraints remain Not checked
until runtime validation; the chooser does not claim a version it has not verified.
Legacy notebooks remain Not checked. Multiple matching sources require binding
selection; optional inputs do not block compatibility.

Explicit **Check compatibility** inspects local workspace inputs and asks the
existing remote schema service for remote inputs. It does not download a remote
database or run notebook cells. Execution-time binding uses the same schema/format
evaluator. Technical compatibility does not establish scientific suitability.

## API and limits

Authenticated, source-scoped Analysis routes:

- `GET api/shared-library/<type>/<id>/` (add `?refresh=1` to force scanning).
- `POST` to the same route: multipart file, kind, filename, reviewed library ID,
  destination revision and expected current item revision. Full admin and CSRF
  protection are required.
- `GET .../<item-id>/history/` lists observed revisions.
- `GET .../<item-id>/<revision>/download/` retrieves a verified immutable revision.

Items and library locations use opaque IDs, never client-provided server paths.
Existing notebook/upload byte limits apply; at most 1,000 current supported files
are scanned. Workbook structure, ZIP expansion bounds, macro presence, CSV encoding
and portable notebook declarations are validated. This is format validation, not an
antivirus scan; shared content must still come from trusted publishers.
