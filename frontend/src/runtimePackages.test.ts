import { runInNewContext } from 'node:vm';
import { runtimeWorker } from './runtime';

test('vendored extras load only when needed and Python remains offline', async () => {
  const messages: any[] = [], installs: string[] = [];
  let receive: (event: { data: unknown }) => void = () => {};
  const pyodide = { loadPackage: async () => {}, runPythonAsync: async () => 'null', globals: { set() {} },
    FS: { mkdirTree() {}, readdir: () => ['.', '..'] }, setStdout() {}, setStderr() {},
    pyimport: () => ({ install: async (url: string) => { installs.push(url); }, destroy() {} }) };
  const context: any = { mockModule: { loadPyodide: async () => pyodide }, fetch: async () => ({ ok: true }),
    postMessage: (message: unknown) => messages.push(message), addEventListener: (_name: string, listener: typeof receive) => { receive = listener; } };
  const source = runtimeWorker('https://omero.example/runtime').replace('const module = await import(runtimeBase + "/pyodide.mjs");', 'const module = globalThis.mockModule;');
  runInNewContext(source, context);
  await vi.waitFor(() => expect(context.XMLHttpRequest).toBeDefined());
  expect(installs).toEqual([]);
  receive({ data: { source: 'oa-parent', id: 'analysis', type: 'run', value: { code: 'import seaborn' } } });
  await vi.waitFor(() => expect(messages.some(message => message.id === 'analysis' && message.type === 'result')).toBe(true));
  expect(installs).toHaveLength(1);
  expect(installs[0]).toContain('/seaborn-0.13.2-');
  await expect(context.fetch('https://external.example')).rejects.toThrow('disabled');
});
