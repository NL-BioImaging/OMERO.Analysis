"""Check a Method declaration without executing its scientific code."""
import ast
import json
from pathlib import Path
import sys

def validate(path):
    tree = ast.parse(Path(path).read_text(encoding='utf-8'), filename=str(path))
    assignments = [node for node in tree.body if isinstance(node, ast.Assign) and any(
        isinstance(target, ast.Name) and target.id == 'OA_METHOD_PARAMETERS_JSON' for target in node.targets)]
    if len(assignments) > 1:
        raise ValueError('Use one parameter declaration')
    parameters = json.loads(ast.literal_eval(assignments[0].value)) if assignments else []
    if not isinstance(parameters, list):
        raise ValueError('Parameters must be an array')
    names = set()
    for item in parameters:
        name = item['name']
        if not name.isidentifier() or name in names:
            raise ValueError('Invalid or duplicate parameter name')
        names.add(name)
        value, kind = item['defaultValue'], item['type']
        if kind == 'number':
            import math
            valid = type(value) in (int, float) and math.isfinite(value)
        elif kind == 'boolean':
            valid = isinstance(value, bool)
        else:
            valid = isinstance(value, str) and (kind == 'string' or kind == 'choice' and value in item.get('choices', []))
        if not valid:
            raise ValueError(f'Invalid default for {name}')
    return parameters

if __name__ == '__main__':
    print(f'Validated Method with {len(validate(sys.argv[1]))} parameter(s)')
