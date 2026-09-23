import { bindSharedHandoff, prepareSharedImports, readSharedHandoff, sharedHandoffKey } from "./sharedLibrary";
import { inputCompatibility, notebookCompatibility } from "./notebookCompatibility";
import { NOTEBOOK_PROTOCOL_SCHEMA, type NotebookProtocolContract } from "./notebookProtocol";
import { sha256 } from "./storage";
import { buildWorkspaceSyncPayload } from "./workspaceSync";
import { unzipSync, strFromU8 } from "fflate";
import type { AnalysisWorkspace, OmeroContext, SharedLibraryItem } from "./types";

const context: OmeroContext = { object_type: "Screen", object_id: 2, user_id: 0, group_id: 0,
  name: "Screen", can_annotate: true, selected_attachments: [] };
function workspace(): AnalysisWorkspace {
  return { workspace: { id: "test", userId: 0, groupId: 0, objectType: "Screen", objectId: 2,
    contextKey: "0:0:Screen:2", rootPath: "OMERO/Screen-2", name: "Test", activeChatId: "chat",
    plotCsv: true, createdAt: "2026-09-23T00:00:00Z", updatedAt: "2026-09-23T00:00:00Z" },
    files: [], notebooks: [], chats: [], executions: [], runs: [], methods: [], pipelines: [],
    artifacts: [], audits: [], evidence: [] };
}
const contract: NotebookProtocolContract = { schema: NOTEBOOK_PROTOCOL_SCHEMA,
  inputs: [{ id: "data", kind: "query", path: "input/data.csv", formats: ["csv"], required: true,
    schema: { tables: [{ name: "data", columns: [{ name: "well", type: "string" }] }] } }],
  requirements: [], parameters: [], results: { path: "results" } };
async function item(name: string, data: ArrayBuffer, kind: "template" | "notebook" = "template"): Promise<SharedLibraryItem> {
  return { id: "a".repeat(64), revision: await sha256(data), sha256: await sha256(data), kind, name,
    available: true, size: data.byteLength, mimetype: "text/csv", error: "", revisionCount: 1 };
}
const bytes = (s: string) => new TextEncoder().encode(s).buffer as ArrayBuffer;

describe("shared imports", () => {
  it("imports independent, idempotent copies and gives new revisions unique names", async () => {
    const data = bytes("well,dose\nA1,1\n"), original = workspace();
    const first = await item("layout.csv", data), download = vi.fn(async () => data);
    const imported = await prepareSharedImports(original, "library", [first], download);
    expect(original.files).toHaveLength(0);
    expect(imported.files[0]).toMatchObject({ name: "layout.csv", role: "template-input", libraryOrigin: {
      source: "shared", revision: first.revision, libraryId: "library" } });
    const same = await prepareSharedImports(imported, "library", [first], download);
    expect(same.files).toHaveLength(1); expect(download).toHaveBeenCalledTimes(1);
    const changed = bytes("well,dose\nA1,2\n");
    const next = await prepareSharedImports(same, "library", [await item("layout.csv", changed)], async () => changed);
    expect(next.files.map(f => f.name)).toEqual(["layout.csv", "layout (2).csv"]);
    expect(new TextDecoder().decode(next.files[0].data)).toContain("A1,1");
  });
  it("rejects changed bytes and unavailable entries without mutating the workspace", async () => {
    const data = bytes("well\nA1\n"), value = workspace(), entry = await item("layout.csv", data);
    await expect(prepareSharedImports(value, "library", [entry], async () => bytes("bad"))).rejects.toThrow("integrity");
    await expect(prepareSharedImports(value, "library", [{ ...entry, available: false }], async () => data)).rejects.toThrow("unavailable");
    expect(value.files).toHaveLength(0);
  });
  it("imports valid incompatible notebooks without executing code, stripping outputs", async () => {
    const data = bytes(JSON.stringify({ nbformat: 4, nbformat_minor: 5, metadata: { widgets: {} }, cells: [
      { cell_type: "code", metadata: { tags: ["omero-analysis-config"] }, outputs: [{ text: "secret" }], execution_count: 8,
        source: `ctx = oan.configure(r'''${JSON.stringify({ ...contract, requirements: ["unsupported-package"] })}''')` },
      { cell_type: "code", metadata: {}, source: "raise RuntimeError('must never execute')", outputs: [], execution_count: null }
    ] }));
    const imported = await prepareSharedImports(workspace(), "library", [await item("demo.ipynb", data, "notebook")], async () => data);
    expect(imported.notebooks[0].document.cells[0].outputs).toEqual([]);
    expect(imported.notebooks[0].document.cells[0].execution_count).toBeNull();
    expect(imported.notebooks[0].document.metadata.widgets).toBeUndefined();
  });
  it("synchronizes explicit templates without a template filename and preserves recoverable provenance", async () => {
    const data = bytes("well\nA1\n"), entry = await item("layout.csv", data);
    const imported = await prepareSharedImports(workspace(), "library", [entry], async () => data);
    const payload = await buildWorkspaceSyncPayload(imported, context);
    expect(payload.inventory.items.find(i => i.kind === "template-input")?.name).toBe("layout.csv");
    const archive = unzipSync(payload.bytes.get("workspace-snapshot:test")!);
    const file = JSON.parse(strFromU8(archive["workspace.json"])).files[0];
    expect(file).toMatchObject({ role: "template-input", state: "ready", libraryOrigin: { source: "shared" },
      remoteResult: { key: `template-input:${imported.files[0].id}`, sha256: entry.sha256 } });
    const restored = { ...imported, files: [{ ...imported.files[0], data: undefined, remoteResult: file.remoteResult }] };
    const again = await buildWorkspaceSyncPayload(restored, context);
    expect(again.inventory.items.find(i => i.kind === "template-input")?.sha256).toBe(entry.sha256);
  });
});

