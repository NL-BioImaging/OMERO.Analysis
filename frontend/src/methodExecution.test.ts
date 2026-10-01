import { captureCurrentMethodContract, methodContract, parameterizedMethodCode, resolveMethodParameters } from './methodExecution';
import type { MethodRecord } from './types';
import { spawnSync } from 'node:child_process';

test('parameter values change real Python execution, including future imports', () => {
  const code = '"""A reusable Method."""\nfrom __future__ import annotations\nresult = OA_PARAMETERS["factor"] * 2';
  for (const factor of [3, 7]) {
    const executed = spawnSync('python', ['-c', parameterizedMethodCode(code, { factor }) + '\nprint(result)'], { encoding: 'utf8' });
    expect(executed.status, executed.stderr).toBe(0);
    expect(Number(executed.stdout.trim())).toBe(factor * 2);
  }
});

const parameters = [{ name: 'threshold', label: 'Threshold', type: 'number' as const, defaultValue: 3, required: true }];
test('parameters affect executable source and reject invalid or unknown values', () => {
  expect(resolveMethodParameters(parameters, { threshold: 5 })).toEqual({ threshold: 5 });
  expect(() => resolveMethodParameters(parameters, { threshold: NaN })).toThrow();
  expect(() => resolveMethodParameters(parameters, { unknown: 1 })).toThrow('Unknown');
  expect(parameterizedMethodCode('result = OA_PARAMETERS["threshold"]', { threshold: 3 }))
    .not.toEqual(parameterizedMethodCode('result = OA_PARAMETERS["threshold"]', { threshold: 5 }));
});
test('version contracts stay immutable and legacy contracts remain identifiable', () => {
  const original = { parameters, remoteQueryBindings: [], versions: [{ version: 1, code: 'result=1' }], currentVersion: 1 } as unknown as MethodRecord;
  expect(methodContract(original, original.versions[0]).provenance).toBe('legacy');
  const captured = captureCurrentMethodContract(original);
  original.parameters![0].defaultValue = 99;
  expect(methodContract(captured, captured.versions[0]).parameters[0].defaultValue).toBe(3);
});
