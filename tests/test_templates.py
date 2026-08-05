from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_center_panel_supports_expected_omero_objects():
    source = (
        ROOT
        / "src/omero_analysis/templates/omero_analysis/center_plugin.js.html"
    ).read_text(encoding="utf-8")
    assert 'project: "Project"' in source
    assert 'well: "Well"' in source
    assert "multiSourceTypes" in source
    assert "plugin_enabled" in source
    assert "selection_id=" in source
    assert "data_annotation=" in source
    assert "workspace_annotation=" in source
    assert "library_item=" in source
    assert "open_library=1" in source
    assert "oa-workspace-snapshot" in source
    assert "omeroweb_center_plugin" in source
    assert "load_plugin_content" in source
    assert "ACTIVE_OBJECT" not in source
    assert "omero_analysis/panel.css" in source
    assert 'panel.addClass("omero-analysis-center")' in source
    assert '$("#omero_analysis_panel")' in source
    assert "tab=chat" not in source

    panel = (
        ROOT / "src/omero_analysis/templates/omero_analysis/panel.html"
    ).read_text(encoding="utf-8")
    assert "oa-panel-header" in panel
    assert "oa-card" in panel
    assert "supported_attachments" in panel
    assert "workspace_snapshots" in panel
    assert "analysis_library_tree.html" in panel
    assert "Upload Attachment" in panel
    assert "oa-attachment-upload-input" in panel
    assert 'context.panel_kind == "workspace"' in panel
    assert 'context.panel_kind == "result"' in panel
    assert 'context.panel_kind == "settings"' in panel
    assert "Open selection in Analysis" in panel
    assert "Resume" in panel

    deployment = (ROOT / "docker/90-omero-analysis.omero").read_text(
        encoding="utf-8"
    )
    assert deployment.count("omero.web.ui.center_plugins") == 1
    assert '["Analysis", "omero_analysis/center_plugin.js.html", "omero_analysis_panel"]' in deployment
    assert "Analysis Chat" not in deployment
    assert "Analysis Notebook" not in deployment


def test_analysis_shell_includes_notebook_runtime_contract():
    source = (
        ROOT / "src/omero_analysis/templates/omero_analysis/analysis.html"
    ).read_text(encoding="utf-8")
    assert "data-runtime-base" in source
    assert "window.OMERO_ANALYSIS" not in source
    assert "data-snapshot-upload-template" in source
    assert "JupyterLab" not in source
    assert "data-notebook-download-template" in source
    assert "data-notebook-upload-template" in source
    assert "{% load analysis_assets %}" in source
    assert "{% analysis_static 'omero_analysis/app.js' %}" in source
    assert "?v=0.10.0" not in source

    library_tree = (
        ROOT
        / "src/omero_analysis/templates/omero_analysis/analysis_library_tree.html"
    ).read_text(encoding="utf-8")
    assert "+AnalysisWorkspaces" in library_tree
    assert '<details class="oa-tree-root-node" open>' in library_tree
    assert '<summary class="oa-tree-root"' in library_tree
    assert "oa-tree-dataset" in library_tree
    assert "oa-library-item-input" in library_tree
    assert "webclient/image/folder16.png" in library_tree
    assert "webclient/image/folder_image16.png" in library_tree

    panel_css = (
        ROOT / "src/omero_analysis/static/omero_analysis/panel.css"
    ).read_text(encoding="utf-8")
    library_rule = panel_css.split(
        ".omero-analysis-center .oa-library-tree {", 1
    )[1].split("}", 1)[0]
    assert "overflow: visible" in library_rule
    assert "max-height" not in library_rule
    assert "overflow-wrap: anywhere" in panel_css
    assert ".oa-object {" in panel_css
    assert "max-width: 920px; min-width: 0; width: 100%" in panel_css

    sandbox = (
        ROOT
        / "src/omero_analysis/templates/omero_analysis/runtime_sandbox.html"
    ).read_text(encoding="utf-8")
    assert 'new Worker(sourceUrl)' in sandbox
    assert "oa-bootstrap" in sandbox
    assert "allow-same-origin" not in sandbox
