import { OmeroBridge } from "./api";
import type { Bootstrap, SyncInventory, SyncPlan } from "./types";

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
  notebookDownloadTemplate: "/notebook/1/download/",
  notebookUploadTemplate: "/notebooks/TYPE/1/upload/",
  workspaceSyncStatusTemplate: "/workspace-sync/TYPE/1/WORKSPACE/",
  workspaceSyncPlanTemplate: "/workspace-sync/TYPE/1/WORKSPACE/plan/",
  workspaceSyncApplyTemplate: "/workspace-sync/TYPE/1/WORKSPACE/apply/",
  workspaceSyncRemoveTemplate: "/workspace-sync/TYPE/1/WORKSPACE/remove/",
  workspaceLibraryTemplate: "/workspace-library/TYPE/1/",
  workspaceLibraryDownloadTemplate: "/workspace-library/item/1/download/",
  workflowSkillsUrl: "/workflow-skills/",
  dataQueryCapabilitiesUrl: "/data-query/capabilities/",
  zarrViewerStatusUrl: "/integrations/zarr-viewer/",
  keepaliveUrl: "/webclient/keepalive_ping/",
  keepaliveInterval: 60000,
  runtimeBase: "/runtime/"
};

describe("OMERO capability renewal", () => {
  it.each([undefined, "concat-v1"] as const)("preserves legacy uploads and supports one-file bundles (%s)", async payloadEncoding => {
    const data = new Uint8Array([1, 2, 3]);
    let form: FormData | undefined;
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input) === "/token/") return new Response(JSON.stringify({ context_token: "test", operations: ["sync_apply"] }));
      form = init?.body as FormData;
      return new Response(JSON.stringify({ schema: "nl.bioimaging.analysis.sync.status.v1", canSync: true,
        linked: true, remoteRevision: 1, inventoryDigest: "digest" }));
    }));
    const bridge = new OmeroBridge(bootstrap);
    await bridge.connect();
    const inventory = { workspace: { id: "one" }, items: [{ key: "a", name: "a.csv", mimetype: "text/csv" },
      { key: "b", name: "b.csv", mimetype: "text/csv" }] } as SyncInventory;
    await bridge.applyWorkspaceSync(inventory, { planToken: "signed", uploadKeys: ["a", "b"], payloadEncoding } as SyncPlan,
      new Map([["a", data], ["b", data]]));
    expect(form?.getAll("payload_bundle")).toHaveLength(payloadEncoding ? 1 : 0);
    expect(form?.getAll("payloads")).toHaveLength(payloadEncoding ? 0 : 2);
    expect(form?.get("payload_keys")).toBe('["a","b"]');
    if (payloadEncoding) expect((form?.get("payload_bundle") as File).size).toBe(6);
  });
  it("lists the supported attachments for the active OMERO object", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url === "/token/") {
        return new Response(JSON.stringify({
          context_token: "token-1",
          operations: ["list"]
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      expect(url).toBe("/attachments/Dataset/42/");
      return new Response(JSON.stringify({
        attachments: [{
          annotation_id: 8,
          file_id: 9,
          name: "measurements.duckdb",
          mimetype: "application/octet-stream",
          size: 128,
          kind: "attachment",
          supported: true,
          default_mode: "remote",
          allowed_modes: ["local", "remote"]
        }]
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }));
    const bridge = new OmeroBridge(bootstrap);
    await bridge.connect();
    await expect(bridge.listAttachments()).resolves.toEqual([
      expect.objectContaining({ annotation_id: 8, name: "measurements.duckdb" })
    ]);
    vi.unstubAllGlobals();
  });

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
        return new Response(JSON.stringify({ error: { code: "invalid_context_token", message: "expired" } }), {
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
        schema: "nl.bioimaging.biomero-workflow-skills.v1",
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
    expect((await bridge.loadWorkflowSkill("analyze-example", "analyze-example")).files[0].path)
      .toBe("SKILL.md");
    expect(requests).toContain("/workflow-skills/example/analyze-example/");
    expect(requests).not.toContain("/workflow-skills/analyze-example/analyze-example/");
    expect(requests).not.toContain("/stale-cache/example/analyze-example/");
    vi.unstubAllGlobals();
  });

  it("keeps ZarrViewer discovery separate from measurement skills", async () => {
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
        schema: "nl.bioimaging.biomero-workflow-skills.v1",
        generated_at: "",
        consumer: "omero-analysis",
        config_hash: "config",
        workflows: [],
        applications: [{ ignored: true }],
        diagnostics: []
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }));
    const bridge = new OmeroBridge(bootstrap);
    expect((await bridge.listWorkflowSkills()).workflows).toEqual([]);
    expect((await bridge.zarrViewerStatus()).version).toBe("0.3.0");
    vi.unstubAllGlobals();
  });

  it("loads a canonical Agent Skills package from ZarrViewer", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url === bootstrap.zarrViewerStatusUrl) {
        return new Response(JSON.stringify({
          schema_version: 1,
          available: true,
          installed: true,
          enabled: true,
          version: "0.5.0",
          minimum_version: "0.4.0",
          reason: "ready",
          viewer_url: "/biomero_zarr_viewer/",
          image_capabilities_template: "/images/0/capabilities/",
          plate_capabilities_template: "/plates/0/capabilities/",
          skill_catalog_url: "/biomero_zarr_viewer/api/analysis-skills/"
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      const descriptor = {
        name: "use-omero-zarr-viewer",
        format: "agent-skills-v1",
        skills_path: "skills",
        description: "Open measured objects in OMERO ZarrViewer.",
        purpose: "application-operation",
        consumers: ["omero-analysis"],
        version: "3",
        sha256: "a".repeat(64),
        package_url: "/biomero_zarr_viewer/api/analysis-skills/use-omero-zarr-viewer/",
        required_resources: ["references/REFERENCE.md"],
        required_capabilities: ["zarr-render-v2"],
        match: { extensions: [], filename_globs: [], required_tables: [], auto_activate: false }
      };
      const provider = {
        name: "BIOMERO.ZarrViewer",
        distribution: "biomero-zarr-viewer",
        version: "0.5.0",
        source: "bundled",
        health: "ready"
      };
      if (url.endsWith("/use-omero-zarr-viewer/")) {
        return new Response(JSON.stringify({
          schema: "nl.bioimaging.analysis-skill-provider.v1",
          provider,
          skill: descriptor,
          files: [{
            path: "SKILL.md",
            media_type: "text/markdown",
            size: 100,
            sha256: "b".repeat(64),
            content: "---\nname: use-omero-zarr-viewer\ndescription: Open measured objects.\n---\n"
          }, {
            path: "references/REFERENCE.md",
            media_type: "text/markdown",
            size: 10,
            sha256: "c".repeat(64),
            content: "# Reference"
          }]
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({
        schema: "nl.bioimaging.analysis-skill-provider.v1",
        provider,
        skills: [descriptor]
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }));

    const skill = await new OmeroBridge(bootstrap).loadZarrViewerSkill();
    expect(skill.source.format).toBe("agent-skills-v1");
    expect(skill.source.skills_path).toBe("skills");
    expect(skill.files.map((file) => file.path)).toEqual([
      "SKILL.md",
      "references/REFERENCE.md"
    ]);
    vi.unstubAllGlobals();
  });
});

describe("remote data-query policy", () => {
  it("validates and returns the server-owned threshold", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      available: true,
      ready: true,
      capability: "omero-data-query-v1",
      formats: ["duckdb", "sqlite", "csv"],
      threshold_bytes: 104857600,
      result_ttl_seconds: 600
    }), { status: 200, headers: { "Content-Type": "application/json" } })));
    const capabilities = await new OmeroBridge(bootstrap).dataQueryCapabilities();
    expect(capabilities.threshold_bytes).toBe(104857600);
    expect(capabilities.ready).toBe(true);
    vi.unstubAllGlobals();
  });
});

