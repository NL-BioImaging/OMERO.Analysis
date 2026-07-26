import { sandboxDocument } from "./runtime";

describe("Python sandbox", () => {
  const document = sandboxDocument("https://omero.example/omero_analysis_chat/runtime");

  it("uses an opaque iframe CSP that permits only runtime-origin connections", () => {
    expect(document).toContain("default-src 'none'");
    expect(document).toContain("connect-src https://omero.example");
    expect(document).toContain("new Worker");
    expect(document).toContain('worker-src blob:');
    expect(document).toContain("'wasm-unsafe-eval'");
    expect(document).not.toContain("connect-src *");
    expect(document).not.toContain("allow-same-origin");
  });

  it("does not embed OMERO or Azure credentials", () => {
    expect(document).not.toContain("api-key");
    expect(document).not.toContain("context_token");
    expect(document).not.toContain("aumc-aicode");
  });
});
