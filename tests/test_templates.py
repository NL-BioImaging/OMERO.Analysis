from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_center_panel_supports_expected_omero_objects():
    source = (
        ROOT
        / "src/omero_analysis/templates/omero_analysis/center_plugin.js.html"
    ).read_text(encoding="utf-8")
    assert '["image", "dataset", "plate", "screen"]' in source
    assert "data_annotation=" in source
    assert "workspace_annotation=" in source
    assert "oa-workspace-snapshot" in source
    assert "omeroweb_center_plugin" in source
    assert "load_plugin_content" in source
    assert "ACTIVE_OBJECT" not in source
    assert "omero_analysis/panel.css" in source
    assert 'panel.addClass("omero-analysis-center")' in source

    panel = (
        ROOT / "src/omero_analysis/templates/omero_analysis/panel.html"
    ).read_text(encoding="utf-8")
    assert "oa-panel-header" in panel
    assert "oa-card" in panel
    assert "supported_attachments" in panel
    assert "workspace_snapshots" in panel


def test_combined_shell_includes_notebook_runtime_contract():
    source = (
        ROOT / "src/omero_analysis/templates/omero_analysis/chat.html"
    ).read_text(encoding="utf-8")
    assert "data-runtime-base" in source
    assert "window.OMERO_ANALYSIS" not in source
    assert "data-snapshot-upload-template" in source
    assert "JupyterLab" not in source
    assert "data-notebook-download-template" in source
    assert "data-notebook-upload-template" in source

    notebook_panel = (
        ROOT / "src/omero_analysis/templates/omero_analysis/notebook_panel.html"
    ).read_text(encoding="utf-8")
    assert "Attached notebooks" in notebook_panel
    assert "oa-notebook-upload" in notebook_panel
    assert "context.notebooks" in notebook_panel

    sandbox = (
        ROOT
        / "src/omero_analysis/templates/omero_analysis/runtime_sandbox.html"
    ).read_text(encoding="utf-8")
    assert 'new Worker(sourceUrl)' in sandbox
    assert "oa-bootstrap" in sandbox
    assert "allow-same-origin" not in sandbox
