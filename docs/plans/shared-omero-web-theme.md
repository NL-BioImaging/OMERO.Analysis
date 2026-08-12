# Shared BIOMERO and OMERO.web Theme

## Status

Proposed for review with the BIOMERO developer. Do not implement or merge the
NL-BIOMERO portion on `master`. Develop and test all NL-BIOMERO deployment
changes on the `analysis_integration` branch until the integration is approved.

The goal is to make the existing BIOMERO light/dark preference control the
surrounding OMERO.web client as well. The single global toggle should appear in
the OMERO.web header immediately to the right of the search form and before the
user dropdown.

## Decisions

- Own the reusable theme implementation in `OMERO.biomero`, because it already
  owns the BIOMERO theme state and is installed as an OMERO.web application.
- Use NL-BIOMERO only to pin and enable the released `OMERO.biomero` integration.
- Keep NL-BIOMERO deployment changes exclusively on `analysis_integration` for
  this phase.
- Do not put the theme controller or stylesheet in
  `web/local_omeroweb_edits`. That directory should remain limited to
  deployment-specific branding and image overrides.
- Do not copy or replace OMERO.web's `base.html` or `base_container.html`.
  Inject the integration through the supported
  `omero.web.base_include_template` setting to reduce upgrade coupling.
- Keep `biomero.ui.theme` as the canonical browser-local preference key.
- Keep OMERO.Analysis responsible only for rendering its own light/dark theme;
  it must consume the shared preference when embedded but must not own the
  OMERO.web header.

If a theme independent of BIOMERO is required later, extract the same assets
into a dedicated OMERO.web theme application. That is outside this first
delivery.

## Ownership and architecture

```text
OMERO.web page
  `-- omero_biomero/theme_include.html
        |-- omero-theme.css: OMERO.web light/dark tokens and overrides
        `-- omero-theme.js: preference, header button, events and frames
                 |
                 +-- BIOMERO React app
                 `-- embedded OMERO.Analysis iframe
```

### OMERO.biomero

Add packaged, source-controlled assets similar to:

```text
omero_biomero/
  templates/omero_biomero/theme_include.html
  static/omero_biomero/theme/omero-theme.css
  static/omero_biomero/theme/omero-theme.js
```

Update `omero_biomero/omero-biomero.omero` or its setup process to set:

```text
omero.web.base_include_template = omero_biomero/theme_include.html
```

`base_include_template` is a singleton setting. Installation must detect an
existing value. It must either use a documented aggregate include owned by the
deployment or stop with a clear conflict; it must not silently replace another
application's include.

### NL-BIOMERO

On `analysis_integration` only:

- pin the first `OMERO.biomero` release that contains the shared theme;
- keep using `omero-biomero-setup` to install its configuration;
- verify that static collection includes the new CSS and JavaScript;
- add an image/container smoke test for the include setting and assets; and
- document that `local_omeroweb_edits` is not the source of the theme.

Do not add a copied OMERO.web base template to NL-BIOMERO. This avoids tying the
deployment to the DOM and template contents of one OMERO.web patch release.

### OMERO.Analysis

Retain the current internal toggle for standalone Analysis pages that do not
show the OMERO.web header. When embedded in BIOMERO, continue hiding that
toggle and consume the host theme.

Extend the existing embedded theme bridge only as needed so a change made by
the global header reaches an already-open Analysis iframe. Preserve the current
same-origin and message-schema validation.

## Theme controller contract

Use a small framework-independent controller in `omero-theme.js`.

1. Read `localStorage["biomero.ui.theme"]` during initialization.
2. Accept only `light` and `dark`. Default to light to preserve current
   behavior. A later change may use `prefers-color-scheme` when no preference
   exists.
3. Apply `data-biomero-theme="light|dark"` to `document.documentElement` and
   `document.body`. Set `color-scheme` consistently.
4. Insert the toggle after OMERO.web's `#search` form. If the form is absent,
   do not insert a floating or misplaced control.
5. Make insertion idempotent so partial page updates or repeated execution do
   not create duplicate buttons.
6. Persist changes to the canonical key.
7. Dispatch a same-document `biomero-theme-changed` custom event.
8. Listen for `storage` events so other same-origin tabs and frames update.
9. Notify supported embedded frames through the existing versioned
   OMERO.Analysis host-message contract. Never use a wildcard postMessage
   origin.

The button must have:

- a stable DOM ID or data attribute for tests;
- a visible sun/moon icon and an optional short label at wide widths;
- `type="button"`;
- an `aria-label` describing the action;
- `aria-pressed` reflecting dark-mode state;
- a tooltip/title; and
- keyboard-visible focus styling.

The global controller is the source of truth. Refactor the BIOMERO React toggle
to call the controller or publish the same event rather than maintaining an
independent preference. Once the global header is available, remove the
duplicate toggle from the BIOMERO-local navbar.

## OMERO.web stylesheet strategy

Start with semantic custom properties rather than scattered literal colors:

```css
:root {
  --biomero-page: #ffffff;
  --biomero-surface: #f5f6f7;
  --biomero-text: #1c2127;
  --biomero-muted: #5f6b7c;
  --biomero-border: #d3d8de;
  --biomero-accent: #215db0;
}

:root[data-biomero-theme="dark"] {
  --biomero-page: #091219;
  --biomero-surface: #0f1b24;
  --biomero-text: #d7e3e9;
  --biomero-muted: #91a4b0;
  --biomero-border: #263947;
  --biomero-accent: #70b7ff;
}
```

Map OMERO.web selectors to these variables in bounded groups:

