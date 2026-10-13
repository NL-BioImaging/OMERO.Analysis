import { saveFile } from "./storage";
import type { WorkspaceFile } from "./types";

/** Persist remote source references too: their bytes intentionally stay off-browser. */
export async function prepareRemoteInput(
  file: WorkspaceFile,
  readSchema: () => Promise<Record<string, unknown>>
): Promise<WorkspaceFile> {
  let prepared: WorkspaceFile;
  try {
    const schema = await readSchema();
    prepared = { ...file, state: "ready", dataQueryMode: "remote", data: undefined,
      remoteSchemaDigest: String(schema.schema_digest || ""), error: undefined };
  } catch (error) {
    prepared = { ...file, state: "failed", error: `Remote query setup failed: ${String(error)}` };
  }
  // Storage failures must propagate; the interface must not claim a durable binding.
  await saveFile(prepared);
  return prepared;
}
