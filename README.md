# OMERO.Analysis

The maintained user manual is available in [docs/MANUAL.md](docs/MANUAL.md)
and through the modeless **Help** window in OMERO.Analysis.

OMERO.Analysis is a browser-local research workspace for OMERO.web. Its one
Analysis shell has four standard routable tabs and one optional tab:

- **Home** — choose whether to run a Method, Pipeline, or Notebook, or create a Method with Chat.
- **Methods & Pipelines** — run reusable analyses and inspect durable run history and outputs.
- **Notebook** — run-only Python nbformat-4 notebooks attached to OMERO.
- **Chat** — AI-assisted development and testing of reusable Method scripts.
- **Editor** — optional structured editing for Methods, Pipelines, and Notebooks.

The Workspace explorer is organized as:

```text
Workspace
├── Input
├── Chat
│   ├── <chat>/Attachments
│   └── Chat results
├── Methods
│   └── Methods results
├── Pipelines
│   └── Pipelines results
└── Notebooks
    └── Notebooks results
```

Methods are reusable `.py` analyses. Pipelines are ordered, isolated Method
steps. Notebooks remain read-only in the Notebook tab: **Run** resets the kernel, attaches current
inputs, and executes every cell in order. Users can stop execution, clear
outputs, reattach inputs, and inspect safe outputs. Editing is available only
when **Enable artifact editor** is turned on in Analysis Settings.

## Privacy and execution

Data and notebook code execute in an opaque, no-network Pyodide sandbox.
Notebook execution never calls the AI provider or loads Agent Skill packages.
Raw notebook HTML and JavaScript are never rendered. Magics, shell commands,
widgets, non-Python kernels, and arbitrary package downloads are rejected.

Each Chat can keep up to ten browser-local TXT, searchable PDF, DOCX, PNG,
JPEG, or WebP attachments (25 MiB each). PDF and DOCX text is extracted in the
offline Python sandbox; images are decoded, stripped of metadata, and resized
in the browser when needed. The configured provider receives only extracted
text or derived image pixels, never original PDF or DOCX bytes. OCR, webpages,
authenticated file URLs, and silent context truncation are not supported.

The Method-authoring Chat may load matching measurement-analysis skills from the optional
`biomero-workflow-skills` distribution. Explicit ZarrViewer requests use the
skill published by BIOMERO.ZarrViewer itself. Analysis starts with generic Chat
when either provider is absent.

## OMERO.web integration

The deployment registers:

- one top link: **Analysis** (opens Home);
- one center panel: **Analysis**.

Image, Dataset, Plate, and Screen contexts are supported. Notebook upload
automatically creates and links a FileAnnotation in namespace
`nl.bioimaging.analysis.notebook.v1`.

The standalone `omero-jupyterlite` package is deprecated and is explicitly
removed by the Analysis deployment image and update script. Existing OMERO
FileAnnotations are preserved.

## AnalysisWorkspaces library

**Sync to OMERO** creates a private, managed `+AnalysisWorkspaces` Project for
the current user and group, then mirrors the browser Workspace into a Dataset.
Projects, Datasets, imported Images, and source links are discovered through
`nl.bioimaging.analysis.sync.v1` MapAnnotations; an unmarked same-name Project
is never adopted.

Synchronization is explicit, one-way, and last-writer-wins. PNG results become
real grayscale or RGB OMERO Images. Other results, Chats, complete Method
history, Pipelines, and validated Python notebooks are stored as typed
FileAnnotations. Source inputs are excluded, except that ready inputs containing
`template` anywhere in their filename are synchronized under Templates for reuse.
With the default-on **Sync AnalysisWorkspace** preference, the Dataset also
contains one managed restore snapshot that is replaced by later syncs. A browser
with no local Workspace automatically restores the newest matching snapshot.
Chat attachment originals are excluded by default. The global Analysis
Settings option **Sync chat attachments to OMERO AnalysisWorkspaces** includes
them as Dataset FileAnnotations during explicit synchronization; disabling it
again removes only those managed attachment annotations on the next sync.
Unchanged objects are reused by stable key and SHA-256; managed remote
deletions follow local deletions. Unmanaged Dataset content is never changed.

