import { exportNotebookSource, applyNotebookSource } from './notebookSource';
import type { NotebookRecord } from './types';

const record = (): NotebookRecord => ({ id: 'n1', name: 'screen.ipynb', workspaceId: 'w',
  attachmentIds: [], selectedDataFileIds: [], createdAt: 'now', updatedAt: 'now', document: {
  nbformat: 4, nbformat_minor: 5, metadata: { language_info: { name: 'python' }, widgets: { stale: true } },
  cells: [{ id: 'a', cell_type: 'code', source: 'draft = 7', metadata: {}, execution_count: 1,
    outputs: [{ output_type: 'stream', name: 'stdout', text: 'stale' }] },
  { id: 'b', cell_type: 'markdown', source: '# Notes', metadata: {} }]
} } as NotebookRecord);

it('round trips every draft cell, strips stale output and permits whole-document edits', async () => {
  const current = record(), envelope = JSON.parse(await exportNotebookSource(current));
  expect(envelope.document.cells[0].source).toBe('draft = 7');
  expect(envelope.document.cells[0].outputs).toEqual([]);
  expect(envelope.document.metadata.widgets).toBeUndefined();
  envelope.document.cells = [envelope.document.cells[1], { ...envelope.document.cells[0], source: 'draft = 8' }];
  const changed = await applyNotebookSource(current, JSON.stringify(envelope));
  expect(changed.cells.map(cell => cell.source)).toEqual(['# Notes', 'draft = 8']);
  expect(current.document.cells[0].source).toBe('draft = 7');
});

it('rejects stale revisions and another notebook identity', async () => {
  const current = record(), source = await exportNotebookSource(current);
  current.document.cells[0].source = 'newer user edit';
  await expect(applyNotebookSource(current, source)).rejects.toThrow('draft changed');
  await expect(applyNotebookSource({ ...record(), id: 'other' }, source)).rejects.toThrow('different notebook');
});

it('rejects invalid JSON and invalid portable configuration without mutating the draft', async () => {
  const current = record();
  await expect(applyNotebookSource(current, '{bad')).rejects.toThrow('valid JSON');
  const envelope = JSON.parse(await exportNotebookSource(current));
  envelope.document.cells[0] = { cell_type: 'code', source: 'print(1)', metadata: { tags: ['omero-analysis-config'] } };
  await expect(applyNotebookSource(current, JSON.stringify(envelope))).rejects.toThrow();
  expect(current.document.cells[0].source).toBe('draft = 7');
});
