import {
  normalizeOpenAiBaseUrl,
  modelCapabilities,
  scanLocalAiServers
} from "./localProviders";

describe("local AI provider discovery", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("normalizes base, models, and chat-completions URLs", () => {
    expect(normalizeOpenAiBaseUrl("http://localhost:1234/v1/"))
      .toBe("http://localhost:1234/v1");
    expect(normalizeOpenAiBaseUrl("http://localhost:1234/v1/models"))
      .toBe("http://localhost:1234/v1");
    expect(normalizeOpenAiBaseUrl("http://localhost:1234/v1/chat/completions"))
      .toBe("http://localhost:1234/v1");
  });

  it("rejects non-HTTP and credential-bearing URLs", () => {
    expect(() => normalizeOpenAiBaseUrl("file:///tmp/model"))
      .toThrow("HTTP or HTTPS");
    expect(() => normalizeOpenAiBaseUrl("http://user:secret@localhost:1234/v1"))
      .toThrow("credentials");
  });

  it("detects LM Studio and filters embedding-only models", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.startsWith("http://localhost:1234/")) {
        return new Response(JSON.stringify({
          object: "list",
          data: [
            { id: "google/gemma-4-12b", object: "model" },
            { id: "text-embedding-nomic-embed-text-v1.5", object: "model" }
          ]
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      throw new TypeError("Failed to fetch");
    }));

    const result = await scanLocalAiServers("", 100);
    expect(result.servers).toEqual([{
      kind: "lm-studio",
      name: "LM Studio",
      endpoint: "http://localhost:1234/v1",
      models: ["google/gemma-4-12b"],
      capabilities: {
        "google/gemma-4-12b": {
          vision: "unknown", tools: "unknown", source: "lm-studio"
        }
      }
    }]);
    expect(result.failures).toHaveLength(1);
  });

  it("supports a manually entered compatible URL", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
      if (String(input) === "http://127.0.0.1:8080/openai/models") {
        return new Response(JSON.stringify({
          data: [{ id: "local-chat-model" }]
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      throw new TypeError("not running");
    }));

    const result = await scanLocalAiServers(
      "http://127.0.0.1:8080/openai",
      100
    );
    expect(result.servers).toContainEqual({
      kind: "openai-compatible",
      name: "Local OpenAI-compatible server",
      endpoint: "http://127.0.0.1:8080/openai",
      models: ["local-chat-model"],
      capabilities: {
        "local-chat-model": {
          vision: "unknown", tools: "unknown", source: "unknown"
        }
      }
    });
  });

  it("uses curated GPT-5 capabilities and discovered model metadata", () => {
    expect(modelCapabilities("https://api.openai.com/v1", "gpt-5", []))
      .toEqual({ vision: "supported", tools: "supported", source: "registry" });
    expect(modelCapabilities("http://localhost:1234/v1", "vision-model", [{
      kind: "lm-studio",
      name: "LM Studio",
      endpoint: "http://localhost:1234/v1",
      models: ["vision-model"],
      capabilities: {
        "vision-model": { vision: "supported", tools: "unsupported", source: "lm-studio" }
      }
    }])).toEqual({ vision: "supported", tools: "unsupported", source: "lm-studio" });
  });
});
