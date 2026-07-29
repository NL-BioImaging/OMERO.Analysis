import {
  completeChat,
  OmeroBridge,
  providerEndpoint,
  validateProviderConnection
} from "./api";
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
  pipelineTemplatesTemplate: "/pipelines/TYPE/1/",
  pipelineDownloadTemplate: "/pipeline/1/download/",
  notebookDownloadTemplate: "/notebook/1/download/",
  notebookUploadTemplate: "/notebooks/TYPE/1/upload/",
  workspaceSyncStatusTemplate: "/workspace-sync/TYPE/1/WORKSPACE/",
  workspaceSyncPlanTemplate: "/workspace-sync/TYPE/1/WORKSPACE/plan/",
  workspaceSyncApplyTemplate: "/workspace-sync/TYPE/1/WORKSPACE/apply/",
  workspaceSyncRemoveTemplate: "/workspace-sync/TYPE/1/WORKSPACE/remove/",
  workspaceLibraryTemplate: "/workspace-library/TYPE/1/",
  workspaceLibraryDownloadTemplate: "/workspace-library/item/1/download/",
  analysisSettingsTemplate: "/settings/TYPE/1/",
  workflowSkillsUrl: "/workflow-skills/",
  zarrViewerStatusUrl: "/integrations/zarr-viewer/",
  keepaliveUrl: "/webclient/keepalive_ping/",
  keepaliveInterval: 60000,
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

describe("BIOMERO measurement-skill adapter", () => {
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
      consumers: ["omero-analysis"],
      version: "1",
      sha256: "b".repeat(64),
      package_url: "/stale-cache/example/analyze-example/",
      match: {
        extensions: [".csv"],
        filename_globs: [],
        required_tables: [],
        auto_activate: true
      }
    };
    const requests: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
      requests.push(String(input));
      const packageRequest =
        String(input) === "/workflow-skills/example/analyze-example/";
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
        consumer: "omero-analysis",
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
    expect(requests).toContain("/workflow-skills/example/analyze-example/");
    expect(requests).not.toContain("/stale-cache/example/analyze-example/");
    vi.unstubAllGlobals();
  });

  it("accepts application-operation skills and ZarrViewer status", async () => {
    const source = {
      workflow_key: "omero-zarr-viewer",
      source_kind: "application",
      source_key: "omero-zarr-viewer",
      repository_url: "https://github.com/NL-BioImaging/BIOMERO.ZarrViewer/tree/v0.3.0",
      configured_ref: "v0.3.0",
      resolved_commit: "d".repeat(40),
      skills_path: "_agents/skills",
      ref_kind: "tag"
    };
    const skill = {
      workflow_key: "omero-zarr-viewer",
      name: "use-omero-zarr-viewer",
      description: "Open measured objects",
      purpose: "application-operation",
      consumers: ["omero-analysis"],
      version: "1",
      sha256: "e".repeat(64),
      package_url: "/workflow-skills/omero-zarr-viewer/use-omero-zarr-viewer/",
      match: {
        extensions: [],
        filename_globs: [],
        required_tables: [],
        auto_activate: false
      }
    };
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
      if (String(input) === bootstrap.zarrViewerStatusUrl) {
        return new Response(JSON.stringify({
          schema_version: 1,
          available: true,
          installed: true,
          enabled: true,
          version: "0.3.0",
          minimum_version: "0.3.0",
          reason: "ready",
          viewer_url: "/biomero_zarr_viewer/",
          image_capabilities_template: "/images/0/capabilities/",
          plate_capabilities_template: "/plates/0/capabilities/",
          skill_catalog_url: "/biomero_zarr_viewer/api/analysis-skills/"
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({
        schema: "nl.bioimaging.omero-workflow-skills.v1",
        generated_at: "",
        consumer: "omero-analysis",
        config_hash: "config",
        workflows: [],
        applications: [{ source, status: "ready", checked_at: "", skills: [skill] }],
        diagnostics: []
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }));
    const bridge = new OmeroBridge(bootstrap);
    const catalog = await bridge.listWorkflowSkills();
    expect(catalog.applications?.[0].skills[0].name).toBe("use-omero-zarr-viewer");
    expect((await bridge.zarrViewerStatus()).version).toBe("0.3.0");
    vi.unstubAllGlobals();
  });
});

describe("AI completion requests", () => {
  it("uses only the user-configured endpoint", () => {
    expect(providerEndpoint({
      protocol: "openai",
      endpoint: "https://provider.example/v1",
      authMode: "bearer",
      model: "model",
      apiKey: "key",
      rememberKey: false,
      contextWindow: 0
    })).toBe("https://provider.example/v1/chat/completions");
    expect(providerEndpoint({
      protocol: "anthropic",
      endpoint: "https://claude.example",
      authMode: "bearer",
      model: "model",
      apiKey: "key",
      rememberKey: false,
      contextWindow: 0
    })).toBe("https://claude.example/v1/messages");
  });

  it("omits tool configuration during forced final synthesis", async () => {
    let requestBody: Record<string, unknown> = {};
    vi.stubGlobal("fetch", vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      requestBody = JSON.parse(String(init?.body || "{}"));
      return new Response(JSON.stringify({
        choices: [{ message: { role: "assistant", content: "Final answer" } }]
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }));

    await completeChat(
      {
        protocol: "openai",
        endpoint: "https://provider.example/v1",
        authMode: "bearer",
        model: "gpt-test",
        apiKey: "key",
        rememberKey: false,
        contextWindow: 0
      },
      [{ role: "user", content: "answer now" }],
      new AbortController().signal,
      undefined,
      []
    );

    expect(requestBody).not.toHaveProperty("tools");
    expect(requestBody).not.toHaveProperty("tool_choice");
    vi.unstubAllGlobals();
  });

  it("validates a generic OpenAI-compatible endpoint", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      choices: [{ message: { role: "assistant", content: "OK" } }]
    }), { status: 200, headers: { "Content-Type": "application/json" } })));
    const message = await validateProviderConnection({
      protocol: "openai",
      endpoint: "https://provider.example/v1",
      authMode: "bearer",
      model: "model",
      apiKey: "key",
      rememberKey: false,
      contextWindow: 0
    }, new AbortController().signal);
    expect(message).toContain("Connection validated");
    expect(fetch).toHaveBeenCalledWith(
      "https://provider.example/v1/chat/completions",
      expect.objectContaining({ method: "POST" })
    );
    vi.unstubAllGlobals();
  });

  it("reports authentication failures with a useful hint", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      error: { message: "invalid key" }
    }), { status: 401, headers: { "Content-Type": "application/json" } })));
    await expect(validateProviderConnection({
      protocol: "openai",
      endpoint: "https://provider.example/v1",
      authMode: "api-key",
      model: "model",
      apiKey: "bad",
      rememberKey: false,
      contextWindow: 0
    }, new AbortController().signal)).rejects.toThrow(
      "API key and authentication-header type"
    );
    vi.unstubAllGlobals();
  });
});
