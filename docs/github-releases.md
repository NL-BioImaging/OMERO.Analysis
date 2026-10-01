# Tagged wheels and offline deployment

OMERO.Analysis and `omero-analysis-notebook` are distributed through
[GitHub Releases](https://github.com/NL-BioImaging/OMERO.Analysis/releases).
No PyPI token, account, Trusted Publisher, OIDC permission, publishing
environment, GitHub Pages site, or custom Python index is needed. Third-party
dependencies can still use their ordinary upstream package sources.

## Version and release contract

Analysis uses exact final `X.Y.Z` versions. `pyproject.toml`, the tag `vX.Y.Z`,
the GitHub Release tag, the main wheel metadata/filename, the manifest version,
and NL-BIOMERO's `OMERO_ANALYSIS_VERSION=X.Y.Z` must agree. The SDK version is
independent; a release always includes its actual built wheel even if unchanged.

Publishing a GitHub Release runs shared backend/SDK/frontend, plugin/skill,
Chrome, build, wheel, and clean-install validation before attaching:

- `omero_analysis-X.Y.Z-py3-none-any.whl`
- `omero_analysis_notebook-<SDK version>-py3-none-any.whl`
- `manifest.json`, schema `nl.bioimaging.omero-analysis.release.v1`, containing
  the actual wheel names, byte sizes and SHA-256 checksums

The upload job uses only the repository `GITHUB_TOKEN` with job-scoped
`contents: write`. It uploads the manifest after both wheels. Retries accept
existing identical bytes and refuse to overwrite changed assets. Publish a new
version when artifact bytes change. Source archives are not production inputs.

## Prepare and install

From an Analysis checkout (substitute an actual release containing wheel assets):

```console
python scripts/download_analysis_release.py --version 0.15.0 --output dist/wheelhouse
python -m pip install --no-index --no-deps dist/wheelhouse/omero_analysis-0.15.0-py3-none-any.whl
```

The `--no-deps` example requires runtime dependencies to be installed already.
Otherwise prepare their third-party wheels too and install using
`--no-index --find-links dist/wheelhouse`. Do not replace this with a package
name installation from PyPI. The downloader fetches deterministic
`releases/download/vX.Y.Z/` URLs, verifies both archives, metadata, versions,
sizes and hashes before publishing the files into the wheelhouse. Missing
assets, corrupt archives, version mismatches and changed bytes fail explicitly.
It retains a namespaced release manifest beside the wheels. It never uses
`latest`, `main`, a branch archive, or an alternative version as a fallback.

NL-BIOMERO's `web/Dockerfile` prepares `/dist/wheelhouse` in a separate build
stage using its exact environment pin. That stage resolves third-party backend
dependencies from the wheel metadata. The final image copies the wheelhouse,
installs Analysis using `--no-index`, and copies its startup/configuration files
from the installed wheel's `share/omero-analysis` directory. A running container
never fetches release assets. The SDK wheel is available for authors and is not
installed as a web-server dependency. Existing other BIOMERO packages keep their
current deployment sources; their publication migration is a separate task.

The two dependency-free download/verification scripts are vendored into
NL-BIOMERO's `web/release/`. When updating them, copy the maintained scripts from
Analysis, review the diff, and run the release asset tests in both repositories.

## Maintainer process

1. Update Analysis's package version (and the SDK version when its API changes).
2. Commit, test and merge the changes. The release tag must include this new
   workflow, not the old publishing workflow from a historical tag.
3. Create `vX.Y.Z` at that tested commit and publish its GitHub Release.
4. Wait for validation and asset attachment to succeed. Verify both wheels and
   `manifest.json` are present before updating deployments.
5. Set `OMERO_ANALYSIS_VERSION=X.Y.Z` in NL-BIOMERO and rebuild/test only the web
   service as appropriate. Missing releases intentionally stop the build.

During migration the obsolete remote PyPI release workflow was disabled to
prevent old tags from invoking it, and the empty `pypi` environment was removed.
Once the new workflow is on the remote default branch, enable `release.yml`
(`gh workflow enable release.yml`) before publishing a new tag containing it.
Existing source-only releases are not silently repackaged; publish a new release
for changed code. No wheel binaries should be committed to either repository.

## Development

Use a local checkout or pinned Git reference for development, for example
`python -m pip install -e .`. Build the frontend/runtime before building a local
wheel. Source installation is a development path, not a production Docker step.
