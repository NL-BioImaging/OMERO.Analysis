import { completeNotebookResults, notebookParameterKey } from './notebookResults';
import type { NotebookRecord, WorkspaceFile } from './types';
import type { NotebookRunProvenance } from './notebookProtocol';

const run = (hour: number, threshold = -4): NotebookRunProvenance => ({
  startedAt: `2026-10-12T${hour}:00:00.000Z`, completedAt: `2026-10-12T${hour}:01:00.000Z`,
  parameters: { threshold }, sources: [{ inputId: 'db', name: 'data.duckdb', sourceDigest: 'data1' }],
  outputs: [{ name: 'plot.svg', size: 10 }], status: 'success'
});
const notebook = (runs: NotebookRunProvenance[]) => ({ id: 'nb', name: 'screen.ipynb', protocolRuns: runs } as NotebookRecord);
const file = (id: string, hour: number): WorkspaceFile => ({ id, workspaceId: 'w', notebookId: 'nb',
  name: 'plot.svg', logicalPath: 'root/Notebooks/Results/screen.ipynb/plot.svg', size: 10,
  type: 'image/svg+xml', source: 'result', state: 'ready', sha256: id, createdAt: `2026-10-12T${hour}:00:30.000Z` });

it('replaces equal parameters only after success and preserves different parameters', async () => {
  const runs = [run(10), run(11, -3), run(12)];
  const fresh = { ...file('new', 12), notebookParameterKey: await notebookParameterKey('nb', runs[2]), notebookRunStartedAt: runs[2].startedAt };
  const files = [file('old', 10), file('different', 11), fresh];
  const failed = notebook([...runs.slice(0, 2), { ...runs[2], status: 'failed' }]);
  expect(await completeNotebookResults(files, failed, 'root')).toBe(files);
  const result = await completeNotebookResults(files, notebook(runs), 'root');
  expect(result[0].deletedAt).toBe(runs[2].completedAt);
  expect(result[1].deletedAt).toBeUndefined();
  expect(result[2].deletedAt).toBeUndefined();
  expect(result[0].notebookParameterKey).toBe(result[2].notebookParameterKey);
  expect(result[1].notebookParameterKey).not.toBe(result[2].notebookParameterKey);
});

it('does not guess the ownership of untracked legacy output or touch other notebooks', async () => {
  const legacy = file('legacy', 9), other = { ...file('other', 10), notebookId: 'other' };
  const result = await completeNotebookResults([legacy, other], notebook([run(10)]), 'root');
  expect(result).toEqual([legacy, other]);
});

it('reconciles repeated historical settings while retaining the newest result for each setting', async () => {
  const runs = [run(10, -3), run(11, -3), run(12, -4)];
  const files = [file('older-setting-a', 10), file('latest-setting-a', 11), file('setting-b', 12)];
  const result = await completeNotebookResults(files, notebook(runs), 'root');
  expect(result.filter(item => !item.deletedAt).map(item => item.id)).toEqual(['latest-setting-a', 'setting-b']);
});

it('uses parameter values and source identity, independent of ordering or run time', async () => {
  const first = { ...run(10), parameters: { a: 1, b: 2 } }, second = { ...run(11), parameters: { b: 2, a: 1 } };
  expect(await notebookParameterKey('nb', first)).toBe(await notebookParameterKey('nb', second));
  expect(await notebookParameterKey('nb', first)).not.toBe(await notebookParameterKey('nb', { ...second, sources: [{ ...second.sources[0], sourceDigest: 'different' }] }));
});
