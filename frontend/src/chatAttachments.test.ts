import {
  MAX_CHAT_ATTACHMENT_BYTES,
  attachmentKind,
  attachmentTextBudget,
  availableAttachmentName,
  fetchPublicAttachment,
  safeAttachmentName
} from "./chatAttachments";

describe("Chat attachment validation", () => {
  it("accepts strict UTF-8 TXT including a BOM and rejects binary text", () => {
    const valid = new Uint8Array([0xef, 0xbb, 0xbf, ...new TextEncoder().encode("hello")]);
    expect(attachmentKind("notes.txt", "text/plain", valid.buffer)).toEqual({
      kind: "txt", type: "text/plain"
    });
    expect(() => attachmentKind(
      "notes.txt", "text/plain", new Uint8Array([0xc3, 0x28]).buffer
    )).toThrow();
    expect(() => attachmentKind(
      "notes.txt", "text/plain", new Uint8Array([65, 0, 66]).buffer
    )).toThrow(/NUL/);
  });

  it("requires matching signatures and supported extensions", () => {
    expect(attachmentKind(
      "paper.pdf", "application/pdf", new TextEncoder().encode("%PDF-1.7").buffer
    ).kind).toBe("pdf");
    expect(attachmentKind(
      "image.png", "image/png",
      new Uint8Array([0x89, 0x50, 0x4e, 0x47, 13, 10, 26, 10]).buffer
    ).kind).toBe("image");
    expect(() => attachmentKind(
      "page.html", "text/html", new TextEncoder().encode("<html>").buffer
    )).toThrow(/Unsupported/);
  });

  it("sanitizes and deterministically suffixes conflicting names", () => {
    expect(safeAttachmentName("../bad/name.pdf")).toBe("-bad-name.pdf");
    expect(availableAttachmentName("paper.pdf", ["paper.pdf", "paper (2).pdf"]))
      .toBe("paper (3).pdf");
  });

  it("uses the configured context budget policy", () => {
    expect(attachmentTextBudget(0)).toBe(6000);
    expect(attachmentTextBudget(32_000)).toBe(8000);
    expect(attachmentTextBudget(128_000)).toBe(16_000);
  });

  it("rejects webpages and oversized URL responses", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("<html></html>", {
      headers: { "content-type": "text/html" }
    })));
    await expect(fetchPublicAttachment("https://example.org/page"))
      .rejects.toThrow(/Webpages/);
    vi.stubGlobal("fetch", vi.fn(async () => new Response("x", {
      headers: {
        "content-type": "text/plain",
        "content-length": String(MAX_CHAT_ATTACHMENT_BYTES + 1)
      }
    })));
    await expect(fetchPublicAttachment("https://example.org/file.txt"))
      .rejects.toThrow(/25 MiB/);
    vi.unstubAllGlobals();
  });
});
