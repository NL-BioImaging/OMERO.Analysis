import { useEffect, useMemo, useRef, useState } from "react";
import {
  completeChat,
  OmeroBridge,
  toolErrorText,
  toolResultText,
  type AiMessage,
  type ToolCall
} from "./api";
import {
  MAX_FILE_BYTES,
  MAX_TOOL_TEXT,
  MAX_WORKSPACE_BYTES,
  PROVIDER_NAME,
  SYSTEM_PROMPT,
  TEMPERATURE
} from "./constants";
import { PythonRuntime } from "./runtime";
import {
  defaultSettings,
  deleteValue,
  getValue,
  setValue,
  settingsKey,
  type PersistedWorkspace
} from "./storage";
import type {
  ChatMessage,
  ProviderSettings,
  RuntimeOutput,
  RuntimeProgress,
  TokenUsage,
  WorkspaceFile
} from "./types";

const id = () => crypto.randomUUID();
const supported = /\.(duckdb|sqlite3?|csv|tsv|json|xlsx?|parquet|npy|npz)$/i;
const fileType = (name: string) =>
  name.endsWith(".png") ? "image/png" :
    name.endsWith(".svg") ? "image/svg+xml" :
      name.endsWith(".csv") ? "text/csv" :
        name.endsWith(".json") ? "application/json" :
          "application/octet-stream";

function workspaceKey(): string {
  const context = window.OMERO_ANALYSIS_CHAT.context;
  return context
    ? `workspace:${context.user_id}:${context.group_id}:${context.object_type}:${context.object_id}`
    : "workspace:standalone";
}

function listFiles(files: WorkspaceFile[]): string {
  return JSON.stringify(
    files.map((file) => ({
      path: `${file.source === "result" ? "/output" : "/input"}/${file.name}`,
      size: file.size,
      type: file.type,
      state: file.state
    }))
  );
}

