# BIOMERO-Integrated Data Analysis

## Summary

Integrate OMERO.Analysis into the BIOMERO user interface behind a deployment
option while retaining the existing standalone launch mode.

Use the following case-insensitive deployment setting:

```env
INTEGRATE_DATA_ANALYSIS=TRUE
```

Values such as `true`, `True`, `TRUE`, and `1` should be accepted.

## Mode Behavior

| Setting | OMERO top menu | BIOMERO navigation | Analysis center panel |
| --- | --- | --- | --- |
| `FALSE` or absent | Analysis is shown and opens a new tab | No Data Analysis button | Opens Analysis in a new tab |
| `TRUE` | Analysis is hidden | Data Analysis is shown beside Import and Analyze | Opens BIOMERO Data Analysis with the current selection |

Both launch modes remain supported, but a deployment exposes only the launch
entry appropriate to its configured mode.

## Architecture

```text
OMERO selection
      |
      +-- Analysis center panel ----------------+
      |                                         |
      +-- BIOMERO > Data Analysis > selector    |
                                                v
                                      OMERO.Analysis iframe
                             Dataset / Screen / Plate / Image /
                             multi-selection / saved Workspace
```

BIOMERO already feature-gates its Import and Analyze navigation and chooses an
application through a `tab` query parameter. Data Analysis should be a third
top-level BIOMERO application rather than a tab inside the existing workflow
Run, Status, and Admin interface.

## OMERO.Analysis Changes

### Embedded launch mode

Add an explicit launch parameter:

```text
/omero_analysis/?embedded=biomero&type=Dataset&id=123
```

Continue using the existing parameters for more specific launches:

```text
type=Plate&id=123
selection_id=123&selection_id=124
data_annotation=752
workspace_annotation=1002
library_item=910
tab=home
```

The current launch contract already supports Dataset, Screen, Plate, Image,
and same-type multi-Image and multi-Plate contexts.

Embedded mode should:

- Retain Home, Methods, Pipelines, Notebooks, Assistant, Editor, Explorer, and
  Inspector.
- Hide only redundant outer branding or header content where appropriate.
- Fill the available BIOMERO content area and avoid nested page scrolling where
  practical.
- Preserve downloads, uploads, dialogs, keyboard shortcuts, Pyodide workers,
  and browser-local storage.
- Support a small `Change source` action supplied by the BIOMERO host.

### Safe iframe support

Both applications run under the same OMERO.web origin. The embedded Analysis
page should therefore:

- Reuse the existing OMERO session and group context.
- Include `frame-ancestors 'self'` in its Content Security Policy.
- Use `X-Frame-Options: SAMEORIGIN`, never `DENY`.
- Continue permitting its internal runtime iframe and Web Worker.
- Never accept a user-provided or arbitrary iframe target URL.

### Conditional top-link registration

OMERO.Analysis should always register:

- The `omero_analysis` Django application.
- The Analysis OMERO center plugin.

It should register the Analysis top link only when
`INTEGRATE_DATA_ANALYSIS` is false.

Update `docker/90-omero-analysis.omero` and
`docker/49-omero-analysis-cleanup.py` so registration is idempotent and removes
only exact OMERO.Analysis entries without affecting unrelated top links or
center plugins.

### Center-panel behavior

When integrated mode is enabled, `Open Analysis` and `Resume ...` in the OMERO
middle pane should navigate to a URL such as:

```text
/omero_biomero/biomero/?tab=data-analysis
    &analysis_type=Screen
    &analysis_id=152
    &analysis_workspace_annotation=1002
```

BIOMERO should copy only supported, explicitly whitelisted launch parameters
to the iframe URL.

When integrated mode is disabled, the middle-pane action should retain the
current behavior and open OMERO.Analysis in a new browser tab.

## OMERO.biomero Changes

### Navigation

Add a third top-level application button:

```text
BIOMERO | Import | Analyze | Data Analysis
```

Use the route:

```text
?tab=data-analysis
```

Refactor the current binary Import/Analyze rendering into an explicit route
switch for Import, Analyze, and Data Analysis.

### Data Analysis host

Create a `DataAnalysisApp` component with two states:

1. Source selection.
2. Embedded OMERO.Analysis.

Do not place it under BIOMERO's workflow Run, Status, and Admin tabs. It is a
sibling application to Import and Analyze.

### Source resolution

Resolve the Analysis source in this order:

1. Explicit context passed by the Analysis middle pane.
2. A supported current OMERO selection passed to BIOMERO.
3. A source chosen with the Data Analysis selector.

Support:

- Dataset.
- Screen.
- Plate.
- One Image.
- Multiple Images.
- Multiple Plates.
- A Dataset inside `+AnalysisWorkspaces`, presented as
  `Resume <workspace>`.
