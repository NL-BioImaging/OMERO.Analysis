import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  ArtifactRecord,
  DataProfile,
  NotebookRecord,
  PipelineRecord,
  ProviderSettings,
  RuntimeProgress,
  TokenUsage,
  WorkspaceFile
} from "../types";
import { Artifact } from "./ExecutionCard";
import { ActionIcon } from "./ActionIcon";
import { Button, TextArea } from "./BlueprintControls";

function bytesLabel(value: number): string {
  if (value < 1024) return `${value} B`;
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} KiB`;
  return `${(value / 1024 ** 2).toFixed(1)} MiB`;
}

export function usageSummary(usage: TokenUsage | null, contextWindow: number): string {
  if (!usage) return "Context usage appears after the first AI response.";
  const source = usage.estimated ? "estimated" : "API reported";
  const configuredWindow = usage.contextWindow || contextWindow;
  const context = configuredWindow > 0
    ? `Context: ${usage.promptTokens.toLocaleString()} / ${configuredWindow.toLocaleString()} tokens (${Math.min(100, usage.promptTokens / configuredWindow * 100).toFixed(1)}%)`
    : `Context: ${usage.promptTokens.toLocaleString()} tokens · model limit not configured`;
  const compaction = usage.compacted
    ? `Compacted ${usage.compactedMessages.toLocaleString()} earlier message${usage.compactedMessages === 1 ? "" : "s"} into a summary; pinned messages and the latest six exchanges are retained.`
    : `Not compacted · local compaction trigger: ${usage.compactionThreshold.toLocaleString()} estimated conversation tokens.`;
  return `${context} (${source}) · response: ${usage.completionTokens.toLocaleString()} tokens · session: ${usage.sessionTokens.toLocaleString()} tokens · ${compaction}`;
}

export function parseDelimited(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === "\"") {
      if (quoted && text[index + 1] === "\"") {
        value += "\"";
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === delimiter && !quoted) {
      row.push(value);
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.length)) rows.push(row);
      row = [];
      value = "";
      if (rows.length >= 101) break;
    } else {
      value += character;
    }
  }
  if (row.length || value) {
    row.push(value);
    if (row.some((cell) => cell.length)) rows.push(row);
  }
  return rows.map((cells) => cells.slice(0, 50));
}

export function delimitedShape(text: string, delimiter: string): {
  rows: number;
  columns: number;
} {
  let quoted = false;
  let cells = 1;
  let columns = 0;
  let rows = 0;
  let hasContent = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === "\"") {
      if (quoted && text[index + 1] === "\"") index += 1;
      else quoted = !quoted;
      hasContent = true;
    } else if (character === delimiter && !quoted) {
      cells += 1;
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      if (hasContent || cells > 1) {
        if (!columns) columns = cells;
        else rows += 1;
      }
      cells = 1;
      hasContent = false;
    } else if (!/\s/.test(character)) {
      hasContent = true;
    }
  }
  if (hasContent || cells > 1) {
    if (!columns) columns = cells;
    else rows += 1;
  }
  return { rows, columns };
}

function ProfileTablePreview({ profile }: { profile: DataProfile }) {
  const preview = profile.summary.preview;
  if (!preview || typeof preview !== "object") return null;
  const columns = Array.isArray((preview as { columns?: unknown }).columns)
    ? (preview as { columns: unknown[] }).columns.map(String).slice(0, 50)
    : [];
  const data = Array.isArray((preview as { data?: unknown }).data)
    ? (preview as { data: unknown[] }).data.slice(0, 100)
    : [];
  if (!columns.length) return null;
  const sheet = typeof profile.summary.sheet === "string"
    ? profile.summary.sheet
    : "";
  const sheets = Array.isArray(profile.summary.sheets)
    ? profile.summary.sheets.map(String)
    : [];
  return (
    <div className="table-wrap artifact-table">
      {sheet && (
        <p className="artifact-help">
          Workbook sheet: <strong>{sheet}</strong>
          {sheets.length > 1 ? ` · ${sheets.length} sheets in workbook` : ""}
        </p>
      )}
      <table>
        <thead><tr>{columns.map((column, index) => (
          <th key={index}>{column}</th>
        ))}</tr></thead>
        <tbody>{data.map((rowValue, rowIndex) => {
          const row = Array.isArray(rowValue) ? rowValue : [];
          return (
            <tr key={rowIndex}>
              {columns.map((_, cellIndex) => (
                <td key={cellIndex}>{String(row[cellIndex] ?? "")}</td>
              ))}
            </tr>
          );
        })}</tbody>
      </table>
      {typeof profile.summary.rows === "number" &&
        profile.summary.rows > data.length && (
          <p className="artifact-help">
            Preview limited to {data.length.toLocaleString()} of{" "}
            {profile.summary.rows.toLocaleString()} rows.
          </p>
        )}
    </div>
  );
}

function FilePreview({
  file,
  profile
}: {
  file: WorkspaceFile;
  profile?: DataProfile;
}) {
  if (file.type === "image/png" || file.type === "image/svg+xml") {
    return <Artifact file={file} />;
  }
  if (!file.data) return <p className="artifact-help">This file is not available locally.</p>;
  if (/\.(xlsx?|xls)$/i.test(file.name)) {
    const preview = profile ? <ProfileTablePreview profile={profile} /> : null;
    if (preview) return preview;
    return (
      <p className="artifact-help">
        {profile?.error
          ? `Workbook preview could not be generated: ${profile.error}`
          : "Workbook preview is being prepared by the local Python runtime…"}
      </p>
    );
  }
  if (file.type.startsWith("text/") || /\.(csv|tsv|json|md|txt)$/i.test(file.name)) {
    const text = new TextDecoder().decode(file.data);
    if (/\.(csv|tsv)$/i.test(file.name)) {
      const rows = parseDelimited(text, /\.tsv$/i.test(file.name) ? "\t" : ",");
      const [header = [], ...body] = rows;
      return (
        <div className="table-wrap artifact-table">
          <table>
            <thead><tr>{header.map((cell, index) => <th key={index}>{cell}</th>)}</tr></thead>
            <tbody>{body.map((rowValue, rowIndex) => (
              <tr key={rowIndex}>
                {header.map((_, cellIndex) => <td key={cellIndex}>{rowValue[cellIndex] || ""}</td>)}
              </tr>
            ))}</tbody>
          </table>
          {rows.length >= 101 && <p className="artifact-help">Preview limited to 100 rows.</p>}
        </div>
      );
    }
    return <pre className="artifact-text-preview">{text.slice(0, 64 * 1024)}</pre>;
  }
  return (
    <p className="artifact-help">
      Preview is not available for this file type. Use Download to open the file.
    </p>
  );
}

export function PythonPreview({ code }: { code: string }) {
  const tokenPattern = /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|False|finally|for|from|global|if|import|in|is|lambda|None|nonlocal|not|or|pass|raise|return|True|try|while|with|yield)\b|\b\d+(?:\.\d+)?\b)/g;
  const parts: Array<{ value: string; kind?: string }> = [];
  let offset = 0;
  for (const match of code.matchAll(tokenPattern)) {
    if (match.index! > offset) parts.push({ value: code.slice(offset, match.index) });
    const value = match[0];
    const kind = value.startsWith("#")
      ? "comment"
      : /^["']/.test(value)
        ? "string"
        : /^\d/.test(value)
          ? "number"
          : "keyword";
    parts.push({ value, kind });
    offset = match.index! + value.length;
  }
  if (offset < code.length) parts.push({ value: code.slice(offset) });
  return (
    <pre className="artifact-text-preview artifact-code-preview">
      <code>{parts.map((part, index) =>
        part.kind
          ? <span className={`syntax-${part.kind}`} key={index}>{part.value}</span>
          : part.value
      )}</code>
    </pre>
  );
}

function markdownInline(value: string): ReactNode[] {
  const pattern = /(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|\[[^\]\n]+\]\([^) \n]+\))/g;
  const parts: ReactNode[] = [];
  let offset = 0;
  for (const match of value.matchAll(pattern)) {
    if (match.index! > offset) parts.push(value.slice(offset, match.index));
    const token = match[0];
    if (token.startsWith("`")) {
      parts.push(<code key={match.index}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**") || token.startsWith("__")) {
      parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const href = link?.[2] || "";
      parts.push(
        /^https?:\/\//i.test(href)
          ? <a key={match.index} href={href} target="_blank" rel="noopener noreferrer">{link?.[1]}</a>
          : token
      );
    }
    offset = match.index! + token.length;
  }
  if (offset < value.length) parts.push(value.slice(offset));
  return parts;
}

