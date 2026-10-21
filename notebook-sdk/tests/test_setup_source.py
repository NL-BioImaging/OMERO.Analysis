import json
import pytest
from omero_analysis_notebook.notebook import extract_contract, starter_document
from omero_analysis_notebook.protocol import ProtocolError


def test_graphical_literal_keeps_surrounding_python_and_special_text():
    document = starter_document()
    contract = extract_contract(document)
    contract['custom'] = {'label': "researcher's ''' value", 'path': r'C:\files', 'unit': 'µm'}
    contract['parameters'][0]['default'] = 3
    literal = json.dumps(contract, ensure_ascii=False).replace("'", r'\u0027')
    document['cells'][0]['source'] = "# preserve\nimport omero_analysis_notebook as oan\ncustom = 42\nctx = oan.configure(r'''" + literal + "''')\nctx.display_parameters()\n"
    assert extract_contract(document)['custom'] == contract['custom']
    assert extract_contract(document)['parameters'][0]['default'] == 3


@pytest.mark.parametrize('tail', ["\nctx2 = oan.configure(r'''{}''')", "\nconfigure(r'''{}''')"])
def test_ambiguous_configure_calls_are_rejected(tail):
    document = starter_document()
    document['cells'][0]['source'] += tail
    with pytest.raises(ProtocolError, match='one'):
        extract_contract(document)


def test_calls_inside_comments_and_strings_are_not_configuration():
    document = starter_document()
    document['cells'][0]['source'] = '# oan.configure(fake)\nnote = "oan.configure(other)"\n' + document['cells'][0]['source']
    assert extract_contract(document)['inputs'][0]['id'] == 'measurements'


def test_computed_configuration_is_never_executed():
    document = starter_document()
    document['cells'][0]['source'] = 'ctx = oan.configure(build_config())'
    with pytest.raises(ProtocolError, match='literal'):
        extract_contract(document)
