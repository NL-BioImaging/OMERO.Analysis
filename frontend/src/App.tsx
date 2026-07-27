import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type CSSProperties
} from "react";
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
  deleteProjectCascade,
  deleteFile as deleteStoredFile,
  getValue,
  listContextProjects,
  listUserProjects,
  loadOrCreateWorkspace,
  loadWorkspace,
  newChat,
  saveChat,
  saveExecution,
  saveFile,
  saveProject,
  saveScript,
  saveWorkflow,
  saveAudit,
  saveArtifact,
  saveWorkspace,
  settingsKey,
  setValue,
  sha256,
  storageEstimate
} from "./storage";
import type {
  Attachment,
  DataProfile,
  ChatMessage,
  ChatRecord,
  ExecutionRecord,
  ExecutionPurpose,
  ProjectRecord,
  ProjectWorkspace,
  ProviderSettings,
  RuntimeOutput,
  RuntimeProgress,
  ScriptRecord,
  WorkflowRecord,
  OutboundPayloadAudit,
  ArtifactRecord,
  InputContract,
  OmeroHierarchy,
  TokenUsage,
  WorkspaceFile,
  WorkflowSkillCatalog,
  WorkflowSkillPackage
} from "./types";
import { useDialogs } from "./components/Dialogs";
import { ExecutionCard } from "./components/ExecutionCard";
import { ArtifactInspector, ComposerPanel } from "./components/WorkspacePanels";
import {
  matchWorkflowSkills,
  packageInstructions,
  skillProvenance
} from "./workflowSkills";
import {
  activityText,
  formatDuration,
  projectRowClassName
} from "./presentation";

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

function inputContractFromCode(code: string): InputContract {
  const paths = Array.from(code.matchAll(/["']\/input\/([^"']+)["']/g), (match) => match[1]);
  const unique = Array.from(new Set(paths));
  return {
    formats: Array.from(new Set(unique.map((path) => path.split(".").at(-1)?.toLowerCase() || "")))
      .filter(Boolean),
    requiredFiles: unique.map((path) => ({
      path,
      extension: path.match(/(\.[^.]+)$/)?.[1]?.toLowerCase() || ""
    })),
    runtimeVersion: RUNTIME_VERSION
  };
}

function listFiles(files: WorkspaceFile[]): string {
  return JSON.stringify(
    files.filter((file) => !file.deletedAt).map((file) => ({
      path: file.source === "result" ? `/output/${file.name}` : `/input/${file.name}`,
      logical_path: file.logicalPath,
      sha256: file.sha256,
      size: file.size,
      type: file.type,
      state: file.state
    }))
  );
}

