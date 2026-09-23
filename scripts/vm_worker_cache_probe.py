"""Test-only entrypoint and cache probe for the isolated power-cut VM."""
import hashlib
import json
import os
from pathlib import Path
import sys
import time
import urllib.request

ROOT = Path('/var/lib/omero-data-query-worker')


def entrypoint():
    from omero_data_query_worker import cache
    published = {}
    def pause(point):
        arm = ROOT / '.gate-arm'
        if not arm.exists() or arm.read_text() != point:
            return
        # Consume the arm durably, so restart can execute normally.
        arm.unlink()
        identity = ROOT / '.gate-target'
        with identity.open('w') as handle:
            handle.write(published[point.split(':')[0]])
            handle.flush()
            os.fsync(handle.fileno())
        marker = ROOT / '.gate-marker'
        with marker.open('w') as handle:
            handle.write(point)
            handle.flush()
            os.fsync(handle.fileno())
        # Do not sync the source/result parent at this test barrier.
        cache.sync_directory(ROOT)
        while True:
            time.sleep(.1)
    original_replace = cache.os.replace
    original_sync = cache.sync_directory
    def replace(source, target):
        kind = Path(target).parent.name
        publish = kind in ('sources', 'results') and Path(source).is_dir()
        if publish:
            published[kind] = str(target)
            pause(kind + ':before-rename')
        original_replace(source, target)
        if publish:
            pause(kind + ':after-rename')
    def sync(path):
        original_sync(path)
        if Path(path).name in ('sources', 'results'):
            pause(Path(path).name + ':after-fsync')
    cache.os.replace = replace
    cache.sync_directory = sync
    import uvicorn
    uvicorn.run('omero_data_query_worker.app:app', host='0.0.0.0', port=8080)


def probe():
    data = json.load(sys.stdin)
    def request(path, body=None, content_type='application/json'):
        raw = body if isinstance(body, bytes) else json.dumps(body).encode() if body is not None else None
        req = urllib.request.Request('http://127.0.0.1:8080' + path, data=raw, headers={
            'Authorization': 'Bearer ' + os.environ['DQW_API_TOKEN'], 'Content-Type': content_type})
        with urllib.request.urlopen(req, timeout=60) as response:
            content = response.read()
            return content if path.endswith('/download') else json.loads(content)
    def source(reference):
        boundary = 'query-gate-boundary'
        content = b'id,name\n1,alpha\n2,beta\n'
        fields = {'scope_id': 'vm-cache-' + data['run'], 'source_ref': reference, 'format': 'csv', 'size': str(len(content))}
        parts = [f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode() for k,v in fields.items()]
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="source.csv"\r\nContent-Type: text/csv\r\n\r\n'.encode() + content + f'\r\n--{boundary}--\r\n'.encode())
        return request('/v1/sources', b''.join(parts), 'multipart/form-data; boundary=' + boundary)
    def query(identifier, value):
        return request('/v1/sources/' + identifier + '/query', {'sql': 'SELECT * FROM data WHERE id >= $n ORDER BY id',
            'parameters': {'n': {'type': 'integer', 'value': value}}})
    mode = data['mode']
    if mode == 'ready':
        request('/health/ready')
        print('{"ready":true}')
        return
    if mode == 'baseline':
        baseline = source('baseline')
        result = query(baseline['source_id'], 0)
        print(json.dumps({'run': data['run'], 'source': baseline['source_id'], 'result': result['result_id'],
                          'sha256': result['execution']['result_sha256']}))
        return
    if mode == 'arm':
        (ROOT / '.gate-marker').unlink(missing_ok=True)
        (ROOT / '.gate-arm').write_text(data['point'])
        return
    if mode == 'pause':
        if data['point'].startswith('sources:'):
            source(data['point'].replace(':', '-'))
        else:
            query(data['source'], data['index'] + 1)
        raise AssertionError('Publication barrier not reached')
    if mode == 'recover':
        # Startup must have removed every interrupted staging directory.
        assert list((ROOT / 'tmp').iterdir()) == []
        if data['point'].endswith(':after-fsync'):
            assert Path((ROOT / '.gate-target').read_text()).is_dir(), 'Durably published entry was lost'
        assert hashlib.sha256(request('/v1/results/' + data['result'] + '/download')).hexdigest() == data['sha256']
        for kind in ('sources', 'results'):
            for path in (ROOT / kind).iterdir():
                manifest = json.loads((path / 'manifest.json').read_text())
                filename = manifest['data_file' if kind == 'sources' else 'result_file']
                expected = manifest['data_sha256'] if kind == 'sources' else manifest['execution']['result_sha256']
                with (path / filename).open('rb') as handle:
                    assert hashlib.file_digest(handle, 'sha256').hexdigest() == expected
        new = source('followup-' + data['point'].replace(':', '-'))
        result = query(new['source_id'], 0)
        assert result['execution']['result_sha256'] == data['sha256']
        print(json.dumps({'status': 'passed', 'cache_integrity': 'passed', 'fresh_ingestion_query': 'passed'}))


if __name__ == '__main__':
    entrypoint() if len(sys.argv) > 1 and sys.argv[1] == 'serve' else probe()
