export type LocalAiProviderKind = "lm-studio" | "ollama" | "openai-compatible";

export interface LocalAiServer {
  kind: LocalAiProviderKind;
  name: string;
  endpoint: string;
  models: string[];
}

export interface LocalAiScan {
  servers: LocalAiServer[];
  failures: string[];
}

interface LocalAiCandidate {
  kind: LocalAiProviderKind;
  name: string;
  endpoint: string;
}

export const DEFAULT_LOCAL_AI_SERVERS: readonly LocalAiCandidate[] = [
  {
    kind: "lm-studio",
    name: "LM Studio",
    endpoint: "http://localhost:1234/v1"
  },
  {
    kind: "ollama",
    name: "Ollama",
    endpoint: "http://localhost:11434/v1"
  }
];

const embeddingModel = /(?:^|[-_/])(embed|embedding|rerank)(?:[-_/]|$)/i;

export function normalizeOpenAiBaseUrl(value: string): string {
  const requested = value.trim();
  if (!requested) throw new Error("Enter a local server URL");
  const parsed = new URL(requested);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("The local server URL must use HTTP or HTTPS");
  }
  if (parsed.username || parsed.password) {
    throw new Error("Do not include credentials in the local server URL");
  }
  if (parsed.search || parsed.hash) {
    throw new Error("The local server URL cannot contain a query or fragment");
  }
  let path = parsed.pathname.replace(/\/+$/, "");
  path = path.replace(/\/chat\/completions$/i, "");
  path = path.replace(/\/models$/i, "");
  parsed.pathname = path || "/";
  return parsed.toString().replace(/\/+$/, "");
}

function candidateForUrl(value: string): LocalAiCandidate {
  const endpoint = normalizeOpenAiBaseUrl(value);
  const parsed = new URL(endpoint);
  if (parsed.port === "1234") {
    return { kind: "lm-studio", name: "LM Studio", endpoint };
  }
  if (parsed.port === "11434") {
    return { kind: "ollama", name: "Ollama", endpoint };
  }
  return {
    kind: "openai-compatible",
    name: "Local OpenAI-compatible server",
    endpoint
  };
}

function modelIds(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  const data = (value as { data?: unknown }).data;
  if (!Array.isArray(data)) return [];
  const ids = data
    .map((item) => (
      item && typeof item === "object" && typeof (item as { id?: unknown }).id === "string"
        ? (item as { id: string }).id.trim()
        : ""
    ))
    .filter(Boolean);
  const chatModels = ids.filter((model) => !embeddingModel.test(model));
  return [...new Set(chatModels.length ? chatModels : ids)].sort();
}

async function probeCandidate(
  candidate: LocalAiCandidate,
  timeoutMs: number
): Promise<LocalAiServer> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${candidate.endpoint}/models`, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const models = modelIds(await response.json());
    if (!models.length) {
      throw new Error("the server returned no models");
    }
    return { ...candidate, models };
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("timed out");
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function scanLocalAiServers(
  manualUrl = "",
  timeoutMs = 2_500
): Promise<LocalAiScan> {
  const candidates = [...DEFAULT_LOCAL_AI_SERVERS];
  if (manualUrl.trim()) candidates.push(candidateForUrl(manualUrl));
  const unique = [...new Map(
    candidates.map((candidate) => [candidate.endpoint.toLowerCase(), candidate])
  ).values()];
  const results = await Promise.allSettled(
    unique.map((candidate) => probeCandidate(candidate, timeoutMs))
  );
  const servers: LocalAiServer[] = [];
  const failures: string[] = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      servers.push(result.value);
    } else {
      const reason = result.reason instanceof Error
        ? result.reason.message
        : String(result.reason);
      failures.push(`${unique[index].name} (${unique[index].endpoint}): ${reason}`);
    }
  });
  return { servers, failures };
}