export function MarkdownPreview({
  markdown,
  collapsePython = false
}: {
  markdown: string;
  collapsePython?: boolean;
}) {
  const lines = markdown.slice(0, 128 * 1024).replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    const fence = line.match(/^\s*```([\w+-]*)\s*$/);
    if (fence) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^\s*```\s*$/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      const codeBlock = (
        <pre className="markdown-code">
          <code data-language={fence[1] || undefined}>{code.join("\n")}</code>
        </pre>
      );
      blocks.push(collapsePython && /^(?:python|py)$/i.test(fence[1])
        ? (
          <details className="assistant-method-code" key={blocks.length}>
            <summary>Show reusable Method code</summary>
            {codeBlock}
          </details>
        )
        : <Fragment key={blocks.length}>{codeBlock}</Fragment>);
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const Heading = `h${heading[1].length}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      blocks.push(<Heading key={blocks.length}>{markdownInline(heading[2])}</Heading>);
      index += 1;
      continue;
    }
    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      blocks.push(<blockquote key={blocks.length}>{markdownInline(quote[1])}</blockquote>);
      index += 1;
      continue;
    }
    const listMatch = line.match(/^\s*(?:[-*+]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      const ordered = /^\s*\d+\./.test(line);
      const items: ReactNode[] = [];
      while (index < lines.length) {
        const item = lines[index].match(
          ordered ? /^\s*\d+\.\s+(.+)$/ : /^\s*[-*+]\s+(.+)$/
        );
        if (!item) break;
        items.push(<li key={items.length}>{markdownInline(item[1])}</li>);
        index += 1;
      }
      blocks.push(
        ordered
          ? <ol key={blocks.length}>{items}</ol>
          : <ul key={blocks.length}>{items}</ul>
      );
      continue;
    }
    const paragraph: string[] = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(?:#{1,6}\s|>\s?|```|\s*(?:[-*+]|\d+\.)\s+)/.test(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push(
      <p key={blocks.length}>
        {paragraph.map((part, partIndex) => (
          <Fragment key={partIndex}>
            {partIndex > 0 && <br />}
            {markdownInline(part)}
          </Fragment>
        ))}
      </p>
    );
  }
  return <div className="artifact-markdown-preview">{blocks}</div>;
}

