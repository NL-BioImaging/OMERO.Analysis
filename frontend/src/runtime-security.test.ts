import { runtimeWorker, sandboxUrl } from "./runtime";

describe("Python sandbox", () => {
  const worker = runtimeWorker("https://omero.example/omero_analysis/runtime/");

  it("uses a real sandbox document so the production CSP cannot block srcdoc bootstrapping", () => {
    expect(sandboxUrl("https://omero.example/omero_analysis/runtime/"))
      .toBe("https://omero.example/omero_analysis/runtime-sandbox/");
  });

  it("does not embed OMERO or Azure credentials", () => {
    expect(worker).not.toContain("api-key");
    expect(worker).not.toContain("context_token");
    expect(worker).not.toContain("aumc-aicode");
  });

  it("reports meaningful boot stages without weakening the sandbox", () => {
    expect(worker).toContain("Loading the browser Python engine");
    expect(worker).toContain("Loading data-analysis packages");
    expect(worker).toContain('["micropip","numpy","pandas"');
    expect(worker).toContain('required.push("scipy")');
    expect(worker).toContain("Loading seaborn plotting support");
    expect(worker).toContain('message.type === "begin"');
    expect(worker).toContain('removeTree("/output")');
    expect(worker).toContain("outputState()");
    expect(worker).toContain("Network access is disabled in Analysis Python");
    expect(worker).toContain("globalThis.fetch = denyNetwork");
    expect(worker).toContain('message.type === "clear_inputs"');
    expect(worker).toContain('message.type === "profile"');
  });
});
