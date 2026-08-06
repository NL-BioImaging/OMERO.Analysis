import type { Bootstrap } from "./types";

export const EMBEDDED_MESSAGE_SCHEMA = "nl.bioimaging.omero-analysis.host.v1" as const;

export type EmbeddedMessageType =
  | "ready"
  | "dirty-state-changed"
  | "source-title-changed"
  | "request-open-new-tab"
  | "session-expired";

export interface EmbeddedHostMessage {
  schema: typeof EMBEDDED_MESSAGE_SCHEMA;
  source: "omero-analysis";
  type: EmbeddedMessageType;
  payload: Record<string, unknown>;
}

export function embeddedHostMessage(
  bootstrap: Pick<Bootstrap, "embeddedHost">,
  type: EmbeddedMessageType,
  payload: Record<string, unknown> = {}
): EmbeddedHostMessage | null {
  if (bootstrap.embeddedHost !== "biomero") return null;
  return {
    schema: EMBEDDED_MESSAGE_SCHEMA,
    source: "omero-analysis",
    type,
    payload
  };
}

export function postEmbeddedHostMessage(
  bootstrap: Pick<Bootstrap, "embeddedHost">,
  type: EmbeddedMessageType,
  payload: Record<string, unknown> = {}
): boolean {
  const message = embeddedHostMessage(bootstrap, type, payload);
  if (!message || window.parent === window) return false;
  window.parent.postMessage(message, window.location.origin);
  return true;
}
