import { AnalysisHelp } from "./components/AnalysisHelp";
import { WorkspaceExplorer } from "./components/WorkspaceExplorer";
import {
useCallback,
useEffect,
useMemo,
useRef,
useState
} from "react";
import { Inspector, queryNotebook } from "./Inspector";
import { quoteIdentifier } from "./inspectorQuery";
import { WorkflowExamples } from "./WorkflowExamples";
import NotebookView,{ parseNotebook,serializeNotebook } from "./NotebookView";
import { SkillsView } from "./SkillsView";
import {
OmeroApiError,
OmeroBridge
} from "./api";
import { exportWorkspace,importWorkspace } from "./archive";
import {
ArtifactBindingError,
bindPythonInputsStrict,
downloadableWorkspaceInputs
} from "./artifactBindings";
import { AnalysisNavigation } from "./components/AnalysisNavigation";
import {
BlueprintThemeProvider,
Button,
Input
} from "./components/BlueprintControls";
import { useDialogs } from "./components/Dialogs";
import { SharedLibrary } from "./components/SharedLibrary";
import { WorkspaceLibraryTree } from "./components/WorkspaceLibraryTree";
import {
type InspectorItem
} from "./components/WorkspacePanels";
import { WorkspacePreparationScreen } from "./components/WorkspacePreparationScreen";
import { WorkspaceHeader } from "./components/WorkspaceHeader";
import {
MAX_FILE_BYTES,
MAX_WORKSPACE_BYTES
} from "./constants";
import { newNotebookDocument } from "./creationTemplates";
import { inspectInput, queryInputChoices } from "./inputInspection";
import { upgradeLegacyDatabaseCode } from "./legacyRemoteQuery";
import {
appTabFromRoute,
type AppTab
} from "./navigation";
import { compatibilityLabel,inputCompatibility,notebookCompatibility,type Compatibility,type CompatibilitySource } from "./notebookCompatibility";
import { notebookAttachmentCandidates } from "./notebookInputDiscovery";
import { importedNotebookProtocol,typedNotebookQueryParameters } from "./notebookPreparation";
import {
extensionOf,
inputCandidates,
parameterDefaults,
parseNotebookProtocol,
sanitizeProtocolNotebook,
validateParameterValues,
type NotebookProtocolBinding,
type NotebookProtocolContract,
type NotebookProtocolInput
} from "./notebookProtocol";
import { completeNotebookResults,notebookParameterKey,notebookResultPath } from "./notebookResults";
import {
bindRemoteQueryCode,
dataQueryBindingCandidates,
dataQuerySourceFormat,
isOmeroDataQuerySource,
remoteBindingFormat,
remoteBindingId,
remoteBindingPreferredAnnotationId,
remoteBindingPreferredFileId
} from "./remoteQueryBindings";
import {
PythonRuntime,
type NotebookQueryRequest,
type RemoteQueryRuntimeResult
} from "./runtime";
import { bindSharedHandoff,prepareSharedImports,readSharedHandoff,sharedHandoffKey } from "./sharedLibrary";
import {
contextKey,
deleteFile as deleteStoredFile,
deleteWorkspaceCascade,
getValue,
listContextWorkspaces,
loadOrCreateWorkspace,
loadWorkspace,
replaceWorkspace,
saveFile,
saveNotebook,
saveWorkspaceRecord,
setValue,
sha256,
storageEstimate,
uiThemeKey
} from "./storage";
import type {
AnalysisSkillProviderCatalog,
AnalysisWorkspace,
Attachment,
DataProfile,
DataQueryCapabilities,
LibraryDataset,
LibraryItem,
LibraryOrigin,
NotebookRecord,
OmeroContext,
OmeroHierarchy,
RemoteQueryBinding,
RemoteQueryBindingV2,
RuntimeOutput,
RuntimeProgress,
SharedLibraryItem,
SyncPayload,
SyncStatus,
WorkflowSkillCatalog,
WorkspaceFile,
WorkspaceRecord,
ZarrBinding,
ZarrViewerCapability,
ZarrViewerIntegrationStatus
} from "./types";
import { prepareRemoteInput } from "./workspaceInputs";
import {
normalizeWorkspaceName,
renameAnalysisWorkspace,
scopedWorkspaceName,
workspaceNameSuffix
} from "./workspaceModel";
import {
reconcileDeletedRemoteWorkspaces,
remoteWorkspaceWasDeleted
} from "./workspaceReconciliation";
import {
buildWorkspaceSyncPayload,
syncAlreadyCurrent,
reconcileResultDeletions,
syncHasChanges,
withWorkspaceSyncStatus
} from "./workspaceSync";
import { compactResultVersions } from "./notebookResults";
import { scheduleWorkspaceCheck } from "./workspaceSyncController";
import { renderZarrMovie } from "./zarrMovie";
import {
fetchZarrCapability,
notebookZarrRenderRequest,
renderZarrRecipe,
renderZarrRecipeSvg,
zarrBinding,
zarrCandidates
} from "./zarrViewer";

const IMPORT_SYNC_POLL_INTERVAL_MS = 1000;

import { biomeroThemeFromMessage,postEmbeddedHostMessage } from "./embeddedBridge";
import { capacityWarning } from "./storageCapacity";
import { useSessionKeepalive } from "./useSessionKeepalive";
const supported = /\.(duckdb|sqlite3?|csv|tsv|json|xlsx?|parquet|npy|npz)$/i;
const DEFAULT_MAX_SNAPSHOT_BYTES = 256 * 1024 * 1024;
const explorerVisibilityKey = (context: OmeroContext | null) =>
  `analysis:explorer-visible:${context?.user_id || 0}:${context?.group_id || 0}`;
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

export function nextUntitledName(names: string[], extension: ".py" | ".ipynb"): string {
  const used = new Set(names.map((name) => name.toLowerCase()));
  let sequence = 1;
  while (used.has(`untitled${String(sequence).padStart(2, "0")}${extension}`)) {
    sequence += 1;
  }
  return `untitled${String(sequence).padStart(2, "0")}${extension}`;
}

