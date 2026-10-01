import json
from pathlib import Path
import pytest
from omero_analysis.notebook_contract import prepare_notebook

CASES = json.loads((Path(__file__).parent / 'fixtures/notebook-contracts.json').read_text())

@pytest.mark.parametrize('case', CASES, ids=lambda case: case['name'])
def test_shared_protocol_contracts(case):
    source = 'import omero_analysis_notebook as oan\noan.configure(r"""' + json.dumps(case['contract']) + '""")'
    document = {'cells': [{'cell_type': 'code', 'source': source, 'metadata': {'tags': ['omero-analysis-config']}}]}
    if case['valid']:
        assert prepare_notebook(document)[1]['inputs'][0]['id'] == 'data'
    else:
        with pytest.raises(Exception):
            prepare_notebook(document)