- A Project as a browsing root, requiring the user to select a Dataset.

For an AnalysisWorkspace Dataset:

- Read its synchronized workspace metadata.
- Resolve its original source object.
- Launch Analysis against that source.
- Pass the saved workspace or synchronized workspace identity.
- Skip the source picker when resolution succeeds.

For unsupported selections such as AI Settings, Skills, result images, mixed
object types, or unreadable objects, show concise guidance instead of launching
an invalid workspace.

### Source selector

Reuse BIOMERO's existing OMERO browser state and source-selection components
where practical. The selector should provide:

- `Continue from OMERO selection` when a valid selection is available.
- Datasets, Plates, Images, and Analysis Workspaces sections or tabs.
- Search and filtering.
- A selected-source summary.
- An `Open Data Analysis` button.
- Clear validation for mixed or unreadable selections.

After launch, display a compact host toolbar above the iframe containing:

- Source name and type.
- `Change source`.
- `Reload`.
- Optionally, `Open in new tab`.

Changing the source should warn when Analysis reports unsaved editor changes.

## Configuration Flow

OMERO.biomero should read `INTEGRATE_DATA_ANALYSIS` with the same Boolean parser
used for the existing Importer and Analyzer options.

Expose the following values to its frontend:

```javascript
WEBCLIENT.UI.DATA_ANALYSIS_ENABLED
WEBCLIENT.URLS.DATA_ANALYSIS
```

Also expose an availability check. If integrated mode is enabled but
OMERO.Analysis is not installed or its URL cannot be resolved, show an
actionable configuration error rather than a blank iframe.

## NL-BIOMERO Deployment Changes

Add safe defaults to `.env`:

```env
INTEGRATE_DATA_ANALYSIS=FALSE
OMERO_ANALYSIS_VERSION=<released-version>
```

Pass the integration option to the OMERO.web container in:

- The main Docker Compose file.
- The Docker Hub deployment scenario.
- Development and CI Compose configurations.
- Maintained Helm or environment templates, if applicable.

Update the web image to install a pinned OMERO.Analysis release alongside
OMERO.biomero.

Recommended deployment behavior:

- Install OMERO.Analysis in both modes.
- Let the environment option control navigation and embedding only.
- Do not install Python packages conditionally during container startup.
- Fail image verification when the Analysis URL cannot be resolved.

No first-version changes should be necessary in `biomero`,
`BIOMERO.importer`, BIOMERO.WorkflowSkills, or OMERO.ZarrViewer.

## Host-Iframe Communication

Keep the initial integration small. Pass initial context through the URL and
use a versioned, same-origin `postMessage` bridge only for:

- `ready`.
- `dirty-state-changed`.
- `source-title-changed`.
- `request-open-new-tab`.
- `session-expired`.

Validate both `event.origin` and the message schema. Analysis execution and
workspace state remain owned entirely by OMERO.Analysis.

## Test Plan

### OMERO.Analysis

- Test embedded and standalone routing.
- Verify the same source produces the same workspace identity in both modes.
- Test Dataset, Screen, Plate, Image, multi-Image, and multi-Plate launches.
- Test workspace resume and attachment launch parameters.
- Test CSP, iframe loading, Pyodide, downloads, uploads, and editors.
- Test conditional and idempotent top-link registration.

### OMERO.biomero

- Verify Data Analysis is hidden by default and visible when enabled.
- Verify Import and Analyze remain unaffected.
- Verify explicit middle-pane context skips source selection.
- Verify missing or unsupported context displays the selector.
- Verify an AnalysisWorkspace Dataset resumes its original workspace.
- Verify mixed selections produce guidance.
- Verify missing OMERO.Analysis produces an actionable configuration error.

### Deployment

- Test Boolean values `true`, `True`, `TRUE`, `1`, `false`, and absent.
- Verify standalone and integrated deployment modes.
- Confirm only one Analysis navigation entry is visible in each mode.
- Run browser smoke tests for source selection, iframe launch, workspace resume,
  and Method execution.
- Verify upgrades remove stale top-link registrations.

## Implementation Order

1. Define and test the embedded OMERO.Analysis launch contract.
2. Add conditional Analysis top-link registration.
3. Add BIOMERO's Data Analysis route and source selector.
4. Connect the OMERO middle-pane launcher to the integrated route.
5. Add NL-BIOMERO environment and image wiring.
6. Release OMERO.Analysis, then OMERO.biomero, then update NL-BIOMERO's pinned
   versions.
7. Add deployment and administrator documentation.

This approach preserves standalone OMERO.Analysis while making the integrated
BIOMERO experience native and avoiding duplicated analysis or workspace logic.
