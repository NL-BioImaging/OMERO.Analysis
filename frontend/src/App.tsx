import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  completeChat,
  OmeroBridge,
  toolErrorText,
  toolResultText,
  type AiMessage,
  type ToolCall
} from "./api";
import { exportProject, importProject } from "./archive";
import {
  MAX_FILE_BYTES,
  MAX_TOOL_TEXT,
  MAX_WORKSPACE_BYTES,
  PROVIDER_NAME,
  SYSTEM_PROMPT
} from "./constants";
import { PythonRuntime, RUNTIME_VERSION } from "./runtime";
import {
  defaultSettings,
  deleteFile as deleteStoredFile,
  getValue,
  listContextProjects,
  loadOrCreateWorkspace,
  loadWorkspace,
  newChat,
  saveChat,
  saveExecution,
  saveFile,
  saveProject,
  saveScript,
  saveWorkspace,
  settingsKey,
  setValue,
  sha256,
  storageEstimate
} from "./storage";
import type {
  Attachment,
  ChatMessage,
  ChatRecord,
  ExecutionRecord,
  ProjectRecord,
  ProjectWorkspace,
  ProviderSettings,
  RuntimeOutput,
  RuntimeProgress,
  ScriptRecord,
  TokenUsage,
  WorkspaceFile
} from "./types";

const supported = /\.(duckdb|sqlite3?|csv|tsv|json|xlsx?|parquet|npy|npz)$/i;
const DEFAULT_MAX_SNAPSHOT_BYTES = 256 * 1024 * 1024;
const id = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const fileType = (name: string) =>
  name.toLowerCase().endsWith(".png") ? "image/png" :
    name.toLowerCase().endsWith(".svg") ? "image/svg+xml" :
      name.toLowerCase().endsWith(".csv") ? "text/csv" :
        name.toLowerCase().endsWith(".json") ? "application/json" :
          "application/octet-stream";

function slug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 72)
    .toLowerCase() || "analysis";
}

function titleFromPrompt(value: string): string {
  const concise = value.replace(/\s+/g, " ").trim().slice(0, 64);
  return concise ? concise.charAt(0).toUpperCase() + concise.slice(1) : "New analysis";
}

