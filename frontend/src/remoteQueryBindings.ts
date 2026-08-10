import type { RemoteQueryBinding, WorkspaceFile } from "./types";

function pythonString(value: string): string {
  return JSON.stringify(value);
}

function escaped(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function remoteBindingId(binding: RemoteQueryBinding): string {
  if (binding.version === 2) return binding.bindingId;
  return `legacy-${binding.outputCsvName.replace(/[^A-Za-z0-9._-]/g, "-")}`;
}

export function remoteBindingFormat(binding: RemoteQueryBinding): "duckdb" | "sqlite" | "csv" {
  return binding.format;
}

export function remoteBindingPreferredAnnotationId(binding: RemoteQueryBinding): number | undefined {
  return binding.version === 2 ? binding.preferredAnnotationId : binding.annotationId;
}

export function remoteBindingPreferredFileId(binding: RemoteQueryBinding): number | undefined {
  return binding.version === 2 ? binding.preferredFileId : binding.fileId;
}

export function dataQuerySourceFormat(
  file: Pick<WorkspaceFile, "name">
): "duckdb" | "sqlite" | "csv" | null {
  const name = file.name.toLowerCase();
  if (name.endsWith(".duckdb")) return "duckdb";
  if (name.endsWith(".sqlite") || name.endsWith(".sqlite3")) return "sqlite";
  if (name.endsWith(".csv")) return "csv";
  return null;
}

export function isOmeroDataQuerySource(
  file: Pick<WorkspaceFile, "source" | "annotationId" | "name">
): boolean {
  return file.source === "omero" && Boolean(file.annotationId) &&
    dataQuerySourceFormat(file) !== null;
}

/**
 * A saved query recipe is intentionally independent from the source's current
 * local/remote transfer mode. Size changes must therefore never remove an
 * otherwise compatible OMERO source from the rebinding candidates.
 */
export function dataQueryBindingCandidates(
  binding: RemoteQueryBinding,
  files: WorkspaceFile[]
): WorkspaceFile[] {
  return files.filter((file) =>
    !file.deletedAt && file.state === "ready" && isOmeroDataQuerySource(file) &&
    dataQuerySourceFormat(file) === remoteBindingFormat(binding)
  );
}

/**
 * Convert legacy Assistant code that opens a materialized /input CSV into a
 * call to the broker-managed runtime binding. New Assistant code already uses
 * remote_query_csv directly and passes through unchanged.
 */
export function bindRemoteQueryCode(
  code: string,
  bindings: RemoteQueryBinding[]
): string {
  let rebound = code;
  let changed = false;
  for (const binding of bindings) {
    const path = `/input/${binding.outputCsvName}`;
    const literal = new RegExp(`(["'])${escaped(path)}\\1`, "g");
    rebound = rebound.replace(literal, () => {
      changed = true;
      return `remote_query_csv(${pythonString(remoteBindingId(binding))})`;
    });
  }
  if (!changed || /(?:from\s+omero_analysis_remote\s+import|\bremote_query_csv\s*=)/.test(rebound)) {
    return rebound;
  }
  return [
    "# OMERO data is rebound and queried through OMERO.Analysis for every run.",
    "from omero_analysis_remote import query_csv as remote_query_csv",
    "",
    rebound
  ].join("\n");
}