function DatabaseSchemaPreview({ profile }: { profile: DataProfile }) {
  const tables = Array.isArray(profile.summary.tables)
    ? profile.summary.tables as Array<{
        name?: unknown;
        columns?: Array<{ name?: unknown; type?: unknown }>;
      }>
    : [];
  if (!tables.length) return null;
  return (
    <section className="database-schema-preview">
      <h3>Database schema</h3>
      {tables.map((table, tableIndex) => {
        const columns = Array.isArray(table.columns) ? table.columns : [];
        return (
          <details key={`${String(table.name)}-${tableIndex}`}>
            <summary>{String(table.name || `Table ${tableIndex + 1}`)} <small>{columns.length} columns</small></summary>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Column</th><th>Type</th></tr></thead>
                <tbody>
                  {columns.map((column, columnIndex) => (
                    <tr key={columnIndex}>
                      <td>{String(column.name || "")}</td>
                      <td>{String(column.type || "")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        );
      })}
    </section>
  );
}

function notebookOutput(output: Record<string, any>, index: number): ReactNode {
  if (output.output_type === "stream") {
    const text = Array.isArray(output.text) ? output.text.join("") : String(output.text || "");
    return <pre className="notebook-inspector-output" key={index}>{text.slice(0, 16 * 1024)}</pre>;
  }
  if (output.output_type === "error") {
    return (
      <pre className="notebook-inspector-output error" key={index}>
        {`${output.ename || "Error"}: ${output.evalue || ""}`}
      </pre>
    );
  }
  const data = output.data && typeof output.data === "object" ? output.data : {};
  const png = data["image/png"];
  if (typeof png === "string" || Array.isArray(png)) {
    return (
      <img
        className="notebook-inspector-image"
        key={index}
        alt="Notebook PNG output"
        src={`data:image/png;base64,${(Array.isArray(png) ? png.join("") : png).replace(/\s/g, "")}`}
      />
    );
  }
  if ("application/json" in data) {
    return (
      <pre className="notebook-inspector-output" key={index}>
        {JSON.stringify(data["application/json"], null, 2).slice(0, 16 * 1024)}
      </pre>
    );
  }
  if ("text/plain" in data) {
    const text = Array.isArray(data["text/plain"])
      ? data["text/plain"].join("")
      : String(data["text/plain"]);
    return <pre className="notebook-inspector-output" key={index}>{text.slice(0, 16 * 1024)}</pre>;
  }
  return <p className="artifact-help" key={index}>Unsupported rich output hidden for safety.</p>;
}

function NotebookInspectorPreview({ notebook }: { notebook: NotebookRecord }) {
  return (
    <div className="notebook-inspector-preview">
      {notebook.document.cells.map((cell, index) => {
        const source = Array.isArray(cell.source) ? cell.source.join("") : cell.source;
        return (
          <article key={cell.id || index}>
            <div className="notebook-inspector-cell-heading">
              <strong>{cell.cell_type === "code" ? `Code [${cell.execution_count ?? " "}]` : "Markdown"}</strong>
              <span>Cell {index + 1}</span>
            </div>
            {cell.cell_type === "code"
              ? <PythonPreview code={source} />
              : cell.cell_type === "markdown"
                ? <MarkdownPreview markdown={source} />
                : <pre className="artifact-text-preview">{source}</pre>}
            {cell.cell_type === "code" && Boolean(cell.outputs?.length) && (
              <div className="notebook-inspector-outputs">
                {(cell.outputs || []).map((output, outputIndex) =>
                  notebookOutput(output as Record<string, any>, outputIndex))}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function PipelineInspectorPreview({ pipeline }: { pipeline: PipelineRecord }) {
  return (
    <ol className="pipeline-inspector-preview">
      {pipeline.steps.map((step, index) => {
        const bindings = Object.entries(step.inputBindings || {});
        const parameters = Object.entries(step.parameters || {});
        return (
          <li key={step.id}>
            <span className="pipeline-inspector-step-number">{index + 1}</span>
            <div>
              <strong>{step.name}</strong>
              <small>Saved Method version {step.methodVersion}</small>
              {bindings.length > 0 ? (
                <dl className="pipeline-binding-list">
                  {bindings.map(([expected, resolved]) => (
                    <Fragment key={expected}>
                      <dt>{expected}</dt><dd><span aria-hidden="true">→</span>{resolved}</dd>
                    </Fragment>
                  ))}
                </dl>
              ) : <em>Automatic input matching</em>}
              {parameters.length > 0 && (
                <details><summary>{parameters.length} parameter{parameters.length === 1 ? "" : "s"}</summary>
                  <dl className="pipeline-parameter-list">{parameters.flatMap(([name, value]) => [
                    <dt key={`${name}-term`}>{name}</dt>,
                    <dd key={`${name}-value`}>{String(value)}</dd>
                  ])}</dl>
                </details>
              )}
            </div>
          </li>
        );
      })}
      {!pipeline.steps.length && <li className="pipeline-inspector-empty">No Method steps yet.</li>}
    </ol>
  );
}

export function ViewerPreviewCard({
  artifact,
  file,
  onInspect,
  onSaveBundle,
  saveDisabled = false
}: {
  artifact: ArtifactRecord;
  file?: WorkspaceFile;
  onInspect: (file: WorkspaceFile) => void;
  onSaveBundle: (artifact: ArtifactRecord, file: WorkspaceFile) => void;
  saveDisabled?: boolean;
}) {
  const viewer = artifact.viewer || file?.viewer;
  if (!viewer) return null;
  return (
    <article className="viewer-preview-card">
      <div className="viewer-preview-heading">
        <div>
          <span>OME-Zarr view</span>
          <strong>{artifact.title}</strong>
        </div>
        {viewer.viewerUrl ? (
          <a
            className="button-link"
            href={viewer.viewerUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in ZarrViewer
          </a>
        ) : (
          <span className="viewer-link-pending">
            Revalidate this preview in the current OMERO object to reopen it
          </span>
        )}
      </div>
      {file && (
        <>
          <button className="viewer-preview-image" onClick={() => onInspect(file)}>
            <Artifact file={file} />
          </button>
          {viewer.renderRecipe && (
            <button
              className="button-link"
              disabled={saveDisabled}
              title={saveDisabled ? "Wait until the assistant has finished its summary" : undefined}
              onClick={() => onSaveBundle(artifact, file)}
            >
              Save analysis + render
            </button>
          )}
        </>
      )}
      <small>
        Field {viewer.field} · ROI {viewer.roi.join(", ")}
        {viewer.croppedField ? " · centered preview; full field opens in ZarrViewer" : ""}
      </small>
    </article>
  );
}

export function ComposerPanel({
  runtimeReady,
  runtimeProgress,
  status,
  usage,
  settings,
  blocked,
  canChat,
  composerPlaceholder,
  prompt,
  busy,
  onPromptChange,
  onSend,
  onStop,
  onReset,
  attachments = [],
  onAddAttachments,
  onAddAttachmentUrl,
  onDownloadAttachment,
  onRemoveAttachment,
  onReselectAttachment
}: {
  runtimeReady: boolean;
  runtimeProgress: RuntimeProgress;
  status: string;
  usage: TokenUsage | null;
  settings: ProviderSettings;
  blocked: boolean;
  canChat: boolean;
  composerPlaceholder: string;
  prompt: string;
  busy: boolean;
  onPromptChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  onReset: () => void;
  attachments?: WorkspaceFile[];
  onAddAttachments?: (files: File[]) => void;
  onAddAttachmentUrl?: () => void;
  onDownloadAttachment?: (file: WorkspaceFile) => void;
  onRemoveAttachment?: (file: WorkspaceFile) => void;
  onReselectAttachment?: (file: WorkspaceFile, source: File) => void;
}) {
  const needsApiKey =
    settings.protocol === "anthropic" || settings.authMode !== "none";
  const providerMissing = Boolean(
    !settings.endpoint || !settings.model || (needsApiKey && !settings.apiKey)
  );
  return (
    <>
      {!runtimeReady && (
        <RuntimeProgressPanel progress={runtimeProgress} />
      )}
      <div className="status" role="status">{status}</div>
      <div className="usage-status">
        <span>Ordinary workspace inputs remain browser-local. For selected Assistant attachments, extracted text or metadata-stripped image pixels are sent to the configured AI provider; original PDF and DOCX bytes are never sent.</span>
        <span>{usageSummary(usage, settings.contextWindow || 0)}</span>
      </div>
      {blocked && <div className="blocker">Analysis is blocked until every input is available. Retry, reselect, or remove missing files.</div>}
      {providerMissing ? (
        <div className="blocker">
          {`Enter an AI endpoint and model${needsApiKey ? ", and API key" : ""} in Settings.`}
        </div>
      ) : null}
      <div className="chat-attachments" aria-label="Assistant attachments">
        <div className="attachment-actions">
          <label className={`button-like ${busy ? "disabled" : ""}`}>
            <ActionIcon name="attach" />Attach files
            <input
              hidden
              type="file"
              multiple
              disabled={busy}
              accept=".txt,.pdf,.docx,.png,.jpg,.jpeg,.webp,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg,image/webp"
              onChange={(event) => {
                onAddAttachments?.(Array.from(event.target.files || []));
                event.target.value = "";
              }}
            />
          </label>
          <Button disabled={busy} onClick={onAddAttachmentUrl}>
            <ActionIcon name="attach" />File URL
          </Button>
          <small>{attachments.length}/10 active · 25 MiB each · no OCR</small>
        </div>
        {attachments.length ? (
          <ul className="attachment-chips">
            {attachments.map((file) => (
              <li key={file.id} className={`attachment-chip ${file.state}`}>
                <span>
                  <strong title={file.name}>{file.name}</strong>
                  <small>{bytesLabel(file.size)} · {file.state}</small>
                  {file.attachment?.warnings?.map((warning) => (
                    <em key={warning}>{warning}</em>
                  ))}
                  {file.error && <em>{file.error}</em>}
                </span>
                <Button disabled={!file.data} aria-label={`Download ${file.name}`}
                  onClick={() => onDownloadAttachment?.(file)}><ActionIcon name="download" /></Button>
                {(file.state === "missing" || file.state === "failed") && (
                  <label className="attachment-reselect" title={`Reselect ${file.name}`}>
                    <ActionIcon name="upload" />
                    <input hidden type="file" accept=".txt,.pdf,.docx,.png,.jpg,.jpeg,.webp"
                      onChange={(event) => {
                        const source = event.target.files?.[0];
                        if (source) onReselectAttachment?.(file, source);
                        event.target.value = "";
                      }} />
                  </label>
                )}
                <Button disabled={busy} aria-label={`Remove ${file.name}`}
                  onClick={() => onRemoveAttachment?.(file)}><ActionIcon name="delete" /></Button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="composer">
        <div className={`composer-state ${canChat ? "ready" : "waiting"}`}>
          <span aria-hidden="true">{canChat ? "●" : "◷"}</span>
          {canChat ? "Ready — you can ask a question" : composerPlaceholder}
        </div>
        <TextArea
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSend();
            }
          }}
          disabled={!canChat}
          placeholder={composerPlaceholder}
        />
        {busy
          ? <Button className="stop" onClick={onStop}><ActionIcon name="stop" />Stop</Button>
          : <Button disabled={!canChat || !prompt.trim()} onClick={onSend}><ActionIcon name="run" />Send</Button>}
        <Button disabled={busy || !runtimeReady} onClick={onReset}><ActionIcon name="reset" />Reset Python</Button>
      </div>
    </>
  );
}

export function RuntimeProgressPanel({
  progress,
  detail = "Your request is queued. Analysis continues automatically when the required Python packages are ready.",
  label = "Loading browser Python"
}: {
  progress: RuntimeProgress;
  detail?: string;
  label?: string;
}) {
  const percent = Math.max(0, Math.min(100, Math.round(progress.percent)));
  return (
    <div className="runtime-progress" role="status" aria-live="polite">
      <div><strong>{progress.message}</strong><span>{percent}%</span></div>
      <progress max="100" value={percent} aria-label={label} />
      <small>{detail}</small>
    </div>
  );
}

export function ArtifactInspector({
  item,
  profiles,
  canUpload,
  onDownload,
  onAttach,
  onEdit
}: {
  item?: InspectorItem | null;
  profiles: DataProfile[];
  canUpload: boolean;
  onDownload: (file: WorkspaceFile) => void;
  onAttach: (file: WorkspaceFile) => void;
  onEdit?: (item: InspectorItem) => void;
}) {
  const file = item?.file;
  const fileProfile = file
    ? profiles.find((profile) =>
        profile.path.replace(/\\/g, "/").endsWith(`/${file.name}`))
    : undefined;
  const localDelimitedShape = useMemo(() => {
    if (
      !file?.data ||
      file.data.byteLength > 32 * 1024 * 1024 ||
      !/\.(csv|tsv)$/i.test(file.name)
    ) return undefined;
    const text = new TextDecoder().decode(file.data);
    return delimitedShape(text, /\.tsv$/i.test(file.name) ? "\t" : ",");
  }, [file?.id, file?.data, file?.name]);
  const profileColumns = fileProfile && Array.isArray(fileProfile.summary.columns)
    ? fileProfile.summary.columns
    : [];
  const profileRows = fileProfile && typeof fileProfile.summary.rows === "number"
    ? fileProfile.summary.rows
    : localDelimitedShape?.rows;
  const profileColumnCount = profileColumns.length || localDelimitedShape?.columns || 0;
  const [imageDimensions, setImageDimensions] =
    useState<{ width: number; height: number } | null>(null);
  useEffect(() => {
    setImageDimensions(null);
    if (!file?.data || file.type !== "image/png") return;
    const url = URL.createObjectURL(new Blob([file.data], { type: file.type }));
    const image = new Image();
    image.onload = () => {
      setImageDimensions({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file?.id, file?.data, file?.type]);
  return (
    <aside className="artifact-inspector open">
      <div className="artifact-header">
        <div>
          <span>Artifact inspector</span>
          <strong>{item?.title || "Workspace overview"}</strong>
        </div>
        {item && onEdit && ["method", "pipeline", "notebook"].includes(item.kind) && (
          <Button aria-label={`Edit selected ${item.kind}`} onClick={() => onEdit(item)}>
            <ActionIcon name="edit" />Edit {item.kind[0].toUpperCase() + item.kind.slice(1)}
          </Button>
        )}
      </div>
      <div className="artifact-body">
          {item && !file ? (
            <>
              {item.description && <p className="artifact-help">{item.description}</p>}
              {item.metadata && (
                <dl className="artifact-metadata">
                  {Object.entries(item.metadata).flatMap(([key, value]) => [
                    <dt key={`${key}-term`}>{key}</dt>,
                    <dd key={`${key}-value`}>{String(value)}</dd>
                  ])}
                </dl>
              )}
              {item.methodNarrative && (
                <section className="method-inspector-narrative" aria-label="Method summary and review">
                  <MarkdownPreview markdown={item.methodNarrative} />
                </section>
              )}
              {item.content && (
                item.language === "python"
                  ? <details className="method-source-preview">
                      <summary>View Python source</summary>
                      <PythonPreview code={item.content} />
                    </details>
                  : item.language === "markdown"
                    ? <MarkdownPreview markdown={item.content} />
                  : <pre className="artifact-text-preview">{item.content}</pre>
              )}
              {item.pipeline && <PipelineInspectorPreview pipeline={item.pipeline} />}
              {item.notebook && <NotebookInspectorPreview notebook={item.notebook} />}
            </>
          ) : file ? (
            <>
              <FilePreview file={file} profile={fileProfile} />
              {fileProfile && ["duckdb", "sqlite", "sqlite3"].includes(fileProfile.format) && (
                <DatabaseSchemaPreview profile={fileProfile} />
              )}
              <dl className="artifact-metadata">
                <dt>Size</dt><dd>{bytesLabel(file.size)}</dd>
                {profileRows != null && <><dt>Rows</dt><dd>{profileRows.toLocaleString()}</dd></>}
                {profileColumnCount > 0 && <><dt>Columns</dt><dd>{profileColumnCount}</dd></>}
                {imageDimensions && (
                  <><dt>Pixels</dt><dd>{imageDimensions.width} × {imageDimensions.height}</dd></>
                )}
                <dt>Created</dt><dd>{new Date(file.createdAt).toLocaleString()}</dd>
              </dl>
              <div className="artifact-buttons">
                {file.viewer?.viewerUrl && (
                  <a
                    className="button-link"
                    href={file.viewer.viewerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in ZarrViewer
                  </a>
                )}
                <Button onClick={() => onDownload(file)}><ActionIcon name="download" />Download</Button>
                {canUpload && <Button onClick={() => onAttach(file)}><ActionIcon name="attach" />Attach to OMERO</Button>}
              </div>
            </>
          ) : (
            <>
              <p className="artifact-help">
                Local schema profiles are generated without sending source files to the AI provider.
              </p>
              {profiles.map((profile) => (
                <details key={profile.path} open>
                  <summary>{profile.format.toUpperCase()} input profile</summary>
                  <pre>{JSON.stringify(profile.summary, null, 2)}</pre>
                  {profile.error && <p className="execution-error">{profile.error}</p>}
                </details>
              ))}
              {!profiles.length && <p className="artifact-help">Add a supported input to inspect it.</p>}
            </>
          )}
        </div>
    </aside>
  );
}

export interface InspectorItem {
  kind: "workspace" | "folder" | "chat" | "file" | "method" | "pipeline" | "notebook" | "zarr";
  title: string;
  description?: string;
  metadata?: Record<string, string | number>;
  content?: string;
  methodNarrative?: string;
  language?: "python" | "json" | "markdown";
  notebook?: NotebookRecord;
  pipeline?: PipelineRecord;
  file?: WorkspaceFile;
}
