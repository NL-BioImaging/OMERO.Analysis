import cases from '../../tests/fixtures/notebook-contracts.json';
import { parseNotebookProtocol } from './notebookProtocol';
import type { NotebookDocument } from './types';

test.each(cases)('shared protocol conformance: $name', item => {
  const document = { nbformat: 4, nbformat_minor: 5, metadata: {}, cells: [{ cell_type: 'code',
    source: `import omero_analysis_notebook as oan\noan.configure(r"""${JSON.stringify(item.contract)}""")`,
    metadata: { tags: ['omero-analysis-config'] }, outputs: [], execution_count: null }] } as NotebookDocument;
  if (item.valid) expect(parseNotebookProtocol(document)?.inputs[0].id).toBe('data');
  else expect(() => parseNotebookProtocol(document)).toThrow();
});
