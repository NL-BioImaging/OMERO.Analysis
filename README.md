# OMERO.Analysis

OMERO.Analysis is an OMERO.web extension for conversational, browser-local
analysis of tabular FileAnnotations and uploaded data. It has no notebook or
JupyterLab interface: the assistant writes visible Python, executes it in an
isolated Pyodide sandbox, and returns bounded tables, plots, and downloadable
results in the chat.

Version 0.2 introduced object-scoped browser projects with multiple named chats,
shared immutable inputs, chat-specific outputs, versioned reusable Python
scripts, exact-run reuse, and portable `.oa.zip` snapshots. Every project is
autosaved in normalized IndexedDB storage so updating a chat does not rewrite
large file blobs.

Version 0.2.1 added a compact Jupyter-style project explorer with folders,
double-click actions, item menus, and right-click menus. Current chats can be
renamed explicitly, and Python records repeat their collapse, rerun, and
save-as-script controls above and below the code.

Version 0.2.2 moved local project switching into the explorer’s OMERO parent
folder, adds direct snapshot resume from the OMERO middle pane, and supports
combining, copying, and deleting scripts. Copied scripts rebind missing input
filenames to a single compatible input in their destination project and stop
for user guidance when the binding would be ambiguous.

Version 0.5 hardens the local-first boundary and turns reusable scripts into
portable workflows. It adds capability renewal, revisioned serialized storage,
v2 snapshot validation and identity rebinding, a post-boot Python network lock,
separate local/model result envelopes with outbound-payload audits, incremental
input synchronization, lazy package loading, local data profiles, a resizable
artifact inspector, accessible dialogs, streaming chat, OMERO hierarchy
navigation, workflow templates, compatibility preflight, batch execution,
reproducibility reports, and project trash.

Version 0.6 integrates optional BIOMERO ZarrViewer 0.3+ application skills.
For explicit requests such as “show the cell with most foci,” the assistant
queries the browser-local measurement database, uses its canonical OME-Zarr
UUID and field/object coordinates, and asks the browser to validate that
identity against the current OMERO hierarchy. A bounded PNG preview is saved
as a project output and the chat provides a deep link to the complete view.
OMERO IDs, Zarr credentials, and authenticated URLs are resolved locally and
are not exposed to the model.

Version 0.7 adds an input-and-skill-hash evidence ledger, automatically loads
required skill references and application capability contracts, and supports
evidence-backed multi-overlay ROI renders and 2–25 panel galleries through
BIOMERO ZarrViewer 0.4+. A successful render can be saved with one click as a
versioned analysis script, exact render-recipe JSON, PNG, provenance manifest,
and downloadable ZIP. Repeated schema discovery is avoided while inputs and
skills are unchanged; stale evidence is rejected after either changes.

Supported image questions include ranked object galleries; raw/contour/mask
segmentation comparisons; nuclear/cytoplasmic and neighbour relationships;
border, clump, cell–nucleus, and assignment review; blurred, saturated, dim,
unevenly illuminated, debris, and unusual-count field review; well montages;
plate heatmaps; and selected time/Z comparisons. Results are described as
review candidates rather than definitive bad images.

## Privacy and security model

- Source files and Python execution stay in the browser.
- Only prompts, generated code, schemas, bounded previews, statistics, and tool
  output (including bounded Python errors used for automatic repair) are sent
  to the configured AmsterdamUMC Azure endpoint. Complete source files are
  never included in AI requests.
- Python runs in an opaque-origin sandbox without OMERO cookies, context
  tokens, or the Azure key. Runtime assets are loaded from the self-hosted
  package set, after which browser networking APIs are disabled before user or
  model-generated Python can run.
- Python stdout and generated-file contents remain local. Azure receives a
  typed, size-bounded execution envelope; every envelope is inspectable under
  **Data sent to AI**.
- OMERO FileAnnotations require a logged-in session and short-lived context
  bound to the user, session, group, object, and allowed operation.
