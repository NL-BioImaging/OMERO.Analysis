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
  workflowSkillsUrl: "/workflow-skills/",
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

describe("workflow skill adapter", () => {
  it("validates catalog and package payloads", async () => {
    const source = {
      workflow_key: "example",
      repository_url: "https://github.com/example/workflow/tree/v1",
      configured_ref: "v1",
      resolved_commit: "a".repeat(40),
      skills_path: "_agents/skills",
      ref_kind: "tag"
    };
    const skill = {
      workflow_key: "example",
      name: "analyze-example",
      description: "Analyze example outputs",
      purpose: "attachment-analysis",
      consumers: ["omero-analysis-chat"],
      version: "1",
      sha256: "b".repeat(64),
      package_url: "/workflow-skills/example/analyze-example/",
      match: {
        extensions: [".csv"],
        filename_globs: [],
        required_tables: [],
        auto_activate: true
      }
    };
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
      const packageRequest = String(input).includes("analyze-example");
      return new Response(JSON.stringify(packageRequest ? {
        source,
        skill,
        files: [{
          path: "SKILL.md",
          media_type: "text/markdown",
          size: 10,
          sha256: "c".repeat(64),
          content: "# Instructions"
        }]
      } : {
        schema: "nl.bioimaging.omero-workflow-skills.v1",
        generated_at: "",
        consumer: "omero-analysis-chat",
        config_hash: "config",
        workflows: [{ source, status: "ready", checked_at: "", skills: [skill] }],
        diagnostics: []
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }));
    const bridge = new OmeroBridge(bootstrap);
    expect((await bridge.listWorkflowSkills()).workflows[0].skills[0].name)
      .toBe("analyze-example");
    expect((await bridge.loadWorkflowSkill("example", "analyze-example")).files[0].path)
      .toBe("SKILL.md");
    vi.unstubAllGlobals();
  });
});
