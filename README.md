# OMERO.Analysis

OMERO.Analysis is a browser-local research workspace for OMERO.web. Its one
Analysis shell has three routable tabs:

- **Chat** — AI-assisted analysis with visible, isolated Python execution.
- **Notebook** — run-only Python nbformat-4 notebooks attached to OMERO.
- **Settings** — AI provider configuration and discovered skill provenance.

The Workspace explorer is organized as:

```text
Workspace
├── Input
├── Chat
├── Results
├── Methods
├── Pipelines
└── Notebooks
```

Methods are reusable `.py` analyses. Pipelines are ordered, isolated Method
steps. Notebooks remain read-only: users can run cells or all cells, reset the
kernel, inspect safe outputs, and attach an executed copy, but cannot create or
edit notebooks.

## Privacy and execution

Data and notebook code execute in an opaque, no-network Pyodide sandbox.
Notebook execution never calls the AI provider or loads Agent Skill packages.
Raw notebook HTML and JavaScript are never rendered. Magics, shell commands,
widgets, non-Python kernels, and arbitrary package downloads are rejected.

Chat may load matching measurement-analysis skills from the optional
`biomero-workflow-skills` distribution. Explicit ZarrViewer requests use the
skill published by BIOMERO.ZarrViewer itself. Analysis starts with generic Chat
when either provider is absent.

## OMERO.web integration

The deployment registers:

- one top link: **Analysis** (opens Chat);
- center panel **Analysis Chat**;
- center panel **Analysis Notebook**.

Image, Dataset, Plate, and Screen contexts are supported. Notebook upload
automatically creates and links a FileAnnotation in namespace
`nl.bioimaging.analysis.notebook.v1`.

The standalone `omero-jupyterlite` package is deprecated and is explicitly
removed by the Analysis deployment image and update script. Existing OMERO
FileAnnotations are preserved.

## Clean-break formats

Development-stage Project/Script/Workflow formats are intentionally not
migrated.

- Browser database: `omero-analysis-workspaces`, schema version 1.
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
python -m pip install --no-deps -e .
python -m pip install "Django>=3.2,<6" pytest pytest-django build
python -m pytest

cd frontend
npm ci
npm test
npm run build
```

Build the wheel:

```bash
python -m build --wheel
python scripts/verify_wheel.py dist/omero_analysis-*.whl
```

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
```

All object-bound endpoints require an OMERO login, active group context,
short-lived context capability, and direct FileAnnotation membership checks.
