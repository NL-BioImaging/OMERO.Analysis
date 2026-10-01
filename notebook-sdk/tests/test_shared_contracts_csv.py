import json
from pathlib import Path
import shutil
import pytest
from omero_analysis_notebook.context import NotebookContext
from omero_analysis_notebook.protocol import load_contract

FIXTURES = Path(__file__).resolve().parents[2] / 'tests/fixtures'

@pytest.mark.parametrize('case', json.loads((FIXTURES / 'notebook-contracts.json').read_text()), ids=lambda case: case['name'])
def test_shared_contracts(case):
    if case['valid']:
        assert load_contract(case['contract'])['inputs'][0]['id'] == 'data'
    else:
        with pytest.raises(Exception):
            load_contract(case['contract'])

@pytest.mark.parametrize('filename,identifier,expected', [
    ('generic-identifiers.csv', 'sample_id', ['001', '002', '003']),
    ('cellprofiler-images.csv', 'Metadata_Well', ['001', '002']),
])
def test_csv_identifiers_and_quoted_fields(tmp_path, filename, identifier, expected):
    (tmp_path / 'input').mkdir()
    shutil.copyfile(FIXTURES / filename, tmp_path / 'input/data.csv')
    contract = load_contract({'schema': 'nl.bioimaging.omero-analysis-notebook.v1',
        'inputs': [{'id': 'data', 'kind': 'file', 'path': 'input/data.csv', 'extensions': ['.csv']}],
        'results': {'path': 'results'}})
    context = NotebookContext(contract, tmp_path)
    frame = context.read_csv('data', identifiers=[identifier])
    assert frame[identifier].tolist() == expected
    assert len(context.read_csv('data', identifiers=[identifier], nrows=1)) == 1
    with pytest.raises(Exception, match='missing'):
        context.read_csv('data', identifiers=['nonexistent'])
