"""Fail before publishing when the main release tag does not match package metadata."""
import os
import json
import tomllib
from pathlib import Path
from analysis_release import release_version

version = tomllib.loads(Path('pyproject.toml').read_text(encoding='utf-8'))['project']['version']
release_version(version)
plugin_version = json.loads(Path('plugin.json').read_text(encoding='utf-8'))['version']
if plugin_version != version:
    raise SystemExit(f'Agent Plugin version must match Analysis {version}, got {plugin_version}')
frontend_version = json.loads(Path('frontend/package.json').read_text(encoding='utf-8'))['version']
if frontend_version != version:
    raise SystemExit(f'Frontend version must match Analysis {version}, got {frontend_version}')
if os.environ.get('GITHUB_REF_NAME') != f'v{version}':
    raise SystemExit(f'Release tag must be v{version}')
