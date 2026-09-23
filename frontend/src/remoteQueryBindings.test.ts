import {
  bindRemoteQueryCode,
  dataQueryBindingCandidates,
  remoteBindingId
} from "./remoteQueryBindings";
import type { RemoteQueryBindingV1, RemoteQueryBindingV2, WorkspaceFile } from "./types";

const portable: RemoteQueryBindingV2 = {
  version: 2,
  bindingId: "cells-per-well",
  capability: "omero-data-query-v1",
  format: "duckdb",
  sourceName: "plate-a.duckdb",
  preferredAnnotationId: 752,
  preferredFileId: 99,
  schemaDigest: "schema",
  sql: "SELECT plate_row, plate_column, count(*) AS cell_count FROM object_features GROUP BY 1, 2",
  parameters: {},
  outputCsvName: "remote-cells-per-well.csv"
};

describe("portable data query Methods", () => {
  it("replaces a persisted /input CSV dependency with a runtime broker binding", () => {
    const code = 'import pandas as pd\ndf = pd.read_csv("/input/remote-cells-per-well.csv")';
    const rebound = bindRemoteQueryCode(code, [portable]);
    expect(rebound).toContain("from omero_analysis_remote import query_csv as remote_query_csv");
    expect(rebound).toContain('pd.read_csv(remote_query_csv("cells-per-well"))');
    expect(rebound).not.toContain("/input/remote-cells-per-well.csv");
  });

  it("leaves new remote-query code stable", () => {
    const code = 'from omero_analysis_remote import query_csv as remote_query_csv\npath = remote_query_csv("cells-per-well")';
    expect(bindRemoteQueryCode(code, [portable])).toBe(code);
  });

  it("provides a stable compatibility id for v1 bindings", () => {
    const legacy: RemoteQueryBindingV1 = {
      version: 1,
      capability: "omero-data-query-v1",
      annotationId: 752,
      fileId: 99,
      format: "duckdb",
      sourceDigest: "source",
      schemaDigest: "schema",
      sql: "SELECT 1",
      parameters: {},
      outputCsvName: "query.csv"
    };
    expect(remoteBindingId(legacy)).toBe("legacy-query.csv");
  });

  it("rebinds the same recipe to both small local and large remote OMERO databases", () => {
    const base = {
      workspaceId: "workspace",
      logicalPath: "/workspace/input/source.duckdb",
      type: "application/octet-stream",
      sha256: "",
      source: "omero" as const,
      state: "ready" as const,
      fileId: 1,
      createdAt: "2026-08-10T00:00:00Z"
    };
    const smallLocal: WorkspaceFile = {
      ...base,
      id: "small",
      name: "small-plate.duckdb",
      size: 50 * 1024 * 1024,
      annotationId: 11,
      dataQueryMode: "local",
      data: new ArrayBuffer(0)
    };
    const largeRemote: WorkspaceFile = {
      ...base,
      id: "large",
      name: "large-plate.duckdb",
      size: 5 * 1024 * 1024 * 1024,
      annotationId: 12,
      dataQueryMode: "remote"
    };
    expect(dataQueryBindingCandidates(portable, [smallLocal, largeRemote]).map(
      (file) => file.id
    )).toEqual(["small", "large"]);
  });

  it("does not bind a portable OMERO recipe to an unregistered browser upload", () => {
    const upload = {
      id: "upload",
      workspaceId: "workspace",
      name: "upload.duckdb",
      logicalPath: "/workspace/input/upload.duckdb",
      type: "application/octet-stream",
      size: 10,
      sha256: "hash",
      source: "local" as const,
      state: "ready" as const,
      data: new ArrayBuffer(0),
      createdAt: "2026-08-10T00:00:00Z"
    } satisfies WorkspaceFile;
    expect(dataQueryBindingCandidates(portable, [upload])).toEqual([]);
  });
});
