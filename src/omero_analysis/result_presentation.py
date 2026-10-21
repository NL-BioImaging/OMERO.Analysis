"""Readable managed result names/descriptions without changing content identity."""
from __future__ import annotations

import json
import math
import re
from itertools import islice

from .errors import InvalidObject
from .managed_omero import plain, user_id
from .services import source_name_path

BEGIN = "--- OMERO Analysis provenance ---"
END = "--- End OMERO Analysis provenance ---"


def validate_provenance(value):
    if value is None:
        return
    if not isinstance(value, dict) or value.get("version") != 1:
        raise InvalidObject("Result provenance version is invalid")
    if len(json.dumps(value, ensure_ascii=False)) > 65536:
        raise InvalidObject("Result provenance exceeds its metadata limit")
    notebook, run, inputs = value.get("notebook"), value.get("run"), value.get("inputs")
    if not isinstance(notebook, dict) or not isinstance(run, dict) or not isinstance(inputs, list) or len(inputs) > 100:
        raise InvalidObject("Result provenance is incomplete")
    for field in (value.get("outputName"), notebook.get("name")):
        if field is not None and (not isinstance(field, str) or len(field) > 512):
            raise InvalidObject("Result provenance name is invalid")
    parameters = run.get("parameters")
    if parameters is not None:
        if not isinstance(parameters, dict) or len(parameters) > 100:
            raise InvalidObject("Result parameters are invalid")
        for key, entry in parameters.items():
            if not isinstance(key, str) or len(key) > 128 or not isinstance(entry, (str, int, float, bool, type(None))):
                raise InvalidObject("Result parameter value is invalid")
            if isinstance(entry, float) and not math.isfinite(entry):
                raise InvalidObject("Result parameter value is not finite")
    order = run.get("parameterOrder")
    if order is not None and (not isinstance(order, list) or any(not isinstance(key, str) for key in order)
                              or len(set(order)) != len(order) or set(order) != set(parameters or {})):
        raise InvalidObject("Result parameter order is invalid")
    for entry in inputs:
        if not isinstance(entry, dict) or not isinstance(entry.get("name"), str):
            raise InvalidObject("Result input reference is invalid")


def source_context(obj, workspace):
    kind = workspace["sourceObjectType"]
    path = source_name_path(kind, obj)
    lines = [f'{entry["type"]}:{entry["id"]} — {entry["name"]}' for entry in path]
    if not lines:
        lines = [f'{kind}:{workspace["sourceObjectId"]} — {workspace["sourceObjectName"]}']
    if kind == "Screen":
        children = list(islice(getattr(obj, "listChildren", lambda: [])(), 101))
        if children:
            lines.append("Plates in this source Screen (context; notebook selection may be narrower):")
            lines.extend(f"  Plate:{child.getId()} — {plain(child.getName())}" for child in children[:100])
            if len(children) > 100:
                lines.append("  Additional plates are available in the source Screen.")
    return "\n".join(lines)


def description(item, workspace, context):
    value = item["metadata"]["analysisProvenance"]
    notebook, run = value["notebook"], value["run"]
    name = notebook.get("name") or "Not recorded"
    if notebook.get("name") and not notebook.get("nameRecorded"):
        name += " (current saved name; name at execution was not recorded)"
    lines = [BEGIN, f'Analysis result: {value.get("outputName") or item["name"]}',
             f'Workspace: {workspace["name"]}', "", "Source context:", context, "",
             f"Notebook / script: {name}",
             "Executed source version: " + ("fingerprint recorded in key-value metadata." if notebook.get("scriptSha256") else "not recorded for this older run.")]
    if run.get("startedAt"):
        lines.append(f'Run started: {run["startedAt"]}')
    if run.get("completedAt"):
        lines.append(f'Run completed: {run["completedAt"]}')
    if run.get("mode") == "cell" and isinstance(run.get("cellIndex"), int):
        lines.append(f'Execution: cell {run["cellIndex"] + 1} in the existing notebook kernel.')
    elif run.get("mode") == "all":
        lines.append("Execution: Run all, starting with a clean notebook kernel.")
    if run.get("status"):
        lines.append(f'Run status: {run["status"]}')
    lines.extend(["", "Parameters actually used:"])
    parameters = run.get("parameters")
    if parameters is None:
        lines.append("  Not recorded. Current notebook defaults are not substituted.")
    elif not parameters:
        lines.append("  No run parameters.")
    else:
        order = run.get("parameterOrder") or list(parameters)
        lines.extend(f"  {key} = {json.dumps(parameters[key], ensure_ascii=False)}" for key in order if key in parameters)
    lines.extend(["", "Recorded analysis inputs:"])
    for entry in value["inputs"]:
        text = f'  Input [{entry.get("inputId", "input")}] — {entry["name"]}'
        if entry.get("annotationId"):
            text += f' (FileAnnotation {entry["annotationId"]})'
        if entry.get("originalFileId"):
            text += f' (OriginalFile {entry["originalFileId"]})'
        lines.append(text)
    if not value["inputs"]:
        lines.append("  Not recorded.")
    lines.extend(["", "Run identity, content checksums and full provenance are stored in OMERO key-value metadata.", END])
    return "\n".join(lines)


def merge_description(previous, generated, item, operation_id):
    """Replace only our block; preserve manually added text and legacy conversion notes."""
    previous = str(previous or "")
    operation = f"Operation {operation_id}."
    # The temporary operation marker protects the create-image/map-marker gap.
    if previous.endswith(operation):
        previous = previous[:-len(operation)].rstrip()
    if BEGIN in previous and END in previous:
        start = previous.index(BEGIN)
        stop = previous.index(END, start) + len(END)
        return previous[:start] + generated + previous[stop:]
    legacy = f'OMERO Analysis synchronized item {item["key"]}. '
    if previous.startswith(legacy):
        previous = previous[len(legacy):]
        previous = re.sub(r'^Source SHA-256 [0-9a-f]{64}\.\s*', '', previous)
        previous = previous.removeprefix(operation).strip()
    return generated + ("\n\n" + previous if previous.strip() else "")


def refresh_result(conn, remote, item, workspace, context, marker_values, set_marker):
    if item.get("kind") not in {"png-image", "result"} or not item.get("metadata", {}).get("analysisProvenance"):
        return
    try:
        if int(remote.getDetails().getOwner().getId()) != user_id(conn):
            return
    except (AttributeError, TypeError, ValueError):
        return
    if item["kind"] == "png-image":
        # Save the stable technical identity before removing its temporary text marker.
        set_marker(conn, remote, marker_values, "item")
        # Gateway caches loaded annotation objects on the Image. They now carry
        # older update events, so exclude that graph when saving Image fields.
        unload = getattr(remote, "unloadAnnotationLinks", None)
        if callable(unload):
            unload()
    target = remote if item["kind"] == "png-image" else remote.getFile()
    if str(plain(target.getName())) != item["name"]:
        target.setName(item["name"])
        target.save()
        if item["kind"] == "result":
            # The annotation's embedded OriginalFile is stale after its rename.
            # Save a reference, not a second copy of the old file object graph.
            from omero.model import OriginalFileI
            remote._obj.setFile(OriginalFileI(int(target.getId()), False))
    previous = plain(remote.getDescription())
    generated = merge_description(previous, description(item, workspace, context), item, marker_values["operation_id"])
    if previous != generated:
        remote.setDescription(generated)
        remote.save()
