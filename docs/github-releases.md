# Tagged wheels, PyPI and offline deployment

OMERO.Analysis and `omero-analysis-notebook` have validated wheels on
[GitHub Releases](https://github.com/NL-BioImaging/OMERO.Analysis/releases).
The Analysis application is also available on
[PyPI](https://pypi.org/project/omero-analysis/1.0.0/). Analysis 1.0.0 uses the
identical wheel bytes on both platforms. The SDK is independently versioned;
publishing the application to PyPI does not implicitly publish the SDK.

## Installation

For an ordinary installation, including NL-BIOMERO:

```console
python -m pip install omero-analysis==1.0.0
```

The exact GitHub Release wheel is an alternative:

```console
python -m pip install https://github.com/NL-BioImaging/OMERO.Analysis/releases/download/v1.0.0/omero_analysis-1.0.0-py3-none-any.whl
```

NL-BIOMERO uses normal versioned PyPI installation, matching its other web
plugins. It copies the packaged configuration defaults and applies its opt-in
startup flag. It no longer vendors release-download tools or builds Analysis's
companions from source. The SDK is not a web-server dependency. Running
containers never install or download packages.

## Build and release contract

Analysis uses exact final `X.Y.Z` versions. The package/runtime/frontend/plugin
versions, `vX.Y.Z` tag, wheel filename and metadata, manifest version, and
deployment pin must agree. The SDK has its own independent version.

Publishing a GitHub Release runs the shared backend/SDK/frontend, skills,
Chrome, wheel, clean-install and companion compatibility checks before attaching:

- `omero_analysis-X.Y.Z-py3-none-any.whl`
- `omero_analysis_notebook-<SDK version>-py3-none-any.whl`
- `manifest.json`, schema `nl.bioimaging.omero-analysis.release.v1`, with actual
  wheel names, byte sizes and SHA-256 hashes

The attachment job uses job-scoped `contents: write`. It uploads the manifest
after both wheels, accepts identical retries and refuses changed existing bytes.
Never reuse a published version or filename for a rebuilt, different artifact.
Source archives are not production inputs.

## Publish the existing application wheel to PyPI

1. Complete the [release-readiness checks](release-readiness.md) and publish the
   GitHub Release from the tested source. Wait for validated wheel attachment.
2. Dispatch `.github/workflows/release.yml` on `main` with `version=X.Y.Z`.
   The manual job downloads the existing release, verifies its checksum manifest
   and packaged runtime, and uploads only the application wheel. It never
   rebuilds a released version from the current branch.
3. Use the PyPI Trusted Publisher for repository `NL-BioImaging/OMERO.Analysis`,
   workflow `release.yml`, environment `pypi`. OIDC write permission is scoped
   to that publication job; no API token is stored.
4. Confirm PyPI's filename, size and SHA-256 match the GitHub Release manifest
   before advancing a deployment pin. If upload completion is uncertain,
   inspect PyPI before retrying; existing files are not silently overwritten.
5. Rebuild the deployment image and verify its installed versions and runtime.
   Component CI does not replace acceptance of the exact deployed image.

Analysis 1.0.0 was mirrored without rebuilding its 70,291,637-byte wheel.
Its SHA-256 is `e8265ccf82ed9f2afd5ca0cfff13039fae19936425baa14a3d02602657602ecb`.

## Optional offline preparation

From a source checkout, the maintained download tool can prepare and verify
both wheels for an offline wheelhouse:

```console
python scripts/download_analysis_release.py --version 1.0.0 --output dist/wheelhouse
python -m pip install --no-index --no-deps dist/wheelhouse/omero_analysis-1.0.0-py3-none-any.whl
```

The `--no-deps` example requires runtime dependencies to be installed already.
Otherwise prepare their wheels too and use `--no-index --find-links`. The tool
verifies archive validity, package versions, sizes and hashes before exposing
the artifacts. Missing releases and changed bytes fail without falling back to
another version, branch or index. This optional offline tool belongs to Analysis;
it is not vendored into NL-BIOMERO's normal installation.

For development, use a source checkout, build the frontend/runtime, and then
build or install the package. Production images consume released wheels.
