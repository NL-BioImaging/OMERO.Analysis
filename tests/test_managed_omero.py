from types import SimpleNamespace

import pytest

from omero_analysis.managed_omero import set_marker


def test_marker_refreshes_cached_annotation_and_preserves_current_values():
    saved = []
    stale = SimpleNamespace(getId=lambda: 7, getNs=lambda: "ns",
                            getValue=lambda: [("role", "item"), ("note", "old")])
    fresh = SimpleNamespace(getValue=lambda: [("role", "item"), ("note", "current"), ("external", "keep")],
                            setValue=lambda values: saved.append(dict(values)), save=lambda: saved.append("saved"))
    def get_object(kind, object_id):
        assert (kind, object_id) == ("MapAnnotation", 7)
        return fresh
    result = set_marker(SimpleNamespace(getObject=get_object),
                        SimpleNamespace(listAnnotations=lambda: [stale]), "ns", {"sha256": "new"}, "item")
    assert result is fresh
    assert saved == [{"role": "item", "note": "current", "external": "keep", "sha256": "new"}, "saved"]


def test_marker_deleted_during_sync_requires_a_retry():
    stale = SimpleNamespace(getId=lambda: 7, getNs=lambda: "ns", getValue=lambda: [("role", "item")])
    with pytest.raises(RuntimeError, match="retry synchronization"):
        set_marker(SimpleNamespace(getObject=lambda *_: None),
                   SimpleNamespace(listAnnotations=lambda: [stale]), "ns", {}, "item")
