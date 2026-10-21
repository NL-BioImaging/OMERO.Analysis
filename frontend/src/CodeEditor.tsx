import { useEffect, useRef } from "react";
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

export type EditorLanguage = "python" | "markdown" | "json" | "sql" | "text";
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
  if (language === "sql") return sql({ dialect: StandardSQL });
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

export function CodeEditor({
  value,
  label = "Code editor",
  language,
  theme,
  readOnly = false,
  onChange,
  onSave,
  cspNonce,
  onRun
}: {
  value: string;
  label?: string;
  language: EditorLanguage;
  theme: "dark" | "light";
  readOnly?: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  cspNonce: string;
  onRun?: () => void;
}) {
  const host = useRef<HTMLDivElement | null>(null);
  const view = useRef<EditorView | null>(null);
  const updating = useRef(false);
  const onChangeRef = useRef(onChange);
  const onSaveRef = useRef(onSave);
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;
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
        EditorView.contentAttributes.of({ "aria-label": label }),
        keymap.of([{ key: "Shift-Enter", preventDefault: true, run: () => { onRunRef.current?.(); return true; } }, ...searchKeymap, {
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
  }, [language, readOnly, theme, label]);

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
