import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ArtifactEditor, { type ArtifactEditorSession } from "./ArtifactEditor";
import type { MethodRecord, NotebookRecord, PipelineRecord } from "./types";

const createdAt = "2026-08-03T10:00:00Z";
const method: MethodRecord = {
  id: "method",
  workspaceId: "workspace",
  name: "analysis.py",
  description: "Analysis",
  currentVersion: 1,
  versions: [{
    version: 1,
    code: 'print("hello")',
    codeHash: "hash",
    executionId: "",
    createdAt
  }],
  createdAt,
  updatedAt: createdAt
};

function props(session: ArtifactEditorSession, onChange = vi.fn()) {
  return {
    session,
    methods: [method],
    inputs: [],
    theme: "dark" as const,
    cspNonce: "test-editor",
    saving: false,
    onChange,
    onSave: vi.fn(),
    onSaveRun: vi.fn(),
    onRevert: vi.fn(),
    onClose: vi.fn()
  };
}

describe("ArtifactEditor", () => {
  it("renders a syntax-aware Method editor and explicit save controls", () => {
    const session: ArtifactEditorSession = {
      kind: "method",
      id: method.id,
      name: method.name,
      originTab: "assistant",
      original: method,
      draftCode: method.versions[0].code,
      bindingCount: 0,
      dirty: false
    };
    const view = render(<ArtifactEditor {...props(session)} />);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save and Run" })).toBeEnabled();
    expect(view.container.querySelector(".cm-editor")).toBeInTheDocument();
  });

  it("highlights SQL nested inside a Python triple-quoted query", () => {
    const sqlMethod = {
      ...method,
      versions: [{
        ...method.versions[0],
        code: 'sql = r"""\nWITH cells AS (SELECT * FROM object_features)\nSELECT * FROM cells\n"""'
      }]
    };
    const session: ArtifactEditorSession = {
      kind: "method",
      id: sqlMethod.id,
      name: sqlMethod.name,
      originTab: "assistant",
      original: sqlMethod,
      draftCode: sqlMethod.versions[0].code,
      bindingCount: 0,
      dirty: false
    };
    const view = render(<ArtifactEditor {...props(session)} />);
    const tokens = Array.from(view.container.querySelectorAll(".cm-content span"))
      .map((node) => node.textContent);
    expect(tokens).toContain("WITH");
    expect(tokens).toContain("SELECT");
  });

  it("stacks clear Notebook cell actions and explains Raw text", () => {
    const notebook: NotebookRecord = {
      id: "notebook",
      workspaceId: "workspace",
      name: "analysis.ipynb",
      document: {
        nbformat: 4,
        nbformat_minor: 5,
        metadata: {},
        cells: [{
          id: "cell",
          cell_type: "code",
          source: "print('hello')",
          metadata: {},
          execution_count: null,
          outputs: []
        }]
      },
      attachmentIds: [],
      selectedDataFileIds: [],
      createdAt,
      updatedAt: createdAt
    };
    const session: ArtifactEditorSession = {
      kind: "notebook",
      id: notebook.id,
      name: notebook.name,
      originTab: "notebooks",
      original: notebook,
      draft: notebook,
      bindingCount: 0,
      dirty: false
    };
    render(<ArtifactEditor {...props(session)} />);
    expect(screen.getByRole("button", { name: "Add Code" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Markdown" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Raw text" })).toBeInTheDocument();
    expect(screen.getByText(/Raw text is stored as written/)).toBeInTheDocument();
  });

  it("supports structured Pipeline step addition without exposing raw JSON", () => {
    const pipeline: PipelineRecord = {
      id: "pipeline",
      workspaceId: "workspace",
      name: "pipeline",
      description: "",
      version: 1,
      steps: [],
      createdAt,
      updatedAt: createdAt
    };
    const session: ArtifactEditorSession = {
      kind: "pipeline",
      id: pipeline.id,
      name: pipeline.name,
      originTab: "assistant",
      original: pipeline,
      draft: pipeline,
      bindingCount: 0,
      dirty: false
    };
    const onChange = vi.fn();
    render(<ArtifactEditor {...props(session, onChange)} />);
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      kind: "pipeline",
      dirty: true,
      draft: expect.objectContaining({ steps: [expect.objectContaining({ methodId: "method" })] })
    }));
  });

  it('reads and applies all notebook cells through one source field without saving or running', async () => {
    const prototype = HTMLDialogElement.prototype;
    const originals = ['showModal', 'close'].map(name => Object.getOwnPropertyDescriptor(prototype, name));
    Object.defineProperty(prototype, 'showModal', { configurable: true, value: function(this: HTMLDialogElement) { this.setAttribute('open', ''); } });
    Object.defineProperty(prototype, 'close', { configurable: true, value: function(this: HTMLDialogElement) { this.removeAttribute('open'); } });
    try {
    const notebook: NotebookRecord = { id: 'nb', workspaceId: 'w', name: 'test.ipynb',
      attachmentIds: [], selectedDataFileIds: [], createdAt, updatedAt: createdAt,
      document: { nbformat: 4, nbformat_minor: 5, metadata: {}, cells: [
        { id: 'one', cell_type: 'code', source: 'x = 1', metadata: {} },
        { id: 'two', cell_type: 'markdown', source: 'Notes', metadata: {} }] } };
    const options = props({ kind: 'notebook', id: notebook.id, name: notebook.name, originTab: 'notebooks',
      original: notebook, draft: notebook, bindingCount: 0, dirty: true });
    render(<ArtifactEditor {...options} />);
    fireEvent.click(screen.getByRole('button', { name: 'Whole notebook' }));
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Whole notebook source' })).toBeVisible());
    const textbox = screen.getByRole('textbox', { name: 'Whole notebook JSON' }) as HTMLTextAreaElement;
    const source = JSON.parse(textbox.value);
    expect(source.document.cells).toHaveLength(2);
    source.document.cells[0].source = 'x = 2';
    fireEvent.change(textbox, { target: { value: JSON.stringify(source) } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply source to draft' }));
    await waitFor(() => expect(options.onChange).toHaveBeenCalled());
    expect(options.onChange.mock.calls[0][0].draft.document.cells[0].source).toBe('x = 2');
    expect(options.onSave).not.toHaveBeenCalled();
    expect(options.onSaveRun).not.toHaveBeenCalled();
    } finally {
      ['showModal', 'close'].forEach((name, index) => {
        if (originals[index]) Object.defineProperty(prototype, name, originals[index]!);
        else Reflect.deleteProperty(prototype, name);
      });
    }
  });
});
