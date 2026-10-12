import { inputCandidates, inputFileNameMatches } from './notebookProtocol';
import type { NotebookFileInput } from './notebookProtocol';
import type { WorkspaceFile } from './types';

const input: NotebookFileInput = { id: 'template', kind: 'file', path: 'input/PlateLayout.xlsx',
  extensions: ['.xlsx', '.csv'], required: true, filename_globs: ['*template*.xlsx', '*template*.csv'] };
const file = (name: string): WorkspaceFile => ({ id: name, name, source: 'local', state: 'ready' } as WorkspaceFile);

it('finds case-insensitive template filenames and the exact declared workbook', () => {
  expect(inputFileNameMatches(input, 'new-TEMPLATE-plate.CSV')).toBe(true);
  expect(inputFileNameMatches(input, 'PlateLayout.xlsx')).toBe(true);
  expect(inputFileNameMatches(input, 'template.xlsx.exe')).toBe(false);
  expect(inputFileNameMatches(input, 'measurements.csv')).toBe(false);
  expect(inputCandidates(input, [file('a-template.csv'), file('b-template.xlsx')])).toHaveLength(2);
});

it('retains a valid saved binding but never includes deleted, failed or result files', () => {
  const saved = file('my-layout.csv');
  const others = [{ ...file('template.csv'), deletedAt: 'now' }, { ...file('template.xlsx'), source: 'result' as const }];
  expect(inputCandidates(input, [saved, ...others])).toEqual([]);
  expect(inputCandidates(input, [saved, ...others], saved.id)).toEqual([saved]);
  expect(inputCandidates(input, [{ ...saved, state: 'failed' }], saved.id)).toEqual([]);
});

it('handles literal punctuation, question marks and many wildcard segments', () => {
  expect(inputFileNameMatches({ ...input, filename_globs: ['Template (?).csv'] }, 'TEMPLATE (A).csv')).toBe(true);
  expect(inputFileNameMatches({ ...input, filename_globs: ['*a'.repeat(60) + 'b.csv'] }, 'a'.repeat(120) + '.csv')).toBe(false);
});
