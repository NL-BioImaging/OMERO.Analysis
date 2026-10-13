"""Check the packaged host, including compiled assets, in the paired CI job."""
import os

import pytest

from omero_analysis.host_capabilities import biomero_analysis_host_installed


@pytest.mark.skipif(os.environ.get("BIOMERO_RUN_INTEGRATION") != "1",
                    reason="Set BIOMERO_RUN_INTEGRATION=1 with a compatible installed BIOMERO host")
def test_installed_biomero_hosts_embedded_analysis():
    biomero_analysis_host_installed.cache_clear()
    try:
        assert biomero_analysis_host_installed(), (
            "Installed BIOMERO must package the host view, template, asset manifest "
            "and compiled embedded-workspace frontend together"
        )
    finally:
        biomero_analysis_host_installed.cache_clear()
