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
  type AiMessage,
  type ToolCall
} from "./api";
import { exportWorkspace, importWorkspace } from "./archive";
import {
  MAX_FILE_BYTES,
  MAX_TOOL_TEXT,
  MAX_WORKSPACE_BYTES,
  SYSTEM_PROMPT,
  TOOLS,
  ZARR_VIEWER_TOOLS
} from "./constants";
import { PythonRuntime, RUNTIME_VERSION } from "./runtime";
import NotebookView, { parseNotebook, serializeNotebook } from "./NotebookView";
import {
  defaultSettings,
  deleteWorkspaceCascade,
  deleteFile as deleteStoredFile,
  getValue,
  listContextWorkspaces,
  listUserWorkspaces,
  loadOrCreateWorkspace,
  loadWorkspace,
  newChat,
  saveChat,
  saveExecution,
  saveFile,
  saveWorkspaceRecord,
  saveMethod,
  savePipeline,
  saveNotebook,
  saveAudit,
  saveArtifact,
  saveEvidenceLedger,
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
  WorkspaceRecord,
  AnalysisWorkspace,
  ProviderSettings,
  RuntimeOutput,
  RuntimeProgress,
  MethodRecord,
  MethodVersion,
  PipelineRecord,
  OutboundPayloadAudit,
  ArtifactRecord,
  InputContract,
  OmeroHierarchy,
  TokenUsage,
  WorkspaceFile,
  WorkflowSkillCatalog,
  WorkflowSkillPackage,
  ZarrBinding,
  ZarrFocusTarget,
  ZarrViewerCapability,
  ZarrViewerIntegrationStatus,
  EvidenceRecord,
  ZarrRenderRecipe,
  NotebookRecord,
  AnalysisSkillProviderCatalog
} from "./types";
import { useDialogs } from "./components/Dialogs";
import { ExecutionCard } from "./components/ExecutionCard";
import {
  ArtifactInspector,
  ComposerPanel,
  ViewerPreviewCard,
  type InspectorItem
} from "./components/WorkspacePanels";
import {
  matchWorkflowSkills,
  packageInstructions,
  skillProvenance,
  workflowSkillSourceKey
} from "./workflowSkills";
import {
  fetchZarrCapability,
  renderZarrPreview,
  renderZarrRecipe,
  zarrBinding,
  zarrCandidates,
  zarrFocusFromToolArgs,
  zarrGalleryProvenance,
  zarrProvenance,
  zarrRecipeFromToolArgs,
  zarrViewerUrl
} from "./zarrViewer";
import {
  boundedEvidencePayload,
  currentEvidence,
  evidenceKind,
  evidencePrompt,
  requireGalleryEvidence,
  requireEvidenceIds,
  sourceSkillKey,
  upsertBoundedEvidence
} from "./evidence";
import { buildRenderBundle } from "./renderBundle";
import { savedGalleryRequest } from "./savedMethodRender";
import { visualSaveTitle } from "./saveSuggestions";
import {
  activityText,
  formatDuration,
  workspaceRowClassName,
  workflowSkillTooltip
} from "./presentation";
import {
  chatRoundPolicy,
  FINAL_SYNTHESIS_INSTRUCTION,
  MAX_TOOL_ROUNDS
} from "./chatRounds";
import {
  normalizeWorkspaceName,
  renameAnalysisWorkspace,
  trashWorkspaceOutputs
} from "./workspaceModel";

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

