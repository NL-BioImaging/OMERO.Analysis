---
name: create-omero-analysis-movie
description: Create or validate browser-local OMERO.Analysis and ZarrViewer MP4 recipes for temporal intensity images, overlapping labels, points, and tracks.
license: AGPL-3.0-or-later
---

# Create an Analysis Movie

Use `scripts/scaffold_movie.py` to create the structured recipe. Use
`source={"kind":"image-input"}` for the user-selected workspace Image input.
Obtain field, dimensions, channels, and frame indices from approved input/context.
Do not invent OMERO IDs or URLs. Multiple selected images open a host chooser;
an optional actual `imageId` may select one of the workspace inputs.

In a Method or Notebook, assign:

```python
result = {"omero_analysis_render_format": "mp4",
          "omero_analysis_render_recipe": recipe}
```

Analysis resolves the selected OMERO Image ID; ZarrViewer reads authenticated pixels in the
browser and encodes in a worker. Python has no network access and does not invoke
FFmpeg. Default playback is 5 FPS, independent of acquisition timing. Frame and
Z indices are zero-based; source channels are one-based. Bounds are half-open
native-pixel XY coordinates.

Use `overlays` for independent raster label layers and `vectors` for points/lines.
For mapped tracks, set `tracks.rows` to a bounded list of observations and
`tracks.columns` to explicit id/x/y/t and optional z column names. Preserve IDs,
use native pixel coordinates, and state any applied coordinate transform. The
renderer never joins across missing frames or interpolates. `sequence.trailFrames`
controls the visible history. Label planes use the selected Z plane.

Limits are 2000 frames, 2048 × 2048 pixels, 256 MiB or the deployment's smaller
upload limit. Confirm the actual MP4, poster, and provenance were produced and
play correctly in Chrome. Do not claim success based only on the recipe.

Images and tracks are independent inputs. Do not require a shared UUID, workflow
name or source/result relationship. Check dimensions, coordinates, channels and
frame indices against the chosen image. Biological correspondence is the user's
responsibility. `source={"kind":"current-image"}` remains a compatibility alias.
Existing recipes may explicitly use a verified `storeUuid` instead; never combine
that legacy mode with an image-input source.
