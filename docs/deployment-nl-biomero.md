# Deploy with NL-BIOMERO

Analysis Chat is an OMERO.web wheel with a compiled frontend and self-hosted
Pyodide runtime. It needs no second service, storage mount, or custom Nginx
location.

## Build and layer the plugin

```bash
python -m pip install build
python scripts/build_frontend.py
python -m build --wheel
python scripts/verify_wheel.py dist/omero_analysis_chat-*.whl

docker build \
  --build-arg OMERO_WEB_IMAGE=<current-omeroweb-image> \
  --build-arg ANALYSIS_CHAT_WHEEL=dist/<wheel-file>.whl \
  --file docker/Dockerfile.omeroweb \
  --tag local/nl-biomero-omeroweb-analysis-chat:0.2.2 \
  .
```

For an existing deployment, `<current-omeroweb-image>` must be the current
derived image so JupyterLite, ZarrViewer, and other baked-in plugins remain
installed. `scripts/build-docker-image.ps1` automates this check.

Set the `omeroweb` service image in the selected NL-BIOMERO Compose scenario to
the derived tag and recreate only that service. The existing reverse proxy
continues to route `/omero_analysis_chat/` through OMERO.web.

## Verify

1. Sign in to OMERO.web.
2. Select an Image, Dataset, Plate, or Screen with a supported FileAnnotation.
3. Open the Analysis Chat center panel, select data, and open the chat.
4. Confirm the composer stays disabled until every attachment is downloaded.
5. Configure AmsterdamUMC, run an analysis, download a result, and explicitly
   attach it to the selected object.

For temporary local installation:

```powershell
.\scripts\manage-docker-plugin.ps1 install
.\scripts\manage-docker-plugin.ps1 status
```
