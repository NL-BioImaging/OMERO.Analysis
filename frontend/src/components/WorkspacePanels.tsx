import type {
  ArtifactRecord,
  DataProfile,
  ProviderSettings,
  RuntimeProgress,
  TokenUsage,
  WorkspaceFile
} from "../types";
import { Artifact } from "./ExecutionCard";

function bytesLabel(value: number): string {
  if (value < 1024) return `${value} B`;
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} KiB`;
  return `${(value / 1024 ** 2).toFixed(1)} MiB`;
}

function usageSummary(usage: TokenUsage | null, contextWindow: number): string {
  if (!usage) return "Context usage appears after the first AI response.";
  const requestTokens = usage.promptTokens + usage.completionTokens;
  const source = usage.estimated ? "estimated" : "API reported";
  const limit = contextWindow > 0
    ? ` · ${Math.min(100, Math.round(requestTokens / contextWindow * 100))}% of ${contextWindow.toLocaleString()}`
    : " · model limit not configured";
  return `Latest request: ${usage.promptTokens.toLocaleString()} input + ${usage.completionTokens.toLocaleString()} output tokens (${source})${limit} · session: ${usage.sessionTokens.toLocaleString()}`;
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

function FilePreview({ file }: { file: WorkspaceFile }) {
  if (file.type === "image/png" || file.type === "image/svg+xml") {
    return <Artifact file={file} />;
  }
  if (!file.data) return <p className="artifact-help">This file is not available locally.</p>;
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

export function ViewerPreviewCard({
  artifact,
  file,
  onInspect,
  onSaveBundle
}: {
  artifact: ArtifactRecord;
  file?: WorkspaceFile;
  onInspect: (file: WorkspaceFile) => void;
  onSaveBundle: (artifact: ArtifactRecord, file: WorkspaceFile) => void;
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
  onReset
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
}) {
  return (
    <>
      {!runtimeReady && (
        <div className="runtime-progress" role="status" aria-live="polite">
          <div><strong>{runtimeProgress.message}</strong><span>{Math.round(runtimeProgress.percent)}%</span></div>
          <progress max="100" value={runtimeProgress.percent} />
          <small>Please wait. The question box unlocks automatically when browser Python is ready.</small>
        </div>
      )}
      <div className="status" role="status">{status}</div>
      <div className="usage-status">
        <span>Azure receives prompts, generated code, bounded schemas/previews/statistics, summaries, and errors — never source files.</span>
        <span>{usageSummary(usage, settings.contextWindow || 0)}</span>
      </div>
      {blocked && <div className="blocker">Analysis is blocked until every input is available. Retry, reselect, or remove missing files.</div>}
      {!settings.apiKey || !settings.model ? <div className="blocker">Enter the AmsterdamUMC deployment name and API key in AI settings.</div> : null}
      <div className="composer">
        <div className={`composer-state ${canChat ? "ready" : "waiting"}`}>
          <span aria-hidden="true">{canChat ? "●" : "◷"}</span>
          {canChat ? "Ready — you can ask a question" : composerPlaceholder}
        </div>
        <textarea
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
          ? <button className="stop" onClick={onStop}>Stop</button>
          : <button disabled={!canChat || !prompt.trim()} onClick={onSend}>Send</button>}
        <button disabled={busy || !runtimeReady} onClick={onReset}>Reset Python</button>
      </div>
    </>
  );
}

export function ArtifactInspector({
  open,
  file,
  profiles,
  canUpload,
  onToggle,
  onDownload,
  onAttach
}: {
  open: boolean;
  file?: WorkspaceFile | null;
  profiles: DataProfile[];
  canUpload: boolean;
  onToggle: () => void;
  onDownload: (file: WorkspaceFile) => void;
  onAttach: (file: WorkspaceFile) => void;
}) {
  return (
    <aside className={`artifact-inspector ${open ? "open" : ""}`}>
      <div className="artifact-header">
        <div>
          <span>Artifact inspector</span>
          <strong>{file?.name || "Data profile"}</strong>
        </div>
        <button
          aria-label={open ? "Close artifact inspector" : "Open artifact inspector"}
          onClick={onToggle}
        >
          {open ? "×" : "›"}
        </button>
      </div>
      {open && (
        <div className="artifact-body">
          {file ? (
            <>
              <FilePreview file={file} />
              <dl className="artifact-metadata">
                <dt>Size</dt><dd>{bytesLabel(file.size)}</dd>
                <dt>SHA-256</dt><dd>{file.sha256}</dd>
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
                <button onClick={() => onDownload(file)}>Download</button>
                {canUpload && <button onClick={() => onAttach(file)}>Attach to OMERO</button>}
              </div>
            </>
          ) : (
            <>
              <p className="artifact-help">
                Local schema profiles are generated without sending source files to Azure.
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
      )}
    </aside>
  );
}
