# Deploy with omero-deployment-kit

Build and verify the wheel:

```bash
python -m pip install build
python scripts/build_frontend.py
python -m build --wheel
python scripts/verify_wheel.py dist/omero_analysis_chat-*.whl
```

Copy the pinned wheel to `roles/docker/files/` and expose its filename as:

```yaml
omero_analysis_chat_wheel: "omero_analysis_chat-0.2.0-py3-none-any.whl"
```

Add an Ansible copy task that places the wheel in the remote Docker build
context. Apply `deploy/omero-deployment-kit/Dockerfile-web.fragment` before
`omero web syncmedia`, and append
`deploy/omero-deployment-kit/web-config.omero.j2` to the generated OMERO.web
configuration.

No Nginx template changes or storage mounts are required. Data attachments are
authorized and streamed through OMERO.web; Pyodide assets are public,
immutable application files and contain no credentials or source data.