- page background and top header;
- global menus, search field and user dropdown;
- project/dataset tree and selected rows;
- center and metadata panels;
- tabs, toolbars, dialogs and activity windows;
- forms, tables, tooltips and contextual menus; and
- hover, selected, disabled, error and keyboard-focus states.

Do not recolor microscopy pixels, thumbnails, rendered canvases, channel
colors, label colors, color swatches or scientific plots. Avoid broad rules
such as `img`, `canvas`, `svg`, or `* { filter: ... }`.

Use the current BIOMERO and OMERO.Analysis palettes as the starting point, but
validate the final colors against the actual OMERO.web components. Target WCAG
AA contrast for normal text and controls.

## Delivery phases

### Phase 1: DOM and visual inventory

- Record the supported OMERO.web version used by NL-BIOMERO.
- Capture light-mode screenshots of the data browser, search results, history,
  script/activity dialogs, user menu and common metadata tabs.
- List stable IDs/classes for the header and each surface.
- Identify third-party applications that render inside the OMERO.web page and
  decide whether each inherits the host theme or remains independently themed.

### Phase 2: Shared controller and header toggle

- Add the packaged include, controller and minimal toggle styling to
  `OMERO.biomero`.
- Configure the include through the application setup.
- Reuse `biomero.ui.theme` and synchronize the BIOMERO React state.
- Place the control after `#search` and verify responsive header behavior.
- Remove the duplicate BIOMERO-navbar toggle after the global control is
  available.

### Phase 3: OMERO.web dark palette

- Implement the selector groups incrementally.
- Check each major OMERO.web view at desktop and narrow widths.
- Verify dialogs, menus and dynamically loaded panels after theme changes.
- Ensure images and scientific colors remain unchanged.

### Phase 4: Embedded application synchronization

- Confirm BIOMERO content updates without reload.
- Confirm an open embedded OMERO.Analysis workspace updates without reload.
- Confirm standalone OMERO.Analysis retains its own toggle and persistence.
- Decide separately whether ZarrViewer should adopt the shared preference;
  this is not required for the first OMERO.web delivery.

### Phase 5: NL-BIOMERO integration

- Release and pin the updated `OMERO.biomero` package.
- Update only `NL-BIOMERO/analysis_integration`.
- Build the integrated OMERO.web image.
- Run restart and static-collection checks.
- Perform authenticated browser smoke tests through the Nginx entry point.
- Share screenshots and test results before considering promotion beyond the
  integration branch.

## Tests

### OMERO.biomero unit and DOM tests

- invalid or unavailable local storage falls back safely;
- stored dark and light values initialize correctly;
- the button is inserted exactly once after `#search`;
- missing header/search DOM does not cause an error;
- clicking toggles attributes, storage, icon and accessibility text;
- custom and storage events update the page without a reload;
- messages use the exact same-origin target; and
- unrelated messages and storage keys are ignored.

### CSS and accessibility tests

- automated contrast checks for the palette tokens;
- keyboard navigation and visible focus for the toggle;
- no horizontal header overflow at supported widths;
- no CSS filters or broad image/canvas recoloring; and
- reduced-motion behavior for any optional transition.

### Integrated container tests

- `omero.web.base_include_template` resolves successfully;
- collected CSS and JavaScript return HTTP 200;
- the login page remains usable;
- authenticated OMERO.web loads with one theme toggle beside search;
- the preference survives navigation and a container restart;
- BIOMERO and embedded Analysis match the selected theme; and
- OMERO.web starts cleanly without duplicate application or UI registrations.

Use visual regression screenshots for at least the data browser in both modes.
Because OMERO.web uses legacy and third-party CSS, unit tests alone are not a
sufficient release gate.

## Acceptance criteria

- One theme toggle appears immediately to the right of the OMERO.web search
  form and before the user dropdown.
- The control is keyboard accessible and accurately announces its state.
- Switching themes updates OMERO.web and BIOMERO immediately without reload.
- Embedded OMERO.Analysis follows the host immediately.
- The preference persists across navigation, reloads and same-origin tabs.
- Standalone Analysis remains usable and independently themeable.
- No scientific imagery or semantic channel/label colors are altered.
- Light mode has no unintended visual regressions.
- The integrated image restarts cleanly and all theme assets are packaged.
- NL-BIOMERO changes exist only on `analysis_integration` until explicitly
  approved for promotion.

## Risks and mitigations

- **OMERO.web selector changes:** keep selectors grouped and version-tested;
  use screenshot regression tests when upgrading OMERO.web.
- **Singleton base include:** detect conflicts during setup and use an explicit
  aggregate include when another integration already owns the setting.
- **Flash of the light theme:** the supported include is rendered near the end
  of the body. Keep controller code small and run it immediately. If the flash
  is unacceptable, evaluate a narrowly scoped head injection separately rather
  than copying the entire base template.
- **Third-party plugin conflicts:** scope all overrides below
  `[data-biomero-theme]` and avoid generic element selectors.
- **Duplicate state owners:** make the global controller authoritative and test
  event propagation rather than letting each React application persist its own
  unsynchronized state.
- **Deployment drift:** ship behavior in the `OMERO.biomero` wheel and keep
  NL-BIOMERO responsible only for version pinning and activation.

## Review questions

1. Should the first release default to light, or use the operating-system
   preference when no saved value exists?
2. Should the header control show only an icon or an icon plus `Dark`/`Light`
   text on wide screens?
3. Does the current NL-BIOMERO image use another
   `omero.web.base_include_template` that must be composed?
4. Which third-party OMERO.web applications are in scope for the first dark
   stylesheet?
5. Should ZarrViewer follow the same preference in the initial release or in a
   later phase?
