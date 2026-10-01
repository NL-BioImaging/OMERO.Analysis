# Temporal movies

ZarrViewer's existing Position panel now has play/pause, frame stepping, FPS,
and looping. **Export movie** creates an MP4 locally with the visible channels
and labels. The export panel shows its native-pixel crop and frame range.
Default playback is **5 FPS**; it never changes recorded acquisition timing.
MP4 playback acceptance targets Chrome. Encoding needs Chrome's native AVC
encoder and a secure origin (HTTPS or localhost).

Methods and Notebooks request the same browser renderer through `result`:

```python
result = {
    "omero_analysis_render_format": "mp4",
    "omero_analysis_render_recipe": {
        "version": 2,
        "storeUuid": verified_store_uuid,
        "filename": "temporal-review",
        "sequence": {"version": 1, "start": 0, "end": 18, "fps": 5},
        "panels": [{
            "field": ".", "roi": [0, 0, 512, 512],
            "sourceChannels": [1], "t": 18, "z": 0,
            "title": "Temporal review", "overlays": []
        }]
    }
}
```

Use observed identifiers and dimensions. Recipe indices are zero-based T/Z,
channels are one-based, and crops are half-open XY bounds in native pixels.
An optional `projection` selects `slice`, `mip`, `mean`, or `min` for intensity;
raster labels remain at the selected Z plane.

Raster overlays accept labelPath or labelChannel, selected values, color,
opacity, outline width, and fill/outline/outline-fill mode. Layers are independent
and composited in declaration order, including overlaps. Missing label planes
fail explicitly. PNG and SVG recipes remain unchanged.

`vectors` uses the existing version-1 point/line format. For generic tracks:

```python
panel["tracks"] = {
    "rows": observations,
    "columns": {"id": "track_id", "x": "x", "y": "y", "t": "frame"}
}
recipe["sequence"]["trailFrames"] = 10
```

Map actual columns, preserve IDs, and explicitly transform physical or crop-local
coordinates to native image pixels. Missing frames remain gaps. The renderer
does not interpolate or infer table joins. Maximum 10,000 track observations and
1 MiB recipe data keep transfers bounded.

Limits: 600 frames, 2048 × 2048 pixels, and 256 MiB or the deployment's smaller
upload limit. Odd dimensions are padded on the right/bottom for AVC and recorded
in provenance. Source imagery, labels, and scientific measurements are unchanged.
Stop cancels loading/encoding without publishing a partial movie.

Analysis stores MP4, poster PNG, and recipe/provenance JSON as one result group.
The movie is a FileAnnotation; the existing PNG handling applies to its poster.
Native video controls appear in run results, Inspector, and Notebook outputs.
Archived and synchronized workspaces retain movie provenance and references.

## Older raw-image stores

Some older OME-Zarr stores have no store UUID. In an Image workspace a Method or
Notebook can explicitly use `"source": {"kind": "current-image"}` in the recipe
instead of `storeUuid`. Analysis binds the authenticated current Image and supplies
the verified store binding. This does not guess an importer UUID or save a local
OMERO ID in reusable code. Dataset/Plate workflows still use verified store UUIDs.
Direct ZarrViewer export works for these older stores as well.