export function bindScriptInputs(
  code: string,
  files: WorkspaceFile[]
): { code: string; bindings: Array<{ from: string; to: string }> } {
  const inputs = files.filter((file) => file.source !== "result" && file.state === "ready");
  const bindings: Array<{ from: string; to: string }> = [];
  const rebound = code.replace(/(["'])\/input\/([^"']+)\1/g, (match, quote, sourceName) => {
    if (inputs.some((file) => file.name === sourceName)) return match;
    const extension = sourceName.match(/(\.[^.]+)$/)?.[1]?.toLowerCase() || "";
    const candidates = inputs.filter((file) =>
      extension && file.name.toLowerCase().endsWith(extension)
    );
    if (candidates.length !== 1) {
      throw new Error(
        candidates.length
          ? `Script input ${sourceName} is ambiguous: ${candidates.map((file) => file.name).join(", ")}`
          : `Script input ${sourceName} has no compatible file in this project`
      );
    }
    bindings.push({ from: sourceName, to: candidates[0].name });
    return `${quote}/input/${candidates[0].name}${quote}`;
  });
  return { code: rebound, bindings };
}

function estimateTokens(value: unknown): number {
  return Math.max(1, Math.ceil(JSON.stringify(value).length / 4));
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
  return workspace?.files.filter((file) => !file.deletedAt)
    .reduce((sum, file) => sum + file.size, 0) || 0;
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
  const dialogs = useDialogs();
  const [workspace, setWorkspace] = useState<ProjectWorkspace | null>(null);
  const workspaceRef = useRef<ProjectWorkspace | null>(null);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [userProjects, setUserProjects] = useState<ProjectRecord[]>([]);
  const [snapshots, setSnapshots] = useState<Attachment[]>([]);
  const [hierarchy, setHierarchy] = useState<OmeroHierarchy | null>(null);
  const [workflowTemplates, setWorkflowTemplates] = useState<Attachment[]>([]);
  const [workflowSkillCatalog, setWorkflowSkillCatalog] =
    useState<WorkflowSkillCatalog | null>(null);
  const workflowSkillCatalogRef = useRef<WorkflowSkillCatalog | null>(null);
  const workflowSkillPackages = useRef(new Map<string, WorkflowSkillPackage>());
  const [workflowSkillWarning, setWorkflowSkillWarning] = useState("");
  const [settings, setSettings] = useState<ProviderSettings>(defaultSettings);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [analysisPhase, setAnalysisPhase] = useState<"ready" | "planning" | "running" | "checking" | "repairing">("ready");
  const [runtimeReady, setRuntimeReady] = useState(false);
  const runtimeStarted = useRef(false);
  const [profiles, setProfiles] = useState<DataProfile[]>([]);
  const [selectedArtifactFileId, setSelectedArtifactFileId] = useState<string | null>(null);
  const [explorerWidth, setExplorerWidth] = useState(320);
  const [artifactOpen, setArtifactOpen] = useState(true);
  const [explorerQuery, setExplorerQuery] = useState("");
  const [status, setStatus] = useState("Preparing project…");
  const [showSettings, setShowSettings] = useState(false);
  const [browserMenu, setBrowserMenu] = useState<BrowserMenuState | null>(null);
  const [browserAtParent, setBrowserAtParent] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedScriptIds, setSelectedScriptIds] = useState<Set<string>>(new Set());
  const [showScriptTransfer, setShowScriptTransfer] = useState(false);
  const [scriptTransferTarget, setScriptTransferTarget] = useState("");
  const [openFolders, setOpenFolders] = useState({
    inputs: true,
    outputs: true,
    scripts: true,
    workflows: true,
    trash: false,
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
  const turnWorkflowSkills =
    useRef<NonNullable<ChatMessage["workflowSkills"]>>([]);
  workspaceRef.current = workspace;
  workflowSkillCatalogRef.current = workflowSkillCatalog;

  const project = workspace?.project || null;
  const chats = workspace?.chats || [];
  const activeChat = chats.find((chat) => chat.id === project?.activeChatId) || chats[0] || null;
  const inputFiles = (workspace?.files || []).filter(
    (file) => file.source !== "result" && !file.deletedAt
  );
  const outputFiles = (workspace?.files || []).filter(
    (file) => file.source === "result" && file.chatId === activeChat?.id && !file.deletedAt
  );
  const blockedFiles = inputFiles.filter((file) => file.state !== "ready");
  const selectedArtifactFile = workspace?.files.find(
    (file) => file.id === selectedArtifactFileId && !file.deletedAt
  ) || outputFiles.at(-1) || null;
  const matchesExplorer = (value: string) =>
    !explorerQuery.trim() || value.toLowerCase().includes(explorerQuery.trim().toLowerCase());
  const visibleInputs = inputFiles.filter((file) => matchesExplorer(file.name));
  const visibleOutputs = outputFiles.filter((file) => matchesExplorer(file.name));
  const trashedFiles = (workspace?.files || []).filter((file) => Boolean(file.deletedAt));
  const activeScripts = (workspace?.scripts || []).filter((script) => !script.deletedAt);
  const trashedScripts = (workspace?.scripts || []).filter((script) => Boolean(script.deletedAt));
  const trashedWorkflows = (workspace?.workflows || []).filter((workflow) => Boolean(workflow.deletedAt));
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
      const [savedSettings, baseProject] = await Promise.all([
        getValue<ProviderSettings>(settingsKey),
        loadOrCreateWorkspace(bootstrap.context)
      ]);
      if (!alive) return;
      if (savedSettings) setSettings({ ...defaultSettings, ...savedSettings });
      await bridge.connect();
      setHierarchy(await bridge.hierarchy());
      try {
        const catalog = await bridge.listWorkflowSkills();
        if (alive) {
          setWorkflowSkillCatalog(catalog);
          setWorkflowSkillWarning(
            catalog.workflows.some((entry) => entry.status === "stale")
              ? "Workflow guidance is using an unchanged cached revision."
              : ""
          );
        }
      } catch (error) {
        if (alive) {
          setWorkflowSkillWarning(
            `Workflow-specific guidance unavailable: ${String(error)}`
          );
        }
      }
      let initial = baseProject;
      const requestedSnapshot = bootstrap.context?.selected_project_snapshot;
      if (requestedSnapshot) {
        setRuntimeProgress({ percent: 8, message: "Restoring the selected OMERO project…" });
        const localProjects = await listContextProjects(bootstrap.context);
        const existing = localProjects.find(
          (item) => item.sourceSnapshotAnnotationId === requestedSnapshot.annotation_id
        );
        if (existing) {
          initial = await loadWorkspace(existing.id) || baseProject;
        } else {
          const imported = await importProject(
            await bridge.downloadSnapshot(requestedSnapshot),
            bootstrap.context
          );
          if (
            bootstrap.context &&
            (imported.project.objectType !== bootstrap.context.object_type ||
              imported.project.objectId !== bootstrap.context.object_id)
          ) {
            throw new Error("The selected project belongs to a different OMERO object");
          }
          imported.project = {
            ...imported.project,
            sourceSnapshotAnnotationId: requestedSnapshot.annotation_id,
            updatedAt: now()
          };
          await saveWorkspace(imported);
          initial = imported;
        }
      }
      let prepared = await prepareInputs(initial);
      if (!alive) return;
      setWorkspace(prepared);
      workspaceRef.current = prepared;
      setProjects(await listContextProjects(bootstrap.context));
      setUserProjects(await listUserProjects(bootstrap.context));
      setSnapshots(await bridge.listSnapshots());
      setWorkflowTemplates(await bridge.listWorkflowTemplates());
      await startRuntime(prepared.files);
      setProfiles(await runtime.profileInputs());
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
    const inputs = files.filter(
      (file) => file.source !== "result" && file.state === "ready" && !file.deletedAt
    );
    if (runtimeStarted.current) {
      await runtime.syncInputs(inputs);
    } else {
      await runtime.start(inputs, reportRuntime);
      runtimeStarted.current = true;
    }
  }

  async function restartRuntime(files: WorkspaceFile[], finalStatus: string) {
    await startRuntime(files);
    setProfiles(await runtime.profileInputs());
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

  function togglePinnedMessage(chat: ChatRecord, messageId: string) {
    const values = new Set(chat.pinnedMessageIds || []);
    if (values.has(messageId)) values.delete(messageId);
    else values.add(messageId);
    updateChat({ ...chat, pinnedMessageIds: Array.from(values), updatedAt: now() });
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

  function upsertAudit(audit: OutboundPayloadAudit) {
    const current = workspaceRef.current;
    if (!current) return;
    const updated = { ...current, audits: [...current.audits, audit] };
    workspaceRef.current = updated;
    setWorkspace(updated);
    void saveAudit(audit);
  }

  function upsertArtifacts(artifacts: ArtifactRecord[]) {
    if (!artifacts.length) return;
    const current = workspaceRef.current;
    if (!current) return;
    const updated = { ...current, artifacts: [...current.artifacts, ...artifacts] };
    workspaceRef.current = updated;
    setWorkspace(updated);
    artifacts.forEach((artifact) => void saveArtifact(artifact));
  }

  async function saveSettings(next: ProviderSettings) {
    setSettings(next);
    await setValue(settingsKey, next.rememberKey ? next : { ...next, apiKey: "" });
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
    if (file.source === "result") {
      const tombstone = { ...file, deletedAt: now() };
      upsertFiles([tombstone]);
      setStatus(`Moved ${file.name} to project trash; provenance is preserved`);
      return;
    }
    const nextFiles = workspace.files.filter((item) => item.id !== fileId);
    const updated = { ...workspace, files: nextFiles };
    workspaceRef.current = updated;
    setWorkspace(updated);
    await deleteStoredFile(fileId);
    await restartRuntime(nextFiles, "Input removed; browser Python was reset");
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

  async function renameChat(chat: ChatRecord) {
    const title = (await dialogs.askText(
      "Rename chat",
      chat.title,
      "The chat folder and exported transcript use this name."
    ))?.trim();
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

  function beginExplorerResize(event: ReactMouseEvent) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = explorerWidth;
    const move = (moveEvent: MouseEvent) =>
      setExplorerWidth(Math.max(250, Math.min(520, startWidth + moveEvent.clientX - startX)));
    const stop = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
  }

  async function refreshProject() {
    if (!project) return;
    setBrowserMenu(null);
    setProjects(await listContextProjects(bootstrap.context));
    setUserProjects(await listUserProjects(bootstrap.context));
    await switchProject(project.id);
  }

  async function removeLocalProject(target: ProjectRecord) {
    if (target.id === project?.id) {
      setStatus("Open another local project before deleting this one");
      return;
    }
    if (!await dialogs.confirm(
      "Delete browser-local project?",
      `${target.name} and its local chats, scripts, workflows, and outputs will be permanently removed. OMERO attachments are unchanged.`,
      "Delete local project",
      true
    )) return;
    await deleteProjectCascade(target.id);
    setProjects(await listContextProjects(bootstrap.context));
    setUserProjects(await listUserProjects(bootstrap.context));
    setStatus(`Deleted browser-local project ${target.name}`);
  }

  async function renameWorkspaceFile(file: WorkspaceFile) {
    if (file.source === "omero") {
      setStatus("OMERO attachment names are canonical and cannot be renamed locally");
      return;
    }
    const requested = (await dialogs.askText(
      "Rename file",
      file.name,
      "The file extension must remain unchanged."
    ))?.trim();
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
    setSelectedProjectId(projectId);
    setBrowserAtParent(false);
    setSelectedScriptIds(new Set());
    await restartRuntime(prepared.files, "Project loaded");
  }

  async function loadWorkflowSkill(
    workflowKey: string,
    skillName: string
  ): Promise<WorkflowSkillPackage> {
    const key = `${workflowKey}/${skillName}`;
    const cached = workflowSkillPackages.current.get(key);
    if (cached) return cached;
    const loaded = await bridge.loadWorkflowSkill(workflowKey, skillName);
    workflowSkillPackages.current.set(key, loaded);
    return loaded;
  }

  async function executeCode(
    code: string,
    chatId: string,
    promptId: string,
    force = false,
    purpose: ExecutionPurpose = "analysis"
  ): Promise<string> {
    const current = workspaceRef.current;
    if (!current) return toolErrorText("Project is not ready");
    const startedAt = performance.now();
    const normalizedCode = code.replace(/\r\n/g, "\n").trimEnd();
    const codeHash = await sha256(normalizedCode);
    const inputHashes = current.files
      .filter((file) => file.source !== "result" && file.state === "ready" && !file.deletedAt)
      .map((file) => file.sha256)
      .sort();
    const skillHashes = turnWorkflowSkills.current
      .map((skill) => skill.sha256)
      .sort();
    const cacheKey = await sha256(
      `${codeHash}|${inputHashes.join(",")}|${skillHashes.join(",")}|` +
      `${RUNTIME_VERSION}|plotCsv=${current.project.plotCsv}`
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
        purpose,
        durationMs: performance.now() - startedAt,
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
      workflowSkills: turnWorkflowSkills.current,
      purpose,
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
      setAnalysisPhase("running");
      output = await runtime.run(normalizedCode);
    } catch (error) {
      const detail = String(error instanceof Error ? error.message : error).slice(0, MAX_TOOL_TEXT);
      const failed = {
        ...execution,
        status: "failed" as const,
        stderr: detail,
        durationMs: performance.now() - startedAt
      };
      upsertExecution(failed);
      setStatus("Python error sent to AmsterdamUMC; waiting for corrected code…");
      setAnalysisPhase("repairing");
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
    upsertArtifacts(generated.map((file) => ({
      id: id(),
      projectId: current.project.id,
      chatId,
      executionId: execution.id,
      fileId: file.id,
      kind: file.type.startsWith("image/") ? "plot" : "file",
      title: file.name,
      pinned: false,
      createdAt: now()
    })));

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
      modelPayload: output.modelPayload,
      outputFileIds: generated.map((file) => file.id),
      missingPlotCsv: missing,
      purpose: purpose === "inspection" && generated.length ? "analysis" : purpose,
      durationMs: performance.now() - startedAt
    };
    upsertExecution(completed);
    const modelPayloadText = JSON.stringify(output.modelPayload);
    upsertAudit({
      id: id(),
      projectId: current.project.id,
      chatId,
      executionId: execution.id,
      categories: ["bounded-preview", "generated-file-metadata", ...(output.modelPayload.stderr ? ["error"] : [])],
      byteLength: new TextEncoder().encode(modelPayloadText).byteLength,
      payload: modelPayloadText,
      createdAt: now()
    });

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
    setAnalysisPhase(missing.length ? "repairing" : "checking");
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
    if (call.function.name === "discover_skills") {
      const catalog = workflowSkillCatalogRef.current;
      if (!catalog) {
        return toolErrorText(
          workflowSkillWarning || "No workflow skill catalog is available"
        );
      }
      return JSON.stringify(
        matchWorkflowSkills(catalog, current.files, profiles).map((match) => ({
          workflow_key: match.entry.source.workflow_key,
          name: match.skill.name,
          description: match.skill.description,
          purpose: match.skill.purpose,
          version: match.skill.version,
          score: match.score,
          reasons: match.reasons,
          references_are_progressive: true,
          source: {
            repository_url: match.entry.source.repository_url,
            configured_ref: match.entry.source.configured_ref,
            resolved_commit: match.entry.source.resolved_commit,
            sha256: match.skill.sha256,
            status: match.entry.status
          }
        }))
      ).slice(0, MAX_TOOL_TEXT);
    }
    if (call.function.name === "load_skill") {
      if (
        typeof args.workflow_key !== "string" ||
        typeof args.skill_name !== "string"
      ) {
        return toolErrorText("load_skill requires workflow_key and skill_name");
      }
      try {
        const skill = await loadWorkflowSkill(
          args.workflow_key,
          args.skill_name
        );
        const resource =
          typeof args.resource === "string" && args.resource
            ? args.resource
            : "SKILL.md";
        const file = skill.files.find((item) => item.path === resource);
        if (!file) {
          return toolErrorText(
            `Resource ${resource} is unavailable. Available resources: ` +
            skill.files.map((item) => item.path).join(", ")
          );
        }
        return JSON.stringify({
          workflow_key: skill.source.workflow_key,
          skill_name: skill.skill.name,
          version: skill.skill.version,
          configured_ref: skill.source.configured_ref,
          resolved_commit: skill.source.resolved_commit,
          sha256: skill.skill.sha256,
          resource,
          content: file.content.slice(0, MAX_TOOL_TEXT - 4096),
          available_resources: skill.files.map((item) => item.path)
        });
      } catch (error) {
        return toolErrorText(error);
      }
    }
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
      return JSON.stringify(current.scripts.filter((script) => !script.deletedAt).map((script) => ({
        id: script.id,
        name: script.name,
        description: script.description,
        current_version: script.currentVersion,
        updated_at: script.updatedAt
      })));
    }
    if (call.function.name === "read_saved_script") {
      const script = current.scripts.find((item) => item.id === args.script_id && !item.deletedAt);
      if (!script) return toolErrorText("Saved script was not found");
      const version = script.versions.find((item) => item.version === script.currentVersion);
      return version
        ? JSON.stringify({ id: script.id, name: script.name, version: version.version, code: version.code })
        : toolErrorText("Saved script has no readable current version");
    }
    if (call.function.name === "run_saved_script") {
      const script = current.scripts.find((item) => item.id === args.script_id && !item.deletedAt);
      const version = script?.versions.find((item) => item.version === script.currentVersion);
      if (!version) return toolErrorText("Saved script was not found");
      try {
        const bound = bindScriptInputs(version.code, current.files);
        return executeCode(bound.code, chatId, promptId, false, "script");
      } catch (error) {
        return toolErrorText(error);
      }
    }
    if (call.function.name === "list_saved_workflows") {
      return JSON.stringify(current.workflows.filter((workflow) => !workflow.deletedAt).map((workflow) => ({
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        version: workflow.version,
        steps: workflow.steps.map((step) => step.name)
      })));
    }
    if (call.function.name === "run_saved_workflow") {
      const workflow = current.workflows.find(
        (item) => item.id === args.workflow_id && !item.deletedAt
      );
      if (!workflow) return toolErrorText("Saved workflow was not found");
      const results: string[] = [];
      for (const step of workflow.steps) {
        const latest = workspaceRef.current!;
        const script = latest.scripts.find((item) => item.id === step.scriptId && !item.deletedAt);
        const version = script?.versions.find((item) => item.version === step.scriptVersion);
        if (!version) return toolErrorText(`Workflow step ${step.name} is unavailable`);
        try {
          await runtime.beginTurn();
          const bound = bindScriptInputs(version.code, latest.files);
          results.push(await executeCode(bound.code, chatId, promptId, false, "script"));
        } catch (error) {
          return toolErrorText(`Workflow step ${step.name} failed: ${String(error)}`);
        }
      }
      return JSON.stringify({
        workflow: workflow.name,
        steps: workflow.steps.length,
        results
      }).slice(0, MAX_TOOL_TEXT);
    }
    if (call.function.name !== "run_python" || typeof args.code !== "string") {
      return toolErrorText(`Unsupported or invalid tool call: ${call.function.name}`);
    }
    const purpose: ExecutionPurpose =
      args.purpose === "analysis" ? "analysis" : "inspection";
    return executeCode(args.code, chatId, promptId, false, purpose);
  }

  async function sendPrompt() {
    const text = prompt.trim();
    const current = workspaceRef.current;
    const chat = current?.chats.find((item) => item.id === current.project.activeChatId);
    if (!text || !canChat || !current || !chat) return;
    setPrompt("");
    setBusy(true);
    setAnalysisPhase("planning");
    const turnStartedAt = performance.now();
    let usedTools = false;
    abort.current = new AbortController();
    turnOutputNames.current.clear();
    await runtime.beginTurn();
    turnWorkflowSkills.current = [];
    let activeSkillInstructions = "";
    const compatibleSkills = matchWorkflowSkills(
      workflowSkillCatalogRef.current,
      current.files,
      profiles
    );
    if (compatibleSkills.length) {
      const strongest = compatibleSkills[0];
      try {
        const skill = await loadWorkflowSkill(
          strongest.entry.source.workflow_key,
          strongest.skill.name
        );
        turnWorkflowSkills.current = [skillProvenance(skill)];
        activeSkillInstructions = packageInstructions(skill);
        setWorkflowSkillWarning("");
      } catch (error) {
        setWorkflowSkillWarning(
          `Workflow-specific guidance unavailable: ${String(error)}`
        );
      }
    }
    const promptId = id();
    const user: ChatMessage = {
      id: promptId,
      role: "user",
      content: text,
      workflowSkills: turnWorkflowSkills.current,
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
      setStatus("Older conversation context was compacted; pinned items and the latest six exchanges were retained");
    }
    const dynamicPrompt = `${SYSTEM_PROMPT}

Project root: ${current.project.rootPath}
The user has ${current.scripts.filter((script) => !script.deletedAt).length} saved scripts. ${
  current.project.plotCsv
    ? "Plot CSV mode is ON: every PNG or SVG must have a same-stem CSV containing its plotted data."
    : "Plot CSV mode is OFF."
}

${activeSkillInstructions || (
  workflowSkillWarning
    ? `No specialized workflow skill was loaded. ${workflowSkillWarning}`
    : "No compatible specialized workflow skill matched; use generic schema-first analysis."
)}`;
    const pinnedIds = new Set(currentChat.pinnedMessageIds || []);
    const history = [
      ...ordinary.filter((message) => pinnedIds.has(message.id)),
      ...ordinary.slice(-12)
    ].filter((message, index, values) =>
      values.findIndex((candidate) => candidate.id === message.id) === index
    );
    const conversation: AiMessage[] = [
      { role: "system", content: dynamicPrompt },
      ...(currentChat.summary ? [{ role: "system" as const, content: `Earlier conversation summary:\n${currentChat.summary}` }] : []),
      ...history.map((message) => ({ role: message.role as "user" | "assistant", content: message.content }))
    ];
    if (conversation.at(-1)?.content !== text) conversation.push({ role: "user", content: text });

    try {
      for (let turn = 0; turn < 8; turn += 1) {
        const estimatedPrompt = estimateTokens(conversation);
        const responseStartedAt = performance.now();
        const response = await completeChat(
          settings,
          conversation,
          abort.current.signal,
          (partial) => setStreamingText(partial)
        );
        const answer = response.choices[0]?.message;
        if (!answer) throw new Error("AmsterdamUMC returned no response");
        const responseDurationMs = performance.now() - responseStartedAt;
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
          const citationIds = (workspaceRef.current?.executions || [])
            .filter((execution) => execution.promptId === promptId)
            .map((execution) => execution.id);
          appendMessage(chat.id, {
            id: id(),
            role: "assistant",
            content: answer.content,
            citationIds,
            workflowSkills: turnWorkflowSkills.current,
            activity: usedTools ? "worked" : "thought",
            durationMs: usedTools
              ? performance.now() - turnStartedAt
              : responseDurationMs,
            createdAt: now()
          });
        }
        setStreamingText("");
        if (!answer.tool_calls?.length) break;
        usedTools = true;
        setAnalysisPhase(turn ? "repairing" : "running");
        for (const call of answer.tool_calls) {
          const result = await executeTool(call, chat.id, promptId);
          conversation.push({ role: "tool", tool_call_id: call.id, content: result });
        }
        setAnalysisPhase("checking");
        if (turn === 7) throw new Error("The analysis exceeded eight tool rounds");
      }
    } catch (error) {
      if (!abort.current?.signal.aborted) {
        appendMessage(chat.id, {
          id: id(),
          role: "assistant",
          content: String(error),
          kind: "error",
          activity: usedTools ? "worked" : "thought",
          durationMs: performance.now() - turnStartedAt,
          createdAt: now()
        });
      }
    } finally {
      if (!abort.current?.signal.aborted) setStatus("Ready — analysis runs locally in this browser");
      abort.current = null;
      setStreamingText("");
      setAnalysisPhase("ready");
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
    if (
      !current ||
      execution.purpose === "inspection" ||
      !["success", "reused"].includes(execution.status)
    ) return;
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
    const name = (await dialogs.askText(
      "Save as reusable script",
      suggested,
      "Scripts are versioned and can be copied to compatible OMERO projects."
    ))?.trim();
    if (!name) return;
    const safeName = `${slug(name.replace(/\.py$/i, ""))}.py`;
    const description = (await dialogs.askText(
      "Script description",
      promptMessage?.content.slice(0, 180) || "Reusable Analysis Chat workflow"
    ))?.trim() || "";
    const existing = current.scripts.find((script) =>
      !script.deletedAt && script.name.toLowerCase() === safeName.toLowerCase()
    );
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
        inputContract: inputContractFromCode(scriptCode),
        parameters: [],
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
    script.inputContract = inputContractFromCode(scriptCode);
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
    let bound: ReturnType<typeof bindScriptInputs>;
    try {
      bound = bindScriptInputs(version.code, current.files);
    } catch (error) {
      setStatus(`Cannot bind ${script.name}: ${String(error)}`);
      return;
    }
    setBusy(true);
    turnOutputNames.current.clear();
    await runtime.beginTurn();
    const promptId = id();
    appendMessage(current.project.activeChatId, {
      id: promptId,
      role: "user",
      content: `Run saved script ${script.name} version ${script.currentVersion}` +
        (bound.bindings.length
          ? ` with project input binding ${bound.bindings.map((item) => `${item.from} → ${item.to}`).join(", ")}`
          : ""),
      createdAt: now()
    });
    try {
      await executeCode(
        bound.code,
        current.project.activeChatId,
        promptId,
        true,
        "script"
      );
      setStatus(`Ran ${script.name} locally`);
    } finally {
      setBusy(false);
    }
  }

  async function renameScript(script: ScriptRecord) {
    const name = (await dialogs.askText("Rename script", script.name))?.trim();
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

  async function removeScript(script: ScriptRecord) {
    if (!await dialogs.confirm(
      "Delete saved script?",
      `${script.name} and all of its versions will be moved out of the active project.`,
      "Delete script",
      true
    )) {
      return;
    }
    const current = workspaceRef.current;
    if (!current) return;
    const deleted = { ...script, deletedAt: now(), updatedAt: now() };
    const updated = {
      ...current,
      scripts: current.scripts.map((item) => item.id === script.id ? deleted : item)
    };
    workspaceRef.current = updated;
    setWorkspace(updated);
    setSelectedScriptIds((selected) => {
      const next = new Set(selected);
      next.delete(script.id);
      return next;
    });
    await saveScript(deleted);
    setStatus(`Moved script ${script.name} to trash`);
  }

  function toggleScriptSelection(scriptId: string) {
    setSelectedScriptIds((current) => {
      const next = new Set(current);
      if (next.has(scriptId)) next.delete(scriptId);
      else next.add(scriptId);
      return next;
    });
  }

  async function combineSelectedScripts() {
    const current = workspaceRef.current;
    if (!current) return;
    const selected = current.scripts.filter((script) => !script.deletedAt && selectedScriptIds.has(script.id));
    if (selected.length < 2) {
      setStatus("Select at least two scripts to combine");
      return;
    }
    const suggested = slug(selected.map((script) => script.name.replace(/\.py$/i, "")).join("-"));
    const requested = (await dialogs.askText(
      "Workflow name",
      suggested,
      "The selected scripts will become isolated, ordered workflow steps."
    ))?.trim();
    if (!requested) return;
    const stem = slug(requested);
    let name = stem;
    let suffix = 2;
    while (current.workflows.some((workflow) =>
      !workflow.deletedAt && workflow.name.toLowerCase() === name.toLowerCase()
    )) {
      name = `${stem}-${suffix}`;
      suffix += 1;
    }
    const description = (await dialogs.askText(
      "Workflow description",
      `Runs ${selected.map((script) => script.name).join(", ")} in sequence`
    ))?.trim() || "";
    const createdAt = now();
    const workflow: WorkflowRecord = {
      id: id(),
      projectId: current.project.id,
      name,
      description,
      version: 1,
      steps: selected.map((script) => ({
        id: id(),
        scriptId: script.id,
        scriptVersion: script.currentVersion,
        name: script.name,
        inputBindings: {},
        parameters: {}
      })),
      createdAt,
      updatedAt: createdAt
    };
    const updated = { ...current, workflows: [...current.workflows, workflow] };
    workspaceRef.current = updated;
    setWorkspace(updated);
    setSelectedScriptIds(new Set());
    await saveWorkflow(workflow);
    setStatus(`Created workflow ${workflow.name} with ${selected.length} isolated steps`);
  }

  async function runWorkflow(workflow: WorkflowRecord) {
    const current = workspaceRef.current;
    if (!current?.project.activeChatId || busy) return;
    setBusy(true);
    const workflowStartedAt = performance.now();
    const chatId = current.project.activeChatId;
    const promptId = id();
    appendMessage(chatId, {
      id: promptId,
      role: "user",
      content: `Run workflow ${workflow.name} version ${workflow.version}`,
      createdAt: now()
    });
    try {
      let availableInputs = current.files.filter(
        (file) => file.source !== "result" && file.state === "ready" && !file.deletedAt
      );
      for (let index = 0; index < workflow.steps.length; index += 1) {
        const step = workflow.steps[index];
        const latest = workspaceRef.current!;
        const script = latest.scripts.find((item) => item.id === step.scriptId && !item.deletedAt);
        const version = script?.versions.find((item) => item.version === step.scriptVersion);
        if (!script || !version) throw new Error(`Workflow step ${step.name} is unavailable`);
        setStatus(`Workflow ${workflow.name}: step ${index + 1} of ${workflow.steps.length}`);
        await runtime.beginTurn();
        turnOutputNames.current.clear();
        const bound = bindScriptInputs(version.code, availableInputs);
        await executeCode(bound.code, chatId, promptId, true, "script");
        const produced = workspaceRef.current!.files.filter(
          (file) => file.source === "result" && file.executionId &&
            workspaceRef.current!.executions.some(
              (execution) => execution.id === file.executionId && execution.promptId === promptId
            ) && !file.deletedAt
        );
        availableInputs = [...availableInputs, ...produced];
        if (index < workflow.steps.length - 1) await runtime.syncInputs(availableInputs);
      }
      await runtime.syncInputs(current.files.filter(
        (file) => file.source !== "result" && file.state === "ready" && !file.deletedAt
      ));
      setStatus(`Workflow ${workflow.name} completed`);
    } catch (error) {
      appendMessage(chatId, {
        id: id(),
        role: "assistant",
        content: `Workflow stopped: ${String(error)}`,
        kind: "error",
        activity: "worked",
        durationMs: performance.now() - workflowStartedAt,
        createdAt: now()
      });
      setStatus(`Workflow ${workflow.name} failed`);
    } finally {
      setBusy(false);
    }
  }

  async function removeWorkflow(workflow: WorkflowRecord) {
    if (!await dialogs.confirm(
      "Delete workflow?",
      `${workflow.name} will be moved to project trash. Its source scripts remain available.`,
      "Delete workflow",
      true
    )) return;
    const current = workspaceRef.current;
    if (!current) return;
    const deleted = { ...workflow, deletedAt: now(), updatedAt: now() };
    const updated = {
      ...current,
      workflows: current.workflows.map((item) => item.id === workflow.id ? deleted : item)
    };
    workspaceRef.current = updated;
    setWorkspace(updated);
    await saveWorkflow(deleted);
    setStatus(`Moved workflow ${workflow.name} to project trash`);
  }

  async function restoreTrashedFile(file: WorkspaceFile) {
    const restored = { ...file, deletedAt: undefined };
    upsertFiles([restored]);
    await saveFile(restored);
    setStatus(`Restored ${file.name}`);
  }

  async function restoreTrashedScript(script: ScriptRecord) {
    const current = workspaceRef.current;
    if (!current) return;
    const restored = { ...script, deletedAt: undefined, updatedAt: now() };
    const next = {
      ...current,
      scripts: current.scripts.map((item) => item.id === script.id ? restored : item)
    };
    workspaceRef.current = next;
    setWorkspace(next);
    await saveScript(restored);
  }

  async function restoreTrashedWorkflow(workflow: WorkflowRecord) {
    const current = workspaceRef.current;
    if (!current) return;
    const restored = { ...workflow, deletedAt: undefined, updatedAt: now() };
    const updated = {
      ...current,
      workflows: current.workflows.map((item) => item.id === workflow.id ? restored : item)
    };
    workspaceRef.current = updated;
    setWorkspace(updated);
    await saveWorkflow(restored);
    setStatus(`Restored workflow ${workflow.name}`);
  }

  async function publishWorkflow(workflow: WorkflowRecord) {
    const current = workspaceRef.current;
    if (!current || !bridge.canUpload) return;
    const scriptIds = new Set(workflow.steps.map((step) => step.scriptId));
    const payload = {
      format: "nl.bioimaging.analysis-chat.workflow.v1",
      exportedAt: now(),
      workflow,
      scripts: current.scripts.filter((script) => !script.deletedAt && scriptIds.has(script.id))
    };
    const name = `${slug(workflow.name)}.oac-workflow.json`;
    const result = await bridge.uploadWorkflowTemplate(
      name,
      new TextEncoder().encode(JSON.stringify(payload, null, 2))
    );
    setWorkflowTemplates((values) => [...values, result]);
    setStatus(`Published workflow template as FileAnnotation ${result.annotation_id}`);
  }

  async function importWorkflowTemplate(template: Attachment) {
    const current = workspaceRef.current;
    if (!current) return;
    try {
      const payload = JSON.parse(
        new TextDecoder().decode(await bridge.downloadWorkflowTemplate(template))
      );
      if (
        payload.format !== "nl.bioimaging.analysis-chat.workflow.v1" ||
        !payload.workflow ||
        !Array.isArray(payload.scripts)
      ) throw new Error("Unsupported workflow template");
      const scriptIds = new Map<string, string>();
      const scripts: ScriptRecord[] = payload.scripts.map((script: ScriptRecord) => {
        const scriptId = id();
        scriptIds.set(script.id, scriptId);
        return {
          ...script,
          id: scriptId,
          projectId: current.project.id,
          name: `${script.name.replace(/\.py$/i, "")}-template.py`,
          createdAt: now(),
          updatedAt: now()
        };
      });
      const workflow: WorkflowRecord = {
        ...payload.workflow,
        id: id(),
        projectId: current.project.id,
        name: `${payload.workflow.name}-template`,
        steps: payload.workflow.steps.map((step: WorkflowRecord["steps"][number]) => ({
          ...step,
          id: id(),
          scriptId: scriptIds.get(step.scriptId) || step.scriptId
        })),
        createdAt: now(),
        updatedAt: now()
      };
      await Promise.all([...scripts.map(saveScript), saveWorkflow(workflow)]);
      const updated = {
        ...current,
        scripts: [...current.scripts, ...scripts],
        workflows: [...current.workflows, workflow]
      };
      workspaceRef.current = updated;
      setWorkspace(updated);
      setStatus(`Imported workflow template ${workflow.name}`);
    } catch (error) {
      setStatus(`Workflow template import failed: ${String(error)}`);
    }
  }

  async function batchRunWorkflow(workflow: WorkflowRecord) {
    const source = workspaceRef.current;
    if (!source || busy) return;
    const targets = userProjects.filter((item) => item.id !== source.project.id);
    if (!targets.length) {
      setStatus("Open the destination OMERO objects in Analysis Chat once before batch execution");
      return;
    }
    if (!await dialogs.confirm(
      "Batch-run workflow?",
      `${workflow.name} will run locally on the compatible browser projects for: ${targets.map((item) => `${item.objectType} ${item.objectId} (${item.name})`).join(", ")}. Incompatible projects will be skipped.`,
      "Run compatible projects"
    )) return;
    setBusy(true);
    const completed: string[] = [];
    const skipped: string[] = [];
    try {
      for (const targetRecord of targets) {
        const target = await loadWorkspace(targetRecord.id);
        if (!target) continue;
        const preparedSteps: string[] = [];
        try {
          for (const step of workflow.steps) {
            const script = source.scripts.find((item) => item.id === step.scriptId && !item.deletedAt);
            const version = script?.versions.find((item) => item.version === step.scriptVersion);
            if (!version) throw new Error(`Missing ${step.name}`);
            preparedSteps.push(bindScriptInputs(version.code, target.files).code);
          }
        } catch {
          skipped.push(targetRecord.name);
          continue;
        }
        const targetStartedAt = performance.now();
        try {
          const chat = newChat(target.project.id, `${workflow.name} batch run`);
          target.project = { ...target.project, activeChatId: chat.id, updatedAt: now() };
          target.chats = [...target.chats, chat];
          workspaceRef.current = target;
          setWorkspace(target);
          await runtime.syncInputs(target.files.filter(
            (file) => file.source !== "result" && file.state === "ready" && !file.deletedAt
          ));
          const promptId = id();
          appendMessage(chat.id, {
            id: promptId,
            role: "user",
            content: `Batch run workflow ${workflow.name} on ${targetRecord.objectType} ${targetRecord.objectId}`,
            createdAt: now()
          });
          for (const code of preparedSteps) {
            await runtime.beginTurn();
            turnOutputNames.current.clear();
            await executeCode(code, chat.id, promptId, true, "script");
          }
          await saveWorkspace(workspaceRef.current!);
          completed.push(targetRecord.name);
        } catch (error) {
          const failed = workspaceRef.current;
          if (failed?.project.id === target.project.id) {
            const failedChat = failed.chats.find((chat) => chat.id === failed.project.activeChatId);
            if (failedChat) {
              appendMessage(failedChat.id, {
                id: id(),
                role: "assistant",
                kind: "error",
                content: `Batch workflow failed for this object: ${String(error)}`,
                activity: "worked",
                durationMs: performance.now() - targetStartedAt,
                createdAt: now()
              });
              await saveWorkspace(workspaceRef.current!);
            }
          }
          skipped.push(targetRecord.name);
        }
      }
    } finally {
      workspaceRef.current = source;
      setWorkspace(source);
      await runtime.syncInputs(source.files.filter(
        (file) => file.source !== "result" && file.state === "ready" && !file.deletedAt
      ));
      setBusy(false);
    }
    setStatus(
      `Batch workflow completed for ${completed.length} project(s)` +
      (skipped.length ? `; incompatible: ${skipped.join(", ")}` : "")
    );
  }

  function beginScriptTransfer(scriptIds?: string[]) {
    const ids = scriptIds || Array.from(selectedScriptIds);
    if (!ids.length) {
      setStatus("Select one or more scripts to copy");
      return;
    }
    setSelectedScriptIds(new Set(ids));
    const firstTarget = userProjects.find((item) => item.id !== project?.id);
    if (!firstTarget) {
      setStatus("Open another OMERO Dataset, Screen, Plate, or Image once before copying scripts to it");
      return;
    }
    setScriptTransferTarget(firstTarget.id);
    setShowScriptTransfer(true);
  }

  async function copySelectedScripts() {
    const current = workspaceRef.current;
    if (!current || !scriptTransferTarget) return;
    const target = await loadWorkspace(scriptTransferTarget);
    if (!target) {
      setStatus("The destination project is no longer available");
      return;
    }
    const selected = current.scripts.filter((script) => !script.deletedAt && selectedScriptIds.has(script.id));
    if (!selected.length) return;
    const compatibility = new Map<string, Record<string, string>>();
    for (const source of selected) {
      const version = source.versions.find((item) => item.version === source.currentVersion);
      if (!version) continue;
      try {
        const bound = bindScriptInputs(version.code, target.files);
        compatibility.set(
          source.id,
          Object.fromEntries(bound.bindings.map((binding) => [binding.from, binding.to]))
        );
      } catch (error) {
        setStatus(`Copy blocked by compatibility preflight for ${source.name}: ${String(error)}`);
        return;
      }
    }
    const targetNames = new Set(target.scripts.filter((script) => !script.deletedAt).map((script) => script.name.toLowerCase()));
    const copied: ScriptRecord[] = [];
    for (const source of selected) {
      const stem = source.name.replace(/\.py$/i, "");
      let name = source.name;
      let suffix = 2;
      while (targetNames.has(name.toLowerCase())) {
        name = `${stem}-copy-${suffix}.py`;
        suffix += 1;
      }
      targetNames.add(name.toLowerCase());
      const timestamp = now();
      copied.push({
        ...source,
        id: id(),
        projectId: target.project.id,
        name,
        description: `${source.description}${source.description ? " · " : ""}Copied from ${current.project.name}`,
        projectBindings: {
          ...(source.projectBindings || {}),
          [target.project.id]: compatibility.get(source.id) || {}
        },
        versions: source.versions.map((version) => ({
          ...version,
          executionId: ""
        })),
        createdAt: timestamp,
        updatedAt: timestamp
      });
    }
    await Promise.all(copied.map(saveScript));
    if (target.project.id === current.project.id) {
      const updated = { ...current, scripts: [...current.scripts, ...copied] };
      workspaceRef.current = updated;
      setWorkspace(updated);
    }
    setShowScriptTransfer(false);
    const destination = userProjects.find((item) => item.id === target.project.id);
    setStatus(
      `Copied ${copied.length} script${copied.length === 1 ? "" : "s"} to ${destination?.name || "the destination project"}. ` +
      "When run there, the scripts use that project's current inputs."
    );
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

  function downloadReproducibilityReport() {
    const current = workspaceRef.current;
    if (!current) return;
    const chat = current.chats.find((item) => item.id === current.project.activeChatId);
    if (!chat) return;
    const executions = current.executions.filter((item) => item.chatId === chat.id);
    const lines = [
      `# ${chat.title}`,
      "",
      `OMERO object: ${current.project.objectType || "Local"} ${current.project.objectId || ""}`,
      `Project: ${current.project.name}`,
      `Generated: ${now()}`,
      `Runtime: ${RUNTIME_VERSION}`,
      "",
      "## Inputs",
      ...current.files.filter((file) => file.source !== "result" && !file.deletedAt)
        .map((file) => `- ${file.name} — ${file.sha256} — ${file.size} bytes`),
      "",
      "## Conversation",
      ...chat.messages.filter((message) => message.kind !== "execution")
        .flatMap((message) => [
          `### ${message.role}`,
          ...(activityText(message.activity, message.durationMs)
            ? [`_${activityText(message.activity, message.durationMs)}_`]
            : []),
          "",
          message.content,
          ""
        ]),
      "## Executions",
      ...executions.flatMap((execution, index) => [
        `### Run ${index + 1} — ${execution.status}`,
        "",
        `Code hash: ${execution.codeHash}`,
        `Model: ${execution.model}`,
        `Purpose: ${execution.purpose || "analysis"}`,
        `Duration: ${formatDuration(execution.durationMs) || "not recorded"}`,
        `Inputs: ${execution.inputHashes.join(", ")}`,
        "",
        "```python",
        execution.code,
        "```",
        ""
      ])
    ];
    downloadBytes(
      `${slug(chat.title)}-reproducibility-report.md`,
      new TextEncoder().encode(lines.join("\n")),
      "text/markdown"
    );
    setStatus("Downloaded reproducibility report");
  }

  async function attach(file: WorkspaceFile) {
    if (!await dialogs.confirm(
      "Attach result to OMERO?",
      `${file.name} will be uploaded and linked directly to the selected OMERO object.`,
      "Attach result"
    )) return;
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
      if (archive.omittedLocalInputs.length && !await dialogs.confirm(
        "Save snapshot without oversized local inputs?",
        `The following files will be omitted and required again after restore: ${archive.omittedLocalInputs.join(", ")}`,
        "Save without files"
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
      const imported = await importProject(await file.arrayBuffer(), bootstrap.context);
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
      setUserProjects(await listUserProjects(bootstrap.context));
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
      const imported = await importProject(
        await bridge.downloadSnapshot(snapshot),
        bootstrap.context
      );
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
      setUserProjects(await listUserProjects(bootstrap.context));
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
        label: "Delete output",
        danger: true,
        run: () => {
          void dialogs.confirm(
            "Move output to trash?",
            `${file.name} will be hidden, while its provenance record remains intact.`,
            "Move to trash",
            true
          ).then((confirmed) => {
            if (confirmed) {
            void removeFile(file.id);
            }
          });
        }
      }
    ];
  }

  function scriptActions(script: ScriptRecord): BrowserMenuAction[] {
    return [
      { label: "Run", run: () => void runScript(script) },
      { label: "Rename", run: () => void renameScript(script) },
      { label: "Download", run: () => downloadScript(script) },
      { label: "Copy to another project…", run: () => beginScriptTransfer([script.id]) },
      { label: "Delete script", danger: true, run: () => void removeScript(script) }
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
      {dialogs.element}
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
          <span
            className={workflowSkillWarning ? "skill-badge warning" : "skill-badge"}
            title={workflowSkillWarning || "Validated workflow guidance is available"}
          >
            {workflowSkillWarning
              ? "Generic guidance"
              : `${workflowSkillCatalog?.workflows.reduce(
                (total, entry) => total + entry.skills.length,
                0
              ) || 0} workflow skills`}
          </span>
          {bootstrap.context && (
            <button
              title="Open BIOMERO for pixel, GPU, server-package, or long-running workflows"
              onClick={() => window.open(
                `/biomero/?type=${encodeURIComponent(bootstrap.context!.object_type)}&id=${bootstrap.context!.object_id}`,
                "_blank",
                "noopener"
              )}
            >
              BIOMERO handoff
            </button>
          )}
          <button onClick={() => setShowSettings(!showSettings)}>AI settings</button>
        </div>
      </header>

      {showSettings && (
        <form className="settings-card" onSubmit={(event) => event.preventDefault()}>
          <h2>AmsterdamUMC</h2>
          <p className="warning">
            The API key is kept only for this tab unless you explicitly choose to remember it.
            Remembered keys are stored unencrypted and never included in project snapshots.
          </p>
          <label>Deployment/model
            <input value={settings.model} onChange={(event) => void saveSettings({ ...settings, model: event.target.value })} placeholder="GPT-5 deployment name" />
          </label>
          <label>API key
            <input type="password" value={settings.apiKey} onChange={(event) => void saveSettings({ ...settings, apiKey: event.target.value })} autoComplete="off" />
          </label>
          <label className="remember-key">
            <input
              type="checkbox"
              checked={settings.rememberKey}
              onChange={(event) => void saveSettings({ ...settings, rememberKey: event.target.checked })}
            />
            Remember this key in this browser profile
          </label>
          <label>Model context window (optional)
            <input type="number" min="0" value={settings.contextWindow || ""} onChange={(event) => void saveSettings({ ...settings, contextWindow: Math.max(0, Number(event.target.value) || 0) })} />
          </label>
          <p>Temperature is fixed at 1.</p>
          <button onClick={() => void saveSettings({ ...settings, apiKey: "" })}>Forget API key</button>
        </form>
      )}

      <div className="project-toolbar">
        <div className="active-project-label"><span>Project</span><strong>{project.name}</strong></div>
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
        <button onClick={() => void renameChat(activeChat)}>Rename chat</button>
        <button onClick={() => archiveChat(activeChat)}>Archive</button>
        <details className="project-menu">
          <summary>Project actions</summary>
          <div>
            <button onClick={downloadReproducibilityReport}>Download reproducibility report</button>
            <button onClick={() => void downloadArchive()}>Download project ZIP</button>
            <button onClick={() => importInput.current?.click()}>Import project ZIP</button>
            {bridge.canUpload && <button onClick={() => void saveArchiveToOmero()}>Save project to OMERO</button>}
          </div>
        </details>
        <input ref={importInput} hidden type="file" accept=".zip,.oac.zip" onChange={(event) => void importArchive(event.target.files?.[0] || null)} />
      </div>

      {showScriptTransfer && (
        <div className="dialog-backdrop" role="presentation">
          <section className="script-transfer-dialog" role="dialog" aria-modal="true" aria-labelledby="script-transfer-title">
            <h2 id="script-transfer-title">Copy scripts to another project</h2>
            <p>
              The copied scripts keep their code and versions. When run in the
              destination, they automatically use that project’s current input files.
            </p>
            <label>Destination project
              <select value={scriptTransferTarget} onChange={(event) => setScriptTransferTarget(event.target.value)}>
                {userProjects.filter((item) => item.id !== project.id).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.objectType} {item.objectId} — {item.name}
                  </option>
                ))}
              </select>
            </label>
            <small>
              A destination appears after you have opened that OMERO object in
              Analysis Chat at least once.
            </small>
            <div className="dialog-actions">
              <button onClick={() => setShowScriptTransfer(false)}>Cancel</button>
              <button disabled={!scriptTransferTarget} onClick={() => void copySelectedScripts()}>Copy selected scripts</button>
            </div>
          </section>
        </div>
      )}

      <div
        className={`workspace ${artifactOpen ? "artifact-visible" : ""}`}
        style={{ "--explorer-width": `${explorerWidth}px` } as CSSProperties}
      >
        <aside
          className="project-tree"
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
          }}
          onDrop={(event) => {
            event.preventDefault();
            void addLocalFiles(event.dataTransfer.files);
          }}
        >
          <div
            className="file-browser-heading"
            onContextMenu={(event) => openBrowserMenu(event, project.name, [
              { label: "Add files", run: () => addFilesInput.current?.click() },
              { label: "New chat", run: () => void newConversation() },
              { label: "Rename current chat", run: () => void renameChat(activeChat) },
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
                { label: "Rename current chat", run: () => void renameChat(activeChat) },
                { label: "Refresh", run: () => void refreshProject() }
              ])}
            ><Icon name="more" /></button>
          </div>
          <div className="file-browser-toolbar" role="toolbar" aria-label="Project file actions">
            <button
              title="Up to OMERO object projects"
              aria-label="Up to OMERO object projects"
              disabled={browserAtParent}
              onClick={() => setBrowserAtParent(true)}
            ><Icon name="up" /></button>
            <button title="Add files" aria-label="Add files" onClick={() => addFilesInput.current?.click()}><Icon name="upload" /></button>
            <button title="Refresh project" aria-label="Refresh project" onClick={() => void refreshProject()}><Icon name="refresh" /></button>
            <button
              title="Collapse all folders"
              aria-label="Collapse all folders"
              onClick={() => setOpenFolders({
                inputs: false,
                outputs: false,
                scripts: false,
                workflows: false,
                trash: false,
                snapshots: false
              })}
            ><Icon name="collapse" /></button>
            <input ref={addFilesInput} hidden type="file" multiple onChange={(event) => void addLocalFiles(event.target.files)} />
          </div>
          <label className="explorer-search">
            <span className="sr-only">Search project files</span>
            <input
              type="search"
              value={explorerQuery}
              placeholder="Search files, scripts, workflows…"
              onChange={(event) => setExplorerQuery(event.target.value)}
            />
          </label>
          <div
            className="browser-path"
            title={browserAtParent ? `OMERO/${project.objectType}-${project.objectId}` : project.rootPath}
            onDoubleClick={() => setBrowserAtParent(true)}
          >
            <Icon name="root" />
            <span>{browserAtParent ? `OMERO/${project.objectType}-${project.objectId}` : project.rootPath}</span>
          </div>
          <div className="browser-columns"><span>Name</span><span>Size</span></div>
          {browserAtParent ? (
            <>
            <div className="hierarchy-section">
              <strong>OMERO hierarchy</strong>
              {[...(hierarchy?.parents || []), ...(hierarchy?.children || [])].map((item) => (
                <button
                  key={`${item.type}:${item.id}`}
                  disabled={!item.supported}
                  onClick={() => {
                    if (item.supported) {
                      window.location.assign(
                        `${bootstrap.tokenUrl.replace(/api\/context-token\/$/, "")}?type=${encodeURIComponent(item.type)}&id=${item.id}`
                      );
                    }
                  }}
                >
                  <Icon name="folder" />
                  <span>{item.name}</span>
                  <small>{item.type} {item.id}</small>
                </button>
              ))}
              {!hierarchy?.parents.length && !hierarchy?.children.length && (
                <p>No readable immediate OMERO relations.</p>
              )}
            </div>
            <div className="hierarchy-section-title">Browser-local projects for this object</div>
            <ul className="browser-list project-list">
              {projects.map((item) => (
                <li
                  key={item.id}
                  className={projectRowClassName(
                    item.id,
                    project.id,
                    selectedProjectId
                  )}
                  aria-selected={item.id === (selectedProjectId || project.id)}
                  onClick={() => setSelectedProjectId(item.id)}
                  onDoubleClick={() => void switchProject(item.id)}
                  onContextMenu={(event) => {
                    setSelectedProjectId(item.id);
                    openBrowserMenu(event, item.name, [
                      { label: "Open project", run: () => void switchProject(item.id) },
                      ...(item.id !== project.id ? [{
                        label: "Delete local project",
                        danger: true,
                        run: () => void removeLocalProject(item)
                      }] : [])
                    ]);
                  }}
                >
                  <Icon name="folder" />
                  <div className="browser-name">
                    <strong>{item.name}</strong>
                    <small>{item.id === project.id ? "open now" : item.sourceSnapshotAnnotationId ? `restored from Annotation ${item.sourceSnapshotAnnotationId}` : "browser-local project"}</small>
                  </div>
                  <span className="browser-size">{new Date(item.updatedAt).toLocaleDateString()}</span>
                  <button
                    className="browser-more"
                    aria-label={`Actions for ${item.name}`}
                    onClick={(event) => {
                      setSelectedProjectId(item.id);
                      openBrowserMenu(event, item.name, [
                        { label: "Open project", run: () => void switchProject(item.id) },
                        ...(item.id !== project.id ? [{
                          label: "Delete local project",
                          danger: true,
                          run: () => void removeLocalProject(item)
                        }] : [])
                      ]);
                    }}
                  ><Icon name="more" /></button>
                </li>
              ))}
            </ul>
            </>
          ) : (<>
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
              <Icon name="chevron" className="folder-chevron" />
              <Icon name="folder" />
              <strong>inputs</strong><small>{inputFiles.length}</small>
            </summary>
            <ul className="browser-list">
              {visibleInputs.map((file) => (
                <li
                  key={file.id}
                  className={`browser-row file-${file.state}`}
                  onContextMenu={(event) => openBrowserMenu(event, file.name, inputActions(file))}
                >
                  <Icon name="file" />
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
                  ><Icon name="more" /></button>
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
              {!visibleInputs.length && <li className="browser-empty">No matching input files</li>}
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
                { label: "Rename chat", run: () => void renameChat(activeChat) },
                { label: "New chat", run: () => void newConversation() },
                { label: "Archive chat", run: () => archiveChat(activeChat) }
              ])}
            >
              <Icon name="chevron" className="folder-chevron" />
              <Icon name="folder" />
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
              {visibleOutputs.map((file) => (
                <li
                  key={file.id}
                  className="browser-row"
                  onClick={() => {
                    setSelectedArtifactFileId(file.id);
                    setArtifactOpen(true);
                  }}
                  onDoubleClick={() => downloadFile(file)}
                  onContextMenu={(event) => openBrowserMenu(event, file.name, outputActions(file))}
                >
                  <Icon name={file.type.startsWith("image/") ? "image" : "file"} />
                  <div className="browser-name">
                    <strong>{file.name}</strong><small>{file.sha256.slice(0, 10)} · double-click to download</small>
                  </div>
                  <span className="browser-size">{bytesLabel(file.size)}</span>
                  <button
                    className="browser-more"
                    aria-label={`Actions for ${file.name}`}
                    onClick={(event) => openBrowserMenu(event, file.name, outputActions(file))}
                  ><Icon name="more" /></button>
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
            <summary
              onContextMenu={(event) => openBrowserMenu(event, "scripts/", [
                { label: "Combine selected scripts", run: () => void combineSelectedScripts() },
                { label: "Copy selected scripts…", run: () => beginScriptTransfer() }
              ])}
            >
              <Icon name="chevron" className="folder-chevron" />
              <Icon name="folder" />
              <strong>scripts</strong><small>{activeScripts.length}</small>
            </summary>
            {activeScripts.length > 0 && (
              <div className="script-selection-toolbar">
                <span>{selectedScriptIds.size} selected</span>
                <button disabled={selectedScriptIds.size < 2} onClick={() => void combineSelectedScripts()}>Combine</button>
                <button disabled={!selectedScriptIds.size} onClick={() => beginScriptTransfer()}>Copy to…</button>
              </div>
            )}
            <ul className="browser-list">
              {activeScripts.filter((script) => matchesExplorer(script.name)).map((script) => (
                <li
                  key={script.id}
                  className="browser-row script-row"
                  onDoubleClick={() => void runScript(script)}
                  onContextMenu={(event) => openBrowserMenu(event, script.name, scriptActions(script))}
                >
                  <input
                    className="script-selector"
                    type="checkbox"
                    aria-label={`Select ${script.name}`}
                    checked={selectedScriptIds.has(script.id)}
                    onChange={() => toggleScriptSelection(script.id)}
                    onDoubleClick={(event) => event.stopPropagation()}
                  />
                  <span className="browser-icon python" aria-hidden="true" />
                  <div className="browser-name">
                    <strong>{script.name}</strong><small>v{script.currentVersion} · {script.description || "saved Python script"}</small>
                  </div>
                  <span className="browser-size">v{script.currentVersion}</span>
                  <button
                    className="browser-more"
                    aria-label={`Actions for ${script.name}`}
                    onClick={(event) => openBrowserMenu(event, script.name, scriptActions(script))}
                  ><Icon name="more" /></button>
                </li>
              ))}
              {!activeScripts.filter((script) => matchesExplorer(script.name)).length && <li className="browser-empty">No matching scripts</li>}
            </ul>
          </details>

          <details
            open={openFolders.workflows}
            className="browser-folder"
            onToggle={(event) => {
              const open = event.currentTarget.open;
              setOpenFolders((current) => ({ ...current, workflows: open }));
            }}
          >
            <summary>
              <Icon name="chevron" className="folder-chevron" />
              <Icon name="folder" />
              <strong>workflows</strong><small>{workspace.workflows.length}</small>
            </summary>
            <ul className="browser-list">
              {workspace.workflows.filter((workflow) =>
                !workflow.deletedAt && matchesExplorer(workflow.name)
              ).map((workflow) => (
                <li
                  key={workflow.id}
                  className="browser-row"
                  onDoubleClick={() => void runWorkflow(workflow)}
                  onContextMenu={(event) => openBrowserMenu(event, workflow.name, [
                    { label: "Run workflow", run: () => void runWorkflow(workflow) },
                    { label: "Batch run on opened projects…", run: () => void batchRunWorkflow(workflow) },
                    ...(bridge.canUpload ? [{
                      label: "Publish template to OMERO",
                      run: () => void publishWorkflow(workflow)
                    }] : []),
                    { label: "Delete workflow", danger: true, run: () => void removeWorkflow(workflow) }
                  ])}
                >
                  <Icon name="file" />
                  <div className="browser-name">
                    <strong>{workflow.name}</strong>
                    <small>v{workflow.version} · {workflow.steps.length} isolated steps</small>
                  </div>
                  <span className="browser-size">{workflow.steps.length}</span>
                  <button
                    className="browser-more"
                    aria-label={`Actions for ${workflow.name}`}
                    onClick={(event) => openBrowserMenu(event, workflow.name, [
                      { label: "Run workflow", run: () => void runWorkflow(workflow) },
                      { label: "Batch run on opened projects…", run: () => void batchRunWorkflow(workflow) },
                      ...(bridge.canUpload ? [{
                        label: "Publish template to OMERO",
                        run: () => void publishWorkflow(workflow)
                      }] : []),
                      { label: "Delete workflow", danger: true, run: () => void removeWorkflow(workflow) }
                    ])}
                  ><Icon name="more" /></button>
                </li>
              ))}
              {!workspace.workflows.filter((workflow) =>
                !workflow.deletedAt && matchesExplorer(workflow.name)
              ).length && <li className="browser-empty">No matching workflows</li>}
              {workflowTemplates.map((template) => (
                <li
                  key={`template-${template.annotation_id}`}
                  className="browser-row"
                  onDoubleClick={() => void importWorkflowTemplate(template)}
                >
                  <span className="browser-icon archive" aria-hidden="true" />
                  <div className="browser-name">
                    <strong>{template.name}</strong>
                    <small>OMERO template · double-click to import</small>
                  </div>
                  <span className="browser-size">{bytesLabel(template.size)}</span>
                  <button
                    className="browser-more"
                    aria-label={`Import ${template.name}`}
                    onClick={() => void importWorkflowTemplate(template)}
                  ><Icon name="more" /></button>
                </li>
              ))}
            </ul>
          </details>

          {(trashedFiles.length > 0 || trashedScripts.length > 0 || trashedWorkflows.length > 0) && (
            <details
              open={openFolders.trash}
              className="browser-folder"
              onToggle={(event) => {
                const open = event.currentTarget.open;
                setOpenFolders((current) => ({ ...current, trash: open }));
              }}
            >
              <summary>
                <Icon name="chevron" className="folder-chevron" />
                <Icon name="folder" />
                <strong>trash</strong><small>{trashedFiles.length + trashedScripts.length + trashedWorkflows.length}</small>
              </summary>
              <ul className="browser-list">
                {trashedFiles.map((file) => (
                  <li key={file.id} className="browser-row">
                    <Icon name="file" />
                    <div className="browser-name"><strong>{file.name}</strong><small>deleted output</small></div>
                    <span className="browser-size">{bytesLabel(file.size)}</span>
                    <button onClick={() => void restoreTrashedFile(file)}>Restore</button>
                  </li>
                ))}
                {trashedScripts.map((script) => (
                  <li key={script.id} className="browser-row">
                    <span className="browser-icon python" aria-hidden="true" />
                    <div className="browser-name"><strong>{script.name}</strong><small>deleted script</small></div>
                    <span className="browser-size">v{script.currentVersion}</span>
                    <button onClick={() => void restoreTrashedScript(script)}>Restore</button>
                  </li>
                ))}
                {trashedWorkflows.map((workflow) => (
                  <li key={workflow.id} className="browser-row">
                    <Icon name="file" />
                    <div className="browser-name"><strong>{workflow.name}</strong><small>deleted workflow</small></div>
                    <span className="browser-size">v{workflow.version}</span>
                    <button onClick={() => void restoreTrashedWorkflow(workflow)}>Restore</button>
                  </li>
                ))}
              </ul>
            </details>
          )}

          {snapshots.length > 0 && (
            <details
              open={openFolders.snapshots}
              className="browser-folder"
              onToggle={(event) => {
                const open = event.currentTarget.open;
                setOpenFolders((current) => ({ ...current, snapshots: open }));
              }}
            >
              <summary>
                <Icon name="chevron" className="folder-chevron" />
                <Icon name="folder" />
                <strong>Resume from OMERO</strong><small>{snapshots.length}</small>
              </summary>
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
                    ><Icon name="more" /></button>
                  </li>
                ))}
              </ul>
            </details>
          )}
          </>)}
        </aside>
        <div
          className="pane-resizer"
          role="separator"
          aria-label="Resize project explorer"
          onMouseDown={beginExplorerResize}
        />

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
            {!activeChat.messages.length && (
              <div className="welcome">
                <h2>What would you like to learn from these data?</h2>
                <p>This named chat, its code, outputs, and reusable workflows are saved automatically in the browser project.</p>
                {profiles.length > 0 && (
                  <div className="suggested-prompts">
                    <button onClick={() => setPrompt("Summarize the available datasets, tables, columns, and important data-quality issues.")}>
                      Summarize these data
                    </button>
                    <button onClick={() => setPrompt("Find the most biologically meaningful differences and visualize them with reproducible plot data.")}>
                      Find meaningful differences
                    </button>
                    <button onClick={() => setPrompt("Explain the CI Segmentation schema and suggest three safe analyses for these measurements.")}>
                      Explore the measurement schema
                    </button>
                  </div>
                )}
              </div>
            )}
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
              const messageTiming = activityText(
                message.activity,
                message.durationMs
              );
              return (
                <article key={message.id} className={`message ${message.role} ${message.kind || ""}`}>
                  <span>
                    {message.role}
                    <button
                      className="pin-message"
                      aria-label={`${(activeChat.pinnedMessageIds || []).includes(message.id) ? "Unpin" : "Pin"} message`}
                      onClick={() => togglePinnedMessage(activeChat, message.id)}
                    >
                      {(activeChat.pinnedMessageIds || []).includes(message.id) ? "★" : "☆"}
                    </button>
                  </span>
                  <p>{message.content}</p>
                  {message.citationIds?.length ? (
                    <div className="message-citations" aria-label="Evidence used for this answer">
                      {message.citationIds.map((executionId, index) => {
                        const cited = workspace.executions.find((item) => item.id === executionId);
                        const fileId = cited?.outputFileIds.find((candidate) =>
                          workspace.files.some((file) => file.id === candidate && !file.deletedAt)
                        );
                        return (
                          <button
                            key={executionId}
                            title={`Open local execution ${executionId.slice(0, 8)}`}
                            onClick={() => {
                              if (fileId) setSelectedArtifactFileId(fileId);
                              setArtifactOpen(true);
                            }}
                          >
                            Evidence {index + 1}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                  {messageTiming && (
                    <small className="message-activity">{messageTiming}</small>
                  )}
                </article>
              );
            })}
            {streamingText && (
              <article className="message assistant streaming">
                <span>assistant · {analysisPhase}</span>
                <p>{streamingText}<i className="stream-caret" /></p>
              </article>
            )}
          </div>
          <ComposerPanel
            runtimeReady={runtimeReady}
            runtimeProgress={runtimeProgress}
            status={status}
            usage={usage}
            settings={settings}
            blocked={blockedFiles.length > 0}
            canChat={canChat}
            composerPlaceholder={composerPlaceholder}
            prompt={prompt}
            busy={busy}
            onPromptChange={setPrompt}
            onSend={() => void sendPrompt()}
            onStop={stop}
            onReset={() => void restartRuntime(workspace.files, "Python state reset; inputs restored")}
          />
        </section>
        <ArtifactInspector
          open={artifactOpen}
          file={selectedArtifactFile}
          profiles={profiles}
          canUpload={bridge.canUpload}
          onToggle={() => setArtifactOpen((value) => !value)}
          onDownload={downloadFile}
          onAttach={(file) => void attach(file)}
        />
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
    if (!runtimeReady || busy || execution.purpose === "inspection") return;
    setBusy(true);
    turnOutputNames.current.clear();
    await runtime.beginTurn();
    try {
      await executeCode(
        execution.code,
        execution.chatId,
        id(),
        true,
        execution.purpose === "script" ? "script" : "analysis"
      );
      setStatus("Python rerun completed");
    } finally {
      setBusy(false);
    }
  }
}

type IconName =
  | "folder"
  | "file"
  | "image"
  | "root"
  | "up"
  | "upload"
  | "refresh"
  | "collapse"
  | "chevron"
  | "more";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    folder: <path d="M2.5 6.5h8.1l2.35-3h6.55v15H2.5z" />,
    file: <path d="M5 2.5h8l4 4v15H5zm8 0v4h4M8 11h6M8 15h6" />,
    image: <><rect x="3" y="4" width="18" height="16" rx="1.5" /><circle cx="9" cy="9" r="1.5" /><path d="m5 18 5-5 3 3 2-2 4 4" /></>,
    root: <><path d="m3 11 9-7 9 7" /><path d="M5.5 10v10h13V10M10 20v-6h4v6" /></>,
    up: <><path d="m7 10 5-5 5 5" /><path d="M12 5v13" /></>,
    upload: <><path d="M4 16v4h16v-4" /><path d="M12 16V4m-5 5 5-5 5 5" /></>,
    refresh: <><path d="M20 7V3l-3 3a8 8 0 1 0 2.2 8" /><path d="M20 3h-5" /></>,
    collapse: <><path d="m7 9 5-5 5 5M7 15l5 5 5-5" /></>,
    chevron: <path d="m9 5 7 7-7 7" />,
    more: <><circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" /></>
  };
  return (
    <svg
      className={`ui-icon icon-${name} ${className}`.trim()}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={name === "folder" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
