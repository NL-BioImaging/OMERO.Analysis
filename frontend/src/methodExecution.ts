import type { InputContract, MethodRecord, MethodVersion, ParameterDefinition, RemoteQueryBinding } from './types';

export interface MethodExecutionContract {
  inputContract?: InputContract;
  parameters: ParameterDefinition[];
  remoteQueryBindings: RemoteQueryBinding[];
  requiredCapabilities: string[];
  provenance: 'versioned' | 'legacy';
}

export function methodContract(method: MethodRecord, version: MethodVersion): MethodExecutionContract {
  return version.executionContract || {
    inputContract: method.inputContract,
    parameters: method.parameters || [],
    remoteQueryBindings: method.remoteQueryBindings || [],
    requiredCapabilities: method.requiredCapabilities || [],
    provenance: 'legacy'
  };
}

export function snapshotMethodContract(method: MethodRecord): MethodExecutionContract {
  return structuredClone({ ...methodContract(method, {} as MethodVersion), provenance: 'versioned' });
}

export function declaredMethodParameters(code: string): ParameterDefinition[] | null {
  const match = code.match(/^OA_METHOD_PARAMETERS_JSON\s*=\s*r?("""|''')([\s\S]*?)\1/m);
  if (!match) return null;
  const definitions = JSON.parse(match[2]);
  if (!Array.isArray(definitions) || definitions.some(item => !item || typeof item.name !== 'string' ||
      !['string', 'number', 'boolean', 'choice'].includes(item.type))) throw new Error('Invalid Method parameter declaration');
  if (new Set(definitions.map(item => item.name)).size !== definitions.length) throw new Error('Duplicate Method parameter');
  resolveMethodParameters(definitions.map(item => ({ ...item, required: false })));
  return definitions;
}

export function captureCurrentMethodContract(method: MethodRecord): MethodRecord {
  const version = method.versions.find(item => item.version === method.currentVersion);
  if (!version || version.executionContract) return method;
  const updated = { ...method, parameters: declaredMethodParameters(version.code) ?? method.parameters ?? [] };
  return { ...updated, versions: updated.versions.map(item => item === version
    ? { ...item, executionContract: snapshotMethodContract(updated) } : item) };
}

export function resolveMethodParameters(definitions: ParameterDefinition[], supplied: Record<string, unknown> = {}): Record<string, string | number | boolean> {
  const known = new Set(definitions.map(item => item.name));
  for (const name of Object.keys(supplied)) if (!known.has(name)) throw new Error(`Unknown Method parameter: ${name}`);
  const result: Record<string, string | number | boolean> = {};
  for (const parameter of definitions) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(parameter.name) || ['__proto__', 'constructor', 'prototype'].includes(parameter.name)) throw new Error(`Invalid Method parameter: ${parameter.name}`);
    const value = supplied[parameter.name] ?? parameter.defaultValue;
    const valid = parameter.type === 'number' ? typeof value === 'number' && Number.isFinite(value)
      : parameter.type === 'boolean' ? typeof value === 'boolean'
      : typeof value === 'string' && (parameter.type !== 'choice' || Boolean(parameter.choices?.includes(value)));
    if (!valid || parameter.required && value === '') throw new Error(`Provide a valid value for ${parameter.label || parameter.name}`);
    result[parameter.name] = value as string | number | boolean;
  }
  return result;
}

/** Keep the original module docstring/future imports valid. Values never become executable Python. */
export function parameterizedMethodCode(code: string, values: Record<string, string | number | boolean>): string {
  const json = JSON.stringify(Object.fromEntries(Object.entries(values).sort(([a], [b]) => a.localeCompare(b))));
  // Execute the source in its own namespace, preserving __future__ statements and traceback line numbers.
  return `import json as _oa_parameter_json\nOA_PARAMETERS = _oa_parameter_json.loads(${JSON.stringify(json)})\nexec(compile(${JSON.stringify(code)}, '<analysis-method>', 'exec'), globals())\n`;
}
