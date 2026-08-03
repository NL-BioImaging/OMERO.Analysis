export type LocalAiProviderKind = "lm-studio" | "ollama" | "openai-compatible";

export interface LocalAiServer {
  kind: LocalAiProviderKind;
  name: string;
  endpoint: string;
  models: string[];
  capabilities: Record<string, ModelCapabilities>;
}

export type CapabilityState = "supported" | "unsupported" | "unknown";
export interface ModelCapabilities {
  vision: CapabilityState;
  tools: CapabilityState;
  source: "lm-studio" | "ollama" | "registry" | "probe" | "unknown";
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
    return {
      ...candidate,
      models,
      capabilities: await nativeCapabilities(candidate, models, controller.signal)
    };
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("timed out");
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

function state(value: unknown): CapabilityState {
  return value === true ? "supported" : value === false ? "unsupported" : "unknown";
}

async function nativeCapabilities(
  candidate: LocalAiCandidate,
  models: string[],
  signal: AbortSignal
): Promise<Record<string, ModelCapabilities>> {
  const unknown = () => Object.fromEntries(models.map((model) => [model, {
    vision: "unknown" as const,
    tools: "unknown" as const,
    source: "unknown" as const
  }]));
  try {
    const endpoint = new URL(candidate.endpoint);
    if (candidate.kind === "lm-studio") {
      const response = await fetch(new URL("/api/v1/models", endpoint.origin), {
        credentials: "omit", cache: "no-store", signal
      });
      if (!response.ok) return unknown();
      const body = await response.json() as Record<string, unknown>;
      const entries = Array.isArray(body.models) ? body.models
        : Array.isArray(body.data) ? body.data : [];
      const result: Record<string, ModelCapabilities> = unknown();
      for (const raw of entries) {
        if (!raw || typeof raw !== "object") continue;
        const item = raw as Record<string, any>;
        const model = String(item.key || item.id || item.model || "");
        if (!model || !result[model]) continue;
        const capabilities = item.capabilities || {};
        result[model] = {
          vision: state(capabilities.vision ?? item.vision),
          tools: state(capabilities.trained_for_tool_use ?? capabilities.tool_use ?? item.trained_for_tool_use),
          source: "lm-studio"
        };
      }
      return result;
    }
    if (candidate.kind === "ollama") {
      const pairs = await Promise.all(models.map(async (model) => {
        try {
          const response = await fetch(new URL("/api/show", endpoint.origin), {
            method: "POST",
            credentials: "omit",
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model }),
            signal
          });
          const body = response.ok ? await response.json() as Record<string, unknown> : {};
          const values = Array.isArray(body.capabilities) ? body.capabilities.map(String) : [];
          return [model, {
            vision: values.length ? (values.includes("vision") ? "supported" : "unsupported") : "unknown",
            tools: values.length ? (values.includes("tools") ? "supported" : "unsupported") : "unknown",
            source: "ollama"
          } satisfies ModelCapabilities] as const;
        } catch {
          return [model, unknown()[model]] as const;
        }
      }));
      return Object.fromEntries(pairs);
    }
  } catch {
    return unknown();
  }
  return unknown();
}

export function modelCapabilities(
  endpoint: string,
  model: string,
  servers: readonly LocalAiServer[]
): ModelCapabilities {
  if (/^gpt-5(?:[-.]|$)/i.test(model.trim())) {
    return { vision: "supported", tools: "supported", source: "registry" };
  }
  let normalized = "";
  try {
    normalized = normalizeOpenAiBaseUrl(endpoint).toLowerCase();
  } catch {
    return { vision: "unknown", tools: "unknown", source: "unknown" };
  }
  const server = servers.find((item) => item.endpoint.toLowerCase() === normalized);
  return server?.capabilities[model] || {
    vision: "unknown", tools: "unknown", source: "unknown"
  };
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
