"""Deployment-only patch for OMERO.web's existing-file attachment chooser.

Run after installing web packages, before starting OMERO.web. No database writes.
"""
import argparse
import ast
import importlib.util
from pathlib import Path


NAMESPACES = (
    "nl.bioimaging.analysis.sync.manifest.v1",
    "nl.bioimaging.analysis.settings.encrypted.v1",
    "nl.bioimaging.analysis.user-skill.v1",
    "nl.bioimaging.analysis.workspace.v1",
    "nl.bioimaging.analysis.method.v1",
    "nl.bioimaging.analysis.pipeline.v1",
    "nl.bioimaging.analysis.notebook.v1",
    "nl.bioimaging.analysis.template.v1",
    "nl.bioimaging.analysis.result.v1",
    "nl.bioimaging.analysis.data-query.provenance.v1",
)


def patched_source(source):
    tree = ast.parse(source)
    functions = [n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef)
                 and n.name == "getFilesByObject"]
    if len(functions) != 1:
        raise RuntimeError("Unsupported OMERO.web: expected one getFilesByObject method")
    assignments = [n for n in functions[0].body if isinstance(n, ast.Assign)
                   and any(isinstance(t, ast.Name) and t.id == "ns_to_exclude" for t in n.targets)]
    if len(assignments) != 1:
        raise RuntimeError("Unsupported OMERO.web: namespace exclusion assignment changed")
    node = assignments[0]
    original = "rlist([rstring(omero.constants.namespaces.NSCOMPANIONFILE), rstring(omero.constants.namespaces.NSEXPERIMENTERPHOTO)])"
    replacement = original[:-2] + ", " + ", ".join(f"rstring({ns!r})" for ns in NAMESPACES) + "])"
    expected = ast.dump(ast.parse(original, mode="eval").body)
    desired = ast.dump(ast.parse(replacement, mode="eval").body)
    current = ast.dump(node.value)
    if current not in (expected, desired):
        raise RuntimeError("Unsupported OMERO.web: exclusion list differs; review deployment patch before upgrading")
    lines = source.splitlines(keepends=True)
    indent = " " * node.col_offset
    if current == expected:
        lines[node.lineno - 1:node.end_lineno] = [
        indent + "# Deployment policy: keep managed Analysis files out of the attachment chooser.\n",
        indent + "ns_to_exclude = " + replacement + "\n",
    ]
    result = "".join(lines)
    # Upstream places its namespace test inside NOT EXISTS, which does not
    # exclude these files from the outer result set. Filter before pagination.
    query_nodes = [n for n in ast.walk(ast.parse(result)) if isinstance(n, ast.Assign)
                   and any(isinstance(t, ast.Name) and t.id == "FILES_BY_OBJECT_QUERY" for t in n.targets)]
    if len(query_nodes) != 1:
        raise RuntimeError("Unsupported OMERO.web: file chooser query changed")
    query_node = query_nodes[0]
    query = ast.literal_eval(query_node.value)
    original_where = "    WHERE NOT EXISTS ( "
    filtered_where = "    WHERE (fa.ns not in (:ns_to_exclude) OR fa.ns IS NULL) AND NOT EXISTS ( "
    if filtered_where not in query:
        if query.count(original_where) != 1 or query.count(":ns_to_exclude") != 1:
            raise RuntimeError("Unsupported OMERO.web: inspect file chooser query before upgrading")
        query = query.replace(original_where, filtered_where)
        lines = result.splitlines(keepends=True)
        lines[query_node.lineno - 1:query_node.end_lineno] = [
            " " * query_node.col_offset + "FILES_BY_OBJECT_QUERY = " + repr(query) + "\n"]
        result = "".join(lines)
    compile(result, "container.py", "exec")
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target", type=Path, help="Override installed container.py (testing)")
    parser.add_argument("--check", action="store_true", help="Verify the patch is installed without changing files")
    args = parser.parse_args()
    if args.target:
        target = args.target
    else:
        spec = importlib.util.find_spec("omeroweb")
        if spec is None or not spec.submodule_search_locations:
            raise SystemExit("OMERO.web is not installed in this Python environment")
        target = Path(next(iter(spec.submodule_search_locations))) / "webclient/controller/container.py"
    source = target.read_text(encoding="utf-8")
    result = patched_source(source)
    if args.check:
        if source != result:
            raise SystemExit("Analysis attachment chooser filter is not installed")
        print("Analysis attachment chooser filter: verified")
    elif source != result:
        target.write_text(result, encoding="utf-8")
        print("Analysis attachment chooser filter: installed")
    else:
        print("Analysis attachment chooser filter: already installed")


if __name__ == "__main__":
    main()
