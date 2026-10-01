---
name: create-omero-analysis-movie
description: Create or validate browser-local OMERO.Analysis and ZarrViewer MP4 recipes for temporal intensity images, overlapping labels, points, and tracks.
license: AGPL-3.0-or-later
---

# Create an Analysis Movie

Use `scripts/scaffold_movie.py` to create the structured recipe. Obtain the store
UUID, field, dimensions, channels, and frame indices from verified input/context.
Do not invent deployment-local OMERO IDs or URLs.

In a Method or Notebook, assign:

```python
result = {"omero_analysis_render_format": "mp4",
          "omero_analysis_render_recipe": recipe}
```

Analysis resolves the portable UUID; ZarrViewer reads authenticated pixels in the
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

Limits are 600 frames, 2048 × 2048 pixels, 256 MiB or the deployment's smaller
upload limit. Confirm the actual MP4, poster, and provenance were produced and
play correctly in Chrome. Do not claim success based only on the recipe.

For an older raw store without a UUID, explicitly use
`source={"kind":"current-image"}` inside an Image workspace. The host supplies the
verified current-object binding; do not substitute an importer UUID. Portable
multi-image/plate workflows continue to require a verified store UUID.
