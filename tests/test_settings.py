from omero_analysis import settings as analysis_settings


def test_integrated_data_analysis_accepts_documented_true_values(settings, monkeypatch):
    monkeypatch.delenv("INTEGRATE_DATA_ANALYSIS", raising=False)
    for value in (True, "true", "True", "TRUE", " 1 "):
        settings.INTEGRATE_DATA_ANALYSIS = value
        assert analysis_settings.integrated_data_analysis() is True


def test_integrated_data_analysis_defaults_false_and_reads_environment(settings, monkeypatch):
    if hasattr(settings, "INTEGRATE_DATA_ANALYSIS"):
        del settings.INTEGRATE_DATA_ANALYSIS
    monkeypatch.delenv("INTEGRATE_DATA_ANALYSIS", raising=False)
    assert analysis_settings.integrated_data_analysis() is False

    monkeypatch.setenv("INTEGRATE_DATA_ANALYSIS", "true")
    assert analysis_settings.integrated_data_analysis() is True

    monkeypatch.setenv("INTEGRATE_DATA_ANALYSIS", "yes")
    assert analysis_settings.integrated_data_analysis() is False


def test_remote_query_policy_reads_deployment_environment(settings, monkeypatch):
    if hasattr(settings, "OMERO_ANALYSIS_REMOTE_QUERY_THRESHOLD_BYTES"):
        del settings.OMERO_ANALYSIS_REMOTE_QUERY_THRESHOLD_BYTES
    monkeypatch.setenv("OMERO_ANALYSIS_REMOTE_QUERY_THRESHOLD_BYTES", "0")
    monkeypatch.setenv("OMERO_ANALYSIS_DATA_QUERY_RESULT_TTL_SECONDS", "900")
    monkeypatch.setenv("OMERO_ANALYSIS_DATA_QUERY_REQUEST_TIMEOUT_SECONDS", "330")
    monkeypatch.setenv(
        "OMERO_ANALYSIS_DATA_QUERY_SOURCE_UPLOAD_TIMEOUT_SECONDS", "1800"
    )
    assert analysis_settings.remote_query_threshold_bytes() == 0
    assert analysis_settings.data_query_result_ttl_seconds() == 900
    assert analysis_settings.data_query_request_timeout_seconds() == 330
    assert analysis_settings.data_query_source_upload_timeout_seconds() == 1800


def test_remote_query_timeouts_keep_safe_positive_defaults(settings, monkeypatch):
    for name in (
        "OMERO_ANALYSIS_DATA_QUERY_REQUEST_TIMEOUT_SECONDS",
        "OMERO_ANALYSIS_DATA_QUERY_SOURCE_UPLOAD_TIMEOUT_SECONDS",
    ):
        if hasattr(settings, name):
            delattr(settings, name)
        monkeypatch.delenv(name, raising=False)

    assert analysis_settings.data_query_request_timeout_seconds() == 40
    assert analysis_settings.data_query_source_upload_timeout_seconds() == 120

    monkeypatch.setenv("OMERO_ANALYSIS_DATA_QUERY_REQUEST_TIMEOUT_SECONDS", "0")
    monkeypatch.setenv(
        "OMERO_ANALYSIS_DATA_QUERY_SOURCE_UPLOAD_TIMEOUT_SECONDS", "-5"
    )
    assert analysis_settings.data_query_request_timeout_seconds() == 1
    assert analysis_settings.data_query_source_upload_timeout_seconds() == 1


def test_notebook_cell_timeout_is_configurable_with_production_default(settings, monkeypatch):
    name = "OMERO_ANALYSIS_NOTEBOOK_CELL_TIMEOUT_SECONDS"
    if hasattr(settings, name):
        delattr(settings, name)
    monkeypatch.delenv(name, raising=False)
    assert analysis_settings.notebook_cell_timeout_seconds() == 300

    monkeypatch.setenv(name, "1800")
    assert analysis_settings.notebook_cell_timeout_seconds() == 1800

    monkeypatch.setenv(name, "0")
    assert analysis_settings.notebook_cell_timeout_seconds() == 1
