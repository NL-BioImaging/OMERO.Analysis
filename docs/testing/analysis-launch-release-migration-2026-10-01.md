# Analysis launch and GitHub Release migration, 1 October 2026

## Recurring launch failure

Local OMERO.biomero 1.6.1 provides importer storage but does not provide its
Data Analysis host view, template or compiled frontend. Previously
`INTEGRATE_DATA_ANALYSIS=TRUE` alone removed Analysis's top link and redirected
center-panel launches to the BIOMERO landing page, discarding the useful launch.

Analysis now checks the installed view/template/frontend host contract and the
enabled route. Startup checks the same installed contract and configured app.
Unsupported, disabled and partially upgraded hosts retain the standalone link
and direct launch; compatible hosts retain embedded behavior. No BIOMERO source
files are patched. Regression tests cover missing hosts, old frontends, disabled
routes/apps, the flag, and complete host contracts.

The container was rebuilt from the verified 0.15.0 wheel and recreated with
its original data/config mounts. Its installed `share/omero-analysis` startup
file matches `/startup/51-omero-analysis-navigation.py`. OMERO.web reports
RUNNING. Chrome's saved login was used by clicking Login, without reading or
re-entering credentials. After the final recreation, selecting managed Dataset
101 and clicking Resume opens `/omero_analysis/?type=Image&id=66&workspace_id=...`.
The correct source, saved status and existing Notebook are visible. Analysis
also appears in OMERO navigation. The successful workspace tab is left open.

A follow-up check also resumed the existing Dataset 73 / Analysis 2 workspace
from its center-panel button. The original temporal-projection Notebook opened
with its saved Track 98 output (19 observations, frames 5-12), without rerunning
code. The page reports Saved automatically. This verifies an existing Dataset
workspace alongside the earlier Image workspace, and that user content remains
available after the web image update.

## Package distribution

Analysis is prepared as 0.15.0; the separately versioned SDK remains 0.1.0.
Release validation builds both wheels, checks packaged assets and clean
installation, and generates SHA-256/size records from the actual artifacts.
The replacement workflow attaches both wheels and the manifest to the exact
GitHub Release. Upload retries refuse changed existing bytes and publish the
manifest after its wheels. PyPI publishing stages, OIDC permissions, publishing
environments and SDK opt-in preflight were removed.

NL-BIOMERO pins 0.15.0. Its build-preparation stage downloads/verifies the exact
release, resolves ordinary third-party backend dependency wheels, and prepares
the offline wheelhouse. The final image installs Analysis using `--no-index`
and copies startup/configuration files from that wheel. No runtime download or
production Analysis source build is introduced. Other BIOMERO packages keep
their existing sources. The running local image is
`nl-biomero-omeroweb:analysis-github-release-local`, built from local development
wheels while the actual GitHub Release is pending.

## Evidence and remaining release step

- 283 Analysis backend/SDK tests passed; 19 explicit skips (two Windows symlink
  cases and 17 opt-in DataQueryWorker HTTP cases).
- Six NL-BIOMERO HTTP release-download tests passed, including missing release,
  missing wheel, wrong hash/version and corrupt archive failures.
- Final actual application/SDK wheels were served over local HTTP and verified
  by the NL-BIOMERO production helper, including hashes, sizes, archives,
  metadata and packaged assets. Both clean-installed successfully.
- Main wheel frontend/runtime verification, distribution metadata checks,
  positive/negative release-tag checks, plugin validation and actionlint passed.
- NL-BIOMERO Compose validation passed. Vendored verification/download scripts
  match the maintained Analysis sources exactly.
- A real request for the unpublished v0.15.0 manifest fails clearly with HTTP
  404 and no fallback or partial wheelhouse files.
- The unused GitHub `pypi` environment was removed; no publishing secrets were
  present. The old remote release workflow is `disabled_manually` so historical
  tags cannot invoke its obsolete publisher during migration.

At the initial local validation, source changes were not yet committed/pushed
and v0.15.0 was not yet published. The subsequent release must pass the
GitHub-hosted validation and attachment jobs before a production NL-BIOMERO
rebuild can use it. The local checks above remain distinct from GitHub-hosted
release validation. See [the release guide](../github-releases.md).
