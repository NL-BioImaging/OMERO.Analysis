import { APPROVED_NOTEBOOK_PACKAGES, extensionOf, type NotebookProtocolContract, type NotebookProtocolInput } from "./notebookProtocol";

export interface CompatibilitySource {
  id: string;
  name: string;
  schema?: { tables?: Array<{ name: string; columns?: Array<{ name: string; type?: string }> }> };
}
export interface Compatibility {
  status: "compatible" | "incompatible" | "unchecked";
  reasons: string[];
}

function normalizedType(value: string): string {
  const type = value.trim().toLowerCase().replace(/\(.*/, "");
  if (/^(varchar|text|str|string|object)$/.test(type)) return "string";
  if (/^(tinyint|smallint|integer|int|bigint|int\d+|uint\d+)$/.test(type)) return "integer";
  if (/^(float\d*|double|real|decimal|numeric)$/.test(type)) return "number";
  if (/^(bool|boolean)$/.test(type)) return "boolean";
  return type;
}

export function inputCompatibility(input: NotebookProtocolInput, source: CompatibilitySource): Compatibility {
  const extensions = input.kind === "query" ? input.formats.map(f => `.${f}`) : input.extensions;
  if (!extensions.includes(extensionOf(source.name))) return { status: "incompatible", reasons: ["File format does not match"] };
  if (input.kind === "query" && input.schema?.tables?.length) {
    if (!source.schema?.tables) return { status: "unchecked", reasons: [`${input.id}: schema not checked`] };
    for (const required of input.schema.tables) {
      const table = source.schema.tables.find(t => t.name === required.name);
      if (!table) return { status: "incompatible", reasons: [`${input.id}: missing table ${required.name}`] };
      for (const column of required.columns || []) {
        if (!table.columns) return { status: "unchecked", reasons: [`${input.id}: columns not checked for ${required.name}`] };
        const found = table.columns.find(c => c.name === column.name);
        if (!found) {
          return { status: "incompatible", reasons: [`${input.id}: missing column ${required.name}.${column.name}`] };
        }
        if (column.type && !found.type) return { status: "unchecked", reasons: [`${input.id}: type not checked for ${column.name}`] };
        if (column.type && found.type && normalizedType(column.type) !== normalizedType(found.type)) {
          return { status: "incompatible", reasons: [`${input.id}: ${column.name} requires ${column.type}, found ${found.type}`] };
        }
      }
    }
  }
  return { status: "compatible", reasons: [] };
}

export function notebookCompatibility(contract: NotebookProtocolContract | null | undefined, sources: CompatibilitySource[]): Compatibility {
  if (!contract) return { status: "unchecked", reasons: ["Legacy notebook: no portable input contract"] };
  const unsupported = (contract.requirements || []).map(r => r.split(/[<>=!~]/)[0].toLowerCase().replace(/[_.]/g, "-"))
    .filter(p => !APPROVED_NOTEBOOK_PACKAGES.has(p));
  if (unsupported.length) return { status: "incompatible", reasons: [`Unsupported packages: ${unsupported.join(", ")}`] };
  const missing: string[] = [], unknown: string[] = [], notes: string[] = [];
  if ((contract.requirements || []).some(r => /[<>=!~]/.test(r))) unknown.push("Package version constraints must be checked against the runtime");
  for (const input of contract.inputs.filter(i => i.required)) {
    const statuses = sources.map(s => inputCompatibility(input, s));
    const matches = statuses.filter(s => s.status === "compatible");
    if (matches.length) {
      if (matches.length > 1) notes.push(`${input.id}: choose between ${matches.length} matching inputs`);
    } else if (statuses.some(s => s.status === "unchecked")) unknown.push(`${input.id}: schema not checked`);
    else {
      const reasons = statuses.flatMap(s => s.reasons).filter(r => r !== "File format does not match");
      missing.push(...(reasons.length ? [...new Set(reasons)] : [`Needs a matching input for ${input.id}`]));
    }
  }
  return missing.length ? { status: "incompatible", reasons: missing }
    : unknown.length ? { status: "unchecked", reasons: unknown }
    : { status: "compatible", reasons: notes.length ? notes : ["Declared input requirements match"] };
}

export const compatibilityLabel = { compatible: "Compatible", incompatible: "Incompatible", unchecked: "Not checked" };
