# OMERO.Analysis

The maintained user manual is available in [docs/MANUAL.md](docs/MANUAL.md)
and through the modeless **Help** window in OMERO.Analysis.
Hardware-specific offline model guidance is available in
[docs/local-llm-recommendations.md](docs/local-llm-recommendations.md).

OMERO.Analysis is a browser-local research workspace for OMERO.web. Its one
Analysis shell has four standard routable tabs and one optional tab:

- **Home** — run saved artifacts or create an input-ready Method, Pipeline, or Notebook, with optional assistant help.
- **Methods** — run reusable Methods and inspect their durable run history and outputs.
- **Pipelines** — create or run ordered Method Pipelines and inspect their durable results.
- **Notebooks** — run-only Python nbformat-4 notebooks attached to OMERO.
- **Assistant** — AI-assisted development and testing of reusable Method scripts.
- **Editor** — optional structured editing for Methods, Pipelines, and Notebooks.

Analysis opens only the current Workspace selected in the OMERO center panel.
The Explorer is rooted at that Workspace and does not expose an OMERO parent
browser or alternate local Workspaces. A startup progress indicator reports
Workspace restoration separately from the lazy browser-Python startup.

The Explorer and Artifact Inspector can be hidden independently from the
header. Their browser-local visibility preference is remembered per user and
group.

The Workspace explorer is organized as:

```text
Workspace
├── Input
├── Methods
│   ├── Assistant
│   │   ├── <conversation>/Attachments
│   │   └── browser-local validation results
│   └── Methods results
├── Pipelines
│   └── Pipelines results
└── Notebooks
    └── Notebooks results
```

Methods are reusable `.py` analyses. Pipelines are ordered, isolated Method
steps. Notebooks remain read-only in the Notebooks tab: **Run** resets the kernel, attaches current
inputs, and executes every cell in order. Users can stop execution, clear
outputs, reattach inputs, and inspect safe outputs. Editing is available only
when **Enable artifact editor** is turned on in Analysis Settings.

## Privacy and execution

Data and notebook code execute in an opaque, no-network Pyodide sandbox.
Notebook execution never calls the AI provider or loads Agent Skill packages.
Raw notebook HTML and JavaScript are never rendered. Magics, shell commands,
widgets, non-Python kernels, and arbitrary package downloads are rejected.

Each Assistant conversation can keep up to ten browser-local TXT, searchable PDF, DOCX, PNG,
JPEG, or WebP attachments (25 MiB each). PDF and DOCX text is extracted in the
offline Python sandbox; images are decoded, stripped of metadata, and resized
in the browser when needed. The configured provider receives only extracted
text or derived image pixels, never original PDF or DOCX bytes. OCR, webpages,
authenticated file URLs, and silent context truncation are not supported.

The Method-authoring Assistant may load matching measurement-analysis skills from the optional
`biomero-workflow-skills` distribution. Explicit ZarrViewer requests use the
skill published by BIOMERO.ZarrViewer itself. Analysis starts with the generic Assistant
when either provider is absent.

## OMERO.web integration

The deployment registers:

- one top link: **Analysis** (opens Home);
- one center panel: **Analysis**.

Image, Dataset, Plate, and Screen contexts are supported, including one
selection-specific Workspace for multiple Images or multiple Plates. Managed
Analysis Workspace, result, settings, and skills objects receive dedicated
resume or information panes instead of generic data-attachment controls.
Notebook upload automatically creates and links a FileAnnotation in namespace
`nl.bioimaging.analysis.notebook.v1`.

The standalone `omero-jupyterlite` package is deprecated and is explicitly
removed by the Analysis deployment image and update script. Existing OMERO
FileAnnotations are preserved.

## AnalysisWorkspaces library

Automatic synchronization creates a private, managed `+AnalysisWorkspaces` Project for
the current user and group, then mirrors the browser Workspace into a Dataset.
Projects, Datasets, imported Images, and source links are discovered through
`nl.bioimaging.analysis.sync.v1` MapAnnotations; an unmarked same-name Project
is never adopted.

Synchronization is automatic and incremental. Local reusable changes are
mirrored to OMERO, while deletion of a managed Workspace Dataset in OMERO
cascades back to the browser on launch, focus, or the periodic remote check.
Only a successfully confirmed deletion removes local data; unsynchronized
Workspaces and temporary connection failures are preserved. Synchronization
does not build or upload a complete Workspace ZIP. PNG outputs from direct
Method, Pipeline, and Notebook runs become real grayscale or RGB OMERO Images;
their other outputs, complete Method history, Pipelines, and validated Python
notebooks are stored as typed FileAnnotations. Source inputs are excluded,
except that ready inputs containing `template` anywhere in their filename are
synchronized under Templates for reuse. Assistant conversations, attachments,
and Assistant validation results always remain browser-local and are never
included in the managed mirror.
Unchanged objects are reused by stable key and SHA-256; managed remote
deletions follow local deletions. Unmanaged Dataset content is never changed.

The **Workspace & OMERO** menu can browse/reuse Methods, Pipelines,
and Notebooks. Imports are independent local
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

Use `--skip-frontend` for a backend-only environment.

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

Build the local OMERO.web image while preserving other baked-in plugins:

```powershell
.\scripts\build-docker-image.ps1
```

BIOMERO.WorkflowSkills is not bundled by default. Include the optional local
provider only when it is wanted and its sibling repository is available:

```powershell
.\scripts\build-docker-image.ps1 -WithWorkflowSkills
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