function listFiles(files: WorkspaceFile[]): string {
  return JSON.stringify(
    files.map((file) => ({
      path: file.source === "result" ? `/output/${file.name}` : `/input/${file.name}`,
      logical_path: file.logicalPath,
      sha256: file.sha256,
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

function compactSummary(messages: ChatMessage[]): string {
  return messages
    .filter((message) => message.kind !== "execution")
    .slice(0, -12)
    .map((message) => `${message.role}: ${message.content.replace(/\s+/g, " ").slice(0, 240)}`)
    .join("\n")
    .slice(-12_000);
}

function bytesLabel(value: number): string {
  if (value >= 1024 * 1024 * 1024) return `${(value / 1024 / 1024 / 1024).toFixed(1)} GiB`;
  if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)} MiB`;
  if (value >= 1024) return `${(value / 1024).toFixed(1)} KiB`;
  return `${value} bytes`;
}

function projectBytes(workspace: ProjectWorkspace | null): number {
  return workspace?.files.reduce((sum, file) => sum + file.size, 0) || 0;
}

interface BrowserMenuAction {
  label: string;
  run: () => void;
  danger?: boolean;
}

interface BrowserMenuState {
  x: number;
  y: number;
  title: string;
  actions: BrowserMenuAction[];
}

export default function App() {
  const bootstrap = window.OMERO_ANALYSIS_CHAT;
  const bridge = useMemo(() => new OmeroBridge(bootstrap), [bootstrap]);
  const runtime = useMemo(() => new PythonRuntime(bootstrap.runtimeBase), [bootstrap]);
  const [workspace, setWorkspace] = useState<ProjectWorkspace | null>(null);
  const workspaceRef = useRef<ProjectWorkspace | null>(null);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [snapshots, setSnapshots] = useState<Attachment[]>([]);
  const [settings, setSettings] = useState<ProviderSettings>(defaultSettings);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [runtimeReady, setRuntimeReady] = useState(false);
  const [status, setStatus] = useState("Preparing project…");
  const [showSettings, setShowSettings] = useState(false);
  const [browserMenu, setBrowserMenu] = useState<BrowserMenuState | null>(null);
  const [openFolders, setOpenFolders] = useState({
    inputs: true,
    outputs: true,
    scripts: true,
    snapshots: false
  });
  const [usage, setUsage] = useState<TokenUsage | null>(null);
  const [runtimeProgress, setRuntimeProgress] = useState<RuntimeProgress>({
    percent: 0,
    message: "Preparing the browser workspace…"
  });
  const [storage, setStorage] = useState({ usage: 0, quota: 0 });
  const abort = useRef<AbortController | null>(null);
  const messagesElement = useRef<HTMLDivElement | null>(null);
  const importInput = useRef<HTMLInputElement | null>(null);
  const addFilesInput = useRef<HTMLInputElement | null>(null);
  const turnOutputNames = useRef(new Set<string>());
  workspaceRef.current = workspace;

  const project = workspace?.project || null;
  const chats = workspace?.chats || [];
  const activeChat = chats.find((chat) => chat.id === project?.activeChatId) || chats[0] || null;
  const inputFiles = (workspace?.files || []).filter((file) => file.source !== "result");
  const outputFiles = (workspace?.files || []).filter(
    (file) => file.source === "result" && file.chatId === activeChat?.id
  );
  const blockedFiles = inputFiles.filter((file) => file.state !== "ready");
  const canChat =
    Boolean(activeChat) &&
    runtimeReady &&
    blockedFiles.length === 0 &&
    Boolean(settings.apiKey && settings.model) &&
    !busy;
  const composerPlaceholder = busy
    ? "Analysis in progress — wait for the answer or press Stop…"
    : blockedFiles.some((file) => file.state === "failed" || file.state === "missing")
      ? "Chat is blocked — retry, reselect, or remove the missing data file…"
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
  }, [activeChat?.messages, workspace?.executions, workspace?.files]);

  useEffect(() => {
    if (!browserMenu) return;
    const close = () => setBrowserMenu(null);
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("click", close);
    window.addEventListener("blur", close);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("blur", close);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", escape);
    };
  }, [browserMenu]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [savedSettings, initial] = await Promise.all([
        getValue<ProviderSettings>(settingsKey),
        loadOrCreateWorkspace(bootstrap.context)
      ]);
      if (!alive) return;
      if (savedSettings) setSettings({ ...defaultSettings, ...savedSettings });
      await bridge.connect();
      let prepared = await prepareInputs(initial);
      if (!alive) return;
      setWorkspace(prepared);
      workspaceRef.current = prepared;
      setProjects(await listContextProjects(bootstrap.context));
      setSnapshots(await bridge.listSnapshots());
      await startRuntime(prepared.files);
      if (alive) {
        setRuntimeReady(true);
        setRuntimeProgress({ percent: 100, message: "Browser Python is ready" });
        setStatus("Ready — analysis runs locally in this browser");
        setStorage(await storageEstimate());
      }
    })().catch((error) => {
      if (!alive) return;
      setStatus(`Project failed: ${String(error)}`);
      setRuntimeProgress({ percent: 0, message: `Project failed: ${String(error)}` });
    });
    return () => {
      alive = false;
      runtime.dispose();
    };
  }, [bootstrap, bridge, runtime]);

  async function prepareInputs(initial: ProjectWorkspace): Promise<ProjectWorkspace> {
    let next = initial;
    const existing = new Map(
      next.files.filter((file) => file.annotationId).map((file) => [file.annotationId!, file])
    );
    const selected = bootstrap.context?.selected_attachments || [];
    for (const attachment of selected) {
      if (existing.has(attachment.annotation_id)) continue;
      const file: WorkspaceFile = {
        id: id(),
        projectId: next.project.id,
        name: attachment.name,
        logicalPath: `${next.project.rootPath}/inputs/${attachment.annotation_id}--${attachment.name}`,
        type: attachment.mimetype,
        size: attachment.size,
        sha256: "",
        source: "omero",
        state: "loading",
        annotationId: attachment.annotation_id,
        fileId: attachment.file_id,
        createdAt: now()
      };
      next = { ...next, files: [...next.files, file] };
      existing.set(attachment.annotation_id, file);
    }
    const candidates = next.files.filter(
      (file) => file.source === "omero" && file.annotationId && (!file.data || file.state !== "ready")
    );
    for (let index = 0; index < candidates.length; index += 1) {
      const file = candidates[index];
      setRuntimeProgress({
        percent: Math.round(index / Math.max(1, candidates.length) * 90),
        message: `Downloading ${index + 1} of ${candidates.length} OMERO inputs…`
      });
      try {
        const attachment: Attachment = {
          annotation_id: file.annotationId!,
          file_id: file.fileId || 0,
          name: file.name,
          mimetype: file.type,
          size: file.size,
          kind: "attachment",
          supported: true
        };
        const data = await bridge.download(attachment);
        const downloadedHash = await sha256(data);
        if (file.sha256 && file.sha256 !== downloadedHash) {
          throw new Error(
            `OMERO input ${file.name} no longer matches the snapshot hash`
          );
        }
        const completed: WorkspaceFile = {
          ...file,
          data,
          size: data.byteLength,
          sha256: downloadedHash,
          state: "ready",
          error: undefined
        };
        next = {
          ...next,
          files: next.files.map((item) => item.id === file.id ? completed : item)
        };
        await saveFile(completed);
      } catch (error) {
        const failed: WorkspaceFile = { ...file, state: "failed", error: String(error) };
        next = {
          ...next,
          files: next.files.map((item) => item.id === file.id ? failed : item)
        };
        await saveFile(failed);
      }
    }
    await saveWorkspace(next);
    return next;
  }

  function reportRuntime(progress: RuntimeProgress) {
    setRuntimeProgress(progress);
    setStatus(progress.message);
  }

  async function startRuntime(files: WorkspaceFile[]) {
    setRuntimeReady(false);
    setRuntimeProgress({ percent: 1, message: "Starting browser Python…" });
    await runtime.start(
      files.filter((file) => file.source !== "result" && file.state === "ready"),
      reportRuntime
    );
  }

  async function restartRuntime(files: WorkspaceFile[], finalStatus: string) {
    await startRuntime(files);
    setRuntimeReady(true);
    setRuntimeProgress({ percent: 100, message: "Browser Python is ready" });
    setStatus(finalStatus);
  }

  function updateProject(next: ProjectRecord) {
    const current = workspaceRef.current;
    if (current) {
      const updated = { ...current, project: next };
      workspaceRef.current = updated;
      setWorkspace(updated);
    }
    void saveProject(next);
  }

  function updateChat(next: ChatRecord) {
    const current = workspaceRef.current;
    if (current) {
      const updated = {
        ...current,
        chats: current.chats.map((chat) => chat.id === next.id ? next : chat)
      };
      workspaceRef.current = updated;
      setWorkspace(updated);
    }
    void saveChat(next);
  }

  function appendMessage(chatId: string, message: ChatMessage) {
    const current = workspaceRef.current;
    if (!current) return;
    const chat = current.chats.find((item) => item.id === chatId);
    if (!chat) return;
    const updatedChat = { ...chat, messages: [...chat.messages, message], updatedAt: now() };
    const updated = {
      ...current,
      chats: current.chats.map((item) => item.id === chatId ? updatedChat : item)
    };
    workspaceRef.current = updated;
    setWorkspace(updated);
    void saveChat(updatedChat);
  }

  function upsertExecution(execution: ExecutionRecord) {
    const current = workspaceRef.current;
    if (!current) return;
    const exists = current.executions.some((item) => item.id === execution.id);
    const updated = {
      ...current,
      executions: exists
        ? current.executions.map((item) => item.id === execution.id ? execution : item)
        : [...current.executions, execution]
    };
    workspaceRef.current = updated;
    setWorkspace(updated);
    void saveExecution(execution);
  }

  function upsertFiles(values: WorkspaceFile[]) {
    if (!values.length) return;
    const current = workspaceRef.current;
    if (!current) return;
    const ids = new Set(values.map((value) => value.id));
    const updated = {
      ...current,
      files: [...current.files.filter((file) => !ids.has(file.id)), ...values]
    };
    workspaceRef.current = updated;
    setWorkspace(updated);
    values.forEach((value) => void saveFile(value));
  }

  async function saveSettings(next: ProviderSettings) {
    setSettings(next);
    await setValue(settingsKey, next);
  }

  async function addLocalFiles(list: FileList | null) {
    if (!list || !workspace) return;
    const additions: WorkspaceFile[] = [];
    let total = projectBytes(workspace);
    for (const source of Array.from(list)) {
      if (!supported.test(source.name)) {
        setStatus(`${source.name} is not a supported tabular data file`);
        continue;
      }
      if (source.size > MAX_FILE_BYTES) {
        setStatus(`${source.name} exceeds the 256 MiB file limit`);
        continue;
      }
      total += source.size;
      if (total > MAX_WORKSPACE_BYTES) {
        setStatus("The project would exceed 512 MiB");
        break;
      }
      const data = await source.arrayBuffer();
      const digest = await sha256(data);
      if ([...workspace.files, ...additions].some(
        (file) => file.sha256 === digest && file.size === data.byteLength
      )) {
        setStatus(`${source.name} matches a file already stored in this project`);
        continue;
      }
      additions.push({
        id: id(),
        projectId: workspace.project.id,
        name: source.name,
        logicalPath: `${workspace.project.rootPath}/inputs/${source.name}`,
        type: source.type || fileType(source.name),
        size: data.byteLength,
        sha256: digest,
        source: "local",
        state: "ready",
        data,
        createdAt: now()
      });
    }
    const nextFiles = [...workspace.files, ...additions];
    upsertFiles(additions);
    await restartRuntime(nextFiles, "Local inputs added; browser Python is ready");
    setStorage(await storageEstimate());
  }

  async function removeFile(fileId: string) {
    if (!workspace) return;
    const file = workspace.files.find((item) => item.id === fileId);
    if (!file) return;
    const nextFiles = workspace.files.filter((item) => item.id !== fileId);
    const updated = { ...workspace, files: nextFiles };
    workspaceRef.current = updated;
    setWorkspace(updated);
    await deleteStoredFile(fileId);
    if (file.source !== "result") {
      await restartRuntime(nextFiles, "Input removed; browser Python was reset");
    }
    setStorage(await storageEstimate());
  }

  async function retryFile(fileId: string) {
    if (!workspace) return;
    const file = workspace.files.find((item) => item.id === fileId);
    if (!file?.annotationId) return;
    const loading = { ...file, state: "loading" as const, error: undefined };
    upsertFiles([loading]);
    try {
      const data = await bridge.download({
        annotation_id: file.annotationId,
        file_id: file.fileId || 0,
        name: file.name,
        mimetype: file.type,
        size: file.size,
        kind: "attachment",
        supported: true
      });
      const ready = {
        ...file,
        data,
        size: data.byteLength,
        sha256: await sha256(data),
        state: "ready" as const,
        error: undefined
      };
      const nextFiles = workspace.files.map((item) => item.id === file.id ? ready : item);
      upsertFiles([ready]);
      await restartRuntime(nextFiles, "OMERO input restored; project ready");
    } catch (error) {
      upsertFiles([{ ...file, state: "failed", error: String(error) }]);
    }
  }

  async function newConversation() {
    if (!workspace) return;
    const chat = newChat(workspace.project.id);
    const nextProject = { ...workspace.project, activeChatId: chat.id, updatedAt: now() };
    const updated = { ...workspace, project: nextProject, chats: [...workspace.chats, chat] };
    workspaceRef.current = updated;
    setWorkspace(updated);
    await Promise.all([saveChat(chat), saveProject(nextProject)]);
    setUsage(null);
    turnOutputNames.current.clear();
    await runtime.beginTurn();
  }

  function switchChat(chatId: string) {
    if (!workspace) return;
    const chat = workspace.chats.find((item) => item.id === chatId);
    if (chat?.archived) updateChat({ ...chat, archived: false, updatedAt: now() });
    const next = { ...workspace.project, activeChatId: chatId, updatedAt: now() };
    updateProject(next);
    setUsage(null);
  }

  function renameChat(chat: ChatRecord) {
    const title = window.prompt("Chat name", chat.title)?.trim();
    if (!title) return;
    updateChat({ ...chat, title: title.slice(0, 100), updatedAt: now() });
  }

  function openBrowserMenu(
    event: ReactMouseEvent,
    title: string,
    actions: BrowserMenuAction[]
  ) {
    event.preventDefault();
    event.stopPropagation();
    const width = 210;
    const height = Math.max(60, actions.length * 34 + 34);
    setBrowserMenu({
      x: Math.min(event.clientX, window.innerWidth - width - 8),
      y: Math.min(event.clientY, window.innerHeight - height - 8),
      title,
      actions
    });
  }

  async function refreshProject() {
    if (!project) return;
    setBrowserMenu(null);
    await switchProject(project.id);
  }

  async function renameWorkspaceFile(file: WorkspaceFile) {
    if (file.source === "omero") {
      setStatus("OMERO attachment names are canonical and cannot be renamed locally");
      return;
    }
    const requested = window.prompt("File name", file.name)?.trim();
    if (!requested || requested === file.name) return;
    let cleanName = requested.replace(/[\\/]/g, "_").slice(0, 180);
    if (!cleanName || cleanName === "." || cleanName === "..") return;
    const extension = file.name.match(/(\.[^.]+)$/)?.[1] || "";
    if (extension && !cleanName.toLowerCase().endsWith(extension.toLowerCase())) {
      if (/\.[^.]+$/.test(cleanName)) {
        setStatus(`Keep the ${extension} extension when renaming ${file.name}`);
        return;
      }
      cleanName += extension;
    }
    const current = workspaceRef.current;
    if (!current) return;
    const siblings = current.files.filter((item) =>
      item.id !== file.id &&
      item.source === file.source &&
      item.chatId === file.chatId
    );
    if (siblings.some((item) => item.name.toLowerCase() === cleanName.toLowerCase())) {
      setStatus(`A file named ${cleanName} already exists in this folder`);
      return;
    }

    const previousStem = file.name.replace(/\.[^.]+$/, "");
    const nextStem = cleanName.replace(/\.[^.]+$/, "");
    const pairExtensions = file.source === "result" &&
      /\.(png|svg|csv)$/i.test(file.name)
      ? new Set(["png", "svg", "csv"])
      : null;
    const renamed = current.files.map((item) => {
      let nextName: string | null = item.id === file.id ? cleanName : null;
      if (
        !nextName &&
        pairExtensions &&
        item.chatId === file.chatId &&
        item.executionId === file.executionId &&
        item.name.replace(/\.[^.]+$/, "") === previousStem &&
        pairExtensions.has(item.name.split(".").at(-1)?.toLowerCase() || "")
      ) {
        nextName = `${nextStem}.${item.name.split(".").at(-1)}`;
      }
      return nextName
        ? {
            ...item,
            name: nextName,
            logicalPath: item.logicalPath.replace(/[^/]+$/, nextName)
          }
        : item;
    });
    const changed = renamed.filter((item, index) => item !== current.files[index]);
    const updated = { ...current, files: renamed };
    workspaceRef.current = updated;
    setWorkspace(updated);
    await Promise.all(changed.map(saveFile));
    if (file.source === "local") {
      await restartRuntime(renamed, `Renamed input to ${cleanName}; browser Python is ready`);
    } else {
      setStatus(
        changed.length > 1
          ? `Renamed ${file.name} and its paired plot data`
          : `Renamed ${file.name} to ${cleanName}`
      );
    }
  }

  function archiveChat(chat: ChatRecord) {
    if (!workspace || workspace.chats.filter((item) => !item.archived).length <= 1) {
      setStatus("Create another chat before archiving this one");
      return;
    }
    const archived = { ...chat, archived: true, updatedAt: now() };
    const fallback = workspace.chats.find((item) => item.id !== chat.id && !item.archived)!;
    updateChat(archived);
    updateProject({ ...workspace.project, activeChatId: fallback.id, updatedAt: now() });
  }

  async function switchProject(projectId: string) {
    const selected = await loadWorkspace(projectId);
    if (!selected) return;
    const prepared = await prepareInputs(selected);
    setWorkspace(prepared);
    workspaceRef.current = prepared;
    await restartRuntime(prepared.files, "Project loaded");
  }

  async function executeCode(
    code: string,
    chatId: string,
    promptId: string,
    force = false
  ): Promise<string> {
    const current = workspaceRef.current;
    if (!current) return toolErrorText("Project is not ready");
    const normalizedCode = code.replace(/\r\n/g, "\n").trimEnd();
    const codeHash = await sha256(normalizedCode);
    const inputHashes = current.files
      .filter((file) => file.source !== "result" && file.state === "ready")
      .map((file) => file.sha256)
      .sort();
    const cacheKey = await sha256(
      `${codeHash}|${inputHashes.join(",")}|${RUNTIME_VERSION}|plotCsv=${current.project.plotCsv}`
    );
    const previous = current.executions
      .filter((execution) => execution.cacheKey === cacheKey && execution.status !== "running")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    if (previous && !force) {
      const reused: ExecutionRecord = {
        ...previous,
        id: id(),
        chatId,
        promptId,
        status: previous.status === "success" || previous.status === "reused" ? "reused" : "failed",
        reusedFrom: previous.id,
        createdAt: now()
      };
      upsertExecution(reused);
      appendMessage(chatId, {
        id: id(),
        role: "assistant",
        content: reused.status === "reused"
          ? "Reused a previous successful local Python run because its code and inputs are unchanged."
          : "Skipped unchanged Python that already failed; AmsterdamUMC must correct the code.",
        kind: "execution",
        executionId: reused.id,
        createdAt: now()
      });
      if (reused.status === "reused") {
        return JSON.stringify({
          reused: true,
          execution_id: previous.id,
          stdout: previous.stdout,
          stderr: previous.stderr,
          preview: previous.preview,
          generated_files: previous.outputFileIds
            .map((fileId) => current.files.find((file) => file.id === fileId))
            .filter(Boolean)
            .map((file) => ({ name: file!.name, size: file!.size, type: file!.type }))
        });
      }
      return toolErrorText(
        `Identical code already failed:\n${previous.stderr || previous.stdout}. Modify the code before trying again.`
      );
    }

    const execution: ExecutionRecord = {
      id: id(),
      projectId: current.project.id,
      chatId,
      promptId,
      code: normalizedCode,
      codeHash,
      cacheKey,
      status: "running",
      stdout: "",
      stderr: "",
      outputFileIds: [],
      missingPlotCsv: [],
      inputHashes,
      runtimeVersion: RUNTIME_VERSION,
      model: settings.model,
      createdAt: now()
    };
    upsertExecution(execution);
    appendMessage(chatId, {
      id: id(),
      role: "assistant",
      content: "Python execution",
      kind: "execution",
      executionId: execution.id,
      createdAt: now()
    });

    let output: RuntimeOutput;
    try {
      output = await runtime.run(normalizedCode);
    } catch (error) {
      const detail = String(error instanceof Error ? error.message : error).slice(0, MAX_TOOL_TEXT);
      const failed = { ...execution, status: "failed" as const, stderr: detail };
      upsertExecution(failed);
      setStatus("Python error sent to AmsterdamUMC; waiting for corrected code…");
      return toolErrorText(error);
    }

    const generated: WorkspaceFile[] = [];
    for (const file of output.files) {
      const fileId = id();
      generated.push({
        id: fileId,
        projectId: current.project.id,
        chatId,
        executionId: execution.id,
        name: file.name,
        logicalPath: `${current.project.rootPath}/chats/${chatId}/outputs/${execution.id}/${file.name}`,
        type: file.type,
        size: file.data.byteLength,
        sha256: await sha256(file.data),
        source: "result",
        state: "ready",
        data: file.data,
        createdAt: now()
      });
      turnOutputNames.current.add(file.name);
    }
    upsertFiles(generated);

    const missing = current.project.plotCsv
      ? Array.from(turnOutputNames.current)
        .filter((name) => /\.(png|svg)$/i.test(name))
        .filter((name) => !turnOutputNames.current.has(name.replace(/\.(png|svg)$/i, ".csv")))
      : [];
    const completed: ExecutionRecord = {
      ...execution,
      status: missing.length ? "incomplete" : "success",
      stdout: output.stdout,
      stderr: output.stderr,
      preview: output.preview,
      outputFileIds: generated.map((file) => file.id),
      missingPlotCsv: missing
    };
    upsertExecution(completed);

    if (!missing.length) {
      const latest = workspaceRef.current;
      for (const prior of latest?.executions || []) {
        if (prior.chatId !== chatId || prior.promptId !== promptId || !prior.missingPlotCsv.length) continue;
        const remaining = prior.missingPlotCsv.filter(
          (plot) => !turnOutputNames.current.has(plot.replace(/\.(png|svg)$/i, ".csv"))
        );
        if (remaining.length !== prior.missingPlotCsv.length) {
          upsertExecution({
            ...prior,
            status: remaining.length ? "incomplete" : "success",
            missingPlotCsv: remaining
          });
        }
      }
    }

    setStatus("Python completed locally; continuing the analysis…");
    if (missing.length) {
      return toolErrorText(
        `Plot data CSV required. Create ${missing.map((name) => name.replace(/\.(png|svg)$/i, ".csv")).join(", ")} containing the data used for the plot. Do not regenerate unrelated analysis.`
      );
    }
    return toolResultText(output);
  }

  async function executeTool(call: ToolCall, chatId: string, promptId: string): Promise<string> {
    let args: Record<string, any> = {};
    try {
      args = JSON.parse(call.function.arguments || "{}");
    } catch (error) {
      return toolErrorText(`Invalid JSON tool arguments: ${String(error)}`);
    }
    const current = workspaceRef.current;
    if (!current) return toolErrorText("Project is not ready");
    if (call.function.name === "list_workspace_files") return listFiles(current.files);
    if (call.function.name === "reset_python") {
      try {
        await runtime.beginTurn();
        turnOutputNames.current.clear();
        return "Python state reset; canonical project inputs remain available.";
      } catch (error) {
        return toolErrorText(error);
      }
    }
    if (call.function.name === "list_saved_scripts") {
      return JSON.stringify(current.scripts.map((script) => ({
        id: script.id,
        name: script.name,
        description: script.description,
        current_version: script.currentVersion,
        updated_at: script.updatedAt
      })));
    }
    if (call.function.name === "read_saved_script") {
      const script = current.scripts.find((item) => item.id === args.script_id);
      if (!script) return toolErrorText("Saved script was not found");
      const version = script.versions.find((item) => item.version === script.currentVersion);
      return version
        ? JSON.stringify({ id: script.id, name: script.name, version: version.version, code: version.code })
        : toolErrorText("Saved script has no readable current version");
    }
    if (call.function.name === "run_saved_script") {
      const script = current.scripts.find((item) => item.id === args.script_id);
      const version = script?.versions.find((item) => item.version === script.currentVersion);
      return version
        ? executeCode(version.code, chatId, promptId)
        : toolErrorText("Saved script was not found");
    }
    if (call.function.name !== "run_python" || typeof args.code !== "string") {
      return toolErrorText(`Unsupported or invalid tool call: ${call.function.name}`);
    }
    return executeCode(args.code, chatId, promptId);
  }

  async function sendPrompt() {
    const text = prompt.trim();
    const current = workspaceRef.current;
    const chat = current?.chats.find((item) => item.id === current.project.activeChatId);
    if (!text || !canChat || !current || !chat) return;
    setPrompt("");
    setBusy(true);
    abort.current = new AbortController();
    turnOutputNames.current.clear();
    await runtime.beginTurn();
    const promptId = id();
    const user: ChatMessage = {
      id: promptId,
      role: "user",
      content: text,
      createdAt: now()
    };
    appendMessage(chat.id, user);

    let currentChat = {
      ...chat,
      messages: [...chat.messages, user],
      updatedAt: now()
    };
    if (chat.messages.filter((message) => message.role === "user").length === 0) {
      currentChat = { ...currentChat, title: titleFromPrompt(text) };
      updateChat(currentChat);
    }
    const threshold = settings.contextWindow > 0
      ? Math.floor(settings.contextWindow * 0.6)
      : 24_000;
    const ordinary = currentChat.messages.filter((message) => message.kind !== "execution");
    if (estimateTokens(ordinary) > threshold) {
      currentChat = { ...currentChat, summary: compactSummary(ordinary), updatedAt: now() };
      updateChat(currentChat);
    }
    const dynamicPrompt = `${SYSTEM_PROMPT}

Project root: ${current.project.rootPath}
The user has ${current.scripts.length} saved scripts. ${
  current.project.plotCsv
    ? "Plot CSV mode is ON: every PNG or SVG must have a same-stem CSV containing its plotted data."
    : "Plot CSV mode is OFF."
}`;
    const history = ordinary.slice(-12);
    const conversation: AiMessage[] = [
      { role: "system", content: dynamicPrompt },
      ...(currentChat.summary ? [{ role: "system" as const, content: `Earlier conversation summary:\n${currentChat.summary}` }] : []),
      ...history.map((message) => ({ role: message.role as "user" | "assistant", content: message.content }))
    ];
    if (conversation.at(-1)?.content !== text) conversation.push({ role: "user", content: text });

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
        setUsage((value) => ({
          promptTokens,
          completionTokens,
          totalTokens,
          sessionTokens: (value?.sessionTokens || 0) + totalTokens,
          estimated: !response.usage
        }));
        conversation.push({ role: "assistant", content: answer.content, tool_calls: answer.tool_calls });
        if (answer.content) {
          appendMessage(chat.id, {
            id: id(),
            role: "assistant",
            content: answer.content,
            createdAt: now()
          });
        }
        if (!answer.tool_calls?.length) break;
        for (const call of answer.tool_calls) {
          const result = await executeTool(call, chat.id, promptId);
          conversation.push({ role: "tool", tool_call_id: call.id, content: result });
        }
        if (turn === 7) throw new Error("The analysis exceeded eight tool rounds");
      }
    } catch (error) {
      if (!abort.current?.signal.aborted) {
        appendMessage(chat.id, {
          id: id(),
          role: "assistant",
          content: String(error),
          kind: "error",
          createdAt: now()
        });
      }
    } finally {
      if (!abort.current?.signal.aborted) setStatus("Ready — analysis runs locally in this browser");
      abort.current = null;
      setBusy(false);
      setStorage(await storageEstimate());
    }
  }

  function stop() {
    abort.current?.abort();
    runtime.stop();
    setBusy(false);
    void restartRuntime(workspaceRef.current?.files || [], "Ready — analysis runs locally in this browser");
  }

  async function saveAsScript(execution: ExecutionRecord) {
    const current = workspaceRef.current;
    if (!current || !["success", "reused"].includes(execution.status)) return;
    const chat = current.chats.find((item) => item.id === execution.chatId);
    const promptMessage = chat?.messages.find((message) => message.id === execution.promptId);
    const related = current.executions
      .filter((item) =>
        item.chatId === execution.chatId &&
        item.promptId === execution.promptId &&
        ["success", "incomplete"].includes(item.status)
      )
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const scriptCode = Array.from(new Set(related.map((item) => item.code))).join(
      "\n\n# Continued analysis / automatic repair\n"
    ) || execution.code;
    const scriptHash = await sha256(scriptCode);
    const suggested = `${slug(promptMessage?.content || "analysis-script")}.py`;
    const name = window.prompt("Script filename", suggested)?.trim();
    if (!name) return;
    const safeName = `${slug(name.replace(/\.py$/i, ""))}.py`;
    const description = window.prompt(
      "Script description",
      promptMessage?.content.slice(0, 180) || "Reusable Analysis Chat workflow"
    )?.trim() || "";
    const existing = current.scripts.find((script) => script.name.toLowerCase() === safeName.toLowerCase());
    const script: ScriptRecord = existing
      ? {
        ...existing,
        description,
        currentVersion: existing.currentVersion + 1,
        versions: [...existing.versions, {
          version: existing.currentVersion + 1,
          code: scriptCode,
          codeHash: scriptHash,
          executionId: execution.id,
          createdAt: now()
        }],
        updatedAt: now()
      }
      : {
        id: id(),
        projectId: current.project.id,
        name: safeName,
        description,
        currentVersion: 1,
        versions: [{
          version: 1,
          code: scriptCode,
          codeHash: scriptHash,
          executionId: execution.id,
          createdAt: now()
        }],
        createdAt: now(),
        updatedAt: now()
      };
    const latest = workspaceRef.current;
    if (latest) {
      const updated = {
        ...latest,
        scripts: existing
          ? latest.scripts.map((item) => item.id === script.id ? script : item)
          : [...latest.scripts, script]
      };
      workspaceRef.current = updated;
      setWorkspace(updated);
    }
    await saveScript(script);
    setStatus(`Saved ${script.name} version ${script.currentVersion}`);
  }

  async function runScript(script: ScriptRecord) {
    const current = workspaceRef.current;
    if (!current?.project.activeChatId) return;
    const version = script.versions.find((item) => item.version === script.currentVersion);
    if (!version) return;
    setBusy(true);
    turnOutputNames.current.clear();
    await runtime.beginTurn();
    const promptId = id();
    appendMessage(current.project.activeChatId, {
      id: promptId,
      role: "user",
      content: `Run saved script ${script.name} version ${script.currentVersion}`,
      createdAt: now()
    });
    try {
      await executeCode(version.code, current.project.activeChatId, promptId, true);
      setStatus(`Ran ${script.name} locally`);
    } finally {
      setBusy(false);
    }
  }

  function renameScript(script: ScriptRecord) {
    const name = window.prompt("Script filename", script.name)?.trim();
    if (!name) return;
    const updated = { ...script, name: `${slug(name.replace(/\.py$/i, ""))}.py`, updatedAt: now() };
    const current = workspaceRef.current;
    if (current) {
      const next = {
        ...current,
        scripts: current.scripts.map((item) => item.id === script.id ? updated : item)
      };
      workspaceRef.current = next;
      setWorkspace(next);
    }
    void saveScript(updated);
  }

  function downloadBytes(name: string, data: ArrayBuffer | Uint8Array, type: string) {
    const blobData: BlobPart = data instanceof Uint8Array ? data as BlobPart : data;
    const url = URL.createObjectURL(new Blob([blobData], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function downloadFile(file: WorkspaceFile) {
    if (file.data) downloadBytes(file.name, file.data, file.type);
  }

  function downloadScript(script: ScriptRecord) {
    const version = script.versions.find((item) => item.version === script.currentVersion);
    if (version) downloadBytes(script.name, new TextEncoder().encode(version.code), "text/x-python");
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

  async function createArchive() {
    const current = workspaceRef.current;
    if (!current) throw new Error("Project is not ready");
    return exportProject(
      current,
      bootstrap.context?.max_snapshot_bytes ?? DEFAULT_MAX_SNAPSHOT_BYTES
    );
  }

  async function downloadArchive() {
    try {
      const archive = await createArchive();
      downloadBytes(archive.filename, archive.data, "application/zip");
      setStatus(
        archive.omittedLocalInputs.length
          ? `Project downloaded; omitted local inputs: ${archive.omittedLocalInputs.join(", ")}`
          : "Complete project downloaded"
      );
    } catch (error) {
      setStatus(`Project export failed: ${String(error)}`);
    }
  }

  async function saveArchiveToOmero() {
    if (!bridge.canUpload) return;
    try {
      const archive = await createArchive();
      if (archive.omittedLocalInputs.length && !confirm(
        `The snapshot is too large to include these local inputs:\n${archive.omittedLocalInputs.join("\n")}\n\nSave the snapshot without them?`
      )) return;
      const snapshot = await bridge.uploadSnapshot(archive.filename, archive.data);
      setSnapshots((current) => [...current, snapshot]);
      setStatus(`Saved project snapshot as FileAnnotation ${snapshot.annotation_id}`);
    } catch (error) {
      setStatus(`OMERO project snapshot failed: ${String(error)}`);
    }
  }

  async function importArchive(file: File | null) {
    if (!file) return;
    try {
      const limit =
        bootstrap.context?.max_snapshot_bytes ?? DEFAULT_MAX_SNAPSHOT_BYTES;
      if (file.size > limit) {
        throw new Error(
          `Project archive exceeds the configured ${Math.floor(limit / 1024 / 1024)} MiB limit`
        );
      }
      const imported = await importProject(await file.arrayBuffer());
      if (
        bootstrap.context &&
        (imported.project.objectType !== bootstrap.context.object_type ||
          imported.project.objectId !== bootstrap.context.object_id)
      ) {
        throw new Error("Project snapshot belongs to a different OMERO object");
      }
      await saveWorkspace(imported);
      const prepared = await prepareInputs(imported);
      setWorkspace(prepared);
      workspaceRef.current = prepared;
      setProjects(await listContextProjects(bootstrap.context));
      await restartRuntime(prepared.files, "Imported project restored");
    } catch (error) {
      setStatus(`Project import failed: ${String(error)}`);
    } finally {
      if (importInput.current) importInput.current.value = "";
    }
  }

  async function resumeSnapshot(snapshot: Attachment) {
    try {
      setStatus(`Downloading ${snapshot.name}…`);
      const imported = await importProject(await bridge.downloadSnapshot(snapshot));
      if (
        bootstrap.context &&
        (imported.project.objectType !== bootstrap.context.object_type ||
          imported.project.objectId !== bootstrap.context.object_id)
      ) {
        throw new Error("Project snapshot belongs to a different OMERO object");
      }
      await saveWorkspace(imported);
      const prepared = await prepareInputs(imported);
      setWorkspace(prepared);
      workspaceRef.current = prepared;
      setProjects(await listContextProjects(bootstrap.context));
      await restartRuntime(prepared.files, "OMERO project snapshot restored");
    } catch (error) {
      setStatus(`Snapshot restore failed: ${String(error)}`);
    }
  }

  function togglePlotCsv() {
    if (!project) return;
    updateProject({ ...project, plotCsv: !project.plotCsv, updatedAt: now() });
  }

  function inputActions(file: WorkspaceFile): BrowserMenuAction[] {
    const actions: BrowserMenuAction[] = [];
    if (file.source === "local") {
      actions.push({ label: "Rename", run: () => void renameWorkspaceFile(file) });
    }
    if ((file.state === "failed" || file.state === "missing") && file.annotationId) {
      actions.push({ label: "Retry download", run: () => void retryFile(file.id) });
    }
    if (file.state === "missing" && file.source === "local") {
      actions.push({
        label: "Reselect file",
        run: () => document.getElementById(`reselect-${file.id}`)?.click()
      });
    }
    actions.push({
      label: "Remove from project",
      danger: true,
      run: () => void removeFile(file.id)
    });
    return actions;
  }

  function outputActions(file: WorkspaceFile): BrowserMenuAction[] {
    return [
      { label: "Rename", run: () => void renameWorkspaceFile(file) },
      { label: "Download", run: () => downloadFile(file) },
      ...(bridge.canUpload
        ? [{ label: "Attach to OMERO", run: () => void attach(file) }]
        : []),
      {
        label: "Remove from project",
        danger: true,
        run: () => void removeFile(file.id)
      }
    ];
  }

  function scriptActions(script: ScriptRecord): BrowserMenuAction[] {
    return [
      { label: "Run", run: () => void runScript(script) },
      { label: "Rename", run: () => renameScript(script) },
      { label: "Download", run: () => downloadScript(script) }
    ];
  }

  function snapshotActions(snapshot: Attachment): BrowserMenuAction[] {
    return [{
      label: "Resume as new project",
      run: () => void resumeSnapshot(snapshot)
    }];
  }

  if (!workspace || !project || !activeChat) {
    return <main className="app-shell"><div className="boot-message">{status}</div></main>;
  }

  const quotaPercent = storage.quota ? Math.round(storage.usage / storage.quota * 100) : 0;
  return (
    <main className="app-shell">
      <header className="project-header">
        <div>
          <h1>OMERO.AnalysisChat</h1>
          <p>{project.rootPath}</p>
        </div>
        <div className="header-actions">
          <label className="csv-toggle" title="Require a matching CSV for every generated plot">
            <input type="checkbox" checked={project.plotCsv} onChange={togglePlotCsv} />
            Plot + CSV
          </label>
          <span className="privacy-badge">Source data stay in this browser</span>
          <button onClick={() => setShowSettings(!showSettings)}>AI settings</button>
        </div>
      </header>

      {showSettings && (
        <section className="settings-card">
          <h2>AmsterdamUMC</h2>
          <p className="warning">The API key is stored unencrypted in this browser profile. It is never included in project snapshots.</p>
          <label>Deployment/model
            <input value={settings.model} onChange={(event) => void saveSettings({ ...settings, model: event.target.value })} placeholder="GPT-5 deployment name" />
          </label>
          <label>API key
            <input type="password" value={settings.apiKey} onChange={(event) => void saveSettings({ ...settings, apiKey: event.target.value })} autoComplete="off" />
          </label>
          <label>Model context window (optional)
            <input type="number" min="0" value={settings.contextWindow || ""} onChange={(event) => void saveSettings({ ...settings, contextWindow: Math.max(0, Number(event.target.value) || 0) })} />
          </label>
          <p>Temperature is fixed at 1.</p>
          <button onClick={() => void saveSettings({ ...settings, apiKey: "" })}>Forget API key</button>
        </section>
      )}

      <div className="project-toolbar">
        <label>Project
          <select value={project.id} onChange={(event) => void switchProject(event.target.value)}>
            {projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label>Chat
          <select value={activeChat.id} onChange={(event) => switchChat(event.target.value)}>
            <optgroup label="Active chats">
              {chats.filter((chat) => !chat.archived).map((chat) => <option key={chat.id} value={chat.id}>{chat.title}</option>)}
            </optgroup>
            {chats.some((chat) => chat.archived) && (
              <optgroup label="Archived chats">
                {chats.filter((chat) => chat.archived).map((chat) => <option key={chat.id} value={chat.id}>{chat.title} (archived)</option>)}
              </optgroup>
            )}
          </select>
        </label>
        <button onClick={() => void newConversation()}>New chat</button>
        <button onClick={() => renameChat(activeChat)}>Rename chat</button>
        <button onClick={() => archiveChat(activeChat)}>Archive</button>
        <button onClick={() => void downloadArchive()}>Download project ZIP</button>
        <button onClick={() => importInput.current?.click()}>Import project ZIP</button>
        <input ref={importInput} hidden type="file" accept=".zip,.oac.zip" onChange={(event) => void importArchive(event.target.files?.[0] || null)} />
        {bridge.canUpload && <button onClick={() => void saveArchiveToOmero()}>Save project to OMERO</button>}
      </div>

      <div className="workspace">
        <aside className="project-tree">
          <div
            className="file-browser-heading"
            onContextMenu={(event) => openBrowserMenu(event, project.name, [
              { label: "Add files", run: () => addFilesInput.current?.click() },
              { label: "New chat", run: () => void newConversation() },
              { label: "Rename current chat", run: () => renameChat(activeChat) },
              { label: "Refresh", run: () => void refreshProject() }
            ])}
          >
            <div><h2>Project files</h2><small>{bytesLabel(projectBytes(workspace))} · browser {quotaPercent || "?"}%</small></div>
            <button
              className="browser-more"
              aria-label="Project actions"
              title="Project actions"
              onClick={(event) => openBrowserMenu(event, project.name, [
                { label: "Add files", run: () => addFilesInput.current?.click() },
                { label: "New chat", run: () => void newConversation() },
                { label: "Rename current chat", run: () => renameChat(activeChat) },
                { label: "Refresh", run: () => void refreshProject() }
              ])}
            >⋮</button>
          </div>
          <div className="file-browser-toolbar" role="toolbar" aria-label="Project file actions">
            <button title="Add files" aria-label="Add files" onClick={() => addFilesInput.current?.click()}>＋</button>
            <button title="Refresh project" aria-label="Refresh project" onClick={() => void refreshProject()}>↻</button>
            <button
              title="Collapse all folders"
              aria-label="Collapse all folders"
              onClick={() => setOpenFolders({ inputs: false, outputs: false, scripts: false, snapshots: false })}
            >⌃</button>
            <input ref={addFilesInput} hidden type="file" multiple onChange={(event) => void addLocalFiles(event.target.files)} />
          </div>
          <div className="browser-path" title={project.rootPath}>
            <span className="browser-icon root" aria-hidden="true" />
            <span>{project.rootPath}</span>
          </div>
          <div className="browser-columns"><span>Name</span><span>Size</span></div>
          {quotaPercent >= 75 && <p className="quota-warning">Browser storage is {quotaPercent}% full. Archive or download old projects.</p>}

          <details
            open={openFolders.inputs}
            className="browser-folder"
            onToggle={(event) => {
              const open = event.currentTarget.open;
              setOpenFolders((current) => ({ ...current, inputs: open }));
            }}
          >
            <summary
              onContextMenu={(event) => openBrowserMenu(event, "inputs/", [
                { label: "Add files", run: () => addFilesInput.current?.click() }
              ])}
            >
              <span className="browser-icon folder" aria-hidden="true" />
              <strong>inputs</strong><small>{inputFiles.length}</small>
            </summary>
            <ul className="browser-list">
              {inputFiles.map((file) => (
                <li
                  key={file.id}
                  className={`browser-row file-${file.state}`}
                  onContextMenu={(event) => openBrowserMenu(event, file.name, inputActions(file))}
                >
                  <span className="browser-icon file" aria-hidden="true" />
                  <div className="browser-name">
                    <strong>{file.name}</strong>
                    <small>{file.source} · {file.state} · {file.sha256.slice(0, 10) || "unhashed"}</small>
                    {file.error && <span className="browser-error">{file.error}</span>}
                  </div>
                  <span className="browser-size">{bytesLabel(file.size)}</span>
                  <button
                    className="browser-more"
                    aria-label={`Actions for ${file.name}`}
                    onClick={(event) => openBrowserMenu(event, file.name, inputActions(file))}
                  >⋮</button>
                  {file.state === "missing" && file.source === "local" && (
                    <input
                      id={`reselect-${file.id}`}
                      hidden
                      type="file"
                      onChange={(event) => void replaceMissingLocal(file, event.target.files?.[0] || null)}
                    />
                  )}
                </li>
              ))}
              {!inputFiles.length && <li className="browser-empty">No input files</li>}
            </ul>
          </details>

          <details
            open={openFolders.outputs}
            className="browser-folder"
            onToggle={(event) => {
              const open = event.currentTarget.open;
              setOpenFolders((current) => ({ ...current, outputs: open }));
            }}
          >
            <summary
              onContextMenu={(event) => openBrowserMenu(event, `chats/${activeChat.title}/`, [
                { label: "Rename chat", run: () => renameChat(activeChat) },
                { label: "New chat", run: () => void newConversation() },
                { label: "Archive chat", run: () => archiveChat(activeChat) }
              ])}
            >
              <span className="browser-icon folder" aria-hidden="true" />
              <strong>chats/{slug(activeChat.title)}/outputs</strong><small>{outputFiles.length}</small>
            </summary>
            <ul className="browser-list">
              <li className="browser-row virtual">
                <span className="browser-icon json" aria-hidden="true" />
                <div className="browser-name"><strong>chat.json</strong><small>autosaved</small></div>
                <span className="browser-size">—</span>
              </li>
              <li className="browser-row virtual">
                <span className="browser-icon markdown" aria-hidden="true" />
                <div className="browser-name"><strong>chat.md</strong><small>autosaved</small></div>
                <span className="browser-size">—</span>
              </li>
              {outputFiles.map((file) => (
                <li
                  key={file.id}
                  className="browser-row"
                  onDoubleClick={() => downloadFile(file)}
                  onContextMenu={(event) => openBrowserMenu(event, file.name, outputActions(file))}
                >
                  <span className={`browser-icon ${file.type.startsWith("image/") ? "image" : "file"}`} aria-hidden="true" />
                  <div className="browser-name">
                    <strong>{file.name}</strong><small>{file.sha256.slice(0, 10)} · double-click to download</small>
                  </div>
                  <span className="browser-size">{bytesLabel(file.size)}</span>
                  <button
                    className="browser-more"
                    aria-label={`Actions for ${file.name}`}
                    onClick={(event) => openBrowserMenu(event, file.name, outputActions(file))}
                  >⋮</button>
                </li>
              ))}
            </ul>
          </details>

          <details
            open={openFolders.scripts}
            className="browser-folder"
            onToggle={(event) => {
              const open = event.currentTarget.open;
              setOpenFolders((current) => ({ ...current, scripts: open }));
            }}
          >
            <summary><span className="browser-icon folder" aria-hidden="true" /><strong>scripts</strong><small>{workspace.scripts.length}</small></summary>
            <ul className="browser-list">
              {workspace.scripts.map((script) => (
                <li
                  key={script.id}
                  className="browser-row"
                  onDoubleClick={() => void runScript(script)}
                  onContextMenu={(event) => openBrowserMenu(event, script.name, scriptActions(script))}
                >
                  <span className="browser-icon python" aria-hidden="true" />
                  <div className="browser-name">
                    <strong>{script.name}</strong><small>v{script.currentVersion} · {script.description || "saved Python script"}</small>
                  </div>
                  <span className="browser-size">v{script.currentVersion}</span>
                  <button
                    className="browser-more"
                    aria-label={`Actions for ${script.name}`}
                    onClick={(event) => openBrowserMenu(event, script.name, scriptActions(script))}
                  >⋮</button>
                </li>
              ))}
              {!workspace.scripts.length && <li className="browser-empty">No saved scripts</li>}
            </ul>
          </details>

          {snapshots.length > 0 && (
            <details
              open={openFolders.snapshots}
              className="browser-folder"
              onToggle={(event) => {
                const open = event.currentTarget.open;
                setOpenFolders((current) => ({ ...current, snapshots: open }));
              }}
            >
              <summary><span className="browser-icon folder" aria-hidden="true" /><strong>Resume from OMERO</strong><small>{snapshots.length}</small></summary>
              <ul className="browser-list">
                {snapshots.map((snapshot) => (
                  <li
                    key={snapshot.annotation_id}
                    className="browser-row"
                    onDoubleClick={() => void resumeSnapshot(snapshot)}
                    onContextMenu={(event) => openBrowserMenu(event, snapshot.name, snapshotActions(snapshot))}
                  >
                    <span className="browser-icon archive" aria-hidden="true" />
                    <div className="browser-name"><strong>{snapshot.name}</strong><small>Annotation {snapshot.annotation_id}</small></div>
                    <span className="browser-size">{bytesLabel(snapshot.size)}</span>
                    <button
                      className="browser-more"
                      aria-label={`Actions for ${snapshot.name}`}
                      onClick={(event) => openBrowserMenu(event, snapshot.name, snapshotActions(snapshot))}
                    >⋮</button>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </aside>

        {browserMenu && (
          <div
            className="browser-context-menu"
            role="menu"
            aria-label={`Actions for ${browserMenu.title}`}
            style={{ left: browserMenu.x, top: browserMenu.y }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="context-title">{browserMenu.title}</div>
            {browserMenu.actions.map((action) => (
              <button
                key={action.label}
                role="menuitem"
                className={action.danger ? "danger" : ""}
                onClick={() => {
                  setBrowserMenu(null);
                  action.run();
                }}
              >{action.label}</button>
            ))}
          </div>
        )}

        <section className="chat">
          <div className="messages" aria-live="polite" ref={messagesElement}>
            {!activeChat.messages.length && <div className="welcome"><h2>What would you like to learn from these data?</h2><p>This named chat, its code, outputs, and reusable scripts are saved automatically in the browser project.</p></div>}
            {activeChat.messages.map((message) => {
              if (message.kind === "execution" && message.executionId) {
                const execution = workspace.executions.find((item) => item.id === message.executionId);
                return execution ? (
                  <ExecutionCard
                    key={message.id}
                    execution={execution}
                    files={workspace.files}
                    onSave={() => void saveAsScript(execution)}
                    onRerun={() => void rerunExecution(execution)}
                  />
                ) : null;
              }
              return (
                <article key={message.id} className={`message ${message.role} ${message.kind || ""}`}>
                  <span>{message.role}</span>
                  <p>{message.content}</p>
                </article>
              );
            })}
          </div>
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
          {blockedFiles.length > 0 && <div className="blocker">Analysis is blocked until every input is available. Retry, reselect, or remove missing files.</div>}
          {!settings.apiKey || !settings.model ? <div className="blocker">Enter the AmsterdamUMC deployment name and API key in AI settings.</div> : null}
          <div className="composer">
            <div className={`composer-state ${canChat ? "ready" : "waiting"}`}>
              <span aria-hidden="true">{canChat ? "●" : "◷"}</span>
              {canChat ? "Ready — you can ask a question" : composerPlaceholder}
            </div>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendPrompt(); } }} disabled={!canChat} placeholder={composerPlaceholder} />
            {busy ? <button className="stop" onClick={stop}>Stop</button> : <button disabled={!canChat || !prompt.trim()} onClick={() => void sendPrompt()}>Send</button>}
            <button disabled={busy || !runtimeReady} onClick={() => void restartRuntime(workspace.files, "Python state reset; inputs restored")}>Reset Python</button>
          </div>
        </section>
      </div>
    </main>
  );

  async function replaceMissingLocal(file: WorkspaceFile, source: File | null) {
    const current = workspaceRef.current;
    if (!source || !current) return;
    if (source.size > MAX_FILE_BYTES) {
      setStatus(`${source.name} exceeds the 256 MiB file limit`);
      return;
    }
    const data = await source.arrayBuffer();
    const ready = {
      ...file,
      name: source.name,
      type: source.type || fileType(source.name),
      size: data.byteLength,
      sha256: await sha256(data),
      data,
      state: "ready" as const,
      error: undefined
    };
    const nextFiles = current.files.map((item) => item.id === file.id ? ready : item);
    upsertFiles([ready]);
    await restartRuntime(nextFiles, "Missing local input restored");
  }

  async function rerunExecution(execution: ExecutionRecord) {
    if (!runtimeReady || busy) return;
    setBusy(true);
    turnOutputNames.current.clear();
    await runtime.beginTurn();
    try {
      await executeCode(execution.code, execution.chatId, id(), true);
      setStatus("Python rerun completed");
    } finally {
      setBusy(false);
    }
  }
}

function ExecutionCard({
  execution,
  files,
  onSave,
  onRerun
}: {
  execution: ExecutionRecord;
  files: WorkspaceFile[];
  onSave: () => void;
  onRerun: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const outputs = execution.outputFileIds
    .map((fileId) => files.find((file) => file.id === fileId))
    .filter(Boolean) as WorkspaceFile[];
  const plots = execution.status === "reused"
    ? []
    : outputs.filter((file) => file.type === "image/png" || file.type === "image/svg+xml");
  const controls = (position: "top" | "bottom") => (
    <div className={`execution-actions ${position}`}>
      <button
        className="detail-toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >{expanded ? "Collapse" : "Show details"}</button>
      {["success", "reused"].includes(execution.status) && (
        <button onClick={onSave}>Save as script</button>
      )}
      <button onClick={onRerun}>Rerun</button>
      <small>{execution.codeHash.slice(0, 12)} · {execution.runtimeVersion}</small>
    </div>
  );
  return (
    <article className={`message execution ${execution.status}`}>
      <section className="execution-details" data-expanded={expanded ? "true" : "false"}>
        <div className="execution-heading">
          <span>{execution.status === "reused" ? "Reused Python run" : "Python code (local)"}</span>
          {controls("top")}
        </div>
        <div className="execution-content" hidden={!expanded}>
          <pre><code>{execution.code}</code></pre>
          {execution.stdout && <pre>{execution.stdout}</pre>}
          {execution.stderr && <pre className="execution-error">{execution.stderr}</pre>}
          {execution.preview != null && <Preview value={execution.preview} />}
          {controls("bottom")}
        </div>
      </section>
      {execution.status === "reused" && <p className="reuse-note">Reused prior execution {execution.reusedFrom?.slice(0, 8)} because code and inputs are unchanged.</p>}
      {execution.missingPlotCsv.length > 0 && <p className="plot-warning">Source CSV missing: {execution.missingPlotCsv.join(", ")}</p>}
      {plots.map((file) => <Artifact key={file.id} file={file} />)}
    </article>
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