describe("shared handoff", () => {
  it("binds a launch instance to the actual workspace record without extending its expiry", () => {
    const refs = [{ id: "a".repeat(64), revision: "b".repeat(64), libraryId: "c".repeat(40) }];
    const key = sharedHandoffKey(context, "launch"), expires = Date.now() + 60_000;
    const record = { ...workspace().workspace, contextKey: "0:0:Screen:2:workspace:launch" };
    localStorage.setItem(key, JSON.stringify({ expires, items: refs }));
    bindSharedHandoff(context, "launch", { ...record, groupId: 999 });
    expect(localStorage.getItem(key)).not.toBeNull();
    bindSharedHandoff(context, "launch", record);
    expect(readSharedHandoff(context, record.id)).toEqual(refs);
    expect(JSON.parse(localStorage.getItem(sharedHandoffKey(context, record.id))!).expires).toBe(expires);
    expect(localStorage.getItem(key)).toBeNull();
  });
  it("isolates user/group/source/workspace, including zero IDs, and expires references", () => {
    localStorage.clear();
    const refs = [{ id: "a".repeat(64), revision: "b".repeat(64), libraryId: "c".repeat(40) }];
    const key = sharedHandoffKey(context, "test");
    localStorage.setItem(key, JSON.stringify({ expires: Date.now() + 60_000, items: refs }));
    expect(readSharedHandoff(context, "test")).toEqual(refs);
    expect(readSharedHandoff({ ...context, group_id: 3 }, "test")).toEqual([]);
    expect(readSharedHandoff(context, "other")).toEqual([]);
    localStorage.setItem(key, JSON.stringify({ expires: Date.now() - 1, items: refs }));
    expect(readSharedHandoff(context, "test")).toEqual([]); expect(localStorage.getItem(key)).toBeNull();
  });
});

describe("shared compatibility evaluator", () => {
  it("keeps legacy and unknown schema unchecked; missing inputs incompatible", () => {
    expect(notebookCompatibility(null, []).status).toBe("unchecked");
    expect(notebookCompatibility(contract, []).status).toBe("incompatible");
    expect(notebookCompatibility(contract, [{ id: "x", name: "data.csv" }]).status).toBe("unchecked");
  });
  it("checks declared columns/types and reports ambiguity, not optional inputs", () => {
    const source = { id: "x", name: "data.csv", schema: { tables: [{ name: "data", columns: [{ name: "well", type: "VARCHAR" }] }] } };
    expect(notebookCompatibility(contract, [source]).status).toBe("compatible");
    expect(notebookCompatibility(contract, [source, { ...source, id: "y" }]).reasons[0]).toContain("choose between");
    expect(notebookCompatibility({ ...contract, inputs: contract.inputs.map(i => ({ ...i, required: false })) }, []).status).toBe("compatible");
    expect(inputCompatibility(contract.inputs[0], { ...source, schema: { tables: [{ name: "data", columns: [] }] } }).reasons[0]).toContain("missing column");
    expect(inputCompatibility(contract.inputs[0], { ...source, schema: { tables: [{ name: "data", columns: [{ name: "well", type: "INTEGER" }] }] } }).status).toBe("incompatible");
  });
  it("does not approve unsupported packages or unverified version constraints", () => {
    expect(notebookCompatibility({ ...contract, requirements: ["unknown"] }, []).reasons[0]).toContain("Unsupported");
    expect(notebookCompatibility({ ...contract, inputs: [], requirements: ["pandas>=1000"] }, []).status).toBe("unchecked");
  });
});
