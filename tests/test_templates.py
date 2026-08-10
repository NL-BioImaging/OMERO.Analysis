from pathlib import Path
import importlib.util
from types import SimpleNamespace

ROOT = Path(__file__).resolve().parents[1]


def load_script(name):
    path = ROOT / "docker" / name
    spec = importlib.util.spec_from_file_location(name.replace("-", "_"), path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


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
    assert "analysis_workspace_annotation=" in source
    assert "analysis_data_annotation=" in source
    assert "analysis_library_item=" in source
    assert "window.location.assign" in source
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
    assert "data-integrated-data-analysis" in panel

    deployment = (ROOT / "docker/90-omero-analysis.omero").read_text(
        encoding="utf-8"
    )
    assert deployment.count("omero.web.ui.center_plugins") == 1
    assert '["Analysis", "omero_analysis/center_plugin.js.html", "omero_analysis_panel"]' in deployment
    assert "omero.web.ui.top_links" not in deployment
    assert "Analysis Chat" not in deployment
    assert "Analysis Notebook" not in deployment

    cleanup = load_script("49-omero-analysis-cleanup.py")
    assert cleanup.REGISTERED_ENTRIES == (
        (
            "omero.web.ui.center_plugins",
            '["Analysis", "omero_analysis/center_plugin.js.html", '
            '"omero_analysis_panel"]',
        ),
        (
            "omero.web.ui.top_links",
            '["Analysis", "omero_analysis_index", '
            '{"title": "Open browser-local Analysis", "target": "new"}]',
        ),
    )


def test_analysis_navigation_registration_uses_the_shared_boolean_contract():
    navigation = load_script("51-omero-analysis-navigation.py")
    assert navigation.OMERO_PYTHON == "/opt/omero/web/venv3/bin/python"
    for value in ("true", "True", "TRUE", "1", " true "):
        assert navigation.integrated_data_analysis(value) is True
    for value in ("", "0", "false", "FALSE", "yes", None):
        if value is None:
            continue
        assert navigation.integrated_data_analysis(value) is False


def test_analysis_navigation_registration_is_conditional_and_idempotent(monkeypatch):
    navigation = load_script("51-omero-analysis-navigation.py")
    calls = []

    def fake_run(command, **kwargs):
        calls.append((command, kwargs))
        return SimpleNamespace(returncode=0)

    monkeypatch.setattr(navigation, "run", fake_run)
    monkeypatch.setenv("INTEGRATE_DATA_ANALYSIS", "TRUE")
    navigation.main()
    assert calls[0][0][0] == navigation.OMERO_PYTHON
    assert calls[1][0] == [
        navigation.OMERO,
        "config",
        "remove",
        "--",
        navigation.TOP_LINK_KEY,
        navigation.TOP_LINK_VALUE,
    ]
    assert len(calls) == 2

    calls.clear()
    monkeypatch.setenv("INTEGRATE_DATA_ANALYSIS", "FALSE")
    navigation.main()
    assert calls[2][0] == [
        navigation.OMERO,
        "config",
        "append",
        "--",
        navigation.TOP_LINK_KEY,
        navigation.TOP_LINK_VALUE,
    ]


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
    assert "data-embedded-host" in source
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
