"""Install built wheels without runtime dependencies and verify every packaged file."""
import hashlib
from pathlib import Path
import subprocess
import sys
import tempfile
import zipfile

def main():
    wheels = [wheel for directory in sys.argv[1:] for wheel in Path(directory).glob('*.whl')]
    if not wheels:
        raise SystemExit('No wheels to verify')
    with tempfile.TemporaryDirectory(prefix='analysis-wheel-check-') as directory:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '--no-deps', '--target', directory,
                        *map(str, wheels)], check=True)
        for wheel in wheels:
            with zipfile.ZipFile(wheel) as archive:
                for member in archive.infolist():
                    if member.is_dir() or '.dist-info/' in member.filename:
                        continue
                    installed_name = member.filename
                    if '.data/data/' in installed_name:
                        installed_name = installed_name.split('.data/data/', 1)[1]
                    installed = Path(directory) / installed_name
                    if not installed.is_file() or hashlib.sha256(installed.read_bytes()).digest() != hashlib.sha256(archive.read(member)).digest():
                        raise SystemExit(f'Installed file differs from wheel: {member.filename}')
    print(f'Verified clean installation of {len(wheels)} wheel(s)')

if __name__ == '__main__':
    main()
