# Deploy with NL-BIOMERO

Analysis is an OMERO.web wheel with a compiled frontend and self-hosted
Pyodide runtime. It needs no second service, storage mount, or custom Nginx
location.

## Build and layer the plugin

```bash
python -m pip install build
python scripts/build_frontend.py
python -m build --wheel
python scripts/verify_wheel.py dist/omero_analysis-*.whl

docker build \
  --build-arg OMERO_WEB_IMAGE=<current-omeroweb-image> \
  --build-arg ANALYSIS_WHEEL=dist/<wheel-file>.whl \
  --file docker/Dockerfile.omeroweb \
  --tag local/nl-biomero-omeroweb-analysis:0.9.0 \
  .
```

For an existing deployment, `<current-omeroweb-image>` must be the current
derived image so ZarrViewer and unrelated baked-in plugins remain installed.
The Analysis layer deliberately removes OMERO.JupyterLite, its configuration,
and its static assets. `scripts/build-docker-image.ps1` automates the base-image
check.

The image excludes BIOMERO.WorkflowSkills by default. Add
`-WithWorkflowSkills` to `scripts/build-docker-image.ps1` only when the optional
local provider should be bundled. The ordinary `manage-docker-plugin.ps1`
install/update flow leaves any independently installed provider unchanged.

Set the `omeroweb` service image in the selected NL-BIOMERO Compose scenario to
the derived tag and recreate only that service. The existing reverse proxy
continues to route `/omero_analysis/` through OMERO.web.

## Verify

1. Sign in to OMERO.web.
2. Confirm the top navigation contains one **Analysis** link and no
   **JupyterLab** link.
3. Select an Image, Dataset, Plate, or Screen and confirm the center panel
   contains one **Analysis** entry, with no separate Chat, Notebook, or
   Jupyter entry.
4. Open Analysis, select data, and confirm the Home landing page appears.
5. Open Assistant and confirm the composer stays disabled until every
   attachment is downloaded.
6. Open Notebooks, upload a Python nbformat-4 notebook, and confirm it is
   attached before the run-only tab opens.
7. Confirm Settings lists the optional BIOMERO measurement provider and
   ZarrViewer provider independently when installed.

For temporary local installation:

```powershell
.\scripts\manage-docker-plugin.ps1 install
.\scripts\manage-docker-plugin.ps1 status
```
