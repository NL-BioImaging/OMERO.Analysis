export interface LegacyRemoteQueryRecipe {
  bindingId: string;
  outputCsvName: string;
  sql: string;
}

export interface LegacyRemoteQueryUpgrade {
  code: string;
  recipes: LegacyRemoteQueryRecipe[];
}

function safeId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "").slice(0, 96) || "legacy-query";
}

function pythonLiteral(value: string): string {
  return JSON.stringify(value);
}

function stringValue(expression: string): string | null {
  const value = expression.trim();
  const triple = value.match(/^[rubf]*(["']{3})([\s\S]*)\1$/i);
  if (triple) return triple[2];
  const quoted = value.match(/^[rubf]*(["'])([\s\S]*)\1$/i);
  if (!quoted) return null;
  return quoted[2].replace(/\\n/g, "\n").replace(/\\(["'\\])/g, "$1");
}

function assignedSql(code: string, variable: string, tables: Set<string>): string | null {
  const escaped = variable.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^\\s*${escaped}\\s*=\\s*([rubf]*(?:\"\"\"[\\s\\S]*?\"\"\"|'''[\\s\\S]*?'''))\\s*$`, "gim");
  const values = Array.from(code.matchAll(pattern), (match) => stringValue(match[1]))
    .filter((value): value is string => value != null);
  if (values.length === 1) return values[0];
  if (values.length === 2 && /\bif\s+use_foci_view\s*:/.test(code)) {
    return tables.has("foci_assignments") ? values[0] : values[1];
  }
  return null;
}

export function upgradeLegacyDatabaseCode(
  code: string,
  artifactKey: string,
  availableTables: string[],
  sourceName: string
): LegacyRemoteQueryUpgrade | null {
  if (!/duckdb\.connect\s*\(/.test(code)) return null;
  const tables = new Set(availableTables.map((name) => name.toLowerCase()));
  const recipes: LegacyRemoteQueryRecipe[] = [];
  const callPattern = /^(\s*)([A-Za-z_]\w*)\s*=\s*con\.sql\(([\s\S]*?)\)\.df\(\)\s*$/gm;
  let unsupported = false;
  let transformed = code.replace(callPattern, (_match, indent: string, target: string, expression: string) => {
    const direct = stringValue(expression);
    const variable = expression.trim().match(/^[A-Za-z_]\w*$/)?.[0];
    const sql = direct ?? (variable ? assignedSql(code, variable, tables) : null);
    if (!sql) {
      unsupported = true;
      return _match;
    }
    const bindingId = `${safeId(artifactKey)}-${recipes.length + 1}`.slice(0, 128);
    const outputCsvName = `${bindingId}.csv`;
    recipes.push({ bindingId, outputCsvName, sql });
    return `${indent}${target} = pd.read_csv(remote_query_csv(${pythonLiteral(bindingId)}))`;
  });
  if (unsupported || !recipes.length) return null;
  transformed = transformed
    .replace(/^\s*[A-Za-z_]\w*\s*=\s*duckdb\.connect\([^\n]*\)\s*$/gm,
      "# Database query executed by the OMERO remote query worker.")
    .replace(/^\s*con\.close\(\)\s*$/gm, "# Remote query connection is managed by OMERO.Analysis.")
    .replace(/(["'])\/input\/(?:selected_measurements\/)?[^"']+\.(?:duckdb|sqlite|sqlite3)\1/gi,
      () => pythonLiteral(`remote://${sourceName}`));
  const remaining = transformed.match(/\bcon\s*\.(?!close\b)[A-Za-z_]\w*/g) || [];
  if (remaining.length) return null;
  if (!/(?:from\s+omero_analysis_remote\s+import|\bremote_query_csv\s*=)/.test(transformed)) {
    transformed = [
      "# Large OMERO data stays server-side; only bounded query results enter this runtime.",
      "from omero_analysis_remote import query_csv as remote_query_csv",
      "",
      transformed
    ].join("\n");
  }
  return { code: transformed, recipes };
}
