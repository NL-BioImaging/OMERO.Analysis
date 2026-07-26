import { BASE_URL, CHAT_URL, PROVIDER_NAME, TEMPERATURE, TOOLS } from "./constants";

describe("AmsterdamUMC provider", () => {
  it("keeps the exact endpoint contract and fixed temperature", () => {
    expect(PROVIDER_NAME).toBe("AmsterdamUMC");
    expect(BASE_URL).toBe(
      "https://aumc-aicode-openai-swedencentral-oai.openai.azure.com/openai/v1"
    );
    expect(CHAT_URL).toBe(`${BASE_URL}/chat/completions`);
    expect(TEMPERATURE).toBe(1);
  });

  it("exposes only the bounded analysis tools", () => {
    expect(TOOLS.map((tool) => tool.function.name)).toEqual([
      "list_workspace_files",
      "run_python",
      "reset_python"
    ]);
  });
});

