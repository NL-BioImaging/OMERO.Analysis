import type {
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
              <Artifact file={file} />
              <dl className="artifact-metadata">
                <dt>Size</dt><dd>{bytesLabel(file.size)}</dd>
                <dt>SHA-256</dt><dd>{file.sha256}</dd>
                <dt>Created</dt><dd>{new Date(file.createdAt).toLocaleString()}</dd>
              </dl>
              <div className="artifact-buttons">
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
