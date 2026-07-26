from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_center_panel_supports_expected_omero_objects():
    source = (
        ROOT
        / "src/omero_analysis_chat/templates/omero_analysis_chat/center_plugin.js.html"
    ).read_text(encoding="utf-8")
    assert '["image", "dataset", "plate", "screen"]' in source
    assert "data_annotation=" in source
    assert "omeroweb_center_plugin" in source
    assert "load_plugin_content" in source
    assert "ACTIVE_OBJECT" not in source


def test_chat_has_no_notebook_surface_and_includes_runtime_config():
    source = (
        ROOT / "src/omero_analysis_chat/templates/omero_analysis_chat/chat.html"
    ).read_text(encoding="utf-8")
    assert "runtimeBase" in source
    assert "JupyterLab" not in source
    assert "notebook" not in source.lower()