it("saves notebook artifacts only through an explicitly scoped workspace route", async () => {
  const calls: string[] = [];
  vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
    calls.push(String(input));
    if (String(input) === "/token/") return new Response(JSON.stringify({ context_token: "test", operations: ["workspace_artifact"] }));
    return new Response(JSON.stringify({ attachment: { annotation_id: 99, file_id: 100,
      name: "own.ipynb", mimetype: "application/x-ipynb+json", size: 2, kind: "notebook", supported: false } }));
  }));
  const bridge = new OmeroBridge(bootstrap);
  await bridge.connect();
  expect(bridge.canUpload).toBe(true);
  await bridge.uploadNotebook("own.ipynb", new Uint8Array([123, 125]), "my-workspace");
  expect(calls).toContain("/workspace-sync/Dataset/42/my-workspace/artifact/");
  expect(calls).not.toContain("/notebooks/Dataset/42/upload/");
});


it("coalesces source preparation across Inspector and compatibility, then revalidates later", async () => {
  let release: ((value: Response) => void) | undefined;
  const fetcher = vi.fn((input: RequestInfo | URL) => {
    if (String(input) === "/token/") return Promise.resolve(new Response(JSON.stringify({
      context_token: "test", operations: ["data_query_schema"]
    })));
    return new Promise<Response>(resolve => { release = resolve; });
  });
  vi.stubGlobal("fetch", fetcher);
  const bridge = new OmeroBridge({ ...bootstrap, dataSourceSchemaTemplate: "/sources/1/schema/" });
  await bridge.connect();
  const first = bridge.remoteSchema(752);
  const second = bridge.remoteSchema(752);
  await vi.waitFor(() => expect(release).toBeDefined());
  expect(fetcher.mock.calls.filter(([url]) => String(url).includes("/schema/"))).toHaveLength(1);
  release!(new Response(JSON.stringify({ tables: [{ name: "data" }] })));
  expect(await first).toEqual(await second);
  release = undefined;
  const later = bridge.remoteSchema(752);
  await vi.waitFor(() => expect(release).toBeDefined());
  release!(new Response(JSON.stringify({ tables: [] })));
  expect(await later).toEqual({ tables: [] });
  expect(fetcher.mock.calls.filter(([url]) => String(url).includes("/schema/"))).toHaveLength(2);
});