The **Workspace & OMERO** menu can synchronize, browse/reuse Methods, Pipelines,
and Notebooks, or remove the managed mirror. Imports are independent local
copies carrying library provenance. Pipeline imports also copy their exact
Method-version dependencies. Imported notebooks select ready local inputs and
open without running.

Default synchronization limits can be overridden with OMERO.web settings:

- `omero.web.analysis.max_sync_items`: 10,000
- `omero.web.analysis.max_upload_bytes`: 256 MiB per item
- `omero.web.analysis.max_sync_changed_bytes`: 512 MiB per synchronization
- `omero.web.analysis.max_png_pixels`: 100 megapixels

The default attachment download transport limit is 2 GiB. Analysis also checks
the browser Workspace ceiling and available storage before downloading; the
server limit does not guarantee that a browser can safely hold the file.

## Clean-break formats

Development-stage Project/Script/Workflow formats are intentionally not
migrated.

- Browser database: `omero-analysis-workspaces`, schema version 2.
- Workspace snapshot:
  - namespace/format `nl.bioimaging.analysis.workspace.v1`;
  - filename `*.oa-workspace.zip`;
  - root manifest `workspace.json`.
- Pipeline template:
  - namespace/format `nl.bioimaging.analysis.pipeline.v1`;
  - filename `*.oa-pipeline.json`.

Old `.oa.zip`, `.oac.zip`, `.oa-workflow.json`, legacy manifests, and old
browser databases are not read or deleted automatically.

## Development

```bash
python scripts/bootstrap_dev.py
python -m pytest

cd frontend
npm ci
npm test
npm run build
npm run smoke:browser
```

The bootstrap removes obsolete editable `omero-analysis-chat` and
`omero-jupyterlite` installations before installing this package and its test
dependencies. Use `--skip-frontend` for a backend-only environment.

Build the wheel:

```bash
python scripts/build_frontend.py --skip-install
python -m build --wheel --no-isolation
python scripts/verify_wheel.py dist/omero_analysis-*.whl
```

Run the authenticated deployment smoke against an installed OMERO.web:

```bash
python scripts/smoke_omero_deployment.py https://omero.example \
  --cookie "sessionid=..."
```

The same smoke can be run manually in CI with the `OMERO_SMOKE_URL` repository
variable and `OMERO_SMOKE_COOKIE` secret. It verifies the real container rather
than a mocked Django process.

Build the local OMERO.web image, preserving other baked-in plugins while
updating Analysis, BIOMERO.ZarrViewer, and the optional measurement provider:

```powershell
.\scripts\build-docker-image.ps1
```

## API

```text
POST /omero_analysis/api/context-token/
GET  /omero_analysis/api/context/<object_type>/<object_id>/
GET  /omero_analysis/api/attachments/<object_type>/<object_id>/
GET  /omero_analysis/api/attachment/<annotation_id>/download/
POST /omero_analysis/api/attachments/<object_type>/<object_id>/upload/

GET|POST /omero_analysis/api/workspaces/<object_type>/<object_id>/snapshots/
GET      /omero_analysis/api/workspace-snapshot/<annotation_id>/download/
GET|POST /omero_analysis/api/pipelines/<object_type>/<object_id>/templates/
GET      /omero_analysis/api/pipeline-template/<annotation_id>/download/

GET  /omero_analysis/api/notebook/<annotation_id>/download/
POST /omero_analysis/api/notebooks/<object_type>/<object_id>/upload/

GET    /omero_analysis/api/workspace-sync/<object_type>/<object_id>/<workspace_id>/
POST   /omero_analysis/api/workspace-sync/<object_type>/<object_id>/<workspace_id>/plan/
POST   /omero_analysis/api/workspace-sync/<object_type>/<object_id>/<workspace_id>/apply/
DELETE /omero_analysis/api/workspace-sync/<object_type>/<object_id>/<workspace_id>/remove/
GET    /omero_analysis/api/workspace-library/<object_type>/<object_id>/
GET    /omero_analysis/api/workspace-library/item/<annotation_id>/download/
```

All object-bound endpoints require an OMERO login, active group context,
short-lived context capability, and direct FileAnnotation membership checks.
