"""Power-cut the disposable VM at real source/result cache publication boundaries."""
import argparse
import json
from pathlib import Path
import subprocess
import time
import uuid

ROOT = Path(__file__).resolve().parents[1]
VM = 'analysis-query-crash-gate'
WORKER = 'query-powercut-data-query-worker-1'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host', default='172.29.128.250')
    parser.add_argument('--output', type=Path, default=ROOT / 'benchmark-data/vm-cache-powercuts.jsonl')
    parser.add_argument('--points', nargs='+')
    args = parser.parse_args()
    if args.output.exists():
        parser.error('Choose a new evidence file')
    gate = ROOT / '.local-query-gates/vm'
    opts = ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=5', '-o', 'ServerAliveInterval=2', '-o',
            'ServerAliveCountMax=2', '-o', 'UserKnownHostsFile=' + str(gate / 'known_hosts'), '-i', str(gate / 'gate-key')]
    target = 'gate@' + args.host
    def remote(command, payload=None, check=True):
        return subprocess.run(['ssh', *opts, target, command], input=json.dumps(payload) if payload is not None else None,
                              capture_output=True, text=True, encoding='utf-8', check=check, timeout=120)
    remote('mkdir -p /home/gate/worker-source')
    subprocess.run(['scp', *opts, '-r', str(ROOT.parent / 'OMERO.DataQueryWorker/src/omero_data_query_worker'),
                    target + ':/home/gate/worker-source/'], check=True)
    subprocess.run(['scp', *opts, str(ROOT / 'scripts/vm_worker_cache_probe.py'), target + ':/home/gate/'], check=True)
    override = {'services': {'data-query-worker': {'environment': {'PYTHONPATH': '/gate-source'},
        'command': ['python', '/gate-probe.py', 'serve'], 'volumes': [
            '/home/gate/worker-source:/gate-source:ro', '/home/gate/vm_worker_cache_probe.py:/gate-probe.py:ro']}}}
    remote('cat > /home/gate/cache-gate.json', override)
    compose = 'sudo docker compose -p query-powercut --env-file /home/gate/.gate.env -f /home/gate/compose.query-gates.yaml'
    remote(compose + ' -f /home/gate/cache-gate.json up -d --no-deps data-query-worker')
    command = f'sudo docker exec -i {WORKER} python /gate-probe.py'
    def ready():
        deadline = time.monotonic() + 120
        while time.monotonic() < deadline:
            response = remote(command, {'mode': 'ready'}, check=False)
            if response.returncode == 0:
                return
            time.sleep(1)
        raise RuntimeError('Worker readiness deadline exceeded')
    try:
        ready()
        baseline = json.loads(remote(command, {'mode': 'baseline', 'run': uuid.uuid4().hex}).stdout)
        points = args.points or [kind + ':' + phase for kind in ('sources', 'results')
                  for phase in ('before-rename', 'after-rename', 'after-fsync')]
        for index, point in enumerate(points):
            data = {**baseline, 'point': point, 'index': index}
            row = {'point': point, 'status': 'failed'}
            process = None
            try:
                remote(command, {**data, 'mode': 'arm'})
                remote('sync')
                process = subprocess.Popen(['ssh', *opts, target, command], stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8')
                process.stdin.write(json.dumps({**data, 'mode': 'pause'}))
                process.stdin.close()
                deadline = time.monotonic() + 90
                while time.monotonic() < deadline:
                    marker = remote(f'sudo docker exec {WORKER} cat /var/lib/omero-data-query-worker/.gate-marker', check=False)
                    if marker.returncode == 0 and marker.stdout == point:
                        break
                    if process.poll() is not None:
                        raise RuntimeError('Publication probe exited: ' + process.stderr.read()[-1500:])
                    time.sleep(.2)
                else:
                    raise RuntimeError('Publication barrier timeout')
                subprocess.run(['powershell', '-NoProfile', '-Command', f"Stop-VM -Name '{VM}' -TurnOff -Force"], check=True)
                began = time.monotonic()
                subprocess.run(['powershell', '-NoProfile', '-Command', f"Start-VM -Name '{VM}'"], check=True)
                ready()
                row.update(json.loads(remote(command, {**data, 'mode': 'recover'}).stdout), recovery_seconds=time.monotonic()-began)
            except Exception as exc:
                row['error'] = str(exc)
                row['worker_logs'] = remote(f'sudo docker logs --tail 80 {WORKER}', check=False).stderr
                if isinstance(exc, subprocess.CalledProcessError):
                    row['diagnostic'] = (exc.stderr or '')[-2000:]
                raise
            finally:
                if process:
                    process.wait(timeout=15)
                    process.stdout.close()
                    process.stderr.close()
                args.output.parent.mkdir(parents=True, exist_ok=True)
                with args.output.open('a', encoding='utf-8') as handle:
                    handle.write(json.dumps(row) + '\n')
                print(json.dumps(row), flush=True)
    finally:
        remote(compose + ' up -d --no-deps data-query-worker')


if __name__ == '__main__':
    main()
