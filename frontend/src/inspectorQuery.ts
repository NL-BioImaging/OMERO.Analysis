export const PAGE_SIZE = 100;
export const quoteIdentifier = (name: string) => '"' + name.replace(/"/g, '""') + '"';
export function readOnlyQuery(sql: string): string {
  const clean = sql.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, " ").trim().replace(/;\s*$/, "");
  if (!/^(select|with)\b/i.test(clean) || clean.includes(";") ||
      /\b(attach|copy|pragma|install|load|create|alter|drop|insert|update|delete|merge|call|set|reset|export|import)\b/i.test(clean) ||
      /\b(read_\w+|sqlite_scan|postgres_scan|httpfs|delta_scan|iceberg_scan|shell|system)\s*\(/i.test(clean))
    throw new Error("Use a single read-only SELECT query. File access and database changes are disabled.");
  return clean;
}
export function pageQuery(sql: string, page: number): string {
  if (!Number.isSafeInteger(page) || page < 0) throw new Error("Invalid page");
  return `SELECT * FROM (${readOnlyQuery(sql)}) AS inspector_page LIMIT ${PAGE_SIZE} OFFSET ${page * PAGE_SIZE}`;
}
export function browseQuery(table: string, columns: string[], filterColumn = "", filter = "", sort = "", descending = false): { sql: string; parameters: Record<string, { type: string; value: unknown }> } {
  return {
    sql: `SELECT ${columns.length ? columns.map(quoteIdentifier).join(", ") : "*"} FROM ${quoteIdentifier(table)}` +
      (filterColumn && filter ? ` WHERE CAST(${quoteIdentifier(filterColumn)} AS VARCHAR) LIKE $filter ESCAPE '\\'` : "") +
      (sort ? ` ORDER BY ${quoteIdentifier(sort)} ${descending ? "DESC" : "ASC"}` : ""),
    parameters: filterColumn && filter ? { "filter": { type: "string", value: `%${filter.replace(/[\\%_]/g, c => "\\" + c)}%` } } : {}
  };
}
export function resultCsv(columns: string[], rows: unknown[][]): string {
  const quote = (value: unknown) => {
    const text = value == null ? "" : String(value);
    // Neutralize formula execution when a downloaded preview is opened in a spreadsheet.
    return '"' + (/^[=+\-@\t\r]/.test(text) ? "'" + text : text).replace(/"/g, '""') + '"';
  };
  return [columns, ...rows].map(row => row.map(quote).join(",")).join("\r\n");
}
