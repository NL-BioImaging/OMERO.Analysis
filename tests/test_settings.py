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
    assert analysis_settings.remote_query_threshold_bytes() == 0
    assert analysis_settings.data_query_result_ttl_seconds() == 900