function estimateTokens(value: unknown): number {
  return Math.max(1, Math.ceil(JSON.stringify(value).length / 4));
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

export default function App() {
  const bootstrap = window.OMERO_ANALYSIS_CHAT;
  const bridge = useMemo(() => new OmeroBridge(bootstrap), [bootstrap]);
  const runtime = useMemo(() => new PythonRuntime(bootstrap.runtimeBase), [bootstrap]);
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const filesRef = useRef(files);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [settings, setSettings] = useState<ProviderSettings>(defaultSettings);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [runtimeReady, setRuntimeReady] = useState(false);
  const [status, setStatus] = useState("Preparing workspace…");
  const [showSettings, setShowSettings] = useState(false);
  const [usage, setUsage] = useState<TokenUsage | null>(null);
  const [runtimeProgress, setRuntimeProgress] = useState<RuntimeProgress>({
    percent: 0,
    message: "Preparing the browser workspace…"
  });
  const abort = useRef<AbortController | null>(null);
  const messagesElement = useRef<HTMLDivElement | null>(null);
  filesRef.current = files;

  const blockedFiles = files.filter((file) => file.state !== "ready");
  const canChat =
    runtimeReady &&
    blockedFiles.length === 0 &&
    Boolean(settings.apiKey && settings.model) &&
    !busy;
  const composerPlaceholder = busy
    ? "Analysis in progress — wait for the answer or press Stop…"
    : blockedFiles.some((file) => file.state === "failed")
      ? "Chat is blocked — retry or remove the failed data file…"
      : blockedFiles.length
        ? "Downloading selected data — chat will unlock when every file is ready…"
        : !runtimeReady
          ? `${runtimeProgress.message} (${Math.round(runtimeProgress.percent)}%) — please wait…`
          : !settings.apiKey || !settings.model
            ? "Configure the AmsterdamUMC deployment and API key before asking a question…"
            : "Ask a question about the loaded data…";

  useEffect(() => {
    const element = messagesElement.current;
    if (!element) return;
    const frame = requestAnimationFrame(() => {
      element.scrollTo({ top: element.scrollHeight, behavior: "auto" });
    });
    return () => cancelAnimationFrame(frame);
  }, [messages, files]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [savedSettings, savedWorkspace] = await Promise.all([
        getValue<ProviderSettings>(settingsKey),
        getValue<PersistedWorkspace>(workspaceKey())
      ]);
      if (!alive) return;
      if (savedSettings) setSettings({ ...defaultSettings, ...savedSettings });
      if (savedWorkspace) {
        setMessages(savedWorkspace.messages || []);
        setFiles((savedWorkspace.files || []).filter((file) => file.state === "ready"));
      }
      await bridge.connect();
      const selected = bootstrap.context?.selected_attachments || [];
      const existingIds = new Set(
        (savedWorkspace?.files || []).map((file) => file.annotationId)
      );
      const pending: WorkspaceFile[] = selected
        .filter((attachment) => !existingIds.has(attachment.annotation_id))
        .map((attachment) => ({
          id: id(),
          name: attachment.name,
          type: attachment.mimetype,
          size: attachment.size,
          source: "omero",
          state: "loading",
          annotationId: attachment.annotation_id
        }));
      let readyFiles = [...(savedWorkspace?.files || []).filter((file) => file.state === "ready")];
      let downloadFailed = false;
      if (pending.length) {
        setFiles([...readyFiles, ...pending]);
        setStatus(`Downloading 0 of ${pending.length} selected attachments…`);
        setRuntimeProgress({
          percent: 0,
          message: `Downloading 0 of ${pending.length} selected attachments…`
        });
        for (let index = 0; index < pending.length; index += 1) {
          const file = pending[index];
          const attachment = selected.find(
            (item) => item.annotation_id === file.annotationId
          )!;
          try {
            const currentBytes = readyFiles.reduce((sum, item) => sum + item.size, 0);
            if (currentBytes + attachment.size > MAX_WORKSPACE_BYTES) {
              throw new Error("Selected attachments exceed the 512 MiB workspace limit");
            }
            const data = await bridge.download(attachment);
            const completed = { ...file, data, size: data.byteLength, state: "ready" as const };
            readyFiles = [...readyFiles, completed];
            setFiles((current) =>
              current.map((item) => item.id === file.id ? completed : item)
            );
          } catch (error) {
            downloadFailed = true;
            setFiles((current) =>
              current.map((item) =>
                item.id === file.id
                  ? { ...item, state: "failed", error: String(error) }
                  : item
              )
            );
          }
          setStatus(`Downloaded ${index + 1} of ${pending.length} attachments`);
          setRuntimeProgress({
            percent: Math.round((index + 1) / pending.length * 100),
            message: `Downloaded ${index + 1} of ${pending.length} selected attachments`
          });
        }
      }
      const current = pending.length
        ? readyFiles
        : (savedWorkspace?.files || []).filter((file) => file.state === "ready");
      if (alive && !downloadFailed) {
        setStatus("Loading browser Python runtime…");
        setRuntimeProgress({
          percent: 1,
          message: "Starting the browser Python runtime…"
        });
        await runtime.start(current, (progress) => {
          if (!alive) return;
          setRuntimeProgress(progress);
          setStatus(progress.message);
        });
        if (alive) {
          setRuntimeReady(true);
          setRuntimeProgress({ percent: 100, message: "Browser Python is ready" });
          setStatus("Ready — analysis runs locally in this browser");
        }
      } else if (alive) {
        setRuntimeProgress({
          percent: 0,
          message: "Download failed — retry or remove the failed file"
        });
        setStatus("Download failed — retry or remove failed files to continue");
      }
    })().catch((error) => {
      if (alive) {
        setRuntimeProgress({
          percent: 0,
          message: `Workspace failed: ${String(error)}`
        });
        setStatus(`Workspace failed: ${String(error)}`);
      }
    });
    return () => {
      alive = false;
      runtime.dispose();
    };
  }, [bootstrap, bridge, runtime]);

  useEffect(() => {
    void setValue<PersistedWorkspace>(workspaceKey(), { messages, files });
  }, [messages, files]);

  async function saveSettings(next: ProviderSettings) {
    setSettings(next);
    await setValue(settingsKey, next);
  }

  function reportRuntime(progress: RuntimeProgress) {
    setRuntimeProgress(progress);
    setStatus(progress.message);
  }

  async function restartRuntime(next: WorkspaceFile[], finalStatus: string) {
    setRuntimeReady(false);
    setRuntimeProgress({ percent: 1, message: "Restarting browser Python…" });
    await runtime.start(next, reportRuntime);
    setRuntimeProgress({ percent: 100, message: "Browser Python is ready" });
    setRuntimeReady(true);
    setStatus(finalStatus);
  }

  async function addLocalFiles(list: FileList | null) {
    if (!list) return;
    const additions: WorkspaceFile[] = [];
    let total = files.reduce((sum, file) => sum + file.size, 0);
    for (const file of Array.from(list)) {
      if (!supported.test(file.name)) {
        setStatus(`${file.name} is not a supported tabular data file`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setStatus(`${file.name} exceeds the 256 MiB file limit`);
        continue;
      }
      total += file.size;
      if (total > MAX_WORKSPACE_BYTES) {
        setStatus("The workspace would exceed 512 MiB");
        break;
      }
      additions.push({
        id: id(),
        name: file.name,
        type: file.type || fileType(file.name),
        size: file.size,
        source: "local",
        state: "ready",
        data: await file.arrayBuffer()
      });
    }
    const next = [...files, ...additions];
    setFiles(next);
    await restartRuntime(next, "Ready — analysis runs locally in this browser");
  }

  async function removeFile(fileId: string) {
    const next = files.filter((file) => file.id !== fileId);
    setFiles(next);
    await restartRuntime(next, "File removed; runtime reset");
  }

  async function retryFile(fileId: string) {
    const file = files.find((item) => item.id === fileId);
    const attachment = bootstrap.context?.selected_attachments.find(
      (item) => item.annotation_id === file?.annotationId
    );
    if (!file || !attachment) return;
    setFiles((current) =>
      current.map((item) =>
        item.id === fileId ? { ...item, state: "loading", error: undefined } : item
      )
    );
    try {
      const data = await bridge.download(attachment);
      const next = files.map((item) =>
        item.id === fileId
          ? { ...item, data, size: data.byteLength, state: "ready" as const, error: undefined }
          : item
      );
      setFiles(next);
      await restartRuntime(next, "Attachment downloaded; workspace ready");
    } catch (error) {
      setFiles((current) =>
        current.map((item) =>
          item.id === fileId ? { ...item, state: "failed", error: String(error) } : item
        )
      );
    }
  }

  async function executeTool(call: ToolCall): Promise<string> {
    let args: any = {};
    try {
      args = JSON.parse(call.function.arguments || "{}");
    } catch (error) {
      return toolErrorText(`Invalid JSON tool arguments: ${String(error)}`);
    }
    if (call.function.name === "list_workspace_files") return listFiles(filesRef.current);
    if (call.function.name === "reset_python") {
      try {
        await runtime.reset();
        return "Python state reset; canonical inputs restored.";
      } catch (error) {
        return toolErrorText(error);
      }
    }
    if (call.function.name !== "run_python" || typeof args.code !== "string") {
      return toolErrorText(`Unsupported or invalid tool call: ${call.function.name}`);
    }
    setMessages((current) => [
      ...current,
      { id: id(), role: "assistant", content: "Running Python locally", kind: "code", code: args.code }
    ]);
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );
    let output: RuntimeOutput;
    try {
      output = await runtime.run(args.code);
    } catch (error) {
      const detail = String(error instanceof Error ? error.message : error)
        .slice(0, MAX_TOOL_TEXT);
      setMessages((current) => [
        ...current,
        {
          id: id(),
          role: "tool",
          content:
            `Python failed locally. The bounded error was sent to ${PROVIDER_NAME} for an automatic correction:\n${detail}`,
          kind: "error"
        }
      ]);
      setStatus("Python error sent to AmsterdamUMC; waiting for corrected code…");
      return toolErrorText(error);
    }
    const generated: WorkspaceFile[] = output.files.map((file) => ({
      id: id(),
      name: file.name,
      type: file.type,
      size: file.data.byteLength,
      source: "result",
      state: "ready",
      data: file.data
    }));
    if (generated.length) setFiles((current) => [...current.filter((f) => f.source !== "result" || !generated.some((g) => g.name === f.name)), ...generated]);
    setMessages((current) => [
      ...current,
      {
        id: id(),
        role: "tool",
        content: [output.stdout, output.stderr].filter(Boolean).join("\n").slice(0, MAX_TOOL_TEXT),
        kind: "result",
        preview: output.preview,
        artifacts: generated
          .filter((file) => file.type === "image/png" || file.type === "image/svg+xml")
          .map((file) => file.name)
      }
    ]);
    setStatus("Python completed locally; continuing the analysis…");
    return toolResultText(output);
  }

  async function sendPrompt() {
    const text = prompt.trim();
    if (!text || !canChat) return;
    setPrompt("");
    setBusy(true);
    abort.current = new AbortController();
    const user: ChatMessage = { id: id(), role: "user", content: text };
    setMessages((current) => [...current, user]);
    const conversation: AiMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
        .filter((message) => message.kind !== "code" && message.role !== "tool")
        .map((message) => ({ role: message.role as "user" | "assistant", content: message.content })),
      { role: "user", content: text }
    ];
    try {
      for (let turn = 0; turn < 8; turn += 1) {
        const estimatedPrompt = estimateTokens(conversation);
        const response = await completeChat(settings, conversation, abort.current.signal);
        const answer = response.choices[0]?.message;
        if (!answer) throw new Error("AmsterdamUMC returned no response");
        const promptTokens = response.usage?.prompt_tokens ?? estimatedPrompt;
        const completionTokens =
          response.usage?.completion_tokens ?? estimateTokens(answer.content || answer.tool_calls || "");
        const totalTokens = response.usage?.total_tokens ?? promptTokens + completionTokens;
        setUsage((current) => ({
          promptTokens,
          completionTokens,
          totalTokens,
          sessionTokens: (current?.sessionTokens || 0) + totalTokens,
          estimated: !response.usage
        }));
        conversation.push({
          role: "assistant",
          content: answer.content,
          tool_calls: answer.tool_calls
        });
        if (answer.content) {
          setMessages((current) => [
            ...current,
            { id: id(), role: "assistant", content: answer.content! }
          ]);
        }
        if (!answer.tool_calls?.length) break;
        for (const call of answer.tool_calls) {
          const result = await executeTool(call);
          conversation.push({ role: "tool", tool_call_id: call.id, content: result });
        }
        if (turn === 7) throw new Error("The analysis exceeded eight tool rounds");
      }
    } catch (error) {
      if (!abort.current?.signal.aborted) {
        setMessages((current) => [
          ...current,
          { id: id(), role: "assistant", content: String(error), kind: "error" }
        ]);
      }
    } finally {
      if (!abort.current?.signal.aborted) {
        setStatus("Ready — analysis runs locally in this browser");
      }
      abort.current = null;
      setBusy(false);
    }
  }

  function stop() {
    abort.current?.abort();
    runtime.stop();
    setBusy(false);
    setRuntimeReady(false);
    setStatus("Stopped; restoring the browser runtime…");
    setRuntimeProgress({ percent: 1, message: "Restoring browser Python…" });
    void runtime.start(files, reportRuntime).then(() => {
      setRuntimeProgress({ percent: 100, message: "Browser Python is ready" });
      setRuntimeReady(true);
      setStatus("Ready — analysis runs locally in this browser");
    });
  }

  async function clearWorkspace() {
    if (!confirm("Clear this browser-local conversation, files, and results?")) return;
    setMessages([]);
    setFiles([]);
    setUsage(null);
    await deleteValue(workspaceKey());
    await restartRuntime([], "Workspace cleared");
  }

  function download(file: WorkspaceFile) {
    if (!file.data) return;
    const url = URL.createObjectURL(new Blob([file.data], { type: file.type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function attach(file: WorkspaceFile) {
    if (!confirm(`Attach ${file.name} to the selected OMERO object?`)) return;
    try {
      const result = await bridge.attach(file);
      setStatus(`Attached ${result.name} as FileAnnotation ${result.annotation_id}`);
    } catch (error) {
      setStatus(`Attach failed: ${String(error)}`);
    }
  }

  return (
    <main className="app-shell">
      <header>
        <div>
          <h1>OMERO.AnalysisChat</h1>
          <p>{bootstrap.context ? `${bootstrap.context.object_type} ${bootstrap.context.object_id} — ${bootstrap.context.name}` : "Local workspace"}</p>
        </div>
        <div className="header-actions">
          <span className="privacy-badge">Python and source files stay in this browser</span>
          <button onClick={() => setShowSettings(!showSettings)}>AI settings</button>
          <button onClick={clearWorkspace}>Clear</button>
        </div>
      </header>

      {showSettings && (
        <form className="settings-card" onSubmit={(event) => event.preventDefault()}>
          <h2>{PROVIDER_NAME}</h2>
          <p className="warning">The API key is stored unencrypted in this browser profile. Never use this on a shared computer.</p>
          <label>Deployment/model
            <input value={settings.model} onChange={(event) => void saveSettings({ ...settings, model: event.target.value })} placeholder="GPT-5 deployment name" />
          </label>
          <label>API key
            <input type="password" value={settings.apiKey} onChange={(event) => void saveSettings({ ...settings, apiKey: event.target.value })} autoComplete="off" />
          </label>
          <label>Model context window (optional)
            <input
              type="number"
              min="0"
              step="1"
              value={settings.contextWindow || ""}
              onChange={(event) => void saveSettings({
                ...settings,
                contextWindow: Math.max(0, Number(event.target.value) || 0)
              })}
              placeholder="Used only to calculate a percentage"
            />
          </label>
          <p>Temperature is fixed at <strong>{TEMPERATURE}</strong>.</p>
          <button onClick={() => void saveSettings({ ...settings, apiKey: "" })}>Forget API key</button>
        </form>
      )}

      <div className="workspace">
        <aside>
          <div className="aside-heading">
            <h2>Data</h2>
            <label className="upload-button">Add files
              <input type="file" multiple accept=".duckdb,.sqlite,.sqlite3,.csv,.tsv,.json,.xlsx,.xls,.parquet,.npy,.npz" onChange={(event) => void addLocalFiles(event.target.files)} />
            </label>
          </div>
          <ul className="file-list">
            {files.map((file) => (
              <li key={file.id} className={`file-${file.state}`}>
                <div><strong>{file.name}</strong><small>{(file.size / 1024).toFixed(1)} KiB · {file.source}</small></div>
                <span>{file.state}</span>
                {file.error && <p>{file.error}</p>}
                <div className="file-actions">
                  {file.state === "failed" && file.annotationId && <button onClick={() => void retryFile(file.id)}>Retry</button>}
                  {file.source === "result" && <button onClick={() => download(file)}>Download</button>}
                  {file.source === "result" && bridge.canUpload && <button onClick={() => void attach(file)}>Attach</button>}
                  <button onClick={() => void removeFile(file.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <section className="chat">
          <div className="messages" aria-live="polite" ref={messagesElement}>
            {!messages.length && <div className="welcome"><h2>What would you like to learn from these data?</h2><p>I can inspect schemas, query databases, calculate summaries, compare groups, and create plots or downloadable results.</p></div>}
            {messages.map((message) => {
              const execution = message.kind === "code" || message.role === "tool";
              const label = message.kind === "code"
                ? "Python code (local)"
                : message.kind === "error"
                  ? "Tool error"
                  : "Tool output";
              return (
              <article key={message.id} className={`message ${message.role} ${message.kind || ""} ${execution ? "execution" : ""}`}>
                {execution ? (
                  <details className="execution-details">
                    <summary>
                      <span>{label}</span>
                      <small>Show details</small>
                    </summary>
                    <div className="execution-content">
                      {message.code ? <pre><code>{message.code}</code></pre> : <p>{message.content}</p>}
                      {message.preview != null && <Preview value={message.preview} />}
                    </div>
                  </details>
                ) : (
                  <>
                    <span>{message.role}</span>
                    <p>{message.content}</p>
                    {message.preview != null && <Preview value={message.preview} />}
                  </>
                )}
                {message.artifacts?.map((name) => {
                  const file = files.find((item) => item.source === "result" && item.name === name);
                  return file ? <Artifact key={name} file={file} /> : null;
                })}
              </article>
              );
            })}
          </div>
          {!runtimeReady && (
            <div className="runtime-progress" role="status" aria-live="polite">
              <div>
                <strong>{runtimeProgress.message}</strong>
                <span>{Math.round(runtimeProgress.percent)}%</span>
              </div>
              <progress max="100" value={runtimeProgress.percent} />
              <small>Please wait. The question box unlocks automatically when browser Python is ready.</small>
            </div>
          )}
          <div className="status" role="status">{status}</div>
          <div className="usage-status">
            <span>Azure receives prompts, code, bounded schemas/previews/statistics, and execution errors — never source files.</span>
            <span>{usageSummary(usage, settings.contextWindow || 0)}</span>
          </div>
          {blockedFiles.length > 0 && <div className="blocker">Analysis is blocked until every selected attachment finishes downloading. Retry or remove failed files.</div>}
          {!settings.apiKey || !settings.model ? <div className="blocker">Enter the AmsterdamUMC deployment name and API key in AI settings.</div> : null}
          <div className="composer">
            <div className={`composer-state ${canChat ? "ready" : "waiting"}`}>
              <span aria-hidden="true">{canChat ? "●" : "◷"}</span>
              {canChat ? "Ready — you can ask a question" : composerPlaceholder}
            </div>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendPrompt(); } }} disabled={!canChat} placeholder={composerPlaceholder} />
            {busy ? <button className="stop" onClick={stop}>Stop</button> : <button disabled={!canChat || !prompt.trim()} onClick={() => void sendPrompt()}>Send</button>}
            <button disabled={busy || !runtimeReady} onClick={() => void restartRuntime(files, "Python state reset; inputs restored")}>Reset Python</button>
          </div>
        </section>
      </div>
    </main>
  );
}

function Preview({ value }: { value: any }) {
  if (value?.kind === "table" && value.data) {
    const columns: string[] = value.data.columns || [];
    const rows: unknown[][] = value.data.data || [];
    return <div className="table-wrap"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{String(cell ?? "")}</td>)}</tr>)}</tbody></table></div>;
  }
  return <pre className="preview">{JSON.stringify(value, null, 2)}</pre>;
}

function Artifact({ file }: { file: WorkspaceFile }) {
  const url = useMemo(
    () => file.data ? URL.createObjectURL(new Blob([file.data], { type: file.type })) : "",
    [file.data, file.type]
  );
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  return url ? <figure><img src={url} alt={file.name} /><figcaption>{file.name}</figcaption></figure> : null;
}
