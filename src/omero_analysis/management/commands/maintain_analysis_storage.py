"""Reconcile imports and refresh the readable tree without moving OMERO sources."""
import json
import os
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from ...inplace_storage import storage_for
from ...managed_omero import user_id
from ...sync_lock import storage_lock
from ...workspace_sync import (
    _managed_project, _read_manifest, _remote_items, _file_bytes, _username,
    _reconcile_workspace_journals,
)
from .backfill_analysis_storage import _archive_png


class Command(BaseCommand):
    help = 'Inspect/reconcile imports and rebuild named .analysis browsing folders'

    def add_arguments(self, parser):
        mode = parser.add_mutually_exclusive_group(required=True)
        mode.add_argument('--dry-run', action='store_true')
        mode.add_argument('--apply', action='store_true')
        parser.add_argument('--group-id', type=int, required=True)
        parser.add_argument('--host', default='omeroserver')
        parser.add_argument('--username', default=os.environ.get('OMERO_USER', 'root'))
        parser.add_argument('--password', default=os.environ.get('OMERO_PASSWORD'))

    def handle(self, *args, **options):
        from omero.gateway import BlitzGateway
        if not options['password']:
            raise CommandError('Set OMERO_PASSWORD in the process environment')
        conn = BlitzGateway(options['username'], options['password'], host=options['host'], port=4064)
        if not conn.connect():
            raise CommandError('OMERO login failed')
        try:
            conn.SERVICE_OPTS.setOmeroGroup(options['group_id'])
            cap, storage = storage_for(options['group_id'], user_id(conn))
            if storage is None:
                raise CommandError(cap.detail)
            with storage_lock(storage):
                report = self.maintain(conn, storage, options['group_id'], options['apply'])
            self.stdout.write(json.dumps(report, indent=2))
        finally:
            conn.close()

    @staticmethod
    def maintain(conn, storage, group_id, apply):
        project = _managed_project(conn, group_id)
        report = {'apply': apply, 'workspaces': [], 'emptyDirectoriesRemoved': 0}
        for dataset in list(project.listChildren()) if project is not None else []:
            _, manifest = _read_manifest(dataset)
            if not manifest:
                continue
            workspace = manifest['workspace']
            entry = {'workspaceId': workspace['id'], 'name': dataset.getName(),
                     'datasetId': int(dataset.getId()), 'items': len(manifest['items'])}
            report['workspaces'].append(entry)
            if not apply:
                continue
            entry['reconciliation'] = _reconcile_workspace_journals(
                conn, dataset, manifest, storage, workspace['id'])
            old = storage.read_json(storage.workspace_manifest_path(workspace['id'])) or {}
            old_items = {item['key']: item for item in old.get('items', [])}
            items = []
            for key, item in _remote_items(manifest).items():
                blob = (item.get('storage') or {}).get('blob') or old_items.get(key, {}).get('blob')
                flags = old_items.get(key, {}).get('flags', [])
                if not blob:
                    remote = item['remote']
                    if remote['object_type'] == 'Annotation':
                        data = _file_bytes(conn.getObject('FileAnnotation', remote['object_id']))
                    else:
                        data = _archive_png(conn.getObject('Image', remote['object_id']))
                        flags = ['archive-derived']
                    blob = storage.store_blob(data, item['name'])
                items.append({**item, 'blob': blob, 'flags': flags})
            saved = {'workspaceId': workspace['id'], 'workspace': workspace,
                     'datasetId': int(dataset.getId()), 'datasetName': dataset.getName(),
                     'userId': user_id(conn), 'groupId': group_id,
                     'revision': manifest['revision'], 'items': items}
            storage.write_json(storage.workspace_manifest_path(workspace['id']), saved)
            storage.publish_workspace(saved, _username(conn))
        if apply:
            report['emptyDirectoriesRemoved'] = storage.prune_empty_directories()
        return report
