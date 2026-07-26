import { OmeroBridge } from "./api";
import type { Bootstrap } from "./types";

const bootstrap: Bootstrap = {
  context: {
    object_type: "Dataset",
    object_id: 42,
    name: "Cells",
    user_id: 7,
    group_id: 4,
    can_annotate: true,
    selected_attachments: []
  },
  tokenUrl: "/token/",
  contextTemplate: "/context/TYPE/1/",
  attachmentsTemplate: "/attachments/TYPE/1/",
  hierarchyTemplate: "/hierarchy/TYPE/1/",
  downloadTemplate: "/attachment/1/download/",
  uploadTemplate: "/upload/TYPE/1/",
  snapshotsTemplate: "/snapshots/TYPE/1/",
  snapshotUploadTemplate: "/snapshots/TYPE/1/",
  snapshotDownloadTemplate: "/snapshot/1/download/",
  workflowTemplatesTemplate: "/workflows/TYPE/1/",
  workflowDownloadTemplate: "/workflow/1/download/",
  runtimeBase: "/runtime/"
};

describe("OMERO capability renewal", () => {
  it("renews an expired context once and retries the interrupted download", async () => {
    let tokens = 0;
    let downloads = 0;
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url === "/token/") {
        tokens += 1;
        return new Response(JSON.stringify({
          context_token: `token-${tokens}`,
          operations: ["download"]
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      downloads += 1;
      if (downloads === 1) {
        return new Response(JSON.stringify({ error: { message: "expired" } }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(new Uint8Array([1, 2, 3]), { status: 200 });
    }));
    const bridge = new OmeroBridge(bootstrap);
    await bridge.connect();
    const data = await bridge.download({
      annotation_id: 8,
      file_id: 9,
      name: "data.csv",
      mimetype: "text/csv",
      size: 3,
      kind: "attachment",
      supported: true
    });
    expect(new Uint8Array(data)).toEqual(new Uint8Array([1, 2, 3]));
    expect(tokens).toBe(2);
    expect(downloads).toBe(2);
    vi.unstubAllGlobals();
  });

  it("rejects malformed capability responses before using them", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      context_token: 42,
      operations: "download"
    }), { status: 200, headers: { "Content-Type": "application/json" } })));
    const bridge = new OmeroBridge(bootstrap);
    await expect(bridge.connect()).rejects.toThrow("invalid context capability");
    vi.unstubAllGlobals();
  });
});
