# Deploy with omero-deployment-kit

Build and verify the wheel:

```bash
python -m pip install build
python scripts/build_frontend.py
python -m build --wheel
python scripts/verify_wheel.py dist/omero_analysis-*.whl
```

Copy the pinned wheel to `roles/docker/files/` and expose its filename as:

```yaml
omero_analysis_wheel: "omero_analysis-0.8.1-py3-none-any.whl"
```

Add an Ansible copy task that places the wheel in the remote Docker build
context. Apply `deploy/omero-deployment-kit/Dockerfile-web.fragment` before
`omero web syncmedia`, and append
`deploy/omero-deployment-kit/web-config.omero.j2` to the generated OMERO.web
configuration.

No Nginx template changes or storage mounts are required. Data attachments are
authorized and streamed through OMERO.web; Pyodide assets are public,
immutable application files and contain no credentials or source data.

## Managed Analysis attachments

Also copy `docker/filter-analysis-attachments.py` into the remote build context as
`filter-analysis-attachments.py`. The Dockerfile fragment applies and verifies it
after installing packages. It excludes known Analysis file namespaces from the
standard OMERO.web existing-attachment chooser, without deleting files or changing
permissions. Run the step after any later OMERO.web pip installation too.
The patch is idempotent and fails on an unexpected upstream exclusion list.
Verify with `python /script/filter-analysis-attachments.py --check` using the web
virtualenv. Roll back by deploying an unpatched image. Prebuilt images must be
rebuilt to include this change; upgrading the Analysis wheel alone is insufficient.
