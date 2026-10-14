# Preparing OMERO.Analysis 1.0

The release combines the Analysis wheel, its independent notebook SDK, browser
runtime and an explicitly tested set of optional integrations. Passing unit
tests is necessary, but does not establish that a deployment contains the
reviewed frontend, provider capabilities or configuration.

## Integration baseline

The integration baseline was refreshed on 14 October 2026:

| Component | Reviewed source | Responsibility |
| --- | --- | --- |
| OMERO.Analysis | Released `1.0.0` plus compatibility CI updates | Workspace, notebooks, query broker, synchronization |
| OMERO.biomero | `analysis_integration`, `33fe5d728e57638c3ea72e389074f0b3cfe51ce6` | Current BIOMERO backend, authenticated host and source/workspace routing |
| NL-BIOMERO | Updated `analysis_integration`; exact host commit and first-party dependency pins | Verified wheels, private worker, shared mounts and proxy configuration |
| BIOMERO.ZarrViewer | `analysis_skills`, release `v0.7.1` (`c9a5149`) | Result identity, image/label rendering and application skill |
| OMERO.DataQueryWorker | `v0.2.2`, `adfea48b7309fe30cc46815b49e274a7835b0c3f` | Bounded read-only DuckDB, SQLite and CSV queries |
| BIOMERO.WorkflowSkills | Released `0.4.0` | Validated workflow-owned skill catalog and stateless package retrieval |

An integration branch being current does not imply its changes are in the
default branch or in a published package. The updated NL-BIOMERO source builds
the exact reconciled host commit, replacing the older 1.6.1 deployment patch.
Its first-party backend pins are BIOMERO 2.9.0b11 and importer 1.5.0b8.
Stock BIOMERO without that host contract retains the standalone Analysis link.
The viewer's base minimum version does not guarantee review/movie capabilities
or the large shallow-manifest and result-identity fixes.

## Changes from this review

- Persist remote measurement input references in browser storage. Previously a
  reopened workspace could lose a selected remote database even though its
  notebook and results survived. Recover older notebooks' saved attachment
  bindings only through the current source's authorized attachment listing.
- Update the ZIP reader and test dependencies that failed GitHub's security
  gate. Keep the gate enabled; do not bypass it to publish.
- Require the pinned worker HTTP compatibility matrix, packaged viewer contract
  and packaged BIOMERO host contract in CI and before release-asset attachment.
- Check runtime, frontend, lockfile and Agent Plugin versions against package
  metadata before builds, as well as checking the final release tag.
- Update the manual and skills for whole-notebook editing, filename discovery,
  parameter/input-specific results, recoverable superseded output, per-figure
  companions and shallow result identity.

## Repeatable validation

Run the ordinary backend/SDK and frontend suites, type checking, dependency
audit, offline runtime smoke, skill/plugin validation, frontend build, wheel
verification and clean installation. CI also executes the Chrome smoke tests.

With the worker installed in an adjacent checkout, run:

```sh
DQW_RUN_INTEGRATION=1 python -m pytest tests/test_worker_contract.py
BIOMERO_RUN_INTEGRATION=1 python -m pytest tests/test_installed_biomero.py
python -m pytest tests/test_installed_viewer.py
WORKFLOW_SKILLS_RUN_INTEGRATION=1 python -m pytest tests/test_installed_workflow_skills.py
python scripts/check_release_version.py --source-only
```

WorkflowSkills compatibility uses the real released provider with an offline
repository fixture, exercising catalog v2, capability metadata, package URLs
and stateless package retrieval through the Analysis HTTP adapters. It is a
required release-attachment job alongside the worker, host and viewer checks.

The host check requires an installed compatible BIOMERO wheel, including its
compiled assets. `DQW_REPO` and `DQW_PYTHON` select another worker checkout and
interpreter. Run filesystem tests on Linux as well as Windows: inability to
create symlinks is a skipped test, not evidence that link handling works.

Test these workflows in the deployment using its real authenticated browser:

1. Launch from the OMERO center panel and BIOMERO Data Analysis; resume a
   managed Workspace and verify the original source and active group.
2. Run a notebook with a remote measurement database and a supporting template.
   Reload it without attachment query parameters and run it again.
3. Verify rendered scientific figures, ZarrViewer PNG/SVG exports, automatic
   saving and zero pending imports. Check figure-specific SVG/CSV links and
   the absence of duplicate plot attachments on the Dataset.
4. Repeat equal parameters, change one parameter and repeat, and test failure
   and Stop. Preserve previous successful sets and different-input sets.
5. Exercise Methods, Pipelines, editor saves, input rebinding, snapshot recovery
   and capability absence. Test the optional Assistant with synthetic inputs
   and a test provider; do not use private data or a paid profile implicitly.

Keep dated test results separate from product documentation. Historical
permission, recovery and power-cut evidence under `docs/testing` records its
own version pair; it is not a new test of the candidate. Before production
sign-off, repeat authorization revocation, fresh-browser recovery and
interrupted synchronization on a disposable OMERO stack. Do not revoke users
or interrupt imports on a shared scientific-data instance for an acceptance test.

## Publication gate

The approved release candidate uses Analysis `1.0.0` and notebook SDK `0.2.0`.
Publish only after the final candidate's GitHub checks and deployment smoke
pass and remaining verification limits have been reviewed. The additional
production acceptance cases above remain explicit deployment responsibilities.

1. Freeze tested companion commits and select published provider versions (or
   an explicitly supported integration image) containing the required fixes.
2. Set the Analysis package/runtime/frontend/lockfile/plugin to `1.0.0`. Assign
   a new SDK version because its code has changed since the released `0.1.0`.
   Review the development-status classifier at the same time.
3. Build clean wheels and a new manifest; verify the installed files and all
   offline assets. Never overwrite a published version with changed bytes.
4. Publish the tag/release only after approval. Wait for validated wheel assets.
5. Advance the deployment pin, build the exact image, verify its digest and
   installed versions, then repeat the browser checks. Container-local patches
   alone are not a reproducible release or a completed deployment upgrade.
