"""Publish a compact, credential-free summary only after required evidence passes."""
import argparse
from collections import Counter
import hashlib
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--capacity', type=Path, nargs='+', required=True)
    parser.add_argument('--engines', type=Path, required=True)
    parser.add_argument('--boundaries', type=Path, required=True)
    parser.add_argument('--omero', type=Path, required=True)
    parser.add_argument('--browser', type=Path, required=True)
    parser.add_argument('--vm-promotions', type=Path, required=True)
    parser.add_argument('--vm-cache', type=Path, required=True)
    parser.add_argument('--vm-cache-durable', type=Path, required=True)
    parser.add_argument('--vm-first-directory', type=Path, required=True)
    parser.add_argument('--regression', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    documents = {}
    sources = {}
    for name in ('capacity', 'engines', 'boundaries', 'omero', 'browser', 'vm_promotions', 'vm_cache', 'vm_cache_durable', 'vm_first_directory', 'regression'):
        paths = args.capacity if name == 'capacity' else [getattr(args, name)]
        documents[name], sources[name] = [], []
        for path in paths:
            raw = path.read_bytes()
            rows = [json.loads(line) for line in raw.decode('utf-8-sig').splitlines() if line.strip()]
            if name in ('capacity', 'regression'):
                assert rows[-1].get('event') == 'verdict' and rows[-1]['status'] == 'passed', f'{path}: run incomplete or failed'
            documents[name].extend(rows)
            sources[name].append({'file': path.name, 'sha256': hashlib.sha256(raw).hexdigest()})
    capacity = documents['capacity']
    assert capacity[-1].get('event') == 'verdict' and capacity[-1]['status'] == 'passed', 'Capacity run incomplete or failed'
    requests = [r for r in capacity if r.get('event') == 'request']
    expected = {(fmt, concurrency, repeat, kind, temperature, index)
                for fmt in ('duckdb', 'sqlite', 'csv') for concurrency in (1, 2, 4, 8)
                for repeat in range(3) for kind in ('aggregate', 'full')
                for temperature in ('cold', 'warm') for index in range(concurrency)}
    actual = {(r['format'], r['concurrency'], r['repeat'], r['kind'], r['temperature'], r['index']) for r in requests}
    assert expected == actual and len(requests) == len(expected), 'Missing/duplicate matrix cases'
    assert all(r['rows_requested'] == 10_000_000 for r in requests)
    assert all(r['status'] in ('passed', 'bounded_rejection') for r in requests)
    assert all((r.get('http_status'), r.get('worker_code')) in ((429, 'query_capacity_exceeded'), (507, 'cache_capacity_exceeded'))
               for r in requests if r['status'] == 'bounded_rejection')
    assert all(r['status'] == 'passed' for r in requests if r['concurrency'] == 1)
    assert len(documents['engines']) == 18 and all(r['status'] == 'passed' and r['fresh_query_and_ingestion'] == 'passed' for r in documents['engines'])
    for key, count in (('boundaries', 4), ('omero', 3), ('browser', 3), ('vm_promotions', 10), ('vm_cache', 6), ('vm_cache_durable', 2), ('vm_first_directory', 1)):
        assert len(documents[key]) == count and all(r['status'] == 'passed' for r in documents[key]), key
    assert {(r['case'], r['repeat']) for r in documents['engines']} == {
        (case, repeat) for case in ('duckdb_limit', 'duckdb_cgroup', 'sqlite_cgroup', 'csv_cgroup', 'worker_oom', 'restart') for repeat in range(3)}
    assert all(r['oom_kills'] > 0 for r in documents['engines'] if r['case'].endswith('_cgroup'))
    assert all(r['killed_state']['OOMKilled'] and r['killed_state']['ExitCode'] == 137 for r in documents['engines'] if r['case'] == 'worker_oom')
    assert {r['case'] for r in documents['boundaries']} == {'rows_exact', 'rows_over', 'bytes_exact', 'bytes_over'}
    for key in ('omero', 'browser'):
        assert {r['format'] for r in documents[key]} == {'duckdb', 'sqlite', 'csv'}, key
    assert {r['point'] for r in documents['vm_promotions']} == {
        'csv_file:created', 'csv_file:chunk', 'csv:created', 'recipe_file:created', 'recipe:created',
        'summary:created', 'csv:linked', 'recipe:linked', 'summary:linked', 'complete:recorded'}
    assert {r['point'] for r in documents['vm_cache']} == {
        kind + ':' + phase for kind in ('sources', 'results') for phase in ('before-rename', 'after-rename', 'after-fsync')}
    assert {r['point'] for r in documents['vm_cache_durable']} == {'sources:after-fsync', 'results:after-fsync'}
    assert documents['vm_first_directory'][0]['point'] == 'csv_file:created'
    regression = [r for r in documents['regression'] if r.get('event') == 'request']
    regression_expected = {(fmt, size, repeat, kind, temperature)
                           for fmt in ('duckdb', 'sqlite', 'csv') for size in (1_000_000, 4_000_000)
                           for repeat in range(3) for kind in ('aggregate', 'full')
                           for temperature in ('cold', 'warm')}
    assert len(regression) == len(regression_expected)
    assert {(r['format'], r['rows_requested'], r['repeat'], r['kind'], r['temperature']) for r in regression} == regression_expected
    assert all(r['status'] == 'passed' and r['concurrency'] == 1 for r in regression)
    batches = []
    for row in capacity:
        if row.get('event') != 'batch':
            continue
        item = {k:v for k,v in row.items() if k not in ('event', 'observation')}
        item['bounded_rejection_count'] = item.pop('failure_count')
        observation = row['observation']
        group = observation['cgroup']
        item.update(memory_peak_bytes=int(group['memory.peak']), memory_events=group['memory.events'], cache=observation['cache'])
        batches.append(item)
    overview = []
    for fmt, concurrency, kind, temperature in sorted({(r['format'], r['concurrency'], r['kind'], r['temperature']) for r in requests}):
        selected = [r for r in requests if (r['format'], r['concurrency'], r['kind'], r['temperature']) == (fmt, concurrency, kind, temperature)]
        passed = [r for r in selected if r['status'] == 'passed']
        seconds = sorted(r['seconds'] for r in passed)
        overview.append({'format': fmt, 'concurrency': concurrency, 'kind': kind, 'temperature': temperature,
                         'success_count': len(passed), 'bounded_rejection_count': len(selected) - len(passed),
                         'p50_seconds': seconds[math.ceil(len(seconds) * .5) - 1] if seconds else None,
                         'p95_seconds': seconds[math.ceil(len(seconds) * .95) - 1] if seconds else None,
                         'transfer_bytes': sum(r['transfer_bytes'] for r in passed)})
    report = {'schema': 'analysis-query-release-evidence-v1', 'date': '2026-09-08', 'status': 'passed',
              'evidence': sources, 'capacity_configurations': [r for r in capacity if r.get('event') == 'configuration'],
              'worker_capabilities': [r['value'] for r in capacity if r.get('event') == 'worker_capabilities'],
              'request_outcomes': dict(Counter(r['status'] for r in requests)), 'overview': overview, 'batches': batches,
              'ingestion': [{k:v for k,v in r.items() if k not in ('observation', 'event')} for r in capacity if r.get('event') == 'ingestion'],
              'boundaries': [{k:v for k,v in r.items() if k not in ('observation','logs')} for r in documents['boundaries']],
              'engine_faults': [{**{k:v for k,v in r.items() if k not in ('observation','logs','killed_state')},
                                 **({'killed_state': {k:r['killed_state'][k] for k in ('OOMKilled', 'ExitCode')}} if 'killed_state' in r else {})}
                                for r in documents['engines']],
              'omero': [{k:v for k,v in r.items() if k != 'saved'} for r in documents['omero']],
              'browser': [{'format':r['format'],'seconds':r['seconds'],'sha256':r['sha256'],'status':r['status']} for r in documents['browser']],
              'vm_promotions': documents['vm_promotions'], 'vm_cache': documents['vm_cache'],
              'vm_cache_durable': documents['vm_cache_durable'], 'vm_first_directory': documents['vm_first_directory'],
              'regression': {'request_count': len(regression), 'status': 'passed', 'configurations': [r for r in documents['regression'] if r.get('event') == 'configuration']},
              'limitations': ['Cold query keys retain OS page cache.', 'Cgroup memory includes charged file cache.',
                             'Shared development host; timings are not throughput guarantees.',
                             'Production hardware, storage, OMERO build and engine versions require target acceptance.']}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'status':'passed','requests':len(requests),'outcomes':report['request_outcomes']}))


if __name__ == '__main__':
    main()
