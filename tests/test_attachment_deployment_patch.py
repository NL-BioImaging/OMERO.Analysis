import importlib.util
from pathlib import Path

import pytest


SCRIPT = Path(__file__).resolve().parents[1] / "docker/filter-analysis-attachments.py"
spec = importlib.util.spec_from_file_location("attachment_patch", SCRIPT)
patch = importlib.util.module_from_spec(spec)
spec.loader.exec_module(patch)

SOURCE = '''class BaseContainer:
    FILES_BY_OBJECT_QUERY = ("SELECT {columns} FROM FileAnnotation AS fa JOIN fa.file AS ofile "
        "    WHERE NOT EXISTS ( SELECT 1 FROM {parent_type}AnnotationLink sa_link "
        "WHERE fa.id = sa_link.child.id AND (fa.ns not in (:ns_to_exclude) OR fa.ns IS NULL) ) {order_by}")
    def getFilesByObject(self, parent_type=None, parent_ids=None, offset=0, limit=100):
        ns_to_exclude = rlist([
            rstring(omero.constants.namespaces.NSCOMPANIONFILE),
            rstring(omero.constants.namespaces.NSEXPERIMENTERPHOTO),
        ])
        return ns_to_exclude
'''


def test_patch_is_idempotent_and_preserves_existing_exclusions():
    output = patch.patched_source(SOURCE)
    assert patch.patched_source(output) == output
    assert "WHERE (fa.ns not in (:ns_to_exclude) OR fa.ns IS NULL) AND NOT EXISTS" in output
    namespaces = type("Namespaces", (), dict(NSCOMPANIONFILE="companion", NSEXPERIMENTERPHOTO="photo"))
    constants = type("Constants", (), dict(namespaces=namespaces))
    namespace = dict(rlist=list, rstring=str, omero=type("Omero", (), dict(constants=constants)))
    exec(output, namespace)
    assert namespace["BaseContainer"]().getFilesByObject() == ["companion", "photo", *patch.NAMESPACES]


def test_upstream_changes_fail_instead_of_silently_overwriting():
    with pytest.raises(RuntimeError, match="exclusion list differs"):
        patch.patched_source(SOURCE.replace('rstring(omero.constants.namespaces.NSEXPERIMENTERPHOTO)', 'rstring("another-namespace")'))
    with pytest.raises(RuntimeError):
        patch.patched_source("pass")