function bytesLabel(value: number): string {
  if (value >= 1024 * 1024 * 1024) return `${(value / 1024 / 1024 / 1024).toFixed(1)} GiB`;
  if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)} MiB`;
  if (value >= 1024) return `${(value / 1024).toFixed(1)} KiB`;
  return `${value} bytes`;
}

function notebookRuntimeName(name: string): string {
  return name.replace(/[^A-Za-z0-9._ -]/g, "_");
}

function notebookQueryFormat(name: string): "duckdb" | "sqlite" | "sqlite3" | "csv" {
  const extension = extensionOf(name);
  if (extension === ".duckdb") return "duckdb";
  if (extension === ".sqlite") return "sqlite";
  if (extension === ".sqlite3") return "sqlite3";
  if (extension === ".csv") return "csv";
  throw new Error(`${name} is not a supported notebook query source`);
}

function workspaceBytes(analysisWorkspace: AnalysisWorkspace | null): number {
  return analysisWorkspace?.files.filter(
    (file) => !file.deletedAt && file.dataQueryMode !== "remote"
  )
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

interface InspectorSelection {
  kind: InspectorItem["kind"];
  id: string;
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

export default function App() {
  const bootstrap = window.OMERO_ANALYSIS;
  const bridge = useMemo(() => new OmeroBridge(bootstrap), [bootstrap]);
  const runtime = useMemo(
    () => new PythonRuntime(
      bootstrap.runtimeBase,
      bootstrap.context,
      (bootstrap.notebookCellTimeoutSeconds || 300) * 1000
    ),
    [bootstrap]
  );
  const inspectionRuntime = useMemo(() => new PythonRuntime(bootstrap.runtimeBase, bootstrap.context, 30000), [bootstrap]);
  useEffect(() => () => inspectionRuntime.dispose(), [inspectionRuntime]);
  const [notebookMatches, setNotebookMatches] = useState<Record<string, Compatibility>>({});
  const compatibilityChecks = useRef(new Map<string, CompatibilitySource>());
  const inspectionQueue = useRef<Promise<unknown>>(Promise.resolve());
  function inspectForNotebook(file: WorkspaceFile, input: NotebookProtocolInput) {
    const key = JSON.stringify([file.id, file.sha256, file.state, input]);
    const cached = compatibilityChecks.current.get(key);
    if (cached) return Promise.resolve(cached);
    const next = inspectionQueue.current.then(() => inspectInput(file, input, bridge, inspectionRuntime));
    inspectionQueue.current = next.catch(() => undefined);
    return next.then(value => { compatibilityChecks.current.set(key, value); return value; });
  }
  const dialogs = useDialogs();
  const [inspectedSchemas, setInspectedSchemas] = useState<Record<string, CompatibilitySource["schema"]>>({});
  const initialInputSelected = useRef("");


  const requestedTab = new URLSearchParams(window.location.search).get("tab");
  const initialTab = appTabFromRoute(requestedTab);
  const [activeTab, setActiveTabState] = useState<AppTab>(
    initialTab
  );
  const [analysisWorkspace, setWorkspace] = useState<AnalysisWorkspace | null>(null);
  const workspaceRef = useRef<AnalysisWorkspace | null>(null);
  const [hierarchy, setHierarchy] = useState<OmeroHierarchy | null>(null);
  useEffect(() => {
    if (!analysisWorkspace || initialInputSelected.current === analysisWorkspace.workspace.id) return;
    initialInputSelected.current = analysisWorkspace.workspace.id;
    const first = analysisWorkspace.files.find(file => file.source !== "result" && !file.deletedAt && /\.(duckdb|sqlite3?|csv)$/i.test(file.name));
    setInspectorSelection(first ? { kind: "file", id: first.id } : null);
    if (bootstrap.context?.selected_notebook) setActiveTab("notebooks");
  }, [analysisWorkspace?.workspace.id]);
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [workflowSkillCatalog, setWorkflowSkillCatalog] =
    useState<WorkflowSkillCatalog | null>(null);
  const [workflowSkillWarning, setWorkflowSkillWarning] = useState("");
  const [zarrViewerStatus, setZarrViewerStatus] =
    useState<ZarrViewerIntegrationStatus | null>(null);
  const [zarrViewerWarning, setZarrViewerWarning] = useState("");
  const [zarrSkillCatalog, setZarrSkillCatalog] =
    useState<AnalysisSkillProviderCatalog | null>(null);
  const [dataQueryCapabilities, setDataQueryCapabilities] =
    useState<DataQueryCapabilities | null>(null);
  const zarrCapabilities = useRef(new Map<string, ZarrViewerCapability>());
  const [visibleZarrSources, setVisibleZarrSources] = useState<VisibleZarrSource[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [runtimeReady, setRuntimeReady] = useState(false);
  const runtimeStarted = useRef(false);
  const [profiles, setProfiles] = useState<DataProfile[]>([]);
  const [inspectorSelection, setInspectorSelection] =
    useState<InspectorSelection | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [explorerWidth, setExplorerWidth] = useState(() => Math.max(280, Math.min(700, Number(localStorage.getItem("analysis:explorer-width")) || 346)));
  const splitterStart = useRef(0);
  const splitterWidth = useRef(346);
  const [notebookRunRequest, setNotebookRunRequest] =
    useState<{ id: string; nonce: number } | null>(null);
  const movieController = useRef<AbortController | null>(null);
  const [explorerQuery, setExplorerQuery] = useState("");
  const [status, setStatus] = useState("Preparing workspace…");
  const [, setWorkspacePreparing] = useState(true);
  const [workspaceProgress, setWorkspaceProgress] = useState<RuntimeProgress>({
    percent: 3,
    message: "Opening the current Analysis Workspace…"
  });
  const [workspaceError, setWorkspaceError] = useState("");
  const [browserMenu, setBrowserMenu] = useState<BrowserMenuState | null>(null);
  const [selectedMethodIds, setSelectedMethodIds] = useState<Set<string>>(new Set());
  const [selectedPipelineIds, setSelectedPipelineIds] = useState<Set<string>>(new Set());
  const [remoteSync, setRemoteSync] = useState<SyncStatus | null>(null);
  const [localSyncDigest, setLocalSyncDigest] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncPhase, setSyncPhase] = useState<"checking" | "saving" | "waiting" | "">("");
  const [syncError, setSyncError] = useState("");

  const notifyEmbeddedSessionExpired = useCallback(() => {
    postEmbeddedHostMessage(bootstrap, "session-expired");
  }, [bootstrap]);
  useSessionKeepalive(
    bootstrap.keepaliveUrl,
    bootstrap.keepaliveInterval,
    notifyEmbeddedSessionExpired
  );
  const [libraryDatasets, setLibraryDatasets] = useState<LibraryDataset[]>([]);
  const [libraryQuery, setLibraryQuery] = useState("");
  const [selectedLibraryItems, setSelectedLibraryItems] = useState<Set<string>>(new Set());
  const [openLibraryDatasets, setOpenLibraryDatasets] = useState<Set<number>>(new Set());
  const [libraryLoading, setLibraryLoading] = useState(false);
  const initialLibraryRequestHandled = useRef(false);
  const sharedHandoffOpened = useRef("");
  const workspaceSyncInFlight = useRef(false);
  const workspaceSyncQueued = useRef(false);
  const workspaceSyncPollTimer = useRef<number | null>(null);
  const workspaceSyncDeferredForRun = useRef(false);
  const syncRunBarrierTokens = useRef(new Set<string>());
  const [syncRunBarrierActive, setSyncRunBarrierActive] = useState(false);
  const remoteDeletionInFlight = useRef(false);
  const [runtimeProgress, setRuntimeProgress] = useState<RuntimeProgress>({
    percent: 0,
    message: "Preparing the browser analysis workspace…"
  });
  const [storage, setStorage] = useState({ usage: 0, quota: 0 });
  const importInput = useRef<HTMLInputElement | null>(null);
  const addFilesInput = useRef<HTMLInputElement | null>(null);
  const notebookUploadInput = useRef<HTMLInputElement | null>(null);
  const [newCellRequest, setNewCellRequest] = useState<{ notebookId: string; cellIds: string[]; nonce: number } | null>(null);
  const activeRemoteQueryDigests = useRef<string[]>([]);
  const activeRemoteQuerySources = useRef<Record<string, string>>({});
  workspaceRef.current = analysisWorkspace;

  const embeddedReadySent = useRef(false);
  useEffect(() => {
    if (!analysisWorkspace || embeddedReadySent.current) return;
    embeddedReadySent.current = true;
    postEmbeddedHostMessage(bootstrap, "ready", {
      workspace_id: analysisWorkspace.workspace.id,
      object_type: bootstrap.context?.object_type || null,
      object_id: bootstrap.context?.object_id || null,
      title: bootstrap.context?.name || analysisWorkspace.workspace.name
    });
  }, [analysisWorkspace?.workspace.id, bootstrap]);
  useEffect(() => {
    if (!analysisWorkspace) return;
    postEmbeddedHostMessage(bootstrap, "source-title-changed", {
      title: bootstrap.context?.name || analysisWorkspace.workspace.name,
      object_type: bootstrap.context?.object_type || null,
      object_id: bootstrap.context?.object_id || null
    });
  }, [analysisWorkspace?.workspace.name, bootstrap]);
  useEffect(() => {
    if (bootstrap.embeddedHost !== "biomero" || window.parent === window) return undefined;
    const onMessage = (event: MessageEvent) => {
      const next = biomeroThemeFromMessage(event, window.parent, window.location.origin);
      if (next) setTheme(next);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [bootstrap.embeddedHost]);

  function setActiveTab(tab: AppTab) {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url);
    setActiveTabState(tab);
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    void setValue(uiThemeKey, next);
  }

  function resizeExplorer(width: number) {
    const bounded = Math.max(280, Math.min(700, width));
    setExplorerWidth(bounded); localStorage.setItem("analysis:explorer-width", String(bounded));
  }
  async function removeExplorerItems(items: {kind: "file" | "notebook"; id: string}[]) {
    const current = workspaceRef.current;
    if (!current || syncRunBarrierActive) return;
    const timestamp = now();
    const files = current.files.map(file => items.some(item => item.kind === "file" && item.id === file.id) ? {...file, deletedAt: timestamp} : file);
    const notebooks = current.notebooks.map(notebook => items.some(item => item.kind === "notebook" && item.id === notebook.id) ? {...notebook, deletedAt: timestamp, updatedAt: timestamp} : notebook);
    await Promise.all([...files.filter((file, i) => file !== current.files[i]).map(saveFile), ...notebooks.filter((notebook, i) => notebook !== current.notebooks[i]).map(saveNotebook)]);
    const updated = {...current, files, notebooks}; workspaceRef.current = updated; setWorkspace(updated);
    if (items.some(item => item.kind === "file" && item.id === selectedArtifactFileId)) setInspectorSelection(null);
    setStatus(`Removed ${items.length} item(s) from this workspace. Undo is available; source OMERO images and plates are unchanged.`);
  }
  async function undoExplorerRemoval() {
    const current = workspaceRef.current;
    if (!current || syncRunBarrierActive) return;
    const timestamp = [...current.files.filter(file => !file.deletedInOmeroAt && !file.supersededAt), ...current.notebooks].map(item => item.deletedAt || "").sort().at(-1);
    if (!timestamp) return;
    const files = current.files.map(file => file.deletedAt === timestamp && !file.deletedInOmeroAt && !file.supersededAt ? {...file, deletedAt: undefined} : file);
    const notebooks = current.notebooks.map(notebook => notebook.deletedAt === timestamp ? {...notebook, deletedAt: undefined, updatedAt: now()} : notebook);
    await Promise.all([...files.filter((file, i) => file !== current.files[i]).map(saveFile), ...notebooks.filter((notebook, i) => notebook !== current.notebooks[i]).map(saveNotebook)]);
    const updated = {...current, files, notebooks}; workspaceRef.current = updated; setWorkspace(updated); setStatus("Last removal restored.");
  }

  const workspace = analysisWorkspace?.workspace || null;
  const inputFiles = (analysisWorkspace?.files || []).filter(
    (file) => file.source !== "result" && file.role !== "chat-attachment" && !file.deletedAt
  );
  const outputFiles = (analysisWorkspace?.files || []).filter(
    (file) => file.source === "result" && !file.deletedAt
  );
  const selectedArtifactFileId = inspectorSelection?.kind === "file"
    ? inspectorSelection.id
    : null;
  const setSelectedArtifactFileId = (value: string | null) =>
    setInspectorSelection(value ? { kind: "file", id: value } : null);
  const matchesExplorer = (value: string) =>
    !explorerQuery.trim() || value.toLowerCase().includes(explorerQuery.trim().toLowerCase());
  const visibleInputs = inputFiles.filter((file) => matchesExplorer(file.name));
  const activeNotebooks = (analysisWorkspace?.notebooks || []).filter(item => !item.deletedAt);
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const matches: Record<string, Compatibility> = {};
      for (const notebook of activeNotebooks) {
        try {
          const contract = parseNotebookProtocol(notebook.document, true);
          if (!contract) { matches[notebook.id] = { status: "unchecked", reasons: ["No portable input contract declared"] }; continue; }
          const byId = new Map<string, CompatibilitySource>();
          for (const input of contract.inputs) {
            for (const file of inputFiles) {
              const inspected = await inspectForNotebook(file, input);
              const previous = byId.get(file.id);
              byId.set(file.id, { ...previous, ...inspected, readiness: { ...previous?.readiness, ...inspected.readiness } });
            }
          }
          matches[notebook.id] = notebookCompatibility(contract, [...byId.values()], selectedArtifactFileId || undefined);
        } catch (error) { matches[notebook.id] = { status: "unchecked", reasons: [String(error)] }; }
      }
      if (!cancelled) setNotebookMatches(matches);
    })();
    return () => { cancelled = true; };
  }, [JSON.stringify(activeNotebooks.map(n => [n.id, n.document.cells.map(c => [c.metadata?.tags, c.source])])),
      JSON.stringify(inputFiles.map(f => [f.id, f.sha256, f.state])), selectedArtifactFileId]);
  const [browserSaving, setBrowserSaving] = useState(false);
  const [browserSaveError, setBrowserSaveError] = useState("");
  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<{ pending: number; error?: string }>).detail;
      setBrowserSaving(detail.pending > 0);
      if (detail.error) setBrowserSaveError(detail.error);
    };
    window.addEventListener("analysis-storage-state", listener);
    return () => window.removeEventListener("analysis-storage-state", listener);
  }, []);
  const restoringResults = useRef(new Map<string, Promise<WorkspaceFile>>());
  useEffect(() => {
    const wanted = (analysisWorkspace?.files || []).filter(file =>
      !file.deletedAt && (file.remoteResult?.key.startsWith("template-input:") ||
      file.id === selectedArtifactFileId));
    for (const file of wanted) {
      if (!file.data && file.remoteResult && !file.error) void restoreResult(file).catch(error => {
        if (workspaceRef.current?.workspace.id === file.workspaceId) upsertFiles([{ ...file, error: String(error) }]);
        setStatus(`Result recovery failed: ${String(error)}`);
      });
    }
  }, [analysisWorkspace?.files, selectedArtifactFileId]);

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

  const workspaceSyncSignature = useMemo(() => {
    if (!analysisWorkspace) return "";
    const reusableFiles = analysisWorkspace.files.filter((file) =>
      !file.deletedAt && (
        file.source === "result" ||
        (file.role !== "chat-attachment" &&
          file.state === "ready" && (file.role === "template-input" || /template/i.test(file.name)))
      )
    );
    return JSON.stringify({
      workspace: [analysisWorkspace.workspace.id, analysisWorkspace.workspace.name, analysisWorkspace.workspace.revision,
        analysisWorkspace.workspace.lifecycleRevision || 0, analysisWorkspace.workspace.deletedAt || null],
      notebooks: analysisWorkspace.notebooks.map((item) =>
        [item.id, item.name, item.updatedAt, item.deletedAt || null]
      ),
      files: reusableFiles.map((item) => [
        item.id, item.name, item.logicalPath, item.sha256, item.size,
        item.runId || null, item.methodId || null, item.pipelineId || null,
        item.notebookId || null
      ])
    });
  }, [analysisWorkspace]);

  function setRunSyncBarrier(token: string, active: boolean) {
    if (active) syncRunBarrierTokens.current.add(token);
    else syncRunBarrierTokens.current.delete(token);
    setSyncRunBarrierActive(syncRunBarrierTokens.current.size > 0);
  }

  useEffect(() => {
    if (!analysisWorkspace || !bootstrap.context) {
      setRemoteSync(null);
      setLocalSyncDigest("");
      return;
    }
    if (syncRunBarrierActive) {
      workspaceSyncDeferredForRun.current = true;
      return;
    }
    return scheduleWorkspaceCheck({
      delay: workspaceSyncDeferredForRun.current ? 0 : 1000,
      prepare: () => {
        workspaceSyncDeferredForRun.current = false;
        return buildWorkspaceSyncPayload(analysisWorkspace, bootstrap.context!, { inventoryOnly: true });
      },
      status: () => bridge.syncStatus(analysisWorkspace.workspace.id),
      receive: async (payload, remote, active) => {
        setLocalSyncDigest(payload.contentDigest || payload.inventory.digest);
        setRemoteSync(remote); setSyncError("");
        setSyncPhase(phase => phase === "waiting" ? "" : phase);
        await observeLifecycle(remote);
        if (await receiveResultDeletions(remote)) return;
        if (!active() || remote.lifecycle && !["active", "unavailable"].includes(remote.lifecycle)) return;
        if (remoteWorkspaceWasDeleted(analysisWorkspace.workspace, remote)) {
          await discardWorkspaceDeletedInOmero(analysisWorkspace.workspace); return;
        }
        if (remote.canSync && (payload.inventory.items.length > 0 || remote.linked) &&
          (!remote.linked || remote.attachmentRepairNeeded || remote.cleanupPending || syncHasChanges(payload.contentDigest || payload.inventory.digest, remote.inventoryDigest)))
          await synchronizeWorkspace(payload);
      },
      onBusy: () => { setSyncPhase("waiting"); setStatus("Waiting for another workspace synchronization to finish?"); },
      onError: error => { setSyncPhase(""); setSyncError(String(error)); }
    });
  }, [workspaceSyncSignature, bootstrap.context, bridge, syncRunBarrierActive]);

  useEffect(() => () => {
    if (workspaceSyncPollTimer.current != null) {
      window.clearTimeout(workspaceSyncPollTimer.current);
    }
  }, []);

  async function receiveResultDeletions(remote: SyncStatus) {
    const current = workspaceRef.current;
    if (!current) return false;
    let next = reconcileResultDeletions(current, remote);
    if (remote.canSync && (current.workspace.resultStorageVersion || 0) < 2 && !syncRunBarrierTokens.current.size) {
      next = {...next, files: compactResultVersions(next.files, now()), workspace: {...next.workspace, resultStorageVersion: 2}};
      await saveWorkspaceRecord(next.workspace);
    }
    if (next === current) return false;
    workspaceRef.current = next; setWorkspace(next);
    await Promise.all(next.files.filter((file, index) => file !== current.files[index]).map(saveFile));
    setStatus("Results removed in OMERO have been removed from Explorer. Notebooks and inputs are preserved.");
    return true;
  }

  async function observeLifecycle(remote: SyncStatus) {
    const current = workspaceRef.current;
    if (!current) return;
    const state = remote.lifecycle;
    if (!state || state === "unavailable") return;
    const deletedAt = state === "active" ? undefined : current.workspace.deletedAt || now();
    const revision = remote.lifecycleRevision || 0;
    if (revision < (current.workspace.lifecycleRevision || 0)) return;
    if (current.workspace.lifecycleRevision === revision && current.workspace.deletedAt === deletedAt) return;
    const next = { ...current, workspace: { ...current.workspace, deletedAt,
      purgedAt: state === "purged" ? current.workspace.purgedAt || now() : undefined, lifecycleRevision: revision } };
    workspaceRef.current = next; setWorkspace(next);
    await saveWorkspaceRecord(next.workspace);
    if (state !== "active") setStatus("Workspace lifecycle changed. Local work is preserved; review Manage workspaces.");
  }

  useEffect(() => {
    const workspaceRecord = analysisWorkspace?.workspace;
    if (!workspaceRecord) return;
    let disposed = false;
    let checking = false;
    const checkRemoteWorkspace = async () => {
      if (disposed || checking || remoteDeletionInFlight.current || !workspaceRecord.omeroSync || !bootstrap.context) return;
      checking = true;
      try {
        const remote = await bridge.syncStatus(workspaceRecord.id);
        if (disposed) return;
        await observeLifecycle(remote);
        if (remoteWorkspaceWasDeleted(workspaceRecord, remote)) {
          await discardWorkspaceDeletedInOmero(workspaceRecord);
          return;
        }
        setRemoteSync(remote);
        await receiveResultDeletions(remote);
        await observeLifecycle(remote);
      } catch (error) {
        // A failed probe is not evidence of deletion. Keep all local data and
        // allow the normal sync status UI to report transport failures.
        console.warn("Remote Workspace deletion check failed; local data was preserved", error);
      } finally {
        checking = false;
      }
    };
    const onFocus = () => { void checkRemoteWorkspace(); };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void checkRemoteWorkspace();
    };
    const channel = new BroadcastChannel("omero-analysis-lifecycle");
    channel.onmessage = event => {
      if (event.data?.id !== workspaceRecord.id) return;
      void (async () => {
        const stored = await loadWorkspace(workspaceRecord.id);
        const current = workspaceRef.current;
        if (disposed || current?.workspace.id !== workspaceRecord.id) return;
        // Apply local lifecycle changes as well, including workspaces never synced.
        // An explicit purge closes editing without recreating the deleted record.
        if (stored || event.data.action === "purge") {
          const record = stored?.workspace || { ...current.workspace, deletedAt: now(), purgedAt: now() };
          const next = { ...current, workspace: record };
          workspaceRef.current = next; setWorkspace(next);
        }
        await checkRemoteWorkspace();
      })();
    };
    void checkRemoteWorkspace();
    const timer = window.setInterval(() => void checkRemoteWorkspace(), 30_000);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      disposed = true;
      window.clearInterval(timer);
      channel.close();
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [
    analysisWorkspace?.workspace.id,
    analysisWorkspace?.workspace.omeroSync?.datasetId,
    bootstrap.context,
    bridge
  ]);

  useEffect(() => {
    if (!analysisWorkspace || initialLibraryRequestHandled.current) return;
    const url = new URL(window.location.href);
    const requested = url.searchParams.getAll("library_item")
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value > 0);
    if (url.searchParams.get("open_library") !== "1" && !requested.length) return;
    initialLibraryRequestHandled.current = true;
    url.searchParams.delete("open_library");
    url.searchParams.delete("library_item");
    window.history.replaceState({}, "", url);
    void openWorkspaceLibrary(requested, requested.length > 0);
  }, [analysisWorkspace?.workspace.id]);

  useEffect(() => {
    if (!analysisWorkspace || !bootstrap.context || sharedHandoffOpened.current === analysisWorkspace.workspace.id) return;
    sharedHandoffOpened.current = analysisWorkspace.workspace.id;
    if (readSharedHandoff(bootstrap.context, analysisWorkspace.workspace.id).length) void openWorkspaceLibrary();
  }, [analysisWorkspace?.workspace.id]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setWorkspacePreparing(true);
      setWorkspaceError("");
      setWorkspaceProgress({ percent: 5, message: "Opening browser storage…" });
      const [savedTheme, storedContextWorkspaces] = await Promise.all([
        getValue<"dark" | "light">(uiThemeKey), listContextWorkspaces(bootstrap.context)
      ]);
      let localWorkspacesAtStart = storedContextWorkspaces;
      setWorkspaceProgress({ percent: 15, message: "Loading the current Workspace record…" });
      const launch = new URL(window.location.href);
      const newId = launch.searchParams.get("new_workspace");
      const activeWorkspaceKey = `active-workspace:${await contextKey(bootstrap.context)}`;
      const requestedId = launch.searchParams.get("workspace_id") || (!newId ? await getValue<string>(activeWorkspaceKey) : null);
      const names = storedContextWorkspaces.map(item => item.name);
      let number = storedContextWorkspaces.length + 1;
      while (names.includes(scopedWorkspaceName(bootstrap.context, `Analysis ${number}`))) number++;
      const selectedLocal = !newId && storedContextWorkspaces.find(item => item.id === requestedId);
      let baseWorkspace = selectedLocal ? (await loadWorkspace(selectedLocal.id))! :
        await loadOrCreateWorkspace(bootstrap.context, newId || undefined, newId ? `Analysis ${number}` : undefined);
      if (!alive) return;
      if (bootstrap.context) bindSharedHandoff(bootstrap.context, newId, baseWorkspace.workspace);
      if (!bootstrap.embeddedHost && (savedTheme === "dark" || savedTheme === "light")) {
        setTheme(savedTheme);
      }
      setWorkspaceProgress({ percent: 24, message: "Connecting to the current OMERO object…" });
      await bridge.connect();
      if (localWorkspacesAtStart.some((item) => item.omeroSync)) {
        setWorkspaceProgress({
          percent: 29,
          message: "Checking for Workspace changes made in OMERO…"
        });
        const reconciliation = await reconcileDeletedRemoteWorkspaces(
          localWorkspacesAtStart,
          (workspaceId) => bridge.syncStatus(workspaceId),
          deleteWorkspaceCascade
        );
        if (reconciliation.errors.length) {
          console.warn(
            "Remote Workspace deletion check was incomplete; local data was preserved",
            reconciliation.errors
          );
        }
        if (reconciliation.deletedWorkspaceIds.length) {
          const removed = new Set(reconciliation.deletedWorkspaceIds);
          localWorkspacesAtStart = reconciliation.retained;
          if (removed.has(baseWorkspace.workspace.id)) {
            baseWorkspace = await loadOrCreateWorkspace(bootstrap.context);
          }
        }
      }
      setWorkspaceProgress({ percent: 34, message: "Reading OMERO data and viewer capabilities…" });
      const [loadedHierarchy, viewerStatus, queryCapabilities] = await Promise.all([
        bridge.hierarchy(),
        bridge.zarrViewerStatus().catch((error) => ({
          schema_version: 1 as const,
          available: false,
          installed: false,
          enabled: false,
          version: null,
          minimum_version: "0.4.0",
          reason: "not-installed" as const
        })),
        bridge.dataQueryCapabilities().catch(() => null)
      ]);
      setHierarchy(loadedHierarchy);
      setZarrViewerStatus(viewerStatus);
      setDataQueryCapabilities(queryCapabilities);
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
      setWorkspaceProgress({ percent: 45, message: "Discovering installed analysis skills…" });
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
      if (newId && !storedContextWorkspaces.some(item => item.contextKey.endsWith(`:workspace:${newId}`))) {
        const remoteNames = (await bridge.workspaceLibrary()).filter(item =>
          item.sourceObjectType === bootstrap.context?.object_type && item.sourceObjectId === bootstrap.context?.object_id
        );
        const used = new Set([...names, ...remoteNames.map(item => item.workspaceName)]);
        number = Math.max(storedContextWorkspaces.length, remoteNames.length) + 1;
        while (used.has(scopedWorkspaceName(bootstrap.context, `Analysis ${number}`))) number++;
        baseWorkspace = await replaceWorkspace(renameAnalysisWorkspace(baseWorkspace, `Analysis ${number}`, now(), bootstrap.context));
      }
      let initial = baseWorkspace;
      let automaticRestoreMessage = "";
      const requestedSnapshot = bootstrap.context?.selected_workspace_snapshot;
      if (requestedSnapshot && !newId && !localWorkspacesAtStart.some(item => item.id === requestedId)) {
        setWorkspaceProgress({ percent: 55, message: "Restoring the selected Analysis Workspace…" });
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
          initial = await replaceWorkspace(imported);
        }
      } else if (
        bootstrap.context &&
        !newId && (Boolean(requestedId) || localWorkspacesAtStart.length === 0) &&
        !localWorkspacesAtStart.some(item => item.id === requestedId)
      ) {
        try {
          const candidates = (await bridge.workspaceLibrary())
            .filter((dataset) =>
              dataset.sourceObjectType === bootstrap.context!.object_type &&
              dataset.sourceObjectId === bootstrap.context!.object_id &&
              Boolean(dataset.snapshot) && (!requestedId || dataset.workspaceId === requestedId)
            )
            .sort((left, right) =>
              Date.parse(right.updatedAt) - Date.parse(left.updatedAt) ||
              right.revision - left.revision
            );
          const latest = candidates[0];
          if (!latest?.snapshot && launch.searchParams.has("workspace_id")) {
            throw new Error("This workspace has no saved snapshot. Open it in its original browser and synchronize it first.");
          }
          if (latest?.snapshot) {
            setWorkspaceProgress({
              percent: 55,
              message: `Restoring the latest synchronized Workspace from ${latest.datasetName}…`
            });
            const imported = await importWorkspace(
              await bridge.downloadLibraryItem(latest.snapshot.annotationId),
              bootstrap.context, latest.workspaceId
            );
            if (
              imported.workspace.objectType !== bootstrap.context.object_type ||
              imported.workspace.objectId !== bootstrap.context.object_id
            ) {
              throw new Error("The synchronized Workspace belongs to a different OMERO object");
            }
            initial = await replaceWorkspace(imported);
            if (baseWorkspace.workspace.id !== initial.workspace.id &&
                !storedContextWorkspaces.some(item => item.id === baseWorkspace.workspace.id)) {
              await deleteWorkspaceCascade(baseWorkspace.workspace.id);
            }
            automaticRestoreMessage =
              `Restored the latest synchronized Workspace from ${latest.datasetName}`;
          }
        } catch (error) {
          if (launch.searchParams.has("workspace_id")) {
            if (!storedContextWorkspaces.some(item => item.id === baseWorkspace.workspace.id)) {
              await deleteWorkspaceCascade(baseWorkspace.workspace.id);
            }
            throw error;
          }
          console.warn("Automatic AnalysisWorkspace restore was skipped", error);
          automaticRestoreMessage = `Automatic Workspace restore was skipped: ${String(error)}`;
        }
      }
      if (/^Analysis \d+$/.test(initial.workspace.name)) {
        initial = await replaceWorkspace(renameAnalysisWorkspace(initial, initial.workspace.name, now(), bootstrap.context));
      }
      // Source notebooks are imported only after an explicit user selection.
      const requestedNotebook = bootstrap.context?.selected_notebook;
      if (requestedNotebook) {
        let notebook = initial.notebooks.find(
          (item) => item.sourceAnnotationId === requestedNotebook.annotation_id
        );
        if (!notebook) {
          const preparedNotebook = importedNotebookProtocol(
            parseNotebook(await bridge.downloadNotebook(requestedNotebook))
          );
          const timestamp = now();
          notebook = {
            id: id(),
            workspaceId: initial.workspace.id,
            name: requestedNotebook.name,
            ...preparedNotebook,
            sourceAnnotationId: requestedNotebook.annotation_id,
            attachmentIds: [requestedNotebook.annotation_id],
            selectedDataFileIds: [],
            createdAt: timestamp,
            updatedAt: timestamp
          };
          initial = { ...initial, notebooks: [...initial.notebooks, notebook] };
          await saveNotebook(notebook);
        }
        setActiveNotebookId(notebook.id);
      } else if (initial.notebooks.length) {
        setActiveNotebookId(initial.notebooks[0].id);
      }
      setWorkspaceProgress({ percent: 82, message: "Preparing current Workspace inputs…" });
      let prepared = await removePersistedRemoteQueryInputs(await prepareInputs(initial));
      for (const notebook of prepared.notebooks) {
        const contract = parseNotebookProtocol(notebook.document);
        if (contract) prepared = await discoverExactNotebookInputs(contract, prepared, notebook, false);
      }
      if (!alive) return;
      setWorkspace(prepared);
      workspaceRef.current = prepared;
      await setValue(activeWorkspaceKey, prepared.workspace.id);
      setWorkspaceProgress({ percent: 94, message: "Finishing the Analysis interface…" });

      if (alive) {
        setRuntimeReady(true);
        setRuntimeProgress({ percent: 100, message: "Browser Python starts when an analysis needs it" });
        setStatus(automaticRestoreMessage || "Ready — browser Python will start when needed");
        setStorage(await storageEstimate());
        setWorkspaceProgress({ percent: 100, message: "Workspace ready" });
        setWorkspacePreparing(false);
      }
    })().catch((error) => {
      if (!alive) return;
      setStatus(`Workspace failed: ${String(error)}`);
      setWorkspaceError(String(error));
      setWorkspaceProgress({ percent: 0, message: "Workspace preparation failed" });
      setWorkspacePreparing(false);
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
      const selectedMode = bootstrap.context?.data_bindings?.[
        String(attachment.annotation_id)
      ] || attachment.default_mode || "local";
      const file: WorkspaceFile = {
        id: id(),
        workspaceId: next.workspace.id,
        name: attachment.name,
        logicalPath: `${next.workspace.rootPath}/inputs/${attachment.annotation_id}--${attachment.name}`,
        type: attachment.mimetype,
        size: attachment.size,
        sha256: "",
        source: "omero",
        state: selectedMode === "remote" ? "ready" : "loading",
        annotationId: attachment.annotation_id,
        fileId: attachment.file_id,
        dataQueryMode: selectedMode,
        createdAt: now()
      };
      if (selectedMode === "remote") {
        const started = Date.now();
        const describe = (value: Record<string, any> = {}) => {
          const sent = Number(value.sent || 0);
          const transferring = value.stage === "transferring";
          setWorkspaceProgress({
            percent: transferring ? sent / Math.max(1, attachment.size) * 100 : 0,
            indeterminate: !transferring,
            message: `${transferring ? "Transferring to DataQueryWorker" : value.stage === "inspecting" ? "Checking database on DataQueryWorker" : "Preparing DataQueryWorker source"}: ${attachment.name}`,
            detail: `${transferring ? `${bytesLabel(sent)} of ` : ""}${bytesLabel(attachment.size)} · ${Math.floor((Date.now() - started) / 1000)} seconds elapsed. The database stays on the server; only query results are returned to your browser.`
          });
        };
        describe();
        Object.assign(file, await prepareRemoteInput(file,
          () => bridge.remoteSchema(attachment.annotation_id, describe)));
      }
      next = { ...next, files: [...next.files, file] };
      existing.set(attachment.annotation_id, file);
    }
    // A transient worker failure must not leave a persisted input unusable forever.
    // Retry only references already present when opening this Workspace; the broker
    // reauthorizes them against the current source and group on every request.
    const remoteRetries = initial.files.filter(file => file.source === "omero" &&
      file.dataQueryMode === "remote" && file.annotationId && file.state !== "ready" && !file.deletedAt);
    for (const file of remoteRetries) {
      const prepared = await prepareRemoteInput(file, () => bridge.remoteSchema(file.annotationId!));
      next = { ...next, files: next.files.map(item => item.id === file.id ? prepared : item) };
    }
    const candidates = next.files.filter(
      (file) => file.source === "omero" && file.dataQueryMode !== "remote" &&
        file.annotationId && (!file.data || file.state !== "ready")
    );
    const additionalBytes = candidates.reduce((total, file) => total + file.size, 0);
    const capacityError = capacityWarning(
      workspaceBytes(next) - additionalBytes,
      additionalBytes,
      await storageEstimate(),
      MAX_WORKSPACE_BYTES
    );
    if (capacityError) {
      throw new Error(
        `${capacityError}. The 2 GiB server limit is a transport limit; browser storage must also be available.`
      );
    }
    for (let index = 0; index < candidates.length; index += 1) {
      const file = candidates[index];
      setWorkspaceProgress({
        percent: 0,
        indeterminate: true,
        message: `Downloading browser input ${index + 1} of ${candidates.length}: ${file.name}`,
        detail: `${bytesLabel(file.size)} · Browser analysis downloads this file into your workspace.`
      });
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
    return next;
  }

  function localFallbackSource(
    error: unknown,
    current: AnalysisWorkspace
  ): WorkspaceFile | null {
    if (!(error instanceof ArtifactBindingError) || !error.referencedName) return null;
    const candidates = downloadableWorkspaceInputs(error.referencedName, current.files)
      .filter((file) => file.dataQueryMode !== "remote");
    return candidates.length === 1 ? candidates[0] : null;
  }

  async function legacyRemoteUpgrade(
    error: unknown,
    code: string,
    current: AnalysisWorkspace,
    artifactKey: string
  ): Promise<{ code: string; bindings: RemoteQueryBindingV2[] } | null> {
    if (!(error instanceof ArtifactBindingError) || !error.referencedName) return null;
    const candidates = downloadableWorkspaceInputs(error.referencedName, current.files)
      .filter((file) => file.dataQueryMode === "remote" && isOmeroDataQuerySource(file));
    if (candidates.length !== 1) return null;
    const source = candidates[0];
    const format = dataQuerySourceFormat(source);
    if (!format || !source.annotationId) return null;
    const schema = await bridge.remoteSchema(source.annotationId);
    const tables = (Array.isArray(schema.tables) ? schema.tables : [])
      .map((table: any) => String(table.name || ""))
      .filter(Boolean);
    const upgraded = upgradeLegacyDatabaseCode(code, artifactKey, tables, source.name);
    if (!upgraded) return null;
    const bindings = upgraded.recipes.map((recipe): RemoteQueryBindingV2 => ({
      version: 2,
      bindingId: recipe.bindingId,
      capability: "omero-data-query-v1",
      format,
      sourceName: source.name,
      preferredAnnotationId: source.annotationId,
      preferredFileId: source.fileId || undefined,
      schemaDigest: String(schema.schema_digest || ""),
      sql: recipe.sql,
      parameters: {},
      outputCsvName: recipe.outputCsvName
    }));
    return { code: upgraded.code, bindings };
  }

  async function offerLocalFallback(
    error: unknown,
    current: AnalysisWorkspace,
    artifactName: string
  ): Promise<AnalysisWorkspace | null> {
    const source = localFallbackSource(error, current);
    if (!source) return null;
    const capacityError = capacityWarning(
      workspaceBytes(current), source.size, await storageEstimate(), MAX_WORKSPACE_BYTES
    );
    if (capacityError) {
      await dialogs.alert(
        "Local data required",
        `${artifactName} opens a DuckDB or SQLite file directly and needs the database in browser storage. ` +
        capacityError
      );
      return null;
    }
    const confirmed = await dialogs.confirm(
      "Download database for this legacy analysis?",
      `${artifactName} opens its database path directly and the matching Workspace source is not currently downloaded. ` +
      `Download ${source.name} (${bytesLabel(source.size)}) into browser storage and continue ` +
      `locally? The worker cache remains available for remote-bound analyses.`,
      "Download and continue"
    );
    if (!confirmed) return null;
    setStatus(`Downloading ${source.name} for local analysis…`);
    setRuntimeProgress({ percent: 5, message: `Downloading ${source.name}…` });
    const attachment: Attachment = {
      annotation_id: source.annotationId!,
      file_id: source.fileId || 0,
      name: source.name,
      mimetype: source.type,
      size: source.size,
      kind: "attachment",
      supported: true
    };
    const data = await bridge.download(attachment);
    const digest = await sha256(data);
    if (source.sha256 && source.sha256 !== digest) {
      throw new Error(`OMERO input ${source.name} no longer matches the Workspace hash`);
    }
    const completed: WorkspaceFile = {
      ...source,
      data,
      size: data.byteLength,
      sha256: digest,
      dataQueryMode: "local",
      remoteSchemaDigest: undefined,
      state: "ready",
      error: undefined
    };
    const next = {
      ...current,
      files: current.files.map((file) => file.id === source.id ? completed : file)
    };
    await saveFile(completed);
    workspaceRef.current = next;
    setWorkspace(next);
    await syncRuntimeIfStarted(
      next.files,
      `${source.name} downloaded; continuing ${artifactName} locally`
    );
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
      (file) => file.source !== "result" && file.role !== "chat-attachment" &&
        file.state === "ready" && Boolean(file.data) && !file.deletedAt
    );
    if (runtime.started) {
      await runtime.syncInputs(inputs);
    } else {
      await runtime.start(inputs, reportRuntime);
      runtimeStarted.current = true;
    }
    setRuntimeReady(true);
    setRuntimeProgress({ percent: 100, message: "Browser Python is ready" });
  }

  async function ensureRuntime(files = workspaceRef.current?.files || []) {
    if (!runtime.started) await startRuntime(files);
    return runtime;
  }

  async function inspectSharedLocalInputs(): Promise<Record<string, CompatibilitySource["schema"]>> {
    const files = workspaceRef.current?.files.filter(f => !f.deletedAt && f.state === "ready" && f.data && f.source !== "result" && f.role !== "chat-attachment") || [];
    if (!files.length) return {};
    await inspectionRuntime.start(files);
    // Library inspection uses its own kernel and cannot erase notebook variables.
    const inspected = await inspectionRuntime.profileInputs();
    setProfiles(inspected);
    return Object.fromEntries(files.map(file => {
      const profile = inspected.find(p => p.path === `/input/${notebookRuntimeName(file.name)}`);
      if (!profile || profile.error) return [file.id, undefined];
      const summary = profile.summary;
      return [file.id, Array.isArray(summary.tables) ? summary : Array.isArray(summary.columns)
        ? { tables: [{ name: "data", columns: summary.columns }] } : undefined];
    })) as Record<string, CompatibilitySource["schema"]>;
  }

  async function resolveRemoteBindingSource(
    binding: RemoteQueryBinding,
    current: AnalysisWorkspace
  ): Promise<{ source: WorkspaceFile; schema: Record<string, any> }> {
    const candidates = dataQueryBindingCandidates(binding, current.files);
    if (!candidates.length) {
      throw new Error(
        `No authorized ${remoteBindingFormat(binding)} source is attached to this Workspace`
      );
    }
    const preferredAnnotationId = remoteBindingPreferredAnnotationId(binding);
    const preferredFileId = remoteBindingPreferredFileId(binding);
    const preferred = candidates.find((file) =>
      file.annotationId === preferredAnnotationId &&
      (!preferredFileId || file.fileId === preferredFileId)
    );
    const ordered = preferred
      ? [preferred, ...candidates.filter((file) => file.id !== preferred.id)]
      : candidates;
    const compatible: Array<{ source: WorkspaceFile; schema: Record<string, any> }> = [];
    for (const source of ordered) {
      const schema = await bridge.remoteSchema(source.annotationId!);
      if (String(schema.schema_digest || "") === binding.schemaDigest) {
        compatible.push({ source, schema });
      }
    }
    if (!compatible.length) {
      throw new Error(
        `No ${remoteBindingFormat(binding)} source has the schema required by this Method`
      );
    }
    if (preferred) {
      const exact = compatible.find((item) => item.source.id === preferred.id);
      if (exact) return exact;
    }
    if (compatible.length === 1) return compatible[0];
    const selected = await dialogs.choose(
      "Bind the database",
      compatible.map(({ source }) => ({
        value: source.id,
        label: source.name,
        description: `OMERO annotation ${source.annotationId}`
      })),
      "Choose the current plate data source for this reusable query. Local and remote sources are both supported."
    );
    if (!selected) throw new Error("Remote data rebinding was cancelled");
    return compatible.find(({ source }) => source.id === selected) || compatible[0];
  }

  async function materializeRemoteQueryBindings(
    bindings: RemoteQueryBinding[],
    current: AnalysisWorkspace
  ): Promise<AnalysisWorkspace> {
    const unique = Array.from(new Map(
      bindings.map((binding) => [remoteBindingId(binding), binding])
    ).values());
    if (!unique.length) {
      activeRemoteQueryDigests.current = [];
      activeRemoteQuerySources.current = {};
      if (runtimeStarted.current) await runtime.syncRemoteQueries([]);
      return current;
    }
    const prepared: RemoteQueryRuntimeResult[] = [];
    const resolvedSources: Record<string, string> = {};
    for (const binding of unique) {
      if (
        ![1, 2].includes(binding.version) || binding.capability !== "omero-data-query-v1" ||
        !/^[A-Za-z0-9][A-Za-z0-9._-]*\.csv$/i.test(binding.outputCsvName) ||
        !/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(remoteBindingId(binding))
      ) {
        throw new Error("Invalid remote query binding");
      }
      const { source } = await resolveRemoteBindingSource(binding, current);
      const result = await bridge.remoteQuery(
        source.annotationId!, binding.sql, binding.parameters
      );
      if (typeof result.result_token !== "string") {
        throw new Error("Remote query did not return a result token");
      }
      const data = await bridge.downloadRemoteResult(result.result_token);
      if (data.byteLength !== Number(result.byte_count)) {
        throw new Error("Remote query result size changed during download");
      }
      prepared.push({
        bindingId: remoteBindingId(binding),
        name: binding.outputCsvName,
        data,
        sourceDigest: String(result.source_sha256 || await sha256(data))
      });
      resolvedSources[`query:${remoteBindingId(binding)}`] = source.name;
    }
    await ensureRuntime(current.files);
    await runtime.syncRemoteQueries(prepared);
    activeRemoteQueryDigests.current = prepared.map((item) => item.sourceDigest).sort();
    activeRemoteQuerySources.current = resolvedSources;
    return current;
  }

  async function removePersistedRemoteQueryInputs(
    current: AnalysisWorkspace
  ): Promise<AnalysisWorkspace> {
    const queryNames = new Set([
      ...current.pipelines.flatMap((item) => item.remoteQueryBindings || []),
      ...current.notebooks.flatMap((item) => item.remoteQueryBindings || []),
      ...current.executions.flatMap((item) => item.remoteQueryBindings || [])
    ].map((binding) => binding.outputCsvName.toLowerCase()));
    if (!queryNames.size) return current;
    const stale = current.files.filter((file) =>
      file.source === "local" && file.role !== "chat-attachment" &&
      queryNames.has(file.name.toLowerCase()) &&
      file.logicalPath.toLowerCase().includes("/inputs/")
    );
    if (!stale.length) return current;
    await Promise.all(stale.map((file) => deleteStoredFile(file.id)));
    const staleIds = new Set(stale.map((file) => file.id));
    return { ...current, files: current.files.filter((file) => !staleIds.has(file.id)) };
  }

  async function syncRuntimeIfStarted(files: WorkspaceFile[], finalStatus: string) {
    setProfiles([]);
    if (runtimeStarted.current) {
      await restartRuntime(files, finalStatus);
      return;
    }
    setRuntimeReady(true);
    setRuntimeProgress({ percent: 100, message: "Browser Python starts when an analysis needs it" });
    setStatus(finalStatus);
  }

  async function restartRuntime(files: WorkspaceFile[], finalStatus: string) {
    await startRuntime(files);
    setProfiles(await runtime.profileInputs());
    setRuntimeReady(true);
    setRuntimeProgress({ percent: 100, message: "Browser Python is ready" });
    setStatus(finalStatus);
  }

  async function commitWorkspaceRecord(next: WorkspaceRecord): Promise<WorkspaceRecord> {
    const persisted = await saveWorkspaceRecord(next);
    const latest = workspaceRef.current;
    if (!latest || latest.workspace.id !== persisted.id) return persisted;
    if ((latest.workspace.revision || 0) >= (persisted.revision || 0)) return persisted;
    const updated = { ...latest, workspace: persisted };
    workspaceRef.current = updated;
    setWorkspace(updated);
    return persisted;
  }

  function updateWorkspaceRecord(next: WorkspaceRecord) {
    let current = workspaceRef.current;
    if (current) {
      const updated = { ...current, workspace: next };
      workspaceRef.current = updated;
      setWorkspace(updated);
    }
    void commitWorkspaceRecord(next);
  }

  function upsertFiles(values: WorkspaceFile[]) {
    if (!values.length) return;
    values = values.map(file => file.type === "video/mp4" && file.source === "result" && file.data
      ? { ...file, mediaBlob: new Blob([file.data], { type: file.type }), data: undefined } : file);
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

  async function uploadNotebookFile(file: File, throwOnError = false) {
    const current = workspaceRef.current;
    if (!current) return;
    if (!file.name.toLowerCase().endsWith(".ipynb")) {
      if (throwOnError) throw new Error("Only .ipynb notebooks can be uploaded");
      setStatus("Only .ipynb notebooks can be uploaded");
      return;
    }
    if (file.size > 32 * 1024 * 1024) {
      if (throwOnError) throw new Error("Notebook exceeds the 32 MiB upload limit");
      setStatus("Notebook exceeds the 32 MiB upload limit");
      return;
    }
    try {
      const data = await file.arrayBuffer();
      const parsed = parseNotebook(data);
      const protocol = parseNotebookProtocol(parsed);
      const document = protocol ? sanitizeProtocolNotebook(parsed) : parsed;
      // Automatic sync persists this notebook in the user-owned workspace.
      const timestamp = now();
      const record: NotebookRecord = {
        id: id(),
        workspaceId: current.workspace.id,
        name: file.name,
        document,
        sourceAnnotationId: undefined,
        attachmentIds: [],
        selectedDataFileIds: current.files
          .filter((item) => item.source !== "result" && item.role !== "chat-attachment" && !item.deletedAt)
          .map((item) => item.id),
        parameterValues: protocol ? parameterDefaults(protocol) : undefined,
        portabilityWarning: protocol
          ? undefined
          : "Legacy notebook: input paths are rebound by filename and the notebook is not portable between Local and Remote query sources.",
        createdAt: timestamp,
        updatedAt: timestamp
      };
      const updated = { ...current, notebooks: [...current.notebooks, record] };
      workspaceRef.current = updated;
      setWorkspace(updated);
      setActiveNotebookId(record.id);
      setActiveTab("notebooks");
      await saveNotebook(record);
      setStatus(`Imported ${record.name} into your workspace${protocol ? "" : "; legacy portability warning added"}`);
    } catch (error) {
      setStatus(`Notebook upload failed: ${String(error)}`);
      if (throwOnError) throw error;
    }
  }

  async function resolveNotebookProtocolBinding(
    input: NotebookProtocolInput,
    record: NotebookRecord,
    current: AnalysisWorkspace
  ): Promise<NotebookProtocolBinding | null> {
    const previous = record.protocolBindings?.find((binding) => binding.inputId === input.id);
    const candidates = [];
    const reasons: string[] = [];
    for (const file of inputCandidates(input, current.files, previous?.fileId)) {
      const match = inputCompatibility(input, await inspectForNotebook(file, input));
      if (match.status === "compatible") candidates.push(file);
      else reasons.push(...match.reasons);
    }
    if (!candidates.length && input.required && reasons.length) throw new Error(reasons.join("; "));
    let source = (previous ? candidates.find(file => file.id === previous.fileId) : undefined) ||
      candidates.find(file => file.id === selectedArtifactFileId);
    if (!source && candidates.length === 1) source = candidates[0];
    if (!source && candidates.length > 1) {
      const selected = await dialogs.choose(
        `Bind notebook input “${input.id}”`,
        candidates.map((file) => ({
          value: file.id,
          label: file.name,
          description: input.kind === "query"
            ? `${file.dataQueryMode === "remote" || !file.data ? "Remote" : "Local"} ${notebookQueryFormat(file.name)} source`
            : `Supporting ${extensionOf(file.name)} file`
        })),
        input.kind === "query"
          ? "Choose a schema-compatible source. This binding can be changed for another plate."
          : "Choose the supporting file for this notebook."
      );
      if (selected) source = candidates.find((file) => file.id === selected);
    }
    if (!source) {
      if (!input.required) return null;
      throw new Error(`Required notebook input “${input.id}” has no compatible Workspace file`);
    }
    if (input.kind === "file" && !source.data) {
      throw new Error(`Supporting notebook input ${source.name} must be downloaded before execution`);
    }
    const mode: "local" | "remote" = input.kind === "query" &&
      (source.dataQueryMode === "remote" || !source.data)
      ? "remote"
      : "local";
    if (mode === "remote" && !source.annotationId) {
      throw new Error(`Remote notebook input ${source.name} is not an OMERO attachment`);
    }
    let schemaDigest = source.remoteSchemaDigest;
    let sourceDigest: string | undefined = source.sha256;
    if (input.kind === "query" && mode === "remote" && source.annotationId) {
      const schema = await bridge.remoteSchema(source.annotationId);
      schemaDigest = String(schema.schema_digest || schemaDigest || "") || undefined;
      sourceDigest = String(schema.source_sha256 || sourceDigest || "") || undefined;
      if (input.schema?.tables?.length) {
        const match = inputCompatibility({ ...input, readiness: undefined }, { id: source.id, name: source.name, schema });
        if (match.status !== "compatible") throw new Error(match.reasons.join("; "));
      }
    }
    if (input.kind === "query" && mode === "local" && input.schema?.tables?.length) {
      const schemas = await inspectSharedLocalInputs();
      const match = inputCompatibility({ ...input, readiness: undefined }, { id: source.id, name: source.name, schema: schemas[source.id] });
      if (match.status !== "compatible") throw new Error(match.reasons.join("; "));
    }
    return {
      inputId: input.id,
      fileId: source.id,
      name: source.name,
      kind: input.kind,
      mode,
      path: `/input/${notebookRuntimeName(source.name)}`,
      format: input.kind === "query" ? notebookQueryFormat(source.name) : undefined,
      annotationId: source.annotationId,
      originalFileId: source.fileId,
      schemaDigest,
      sourceDigest
    };
  }

  async function discoverExactNotebookInputs(
    contract: NotebookProtocolContract,
    current: AnalysisWorkspace,
    record: NotebookRecord,
    interactive = true
  ): Promise<AnalysisWorkspace> {
    const missing = contract.inputs.filter((input) => inputCandidates(input, current.files,
      record.protocolBindings?.find(binding => binding.inputId === input.id)?.fileId).length === 0);
    const localQueryInputs = contract.inputs.filter((input) => input.kind === "query").flatMap((input) =>
      inputCandidates(input, current.files).filter((file) =>
        file.source === "omero" && file.dataQueryMode !== "remote" &&
        file.name.toLowerCase() === input.path.split(/[\\/]/).pop()?.toLowerCase()
      )
    );
    if ((!missing.length && !localQueryInputs.length) || !bootstrap.context) return current;

    const attachments = await bridge.listAttachments();
    let next = current;
    for (const source of localQueryInputs) {
      const attachment = attachments.find((candidate) =>
        candidate.annotation_id === source.annotationId && candidate.default_mode === "remote" &&
        candidate.allowed_modes?.includes("remote") === true
      );
      if (!attachment) continue;
      const schema = await bridge.remoteSchema(attachment.annotation_id);
      const promoted: WorkspaceFile = {
        ...source,
        data: undefined,
        size: attachment.size,
        sha256: "",
        state: "ready",
        dataQueryMode: "remote",
        remoteSchemaDigest: String(schema.schema_digest || "") || undefined,
        error: undefined
      };
      next = {
        ...next,
        files: next.files.map((file) => file.id === source.id ? promoted : file)
      };
      await saveFile(promoted);
    }
    for (const input of missing) {
      const expectedName = input.path.split(/[\\/]/).pop()?.toLowerCase();
      if (!expectedName) continue;
      const previous = record.protocolBindings?.find(binding => binding.inputId === input.id);
      const matches = notebookAttachmentCandidates(input, attachments, previous).filter((candidate) =>
        !next.files.some((file) => file.annotationId === candidate.annotation_id)
      );
      let attachment = matches.length === 1 ? matches[0] : undefined;
      if (matches.length > 1 && interactive) {
        const selected = await dialogs.choose(`Choose notebook input “${input.id}”`, matches.map(item => ({
          value: String(item.annotation_id), label: item.name, description: "Attached to the current source"
        })), "Several attachments match. Choose the file for this analysis.");
        attachment = matches.find(item => String(item.annotation_id) === selected);
      }
      if (!attachment) continue;

      const remote = input.kind === "query" && attachment.default_mode === "remote" &&
        attachment.allowed_modes?.includes("remote") === true;
      const file: WorkspaceFile = {
        id: id(),
        workspaceId: next.workspace.id,
        name: attachment.name,
        logicalPath: `${next.workspace.rootPath}/inputs/${attachment.annotation_id}--${attachment.name}`,
        type: attachment.mimetype,
        size: attachment.size,
        sha256: "",
        source: "omero",
        state: remote ? "ready" : "loading",
        annotationId: attachment.annotation_id,
        fileId: attachment.file_id,
        dataQueryMode: remote ? "remote" : "local",
        createdAt: now()
      };
      if (remote) {
        const schema = await bridge.remoteSchema(attachment.annotation_id);
        file.remoteSchemaDigest = String(schema.schema_digest || "") || undefined;
      } else {
        const capacityError = capacityWarning(
          workspaceBytes(next), attachment.size, await storageEstimate(), MAX_WORKSPACE_BYTES
        );
        if (capacityError) {
          throw new Error(`Notebook input ${attachment.name} cannot be downloaded: ${capacityError}`);
        }
        const data = await bridge.download(attachment);
        file.data = data;
        file.size = data.byteLength;
        file.sha256 = await sha256(data);
        file.state = "ready";
      }
      next = { ...next, files: [...next.files, file] };
      await saveFile(file);
    }
    if (next !== current) {
      workspaceRef.current = next;
      setWorkspace(next);
    }
    return next;
  }

  async function runNotebookBrokerQuery(
    bindings: NotebookProtocolBinding[],
    request: NotebookQueryRequest
  ): Promise<{ data: ArrayBuffer; metadata: Record<string, unknown> }> {
    const binding = bindings.find((item) => item.inputId === request.source);
    if (!binding || binding.kind !== "query") {
      throw new Error(`Notebook query source is not bound: ${request.source}`);
    }
    if (binding.mode !== "remote" || !binding.annotationId) {
      throw new Error(`Notebook source ${request.source} is not a remote OMERO binding`);
    }
    const brokerStarted = performance.now();
    const result = await bridge.remoteQuery(
      binding.annotationId,
      request.sql,
      typedNotebookQueryParameters(request.parameters)
    );
    const brokerQueryMs = performance.now() - brokerStarted;
    if (typeof result.result_token !== "string") {
      throw new Error("Remote notebook query did not return a result token");
    }
    const downloadStarted = performance.now();
    const data = await bridge.downloadRemoteResult(result.result_token);
    const downloadMs = performance.now() - downloadStarted;
    if (data.byteLength !== Number(result.byte_count)) {
      throw new Error("Remote notebook query result size changed during download");
    }
    return {
      data,
      metadata: {
        cache_status: result.cache_status,
        row_count: Number(result.row_count),
        byte_count: Number(result.byte_count),
        worker_duration_ms: Number(result.duration_ms),
        source_sha256: result.source_sha256,
        sql_sha256: result.sql_sha256,
        broker_query_ms: brokerQueryMs,
        download_ms: downloadMs
      }
    };
  }

  async function loadNotebookParameterChoices(record: NotebookRecord) {
    const current=workspaceRef.current;
    const contract=parseNotebookProtocol(record.document);
    if(!current || !contract) throw new Error("Choose a portable notebook first.");
    const choices:NonNullable<NotebookRecord["parameterChoices"]>={};
    const labels:NonNullable<NotebookRecord["parameterChoiceLabels"]>={};
    for(const parameter of contract.parameters){
      const query=parameter.choices_query;if(!query)continue;
      const input=contract.inputs.find(i=>i.id===query.source);
      if(!input || input.kind!=="query") throw new Error(`Choose a database input for ${parameter.name}.`);
      const pin=record.protocolBindings?.find(b=>b.inputId===input.id)?.fileId;
      const candidates=inputCandidates(input,current.files,pin);
      const file=candidates.find(f=>f.id===pin)||(candidates.length===1?candidates[0]:undefined);
      if(!file)throw new Error(`Choose the workspace input for ${input.id} in Notebook setup, then retry choices.`);
      const sql=`SELECT * FROM (${query.sql.replace(/;\s*$/, "")}) AS choices LIMIT ${query.limit}`;
      const task=inspectionQueue.current.catch(()=>undefined).then(()=>queryInputChoices(file,sql,bridge,inspectionRuntime));
      inspectionQueue.current=task.catch(()=>undefined);
      const result=await task;
      const valueIndex=query.value_column?result.columns.indexOf(query.value_column):0;
      const labelIndex=query.label_column?result.columns.indexOf(query.label_column):-1;
      if(valueIndex<0 || (query.label_column && labelIndex<0))throw new Error(`Choices query for ${parameter.name} is missing its configured value or label column.`);
      const rows=result.rows.slice(0,query.limit).filter(row=>["string","number","boolean"].includes(typeof row[valueIndex]));
      choices[parameter.name]=rows.map(row=>row[valueIndex] as string|number|boolean);
      labels[parameter.name]=rows.map(row=>labelIndex>=0?String(row[labelIndex]??""):String(row[valueIndex]));
    }
    return {choices,labels};
  }

  async function prepareProtocolNotebook(record: NotebookRecord): Promise<NotebookRecord> {
    let current = workspaceRef.current;
    if (!current) throw new Error("Workspace is unavailable");
    const contract = parseNotebookProtocol(record.document);
    if (!contract) {
      runtime.setNotebookQueryHandler(null);
      return record;
    }
    current = await discoverExactNotebookInputs(contract, current, record);
    // Input choices share one dialog host; resolve them sequentially.
    const bindings: NotebookProtocolBinding[] = [];
    for (const input of contract.inputs) {
      const binding = await resolveNotebookProtocolBinding(input, record, current);
      if (binding) bindings.push(binding);
    }
    const parameters = {
      ...parameterDefaults(contract),
      ...(record.parameterValues || {})
    };
    const parameterChoices = { ...(record.parameterChoices || {}) };
    const parameterChoiceLabels = { ...(record.parameterChoiceLabels || {}) };
    if(contract.parameters.some(p=>p.choices_query)) {
      const loaded=await loadNotebookParameterChoices({...record,protocolBindings:bindings});
      Object.assign(parameterChoices,loaded.choices);Object.assign(parameterChoiceLabels,loaded.labels);
      for(const parameter of contract.parameters)if(parameter.choices_query && parameters[parameter.name]==null && parameterChoices[parameter.name]?.length)parameters[parameter.name]=parameterChoices[parameter.name][0];
    }
    const validatedParameters = validateParameterValues(contract, parameters, parameterChoices);
    const changed: NotebookRecord = {
      ...record,
      protocolBindings: bindings,
      parameterValues: validatedParameters,
      parameterChoices,
      parameterChoiceLabels,
      selectedDataFileIds: bindings.map((binding) => binding.fileId),
      portabilityWarning: undefined,
      updatedAt: now()
    };
    await updateNotebook(changed);
    runtime.setNotebookQueryHandler((request) => runNotebookBrokerQuery(bindings, request));
    await runtime.configureNotebook({ contract, bindings, parameters: validatedParameters });
    return changed;
  }

  async function prepareNotebookRuntime(
    record: NotebookRecord
  ): Promise<{ inputs: WorkspaceFile[]; notebook: NotebookRecord }> {
    let current = workspaceRef.current;
    if (!current) throw new Error("Workspace is not ready");
    const protocol = parseNotebookProtocol(record.document);
    if (protocol) {
      await ensureRuntime(current.files);
      return { inputs: current.files, notebook: record };
    }
    let bindings = record.remoteQueryBindings || [];
    const cells = [] as NotebookRecord["document"]["cells"];
    for (let index = 0; index < record.document.cells.length; index += 1) {
      const cell = record.document.cells[index];
      if (cell.cell_type !== "code") {
        cells.push(cell);
        continue;
      }
      let code = Array.isArray(cell.source) ? cell.source.join("") : cell.source;
      code = bindRemoteQueryCode(code, bindings);
      try {
        bindPythonInputsStrict(code, current.files);
      } catch (error) {
        const remote = await legacyRemoteUpgrade(
          error, code, current, `${record.id}-cell-${index + 1}`
        );
        if (remote) {
          bindings = [...bindings, ...remote.bindings];
          code = remote.code;
        } else {
          const local = await offerLocalFallback(error, current, record.name);
          if (!local) throw error;
          current = local;
          bindPythonInputsStrict(code, current.files);
        }
      }
      cells.push({ ...cell, source: code });
    }
    current = await materializeRemoteQueryBindings(bindings, current);
    const changed: NotebookRecord = {
      ...record,
      document: { ...record.document, cells },
      remoteQueryBindings: bindings,
      portabilityWarning: bindings.length
        ? "Large OMERO databases are queried remotely; only bounded CSV results enter the browser runtime."
        : record.portabilityWarning,
      updatedAt: now()
    };
    if (JSON.stringify(changed.document) !== JSON.stringify(record.document) ||
        JSON.stringify(changed.remoteQueryBindings) !== JSON.stringify(record.remoteQueryBindings)) {
      await updateNotebook(changed);
    }
    await ensureRuntime(current.files);
    return { inputs: current.files, notebook: changed };
  }

  async function renameNotebook(record: NotebookRecord) {
    const requested = (await dialogs.askText(
      "Rename notebook",
      record.name
    ))?.trim();
    if (!requested) return;
    const current = workspaceRef.current;
    if (!current) return;
    const stem = slug(requested.replace(/\.ipynb$/i, ""));
    let name = `${stem}.ipynb`;
    let suffix = 2;
    while (current.notebooks.some((notebook) =>
      notebook.id !== record.id && notebook.name.toLowerCase() === name.toLowerCase()
    )) {
      name = `${stem}-${suffix}.ipynb`;
      suffix += 1;
    }
    await updateNotebook({ ...record, name, updatedAt: now() });
    setStatus(`Renamed notebook to ${name}`);
  }

  function downloadNotebook(record: NotebookRecord) {
    downloadBytes(
      record.name,
      serializeNotebook(record.document),
      "application/x-ipynb+json"
    );
  }

  async function updateNotebook(record: NotebookRecord) {
    const current = workspaceRef.current;
    if (!current) return;
    const completed = record.protocolRuns?.at(-1);
    const previous = current.notebooks.find(item => item.id === record.id)?.protocolRuns?.at(-1);
    const files = (completed?.status === "success" || completed?.status === "failed") && completed.completedAt !== previous?.completedAt
      ? await completeNotebookResults(current.files, record, current.workspace.rootPath)
      : current.files;
    const updated = {
      ...current,
      files,
      notebooks: current.notebooks.map((item) => item.id === record.id ? record : item)
    };
    workspaceRef.current = updated;
    setWorkspace(updated);
    await saveNotebook(record);
    await Promise.all(files.filter((file, index) => file !== current.files[index]).map(saveFile));
  }

  async function saveNotebookFiles(
    record: NotebookRecord,
    generated: RuntimeOutput["files"]
  ) {
    const current = workspaceRef.current;
    if (!current || !generated.length) return;
    const additions: WorkspaceFile[] = [];
    const run = record.protocolRuns?.at(-1);
    const parameterKey = run ? await notebookParameterKey(record.id, run) : undefined;
    for (const output of generated) {
      const data = output.data.slice(0);
      additions.push({
        id: id(),
        workspaceId: current.workspace.id,
        notebookId: record.id,
        notebookParameterKey: parameterKey,
        notebookRunStartedAt: run?.startedAt,
        notebookRunId: run?.id,
        name: output.name,
        logicalPath: parameterKey
          ? notebookResultPath(current.workspace.rootPath, record.name, parameterKey, output.name, run?.id)
          : `${current.workspace.rootPath}/Notebooks/Results/${record.name}/${output.name}`,
        type: output.type,
        size: data.byteLength,
        sha256: await sha256(data),
        source: "result",
        state: "ready",
        data,
        resultGroupId: output.resultGroupId, movie: output.movie,
        createdAt: now()
      });
    }
    upsertFiles(additions);
  }

  async function renderNotebookZarrRequest(
    _record: NotebookRecord,
    preview: unknown
  ): Promise<RuntimeOutput["files"]> {
    const request = notebookZarrRenderRequest(preview);
    if (!request) return [];
    if (!zarrViewerStatus?.available) throw new Error(zarrViewerWarning || "ZarrViewer is unavailable");
    const { recipe, format } = request;
    let capability: ZarrViewerCapability;
    if (format === "mp4" && recipe.source?.kind === "current-image") {
      const context = bootstrap.context;
      if (!context || context.object_type !== "Image") throw new Error("Open an Image workspace to use the current-image movie source.");
      capability = await fetchZarrCapability(zarrViewerStatus!, { type: "Image", id: context.object_id }, true);
      recipe.storeUuid = capability.store.uuid;
      recipe.sourceBinding = capability.store.binding_digest;
    } else ({ capability } = await resolveZarrTarget(recipe.storeUuid));
    const panel = recipe.panels[0];
    if ((panel.vectors || panel.timeProjection) &&
        !capability.features?.includes("zarr-review-export-v1")) {
      throw new Error("This ZarrViewer does not support track or temporal-projection exports");
    }
    if (format === "mp4") {
      movieController.current?.abort();
      const controller = new AbortController(); movieController.current = controller;
      try {
        const boundedRecipe = { ...recipe, sequence: { ...recipe.sequence!,
          maxBytes: Math.min(recipe.sequence?.maxBytes ?? 256 * 1024 * 1024, bootstrap.context?.max_snapshot_bytes ?? 256 * 1024 * 1024) } };
        const movie = await renderZarrMovie(capability, boundedRecipe, controller.signal,
          (completed, total) => setStatus(`Creating movie frame ${completed} of ${total}?`));
        const stem = slug(String(recipe.filename || "zarr-movie").replace(/\.mp4$/i, ""));
        const resultGroupId = id();
        return [
          { name: `${stem}.mp4`, type: "video/mp4", data: movie.data, resultGroupId, movie: { fps: movie.provenance.fps, frameCount: movie.provenance.frameCount, recipe } },
          { name: `${stem}-poster.png`, type: "image/png", data: movie.poster, resultGroupId },
          { name: `${stem}-recipe.json`, type: "application/json", data: new TextEncoder().encode(JSON.stringify(movie.provenance, null, 2)).buffer, resultGroupId }
        ];
      } finally { if (movieController.current === controller) movieController.current = null; }
    }
    const data = format === "svg"
      ? await renderZarrRecipeSvg(capability, recipe)
      : await renderZarrRecipe(capability, recipe);
    if (workspaceBytes(workspaceRef.current) + data.byteLength > MAX_WORKSPACE_BYTES) {
      throw new Error("The ZarrViewer plot would exceed the workspace storage limit");
    }
    const requested = String(recipe.filename || "zarr-review").replace(/\.(png|svg)$/i, "");
    return [{ name: `${slug(requested)}.${format}`,
      type: format === "svg" ? "image/svg+xml" : "image/png", data }];
  }

  async function addLocalFiles(list: FileList | null) {
    if (!list || !analysisWorkspace) return;
    const requested = Array.from(list);
    const requestedBytes = requested.reduce((sum, file) => sum + file.size, 0);
    const capacityError = capacityWarning(
      workspaceBytes(analysisWorkspace),
      requestedBytes,
      await storageEstimate(),
      MAX_WORKSPACE_BYTES
    );
    if (capacityError) {
      setStatus(capacityError);
      return;
    }
    const additions: WorkspaceFile[] = [];
    let total = workspaceBytes(analysisWorkspace);
    for (const source of requested) {
      if (!supported.test(source.name)) {
        setStatus(`${source.name} is not a supported tabular data file`);
        continue;
      }
      if (source.size > MAX_FILE_BYTES) {
        setStatus(`${source.name} exceeds the 2 GiB file limit`);
        continue;
      }
      total += source.size;
      if (total > MAX_WORKSPACE_BYTES) {
        setStatus("The workspace would exceed 4 GiB");
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
    await syncRuntimeIfStarted(nextFiles, "Local inputs added; browser Python will use them when needed");
    setStorage(await storageEstimate());
  }


  async function refreshWorkspace() {
    if (!workspace) return;
    setBrowserMenu(null);
    const selected = await loadWorkspace(workspace.id);
    if (!selected) return;
    const prepared = await prepareInputs(selected);
    setWorkspace(prepared);
    workspaceRef.current = prepared;
    setSelectedMethodIds(new Set());
    setSelectedPipelineIds(new Set());
    await syncRuntimeIfStarted(prepared.files, "Workspace refreshed");
  }

  async function changeWorkspaceLifecycle(identifier: string, action: "trash" | "restore" | "purge") {
    const local = await loadWorkspace(identifier);
    const name = local?.workspace.name || identifier;
    if (action !== "restore" && !await dialogs.confirm(action === "trash" ? "Move workspace to Trash?" : "Delete workspace permanently?",
      action === "trash" ? `${name} can be restored later.` : `${name}: managed results and reusable analyses will be removed. Unrelated OMERO content is preserved.`,
      action === "trash" ? "Move to Trash" : "Delete permanently", true)) return;
    const datasetId = local?.workspace.omeroSync?.datasetId;
    const remote = bootstrap.context ? (datasetId ? await bridge.manageWorkspaceDataset(datasetId) : await bridge.syncStatus(identifier)) : null;
    let result = remote;
    if (remote?.linked || (remote?.lifecycle && !["active", "unavailable"].includes(remote.lifecycle))) {
      result = datasetId ? await bridge.manageWorkspaceDataset(datasetId, action, remote.lifecycleRevision || 0)
        : await bridge.changeWorkspaceLifecycle(identifier, action, remote.lifecycleRevision || 0);
      if (result.cleanup && !result.cleanup.complete) throw new Error("Cleanup is incomplete. Its journal is retained; retry Delete permanently.");
    } else if (local?.workspace.omeroSync) {
      throw new Error("Remote workspace is unavailable. Local data is preserved; restore its access or linkage first.");
    }
    if (local) {
      const record = { ...local.workspace, deletedAt: action === "restore" ? undefined : now(),
        purgedAt: action === "purge" ? now() : undefined, lifecycleRevision: result?.lifecycleRevision || 0,
        browserLifecycleRevision: (local.workspace.browserLifecycleRevision || 0) + 1 };
      if (action === "purge") await deleteWorkspaceCascade(identifier, true);
      else await saveWorkspaceRecord(record);
      if (workspaceRef.current?.workspace.id === identifier) {
        const current = { ...workspaceRef.current, workspace: record };
        workspaceRef.current = current; setWorkspace(current);
      }
    }
    const channel = new BroadcastChannel("omero-analysis-lifecycle");
    channel.postMessage({ id: identifier, action }); channel.close();
    setStatus(action === "restore" ? "Workspace restored" : action === "trash" ? "Workspace moved to Trash" : "Workspace permanently removed");
  }

  async function renameWorkspace(target: WorkspaceRecord) {
    const requested = await dialogs.askText(
      "Rename workspace",
      workspaceNameSuffix(bootstrap.context, target.name),
      "Rename the analysis label. Its full source path stays as a fixed prefix. The name updates in OMERO and the disk browsing folder on the next synchronization."
    );
    if (requested == null) return;
    if (!normalizeWorkspaceName(requested)) {
      setStatus("Workspace name cannot be empty");
      return;
    }
    const name = scopedWorkspaceName(bootstrap.context, requested);
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
    const renamed = renameAnalysisWorkspace(targetWorkspace, name, now(), bootstrap.context);
    if (siblings.some((item) =>
      item.id !== target.id &&
      item.rootPath.toLocaleLowerCase() === renamed.workspace.rootPath.toLocaleLowerCase()
    )) {
      setStatus(`The workspace folder ${renamed.workspace.rootPath} already exists`);
      return;
    }
    const persistedWorkspace = await commitWorkspaceRecord(renamed.workspace);
    await Promise.all(renamed.files.map(saveFile));
    renamed.workspace = persistedWorkspace;
    if (current?.workspace.id === target.id) {
      workspaceRef.current = renamed;
      setWorkspace(renamed);
    }
    setStatus(`Renamed workspace to ${name}`);
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

  function downloadBytes(name: string, data: ArrayBuffer | Uint8Array, type: string) {
    const blobData: BlobPart = data instanceof Uint8Array ? data as BlobPart : data;
    const url = URL.createObjectURL(new Blob([blobData], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function restoreResult(file: WorkspaceFile): Promise<WorkspaceFile> {
    if (file.data) return file;
    if (file.mediaBlob) return { ...file, data: await file.mediaBlob.arrayBuffer() };
    if (!file.remoteResult) return file;
    const pending = restoringResults.current.get(file.id);
    if (pending) return pending;
    const task = bridge.downloadWorkspaceResult(file.remoteResult).then(data => {
      const ready = { ...file, data, state: "ready" as const, error: undefined };
      if (workspaceRef.current?.workspace.id === file.workspaceId) upsertFiles([ready]);
      return ready;
    }).finally(() => restoringResults.current.delete(file.id));
    restoringResults.current.set(file.id, task);
    return task;
  }

  async function createArchive() {
    const current = workspaceRef.current;
    if (!current) throw new Error("Workspace is not ready");
    const limit = bootstrap.context?.max_snapshot_bytes ?? DEFAULT_MAX_SNAPSHOT_BYTES;
    const required = current.files.filter(file => file.remoteResult && !file.data);
    if (required.reduce((sum, file) => sum + file.size, 0) > limit) {
      throw new Error("Portable download exceeds the configured size limit. Download individual results instead.");
    }
    const files = [];
    for (const file of current.files) files.push(await restoreResult(file));
    return exportWorkspace({ ...current, files }, limit);
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

  async function discardWorkspaceDeletedInOmero(record: WorkspaceRecord) {
    setSyncError(`${record.name} is unavailable in OMERO. Its browser copy is preserved. Use workspace management to review recovery options.`);
    setStatus("Automatic synchronization paused; browser data is preserved");
  }

  function scheduleWorkspaceSyncPoll(payload: SyncPayload) {
    if (workspaceSyncPollTimer.current != null) {
      window.clearTimeout(workspaceSyncPollTimer.current);
    }
    workspaceSyncPollTimer.current = window.setTimeout(() => {
      workspaceSyncPollTimer.current = null;
      void pollWorkspaceSynchronization(payload);
    }, IMPORT_SYNC_POLL_INTERVAL_MS);
  }

  async function pollWorkspaceSynchronization(payload: SyncPayload) {
    const current = workspaceRef.current;
    if (!current || current.workspace.id !== payload.inventory.workspace.id) return;
    try {
      const remote = await bridge.syncStatus(current.workspace.id);
      setRemoteSync(remote);
      if (await receiveResultDeletions(remote)) return;
      if (!remote.canSync) { setSyncError(remote.reason || "OMERO synchronization is unavailable"); return; }
      if (remote.syncState === "pending") {
        setStatus(
          `${remote.pendingOrderCount || 1} plot import(s) pending in BIOMERO.importer`
        );
        scheduleWorkspaceSyncPoll(payload);
        return;
      }
      if (remote.syncState === "failed") {
        setSyncError(remote.reason || "BIOMERO.importer reported an import failure");
        setStatus("Workspace synchronization is retained for retry after an importer failure");
        return;
      }
      // The importer has completed. Apply once more to publish its Images and
      // companions in the manifest; polling itself must never create revisions.
      await synchronizeWorkspace(payload);
    } catch (error) {
      setSyncError(String(error));
      setStatus(`Could not check importer progress: ${String(error)}`);
      scheduleWorkspaceSyncPoll(payload);
    }
  }

  async function synchronizeWorkspace(prepared?: SyncPayload) {
    const current = workspaceRef.current;
    const context = bootstrap.context;
    if (!current || !context || current.workspace.deletedAt || current.workspace.purgedAt || remoteDeletionInFlight.current) return;
    if (syncRunBarrierTokens.current.size > 0) {
      workspaceSyncDeferredForRun.current = true;
      return;
    }
    if (workspaceSyncInFlight.current) {
      workspaceSyncQueued.current = true;
      return;
    }
    workspaceSyncInFlight.current = true;
    if (workspaceSyncPollTimer.current != null) {
      window.clearTimeout(workspaceSyncPollTimer.current);
      workspaceSyncPollTimer.current = null;
    }
    setSyncing(true);
    setSyncPhase("checking");
    setSyncError("");
    try {
      let payload = prepared || await buildWorkspaceSyncPayload(current, context, { inventoryOnly: true });
      const remote = await bridge.syncStatus(current.workspace.id);
      setRemoteSync(remote);
      if (await receiveResultDeletions(remote)) return;
      if (!remote.canSync) { setSyncError(remote.reason || "OMERO synchronization is unavailable"); return; }
      if (current.workspace.omeroSync) {
        if (!remote.linked || (remote.lifecycle && remote.lifecycle !== "active")) {
          await discardWorkspaceDeletedInOmero(current.workspace);
          return;
        }
      }
      // A queued save (or another browser tab) may already have saved these
      // bytes. Do not create a new plan/revision just to refresh sync metadata.
      if (syncAlreadyCurrent(payload.contentDigest || payload.inventory.digest, remote)) {
        const latest = workspaceRef.current;
        if (!latest || latest.workspace.id !== current.workspace.id) return;
        const next = withWorkspaceSyncStatus(latest, remote, now());
        if (JSON.stringify(next.workspace.omeroSync) !== JSON.stringify(latest.workspace.omeroSync) ||
            next.workspace.lifecycleRevision !== latest.workspace.lifecycleRevision) {
          workspaceRef.current = next;
          setWorkspace(next);
          await commitWorkspaceRecord(next.workspace);
        }
        setLocalSyncDigest(payload.contentDigest || payload.inventory.digest);
        return;
      }
      let plan = await bridge.planWorkspaceSync(payload.inventory);
      if (plan.uploadKeys.some(key => !payload.bytes.has(key))) {
        const materialized = await buildWorkspaceSyncPayload(current, context, { uploadKeys: new Set(plan.uploadKeys) });
        // Preserve the signed inventory: snapshot archives have time-dependent container bytes.
        if (materialized.inventory.digest !== payload.inventory.digest) {
          payload = materialized;
          plan = await bridge.planWorkspaceSync(payload.inventory);
        } else payload = { ...payload, bytes: materialized.bytes };
      }
      let synced: SyncStatus;
      setSyncPhase("saving");
      try {
        synced = await bridge.applyWorkspaceSync(
          payload.inventory, plan, payload.bytes
        );
      } catch (error) {
        if (error instanceof OmeroApiError && error.code === "results_removed") {
          await receiveResultDeletions(await bridge.syncStatus(current.workspace.id)); return;
        }
        if (!(error instanceof OmeroApiError) || error.status !== 409 || error.code === "sync_busy") throw error;
        plan = await bridge.planWorkspaceSync(payload.inventory);
        synced = await bridge.applyWorkspaceSync(
          payload.inventory, plan, payload.bytes
        );
      }
      const latest = workspaceRef.current;
      if (!latest || latest.workspace.id !== current.workspace.id) return;
      setRemoteSync(synced);
      if (synced.syncState === "pending") {
        setStatus(
          `${synced.pendingOrderCount || 1} plot import(s) pending in BIOMERO.importer`
        );
        scheduleWorkspaceSyncPoll(payload);
        return;
      }
      if (synced.syncState === "failed") {
        setSyncError(synced.reason || "BIOMERO.importer reported an import failure");
        setStatus("Workspace synchronization is retained for retry after an importer failure");
        return;
      }
      // Synchronization may finish while a Method or Pipeline is still
      // updating runs, executions, and files. Merge the remote metadata into
      // the latest Workspace rather than restoring the snapshot captured when
      // synchronization began.
      const next = withWorkspaceSyncStatus(latest, synced, now());
      const nextRecord = next.workspace;
      workspaceRef.current = next;
      setWorkspace(next);
      await commitWorkspaceRecord(nextRecord);
      setLocalSyncDigest(payload.contentDigest || payload.inventory.digest);
      setStatus(synced.browseState === "failed" ? "Saved to OMERO; readable filesystem copy needs retry" : `Reusable Analysis items saved automatically to ${synced.projectName} / ${synced.datasetName}`);
      if (synced.browseState === "failed") setSyncError("Readable filesystem copy failed. Retry synchronization to rebuild it.");
    } catch (error) {
      if (error instanceof OmeroApiError && error.code === "sync_busy") {
        setSyncPhase("waiting");
        setStatus("Waiting for another workspace synchronization to finish…");
        workspaceSyncQueued.current = false;
        workspaceSyncPollTimer.current = window.setTimeout(() => {
          workspaceSyncPollTimer.current = null;
          void synchronizeWorkspace();
        }, 5000);
        return;
      }
      const message = String(error);
      setSyncError(message);
      setStatus(`Workspace synchronization failed: ${message}`);
    } finally {
      workspaceSyncInFlight.current = false;
      setSyncing(false);
      setSyncPhase(phase => phase === "waiting" ? phase : "");
      if (workspaceSyncQueued.current) {
        workspaceSyncQueued.current = false;
        window.setTimeout(() => void synchronizeWorkspace(), 0);
      }
    }
  }

  async function importSharedLibraryItems(libraryId: string, items: SharedLibraryItem[]) {
    const current = workspaceRef.current;
    if (!current) throw new Error("Open a Workspace before importing shared items");
    const next = await prepareSharedImports(current, libraryId, items, (item, revision) => bridge.downloadSharedItem(item, revision));
    if (workspaceRef.current !== current) throw new Error("Workspace changed during import; retry");
    if (workspaceBytes(next) > MAX_WORKSPACE_BYTES) throw new Error("Shared imports exceed the browser Workspace size limit");
    await Promise.all([
      ...next.files.filter(item => !current.files.some(old => old.id === item.id)).map(saveFile),
      ...next.notebooks.filter(item => !current.notebooks.some(old => old.id === item.id)).map(saveNotebook)
    ]);
    workspaceRef.current = next;
    setWorkspace(next);
    if (bootstrap.context) {
      const remaining = readSharedHandoff(bootstrap.context, next.workspace.id).filter(ref =>
        ref.libraryId !== libraryId || !items.some(item => item.id === ref.id && item.revision === ref.revision));
      const key = sharedHandoffKey(bootstrap.context, next.workspace.id);
      if (remaining.length) localStorage.setItem(key, JSON.stringify({ expires: Date.now() + 900_000, items: remaining }));
      else localStorage.removeItem(key);
    }
    setStatus(`Imported ${items.length} shared item(s) into this Workspace`);
  }

  async function openWorkspaceLibrary(
    preselectedAnnotationIds: number[] = [],
    autoImport = false
  ) {
    if (!autoImport) setActiveTab("libraries");
    setLibraryLoading(true);
    setSelectedLibraryItems(new Set());
    try {
      const datasets = (await bridge.workspaceLibrary()).map(dataset => ({
        ...dataset, items: dataset.items.filter(item => item.kind === "notebook")
      }));
      setLibraryDatasets(datasets);
      const requested = new Set(preselectedAnnotationIds);
      const selectedKeys = new Set<string>();
      const opened = new Set<number>();
      for (const dataset of datasets) {
        for (const item of dataset.items) {
          if (!requested.has(item.annotationId)) continue;
          selectedKeys.add(librarySelectionKey(dataset, item));
          opened.add(dataset.datasetId);
        }
      }
      setSelectedLibraryItems(selectedKeys);
      setOpenLibraryDatasets(opened.size
        ? opened
        : new Set(datasets.length ? [datasets[0].datasetId] : []));
      if (autoImport) {
        if (!selectedKeys.size) {
          setActiveTab("libraries");
          throw new Error("The selected AnalysisWorkspaces items are no longer available");
        }
        await importSelectedLibraryItems(datasets, selectedKeys);
      }
    } catch (error) {
      setStatus(`AnalysisWorkspaces library failed: ${String(error)}`);
      setLibraryDatasets([]);
    } finally {
      setLibraryLoading(false);
    }
  }

  function librarySelectionKey(dataset: LibraryDataset, item: LibraryItem) {
    return `${dataset.datasetId}:${item.key}`;
  }

  function uniqueLibraryName(
    requested: string,
    names: string[],
    sameOrigin: boolean
  ) {
    if (!names.includes(requested) || sameOrigin) return requested;
    const extension = requested.match(/(\.[^.]+)$/)?.[1] || "";
    const stem = extension ? requested.slice(0, -extension.length) : requested;
    let suffix = 2;
    while (names.includes(`${stem} (${suffix})${extension}`)) suffix += 1;
    return `${stem} (${suffix})${extension}`;
  }

  function libraryOrigin(dataset: LibraryDataset, item: LibraryItem): LibraryOrigin {
    return {
      projectId: dataset.projectId,
      datasetId: dataset.datasetId,
      workspaceId: dataset.workspaceId,
      itemKey: item.key,
      revision: dataset.revision,
      sha256: item.sha256
    };
  }

  async function importSelectedLibraryItems(
    datasets = libraryDatasets,
    selectedKeys = selectedLibraryItems
  ) {
    const current = workspaceRef.current;
    if (!current) return;
    setLibraryLoading(true);
    try {
      let next = current;
      const all = datasets.flatMap((dataset) =>
        dataset.items.map((item) => ({ dataset, item }))
      );
      const selected = all.filter(({ dataset, item }) =>
        selectedKeys.has(librarySelectionKey(dataset, item))
      );
      const requested = new Map(
        selected.map((entry) => [
          `${entry.dataset.datasetId}:${entry.item.key}`, entry
        ])
      );
      for (const { dataset, item } of selected.filter(entry => entry.item.kind === "notebook")) {
        const origin = libraryOrigin(dataset, item);
        const existingOrigin = (record: { libraryOrigin?: LibraryOrigin }) =>
          record.libraryOrigin?.source !== "shared" &&
          record.libraryOrigin?.datasetId === dataset.datasetId &&
          record.libraryOrigin?.itemKey === item.key;
        const exact = (record: { libraryOrigin?: LibraryOrigin }) =>
          existingOrigin(record) && record.libraryOrigin?.sha256 === item.sha256;
          if (next.notebooks.some(exact)) continue;
          const preparedNotebook = importedNotebookProtocol(
            parseNotebook(await bridge.downloadLibraryItem(item.annotationId))
          );
          const imported: NotebookRecord = {
            id: id(),
            workspaceId: next.workspace.id,
            name: uniqueLibraryName(
              item.name, next.notebooks.map((value) => value.name), false
            ),
            ...preparedNotebook,
            attachmentIds: [],
            selectedDataFileIds: next.files
              .filter((file) => file.source !== "result" && file.role !== "chat-attachment" &&
                !file.deletedAt && file.state === "ready")
              .map((file) => file.id),
            libraryOrigin: origin,
            createdAt: now(),
            updatedAt: now()
          };
          next = { ...next, notebooks: [...next.notebooks, imported] };
          setActiveNotebookId(imported.id);
      }
      await Promise.all([
        ...next.notebooks.filter((item) => !current.notebooks.some((old) => old.id === item.id)).map(saveNotebook)
      ]);
      workspaceRef.current = next;
      setWorkspace(next);

      setStatus(`Imported ${selected.length} selected reusable item(s) from AnalysisWorkspaces`);
    } catch (error) {
      setStatus(`Library import failed: ${String(error)}`);
    } finally {
      setLibraryLoading(false);
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
      const restored = await replaceWorkspace(imported);
      const prepared = await prepareInputs(restored);
      setWorkspace(prepared);
      workspaceRef.current = prepared;
      await syncRuntimeIfStarted(prepared.files, "Imported workspace restored");
    } catch (error) {
      setStatus(`Workspace import failed: ${String(error)}`);
    } finally {
      if (importInput.current) importInput.current.value = "";
    }
  }

  async function createNotebook(document?: import("./types").NotebookDocument) {
    const current = workspaceRef.current;
    if (!current || current.workspace.deletedAt) return;
    const timestamp = now();
    const notebook: NotebookRecord = {
      id: id(), workspaceId: current.workspace.id,
      name: nextUntitledName(current.notebooks.map(n => n.name), ".ipynb"),
      document: document || newNotebookDocument(current.files, id()),
      attachmentIds: [], selectedDataFileIds: [], createdAt: timestamp, updatedAt: timestamp
    };
    await saveNotebook(notebook);
    const updated = { ...current, notebooks: [...current.notebooks, notebook] };
    workspaceRef.current = updated; setWorkspace(updated);
    setActiveNotebookId(notebook.id); setActiveTab("notebooks");
    const codeCells = notebook.document.cells.flatMap((cell, index) => cell.cell_type === "code" ? [cell.id || String(index)] : []);
    if (codeCells.length) setNewCellRequest({ notebookId: notebook.id, cellIds: codeCells, nonce: Date.now() });
  }

  if (!analysisWorkspace || !workspace) {
    return <WorkspacePreparationScreen theme={theme}
      workspaceName={bootstrap.context?.name || "Analysis Workspace"}
      progress={workspaceProgress} error={workspaceError} />;
  }
  const explorerSourceMap = new Map<string, {id: string; name: string; type: string; objectId: number}>();
  for (const item of [hierarchy?.current, ...(hierarchy?.children || []), ...(hierarchy?.parents || [])]) {
    if (item && ["Image", "Plate"].includes(item.type)) explorerSourceMap.set(`${item.type}:${item.id}`, {id: `${item.type}:${item.id}`, name: item.name, type: item.type, objectId: item.id});
  }
  for (const item of visibleZarrSources) if (!explorerSourceMap.has(`${item.objectType}:${item.objectId}`)) {
    explorerSourceMap.set(`${item.objectType}:${item.objectId}`, {id: `${item.objectType}:${item.objectId}`, name: item.zarrName, type: item.objectType, objectId: item.objectId});
  }
  const explorerSources = [...explorerSourceMap.values()];
  const selectedSource = inspectorSelection?.kind === "zarr" ? explorerSourceMap.get(inspectorSelection.id) : undefined;
  const viewerLinks: { title: string; url: string }[] = [];
  const sourceContext = selectedSource ? {object_type: selectedSource.type, object_id: selectedSource.objectId} : null;
  if (sourceContext && sourceContext.object_id > 0) {
    viewerLinks.push({
      title: sourceContext.object_type === "Image" ? "Open OMERO viewer" : "Open source in OMERO",
      url: sourceContext.object_type === "Image"
        ? `/webclient/img_detail/${sourceContext.object_id}/`
        : `/webclient/?show=${sourceContext.object_type.toLowerCase()}-${sourceContext.object_id}`
    });
  }
  // Only capabilities returned by the installed viewer establish a valid image route.
  for (const source of visibleZarrSources.filter(item => selectedSource && item.objectType === selectedSource.type && item.objectId === selectedSource.objectId)) {
    const capability = zarrCapabilities.current.get(`${source.objectType}:${source.objectId}`);
    if (!capability || !zarrViewerStatus?.viewer_url) continue;
    const url = new URL(zarrViewerStatus.viewer_url, window.location.href);
    if (url.origin !== window.location.origin) continue;
    url.searchParams.set("image", String(capability.image.id));
    viewerLinks.push({ title: `Open ${source.zarrName} in ZarrViewer`, url: url.href });
  }
  const activeNotebook = activeNotebooks.find(
    (item) => item.id === activeNotebookId
  ) || activeNotebooks[0] || null;
  const syncChanged = Boolean(
    remoteSync?.linked &&
    (remoteSync.attachmentRepairNeeded || syncHasChanges(localSyncDigest, remoteSync.inventoryDigest))
  );
  const syncButtonLabel = workspace.purgedAt ? "Remote workspace removed — local copy retained"
    : workspace.deletedAt ? "In Trash — synchronization suspended"
    : syncPhase === "waiting"
    ? "Waiting for another synchronization…"
    : syncing
    ? syncPhase === "checking" ? "Checking for changes…" : "Saving to OMERO…"
    : syncRunBarrierActive
      ? "Sync queued until run finishes"
    : syncError
      ? "Automatic sync paused"
      : remoteSync?.operationalMode === "blocked"
        ? "Blocked — storage configuration required"
      : remoteSync?.syncState === "pending"
        ? "Waiting for plot imports…"
      : !remoteSync?.linked
        ? "Automatic sync ready"
        : syncChanged
          ? "Waiting to save…"
          : "Saved automatically";
  return (
    <BlueprintThemeProvider theme={theme}>
    <main className="app-shell notebook-workspace" data-theme={theme} data-embedded-host={bootstrap.embeddedHost}>
      {dialogs.element}
      <WorkspaceHeader workspace={workspace} disabled={syncing || syncRunBarrierActive} theme={theme}
        embedded={Boolean(bootstrap.embeddedHost)} onRename={() => void renameWorkspace(workspace)}
        onTheme={toggleTheme} onHelp={() => setHelpOpen(true)} />
      <div className="workspace-save-status" role="status">
        <span>{browserSaveError ? `Browser save failed: ${browserSaveError}` : browserSaving ? "Saving draft…" : "Saved locally"}</span>
        <span title={syncError}>{syncButtonLabel}</span>
        <span className="workspace-message" title={status}>{status}</span>
        {syncError && <Button disabled={syncing} onClick={() => void synchronizeWorkspace()}>Retry OMERO sync</Button>}
      </div>
      {helpOpen && <AnalysisHelp onClose={() => setHelpOpen(false)} />}
      <div className="workspace notebook-layout explorer-visible" style={{"--explorer-width": `${explorerWidth}px`} as React.CSSProperties}>
        <aside className="workspace-tree">
          <WorkspaceExplorer name={workspace.name} inputs={inputFiles} notebooks={activeNotebooks}
            sources={explorerSources} selectedSourceId={selectedSource?.id}
            onSource={sourceId => { setInspectorSelection({kind: "zarr", id: sourceId}); setActiveTab("inspector"); }}
            busy={syncRunBarrierActive} onDelete={items => void removeExplorerItems(items).catch(error => setStatus(`Removal failed: ${String(error)}`))}
            canUndo={[...analysisWorkspace.files.filter(file => !file.deletedInOmeroAt && !file.supersededAt), ...analysisWorkspace.notebooks].some(item => item.deletedAt)}
            onUndo={() => void undoExplorerRemoval().catch(error => setStatus(`Restore failed: ${String(error)}`))}
            results={outputFiles} selectedFileId={selectedArtifactFileId} selectedNotebookId={activeNotebookId}
            compatibility={notebookMatches} query={explorerQuery} onQuery={setExplorerQuery}
            onFile={fileId => { setSelectedArtifactFileId(fileId); setActiveTab("inspector"); }}
            onNotebook={notebookId => { setActiveNotebookId(notebookId); setActiveTab("notebooks"); }}
            onAttach={() => addFilesInput.current?.click()} onRefresh={() => void refreshWorkspace()}
            onDropFiles={files => void addLocalFiles(files)} />
        </aside>
        <div className="explorer-splitter" role="separator" aria-label="Resize Explorer" aria-orientation="vertical" tabIndex={0} aria-valuemin={280} aria-valuemax={700} aria-valuenow={explorerWidth}
          onPointerDown={event => { splitterStart.current = event.clientX; splitterWidth.current = explorerWidth; event.currentTarget.setPointerCapture(event.pointerId); event.preventDefault(); }}
          onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) resizeExplorer(splitterWidth.current + event.clientX - splitterStart.current); }}
          onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
          onKeyDown={event => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) { event.preventDefault(); resizeExplorer(event.key === "Home" ? 280 : event.key === "End" ? 700 : explorerWidth + (event.key === "ArrowLeft" ? -20 : 20)); } }} />
        <section className="analysis-main">
          <AnalysisNavigation activeTab={activeTab} onNavigate={tab => {
            setActiveTab(tab); if (tab === "libraries") void openWorkspaceLibrary();
          }} />
          <div hidden={activeTab !== "inspector"}>
            {selectedSource && <section className="inspector-tab" aria-label="OMERO source Inspector"><h2>{selectedSource.name}</h2><p>{selectedSource.type} {selectedSource.objectId} · OMERO source</p>
              <div className="inspector-viewer-links">{viewerLinks.map(link => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>)}</div>
              <p>View pixels and overlays in the linked viewer. Select a database or CSV in Explorer to inspect measurements.</p>
              {viewerLinks.length === 1 && <p>ZarrViewer is not available for this source, or its format is not supported.</p>}
            </section>}
            <div hidden={Boolean(selectedSource)}><Inspector file={inputFiles.concat(outputFiles).find(f => f.id === selectedArtifactFileId) || null}
              bridge={bridge} bootstrap={bootstrap} theme={theme} onAttach={() => addFilesInput.current?.click()}
              onNotebook={document => void createNotebook(document)}
              onDownload={file => {
                if (file.data) downloadBytes(file.name, file.data, file.type);
                else setStatus("This file has no local preview to download.");
              }}
              onSchema={(file, tables) => setInspectedSchemas(current => ({ ...current, [file.id]: { tables } }))}
              /></div>
          </div>
          <div hidden={activeTab !== "notebooks"}>
            <div className="notebook-file-actions">
              <Button onClick={() => void createNotebook()}>New</Button>
              <Button onClick={() => notebookUploadInput.current?.click()}>Upload</Button>
              {activeNotebook && <><Button onClick={() => downloadNotebook(activeNotebook)}>Download</Button>
                <Button onClick={() => void renameNotebook(activeNotebook)}>Rename</Button></>}
            </div>
          <NotebookView
            notebook={activeNotebook}
            openCellRequest={newCellRequest}
            notebooks={activeNotebooks}
            inputs={inputFiles}
            runtime={runtime}
            runRequest={notebookRunRequest}
            onRunRequestConsumed={() => setNotebookRunRequest(null)}
            onRunStateChange={(running) => setRunSyncBarrier(
              `notebook:${activeNotebook?.id || "active"}`, running
            )}
            workspaceActions={null}
            onBeforeRun={(record) => activeNotebook
              ? prepareNotebookRuntime(record)
              : ensureRuntime(analysisWorkspace.files).then(() => analysisWorkspace.files)}
            onPrepareProtocol={prepareProtocolNotebook}
            onLoadParameterChoices={loadNotebookParameterChoices}
            onInspectSetupInput={async file => {
              const input={id:"setup",kind:"query" as const,path:`input/${file.name}`,formats:[notebookQueryFormat(file.name)],required:true};
              const result=await inspectForNotebook(file,input);
              if(result.error)throw new Error(result.error);
              return result.schema;
            }}
            onChange={updateNotebook}
            onFiles={saveNotebookFiles}
            onRenderRequest={renderNotebookZarrRequest}
            onCancelRender={() => movieController.current?.abort()}
            resultFiles={analysisWorkspace.files}
            onRetrieveResult={restoreResult}
            onSelect={(notebookId) => {
              setActiveNotebookId(notebookId);
            }}
            theme={theme} cspNonce={bootstrap.styleNonce}
            compatibility={activeNotebook ? notebookMatches[activeNotebook.id] : undefined}
          />

          </div>
          <section hidden={activeTab !== "libraries"} className="libraries-tab">
            <h2>Libraries</h2>
            <WorkflowExamples catalog={workflowSkillCatalog} bridge={bridge}
              notebooks={activeNotebooks} localMatches={notebookMatches}
              onOpenLocal={notebookId => { setActiveNotebookId(notebookId); setActiveTab("notebooks"); }}
              inputKey={JSON.stringify([inputFiles.map(f => [f.id, f.sha256, f.state]), selectedArtifactFileId])}
              check={async contract => {
                const sources = new Map<string, CompatibilitySource>();
                for (const input of contract.inputs) for (const file of inputFiles) {
                  const inspected = await inspectForNotebook(file, input);
                  const previous = sources.get(file.id);
                  sources.set(file.id, { ...previous, ...inspected, readiness: { ...previous?.readiness, ...inspected.readiness } });
                }
                return notebookCompatibility(contract, [...sources.values()], selectedArtifactFileId || undefined);
              }}
              onImport={uploadNotebookFile}
              onGeneric={() => {
                const file = inputFiles.find(f => f.id === selectedArtifactFileId);
                const table = file && inspectedSchemas[file.id]?.tables?.[0]?.name;
                if (!file || !table || !/\.(csv|duckdb|sqlite3?)$/i.test(file.name)) {
                  setStatus("Select a CSV or database in Inspector and wait for its schema before creating an exploration notebook.");
                  setActiveTab("inspector"); return;
                }
                void createNotebook(queryNotebook(file, `SELECT * FROM ${quoteIdentifier(table)} LIMIT 100`));
              }} />
            <h3>Reusable notebooks, plate templates and shared content</h3>
            <div className="library-datasets">
              {analysisWorkspace && <SharedLibrary bridge={bridge} workspace={analysisWorkspace}
                onImport={importSharedLibraryItems}
                inspectLocal={inspectSharedLocalInputs}
                initialSelection={bootstrap.context ? readSharedHandoff(bootstrap.context, analysisWorkspace.workspace.id) : []} />}
              <details className="library-panel" open><summary><span className="library-panel-toggle" /><strong>Synced +AnalysisWorkspaces library</strong><small>{selectedLibraryItems.size} selected</small></summary>
              <div className="library-panel-body">
            <label className="library-search">
              <span className="sr-only">Filter AnalysisWorkspaces library</span>
              <Input
                type="search"
                value={libraryQuery}
                placeholder="Filter by source, Dataset, or item name…"
                onChange={(event) => setLibraryQuery(event.target.value)}
              />
            </label>
              {libraryLoading && !libraryDatasets.length && <p>Loading library…</p>}
              {!libraryLoading && (
                <WorkspaceLibraryTree
                  datasets={libraryDatasets}
                  inputKey={JSON.stringify([inputFiles.map(f => [f.id, f.sha256, f.state]), selectedArtifactFileId])}
                  checkNotebook={async item => {
                    const document = parseNotebook(await bridge.downloadLibraryItem(item.annotationId));
                    const contract = parseNotebookProtocol(document, true);
                    if (!contract) return { status: "unchecked", reasons: ["No portable input contract declared"] };
                    const sources = new Map<string, CompatibilitySource>();
                    for (const input of contract.inputs) for (const file of inputFiles) {
                      const inspected = await inspectForNotebook(file, input);
                      const previous = sources.get(file.id);
                      sources.set(file.id, { ...previous, ...inspected, readiness: { ...previous?.readiness, ...inspected.readiness } });
                    }
                    return notebookCompatibility(contract, [...sources.values()], selectedArtifactFileId || undefined);
                  }}
                  query={libraryQuery}
                  selected={selectedLibraryItems}
                  openDatasets={openLibraryDatasets}
                  availableFormats={new Set(inputFiles.map((file) =>
                    file.name.split(".").pop()?.toLowerCase() || ""
                  ))}
                  zarrViewerAvailable={Boolean(zarrViewerStatus?.available)}
                  onToggleDataset={(datasetId, open) =>
                    setOpenLibraryDatasets((current) => {
                      const next = new Set(current);
                      if (open) next.add(datasetId); else next.delete(datasetId);
                      return next;
                    })}
                  onToggleItem={(key) =>
                    setSelectedLibraryItems((current) => {
                      const next = new Set(current);
                      if (next.has(key)) next.delete(key); else next.add(key);
                      return next;
                    })}
                />
              )}
            </div>
              </details>
            </div>
            <div className="dialog-actions">

              <Button
                disabled={!selectedLibraryItems.size || libraryLoading}
                onClick={() => void importSelectedLibraryItems()}
              >
                {libraryLoading ? "Please wait…" : `Import ${selectedLibraryItems.size} synced items`}
              </Button>
            </div>

          </section>
          <div hidden={activeTab !== "skills"}>
            <SkillsView bridge={bridge} catalog={workflowSkillCatalog} viewerCatalog={zarrSkillCatalog}
              inputs={inputFiles} schemas={inspectedSchemas} workspaceId={workspace.id}
              onDownloadInput={async file => {
                if (file.size > 32 * 1024 * 1024) throw new Error("Supporting input exceeds the 32 MiB download limit");
                const data = file.data || (file.annotationId ? await bridge.download({ annotation_id: file.annotationId, file_id: file.fileId || 0, name: file.name, mimetype: file.type, size: file.size, kind: "attachment", supported: true }) : null);
                if (!data) throw new Error("This supporting input is unavailable. Attach it again in Explorer.");
                downloadBytes(file.name, data, file.type);
              }}
              onImport={file => uploadNotebookFile(file, true)} />
          </div>
        </section>
      </div>
      <input type="file" hidden multiple ref={addFilesInput} onChange={e => { void addLocalFiles(e.target.files); e.target.value = ""; }} />
      <input type="file" hidden accept=".ipynb" ref={notebookUploadInput} onChange={e => { if (e.target.files?.[0]) void uploadNotebookFile(e.target.files[0]); e.target.value = ""; }} />
      <input type="file" hidden accept=".zip" ref={importInput} onChange={e => { void importArchive(e.target.files?.[0] || null); e.target.value = ""; }} />
    </main>
    </BlueprintThemeProvider>
  );
}