- Result attachment is never autonomous: the user must confirm it explicitly.
- OMERO-attached inputs are referenced by FileAnnotation ID in project
  snapshots and are never duplicated into the ZIP. Eligible browser uploads,
  generated outputs, chats, and scripts are embedded.
- The API key is session-only by default. Users may explicitly choose
  **Remember this key**; the UI warns that remembered keys are stored
  unencrypted and provides a **Forget API key** action.

## Supported data

DuckDB, SQLite, CSV/TSV, JSON, Excel, Parquet, NPY, and NPZ inputs are supported.
The browser runtime includes pinned DuckDB, pandas, PyArrow, python-calamine,
NumPy, Matplotlib, SciPy, and seaborn builds. CI Segmentation measurement
databases receive automatic schema-first analysis instructions. Recoverable
Python, module, catalog, and SQL errors are returned to the model so it can
correct and rerun its generated code.

The chat shows API-reported input/output token usage for the latest request and
the session total. An optional model context-window value in AI settings adds a
percentage without assuming that every Azure deployment has the same limit.

Default limits are 256 MiB per file, 512 MiB per browser workspace, 64 KiB per
tool response, 100 preview rows, 50 preview columns, and 120 seconds per Python
execution.

Generated PNG/SVG plots can require a same-stem CSV containing their plotted
data. The project header toggle is enabled by default, and a missing CSV is
returned as a recoverable tool error. Python starts each user question with a
clean namespace and output scratch directory; successful identical code on
unchanged inputs reuses its provenance and outputs instead of running again.

## Development

Requirements: Python 3.10–3.12 and Node.js 22.

```bash
python -m pip install --no-deps -e .
python -m pip install "Django>=3.2,<6" pytest pytest-django build
cd frontend
npm ci
npm test
cd ..
python scripts/build_frontend.py --skip-install
python -m pytest
python -m build --wheel
python scripts/verify_wheel.py dist/omero_analysis-*.whl
```

`build_frontend.py` downloads the pinned Pyodide package closure plus the pinned
seaborn wheel, verifies every upstream SHA-256, builds the frontend, and embeds
the complete runtime in the wheel. Production does not require Node.js or a
public CDN.

## Installation

For a temporary installation into one running Compose service:

```powershell
.\scripts\manage-docker-plugin.ps1 install
.\scripts\manage-docker-plugin.ps1 status
```

For a persistent derived OMERO.web image:

```powershell
.\scripts\build-docker-image.ps1
```

When a sibling `OMERO.ZarrViewer` 0.4 wheel is available, the persistent-image
builder includes it in the same offline wheelhouse so the derived image keeps
all base plugins while upgrading Analysis, WorkflowSkills, and ZarrViewer
together. Use `-ZarrViewerWheel` to select an explicit wheel.

See [NL-BIOMERO deployment](docs/deployment-nl-biomero.md) and
[omero-deployment-kit deployment](docs/deployment-omero-deployment-kit.md).

## API

All routes are mounted under `/omero_analysis/`:

```text
GET  /?type=<Image|Dataset|Plate|Screen>&id=<id>&data_annotation=<id>
GET  /panel/<type>/<id>/
POST /api/context-token/
GET  /api/context/<type>/<id>/
GET  /api/attachments/<type>/<id>/
GET  /api/hierarchy/<type>/<id>/
GET  /api/integrations/zarr-viewer/
GET  /api/attachment/<annotation-id>/download/
POST /api/attachments/<type>/<id>/upload/
GET|POST /api/projects/<type>/<id>/snapshots/
GET  /api/project-snapshot/<annotation-id>/download/
GET|POST /api/workflows/<type>/<id>/templates/
GET  /api/workflow-template/<annotation-id>/download/
```

## License

GNU Affero General Public License v3.0 or later.
Workflow-specific AI guidance is discovered dynamically from administrator
configured GitHub workflow revisions. See
[Dynamic BIOMERO workflow skills](docs/workflow-skills.md) for the authoring
contract, automatic activation, provenance, privacy, caching, and deployment.
See [ZarrViewer integration](docs/zarrviewer-integration.md) for image-preview
resolution, database requirements, limits, and troubleshooting.
