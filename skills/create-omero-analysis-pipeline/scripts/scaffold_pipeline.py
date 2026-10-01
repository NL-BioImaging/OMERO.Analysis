import argparse
import json
from pathlib import Path
import uuid

def validate(bundle):
    if bundle.get('schema') != 'nl.bioimaging.analysis.pipeline.v1':
        raise ValueError('Unsupported Pipeline schema')
    methods = {method['id']: method for method in bundle['methods']}
    if not bundle['pipeline']['steps']:
        raise ValueError('Pipeline requires steps')
    for step in bundle['pipeline']['steps']:
        method = methods[step['methodId']]
        if step['methodVersion'] not in {version['version'] for version in method['versions']}:
            raise ValueError('Pinned Method version is missing')
        if not isinstance(step['inputBindings'], dict) or not isinstance(step['parameters'], dict):
            raise ValueError('Bindings and parameters must be objects')

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('output', type=Path)
    parser.add_argument('methods', type=Path, nargs='*')
    parser.add_argument('--validate', action='store_true')
    args = parser.parse_args()
    if args.validate:
        validate(json.loads(args.output.read_text(encoding='utf-8')))
    else:
        methods = [json.loads(path.read_text(encoding='utf-8'))['method'] for path in args.methods]
        bundle = {'schema': 'nl.bioimaging.analysis.pipeline.v1', 'version': 1,
                  'pipeline': {'id': str(uuid.uuid4()), 'name': args.output.stem, 'description': '', 'version': 1,
                               'steps': [{'id': str(uuid.uuid4()), 'methodId': method['id'], 'methodVersion': method['currentVersion'],
                                          'name': method['name'], 'inputBindings': {}, 'parameters': {}} for method in methods]},
                  'methods': methods}
        validate(bundle)
        args.output.write_text(json.dumps(bundle, indent=2) + '\n', encoding='utf-8')
    print('Validated ordered Pipeline and pinned Method versions')

if __name__ == '__main__':
    main()