export function bindMethodInputs(
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
          ? `Method input ${sourceName} is ambiguous: ${candidates.map((file) => file.name).join(", ")}`
          : `Method input ${sourceName} has no compatible file in this workspace`
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

function workspaceBytes(analysisWorkspace: AnalysisWorkspace | null): number {
  return analysisWorkspace?.files.filter((file) => !file.deletedAt)
    .reduce((sum, file) => sum + file.size, 0) || 0;
}

function workspaceInputHashes(analysisWorkspace: AnalysisWorkspace): string[] {
  return analysisWorkspace.files
    .filter((file) => file.source !== "result" && file.state === "ready" && !file.deletedAt)
    .map((file) => file.sha256)
    .sort();
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

interface InspectorSelection {
  kind: InspectorItem["kind"];
  id: string;
}

interface ExecutionOrigin {
  methodId?: string;
  pipelineId?: string;
}

interface VisibleZarrSource {
  id: string;
  name: string;
  contextName: string;
  storeUuid: string;
  objectType: string;
  objectId: number;
  zarrName: string;
  plateRows: number;
  plateColumns: number;
  wellsWithData: number;
  fieldsWithData: number;
}

export function methodUsesZarrViewer(method: MethodRecord, code: string): boolean {
  return Boolean(
    method.requiredCapabilities?.includes("zarrviewer") ||
    /(?:store_uuid|render_panels|zarrviewer|ome[-_.]?zarr)/i.test(code)
  );
}

function executionPreparesViewer(
  workspace: Pick<AnalysisWorkspace, "artifacts">,
  execution: ExecutionRecord
): boolean {
  if (execution.purpose === "inspection") return false;
  if (workspace.artifacts.some((artifact) =>
    artifact.chatId === execution.chatId &&
    artifact.promptId === execution.promptId &&
    Boolean(artifact.viewer)
  )) return true;
  const payload = execution.modelPayload
    ? JSON.stringify(execution.modelPayload)
    : "";
  return (
    /\brender_panels\b/i.test(execution.code) ||
    /"render_panels"\s*:/i.test(payload) ||
    (
      /\bstore_uuid\b/i.test(execution.code) &&
      /\b(?:field|roi|source_channels|overlays)\b/i.test(execution.code)
    ) ||
    (
      /"store_uuid"\s*:/i.test(payload) &&
      /"(?:field|roi|source_channels|overlays)"\s*:/i.test(payload)
    )
  );
}

export default function App() {
  const bootstrap = window.OMERO_ANALYSIS;
  const bridge = useMemo(() => new OmeroBridge(bootstrap), [bootstrap]);
  const runtime = useMemo(
    () => new PythonRuntime(bootstrap.runtimeBase, bootstrap.context),
    [bootstrap]
  );
  const dialogs = useDialogs();
  const initialTab = new URLSearchParams(window.location.search).get("tab");
  const [activeTab, setActiveTabState] = useState<"chat" | "notebook" | "settings">(
    initialTab === "notebook" || initialTab === "settings" ? initialTab : "chat"
  );
  const [analysisWorkspace, setWorkspace] = useState<AnalysisWorkspace | null>(null);
  const workspaceRef = useRef<AnalysisWorkspace | null>(null);
  const [workspaces, setWorkspaces] = useState<WorkspaceRecord[]>([]);
  const [userWorkspaces, setUserWorkspaces] = useState<WorkspaceRecord[]>([]);
  const [snapshots, setSnapshots] = useState<Attachment[]>([]);
  const [hierarchy, setHierarchy] = useState<OmeroHierarchy | null>(null);
  const [pipelineTemplates, setPipelineTemplates] = useState<Attachment[]>([]);
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [workflowSkillCatalog, setWorkflowSkillCatalog] =
    useState<WorkflowSkillCatalog | null>(null);
  const workflowSkillCatalogRef = useRef<WorkflowSkillCatalog | null>(null);
  const workflowSkillPackages = useRef(new Map<string, WorkflowSkillPackage>());
  const [workflowSkillWarning, setWorkflowSkillWarning] = useState("");
  const [zarrViewerStatus, setZarrViewerStatus] =
    useState<ZarrViewerIntegrationStatus | null>(null);
  const [zarrViewerWarning, setZarrViewerWarning] = useState("");
  const [zarrSkillCatalog, setZarrSkillCatalog] =
    useState<AnalysisSkillProviderCatalog | null>(null);
  const zarrCapabilities = useRef(new Map<string, ZarrViewerCapability>());
  const [visibleZarrSources, setVisibleZarrSources] = useState<VisibleZarrSource[]>([]);
  const [settings, setSettings] = useState<ProviderSettings>(defaultSettings);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [analysisPhase, setAnalysisPhase] = useState<"ready" | "planning" | "running" | "checking" | "repairing">("ready");
  const [runtimeReady, setRuntimeReady] = useState(false);
  const runtimeStarted = useRef(false);
  const [profiles, setProfiles] = useState<DataProfile[]>([]);
  const [inspectorSelection, setInspectorSelection] =
    useState<InspectorSelection | null>(null);
  const [explorerWidth, setExplorerWidth] = useState(320);
  const [artifactWidth, setArtifactWidth] = useState(360);
  const [notebookRunRequest, setNotebookRunRequest] =
    useState<{ id: string; nonce: number } | null>(null);
  const [explorerQuery, setExplorerQuery] = useState("");
  const [status, setStatus] = useState("Preparing workspace…");
  const [browserMenu, setBrowserMenu] = useState<BrowserMenuState | null>(null);
  const [browserAtParent, setBrowserAtParent] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [selectedMethodIds, setSelectedMethodIds] = useState<Set<string>>(new Set());
  const [selectedPipelineIds, setSelectedPipelineIds] = useState<Set<string>>(new Set());
  const [selectedOutputIds, setSelectedOutputIds] = useState<Set<string>>(new Set());
  const [showMethodTransfer, setShowMethodTransfer] = useState(false);
  const [methodTransferTarget, setMethodTransferTarget] = useState("");
  const [openFolders, setOpenFolders] = useState({
    chat: true,
    inputs: true,
    methods: true,
    pipelines: true,
    notebooks: true,
    trash: false,
    snapshots: false
  });
  const [usage, setUsage] = useState<TokenUsage | null>(null);
  const [runtimeProgress, setRuntimeProgress] = useState<RuntimeProgress>({
    percent: 0,
    message: "Preparing the browser analysisWorkspace…"
  });
  const [storage, setStorage] = useState({ usage: 0, quota: 0 });
  const abort = useRef<AbortController | null>(null);
  const messagesElement = useRef<HTMLDivElement | null>(null);
  const importInput = useRef<HTMLInputElement | null>(null);
  const addFilesInput = useRef<HTMLInputElement | null>(null);
  const notebookUploadInput = useRef<HTMLInputElement | null>(null);
  const turnOutputNames = useRef(new Set<string>());
  const turnWorkflowSkills =
    useRef<NonNullable<ChatMessage["workflowSkills"]>>([]);
  workspaceRef.current = analysisWorkspace;
  workflowSkillCatalogRef.current = workflowSkillCatalog;

  function setActiveTab(tab: "chat" | "notebook" | "settings") {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url);
    setActiveTabState(tab);
  }

  const workspace = analysisWorkspace?.workspace || null;
  const chats = analysisWorkspace?.chats || [];
  const activeChat = chats.find((chat) => chat.id === workspace?.activeChatId) || chats[0] || null;
  const inputFiles = (analysisWorkspace?.files || []).filter(
    (file) => file.source !== "result" && !file.deletedAt
  );
  const outputFiles = (analysisWorkspace?.files || []).filter(
    (file) => file.source === "result" && !file.deletedAt
  );
  const notebookOutputFiles = outputFiles.filter((file) => Boolean(file.notebookId));
  const pipelineOutputFiles = outputFiles.filter((file) =>
    Boolean(file.pipelineId) && !file.notebookId
  );
  const methodOutputFiles = outputFiles.filter((file) =>
    Boolean(file.methodId) && !file.pipelineId && !file.notebookId
  );
  const chatOutputFiles = outputFiles.filter((file) =>
    !file.notebookId && !file.pipelineId && !file.methodId
  );
  const blockedFiles = inputFiles.filter((file) => file.state !== "ready");
  const selectedArtifactFileId = inspectorSelection?.kind === "file"
    ? inspectorSelection.id
    : null;
  const setSelectedArtifactFileId = (value: string | null) =>
    setInspectorSelection(value ? { kind: "file", id: value } : null);
  const matchesExplorer = (value: string) =>
    !explorerQuery.trim() || value.toLowerCase().includes(explorerQuery.trim().toLowerCase());
  const visibleInputs = inputFiles.filter((file) => matchesExplorer(file.name));
  const trashedFiles = (analysisWorkspace?.files || []).filter((file) => Boolean(file.deletedAt));
  const activeMethods = (analysisWorkspace?.methods || []).filter((method) => !method.deletedAt);
  const trashedMethods = (analysisWorkspace?.methods || []).filter((method) => Boolean(method.deletedAt));
  const trashedPipelines = (analysisWorkspace?.pipelines || []).filter((pipeline) => Boolean(pipeline.deletedAt));
  const canChat =
    Boolean(activeChat) &&
    runtimeReady &&
    blockedFiles.length === 0 &&
    Boolean(settings.endpoint && settings.apiKey && settings.model) &&
    !busy;
  const composerPlaceholder = busy
    ? "Analysis in progress — wait for the answer or press Stop…"
    : blockedFiles.some((file) => file.state === "failed" || file.state === "missing")
      ? "Chat is blocked — retry, reselect, or remove the missing data file…"
      : blockedFiles.length
        ? "Downloading selected data — chat will unlock when every file is ready…"
        : !runtimeReady
          ? `${runtimeProgress.message} (${Math.round(runtimeProgress.percent)}%) — please wait…`
          : !settings.endpoint || !settings.apiKey || !settings.model
            ? "Configure the AI endpoint, model, and API key before asking a question…"
            : "Ask a question about the loaded data…";

  useEffect(() => {
    const element = messagesElement.current;
    if (!element) return;
    const frame = requestAnimationFrame(() => {
      element.scrollTo({ top: element.scrollHeight, behavior: "auto" });
    });
    return () => cancelAnimationFrame(frame);
  }, [activeChat?.messages, analysisWorkspace?.executions, analysisWorkspace?.files]);

  useEffect(() => {
    setSelectedOutputIds(new Set());
  }, [workspace?.id, activeChat?.id]);

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
      const [savedSettings, baseWorkspace] = await Promise.all([
        getValue<ProviderSettings>(settingsKey),
        loadOrCreateWorkspace(bootstrap.context)
      ]);
      if (!alive) return;
      if (savedSettings) setSettings({ ...defaultSettings, ...savedSettings });
      await bridge.connect();
      const [loadedHierarchy, viewerStatus] = await Promise.all([
        bridge.hierarchy(),
        bridge.zarrViewerStatus().catch((error) => ({
          schema_version: 1 as const,
          available: false,
          installed: false,
          enabled: false,
          version: null,
          minimum_version: "0.4.0",
          reason: "not-installed" as const
        }))
      ]);
      setHierarchy(loadedHierarchy);
      setZarrViewerStatus(viewerStatus);
      if (viewerStatus.available) {
        setZarrSkillCatalog(
          await bridge.listZarrViewerSkills().catch(() => null)
        );
      }
      setZarrViewerWarning(
        viewerStatus.available
          ? ""
          : viewerStatus.reason === "not-installed"
            ? "OMERO ZarrViewer is not installed; image previews are unavailable."
            : viewerStatus.reason === "app-disabled"
              ? "OMERO ZarrViewer is installed but not enabled in OMERO.web."
              : `OMERO ZarrViewer integration unavailable: ${viewerStatus.reason || "unknown reason"}`
      );
      try {
        const catalog = await bridge.listWorkflowSkills();
        if (alive) {
          setWorkflowSkillCatalog(catalog);
          setWorkflowSkillWarning(
            catalog.workflows.some((entry) => entry.status === "stale")
              ? "Measurement guidance is using an unchanged cached revision."
              : ""
          );
        }
      } catch (error) {
        if (alive) {
          setWorkflowSkillWarning(
            `Measurement-specific guidance unavailable: ${String(error)}`
          );
        }
      }
      let initial = baseWorkspace;
      const requestedSnapshot = bootstrap.context?.selected_workspace_snapshot;
      if (requestedSnapshot) {
        setRuntimeProgress({ percent: 8, message: "Restoring the selected OMERO workspace…" });
        const localWorkspaces = await listContextWorkspaces(bootstrap.context);
        const existing = localWorkspaces.find(
          (item) => item.sourceWorkspaceSnapshotAnnotationId === requestedSnapshot.annotation_id
        );
        if (existing) {
          initial = await loadWorkspace(existing.id) || baseWorkspace;
        } else {
          const imported = await importWorkspace(
            await bridge.downloadSnapshot(requestedSnapshot),
            bootstrap.context
          );
          if (
            bootstrap.context &&
            (imported.workspace.objectType !== bootstrap.context.object_type ||
              imported.workspace.objectId !== bootstrap.context.object_id)
          ) {
            throw new Error("The selected workspace belongs to a different OMERO object");
          }
          imported.workspace = {
            ...imported.workspace,
            sourceWorkspaceSnapshotAnnotationId: requestedSnapshot.annotation_id,
            updatedAt: now()
          };
          await saveWorkspace(imported);
          initial = imported;
        }
      }
      for (const attached of bootstrap.context?.notebooks || []) {
        if (initial.notebooks.some(
          (item) => item.sourceAnnotationId === attached.annotation_id
        )) continue;
        try {
          const timestamp = now();
          initial = {
            ...initial,
            notebooks: [...initial.notebooks, {
              id: id(),
              workspaceId: initial.workspace.id,
              name: attached.name,
              document: parseNotebook(await bridge.downloadNotebook(attached)),
              sourceAnnotationId: attached.annotation_id,
              attachmentIds: [attached.annotation_id],
              selectedDataFileIds: [],
              createdAt: timestamp,
              updatedAt: timestamp
            }]
          };
        } catch (error) {
          console.warn(`Skipped invalid attached notebook ${attached.name}`, error);
        }
      }
      const requestedNotebook = bootstrap.context?.selected_notebook;
      if (requestedNotebook) {
        let notebook = initial.notebooks.find(
          (item) => item.sourceAnnotationId === requestedNotebook.annotation_id
        );
        if (!notebook) {
          const document = parseNotebook(
            await bridge.downloadNotebook(requestedNotebook)
          );
          const timestamp = now();
          notebook = {
            id: id(),
            workspaceId: initial.workspace.id,
            name: requestedNotebook.name,
            document,
            sourceAnnotationId: requestedNotebook.annotation_id,
            attachmentIds: [requestedNotebook.annotation_id],
            selectedDataFileIds: [],
            createdAt: timestamp,
            updatedAt: timestamp
          };
          initial = { ...initial, notebooks: [...initial.notebooks, notebook] };
          await saveWorkspace(initial);
        }
        setActiveNotebookId(notebook.id);
      } else if (initial.notebooks.length) {
        setActiveNotebookId(initial.notebooks[0].id);
      }
      await saveWorkspace(initial);
      let prepared = await prepareInputs(initial);
      if (!alive) return;
      setWorkspace(prepared);
      workspaceRef.current = prepared;
      setWorkspaces(await listContextWorkspaces(bootstrap.context));
      setUserWorkspaces(await listUserWorkspaces(bootstrap.context));
      setSnapshots(await bridge.listSnapshots());
      setPipelineTemplates(await bridge.listPipelineTemplates());
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
      setStatus(`Workspace failed: ${String(error)}`);
      setRuntimeProgress({ percent: 0, message: `Workspace failed: ${String(error)}` });
    });
    return () => {
      alive = false;
      runtime.dispose();
    };
  }, [bootstrap, bridge, runtime]);

  useEffect(() => {
    let cancelled = false;
    const context = bootstrap.context;
    const viewer = zarrViewerStatus;
    if (!context || !viewer?.available || !hierarchy) {
      setVisibleZarrSources([]);
      return;
    }
    const candidates = zarrCandidates(context, hierarchy).slice(0, 50);
    void Promise.allSettled(candidates.map(async (candidate) => {
      const cacheKey = `${candidate.type}:${candidate.id}`;
      const capability = zarrCapabilities.current.get(cacheKey) ||
        await fetchZarrCapability(viewer, candidate);
      zarrCapabilities.current.set(cacheKey, capability);
      return { candidate, capability };
    })).then((settled) => {
      if (cancelled) return;
      const byUuid = new Map<string, VisibleZarrSource>();
      for (const result of settled) {
        if (result.status !== "fulfilled" || !result.value.capability.store.uuid) continue;
        const { candidate, capability } = result.value;
        const storeUuid = capability.store.uuid.toLowerCase();
        if (byUuid.has(storeUuid)) continue;
        byUuid.set(storeUuid, {
          id: storeUuid,
          name: capability.store.name || "OME-Zarr source",
          contextName: context.name,
          storeUuid,
          objectType: candidate.type,
          objectId: candidate.id,
          zarrName: capability.plate?.name || capability.image.name,
          plateRows: capability.plate?.rows.length || 0,
          plateColumns: capability.plate?.columns.length || 0,
          wellsWithData: capability.plate?.wells.length || 0,
          fieldsWithData: capability.plate?.wells.reduce(
            (total, well) => total + well.fields.length,
            0
          ) || 0
        });
      }
      setVisibleZarrSources(Array.from(byUuid.values()));
    });
    return () => {
      cancelled = true;
    };
  }, [
    bootstrap.context,
    hierarchy,
    zarrViewerStatus?.available,
    zarrViewerStatus?.version
  ]);

  async function prepareInputs(initial: AnalysisWorkspace): Promise<AnalysisWorkspace> {
    let next = initial;
    const existing = new Map(
      next.files.filter((file) => file.annotationId).map((file) => [file.annotationId!, file])
    );
    const selected = bootstrap.context?.selected_attachments || [];
    for (const attachment of selected) {
      if (existing.has(attachment.annotation_id)) continue;
      const file: WorkspaceFile = {
        id: id(),
        workspaceId: next.workspace.id,
        name: attachment.name,
        logicalPath: `${next.workspace.rootPath}/inputs/${attachment.annotation_id}--${attachment.name}`,
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

  function updateWorkspaceRecord(next: WorkspaceRecord) {
    const current = workspaceRef.current;
    if (current) {
      const updated = { ...current, workspace: next };
      workspaceRef.current = updated;
      setWorkspace(updated);
    }
    void saveWorkspaceRecord(next);
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

  function upsertEvidence(record: EvidenceRecord) {
    const current = workspaceRef.current;
    if (!current) return;
    const evidence = upsertBoundedEvidence(current.evidence, record);
    const updated = { ...current, evidence };
    workspaceRef.current = updated;
    setWorkspace(updated);
    void saveEvidenceLedger(record.chatId, evidence.filter((item) => item.chatId === record.chatId));
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

  async function uploadNotebookFile(file: File) {
    const current = workspaceRef.current;
    if (!current) return;
    if (!file.name.toLowerCase().endsWith(".ipynb")) {
      setStatus("Only .ipynb notebooks can be uploaded");
      return;
    }
    if (file.size > 32 * 1024 * 1024) {
      setStatus("Notebook exceeds the 32 MiB upload limit");
      return;
    }
    try {
      const data = await file.arrayBuffer();
      const document = parseNotebook(data);
      const attachment = bootstrap.context && bridge.canUpload
        ? await bridge.uploadNotebook(file.name, new Uint8Array(data))
        : null;
      const timestamp = now();
      const record: NotebookRecord = {
        id: id(),
        workspaceId: current.workspace.id,
        name: attachment?.name || file.name,
        document,
        sourceAnnotationId: attachment?.annotation_id,
        attachmentIds: attachment ? [attachment.annotation_id] : [],
        selectedDataFileIds: current.files
          .filter((item) => item.source !== "result" && !item.deletedAt)
          .map((item) => item.id),
        createdAt: timestamp,
        updatedAt: timestamp
      };
      const updated = { ...current, notebooks: [...current.notebooks, record] };
      workspaceRef.current = updated;
      setWorkspace(updated);
      setActiveNotebookId(record.id);
      setInspectorSelection({ kind: "notebook", id: record.id });
      setActiveTab("notebook");
      await saveNotebook(record);
      setStatus(
        attachment
          ? `Uploaded and attached ${record.name}`
          : `Uploaded ${record.name} to this browser workspace`
      );
    } catch (error) {
      setStatus(`Notebook upload failed: ${String(error)}`);
    }
  }

  async function saveConvertedNotebook(
    suggestedName: string,
    title: string,
    cells: NotebookRecord["document"]["cells"],
    provenance: Record<string, unknown>,
    skipped: string[]
  ) {
    const current = workspaceRef.current;
    if (!current || !cells.some((cell) => cell.cell_type === "code")) {
      setStatus(
        skipped.length
          ? `Notebook conversion skipped every ZarrViewer-dependent item: ${skipped.join(", ")}`
          : "Notebook conversion found no executable Python"
      );
      return;
    }
    const requested = (await dialogs.askText(
      "Notebook filename",
      `${slug(suggestedName.replace(/\.ipynb$/i, ""))}.ipynb`,
      "The generated Notebook is run-only and uses the current Workspace input data."
    ))?.trim();
    if (!requested) return;
    const stem = slug(requested.replace(/\.ipynb$/i, ""));
    let name = `${stem}.ipynb`;
    let suffix = 2;
    while (current.notebooks.some((notebook) =>
      notebook.name.toLowerCase() === name.toLowerCase()
    )) {
      name = `${stem}-${suffix}.ipynb`;
      suffix += 1;
    }
    const timestamp = now();
    const skippedCell: NotebookRecord["document"]["cells"] = skipped.length
      ? [{
          id: id(),
          cell_type: "markdown",
          source: `## Skipped ZarrViewer items\n\n${skipped.map((item) => `- ${item}`).join("\n")}\n\nThese items require ZarrViewer and cannot run in Notebook.`,
          metadata: {}
        }]
      : [];
    const record: NotebookRecord = {
      id: id(),
      workspaceId: current.workspace.id,
      name,
      document: {
        nbformat: 4,
        nbformat_minor: 5,
        metadata: {
          kernelspec: {
            display_name: "Python (Pyodide)",
            language: "python",
            name: "python"
          },
          language_info: { name: "python" },
          omero_analysis: {
            generated_from: provenance,
            created_at: timestamp
          }
        },
        cells: [{
          id: id(),
          cell_type: "markdown",
          source: `# ${title}\n\nGenerated from OMERO.Analysis. Inputs are attached from the current Workspace when Run is pressed.`,
          metadata: {}
        }, ...skippedCell, ...cells]
      },
      attachmentIds: [],
      selectedDataFileIds: current.files
        .filter((file) => file.source !== "result" && !file.deletedAt)
        .map((file) => file.id),
      createdAt: timestamp,
      updatedAt: timestamp
    };
    const updated = { ...current, notebooks: [...current.notebooks, record] };
    workspaceRef.current = updated;
    setWorkspace(updated);
    setActiveNotebookId(record.id);
    setInspectorSelection({ kind: "notebook", id: record.id });
    setSelectedMethodIds(new Set());
    setSelectedPipelineIds(new Set());
    await saveNotebook(record);
    setStatus(
      skipped.length
        ? `Created ${record.name}; skipped ${skipped.length} ZarrViewer-dependent item(s)`
        : `Created ${record.name}`
    );
  }

  async function convertSelectedMethodsToNotebook() {
    const current = workspaceRef.current;
    if (!current) return;
    const selected = current.methods.filter((method) =>
      !method.deletedAt && selectedMethodIds.has(method.id)
    );
    if (!selected.length) {
      setStatus("Select at least one Method to convert");
      return;
    }
    const skipped: string[] = [];
    const cells: NotebookRecord["document"]["cells"] = [];
    for (const method of selected) {
      const version = method.versions.find(
        (item) => item.version === method.currentVersion
      );
      if (!version) continue;
      if (methodUsesZarrViewer(method, version.code)) {
        skipped.push(method.name);
        continue;
      }
      cells.push({
        id: id(),
        cell_type: "markdown",
        source: `## ${method.description || method.name}\n\nMethod: \`${method.name}\` · version ${version.version}`,
        metadata: {}
      }, {
        id: id(),
        cell_type: "code",
        source: version.code,
        metadata: {},
        execution_count: null,
        outputs: []
      });
    }
    await saveConvertedNotebook(
      selected.length === 1 ? selected[0].name : "combined-methods",
      selected.length === 1 ? selected[0].description || selected[0].name : "Combined Methods",
      cells,
      {
        kind: "methods",
        methods: selected.map((method) => ({
          id: method.id,
          name: method.name,
          version: method.currentVersion
        }))
      },
      skipped
    );
  }

  async function convertSelectedPipelinesToNotebook() {
    const current = workspaceRef.current;
    if (!current) return;
    const selected = current.pipelines.filter((pipeline) =>
      !pipeline.deletedAt && selectedPipelineIds.has(pipeline.id)
    );
    if (!selected.length) {
      setStatus("Select at least one Pipeline to convert");
      return;
    }
    const skipped: string[] = [];
    const cells: NotebookRecord["document"]["cells"] = [];
    for (const pipeline of selected) {
      if (selected.length > 1) {
        cells.push({
          id: id(),
          cell_type: "markdown",
          source: `# Pipeline: ${pipeline.name}\n\n${pipeline.description}`,
          metadata: {}
        });
      }
      for (const step of pipeline.steps) {
        const method = current.methods.find((item) =>
          item.id === step.methodId && !item.deletedAt
        );
        const version = method?.versions.find((item) =>
          item.version === step.methodVersion
        );
        if (!method || !version) {
          skipped.push(`${pipeline.name} / ${step.name} (unavailable)`);
          continue;
        }
        if (methodUsesZarrViewer(method, version.code)) {
          skipped.push(`${pipeline.name} / ${step.name}`);
          continue;
        }
        cells.push({
          id: id(),
          cell_type: "markdown",
          source: `## ${step.name}\n\nPipeline \`${pipeline.name}\` · Method version ${step.methodVersion}`,
          metadata: {}
        }, {
          id: id(),
          cell_type: "code",
          source: version.code,
          metadata: {},
          execution_count: null,
          outputs: []
        });
      }
    }
    await saveConvertedNotebook(
      selected.length === 1 ? selected[0].name : "combined-pipelines",
      selected.length === 1 ? selected[0].name : "Combined Pipelines",
      cells,
      {
        kind: "pipelines",
        pipelines: selected.map((pipeline) => ({
          id: pipeline.id,
          name: pipeline.name,
          version: pipeline.version
        }))
      },
      skipped
    );
  }

  function openNotebook(record: NotebookRecord) {
    setActiveNotebookId(record.id);
    setInspectorSelection({ kind: "notebook", id: record.id });
    setActiveTab("notebook");
  }

  function runNotebook(record: NotebookRecord) {
    openNotebook(record);
    setNotebookRunRequest({ id: record.id, nonce: Date.now() });
  }

  async function updateNotebook(record: NotebookRecord) {
    const current = workspaceRef.current;
    if (!current) return;
    const updated = {
      ...current,
      notebooks: current.notebooks.map((item) => item.id === record.id ? record : item)
    };
    workspaceRef.current = updated;
    setWorkspace(updated);
    await saveNotebook(record);
  }

  async function saveNotebookFiles(
    record: NotebookRecord,
    generated: RuntimeOutput["files"]
  ) {
    const current = workspaceRef.current;
    if (!current || !generated.length) return;
    const additions: WorkspaceFile[] = [];
    for (const output of generated) {
      const data = output.data.slice(0);
      additions.push({
        id: id(),
        workspaceId: current.workspace.id,
        notebookId: record.id,
        name: output.name,
        logicalPath: `${current.workspace.rootPath}/Notebooks/Results/${record.name}/${output.name}`,
        type: output.type,
        size: data.byteLength,
        sha256: await sha256(data),
        source: "result",
        state: "ready",
        data,
        createdAt: now()
      });
    }
    upsertFiles(additions);
  }

  async function attachExecutedNotebook(record: NotebookRecord) {
    const current = workspaceRef.current;
    if (!current || !bootstrap.context || !bridge.canUpload) return;
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const stem = record.name.replace(/\.ipynb$/i, "");
      const document = {
        ...record.document,
        metadata: {
          ...record.document.metadata,
          omero_analysis: {
            runtime: RUNTIME_VERSION,
            source_annotation: record.sourceAnnotationId || null,
            input_hashes: current.files
              .filter((file) => file.source !== "result" && !file.deletedAt)
              .map((file) => ({ name: file.name, sha256: file.sha256 })),
            context: {
              object_type: bootstrap.context.object_type,
              object_id: bootstrap.context.object_id,
              group_id: bootstrap.context.group_id
            },
            attached_at: now()
          }
        }
      };
      const attachment = await bridge.uploadNotebook(
        `${stem}-executed-${timestamp}.ipynb`,
        serializeNotebook(document)
      );
      await updateNotebook({
        ...record,
        attachmentIds: [...record.attachmentIds, attachment.annotation_id],
        updatedAt: now()
      });
      setStatus(`Attached executed copy as FileAnnotation ${attachment.annotation_id}`);
    } catch (error) {
      setStatus(`Executed notebook attachment failed: ${String(error)}`);
    }
  }

  async function addLocalFiles(list: FileList | null) {
    if (!list || !analysisWorkspace) return;
    const additions: WorkspaceFile[] = [];
    let total = workspaceBytes(analysisWorkspace);
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
        setStatus("The workspace would exceed 512 MiB");
        break;
      }
      const data = await source.arrayBuffer();
      const digest = await sha256(data);
      if ([...analysisWorkspace.files, ...additions].some(
        (file) => file.sha256 === digest && file.size === data.byteLength
      )) {
        setStatus(`${source.name} matches a file already stored in this workspace`);
        continue;
      }
      additions.push({
        id: id(),
        workspaceId: analysisWorkspace.workspace.id,
        name: source.name,
        logicalPath: `${analysisWorkspace.workspace.rootPath}/inputs/${source.name}`,
        type: source.type || fileType(source.name),
        size: data.byteLength,
        sha256: digest,
        source: "local",
        state: "ready",
        data,
        createdAt: now()
      });
    }
    const nextFiles = [...analysisWorkspace.files, ...additions];
    upsertFiles(additions);
    await restartRuntime(nextFiles, "Local inputs added; browser Python is ready");
    setStorage(await storageEstimate());
  }

  async function removeFile(fileId: string) {
    if (!analysisWorkspace) return;
    const file = analysisWorkspace.files.find((item) => item.id === fileId);
    if (!file) return;
    if (file.source === "result") {
      const tombstone = { ...file, deletedAt: now() };
      upsertFiles([tombstone]);
      setSelectedOutputIds((selected) => {
        const next = new Set(selected);
        next.delete(file.id);
        return next;
      });
      if (selectedArtifactFileId === file.id) setSelectedArtifactFileId(null);
      setStatus(`Moved ${file.name} to workspace trash; provenance is preserved`);
      return;
    }
    const nextFiles = analysisWorkspace.files.filter((item) => item.id !== fileId);
    const updated = { ...analysisWorkspace, files: nextFiles };
    workspaceRef.current = updated;
    setWorkspace(updated);
    await deleteStoredFile(fileId);
    await restartRuntime(nextFiles, "Input removed; browser Python was reset");
    setStorage(await storageEstimate());
  }

  async function retryFile(fileId: string) {
    if (!analysisWorkspace) return;
    const file = analysisWorkspace.files.find((item) => item.id === fileId);
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
      const nextFiles = analysisWorkspace.files.map((item) => item.id === file.id ? ready : item);
      upsertFiles([ready]);
      await restartRuntime(nextFiles, "OMERO input restored; workspace ready");
    } catch (error) {
      upsertFiles([{ ...file, state: "failed", error: String(error) }]);
    }
  }

  async function newConversation() {
    if (!analysisWorkspace) return;
    const chat = newChat(analysisWorkspace.workspace.id);
    const nextWorkspace = { ...analysisWorkspace.workspace, activeChatId: chat.id, updatedAt: now() };
    const updated = { ...analysisWorkspace, workspace: nextWorkspace, chats: [...analysisWorkspace.chats, chat] };
    workspaceRef.current = updated;
    setWorkspace(updated);
    await Promise.all([saveChat(chat), saveWorkspaceRecord(nextWorkspace)]);
    setActiveTab("chat");
    setUsage(null);
    turnOutputNames.current.clear();
    await runtime.beginTurn();
  }

  function switchChat(chatId: string) {
    if (!analysisWorkspace) return;
    const chat = analysisWorkspace.chats.find((item) => item.id === chatId);
    if (chat?.archived) updateChat({ ...chat, archived: false, updatedAt: now() });
    const next = { ...analysisWorkspace.workspace, activeChatId: chatId, updatedAt: now() };
    updateWorkspaceRecord(next);
    setActiveTab("chat");
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

  function beginArtifactResize(event: ReactMouseEvent) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = artifactWidth;
    const move = (moveEvent: MouseEvent) =>
      setArtifactWidth(
        Math.max(280, Math.min(720, startWidth + startX - moveEvent.clientX))
      );
    const stop = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
  }

  async function refreshWorkspace() {
    if (!workspace) return;
    setBrowserMenu(null);
    setWorkspaces(await listContextWorkspaces(bootstrap.context));
    setUserWorkspaces(await listUserWorkspaces(bootstrap.context));
    await switchWorkspace(workspace.id);
  }

  async function removeLocalWorkspace(target: WorkspaceRecord) {
    if (target.id === workspace?.id) {
      setStatus("Open another local workspace before deleting this one");
      return;
    }
    if (!await dialogs.confirm(
      "Delete browser-local workspace?",
      `${target.name} and its local chats, methods, pipelines, and outputs will be permanently removed. OMERO attachments are unchanged.`,
      "Delete local workspace",
      true
    )) return;
    await deleteWorkspaceCascade(target.id);
    setWorkspaces(await listContextWorkspaces(bootstrap.context));
    setUserWorkspaces(await listUserWorkspaces(bootstrap.context));
    setStatus(`Deleted browser-local workspace ${target.name}`);
  }

  async function renameWorkspace(target: WorkspaceRecord) {
    const requested = await dialogs.askText(
      "Rename workspace",
      target.name,
      "This changes the browser-local workspace name and logical workspace folder. OMERO object and attachment names are unchanged."
    );
    if (requested == null) return;
    const name = normalizeWorkspaceName(requested);
    if (!name) {
      setStatus("Workspace name cannot be empty");
      return;
    }
    if (name === target.name) return;
    const siblings = await listContextWorkspaces(bootstrap.context);
    if (siblings.some((item) =>
      item.id !== target.id &&
      item.name.toLocaleLowerCase() === name.toLocaleLowerCase()
    )) {
      setStatus(`A workspace named ${name} already exists for this OMERO object`);
      return;
    }
    const current = workspaceRef.current;
    const targetWorkspace = current?.workspace.id === target.id
      ? current
      : await loadWorkspace(target.id);
    if (!targetWorkspace) {
      setStatus("The browser-local workspace could not be loaded");
      return;
    }
    const renamed = renameAnalysisWorkspace(targetWorkspace, name, now());
    if (siblings.some((item) =>
      item.id !== target.id &&
      item.rootPath.toLocaleLowerCase() === renamed.workspace.rootPath.toLocaleLowerCase()
    )) {
      setStatus(`The workspace folder ${renamed.workspace.rootPath} already exists`);
      return;
    }
    await saveWorkspace(renamed);
    if (current?.workspace.id === target.id) {
      workspaceRef.current = renamed;
      setWorkspace(renamed);
    }
    setWorkspaces(await listContextWorkspaces(bootstrap.context));
    setUserWorkspaces(await listUserWorkspaces(bootstrap.context));
    setStatus(`Renamed workspace to ${name}`);
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
    if (!analysisWorkspace || analysisWorkspace.chats.filter((item) => !item.archived).length <= 1) {
      setStatus("Create another chat before archiving this one");
      return;
    }
    const archived = { ...chat, archived: true, updatedAt: now() };
    const fallback = analysisWorkspace.chats.find((item) => item.id !== chat.id && !item.archived)!;
    updateChat(archived);
    updateWorkspaceRecord({ ...analysisWorkspace.workspace, activeChatId: fallback.id, updatedAt: now() });
  }

  async function switchWorkspace(workspaceId: string) {
    const selected = await loadWorkspace(workspaceId);
    if (!selected) return;
    const prepared = await prepareInputs(selected);
    setWorkspace(prepared);
    workspaceRef.current = prepared;
    setSelectedWorkspaceId(workspaceId);
    setBrowserAtParent(false);
    setSelectedMethodIds(new Set());
    setSelectedPipelineIds(new Set());
    await restartRuntime(prepared.files, "Workspace loaded");
  }

  async function resolveZarrTarget(
    storeUuid: string
  ): Promise<{ binding: ZarrBinding; capability: ZarrViewerCapability }> {
    const current = workspaceRef.current;
    const viewer = zarrViewerStatus;
    const context = bootstrap.context;
    if (!current || !context || !viewer?.available || !viewer.version) {
      throw new Error(zarrViewerWarning || "OMERO ZarrViewer 0.3 or newer is unavailable");
    }

    const candidates = zarrCandidates(context, hierarchy);
    if (!candidates.length) {
      throw new Error(
        "No compatible OMERO Image or Plate is available in the current object hierarchy"
      );
    }
    const cachedBinding = current.workspace.zarrBindings?.[storeUuid];
    const cachedCandidate = cachedBinding && cachedBinding.groupId === context.group_id
      ? candidates.find(
        (candidate) =>
          candidate.type === cachedBinding.objectType &&
          candidate.id === cachedBinding.objectId
      )
      : undefined;
    if (cachedCandidate) {
      try {
        const cacheKey = `${cachedCandidate.type}:${cachedCandidate.id}`;
        const capability = zarrCapabilities.current.get(cacheKey) ||
          await fetchZarrCapability(viewer, cachedCandidate);
        zarrCapabilities.current.set(cacheKey, capability);
        if (capability.store.uuid === storeUuid) {
          const binding = zarrBinding(
            capability,
            cachedCandidate,
            context.group_id,
            viewer.version
          );
          return { binding, capability };
        }
      } catch {
        // A stale or inaccessible binding is re-discovered below.
      }
    }

    let candidatesToProbe = candidates;
    if (candidates.length > 50) {
      const selected = await dialogs.choose(
        "Choose the OME-Zarr source",
        candidates.map((candidate) => ({
          value: `${candidate.type}:${candidate.id}`,
          label: candidate.name,
          description: `${candidate.type} ${candidate.id}`
        })),
        "This object contains many possible Zarr sources. Choose the source whose UUID should match the measurement database."
      );
      if (!selected) throw new Error("OME-Zarr source selection was cancelled");
      candidatesToProbe = candidates.filter(
        (candidate) => `${candidate.type}:${candidate.id}` === selected
      );
    }

    const matches: Array<{
      candidate: (typeof candidatesToProbe)[number];
      capability: ZarrViewerCapability;
    }> = [];
    for (let offset = 0; offset < candidatesToProbe.length; offset += 4) {
      const batch = candidatesToProbe.slice(offset, offset + 4);
      const settled = await Promise.allSettled(batch.map(async (candidate) => {
        const cacheKey = `${candidate.type}:${candidate.id}`;
        const capability = zarrCapabilities.current.get(cacheKey) ||
          await fetchZarrCapability(viewer, candidate);
        zarrCapabilities.current.set(cacheKey, capability);
        return { candidate, capability };
      }));
      for (const result of settled) {
        if (
          result.status === "fulfilled" &&
          result.value.capability.store.uuid === storeUuid
        ) {
          matches.push(result.value);
        }
      }
    }
    if (!matches.length) {
      throw new Error(
        `No accessible OME-Zarr source in the current OMERO hierarchy has store UUID ${storeUuid}`
      );
    }

    let selectedMatch = matches[0];
    if (matches.length > 1) {
      const selected = await dialogs.choose(
        "Choose the matching OME-Zarr source",
        matches.map(({ candidate }) => ({
          value: `${candidate.type}:${candidate.id}`,
          label: candidate.name,
          description: `${candidate.type} ${candidate.id}`
        })),
        "Multiple accessible OMERO objects point to the same OME-Zarr store."
      );
      if (!selected) throw new Error("OME-Zarr source selection was cancelled");
      selectedMatch = matches.find(
        ({ candidate }) => `${candidate.type}:${candidate.id}` === selected
      ) || matches[0];
    }

    const binding = zarrBinding(
      selectedMatch.capability,
      selectedMatch.candidate,
      context.group_id,
      viewer.version
    );
    updateWorkspaceRecord({
      ...workspaceRef.current!.workspace,
      zarrBindings: {
        ...(workspaceRef.current!.workspace.zarrBindings || {}),
        [storeUuid]: binding
      },
      updatedAt: now()
    });
    return { binding, capability: selectedMatch.capability };
  }

  async function createZarrViewerResult(
    args: Record<string, unknown>,
    chatId: string,
    promptId: string,
    includePreview: boolean
  ): Promise<string> {
    const current = workspaceRef.current;
    const viewer = zarrViewerStatus;
    if (!current || !viewer?.available) {
      throw new Error(zarrViewerWarning || "OMERO ZarrViewer is unavailable");
    }
    const focus = zarrFocusFromToolArgs(args);
    const currentLedger = currentEvidence(
      current.evidence,
      chatId,
      workspaceInputHashes(current),
      turnWorkflowSkills.current.map((skill) => skill.sha256)
    );
    requireEvidenceIds(focus.evidenceIds, currentLedger);
    const { binding, capability } = await resolveZarrTarget(focus.storeUuid);
    const viewerUrl = zarrViewerUrl(viewer, capability, focus);
    const viewerMetadata = zarrProvenance(binding, focus, viewerUrl);
    let createdFile: WorkspaceFile | undefined;

    if (includePreview) {
      const data = await renderZarrPreview(capability, focus);
      if (workspaceBytes(workspaceRef.current) + data.byteLength > MAX_WORKSPACE_BYTES) {
        throw new Error("The rendered preview would exceed the 512 MiB workspace limit");
      }
      const filename = `${slug(focus.title)}.png`;
      createdFile = {
        id: id(),
        workspaceId: current.workspace.id,
        chatId,
        name: filename,
        logicalPath: `${current.workspace.rootPath}/chats/${chatId}/outputs/zarr/${filename}`,
        type: "image/png",
        size: data.byteLength,
        sha256: await sha256(data),
        source: "result",
        state: "ready",
        data,
        viewer: viewerMetadata,
        createdAt: now()
      };
      upsertFiles([createdFile]);
    }

    const artifact: ArtifactRecord = {
      id: id(),
      workspaceId: current.workspace.id,
      chatId,
      fileId: createdFile?.id,
      kind: "viewer-preview",
      title: focus.title,
      pinned: false,
      promptId,
      viewer: viewerMetadata,
      createdAt: now()
    };
    upsertArtifacts([artifact]);
    appendMessage(chatId, {
      id: id(),
      role: "assistant",
      content: includePreview
        ? `Rendered ${focus.title} locally from the matching OME-Zarr source.`
        : `Prepared a validated ZarrViewer link for ${focus.title}.`,
      kind: "viewer-preview",
      artifactId: artifact.id,
      activity: "worked",
      createdAt: now()
    });
    if (createdFile) setSelectedArtifactFileId(createdFile.id);
    const renderEvidenceId = id();
    const sourceHashes = workspaceInputHashes(current);
    const skillHashes = turnWorkflowSkills.current.map((skill) => skill.sha256);
    upsertEvidence({
      id: renderEvidenceId,
      workspaceId: current.workspace.id,
      chatId,
      promptId,
      kind: "render",
      status: "success",
      sourceHashes,
      skillHashes,
      sourceSkillKey: sourceSkillKey(sourceHashes, skillHashes),
      summary: `${includePreview ? "Rendered" : "Opened"} ${focus.title} from evidence ${focus.evidenceIds.join(", ")}`,
      payload: boundedEvidencePayload(viewerMetadata),
      createdAt: now()
    });
    return JSON.stringify({
      ok: true,
      artifact_id: artifact.id,
      render_evidence_id: renderEvidenceId,
      cited_evidence_ids: focus.evidenceIds,
      preview_created: Boolean(createdFile),
      field: focus.field,
      roi: focus.roi,
      cropped_field_preview: focus.croppedField
    });
  }

  async function createZarrGalleryResult(
    args: Record<string, unknown>,
    chatId: string,
    promptId: string,
    origin: ExecutionOrigin = {}
  ): Promise<string> {
    const current = workspaceRef.current;
    if (!current || !zarrViewerStatus?.available) {
      throw new Error(zarrViewerWarning || "OMERO ZarrViewer is unavailable");
    }
    const { recipe, evidenceIds } = zarrRecipeFromToolArgs(args);
    const ledger = currentEvidence(
      current.evidence,
      chatId,
      workspaceInputHashes(current),
      turnWorkflowSkills.current.map((skill) => skill.sha256)
    );
    requireGalleryEvidence(args, evidenceIds, ledger);
    const { binding, capability } = await resolveZarrTarget(recipe.storeUuid);
    const data = await renderZarrRecipe(capability, recipe);
    if (workspaceBytes(workspaceRef.current) + data.byteLength > MAX_WORKSPACE_BYTES) {
      throw new Error("The rendered gallery would exceed the 512 MiB workspace limit");
    }
    const filename = `${slug(recipe.filename || recipe.title || "zarr-gallery").replace(/-png$/, "")}.png`;
    const viewerMetadata = zarrGalleryProvenance(binding, recipe, evidenceIds);
    const file: WorkspaceFile = {
      id: id(),
      workspaceId: current.workspace.id,
      chatId,
      ...origin,
      name: filename,
      logicalPath: `${current.workspace.rootPath}/${
        origin.pipelineId ? "Pipelines" : origin.methodId ? "Methods" : "Chat"
      }/Results/zarr/${filename}`,
      type: "image/png",
      size: data.byteLength,
      sha256: await sha256(data),
      source: "result",
      state: "ready",
      data,
      viewer: viewerMetadata,
      createdAt: now()
    };
    upsertFiles([file]);
    const artifact: ArtifactRecord = {
      id: id(),
      workspaceId: current.workspace.id,
      chatId,
      fileId: file.id,
      kind: "viewer-preview",
      title: recipe.title || "OME-Zarr gallery",
      pinned: false,
      promptId,
      viewer: viewerMetadata,
      createdAt: now()
    };
    upsertArtifacts([artifact]);
    appendMessage(chatId, {
      id: id(),
      role: "assistant",
      content: `Rendered one ${recipe.panels.length}-panel OME-Zarr gallery from verified analysis evidence.`,
      kind: "viewer-preview",
      artifactId: artifact.id,
      activity: "worked",
      createdAt: now()
    });
    setSelectedArtifactFileId(file.id);
    const renderEvidenceId = id();
    const sourceHashes = workspaceInputHashes(current);
    const skillHashes = turnWorkflowSkills.current.map((skill) => skill.sha256);
    upsertEvidence({
      id: renderEvidenceId,
      workspaceId: current.workspace.id,
      chatId,
      promptId,
      kind: "render",
      status: "success",
      sourceHashes,
      skillHashes,
      sourceSkillKey: sourceSkillKey(sourceHashes, skillHashes),
      summary: `Rendered ${recipe.panels.length}-panel gallery from evidence ${evidenceIds.join(", ")}`,
      payload: boundedEvidencePayload({ recipe, fileId: file.id, sha256: file.sha256 }),
      createdAt: now()
    });
    return JSON.stringify({
      ok: true,
      artifact_id: artifact.id,
      file_id: file.id,
      panel_count: recipe.panels.length,
      render_evidence_id: renderEvidenceId,
      cited_evidence_ids: evidenceIds
    });
  }

  async function replaySavedGallery(
    executionResult: string,
    chatId: string,
    promptId: string,
    scriptName: string,
    recipe?: ZarrRenderRecipe,
    origin: ExecutionOrigin = {}
  ): Promise<string | null> {
    const request = savedGalleryRequest(
      executionResult,
      scriptName,
      recipe
    );
    if (!request) return null;
    return createZarrGalleryResult(request, chatId, promptId, origin);
  }

  async function executeSavedMethodVersion(
    method: MethodRecord,
    version: MethodVersion,
    code: string,
    chatId: string,
    promptId: string,
    origin: ExecutionOrigin = {}
  ): Promise<{ executionResult: string; renderResult: string | null }> {
    const executionResult = await executeCode(
      code,
      chatId,
      promptId,
      true,
      "method",
      origin
    );
    const renderResult = await replaySavedGallery(
      executionResult,
      chatId,
      promptId,
      method.name,
      version.renderRecipe,
      origin
    );
    return { executionResult, renderResult };
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
    purpose: ExecutionPurpose = "analysis",
    origin: ExecutionOrigin = {}
  ): Promise<string> {
    const current = workspaceRef.current;
    if (!current) return toolErrorText("Workspace is not ready");
    const startedAt = performance.now();
    const normalizedCode = code.replace(/\r\n/g, "\n").trimEnd();
    const codeHash = await sha256(normalizedCode);
    const inputHashes = workspaceInputHashes(current);
    const skillHashes = turnWorkflowSkills.current
      .map((skill) => skill.sha256)
      .sort();
    const cacheKey = await sha256(
      `${codeHash}|${inputHashes.join(",")}|${skillHashes.join(",")}|` +
      `${RUNTIME_VERSION}|plotCsv=${current.workspace.plotCsv}`
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
          : "Skipped unchanged Python that already failed; the AI provider must correct the code.",
        kind: "execution",
        executionId: reused.id,
        createdAt: now()
      });
      if (reused.status === "reused") {
        let evidenceId = previous.evidenceId;
        if (!evidenceId) {
          evidenceId = id();
          upsertEvidence({
            id: evidenceId,
            workspaceId: current.workspace.id,
            chatId,
            promptId,
            kind: evidenceKind(previous.code),
            status: "success",
            sourceHashes: inputHashes,
            skillHashes,
            sourceSkillKey: sourceSkillKey(inputHashes, skillHashes),
            executionId: previous.id,
            summary: `Reused verified execution ${previous.id}`,
            payload: boundedEvidencePayload({
              stdout: previous.stdout,
              preview: previous.preview,
              outputFileIds: previous.outputFileIds
            }),
            createdAt: now()
          });
        }
        return JSON.stringify({
          reused: true,
          execution_id: previous.id,
          evidence_id: evidenceId,
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
      workspaceId: current.workspace.id,
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
      const evidenceId = id();
      const failed = {
        ...execution,
        status: "failed" as const,
        stderr: detail,
        evidenceId,
        durationMs: performance.now() - startedAt
      };
      upsertExecution(failed);
      upsertEvidence({
        id: evidenceId,
        workspaceId: current.workspace.id,
        chatId,
        promptId,
        kind: "failed-approah",
        status: "failed",
        sourceHashes: inputHashes,
        skillHashes,
        sourceSkillKey: sourceSkillKey(inputHashes, skillHashes),
        executionId: execution.id,
        summary: detail.slice(0, 300),
        payload: boundedEvidencePayload({ code: normalizedCode, error: detail }),
        createdAt: now()
      });
      setStatus("Python error sent to the AI provider; waiting for corrected code…");
      setAnalysisPhase("repairing");
      return toolErrorText(error);
    }

    const generated: WorkspaceFile[] = [];
    for (const file of output.files) {
      const fileId = id();
      generated.push({
        id: fileId,
        workspaceId: current.workspace.id,
        chatId,
        ...origin,
        executionId: execution.id,
        name: file.name,
        logicalPath: `${current.workspace.rootPath}/${
          origin.pipelineId ? "Pipelines" : origin.methodId ? "Methods" : "Chat"
        }/Results/${execution.id}/${file.name}`,
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
      workspaceId: current.workspace.id,
      chatId,
      executionId: execution.id,
      fileId: file.id,
      kind: file.type.startsWith("image/") ? "plot" : "file",
      title: file.name,
      pinned: false,
      createdAt: now()
    })));

    const missing = current.workspace.plotCsv
      ? Array.from(turnOutputNames.current)
        .filter((name) => /\.(png|svg)$/i.test(name))
        .filter((name) => !turnOutputNames.current.has(name.replace(/\.(png|svg)$/i, ".csv")))
      : [];
    const evidenceId = id();
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
      evidenceId,
      durationMs: performance.now() - startedAt
    };
    upsertExecution(completed);
    upsertEvidence({
      id: evidenceId,
      workspaceId: current.workspace.id,
      chatId,
      promptId,
      kind: evidenceKind(normalizedCode),
      status: "success",
      sourceHashes: inputHashes,
      skillHashes,
      sourceSkillKey: sourceSkillKey(inputHashes, skillHashes),
      executionId: execution.id,
      summary: `Successful ${purpose} execution; preview and generated-file metadata are reusable`,
      payload: boundedEvidencePayload({
        stdout: output.stdout,
        preview: output.preview,
        generatedFiles: generated.map((file) => ({
          id: file.id,
          name: file.name,
          sha256: file.sha256,
          size: file.size,
          type: file.type
        }))
      }),
      createdAt: now()
    });
    const modelPayloadText = JSON.stringify(output.modelPayload);
    upsertAudit({
      id: id(),
      workspaceId: current.workspace.id,
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
    return JSON.stringify({
      ok: true,
      evidence_id: evidenceId,
      execution_id: execution.id,
      ...output.modelPayload
    }).slice(0, MAX_TOOL_TEXT);
  }

  async function executeTool(call: ToolCall, chatId: string, promptId: string): Promise<string> {
    let args: Record<string, any> = {};
    try {
      args = JSON.parse(call.function.arguments || "{}");
    } catch (error) {
      return toolErrorText(`Invalid JSON tool arguments: ${String(error)}`);
    }
    const current = workspaceRef.current;
    if (!current) return toolErrorText("Workspace is not ready");
    if (call.function.name === "discover_skills") {
      const catalog = workflowSkillCatalogRef.current;
      if (!catalog) {
        return toolErrorText(
          workflowSkillWarning || "No pipeline skill catalog is available"
        );
      }
      const matchedWorkflowSkills = matchWorkflowSkills(
        catalog,
        current.files,
        profiles
      ).map((match) => ({
          workflow_key: workflowSkillSourceKey(match.entry),
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
        }));
      const applicationSkills = (catalog.applications || []).flatMap((entry) =>
        entry.skills.map((skill) => ({
          workflow_key: workflowSkillSourceKey(entry),
          name: skill.name,
          description: skill.description,
          purpose: skill.purpose,
          version: skill.version,
          score: 0,
          reasons: [
            "Optional application operation; load only when the user explicitly asks to show, open, or render compatible data."
          ],
          references_are_progressive: true,
          source: {
            repository_url: entry.source.repository_url,
            configured_ref: entry.source.configured_ref,
            resolved_commit: entry.source.resolved_commit,
            sha256: skill.sha256,
            status: entry.status
          }
        }))
      );
      return JSON.stringify([...matchedWorkflowSkills, ...applicationSkills])
        .slice(0, MAX_TOOL_TEXT);
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
        const provenance = skillProvenance(skill);
        if (!turnWorkflowSkills.current.some(
          (item) =>
            item.workflowKey === provenance.workflowKey &&
            item.name === provenance.name &&
            item.sha256 === provenance.sha256
        )) {
          turnWorkflowSkills.current = [...turnWorkflowSkills.current, provenance];
        }
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
    if (
      call.function.name === "open_zarr_view" ||
      call.function.name === "render_zarr_roi" ||
      call.function.name === "render_zarr_gallery"
    ) {
      try {
        if (call.function.name === "render_zarr_gallery") {
          return await createZarrGalleryResult(args, chatId, promptId);
        }
        return await createZarrViewerResult(
          args,
          chatId,
          promptId,
          call.function.name === "render_zarr_roi"
        );
      } catch (error) {
        setStatus(`ZarrViewer request needs correction: ${String(error)}`);
        setAnalysisPhase("repairing");
        return JSON.stringify({
          ok: false,
          recoverable: true,
          error: String(error instanceof Error ? error.message : error),
          instruction:
            "Inspect the measurement database again and correct the UUID, field, dimensions, coordinates, channels, or label information. Do not invent an OMERO ID or URL."
        }).slice(0, MAX_TOOL_TEXT);
      }
    }
    if (call.function.name === "list_workspace_files") return listFiles(current.files);
    if (call.function.name === "reset_python") {
      try {
        await runtime.beginTurn();
        turnOutputNames.current.clear();
        return "Python state reset; canonical workspace inputs remain available.";
      } catch (error) {
        return toolErrorText(error);
      }
    }
    if (call.function.name === "list_saved_methods") {
      return JSON.stringify(current.methods.filter((method) => !method.deletedAt).map((method) => ({
        id: method.id,
        name: method.name,
        description: method.description,
        current_version: method.currentVersion,
        updated_at: method.updatedAt
      })));
    }
    if (call.function.name === "read_saved_method") {
      const method = current.methods.find((item) => item.id === args.method_id && !item.deletedAt);
      if (!method) return toolErrorText("Saved method was not found");
      const version = method.versions.find((item) => item.version === method.currentVersion);
      return version
        ? JSON.stringify({ id: method.id, name: method.name, version: version.version, code: version.code })
        : toolErrorText("Saved method has no readable current version");
    }
    if (call.function.name === "run_saved_method") {
      const method = current.methods.find((item) => item.id === args.method_id && !item.deletedAt);
      const version = method?.versions.find((item) => item.version === method.currentVersion);
      if (!method || !version) return toolErrorText("Saved method was not found");
      try {
        const bound = bindMethodInputs(version.code, current.files);
        const { executionResult, renderResult } = await executeSavedMethodVersion(
          method,
          version,
          bound.code,
          chatId,
          promptId
        );
        return JSON.stringify({
          execution: JSON.parse(executionResult),
          render_replayed: Boolean(renderResult),
          render: renderResult ? JSON.parse(renderResult) : undefined
        }).slice(0, MAX_TOOL_TEXT);
      } catch (error) {
        return toolErrorText(error);
      }
    }
    if (call.function.name === "list_saved_pipelines") {
      return JSON.stringify(current.pipelines.filter((pipeline) => !pipeline.deletedAt).map((pipeline) => ({
        id: pipeline.id,
        name: pipeline.name,
        description: pipeline.description,
        version: pipeline.version,
        steps: pipeline.steps.map((step) => step.name)
      })));
    }
    if (call.function.name === "run_saved_pipeline") {
      const pipeline = current.pipelines.find(
        (item) => item.id === args.pipeline_id && !item.deletedAt
      );
      if (!pipeline) return toolErrorText("Saved pipeline was not found");
      const results: string[] = [];
      let renders = 0;
      for (const step of pipeline.steps) {
        const latest = workspaceRef.current!;
        const method = latest.methods.find((item) => item.id === step.methodId && !item.deletedAt);
        const version = method?.versions.find((item) => item.version === step.methodVersion);
        if (!method || !version) return toolErrorText(`Pipeline step ${step.name} is unavailable`);
        try {
          await runtime.beginTurn();
          const bound = bindMethodInputs(version.code, latest.files);
          const outcome = await executeSavedMethodVersion(
            method,
            version,
            bound.code,
            chatId,
            promptId
          );
          results.push(outcome.executionResult);
          if (outcome.renderResult) renders += 1;
        } catch (error) {
          return toolErrorText(`Pipeline step ${step.name} failed: ${String(error)}`);
        }
      }
      return JSON.stringify({
        pipeline: pipeline.name,
        steps: pipeline.steps.length,
        renders,
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
    const chat = current?.chats.find((item) => item.id === current.workspace.activeChatId);
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
    const activeSkillPackages: WorkflowSkillPackage[] = [];
    let activeSkillWarning = "";
    const visualIntent =
      /\b(show|render|view|open|gallery|montage|image|field|well|contour|mask|overlay|png)\b/i.test(text);
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
        activeSkillPackages.push(skill);
      } catch (error) {
        activeSkillWarning =
          `Measurement-specific guidance unavailable: ${String(error)}`;
      }
    }
    if (visualIntent && zarrViewerStatus?.available) {
      try {
        const skill = await bridge.loadZarrViewerSkill();
        if (!activeSkillPackages.some((item) => item.skill.sha256 === skill.skill.sha256)) {
          activeSkillPackages.push(skill);
        }
      } catch (error) {
        activeSkillWarning = [
          activeSkillWarning,
          `ZarrViewer operation guidance unavailable: ${String(error)}`
        ].filter(Boolean).join(" ");
      }
    }
    turnWorkflowSkills.current = activeSkillPackages.map(skillProvenance);
    const activeSkillInstructions = activeSkillPackages.map((skill) => {
      const base = packageInstructions(skill);
      if (!visualIntent) return base;
      const pngQuestions = skill.files.find((file) =>
        /(^|\/)PNG_QUESTIONS\.md$/i.test(file.path)
      );
      return pngQuestions
        ? `${base}\n\nPNG question and rendering reference ${pngQuestions.path}:\n${pngQuestions.content}`
        : base;
    }).join("\n\n---\n\n");
    const sourceHashes = workspaceInputHashes(current);
    const skillHashes = turnWorkflowSkills.current.map((skill) => skill.sha256).sort();
    const ledger = currentEvidence(current.evidence, chat.id, sourceHashes, skillHashes);
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

Workspace root: ${current.workspace.rootPath}
Exact current workspace files (already discovered; do not call list_workspace_files):
${listFiles(current.files)}

${evidencePrompt(ledger)}

The user has ${current.methods.filter((method) => !method.deletedAt).length} saved methods. ${
  current.workspace.plotCsv
    ? "Plot CSV mode is ON: every PNG or SVG must have a same-stem CSV containing its plotted data."
    : "Plot CSV mode is OFF."
}
${zarrViewerStatus?.available
  ? `OMERO ZarrViewer ${zarrViewerStatus.version} is available. Use its tools only for an explicit request to show, open, or render an image, field, object, or focus; derive every navigation value from the measurement database.`
  : `OMERO ZarrViewer tools are unavailable in this deployment. ${zarrViewerWarning}`}

${activeSkillInstructions || (
  activeSkillWarning || workflowSkillWarning
    ? `No specialized pipeline skill was loaded. ${activeSkillWarning || workflowSkillWarning}`
    : "No compatible specialized pipeline skill matched; use generic schema-first analysis."
)}

Efficiency contract: answer an initial most-foci request within four tool rounds and a follow-up
render within two tool rounds. Do not repeat schema discovery while the listed source and skill
hashes are unchanged. Reuse matching evidence IDs and verified rows from the ledger.`;
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
      const availableTools = [
        ...TOOLS.filter((tool) =>
          tool.function.name !== "discover_skills" &&
          tool.function.name !== "list_workspace_files"
        ),
        ...(zarrViewerStatus?.available ? ZARR_VIEWER_TOOLS : [])
      ];
      for (let turn = 0; turn <= MAX_TOOL_ROUNDS; turn += 1) {
        const policy = chatRoundPolicy(turn, availableTools);
        if (policy.finalSynthesis) {
          conversation.push({
            role: "system",
            content: FINAL_SYNTHESIS_INSTRUCTION
          });
          setAnalysisPhase("checking");
        }
        const estimatedPrompt = estimateTokens(conversation);
        const responseStartedAt = performance.now();
        const response = await completeChat(
          settings,
          conversation,
          abort.current.signal,
          (partial) => setStreamingText(partial),
          policy.tools
        );
        const answer = response.choices[0]?.message;
        if (!answer) throw new Error("The AI provider returned no response");
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
        if (policy.finalSynthesis) {
          throw new Error("The AI provider attempted another tool call during final synthesis");
        }
        usedTools = true;
        setAnalysisPhase(turn ? "repairing" : "running");
        for (const call of answer.tool_calls) {
          const result = await executeTool(call, chat.id, promptId);
          conversation.push({ role: "tool", tool_call_id: call.id, content: result });
        }
        setAnalysisPhase("checking");
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

  async function saveAsMethod(execution: ExecutionRecord) {
    const current = workspaceRef.current;
    if (
      !current ||
      execution.purpose === "inspection" ||
      executionPreparesViewer(current, execution) ||
      !["success", "reused"].includes(execution.status)
    ) return;
    const chat = current.chats.find((item) => item.id === execution.chatId);
    const promptMessage = chat?.messages.find((message) => message.id === execution.promptId);
    const successful = current.executions
      .filter((item) =>
        item.chatId === execution.chatId &&
        item.promptId === execution.promptId &&
        ["success", "reused"].includes(item.status)
      )
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const related = successful.filter((item) =>
      item.purpose !== "inspection" &&
      !executionPreparesViewer(current, item)
    );
    const scriptCode = Array.from(new Set(related.map((item) => item.code))).join(
      "\n\n# Continued analysis / automatic repair\n"
    ) || execution.code;
    const scriptHash = await sha256(scriptCode);
    const suggestedTitle = visualSaveTitle(
      current.artifacts,
      current.files,
      {
        chatId: execution.chatId,
        promptId: execution.promptId,
        executionIds: related.map((item) => item.id)
      }
    ) || titleFromPrompt(promptMessage?.content || "Analysis method");
    const suggested = `${slug(suggestedTitle)}-analysis.py`;
    const name = (await dialogs.askText(
      "Method filename",
      suggested,
      "Methods are versioned and can be copied to compatible OMERO workspaces."
    ))?.trim();
    if (!name) return;
    const safeName = `${slug(name.replace(/\.py$/i, ""))}.py`;
    const description = (await dialogs.askText(
      "Method title",
      suggestedTitle,
      "Suggested from the generated graph or image title."
    ))?.trim() || "";
    const existing = current.methods.find((method) =>
      !method.deletedAt && method.name.toLowerCase() === safeName.toLowerCase()
    );
    const requiredCapabilities = current.artifacts.some((artifact) =>
      artifact.chatId === execution.chatId &&
      artifact.promptId === execution.promptId &&
      Boolean(artifact.viewer)
    ) || /(?:store_uuid|render_panels|zarrviewer|ome[-_.]?zarr)/i.test(scriptCode)
      ? ["zarrviewer"]
      : [];
    const method: MethodRecord = existing
      ? {
        ...existing,
        description,
        requiredCapabilities,
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
        workspaceId: current.workspace.id,
        name: safeName,
        description,
        requiredCapabilities,
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
    method.inputContract = inputContractFromCode(scriptCode);
    const latest = workspaceRef.current;
    if (latest) {
      const updated = {
        ...latest,
        methods: existing
          ? latest.methods.map((item) => item.id === method.id ? method : item)
          : [...latest.methods, method]
      };
      workspaceRef.current = updated;
      setWorkspace(updated);
    }
    await saveMethod(method);
    setStatus(`Saved ${method.name} version ${method.currentVersion}`);
  }

  async function saveAnalysisRender(artifact: ArtifactRecord, png: WorkspaceFile) {
    const current = workspaceRef.current;
    if (!current) return;
    try {
      const bundle = buildRenderBundle(artifact, png, current.executions, current.evidence);
      const suggestedTitle = visualSaveTitle(
        [artifact],
        [png],
        {
          chatId: artifact.chatId,
          promptId: artifact.promptId
        }
      ) || artifact.title || png.name.replace(/\.png$/i, "") || "Zarr render";
      const requestedName = (await dialogs.askText(
        "Method filename",
        `${slug(suggestedTitle)}-analysis.py`,
        "The analysis, render recipe, PNG, and provenance will be saved together."
      ))?.trim();
      if (!requestedName) return;
      const scriptName = `${slug(requestedName.replace(/\.py$/i, ""))}.py`;
      const scriptTitle = (await dialogs.askText(
        "Method title",
        suggestedTitle,
        "Suggested from the rendered image or gallery title."
      ))?.trim();
      if (!scriptTitle) return;
      const base = slug(scriptName.replace(/\.py$/i, "").replace(/-analysis$/i, ""));
      const existing = current.methods.find((item) =>
        !item.deletedAt && item.name.toLowerCase() === scriptName.toLowerCase()
      );
      const version = (existing?.currentVersion || 0) + 1;
      const codeHash = await sha256(bundle.code);
      const method: MethodRecord = existing
        ? {
          ...existing,
          description: scriptTitle,
          currentVersion: version,
          inputContract: inputContractFromCode(bundle.code),
          versions: [...existing.versions, {
            version,
            code: bundle.code,
            codeHash,
            executionId: bundle.execution.id,
            renderRecipe: bundle.recipe,
            createdAt: now()
          }],
          updatedAt: now()
        }
        : {
          id: id(),
          workspaceId: current.workspace.id,
          name: scriptName,
          description: scriptTitle,
          currentVersion: version,
          inputContract: inputContractFromCode(bundle.code),
          parameters: [],
          versions: [{
            version,
            code: bundle.code,
            codeHash,
            executionId: bundle.execution.id,
            renderRecipe: bundle.recipe,
            createdAt: now()
          }],
          createdAt: now(),
          updatedAt: now()
        };
      const recipeBytes = new TextEncoder().encode(`${JSON.stringify(bundle.recipe, null, 2)}\n`);
      const manifestBytes = new TextEncoder().encode(`${JSON.stringify(bundle.manifest, null, 2)}\n`);
      const componentSpecs = [
        {
          name: `${base}-v${version}-render-recipe.json`,
          type: "application/json",
          data: recipeBytes
        },
        {
          name: `${base}-v${version}-evidence-manifest.json`,
          type: "application/json",
          data: manifestBytes
        },
        {
          name: `${base}-v${version}.zip`,
          type: "application/zip",
          data: bundle.archive
        }
      ];
      const files: WorkspaceFile[] = [];
      for (const item of componentSpecs) {
        const data = item.data.buffer.slice(
          item.data.byteOffset,
          item.data.byteOffset + item.data.byteLength
        ) as ArrayBuffer;
        files.push({
          id: id(),
          workspaceId: current.workspace.id,
          chatId: artifact.chatId,
          name: item.name,
          logicalPath: `${current.workspace.rootPath}/chats/${artifact.chatId}/outputs/render-bundles/${item.name}`,
          type: item.type,
          size: item.data.byteLength,
          sha256: await sha256(data),
          source: "result",
          state: "ready",
          data,
          createdAt: now()
        });
      }
      const latest = workspaceRef.current;
      if (!latest) return;
      const updated = {
        ...latest,
        methods: existing
          ? latest.methods.map((item) => item.id === method.id ? method : item)
          : [...latest.methods, method]
      };
      workspaceRef.current = updated;
      setWorkspace(updated);
      await saveMethod(method);
      upsertFiles(files);
      downloadBytes(`${base}-v${version}.zip`, bundle.archive, "application/zip");
      setStatus(
        `Saved ${method.name} version ${version}, render recipe, provenance manifest, PNG, and downloadable ZIP`
      );
    } catch (error) {
      setStatus(`Could not save analysis + render: ${String(error)}`);
    }
  }

  async function runMethod(method: MethodRecord) {
    const current = workspaceRef.current;
    if (!current?.workspace.activeChatId) return;
    setActiveTab("chat");
    const version = method.versions.find((item) => item.version === method.currentVersion);
    if (!version) return;
    let bound: ReturnType<typeof bindMethodInputs>;
    try {
      bound = bindMethodInputs(version.code, current.files);
    } catch (error) {
      setStatus(`Cannot bind ${method.name}: ${String(error)}`);
      return;
    }
    setBusy(true);
    turnOutputNames.current.clear();
    await runtime.beginTurn();
    const promptId = id();
    appendMessage(current.workspace.activeChatId, {
      id: promptId,
      role: "user",
      content: `Run saved method ${method.name} version ${method.currentVersion}` +
        (bound.bindings.length
          ? ` with workspace input binding ${bound.bindings.map((item) => `${item.from} → ${item.to}`).join(", ")}`
          : ""),
      createdAt: now()
    });
    try {
      const { renderResult } = await executeSavedMethodVersion(
        method,
        version,
        bound.code,
        current.workspace.activeChatId,
        promptId,
        { methodId: method.id }
      );
      setStatus(
        renderResult
          ? `Ran ${method.name} locally and rendered its PNG gallery`
          : `Ran ${method.name} locally`
      );
    } catch (error) {
      setStatus(`Could not complete ${method.name}: ${String(error)}`);
    } finally {
      setBusy(false);
    }
  }

  async function renameMethod(method: MethodRecord) {
    const name = (await dialogs.askText("Rename method", method.name))?.trim();
    if (!name) return;
    const updated = { ...method, name: `${slug(name.replace(/\.py$/i, ""))}.py`, updatedAt: now() };
    const current = workspaceRef.current;
    if (current) {
      const next = {
        ...current,
        methods: current.methods.map((item) => item.id === method.id ? updated : item)
      };
      workspaceRef.current = next;
      setWorkspace(next);
    }
    void saveMethod(updated);
  }

  async function removeMethod(method: MethodRecord) {
    if (!await dialogs.confirm(
      "Delete saved method?",
      `${method.name} and all of its versions will be moved out of the active workspace.`,
      "Delete method",
      true
    )) {
      return;
    }
    const current = workspaceRef.current;
    if (!current) return;
    const deleted = { ...method, deletedAt: now(), updatedAt: now() };
    const updated = {
      ...current,
      methods: current.methods.map((item) => item.id === method.id ? deleted : item)
    };
    workspaceRef.current = updated;
    setWorkspace(updated);
    setSelectedMethodIds((selected) => {
      const next = new Set(selected);
      next.delete(method.id);
      return next;
    });
    await saveMethod(deleted);
    setStatus(`Moved method ${method.name} to trash`);
  }

  function toggleMethodSelection(methodId: string) {
    setSelectedMethodIds((current) => {
      const next = new Set(current);
      if (next.has(methodId)) next.delete(methodId);
      else next.add(methodId);
      return next;
    });
  }

  function togglePipelineSelection(pipelineId: string) {
    setSelectedPipelineIds((current) => {
      const next = new Set(current);
      if (next.has(pipelineId)) next.delete(pipelineId);
      else next.add(pipelineId);
      return next;
    });
  }

  function toggleOutputSelection(outputId: string) {
    setSelectedOutputIds((current) => {
      const next = new Set(current);
      if (next.has(outputId)) next.delete(outputId);
      else next.add(outputId);
      return next;
    });
  }

  function toggleOutputGroupSelection(files: WorkspaceFile[]) {
    const visibleIds = files.filter((file) => matchesExplorer(file.name)).map((file) => file.id);
    const allSelected = visibleIds.length > 0 &&
      visibleIds.every((outputId) => selectedOutputIds.has(outputId));
    setSelectedOutputIds((current) => {
      const next = new Set(current);
      visibleIds.forEach((outputId) => {
        if (allSelected) next.delete(outputId);
        else next.add(outputId);
      });
      return next;
    });
  }

  async function trashOutputs(outputIds: Iterable<string>) {
    const current = workspaceRef.current;
    if (!current) return;
    const requested = new Set(outputIds);
    const outputs = current.files.filter((file) =>
      requested.has(file.id) &&
      file.source === "result" &&
      !file.deletedAt
    );
    if (!outputs.length) return;
    const names = outputs.slice(0, 5).map((file) => file.name);
    const extra = outputs.length - names.length;
    const description = outputs.length === 1
      ? `${outputs[0].name} will be hidden, while its provenance record remains intact.`
      : [
        `${outputs.length} outputs will be moved to workspace trash. Their provenance records remain intact.`,
        names.join(", ") + (extra > 0 ? `, and ${extra} more` : "")
      ].join("\n\n");
    if (!await dialogs.confirm(
      outputs.length === 1 ? "Move output to trash?" : `Move ${outputs.length} outputs to trash?`,
      description,
      "Move to trash",
      true
    )) return;
    const deletedAt = now();
    const updated = trashWorkspaceOutputs(
      current,
      outputs.map((file) => file.id),
      deletedAt
    );
    workspaceRef.current = updated;
    setWorkspace(updated);
    setSelectedOutputIds((selected) => {
      const next = new Set(selected);
      outputs.forEach((file) => next.delete(file.id));
      return next;
    });
    if (
      selectedArtifactFileId &&
      outputs.some((file) => file.id === selectedArtifactFileId)
    ) {
      setSelectedArtifactFileId(null);
    }
    await Promise.all(
      updated.files
        .filter((file) => requested.has(file.id) && file.deletedAt === deletedAt)
        .map(saveFile)
    );
    setStatus(
      outputs.length === 1
        ? `Moved ${outputs[0].name} to workspace trash`
        : `Moved ${outputs.length} outputs to workspace trash`
    );
  }

  async function combineSelectedMethods() {
    const current = workspaceRef.current;
    if (!current) return;
    const selected = current.methods.filter((method) => !method.deletedAt && selectedMethodIds.has(method.id));
    if (selected.length < 2) {
      setStatus("Select at least two methods to combine");
      return;
    }
    const suggested = slug(selected.map((method) => method.name.replace(/\.py$/i, "")).join("-"));
    const requested = (await dialogs.askText(
      "Pipeline name",
      suggested,
      "The selected methods will become isolated, ordered pipeline steps."
    ))?.trim();
    if (!requested) return;
    const stem = slug(requested);
    let name = stem;
    let suffix = 2;
    while (current.pipelines.some((pipeline) =>
      !pipeline.deletedAt && pipeline.name.toLowerCase() === name.toLowerCase()
    )) {
      name = `${stem}-${suffix}`;
      suffix += 1;
    }
    const description = (await dialogs.askText(
      "Pipeline description",
      `Runs ${selected.map((method) => method.name).join(", ")} in sequence`
    ))?.trim() || "";
    const createdAt = now();
    const pipeline: PipelineRecord = {
      id: id(),
      workspaceId: current.workspace.id,
      name,
      description,
      version: 1,
      steps: selected.map((method) => ({
        id: id(),
        methodId: method.id,
        methodVersion: method.currentVersion,
        name: method.name,
        inputBindings: {},
        parameters: {}
      })),
      createdAt,
      updatedAt: createdAt
    };
    const updated = { ...current, pipelines: [...current.pipelines, pipeline] };
    workspaceRef.current = updated;
    setWorkspace(updated);
    setSelectedMethodIds(new Set());
    await savePipeline(pipeline);
    setStatus(`Created pipeline ${pipeline.name} with ${selected.length} isolated steps`);
  }

  async function runPipeline(pipeline: PipelineRecord) {
    const current = workspaceRef.current;
    if (!current?.workspace.activeChatId || busy) return;
    setActiveTab("chat");
    setBusy(true);
    const workflowStartedAt = performance.now();
    const chatId = current.workspace.activeChatId;
    const promptId = id();
    appendMessage(chatId, {
      id: promptId,
      role: "user",
      content: `Run pipeline ${pipeline.name} version ${pipeline.version}`,
      createdAt: now()
    });
    try {
      let availableInputs = current.files.filter(
        (file) => file.source !== "result" && file.state === "ready" && !file.deletedAt
      );
      let rendered = 0;
      for (let index = 0; index < pipeline.steps.length; index += 1) {
        const step = pipeline.steps[index];
        const latest = workspaceRef.current!;
        const method = latest.methods.find((item) => item.id === step.methodId && !item.deletedAt);
        const version = method?.versions.find((item) => item.version === step.methodVersion);
        if (!method || !version) throw new Error(`Pipeline step ${step.name} is unavailable`);
        setStatus(`Pipeline ${pipeline.name}: step ${index + 1} of ${pipeline.steps.length}`);
        await runtime.beginTurn();
        turnOutputNames.current.clear();
        const bound = bindMethodInputs(version.code, availableInputs);
        const outcome = await executeSavedMethodVersion(
          method,
          version,
          bound.code,
          chatId,
          promptId,
          { methodId: method.id, pipelineId: pipeline.id }
        );
        if (outcome.renderResult) rendered += 1;
        const produced = workspaceRef.current!.files.filter(
          (file) => file.source === "result" && file.executionId &&
            workspaceRef.current!.executions.some(
              (execution) => execution.id === file.executionId && execution.promptId === promptId
            ) && !file.deletedAt
        );
        availableInputs = [...availableInputs, ...produced];
        if (index < pipeline.steps.length - 1) await runtime.syncInputs(availableInputs);
      }
      await runtime.syncInputs(current.files.filter(
        (file) => file.source !== "result" && file.state === "ready" && !file.deletedAt
      ));
      setStatus(
        `Pipeline ${pipeline.name} completed` +
        (rendered ? ` and rendered ${rendered} PNG ${rendered === 1 ? "image" : "images"}` : "")
      );
    } catch (error) {
      appendMessage(chatId, {
        id: id(),
        role: "assistant",
        content: `Pipeline stopped: ${String(error)}`,
        kind: "error",
        activity: "worked",
        durationMs: performance.now() - workflowStartedAt,
        createdAt: now()
      });
      setStatus(`Pipeline ${pipeline.name} failed`);
    } finally {
      setBusy(false);
    }
  }

  async function removePipeline(pipeline: PipelineRecord) {
    if (!await dialogs.confirm(
      "Delete pipeline?",
      `${pipeline.name} will be moved to workspace trash. Its source methods remain available.`,
      "Delete pipeline",
      true
    )) return;
    const current = workspaceRef.current;
    if (!current) return;
    const deleted = { ...pipeline, deletedAt: now(), updatedAt: now() };
    const updated = {
      ...current,
      pipelines: current.pipelines.map((item) => item.id === pipeline.id ? deleted : item)
    };
    workspaceRef.current = updated;
    setWorkspace(updated);
    await savePipeline(deleted);
    setStatus(`Moved pipeline ${pipeline.name} to workspace trash`);
  }

  async function restoreTrashedFile(file: WorkspaceFile) {
    const restored = { ...file, deletedAt: undefined };
    upsertFiles([restored]);
    await saveFile(restored);
    setStatus(`Restored ${file.name}`);
  }

  async function restoreTrashedMethod(method: MethodRecord) {
    const current = workspaceRef.current;
    if (!current) return;
    const restored = { ...method, deletedAt: undefined, updatedAt: now() };
    const next = {
      ...current,
      methods: current.methods.map((item) => item.id === method.id ? restored : item)
    };
    workspaceRef.current = next;
    setWorkspace(next);
    await saveMethod(restored);
  }

  async function restoreTrashedPipeline(pipeline: PipelineRecord) {
    const current = workspaceRef.current;
    if (!current) return;
    const restored = { ...pipeline, deletedAt: undefined, updatedAt: now() };
    const updated = {
      ...current,
      pipelines: current.pipelines.map((item) => item.id === pipeline.id ? restored : item)
    };
    workspaceRef.current = updated;
    setWorkspace(updated);
    await savePipeline(restored);
    setStatus(`Restored pipeline ${pipeline.name}`);
  }

  async function publishPipeline(pipeline: PipelineRecord) {
    const current = workspaceRef.current;
    if (!current || !bridge.canUpload) return;
    const methodIds = new Set(pipeline.steps.map((step) => step.methodId));
    const payload = {
      format: "nl.bioimaging.analysis.pipeline.v1",
      exportedAt: now(),
      pipeline,
      methods: current.methods.filter((method) => !method.deletedAt && methodIds.has(method.id))
    };
    const name = `${slug(pipeline.name)}.oa-pipeline.json`;
    const result = await bridge.uploadPipelineTemplate(
      name,
      new TextEncoder().encode(JSON.stringify(payload, null, 2))
    );
    setPipelineTemplates((values) => [...values, result]);
    setStatus(`Published pipeline template as FileAnnotation ${result.annotation_id}`);
  }

  async function importPipelineTemplate(template: Attachment) {
    const current = workspaceRef.current;
    if (!current) return;
    try {
      const payload = JSON.parse(
        new TextDecoder().decode(await bridge.downloadPipelineTemplate(template))
      );
      if (
        payload.format !== "nl.bioimaging.analysis.pipeline.v1" ||
        !payload.pipeline ||
        !Array.isArray(payload.methods)
      ) throw new Error("Unsupported pipeline template");
      const methodIds = new Map<string, string>();
      const methods: MethodRecord[] = payload.methods.map((method: MethodRecord) => {
        const methodId = id();
        methodIds.set(method.id, methodId);
        return {
          ...method,
          id: methodId,
          workspaceId: current.workspace.id,
          name: `${method.name.replace(/\.py$/i, "")}-template.py`,
          createdAt: now(),
          updatedAt: now()
        };
      });
      const pipeline: PipelineRecord = {
        ...payload.pipeline,
        id: id(),
        workspaceId: current.workspace.id,
        name: `${payload.pipeline.name}-template`,
        steps: payload.pipeline.steps.map((step: PipelineRecord["steps"][number]) => ({
          ...step,
          id: id(),
          methodId: methodIds.get(step.methodId) || step.methodId
        })),
        createdAt: now(),
        updatedAt: now()
      };
      await Promise.all([...methods.map(saveMethod), savePipeline(pipeline)]);
      const updated = {
        ...current,
        methods: [...current.methods, ...methods],
        pipelines: [...current.pipelines, pipeline]
      };
      workspaceRef.current = updated;
      setWorkspace(updated);
      setStatus(`Imported pipeline template ${pipeline.name}`);
    } catch (error) {
      setStatus(`Pipeline template import failed: ${String(error)}`);
    }
  }

  async function batchRunPipeline(pipeline: PipelineRecord) {
    const source = workspaceRef.current;
    if (!source || busy) return;
    const targets = userWorkspaces.filter((item) => item.id !== source.workspace.id);
    if (!targets.length) {
      setStatus("Open the destination OMERO objects in Analysis once before batch execution");
      return;
    }
    if (!await dialogs.confirm(
      "Batch-run pipeline?",
      `${pipeline.name} will run locally on the compatible browser workspaces for: ${targets.map((item) => `${item.objectType} ${item.objectId} (${item.name})`).join(", ")}. Incompatible workspaces will be skipped.`,
      "Run compatible workspaces"
    )) return;
    setBusy(true);
    const completed: string[] = [];
    const skipped: string[] = [];
    try {
      for (const targetRecord of targets) {
        const target = await loadWorkspace(targetRecord.id);
        if (!target) continue;
        const preparedSteps: Array<{
          method: MethodRecord;
          version: MethodVersion;
          code: string;
        }> = [];
        try {
          for (const step of pipeline.steps) {
            const method = source.methods.find((item) => item.id === step.methodId && !item.deletedAt);
            const version = method?.versions.find((item) => item.version === step.methodVersion);
            if (!method || !version) throw new Error(`Missing ${step.name}`);
            preparedSteps.push({
              method,
              version,
              code: bindMethodInputs(version.code, target.files).code
            });
          }
        } catch {
          skipped.push(targetRecord.name);
          continue;
        }
        const targetStartedAt = performance.now();
        try {
          const chat = newChat(target.workspace.id, `${pipeline.name} batch run`);
          target.workspace = { ...target.workspace, activeChatId: chat.id, updatedAt: now() };
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
            content: `Batch run pipeline ${pipeline.name} on ${targetRecord.objectType} ${targetRecord.objectId}`,
            createdAt: now()
          });
          for (const step of preparedSteps) {
            await runtime.beginTurn();
            turnOutputNames.current.clear();
            await executeSavedMethodVersion(
              step.method,
              step.version,
              step.code,
              chat.id,
              promptId
            );
          }
          await saveWorkspace(workspaceRef.current!);
          completed.push(targetRecord.name);
        } catch (error) {
          const failed = workspaceRef.current;
          if (failed?.workspace.id === target.workspace.id) {
            const failedChat = failed.chats.find((chat) => chat.id === failed.workspace.activeChatId);
            if (failedChat) {
              appendMessage(failedChat.id, {
                id: id(),
                role: "assistant",
                kind: "error",
                content: `Batch pipeline failed for this object: ${String(error)}`,
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
      `Batch pipeline completed for ${completed.length} workspace(s)` +
      (skipped.length ? `; incompatible: ${skipped.join(", ")}` : "")
    );
  }

  function beginMethodTransfer(methodIds?: string[]) {
    const ids = methodIds || Array.from(selectedMethodIds);
    if (!ids.length) {
      setStatus("Select one or more methods to copy");
      return;
    }
    setSelectedMethodIds(new Set(ids));
    const firstTarget = userWorkspaces.find((item) => item.id !== workspace?.id);
    if (!firstTarget) {
      setStatus("Open another OMERO Dataset, Screen, Plate, or Image once before copying methods to it");
      return;
    }
    setMethodTransferTarget(firstTarget.id);
    setShowMethodTransfer(true);
  }

  async function copySelectedMethods() {
    const current = workspaceRef.current;
    if (!current || !methodTransferTarget) return;
    const target = await loadWorkspace(methodTransferTarget);
    if (!target) {
      setStatus("The destination workspace is no longer available");
      return;
    }
    const selected = current.methods.filter((method) => !method.deletedAt && selectedMethodIds.has(method.id));
    if (!selected.length) return;
    const compatibility = new Map<string, Record<string, string>>();
    for (const source of selected) {
      const version = source.versions.find((item) => item.version === source.currentVersion);
      if (!version) continue;
      try {
        const bound = bindMethodInputs(version.code, target.files);
        compatibility.set(
          source.id,
          Object.fromEntries(bound.bindings.map((binding) => [binding.from, binding.to]))
        );
      } catch (error) {
        setStatus(`Copy blocked by compatibility preflight for ${source.name}: ${String(error)}`);
        return;
      }
    }
    const targetNames = new Set(target.methods.filter((method) => !method.deletedAt).map((method) => method.name.toLowerCase()));
    const copied: MethodRecord[] = [];
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
        workspaceId: target.workspace.id,
        name,
        description: `${source.description}${source.description ? " · " : ""}Copied from ${current.workspace.name}`,
        workspaceBindings: {
          ...(source.workspaceBindings || {}),
          [target.workspace.id]: compatibility.get(source.id) || {}
        },
        versions: source.versions.map((version) => ({
          ...version,
          executionId: ""
        })),
        createdAt: timestamp,
        updatedAt: timestamp
      });
    }
    await Promise.all(copied.map(saveMethod));
    if (target.workspace.id === current.workspace.id) {
      const updated = { ...current, methods: [...current.methods, ...copied] };
      workspaceRef.current = updated;
      setWorkspace(updated);
    }
    setShowMethodTransfer(false);
    const destination = userWorkspaces.find((item) => item.id === target.workspace.id);
    setStatus(
      `Copied ${copied.length} method${copied.length === 1 ? "" : "s"} to ${destination?.name || "the destination workspace"}. ` +
      "When run there, the methods use that workspace's current inputs."
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

  function downloadMethod(method: MethodRecord) {
    const version = method.versions.find((item) => item.version === method.currentVersion);
    if (version) downloadBytes(method.name, new TextEncoder().encode(version.code), "text/x-python");
  }

  function downloadReproducibilityReport() {
    const current = workspaceRef.current;
    if (!current) return;
    const chat = current.chats.find((item) => item.id === current.workspace.activeChatId);
    if (!chat) return;
    const executions = current.executions.filter((item) => item.chatId === chat.id);
    const lines = [
      `# ${chat.title}`,
      "",
      `OMERO object: ${current.workspace.objectType || "Local"} ${current.workspace.objectId || ""}`,
      `Workspace: ${current.workspace.name}`,
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
    if (!current) throw new Error("Workspace is not ready");
    return exportWorkspace(
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
          ? `Workspace downloaded; omitted local inputs: ${archive.omittedLocalInputs.join(", ")}`
          : "Complete workspace downloaded"
      );
    } catch (error) {
      setStatus(`Workspace export failed: ${String(error)}`);
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
      setStatus(`Saved workspace snapshot as FileAnnotation ${snapshot.annotation_id}`);
    } catch (error) {
      setStatus(`OMERO workspace snapshot failed: ${String(error)}`);
    }
  }

  async function importArchive(file: File | null) {
    if (!file) return;
    try {
      const limit =
        bootstrap.context?.max_snapshot_bytes ?? DEFAULT_MAX_SNAPSHOT_BYTES;
      if (file.size > limit) {
        throw new Error(
          `Workspace archive exceeds the configured ${Math.floor(limit / 1024 / 1024)} MiB limit`
        );
      }
      const imported = await importWorkspace(await file.arrayBuffer(), bootstrap.context);
      if (
        bootstrap.context &&
        (imported.workspace.objectType !== bootstrap.context.object_type ||
          imported.workspace.objectId !== bootstrap.context.object_id)
      ) {
        throw new Error("Workspace snapshot belongs to a different OMERO object");
      }
      await saveWorkspace(imported);
      const prepared = await prepareInputs(imported);
      setWorkspace(prepared);
      workspaceRef.current = prepared;
      setWorkspaces(await listContextWorkspaces(bootstrap.context));
      setUserWorkspaces(await listUserWorkspaces(bootstrap.context));
      await restartRuntime(prepared.files, "Imported workspace restored");
    } catch (error) {
      setStatus(`Workspace import failed: ${String(error)}`);
    } finally {
      if (importInput.current) importInput.current.value = "";
    }
  }

  async function resumeSnapshot(snapshot: Attachment) {
    try {
      setStatus(`Downloading ${snapshot.name}…`);
      const imported = await importWorkspace(
        await bridge.downloadSnapshot(snapshot),
        bootstrap.context
      );
      if (
        bootstrap.context &&
        (imported.workspace.objectType !== bootstrap.context.object_type ||
          imported.workspace.objectId !== bootstrap.context.object_id)
      ) {
        throw new Error("Workspace snapshot belongs to a different OMERO object");
      }
      await saveWorkspace(imported);
      const prepared = await prepareInputs(imported);
      setWorkspace(prepared);
      workspaceRef.current = prepared;
      setWorkspaces(await listContextWorkspaces(bootstrap.context));
      setUserWorkspaces(await listUserWorkspaces(bootstrap.context));
      await restartRuntime(prepared.files, "OMERO workspace snapshot restored");
    } catch (error) {
      setStatus(`Snapshot restore failed: ${String(error)}`);
    }
  }

  function togglePlotCsv() {
    if (!workspace) return;
    updateWorkspaceRecord({ ...workspace, plotCsv: !workspace.plotCsv, updatedAt: now() });
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
      label: "Remove from workspace",
      danger: true,
      run: () => void removeFile(file.id)
    });
    return actions;
  }

  function outputActions(file: WorkspaceFile): BrowserMenuAction[] {
    const selected = selectedOutputIds.has(file.id) && selectedOutputIds.size > 1
      ? Array.from(selectedOutputIds)
      : [file.id];
    return [
      { label: "Rename", run: () => void renameWorkspaceFile(file) },
      { label: "Download", run: () => downloadFile(file) },
      ...(bridge.canUpload
        ? [{ label: "Attach to OMERO", run: () => void attach(file) }]
        : []),
      {
        label: selected.length > 1
          ? `Delete ${selected.length} selected outputs`
          : "Delete output",
        danger: true,
        run: () => void trashOutputs(selected)
      }
    ];
  }

  function methodActions(method: MethodRecord): BrowserMenuAction[] {
    return [
      { label: "Run", run: () => void runMethod(method) },
      { label: "Rename", run: () => void renameMethod(method) },
      { label: "Download", run: () => downloadMethod(method) },
      { label: "Copy to another workspace…", run: () => beginMethodTransfer([method.id]) },
      { label: "Delete method", danger: true, run: () => void removeMethod(method) }
    ];
  }

  function snapshotActions(snapshot: Attachment): BrowserMenuAction[] {
    return [{
      label: "Resume as new workspace",
      run: () => void resumeSnapshot(snapshot)
    }];
  }

  if (!analysisWorkspace || !workspace || !activeChat) {
    return <main className="app-shell"><div className="boot-message">{status}</div></main>;
  }

  const quotaPercent = storage.quota ? Math.round(storage.usage / storage.quota * 100) : 0;
  const matchingWorkflowSkills = matchWorkflowSkills(
    workflowSkillCatalog,
    analysisWorkspace.files,
    profiles
  );
  const catalogSkillCount = [
    ...(workflowSkillCatalog?.workflows || []),
    ...(workflowSkillCatalog?.applications || [])
  ].reduce((total, entry) => total + entry.skills.length, 0) +
    (zarrSkillCatalog?.skills.length || 0);
  const activeNotebook = analysisWorkspace.notebooks.find(
    (item) => item.id === activeNotebookId
  ) || analysisWorkspace.notebooks[0] || null;
  const selectedInspectorItem: InspectorItem = (() => {
    const selection = inspectorSelection;
    if (!selection || selection.kind === "workspace") {
      return {
        kind: "workspace",
        title: workspace.name,
        description: "Browser-local Analysis Workspace for the current OMERO context.",
        metadata: {
          "OMERO object": `${workspace.objectType} ${workspace.objectId}`,
          Chats: chats.length,
          Inputs: inputFiles.length,
          Results: outputFiles.length,
          Methods: activeMethods.length,
          Pipelines: analysisWorkspace.pipelines.filter((item) => !item.deletedAt).length,
          Notebooks: analysisWorkspace.notebooks.length,
          Updated: new Date(workspace.updatedAt).toLocaleString()
        }
      };
    }
    if (selection.kind === "file") {
      const file = analysisWorkspace.files.find(
        (item) => item.id === selection.id && !item.deletedAt
      );
      if (file) return { kind: "file", title: file.name, file };
    }
    if (selection.kind === "chat") {
      const chat = chats.find((item) => item.id === selection.id);
      if (chat) return {
        kind: "chat",
        title: chat.title,
        description: chat.archived ? "Archived Chat conversation." : "Active Chat conversation.",
        metadata: {
          Messages: chat.messages.length,
          "Pinned messages": chat.pinnedMessageIds?.length || 0,
          Updated: new Date(chat.updatedAt).toLocaleString()
        },
        content: [
          `# ${chat.title}`,
          ...(chat.summary
            ? ["", "## Conversation summary", "", chat.summary]
            : []),
          ...chat.messages
            .filter((message) => message.kind !== "execution")
            .flatMap((message) => [
              "",
              `## ${message.role === "user" ? "User" : "Assistant"}`,
              "",
              message.content
            ])
        ].join("\n"),
        language: "markdown"
      };
    }
    if (selection.kind === "method") {
      const method = analysisWorkspace.methods.find(
        (item) => item.id === selection.id && !item.deletedAt
      );
      const version = method?.versions.find(
        (item) => item.version === method.currentVersion
      );
      if (method) return {
        kind: "method",
        title: method.name,
        description: method.description || "Reusable Python analysis Method.",
        metadata: {
          Version: method.currentVersion,
          "Saved versions": method.versions.length,
          Capabilities: method.requiredCapabilities?.join(", ") || "Browser Python",
          Updated: new Date(method.updatedAt).toLocaleString()
        },
        content: version?.code || "",
        language: "python"
      };
    }
    if (selection.kind === "pipeline") {
      const pipeline = analysisWorkspace.pipelines.find(
        (item) => item.id === selection.id && !item.deletedAt
      );
      if (pipeline) return {
        kind: "pipeline",
        title: pipeline.name,
        description: pipeline.description || "Ordered multi-step Method execution.",
        metadata: {
          Version: pipeline.version,
          Steps: pipeline.steps.length,
          Updated: new Date(pipeline.updatedAt).toLocaleString()
        },
        content: JSON.stringify(pipeline.steps, null, 2)
      };
    }
    if (selection.kind === "notebook") {
      const notebook = analysisWorkspace.notebooks.find(
        (item) => item.id === selection.id
      );
      if (notebook) return {
        kind: "notebook",
        title: notebook.name,
        description: "Read-only Python nbformat-4 Notebook.",
        metadata: {
          Cells: notebook.document.cells.length,
          "Attached versions": notebook.attachmentIds.length,
          "Selected inputs": notebook.selectedDataFileIds.length,
          Updated: new Date(notebook.updatedAt).toLocaleString()
        },
        notebook
      };
    }
    if (selection.kind === "zarr") {
      const source = visibleZarrSources.find((item) => item.id === selection.id);
      if (source) return {
        kind: "zarr",
        title: source.name,
        description: "OME-Zarr source served by the installed ZarrViewer. It is not downloaded into this browser Workspace.",
        metadata: {
          Screen: source.contextName,
          "OMERO source": `${source.objectType} ${source.objectId}`,
          "OME-Zarr name": source.zarrName,
          ...(source.plateRows && source.plateColumns ? {
            "Plate size": `${source.plateRows * source.plateColumns}-well (${source.plateRows} × ${source.plateColumns})`,
            "Wells with data": source.wellsWithData,
            "Image fields": source.fieldsWithData
          } : {}),
          "Store UUID": source.storeUuid
        }
      };
    }
    if (selection.kind === "folder") {
      const folders: Record<string, InspectorItem> = {
        inputs: {
          kind: "folder",
          title: "Input",
          description: "Source data available to Chat, Methods, Pipelines, and Notebooks.",
          metadata: {
            "Downloaded inputs": inputFiles.length,
            "ZarrViewer sources": visibleZarrSources.length
          }
        },
        chat: {
          kind: "folder",
          title: "Chat",
          description: "Autosaved conversations and readable transcripts.",
          metadata: { Items: chats.length }
        },
        "chat-results": {
          kind: "folder",
          title: "Chat results",
          description: "Files generated directly by Chat analyses.",
          metadata: { Items: chatOutputFiles.length }
        },
        "methods-results": {
          kind: "folder",
          title: "Methods results",
          description: "Files generated by reusable Method runs.",
          metadata: { Items: methodOutputFiles.length }
        },
        "pipelines-results": {
          kind: "folder",
          title: "Pipelines results",
          description: "Files generated while running Pipelines.",
          metadata: { Items: pipelineOutputFiles.length }
        },
        "notebooks-results": {
          kind: "folder",
          title: "Notebooks results",
          description: "Files generated by run-only Notebooks.",
          metadata: { Items: notebookOutputFiles.length }
        },
        methods: {
          kind: "folder",
          title: "Methods",
          description: "Reusable Python analyses.",
          metadata: { Items: activeMethods.length }
        },
        pipelines: {
          kind: "folder",
          title: "Pipelines",
          description: "Ordered multi-step Method analyses.",
          metadata: {
            Items: analysisWorkspace.pipelines.filter((item) => !item.deletedAt).length
          }
        },
        notebooks: {
          kind: "folder",
          title: "Notebooks",
          description: "Uploaded or OMERO-attached run-only Notebooks.",
          metadata: { Items: analysisWorkspace.notebooks.length }
        }
      };
      if (folders[selection.id]) return folders[selection.id];
    }
    return {
      kind: "workspace",
      title: workspace.name,
      description: "Select any Workspace item to inspect it."
    };
  })();
  const loadedSkillHashes = new Set(
    analysisWorkspace.chats.flatMap((chat) =>
      chat.messages.flatMap((message) =>
        (message.workflowSkills || []).map((skill) => skill.sha256)
      )
    )
  );
  const workspaceActionsMenu = () => (
    <details className="workspace-actions">
      <summary>Workspace actions</summary>
      <div>
        <button onClick={() => void renameWorkspace(workspace)}>Rename workspace</button>
        <button onClick={() => void downloadArchive()}>Download workspace</button>
        <button onClick={() => importInput.current?.click()}>Import workspace</button>
        {bridge.canUpload && <button onClick={() => void saveArchiveToOmero()}>Save snapshot to OMERO</button>}
      </div>
    </details>
  );
  const resultFolder = (
    title: string,
    inspectorId: string,
    files: WorkspaceFile[]
  ) => {
    const visible = files.filter((file) => matchesExplorer(file.name));
    const allSelected = visible.length > 0 &&
      visible.every((file) => selectedOutputIds.has(file.id));
    const selected = files.filter((file) => selectedOutputIds.has(file.id));
    return (
      <details className="browser-subfolder result-subfolder">
        <summary onClick={() => setInspectorSelection({ kind: "folder", id: inspectorId })}>
          <Icon name="chevron" className="folder-chevron" />
          <Icon name="folder" />
          <strong>{title}</strong><small>{files.length}</small>
        </summary>
        {files.length > 0 && (
          <div className="output-selection-toolbar">
            <span>{selected.length} selected</span>
            <button onClick={() => toggleOutputGroupSelection(files)}>
              {allSelected ? "Clear" : "Select all"}
            </button>
            <button disabled={!selected.length}
              onClick={() => void trashOutputs(selected.map((file) => file.id))}>
              Delete selected
            </button>
          </div>
        )}
        <ul className="browser-list result-browser-list">
          {visible.map((file) => (
            <li
              key={file.id}
              className={`browser-row output-row ${selectedOutputIds.has(file.id) ? "selected" : ""}`}
              onClick={() => setSelectedArtifactFileId(file.id)}
              onDoubleClick={() => downloadFile(file)}
              onContextMenu={(event) => openBrowserMenu(event, file.name, outputActions(file))}
            >
              <input
                className="output-selector"
                type="checkbox"
                aria-label={`Select output ${file.name}`}
                checked={selectedOutputIds.has(file.id)}
                onClick={(event) => event.stopPropagation()}
                onChange={() => toggleOutputSelection(file.id)}
                onDoubleClick={(event) => event.stopPropagation()}
              />
              <Icon name={file.type.startsWith("image/") ? "image" : "file"} />
              <div className="browser-name">
                <strong>{file.name}</strong>
                <small>double-click to download</small>
              </div>
              <span className="browser-size">{bytesLabel(file.size)}</span>
              <button className="browser-more" aria-label={`Actions for ${file.name}`}
                onClick={(event) => openBrowserMenu(event, file.name, outputActions(file))}>
                <Icon name="more" />
              </button>
            </li>
          ))}
          {!visible.length && (
            <li className="browser-empty">
              {files.length ? "No matching results" : "No results yet"}
            </li>
          )}
        </ul>
      </details>
    );
  };
  return (
    <main className="app-shell">
      {dialogs.element}
      <header className="workspace-header">
        <div className="header-brand">
          <h1>OMERO.Analysis</h1>
          <p>{workspace.rootPath}</p>
        </div>
        <div className="header-actions">
          <button
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </div>
      </header>

      {activeTab === "chat" && showMethodTransfer && (
        <div className="dialog-backdrop" role="presentation">
          <section className="method-transfer-dialog" role="dialog" aria-modal="true" aria-labelledby="method-transfer-title">
            <h2 id="method-transfer-title">Copy methods to another workspace</h2>
            <p>
              The copied methods keep their code and versions. When run in the
              destination, they automatically use that workspace’s current input files.
            </p>
            <label>Destination workspace
              <select value={methodTransferTarget} onChange={(event) => setMethodTransferTarget(event.target.value)}>
                {userWorkspaces.filter((item) => item.id !== workspace.id).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.objectType} {item.objectId} — {item.name}
                  </option>
                ))}
              </select>
            </label>
            <small>
              A destination appears after you have opened that OMERO object in
              Analysis at least once.
            </small>
            <div className="dialog-actions">
              <button onClick={() => setShowMethodTransfer(false)}>Cancel</button>
              <button disabled={!methodTransferTarget} onClick={() => void copySelectedMethods()}>Copy selected methods</button>
            </div>
          </section>
        </div>
      )}

      <div
        className="workspace artifact-visible"
        style={{
          "--explorer-width": `${explorerWidth}px`,
          "--artifact-width": `${artifactWidth}px`
        } as CSSProperties}
      >
        <aside
          className="workspace-tree"
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
            onClick={() => setInspectorSelection({ kind: "workspace", id: workspace.id })}
            onContextMenu={(event) => openBrowserMenu(event, workspace.name, [
              { label: "Add files", run: () => addFilesInput.current?.click() },
              { label: "New chat", run: () => void newConversation() },
              { label: "Rename current chat", run: () => void renameChat(activeChat) },
              { label: "Rename workspace", run: () => void renameWorkspace(workspace) },
              { label: "Refresh", run: () => void refreshWorkspace() }
            ])}
          >
            <div><h2>Workspace files</h2><small>{bytesLabel(workspaceBytes(analysisWorkspace))} · browser {quotaPercent || "?"}%</small></div>
            <button
              className="browser-more"
              aria-label="Workspace actions"
              title="Workspace actions"
              onClick={(event) => openBrowserMenu(event, workspace.name, [
                { label: "Add files", run: () => addFilesInput.current?.click() },
                { label: "New chat", run: () => void newConversation() },
                { label: "Rename current chat", run: () => void renameChat(activeChat) },
                { label: "Rename workspace", run: () => void renameWorkspace(workspace) },
                { label: "Refresh", run: () => void refreshWorkspace() }
              ])}
            ><Icon name="more" /></button>
          </div>
          <div className="file-browser-toolbar" role="toolbar" aria-label="Workspace file actions">
            <button
              title="Up to OMERO object workspaces"
              aria-label="Up to OMERO object workspaces"
              disabled={browserAtParent}
              onClick={() => setBrowserAtParent(true)}
            ><Icon name="up" /></button>
            <button title="Add files" aria-label="Add files" onClick={() => addFilesInput.current?.click()}><Icon name="upload" /></button>
            <button title="Refresh workspace" aria-label="Refresh workspace" onClick={() => void refreshWorkspace()}><Icon name="refresh" /></button>
            <button
              title="Collapse all folders"
              aria-label="Collapse all folders"
              onClick={() => setOpenFolders({
                chat: false,
                inputs: false,
                methods: false,
                pipelines: false,
                notebooks: false,
                trash: false,
                snapshots: false
              })}
            ><Icon name="collapse" /></button>
            <input ref={addFilesInput} hidden type="file" multiple onChange={(event) => void addLocalFiles(event.target.files)} />
          </div>
          <label className="explorer-search">
            <span className="sr-only">Search workspace files</span>
            <input
              type="search"
              name="workspace-search"
              autoComplete="off"
              value={explorerQuery}
              placeholder="Search files, methods, pipelines…"
              onChange={(event) => setExplorerQuery(event.target.value)}
            />
          </label>
          <div
            className="browser-path"
            title={browserAtParent ? `OMERO/${workspace.objectType}-${workspace.objectId}` : workspace.rootPath}
            onDoubleClick={() => setBrowserAtParent(true)}
          >
            <Icon name="root" />
            <span>{browserAtParent ? `OMERO/${workspace.objectType}-${workspace.objectId}` : workspace.rootPath}</span>
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
            <div className="hierarchy-section-title">Browser-local workspaces for this object</div>
            <ul className="browser-list workspace-list">
              {workspaces.map((item) => (
                <li
                  key={item.id}
                  className={workspaceRowClassName(
                    item.id,
                    workspace.id,
                    selectedWorkspaceId
                  )}
                  aria-selected={item.id === (selectedWorkspaceId || workspace.id)}
                  onClick={() => setSelectedWorkspaceId(item.id)}
                  onDoubleClick={() => void switchWorkspace(item.id)}
                  onContextMenu={(event) => {
                    setSelectedWorkspaceId(item.id);
                    openBrowserMenu(event, item.name, [
                      { label: "Open workspace", run: () => void switchWorkspace(item.id) },
                      { label: "Rename workspace", run: () => void renameWorkspace(item) },
                      ...(item.id !== workspace.id ? [{
                        label: "Delete local workspace",
                        danger: true,
                        run: () => void removeLocalWorkspace(item)
                      }] : [])
                    ]);
                  }}
                >
                  <Icon name="folder" />
                  <div className="browser-name">
                    <strong>{item.name}</strong>
                    <small>{item.id === workspace.id ? "open now" : item.sourceWorkspaceSnapshotAnnotationId ? `restored from Annotation ${item.sourceWorkspaceSnapshotAnnotationId}` : "browser-local workspace"}</small>
                  </div>
                  <span className="browser-size">{new Date(item.updatedAt).toLocaleDateString()}</span>
                  <button
                    className="browser-more"
                    aria-label={`Actions for ${item.name}`}
                    onClick={(event) => {
                      setSelectedWorkspaceId(item.id);
                      openBrowserMenu(event, item.name, [
                        { label: "Open workspace", run: () => void switchWorkspace(item.id) },
                        { label: "Rename workspace", run: () => void renameWorkspace(item) },
                        ...(item.id !== workspace.id ? [{
                          label: "Delete local workspace",
                          danger: true,
                          run: () => void removeLocalWorkspace(item)
                        }] : [])
                      ]);
                    }}
                  ><Icon name="more" /></button>
                </li>
              ))}
            </ul>
            </>
          ) : (<>
          {quotaPercent >= 75 && <p className="quota-warning">Browser storage is {quotaPercent}% full. Archive or download old workspaces.</p>}

          <details
            open={openFolders.inputs}
            className="browser-folder"
            onToggle={(event) => {
              const open = event.currentTarget.open;
              setOpenFolders((current) => ({ ...current, inputs: open }));
            }}
          >
            <summary
              onClick={() => setInspectorSelection({ kind: "folder", id: "inputs" })}
              onContextMenu={(event) => openBrowserMenu(event, "Input/", [
                { label: "Add files", run: () => addFilesInput.current?.click() }
              ])}
            >
              <Icon name="chevron" className="folder-chevron" />
              <Icon name="folder" />
              <strong>Input</strong><small>{inputFiles.length + visibleZarrSources.length}</small>
            </summary>
            <ul className="browser-list">
              {visibleInputs.map((file) => (
                <li
                  key={file.id}
                  className={`browser-row file-${file.state}`}
                  onClick={() => setSelectedArtifactFileId(file.id)}
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
              {visibleZarrSources.filter((source) =>
                matchesExplorer(`${source.name} ${source.contextName}`)
              ).map((source) => (
                <li
                  key={`zarr-${source.id}`}
                  className="browser-row virtual zarr-source-row"
                  onClick={() => setInspectorSelection({ kind: "zarr", id: source.id })}
                >
                  <span className="browser-icon zarr" aria-hidden="true" />
                  <div className="browser-name">
                    <strong>{source.name}</strong>
                    <small>{source.contextName} · served by ZarrViewer · not downloaded</small>
                  </div>
                  <span className="browser-size">OME-Zarr</span>
                </li>
              ))}
              {!visibleInputs.length && !visibleZarrSources.some((source) =>
                matchesExplorer(`${source.name} ${source.contextName}`)
              ) && <li className="browser-empty">No matching input files</li>}
            </ul>
          </details>

          <details
            open={openFolders.chat}
            className="browser-folder"
            onToggle={(event) => {
              const open = event.currentTarget.open;
              setOpenFolders((current) => ({ ...current, chat: open }));
            }}
          >
            <summary onClick={() => setInspectorSelection({ kind: "folder", id: "chat" })}>
              <Icon name="chevron" className="folder-chevron" />
              <Icon name="folder" />
              <strong>Chat</strong><small>{chats.length}</small>
            </summary>
            <ul className="browser-list">
              {chats.filter((chat) => matchesExplorer(chat.title)).flatMap((chat) => [
                <li className="browser-row virtual" key={`${chat.id}-json`}
                  onClick={() => {
                    setInspectorSelection({ kind: "chat", id: chat.id });
                    void switchChat(chat.id);
                  }}
                  onDoubleClick={() => void switchChat(chat.id)}>
                  <span className="browser-icon json" aria-hidden="true" />
                  <div className="browser-name"><strong>{slug(chat.title)}/chat.json</strong><small>autosaved conversation</small></div>
                  <span className="browser-size">—</span>
                </li>,
                <li className="browser-row virtual" key={`${chat.id}-md`}
                  onClick={() => {
                    setInspectorSelection({ kind: "chat", id: chat.id });
                    void switchChat(chat.id);
                  }}
                  onDoubleClick={() => void switchChat(chat.id)}>
                  <span className="browser-icon markdown" aria-hidden="true" />
                  <div className="browser-name"><strong>{slug(chat.title)}/chat.md</strong><small>readable transcript</small></div>
                  <span className="browser-size">—</span>
                </li>
              ])}
            </ul>
            {resultFolder("Chat results", "chat-results", chatOutputFiles)}
          </details>

          <details
            open={openFolders.methods}
            className="browser-folder"
            onToggle={(event) => {
              const open = event.currentTarget.open;
              setOpenFolders((current) => ({ ...current, methods: open }));
            }}
          >
            <summary
              onClick={() => setInspectorSelection({ kind: "folder", id: "methods" })}
              onContextMenu={(event) => openBrowserMenu(event, "methods/", [
                { label: "Combine selected methods", run: () => void combineSelectedMethods() },
                { label: "Copy selected methods…", run: () => beginMethodTransfer() }
              ])}
            >
              <Icon name="chevron" className="folder-chevron" />
              <Icon name="folder" />
              <strong>Methods</strong><small>{activeMethods.length}</small>
            </summary>
            {activeMethods.length > 0 && (
              <div className="method-selection-toolbar">
                <span>{selectedMethodIds.size} selected</span>
                <button disabled={selectedMethodIds.size < 2} onClick={() => void combineSelectedMethods()}>Combine</button>
                <button disabled={!selectedMethodIds.size} onClick={() => void convertSelectedMethodsToNotebook()}>To Notebook</button>
                <button disabled={!selectedMethodIds.size} onClick={() => beginMethodTransfer()}>Copy to…</button>
              </div>
            )}
            <ul className="browser-list">
              {activeMethods.filter((method) => matchesExplorer(method.name)).map((method) => (
                <li
                  key={method.id}
                  className="browser-row method-row"
                  onClick={() => setInspectorSelection({ kind: "method", id: method.id })}
                  onDoubleClick={() => void runMethod(method)}
                  onContextMenu={(event) => openBrowserMenu(event, method.name, methodActions(method))}
                >
                  <input
                    className="method-selector"
                    type="checkbox"
                    aria-label={`Select ${method.name}`}
                    checked={selectedMethodIds.has(method.id)}
                    onClick={(event) => event.stopPropagation()}
                    onChange={() => toggleMethodSelection(method.id)}
                    onDoubleClick={(event) => event.stopPropagation()}
                  />
                  <span className="browser-icon python" aria-hidden="true" />
                  <div className="browser-name">
                    <strong>{method.name}</strong><small>v{method.currentVersion} · {method.description || "saved Python method"}</small>
                  </div>
                  <span className="browser-size">v{method.currentVersion}</span>
                  <button
                    className="browser-more"
                    aria-label={`Actions for ${method.name}`}
                    onClick={(event) => openBrowserMenu(event, method.name, methodActions(method))}
                  ><Icon name="more" /></button>
                </li>
              ))}
              {!activeMethods.filter((method) => matchesExplorer(method.name)).length && <li className="browser-empty">No matching methods</li>}
            </ul>
            {resultFolder("Methods results", "methods-results", methodOutputFiles)}
          </details>

          <details
            open={openFolders.pipelines}
            className="browser-folder"
            onToggle={(event) => {
              const open = event.currentTarget.open;
              setOpenFolders((current) => ({ ...current, pipelines: open }));
            }}
          >
            <summary onClick={() => setInspectorSelection({ kind: "folder", id: "pipelines" })}>
              <Icon name="chevron" className="folder-chevron" />
              <Icon name="folder" />
              <strong>Pipelines</strong><small>{analysisWorkspace.pipelines.length}</small>
            </summary>
            {analysisWorkspace.pipelines.some((pipeline) => !pipeline.deletedAt) && (
              <div className="method-selection-toolbar">
                <span>{selectedPipelineIds.size} selected</span>
                <button disabled={!selectedPipelineIds.size}
                  onClick={() => void convertSelectedPipelinesToNotebook()}>
                  To Notebook
                </button>
              </div>
            )}
            <ul className="browser-list">
              {analysisWorkspace.pipelines.filter((pipeline) =>
                !pipeline.deletedAt && matchesExplorer(pipeline.name)
              ).map((pipeline) => (
                <li
                  key={pipeline.id}
                  className="browser-row pipeline-row"
                  onClick={() => setInspectorSelection({ kind: "pipeline", id: pipeline.id })}
                  onDoubleClick={() => void runPipeline(pipeline)}
                  onContextMenu={(event) => openBrowserMenu(event, pipeline.name, [
                    { label: "Run pipeline", run: () => void runPipeline(pipeline) },
                    { label: "Batch run on opened workspaces…", run: () => void batchRunPipeline(pipeline) },
                    ...(bridge.canUpload ? [{
                      label: "Publish template to OMERO",
                      run: () => void publishPipeline(pipeline)
                    }] : []),
                    { label: "Delete pipeline", danger: true, run: () => void removePipeline(pipeline) }
                  ])}
                >
                  <input
                    className="method-selector"
                    type="checkbox"
                    aria-label={`Select pipeline ${pipeline.name}`}
                    checked={selectedPipelineIds.has(pipeline.id)}
                    onClick={(event) => event.stopPropagation()}
                    onChange={() => togglePipelineSelection(pipeline.id)}
                    onDoubleClick={(event) => event.stopPropagation()}
                  />
                  <Icon name="file" />
                  <div className="browser-name">
                    <strong>{pipeline.name}</strong>
                    <small>v{pipeline.version} · {pipeline.steps.length} isolated steps</small>
                  </div>
                  <span className="browser-size">{pipeline.steps.length}</span>
                  <button
                    className="browser-more"
                    aria-label={`Actions for ${pipeline.name}`}
                    onClick={(event) => openBrowserMenu(event, pipeline.name, [
                      { label: "Run pipeline", run: () => void runPipeline(pipeline) },
                      { label: "Batch run on opened workspaces…", run: () => void batchRunPipeline(pipeline) },
                      ...(bridge.canUpload ? [{
                        label: "Publish template to OMERO",
                        run: () => void publishPipeline(pipeline)
                      }] : []),
                      { label: "Delete pipeline", danger: true, run: () => void removePipeline(pipeline) }
                    ])}
                  ><Icon name="more" /></button>
                </li>
              ))}
              {!analysisWorkspace.pipelines.filter((pipeline) =>
                !pipeline.deletedAt && matchesExplorer(pipeline.name)
              ).length && <li className="browser-empty">No matching pipelines</li>}
              {pipelineTemplates.map((template) => (
                <li
                  key={`template-${template.annotation_id}`}
                  className="browser-row"
                  onDoubleClick={() => void importPipelineTemplate(template)}
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
                    onClick={() => void importPipelineTemplate(template)}
                  ><Icon name="more" /></button>
                </li>
              ))}
            </ul>
            {resultFolder("Pipelines results", "pipelines-results", pipelineOutputFiles)}
          </details>

          <details
            open={openFolders.notebooks}
            className="browser-folder"
            onToggle={(event) => {
              const open = event.currentTarget.open;
              setOpenFolders((current) => ({ ...current, notebooks: open }));
            }}
          >
            <summary
              onClick={() => setInspectorSelection({ kind: "folder", id: "notebooks" })}
              onContextMenu={(event) => openBrowserMenu(event, "Notebooks/", [
                { label: "Upload notebook", run: () => notebookUploadInput.current?.click() }
              ])}
            >
              <Icon name="chevron" className="folder-chevron" />
              <Icon name="folder" />
              <strong>Notebooks</strong><small>{analysisWorkspace.notebooks.length}</small>
            </summary>
            <div className="method-selection-toolbar notebook-folder-toolbar">
              <span>{analysisWorkspace.notebooks.length} notebook{analysisWorkspace.notebooks.length === 1 ? "" : "s"}</span>
              <button onClick={() => notebookUploadInput.current?.click()}>Upload</button>
            </div>
            <ul className="browser-list">
              {analysisWorkspace.notebooks.filter((notebook) =>
                matchesExplorer(notebook.name)
              ).map((notebook) => (
                <li key={notebook.id} className="browser-row"
                  onClick={() => {
                    setActiveNotebookId(notebook.id);
                    setInspectorSelection({ kind: "notebook", id: notebook.id });
                  }}
                  onDoubleClick={() => openNotebook(notebook)}
                  onContextMenu={(event) => openBrowserMenu(event, notebook.name, [
                    { label: "Open", run: () => openNotebook(notebook) },
                    { label: "Run", run: () => runNotebook(notebook) }
                  ])}>
                  <span className="browser-icon json" aria-hidden="true" />
                  <div className="browser-name">
                    <strong>{notebook.name}</strong>
                    <small>{notebook.attachmentIds.length
                      ? `${notebook.attachmentIds.length} attached version(s)`
                      : "browser workspace"}</small>
                  </div>
                  <span className="browser-size">.ipynb</span>
                  <button className="browser-more" aria-label={`Actions for ${notebook.name}`}
                    onClick={(event) => openBrowserMenu(event, notebook.name, [
                      { label: "Open", run: () => openNotebook(notebook) },
                      { label: "Run", run: () => runNotebook(notebook) }
                    ])}>
                    <Icon name="more" />
                  </button>
                </li>
              ))}
              {!analysisWorkspace.notebooks.length &&
                <li className="browser-empty">No notebooks</li>}
            </ul>
            {resultFolder("Notebooks results", "notebooks-results", notebookOutputFiles)}
            <input ref={notebookUploadInput} hidden type="file"
              accept=".ipynb,application/x-ipynb+json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadNotebookFile(file);
                event.target.value = "";
              }} />
          </details>
          </>)}
        </aside>
        <div
          className="pane-resizer"
          role="separator"
          aria-label="Resize workspace explorer"
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
        <input ref={importInput} hidden type="file" accept=".oa-workspace.zip,application/zip"
          onChange={(event) => void importArchive(event.target.files?.[0] || null)} />

        <section className="center-pane">
        <nav className="analysis-tabs" aria-label="Analysis views">
          {(["chat", "notebook"] as const).map((tab) => (
            <button key={tab} className={activeTab === tab ? "active" : ""}
              aria-current={activeTab === tab ? "page" : undefined}
              onClick={() => setActiveTab(tab)}>
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        {activeTab === "chat" && (
        <section className="chat">
          <div className="workspace-toolbar">
            <label>
              <span className="sr-only">Current chat</span>
              <select value={activeChat.id} onChange={(event) => void switchChat(event.target.value)}>
                {chats.filter((chat) => !chat.archived).map((chat) => (
                  <option key={chat.id} value={chat.id}>{chat.title}</option>
                ))}
              </select>
            </label>
            <button onClick={() => void newConversation()}>New chat</button>
            <button onClick={() => void renameChat(activeChat)}>Rename chat</button>
            <button onClick={() => archiveChat(activeChat)}>Archive</button>
            {workspaceActionsMenu()}
          </div>
          <div className="messages" aria-live="polite" ref={messagesElement}>
            {!activeChat.messages.length && (
              <div className="welcome">
                <h2>What would you like to learn from these data?</h2>
                <p>This named chat, its code, outputs, and reusable pipelines are saved automatically in the browser workspace.</p>
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
              if (message.kind === "viewer-preview" && message.artifactId) {
                const artifact = analysisWorkspace.artifacts.find(
                  (item) => item.id === message.artifactId
                );
                const file = artifact?.fileId
                  ? analysisWorkspace.files.find(
                    (item) => item.id === artifact.fileId && !item.deletedAt
                  )
                  : undefined;
                return artifact ? (
                  <ViewerPreviewCard
                    key={message.id}
                    artifact={artifact}
                    file={file}
                    onInspect={(selected) => {
                      setSelectedArtifactFileId(selected.id);
                    }}
                    onSaveBundle={(selectedArtifact, selectedFile) =>
                      void saveAnalysisRender(selectedArtifact, selectedFile)
                    }
                  />
                ) : null;
              }
              if (message.kind === "execution" && message.executionId) {
                const execution = analysisWorkspace.executions.find((item) => item.id === message.executionId);
                return execution ? (
                  <ExecutionCard
                    key={message.id}
                    execution={execution}
                    files={analysisWorkspace.files}
                    onSave={() => void saveAsMethod(execution)}
                    onRerun={() => void rerunExecution(execution)}
                    viewerPreparation={executionPreparesViewer(
                      analysisWorkspace,
                      execution
                    )}
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
                        const cited = analysisWorkspace.executions.find((item) => item.id === executionId);
                        const fileId = cited?.outputFileIds.find((candidate) =>
                          analysisWorkspace.files.some((file) => file.id === candidate && !file.deletedAt)
                        );
                        return (
                          <button
                            key={executionId}
                            title={`Open local execution ${executionId.slice(0, 8)}`}
                            onClick={() => {
                              if (fileId) setSelectedArtifactFileId(fileId);
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
            onReset={() => void restartRuntime(analysisWorkspace.files, "Python state reset; inputs restored")}
          />
        </section>
        )}
        {activeTab === "notebook" && (
          <NotebookView
            notebook={activeNotebook}
            inputs={inputFiles}
            runtime={runtime}
            runRequest={notebookRunRequest}
            workspaceActions={workspaceActionsMenu()}
            onChange={updateNotebook}
            onFiles={saveNotebookFiles}
          />
        )}
        {activeTab === "settings" && (
          <section className="settings-tab settings-stack" aria-label="Settings">
            <details className="settings-section" open>
              <summary>Analysis Settings</summary>
              <div className="settings-section-body">
                <label className="settings-check">
                  <input type="checkbox" checked={workspace.plotCsv}
                    onChange={togglePlotCsv} />
                  <span>
                    <strong>Plot + CSV</strong>
                    <small>
                      Ask Chat to save both a visual plot and its underlying tabular data
                      when an analysis produces a chart. Disable this when you only need
                      the requested result.
                    </small>
                  </span>
                </label>
              </div>
            </details>

            <details className="settings-section">
              <summary>AI Settings</summary>
              <div className="settings-section-body settings-form">
                <p className="settings-warning">
                  The API key is used only in this browser tab unless you choose to remember it.
                  Remembered keys are stored unencrypted and never included in Workspace snapshots.
                </p>
                <label>API protocol
                  <select value={settings.protocol}
                    onChange={(event) => void saveSettings({
                      ...settings,
                      protocol: event.target.value as ProviderSettings["protocol"]
                    })}>
                    <option value="openai">OpenAI-compatible Chat Completions</option>
                    <option value="anthropic">Anthropic Messages</option>
                  </select>
                </label>
                <label>API endpoint
                  <input type="url" name="omero-analysis-api-endpoint"
                    autoComplete="url" value={settings.endpoint}
                    placeholder={settings.protocol === "anthropic"
                      ? "https://your-provider.example"
                      : "https://your-provider.example/v1"}
                    onChange={(event) => void saveSettings({ ...settings, endpoint: event.target.value })} />
                  <small>
                    Enter your provider base URL or complete API route. No organization endpoint is built in.
                  </small>
                </label>
                {settings.protocol === "openai" && (
                  <label>Authentication header
                    <select value={settings.authMode}
                      onChange={(event) => void saveSettings({
                        ...settings,
                        authMode: event.target.value as ProviderSettings["authMode"]
                      })}>
                      <option value="bearer">Authorization: Bearer</option>
                      <option value="api-key">api-key (Azure-compatible)</option>
                    </select>
                  </label>
                )}
                <label>Model or deployment
                  <input name="omero-analysis-model" autoComplete="off"
                    value={settings.model}
                    onChange={(event) => void saveSettings({ ...settings, model: event.target.value })} />
                </label>
                <label>API key
                  <input type="password" name="omero-analysis-api-key"
                    autoComplete="new-password" value={settings.apiKey}
                    onChange={(event) => void saveSettings({ ...settings, apiKey: event.target.value })} />
                </label>
                <label className="settings-check inline">
                  <input type="checkbox" checked={settings.rememberKey}
                    onChange={(event) => void saveSettings({ ...settings, rememberKey: event.target.checked })} />
                  Remember this key in this browser profile
                </label>
                <label>Model context window (optional)
                  <input type="number" min="0" value={settings.contextWindow || ""}
                    onChange={(event) => void saveSettings({
                      ...settings,
                      contextWindow: Number(event.target.value) || 0
                    })} />
                </label>
                <button className="secondary-action" onClick={() => void saveSettings({
                  ...settings,
                  apiKey: "",
                  rememberKey: false
                })}>Forget API key</button>
              </div>
            </details>

            <details className="settings-section">
              <summary>Skills</summary>
              <div className="settings-section-body">
                <p>
                  Catalog metadata is informational. Skill instructions are loaded only
                  for matching Chat turns and are never loaded by Notebook.
                </p>
                <div className="skill-list">
                  {[...(workflowSkillCatalog?.workflows || []),
                    ...(workflowSkillCatalog?.applications || [])].flatMap((provider) =>
                    provider.skills.map((skill) => (
                      <article className="skill-card" key={`${provider.source.workflow_key}:${skill.name}:${skill.sha256}`}>
                        <strong>{skill.name}</strong>
                        <span>Provider: {provider.source.source_key || provider.source.workflow_key}</span>
                        <span>Source: {skill.package_url}</span>
                        <span>Version: {skill.version} · SHA-256: {skill.sha256}</span>
                        <span>Health: {provider.status}</span>
                        <span>{matchingWorkflowSkills.some((item) => item.skill.sha256 === skill.sha256)
                          ? "Matches current data"
                          : "Does not match current data"}</span>
                        <span>{loadedSkillHashes.has(skill.sha256) ? "Loaded by Chat" : "Not loaded"}</span>
                      </article>
                    ))
                  )}
                  {zarrSkillCatalog?.skills.map((skill) => (
                    <article className="skill-card" key={`${zarrSkillCatalog.provider.name}:${skill.name}:${skill.sha256}`}>
                      <strong>{skill.name}</strong>
                      <span>Provider: {zarrSkillCatalog.provider.name}</span>
                      <span>Source: {zarrSkillCatalog.provider.source}</span>
                      <span>Version: {skill.version} · SHA-256: {skill.sha256}</span>
                      <span>Health: {zarrSkillCatalog.provider.health}</span>
                      <span>Explicit ZarrViewer Chat operations only</span>
                      <span>Not loaded by Notebook</span>
                    </article>
                  ))}
                  {!catalogSkillCount && <p>No external skills discovered. Generic Chat remains available.</p>}
                </div>
              </div>
            </details>
          </section>
        )}
        </section>
        <div
          className="pane-resizer artifact-resizer"
          role="separator"
          aria-label="Resize Artifact Inspector"
          onMouseDown={beginArtifactResize}
        />
        <ArtifactInspector
          item={selectedInspectorItem}
          profiles={profiles}
          canUpload={bridge.canUpload}
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
    const current = workspaceRef.current;
    if (
      !runtimeReady ||
      busy ||
      !current ||
      execution.purpose === "inspection" ||
      executionPreparesViewer(current, execution)
    ) return;
    setBusy(true);
    turnOutputNames.current.clear();
    await runtime.beginTurn();
    try {
      const promptId = id();
      const executionResult = await executeCode(
        execution.code,
        execution.chatId,
        promptId,
        true,
        execution.purpose === "method" ? "method" : "analysis"
      );
      const current = workspaceRef.current;
      const saved = current?.methods.flatMap((method) =>
        method.versions.map((version) => ({ method, version }))
      ).find(({ version }) => version.codeHash === execution.codeHash);
      const renderResult = await replaySavedGallery(
        executionResult,
        execution.chatId,
        promptId,
        saved?.method.name || "python-rerun-analysis.py",
        saved?.version.renderRecipe
      );
      setStatus(
        renderResult
          ? "Python rerun completed and rendered its PNG gallery"
          : "Python rerun completed"
      );
    } catch (error) {
      setStatus(`Python rerun could not complete: ${String(error)}`);
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
