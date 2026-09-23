# Analysis interface verification, 2026-09-09

Removed the Explorer Recent query results panel and its direct-save buttons.
The provenance promotion API and normal notebook/Method result saving remain
available. No worker protocol or backend behavior changed.

Light-theme overrides now cover notebook parameters, secondary panels, Help
navigation, settings, editor hints, history, status messages and Explorer hover
states. Dark-theme rules and rendered plot images are unchanged.

## Validation

- Frontend: 47 test files, 226 tests passed, including light/dark theme checks.
- TypeScript/Vite production build and bundled runtime validation passed.
- Built and verified `omero_analysis-0.14.0-py3-none-any.whl`.
- Visually checked the logged-in Chrome BIOMERO embedded interface at Screen 152:
  Home, Methods, Pipeline results, Notebooks, Assistant, Notebook Editor,
  Settings (including AI Settings and Skills), Help, Explorer and Inspector.
- Confirmed Notebook parameter controls use a light surface and readable text.
- Checked Notebook and Settings in dark mode, then restored light mode.
- The existing saved Pipeline editor could not open because its bound
  `cellsA1B1__cisegmentation_measurements.duckdb` input is unavailable. Its error
  dialog was readable; the Pipeline editor itself was not visually verified.
- No analyses were run or saved. Temporary editor state was discarded; the
  workspace remained at revision 307 with 75 items and 112 results.

## Local installation

Installed the verified wheel in the running OMERO web container, collected
static files and gracefully reloaded Gunicorn to preserve the login session.
Rebuilt `omero-analysis-web:recovery` with the same wheel for future container
recreation. The prior image is retained as
`omero-analysis-web:before-light-theme`. The worker was not changed.
