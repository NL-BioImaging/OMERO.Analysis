import type { Bootstrap } from "./types";

export function csrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export class OmeroContextTransport {
  private contextToken = "";
  private operations = new Set<string>();

  constructor(private readonly bootstrap: Bootstrap) {}

  has(operation: string): boolean {
    return this.operations.has(operation);
  }

  async connect(): Promise<void> {
    const context = this.bootstrap.context;
    if (!context) return;
    const response = await fetch(this.bootstrap.tokenUrl, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken()
      },
      body: JSON.stringify({
        object_type: context.object_type,
        object_id: context.object_id
      })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(body.error?.message || `${response.status} ${response.statusText}`);
    }
    if (
      typeof body.context_token !== "string" ||
      !Array.isArray(body.operations) ||
      body.operations.some((value: unknown) => typeof value !== "string")
    ) {
      throw new Error("OMERO returned an invalid context capability");
    }
    this.contextToken = body.context_token;
    this.operations = new Set(body.operations);
  }

  async fetch(
    input: RequestInfo | URL,
    init: RequestInit = {},
    retry = true
  ): Promise<Response> {
    const response = await fetch(input, {
      ...init,
      credentials: "same-origin",
      headers: {
        ...(init.headers || {}),
        "X-OMERO-Analysis-Context": this.contextToken
      }
    });
    if (retry && (response.status === 401 || response.status === 403)) {
      await this.connect();
      return this.fetch(input, init, false);
    }
    return response;
  }
}
