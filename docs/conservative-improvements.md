# Conservative Analysis and ZarrViewer improvements

Implementation stays in these two repositories. Movies default to 5 FPS and
Chrome is the playback acceptance target. Acquisition timing remains separate.
CellProfiler execution and workflow updates, dashboards, batch execution,
run comparison, library redesign, and reporting remain outside this change.

## Acceptance checklist

- [x] CI/release validation, independent package publishing, Chrome diagnostics
- [x] Validated Method/Pipeline parameters and immutable version contracts
- [x] Schema-gated skills and consistent viewer eligibility
- [x] Conservative GUI cleanup and controller extraction
- [x] Authoring skills, scaffolds, validators, and generic CSV examples
- [x] Bounded projection loading and synchronization work
- [x] MP4 artifact preview, persistence, and notebook display
- [x] Browser-local 5 FPS annotated movie export and cancellation
- [x] Python/frontend suites, distributions, and live Chrome checks

## Publishing

Main and notebook SDK packages have separate validated distribution artifacts.
Both wheels are attached to the same tagged GitHub Release, together with the
SHA-256 manifest. The SDK retains its independent package version. See
[the release guide](github-releases.md); no PyPI credentials are required.

## Verified results (1 October 2026)

- Analysis: 276 frontend tests passed; 258 combined backend/SDK tests passed.
- ZarrViewer: 52 frontend and 53 Python tests passed. TypeScript and builds passed.
- Analysis: 19 Python skips (Windows symlinks and opt-in worker HTTP tests).
  Viewer: one Windows symlink skip. These are not represented as passed tests.
- Runtime smoke and the real Chrome Analysis journey passed.
- Chrome movie acceptance: four frames, 5 FPS, duration 0.8 s, seeking/replay,
  overlapping label alignment, stable track colors/gaps, and odd-size padding.
- Live authorized raw Image 66: direct Viewer export and annotated Notebook MP4
  completed. Movie, poster, and recipe saved automatically to OMERO.
- A fresh browser-storage origin restored the saved workspace and movie bytes
  from OMERO without rerunning the Notebook. Frame stepping and dark/light/narrow
  layouts were checked. Synthetic overlays are explicitly QA, not biological results.
- Source packages were updated in the local OMERO.web deployment. All original
  data/config mounts were retained; the obsolete read-only workspace_access.py
  override was removed because the updated package contains that fix.
- The retained local base image contained unsupported OMERO.biomero 1.5.4-dev;
  runtime restoration uses supported 1.6.1. No other repository source was changed.
- All workflow files passed actionlint. GitHub-hosted runs were not triggered;
  release attachment was initially validated locally. GitHub-hosted validation
  and attachment status are available on the release workflow for v0.15.0.

## Measured projection tradeoff

The deterministic 64-slice / 128 x 128 benchmark reduced peak outstanding reads
from 64 to 1 and the corresponding decoded-slice footprint from 2 MiB to 32 KiB
(excluding accumulator/output buffers). Numerical results were unchanged.
Synthetic timing was 5.13 ms before / 6.83 ms after: sequential loading favors
bounded memory rather than promising lower latency on every source. Run
`node frontend/scripts/benchmark-projections.mjs` from the Viewer repository to
repeat; evidence is written under ignored frontend/test-results.

## Remaining verification limits

Extended cross-user permission revocation, injected container power cuts, and
maximum-size 600-frame exports were not rerun as live cases. Existing regression
coverage and the bounded renderer remain in place; this change does not assert
full production sign-off for those scenarios. Historical acceptance reports are
retained in docs/testing. Deferred dashboards, batch execution, comparison,
library redesign, reporting, and CellProfiler workflow updates were not added.
