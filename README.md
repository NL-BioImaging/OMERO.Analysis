# OMERO.AnalysisChat

OMERO.AnalysisChat is an OMERO.web extension for conversational, browser-local
analysis of tabular FileAnnotations and uploaded data. It has no notebook or
JupyterLab interface: the assistant writes visible Python, executes it in an
isolated Pyodide sandbox, and returns bounded tables, plots, and downloadable
results in the chat.

## Privacy and security model

- Source files and Python execution stay in the browser.
- Only prompts, generated code, schemas, bounded previews, statistics, and tool
  output are sent to the configured AmsterdamUMC Azure endpoint.
- Python runs in an opaque-origin sandbox without OMERO cookies, context
  tokens, or the Azure key. Its CSP permits access only to public, self-hosted
  Pyodide runtime files.
- OMERO FileAnnotations require a logged-in session and short-lived context
  bound to the user, session, group, object, and allowed operation.
- Result attachment is never autonomous: the user must confirm it explicitly.
- The API key is persisted unencrypted in the browser profile by product
  choice. The UI warns users and provides a **Forget API key** action.

## Supported data

DuckDB, SQLite, CSV/TSV, JSON, Excel, Parquet, NPY, and NPZ inputs are supported.
The browser runtime includes pinned DuckDB, pandas, PyArrow, python-calamine,
NumPy, and Matplotlib builds. CI Segmentation measurement databases receive
automatic schema-first analysis instructions.

Default limits are 256 MiB per file, 512 MiB per browser workspace, 64 KiB per
tool response, 100 preview rows, 50 preview columns, and 120 seconds per Python
execution.

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
python scripts/verify_wheel.py dist/omero_analysis_chat-*.whl
```

`build_frontend.py` downloads only the pinned Pyodide package closure, verifies
every upstream SHA-256 from `pyodide-lock.json`, builds the frontend, and embeds
both in the wheel. Production does not require Node.js or a public CDN.

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

See [NL-BIOMERO deployment](docs/deployment-nl-biomero.md) and
[omero-deployment-kit deployment](docs/deployment-omero-deployment-kit.md).

## API

All routes are mounted under `/omero_analysis_chat/`:

```text
GET  /?type=<Image|Dataset|Plate|Screen>&id=<id>&data_annotation=<id>
GET  /panel/<type>/<id>/
POST /api/context-token/
GET  /api/context/<type>/<id>/
GET  /api/attachments/<type>/<id>/
GET  /api/attachment/<annotation-id>/download/
POST /api/attachments/<type>/<id>/upload/
```

## License

GNU Affero General Public License v3.0 or later.

