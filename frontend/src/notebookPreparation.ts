import type { NotebookRecord } from "./types";
import { parseNotebookProtocol, parameterDefaults, sanitizeProtocolNotebook } from "./notebookProtocol";
export function typedNotebookQueryParameters(parameters: Record<string, unknown>): Record<string, {
  type: "null" | "boolean" | "integer" | "float" | "string";
  value: unknown;
}> {
  return Object.fromEntries(Object.entries(parameters).map(([name, value]) => {
    if (value == null) return [name, { type: "null", value: null }];
    if (typeof value === "boolean") return [name, { type: "boolean", value }];
    if (typeof value === "number" && Number.isSafeInteger(value)) return [name, { type: "integer", value }];
    if (typeof value === "number" && Number.isFinite(value)) return [name, { type: "float", value }];
    if (typeof value === "string") return [name, { type: "string", value }];
    throw new Error(`Notebook query parameter ${name} must be a JSON scalar`);
  }));
}

export function importedNotebookProtocol(document: NotebookRecord["document"]): Pick<
  NotebookRecord,
  "document" | "parameterValues" | "portabilityWarning"
> {
  const protocol = parseNotebookProtocol(document);
  return protocol
    ? {
        document: sanitizeProtocolNotebook(document),
        parameterValues: parameterDefaults(protocol),
        portabilityWarning: undefined
      }
    : {
        document,
        parameterValues: undefined,
        portabilityWarning: "Legacy notebook: convert it to the portable protocol to rebind between Local and Remote query sources."
      };
}
