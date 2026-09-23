# Source-qualified workspace names and workspace-panel classification — 2026-09-09

Implemented on the local `analysis_integration` branch in OMERO.Analysis.

- New workspace names retain the readable source ancestry and append the editable analysis label: `Screen name › Plate name › Image name — Analysis N`, or `Project name › Dataset name — Analysis N`.
- The server resolves readable parents, including Image → WellSample → Well → Plate → Screen. Well/WellSample are traversal steps; the requested Screen/Plate/Image names form the prefix. A stable name/ID ordering selects the path for multiply linked objects.
- Rename edits the suffix and keeps the source prefix. Existing bare `Analysis N` names gain their prefix when opened. Logical roots retain the distinguishing suffix even when the source path is long.
- Managed Dataset/Project markers take precedence over their content-item indexes. Selecting a workspace Dataset now renders its resumable workspace summary regardless of annotation ordering; individual result Images keep their result view.

## Verification

- Backend: 154 passed, 18 skipped (17 opt-in worker HTTP matrix cases and one Windows symlink case).
- Frontend: 229 passed across 47 files. TypeScript/Vite build and packaged wheel verification passed.
- Regression fixtures cover Dataset/Project ancestry, Screen/Plate/Image ancestry, reversed annotation order, fixed-prefix renaming, slash-containing Image names, and long-prefix logical-root collisions.
- Live gateway checked Screen 152, Plate 253, Image 1124 (`B/2/0`) and Dataset 551. The HCS Image path contains `SolHunt`, the complete Plate name, and `B/2/0`.
- Chrome showed **Resume SolHunt** for Dataset 454. Clicking it opened the original workspace ID `c436daa0-3457-4fc3-81e4-4a643dd48c11`.
- Refreshing the user's existing Analysis 2 tab saved `SolHunt — Analysis 2`; Dataset 660 and its browsing folder now include the prefix. Its eight synchronized items were retained.

The wheel is installed in `deployment_scenarios-omeroweb-1`, and the local `omero-analysis-web:recovery` image includes it for subsequent recreation. No worker changes, branch merges, or publications were performed for this correction. Detailed local logs use `.local-query-gates/workspace-names-*`.
