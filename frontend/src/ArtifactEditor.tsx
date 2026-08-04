import { useEffect, useMemo, useRef, useState } from "react";
import { EditorView, minimalSetup } from "codemirror";
import { EditorState, type Extension } from "@codemirror/state";
import { highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from "@codemirror/view";
import { bracketMatching, HighlightStyle, LanguageSupport, syntaxHighlighting } from "@codemirror/language";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { python, pythonLanguage } from "@codemirror/lang-python";
import { markdown } from "@codemirror/lang-markdown";
import { json } from "@codemirror/lang-json";
import { StandardSQL, sql } from "@codemirror/lang-sql";
import { parseMixed } from "@lezer/common";
import { tags } from "@lezer/highlight";
import { ActionIcon } from "./components/ActionIcon";
import { Button, Input } from "./components/BlueprintControls";
import { extractOutputNames, isInputBindingsCell } from "./artifactBindings";
import type {
  MethodRecord,
  NotebookCell,
  NotebookRecord,
  PipelineRecord,
  WorkspaceFile
} from "./types";

type EditorLanguage = "python" | "markdown" | "json" | "text";
export type EditorOriginTab = "chat" | "notebook" | "settings";

interface EditorSessionBase {
  id: string;
  name: string;
  originTab: EditorOriginTab;
  bindingCount: number;
  dirty: boolean;
  error?: string;
}

export interface MethodEditorSession extends EditorSessionBase {
  kind: "method";
  original: MethodRecord;
  draftCode: string;
}

export interface PipelineEditorSession extends EditorSessionBase {
  kind: "pipeline";
  original: PipelineRecord;
  draft: PipelineRecord;
}

export interface NotebookEditorSession extends EditorSessionBase {
  kind: "notebook";
  original: NotebookRecord;
  draft: NotebookRecord;
}

export type ArtifactEditorSession =
  | MethodEditorSession
  | PipelineEditorSession
  | NotebookEditorSession;

const SQL_START = /^\s*(?:WITH|SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|MERGE|PRAGMA|EXPLAIN)\b/i;
const SQL_ASSIGNMENT = /\b(?:sql|query|statement)(?:_[a-z0-9]+)?\s*=\s*$/i;

const pythonSqlLanguage = pythonLanguage.configure({
  wrap: parseMixed((node, input) => {
    if (node.name !== "String") return null;
    const value = input.read(node.from, node.to);
    const opening = value.match(/^(?:[rRuUbB]{0,2})(?:"""|''')/);
    if (!opening || value.length < opening[0].length + 3) return null;
    const body = value.slice(opening[0].length, -3);
    const parent = node.node.parent;
    const assignment = parent ? input.read(parent.from, node.from) : "";
    if (!SQL_ASSIGNMENT.test(assignment) && !SQL_START.test(body)) return null;
    return {
      parser: StandardSQL.language.parser,
      overlay: [{ from: node.from + opening[0].length, to: node.to - 3 }],
      bracketed: true
    };
  })
});

const pythonSqlSupport = new LanguageSupport(
  pythonSqlLanguage,
  [python().support, sql({ dialect: StandardSQL, upperCaseKeywords: true }).support]
);

export function languageExtension(language: EditorLanguage): Extension {
  if (language === "python") return pythonSqlSupport;
  if (language === "markdown") return markdown();
  if (language === "json") return json();
  return [];
}

function editorHighlightStyle(theme: "dark" | "light") {
  const dark = theme === "dark";
  return HighlightStyle.define([
    { tag: tags.keyword, color: dark ? "#70b7ff" : "#0b57a3", fontWeight: "600" },
    { tag: [tags.string, tags.docString], color: dark ? "#b9d77a" : "#39710d" },
    { tag: tags.comment, color: dark ? "#6f8c7b" : "#4d6d5a", fontStyle: "italic" },
    { tag: [tags.number, tags.bool, tags.null], color: dark ? "#d7a6ff" : "#7146a0" },
    { tag: [tags.function(tags.variableName), tags.definition(tags.variableName)], color: dark ? "#7dd6e8" : "#006b80" },
    { tag: [tags.typeName, tags.className], color: dark ? "#ffd580" : "#8a5b00" },
    { tag: [tags.operator, tags.punctuation], color: dark ? "#a8bbc7" : "#53606a" },
    { tag: [tags.heading, tags.strong], color: dark ? "#f0f7fb" : "#17202a", fontWeight: "700" },
    { tag: tags.link, color: dark ? "#8dd7f5" : "#17658b", textDecoration: "underline" },
    { tag: tags.monospace, color: dark ? "#9ed7f0" : "#17658b" }
  ]);
}

function CodeEditor({
  value,
  language,
  theme,
  readOnly = false,
  onChange,
  onSave,
  cspNonce
}: {
  value: string;
  language: EditorLanguage;
  theme: "dark" | "light";
  readOnly?: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  cspNonce: string;
}) {
  const host = useRef<HTMLDivElement | null>(null);
  const view = useRef<EditorView | null>(null);
  const updating = useRef(false);
  const onChangeRef = useRef(onChange);
  const onSaveRef = useRef(onSave);
  onChangeRef.current = onChange;
  onSaveRef.current = onSave;

  useEffect(() => {
    if (!host.current) return;
    const instance = new EditorView({
      doc: value,
      parent: host.current,
      extensions: [
        minimalSetup,
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        bracketMatching(),
        highlightSelectionMatches(),
        languageExtension(language),
        syntaxHighlighting(editorHighlightStyle(theme)),
        EditorState.readOnly.of(readOnly),
        EditorView.cspNonce.of(cspNonce),
        EditorView.editable.of(!readOnly),
        EditorView.lineWrapping,
        keymap.of([...searchKeymap, {
          key: "Mod-s",
          preventDefault: true,
          run: () => {
            onSaveRef.current();
            return true;
          }
        }]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !updating.current) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": {
            height: "100%",
            backgroundColor: theme === "dark" ? "#091219" : "#ffffff",
            color: theme === "dark" ? "#d7e3e9" : "#1c2127"
          },
          ".cm-scroller": { overflow: "auto", fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace" },
          ".cm-gutters": {
            backgroundColor: theme === "dark" ? "#0f1b24" : "#f5f6f7",
            color: theme === "dark" ? "#718897" : "#68717d",
            borderRightColor: theme === "dark" ? "#263947" : "#d3d8de"
          },
          ".cm-activeLine, .cm-activeLineGutter": {
            backgroundColor: theme === "dark" ? "#132631" : "#eef4fb"
          }
        }, { dark: theme === "dark" })
      ]
    });
    view.current = instance;
    return () => {
      instance.destroy();
      view.current = null;
    };
  }, [language, readOnly, theme]);

  useEffect(() => {
    const instance = view.current;
    if (!instance) return;
    const current = instance.state.doc.toString();
    if (current === value) return;
    updating.current = true;
    instance.dispatch({ changes: { from: 0, to: current.length, insert: value } });
    updating.current = false;
  }, [value]);

  return <div className="code-editor" ref={host} />;
}

function move<T>(values: T[], from: number, to: number): T[] {
  if (to < 0 || to >= values.length) return values;
  const next = [...values];
  const [value] = next.splice(from, 1);
  next.splice(to, 0, value);
  return next;
}

function sourceText(cell: NotebookCell): string {
  return Array.isArray(cell.source) ? cell.source.join("") : cell.source;
}

export default function ArtifactEditor({
  session,
  methods,
  inputs,
  theme,
  cspNonce,
  saving,
  onChange,
  onSave,
  onSaveRun,
  onRevert,
  onClose
}: {
  session: ArtifactEditorSession | null;
  methods: MethodRecord[];
  inputs: WorkspaceFile[];
  theme: "dark" | "light";
  cspNonce: string;
  saving: boolean;
  onChange: (session: ArtifactEditorSession) => void;
  onSave: () => void;
  onSaveRun: () => void;
  onRevert: () => void;
  onClose: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => setActiveIndex(0), [session?.kind, session?.id]);

  if (!session) {
    return (
      <section className="editor-tab editor-empty" aria-label="Editor">
        Choose Edit from a Method, Pipeline, or Notebook menu.
      </section>
    );
  }

  const version = session.kind === "method"
    ? session.original.currentVersion + (session.dirty ? 1 : 0)
    : session.kind === "pipeline"
      ? session.original.version + (session.dirty ? 1 : 0)
      : null;

  return (
    <section className="editor-tab" aria-label="Editor">
      <div className="editor-toolbar">
        <div className="editor-title">
          <strong>{session.name}</strong>
          <small>
            {version == null ? "Notebook" : `Version ${version}`}
            {` · ${session.bindingCount} input binding${session.bindingCount === 1 ? "" : "s"}`}
            {session.dirty ? " · Unsaved" : " · Saved"}
          </small>
        </div>
        <Button disabled={saving || !session.dirty || Boolean(session.error)} onClick={onSave}>
          <ActionIcon name="save" />Save
        </Button>
        <Button disabled={saving || Boolean(session.error)} onClick={onSaveRun}>
          <ActionIcon name="run" />Save and Run
        </Button>
        <Button disabled={saving || !session.dirty} onClick={onRevert}>
          <ActionIcon name="reset" />Revert
        </Button>
        <Button disabled={saving} onClick={onClose}>Close</Button>
      </div>
      {session.error && <div className="editor-error" role="alert">{session.error}</div>}
      <div className={`editor-workspace editor-${session.kind}`}>
        {session.kind === "method" && (
          <CodeEditor
            value={session.draftCode}
            language="python"
            theme={theme}
            onSave={onSave}
            cspNonce={cspNonce}
            onChange={(draftCode) => onChange({ ...session, draftCode, dirty: true })}
          />
        )}
        {session.kind === "pipeline" && (
          <PipelineEditor
            session={session}
            methods={methods}
            inputs={inputs}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onChange={onChange}
          />
        )}
        {session.kind === "notebook" && (
          <NotebookEditor
            session={session}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            theme={theme}
            cspNonce={cspNonce}
            onSave={onSave}
            onChange={onChange}
          />
        )}
      </div>
    </section>
  );
}

function PipelineEditor({
  session,
  methods,
  inputs,
  activeIndex,
  setActiveIndex,
  onChange
}: {
  session: PipelineEditorSession;
  methods: MethodRecord[];
  inputs: WorkspaceFile[];
  activeIndex: number;
  setActiveIndex: (value: number) => void;
  onChange: (session: PipelineEditorSession) => void;
}) {
  const steps = session.draft.steps;
  const active = steps[activeIndex] || null;
  const activeMethod = methods.find((method) => method.id === active?.methodId);
  const bindingOptions = useMemo(() => {
    const names = new Set(inputs.filter((file) => file.state === "ready" && !file.deletedAt)
      .map((file) => file.name));
    for (let index = 0; index < activeIndex; index += 1) {
      const step = steps[index];
      const method = methods.find((item) => item.id === step.methodId);
      const version = method?.versions.find((item) => item.version === step.methodVersion);
      if (version) extractOutputNames(version.code).forEach((name) => names.add(name));
    }
    Object.values(active?.inputBindings || {}).forEach((name) => names.add(name));
    return Array.from(names).sort();
  }, [active?.id, activeIndex, inputs, methods, steps]);

  const updateSteps = (nextSteps: PipelineRecord["steps"]) => {
    onChange({
      ...session,
      dirty: true,
      draft: { ...session.draft, steps: nextSteps, updatedAt: new Date().toISOString() }
    });
  };
  const replaceActive = (patch: Partial<PipelineRecord["steps"][number]>) => {
    if (!active) return;
    updateSteps(steps.map((step, index) => index === activeIndex ? { ...step, ...patch } : step));
  };
  const addStep = () => {
    const method = methods[0];
    if (!method) return;
    const next = [...steps, {
      id: crypto.randomUUID(),
      methodId: method.id,
      methodVersion: method.currentVersion,
      name: method.name,
      inputBindings: {},
      parameters: {}
    }];
    updateSteps(next);
    setActiveIndex(next.length - 1);
  };

  return (
    <>
      <aside className="editor-outline">
        <div className="editor-outline-actions">
          <strong>Pipeline steps</strong>
          <Button disabled={!methods.length} onClick={addStep}><ActionIcon name="add" />Add</Button>
        </div>
        <ol>
          {steps.map((step, index) => (
            <li key={step.id}>
              <button className={index === activeIndex ? "active" : ""}
                onClick={() => setActiveIndex(index)}>
                <span>{index + 1}</span>{step.name}
              </button>
            </li>
          ))}
        </ol>
      </aside>
      <div className="editor-detail pipeline-step-editor">
        {!active ? <p>Add a Method step to this Pipeline.</p> : (
          <>
            <div className="pipeline-step-actions">
              <Button disabled={activeIndex === 0}
                onClick={() => { updateSteps(move(steps, activeIndex, activeIndex - 1)); setActiveIndex(activeIndex - 1); }}>
                Move up
              </Button>
              <Button disabled={activeIndex === steps.length - 1}
                onClick={() => { updateSteps(move(steps, activeIndex, activeIndex + 1)); setActiveIndex(activeIndex + 1); }}>
                Move down
              </Button>
              <Button onClick={() => {
                const duplicate = { ...active, id: crypto.randomUUID(), name: `${active.name} copy` };
                const next = [...steps];
                next.splice(activeIndex + 1, 0, duplicate);
                updateSteps(next);
                setActiveIndex(activeIndex + 1);
              }}><ActionIcon name="copy" />Duplicate</Button>
              <Button className="danger" onClick={() => {
                updateSteps(steps.filter((_, index) => index !== activeIndex));
                setActiveIndex(Math.max(0, activeIndex - 1));
              }}><ActionIcon name="delete" />Remove</Button>
            </div>
            <label>Step label
              <Input value={active.name} onChange={(event) => replaceActive({ name: event.target.value })} />
            </label>
            <label>Method
              <select value={active.methodId} onChange={(event) => {
                const method = methods.find((item) => item.id === event.target.value)!;
                replaceActive({
                  methodId: method.id,
                  methodVersion: method.currentVersion,
                  name: method.name,
                  inputBindings: {},
                  parameters: {}
                });
              }}>
                {methods.map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}
              </select>
            </label>
            <label>Method version
              <select value={active.methodVersion} onChange={(event) => replaceActive({
                methodVersion: Number(event.target.value), inputBindings: {}
              })}>
                {(activeMethod?.versions || []).map((item) =>
                  <option key={item.version} value={item.version}>Version {item.version}</option>)}
              </select>
            </label>
            <fieldset>
              <legend>Input bindings</legend>
              {!Object.keys(active.inputBindings).length && <small>This step has no external inputs.</small>}
              {Object.entries(active.inputBindings).map(([from, to]) => (
                <label key={from}>{from}
                  <select value={to} onChange={(event) => replaceActive({
                    inputBindings: { ...active.inputBindings, [from]: event.target.value }
                  })}>
                    {bindingOptions.map((name) => <option key={name} value={name}>{name}</option>)}
                  </select>
                </label>
              ))}
            </fieldset>
            {(activeMethod?.parameters || []).length > 0 && (
              <fieldset>
                <legend>Parameters</legend>
                {(activeMethod?.parameters || []).map((parameter) => (
                  <label key={parameter.name}>{parameter.label}
                    {parameter.type === "boolean" ? (
                      <input type="checkbox"
                        checked={Boolean(active.parameters[parameter.name] ?? parameter.defaultValue)}
                        onChange={(event) => replaceActive({
                          parameters: { ...active.parameters, [parameter.name]: event.target.checked }
                        })} />
                    ) : parameter.type === "choice" ? (
                      <select value={String(active.parameters[parameter.name] ?? parameter.defaultValue)}
                        onChange={(event) => replaceActive({
                          parameters: { ...active.parameters, [parameter.name]: event.target.value }
                        })}>
                        {(parameter.choices || []).map((choice) => <option key={choice}>{choice}</option>)}
                      </select>
                    ) : (
                      <Input type={parameter.type === "number" ? "number" : "text"}
                        value={String(active.parameters[parameter.name] ?? parameter.defaultValue)}
                        onChange={(event) => replaceActive({
                          parameters: {
                            ...active.parameters,
                            [parameter.name]: parameter.type === "number"
                              ? Number(event.target.value)
                              : event.target.value
                          }
                        })} />
                    )}
                  </label>
                ))}
              </fieldset>
            )}
          </>
        )}
      </div>
    </>
  );
}

function NotebookEditor({
  session,
  activeIndex,
  setActiveIndex,
  theme,
  cspNonce,
  onSave,
  onChange
}: {
  session: NotebookEditorSession;
  activeIndex: number;
  setActiveIndex: (value: number) => void;
  theme: "dark" | "light";
  cspNonce: string;
  onSave: () => void;
  onChange: (session: NotebookEditorSession) => void;
}) {
  const cells = session.draft.document.cells;
  const active = cells[activeIndex] || null;
  const managed = active ? isInputBindingsCell(active) : false;
  const updateCells = (nextCells: NotebookCell[]) => onChange({
    ...session,
    dirty: true,
    draft: {
      ...session.draft,
      document: { ...session.draft.document, cells: nextCells },
      updatedAt: new Date().toISOString()
    }
  });
  const replaceActive = (patch: Partial<NotebookCell>) => {
    if (!active || managed) return;
    updateCells(cells.map((cell, index) => index === activeIndex ? { ...cell, ...patch } : cell));
  };
  const addCell = (cellType: NotebookCell["cell_type"]) => {
    const next = [...cells, {
      id: crypto.randomUUID(),
      cell_type: cellType,
      source: "",
      metadata: {},
      ...(cellType === "code" ? { execution_count: null, outputs: [] } : {})
    } as NotebookCell];
    updateCells(next);
    setActiveIndex(next.length - 1);
  };

  return (
    <>
      <aside className="editor-outline notebook-outline">
        <div className="editor-outline-actions"><strong>Notebook cells</strong></div>
        <div className="notebook-add-cell">
          <Button onClick={() => addCell("code")}><span className="cell-type-icon code" />Add Code</Button>
          <Button onClick={() => addCell("markdown")}><span className="cell-type-icon markdown" />Add Markdown</Button>
          <Button onClick={() => addCell("raw")} title="Stored as plain text; not executed or rendered.">
            <span className="cell-type-icon raw" />Add Raw text
          </Button>
          <small>Raw text is stored as written and is not executed or formatted.</small>
        </div>
        <ol>
          {cells.map((cell, index) => (
            <li key={cell.id || index}>
              <button className={index === activeIndex ? "active" : ""}
                onClick={() => setActiveIndex(index)}>
                <span>{index + 1}</span>
                <i className={`cell-type-icon ${isInputBindingsCell(cell) ? "bindings" : cell.cell_type}`} />
                <em>{isInputBindingsCell(cell)
                  ? "Input bindings"
                  : cell.cell_type === "raw" ? "Raw text" : cell.cell_type}</em>
              </button>
            </li>
          ))}
        </ol>
      </aside>
      <div className="editor-detail notebook-cell-editor">
        {!active ? <p>Add a cell to this Notebook.</p> : (
          <>
            <div className="notebook-cell-actions">
              <label>Cell type
                <select disabled={managed} value={active.cell_type}
                  onChange={(event) => replaceActive({
                    cell_type: event.target.value as NotebookCell["cell_type"],
                    outputs: [],
                    execution_count: null
                  })}>
                  <option value="code">Code</option>
                  <option value="markdown">Markdown</option>
                  <option value="raw">Raw text (not executed)</option>
                </select>
              </label>
              <Button disabled={managed || activeIndex === 0}
                onClick={() => { updateCells(move(cells, activeIndex, activeIndex - 1)); setActiveIndex(activeIndex - 1); }}>
                Move up
              </Button>
              <Button disabled={managed || activeIndex === cells.length - 1}
                onClick={() => { updateCells(move(cells, activeIndex, activeIndex + 1)); setActiveIndex(activeIndex + 1); }}>
                Move down
              </Button>
              <Button disabled={managed} onClick={() => {
                const duplicate = { ...active, id: crypto.randomUUID(), outputs: [], execution_count: null };
                const next = [...cells];
                next.splice(activeIndex + 1, 0, duplicate);
                updateCells(next);
                setActiveIndex(activeIndex + 1);
              }}><ActionIcon name="copy" />Duplicate</Button>
              <Button className="danger" disabled={managed} onClick={() => {
                updateCells(cells.filter((_, index) => index !== activeIndex));
                setActiveIndex(Math.max(0, activeIndex - 1));
              }}><ActionIcon name="delete" />Delete</Button>
            </div>
            {managed && <p className="editor-managed-note">Maintained automatically from ready Workspace inputs.</p>}
            <CodeEditor
              value={sourceText(active)}
              language={active.cell_type === "code" ? "python" : active.cell_type === "markdown" ? "markdown" : "text"}
              theme={theme}
              readOnly={managed}
              onSave={onSave}
              cspNonce={cspNonce}
              onChange={(source) => replaceActive({ source })}
            />
          </>
        )}
      </div>
    </>
  );
}
