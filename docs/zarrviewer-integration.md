# Optional ZarrViewer integration

OMERO.Analysis can render measured objects and fields through
`BIOMERO.ZarrViewer>=0.4.0` when both applications are installed in the same
OMERO.web environment. ZarrViewer is optional: tabular analysis continues
normally when it is absent or disabled.

## Resolution model

The model never selects an OMERO ID or constructs an authenticated URL.
Generated Python first queries the measurement database for:

- the canonical OME-Zarr store UUID;
- a field path such as `A/1/5`;
- image dimensions and zero-based `t` and `z`;
- one-based source-channel numbers;
- a half-open object bounding box or centroid;
- an optional label path or one-based label channel and label value.

Analysis then performs a browser-side capability check against the current
OMERO object. An Image is checked directly. A Dataset checks its Image
children, a Plate is checked directly, and a Screen checks its Plate children.
Candidates are probed four at a time and must return the exact database UUID.
If multiple objects match, the user chooses one. Workspaces cache the verified
UUID-to-object binding for the active group and revalidate it after snapshot
import.

The database therefore does not need an OMERO Image or Plate ID. The store
UUID is the portable identity; OMERO IDs are deployment-local and are resolved
from the authenticated hierarchy.

## Preview behavior

- Object requests use the exact database bounding box.
- Point requests use a clamped 64 × 64 region around the centroid.
- Fields up to 2048 × 2048 render in full.
- Larger fields produce a centered 1024 × 1024 preview and a deep link to the
  full ZarrViewer field.
- A panel supports at most four source channels and eight overlays. Each
  overlay can select multiple values and use `outline`, `fill`, or
  `outline-fill`; outlines default to two screen pixels and masks default to
  30% opacity.
- Galleries contain 2–25 panels and use one authenticated batch request so
  repeated image and label planes can be reused.
- Crops are at most 2048 × 2048 and a returned PNG is limited to 32 MiB.

The preview is stored as a browser-local Workspace result with UUID, field, ROI,
channel, label, viewer-version, and resolved-object provenance. It is not
automatically attached to OMERO and does not require a same-stem CSV even when
Plot + CSV is enabled. **Save analysis + render** persists the versioned Python
analysis, exact recipe, PNG, cited evidence manifest, and a downloadable ZIP.
The exact ZarrViewer recipe is also embedded as executable Python in the saved
Method. Python exposes the recipe in its structured result; Analysis then
resolves its portable store UUID against the current OMERO context and sends
the recipe to ZarrViewer's authenticated render API. This preserves the
no-network Python sandbox while making single-ROI and gallery reruns independent
of the AI provider. Deployment-local OMERO object IDs are not stored in the
Method.

## Privacy boundary

ZarrViewer capability and ROI requests are same-origin authenticated browser
requests. Capability responses are sanitized: temporary store URLs, contexts,
and expiry details are discarded. The AI receives only whether the operation
succeeded, the field, bounded ROI, and whether a preview was cropped. It does
not receive the resolved OMERO object ID, viewer link, store credentials, or
source pixels.

## Troubleshooting

Settings reports the ZarrViewer-hosted skill provider and whether a compatible
viewer is enabled. If a preview cannot be created:

1. confirm `biomero-zarr-viewer>=0.4.0` is installed and present in
   `omero.web.apps`;
2. confirm its authenticated `/api/analysis-skills/` provider route is
   available;
3. confirm the selected Screen/Plate or Dataset/Image refers to the same
   OME-Zarr store UUID recorded in the database;
4. confirm the database field path, dimensions, channels, label path, and
   label value are present rather than inferred.
