export type OmeroObjectType = "Image" | "Dataset" | "Plate" | "Screen";
export type FileSource = "local" | "omero" | "result";
export type FileState = "loading" | "ready" | "failed" | "missing";

export interface Attachment {
  annotation_id: number;
  file_id: number;
  name: string;
  mimetype: string;
  size: number;
  namespace?: string | null;
  kind: "attachment" | "result" | "workspace" | "pipeline" | "notebook";
  supported: boolean;
}

export interface OmeroContext {
  object_type: OmeroObjectType;
  object_id: number;
  name: string;
  user_id: number;
  group_id: number;
  can_annotate: boolean;
  max_snapshot_bytes?: number;
  selected_attachments: Attachment[];
  selected_workspace_snapshot?: Attachment | null;
  selected_notebook?: Attachment | null;
  notebooks?: Attachment[];
}

export interface Bootstrap {
  context: OmeroContext | null;
  tokenUrl: string;
  contextTemplate: string;
  attachmentsTemplate: string;
  hierarchyTemplate: string;
  downloadTemplate: string;
  uploadTemplate: string;
  snapshotsTemplate: string;
  snapshotUploadTemplate: string;
  snapshotDownloadTemplate: string;
  pipelineTemplatesTemplate: string;
  pipelineDownloadTemplate: string;
  notebookDownloadTemplate: string;
  notebookUploadTemplate: string;
  workspaceSyncStatusTemplate: string;
  workspaceSyncPlanTemplate: string;
  workspaceSyncApplyTemplate: string;
  workspaceSyncRemoveTemplate: string;
  workspaceLibraryTemplate: string;
  workspaceLibraryDownloadTemplate: string;
  analysisSettingsTemplate: string;
  workflowSkillsUrl: string;
  zarrViewerStatusUrl: string;
  keepaliveUrl: string;
  keepaliveInterval: number;
  runtimeBase: string;
}

export interface WorkflowSkillMatch {
  extensions: string[];
  filename_globs: string[];
  required_tables: string[];
  auto_activate: boolean;
}

export interface WorkflowSkillSummary {
  workflow_key: string;
  source_kind?: "workflow" | "application";
  source_key?: string;
  name: string;
  description: string;
  purpose: string;
  consumers: string[];
  version: string;
  sha256: string;
  package_url: string;
  required_resources?: string[];
  required_capabilities?: string[];
  match: WorkflowSkillMatch;
}

export interface WorkflowSkillSource {
  workflow_key: string;
  source_kind?: "workflow" | "application";
  source_key?: string;
  repository_url: string;
  configured_ref: string;
  resolved_commit: string;
  skills_path: string;
  ref_kind: string;
}

export interface WorkflowSkillEntry {
  source: WorkflowSkillSource;
  status: "ready" | "no-skills" | "stale" | "error";
  checked_at: string;
  skills: WorkflowSkillSummary[];
  error?: string;
}

export interface WorkflowSkillCatalog {
  schema: "nl.bioimaging.omero-workflow-skills.v1";
  generated_at: string;
  consumer: string;
  config_hash: string;
  workflows: WorkflowSkillEntry[];
  diagnostics: Array<{
    level: "info" | "warning" | "error";
    code: string;
    message: string;
    workflow_key?: string;
    skill_name?: string;
  }>;
}

export interface WorkflowSkillPackage {
  source: WorkflowSkillSource;
  skill: WorkflowSkillSummary;
  files: Array<{
    path: string;
    media_type: string;
    size: number;
    sha256: string;
    content: string;
  }>;
}

export interface AnalysisSkillProviderCatalog {
  schema: "nl.bioimaging.analysis-skill-provider.v1";
  provider: {
    name: string;
    distribution: string;
    version: string;
    source: string;
    health: string;
  };
  skills: Array<{
    name: string;
    description: string;
    purpose: string;
    consumers: string[];
    version: string;
    sha256: string;
    package_url: string;
    required_resources: string[];
    required_capabilities: string[];
  }>;
}

export interface HierarchyItem {
  type: string;
  id: number;
  name: string;
  supported: boolean;
}

export interface OmeroHierarchy {
  current: HierarchyItem;
  parents: HierarchyItem[];
  children: HierarchyItem[];
}

export interface WorkspaceRecord {
  id: string;
  contextKey: string;
  rootPath: string;
  name: string;
  objectType?: OmeroObjectType;
  objectId?: number;
  userId: number;
  groupId: number;
  activeChatId: string;
  plotCsv: boolean;
  sourceWorkspaceSnapshotAnnotationId?: number;
  origin?: {
    contextKey: string;
    userId: number;
    groupId: number;
    snapshotAnnotationId?: number;
  };
  zarrBindings?: Record<string, ZarrBinding>;
  omeroSync?: {
    projectId: number;
    datasetId: number;
    manifestAnnotationId: number;
    remoteRevision: number;
    inventoryDigest: string;
    lastSyncedAt: string;
  };
  revision?: number;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRecord {
  id: string;
  workspaceId: string;
  title: string;
  summary: string;
  pinnedMessageIds?: string[];
  contextUsage?: TokenUsage;
  deletedAt?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceFile {
  id: string;
  workspaceId: string;
  chatId?: string;
  methodId?: string;
  pipelineId?: string;
  notebookId?: string;
  executionId?: string;
  name: string;
  logicalPath: string;
  type: string;
  size: number;
  sha256: string;
  source: FileSource;
  state: FileState;
  data?: ArrayBuffer;
  error?: string;
  annotationId?: number;
  fileId?: number;
  viewer?: ZarrViewerProvenance;
  deletedAt?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  kind?: "text" | "error" | "execution" | "viewer-preview" | "ai-activity";
  executionId?: string;
  artifactId?: string;
  citationIds?: string[];
  workflowSkills?: Array<{
    workflowKey: string;
    sourceKind?: "workflow" | "application";
    sourceKey?: string;
    name: string;
    version: string;
    sha256: string;
    configuredRef: string;
    resolvedCommit: string;
  }>;
  activity?: "thought" | "worked";
  durationMs?: number;
  aiActivity?: AiActivity;
  createdAt: string;
}

export type AiActivityState =
  | "preparing"
  | "responding"
  | "running"
  | "checking"
  | "waiting"
  | "completed"
  | "failed"
  | "stopped";

export interface AiActivityEntry {
  id: string;
  kind: "status" | "tool" | "message";
  label: string;
  detail?: string;
  status: "active" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
}

export interface AiActivityQuestion {
  id: string;
  prompt: string;
  choices: string[];
  allowOther: boolean;
  answer?: string;
  answeredAt?: string;
}

export interface AiActivity {
  promptId: string;
  state: AiActivityState;
  entries: AiActivityEntry[];
  question?: AiActivityQuestion;
  startedAt: string;
  completedAt?: string;
}

export type ExecutionPurpose = "inspection" | "analysis" | "method" | "notebook";

export interface ExecutionRecord {
  id: string;
  workspaceId: string;
  chatId: string;
  promptId: string;
  code: string;
  codeHash: string;
  cacheKey: string;
  status: "running" | "success" | "failed" | "reused" | "incomplete";
  reusedFrom?: string;
  stdout: string;
  stderr: string;
  preview?: unknown;
  outputFileIds: string[];
  missingPlotCsv: string[];
  inputHashes: string[];
  runtimeVersion: string;
  model: string;
  modelPayload?: ModelPayload;
  workflowSkills?: ChatMessage["workflowSkills"];
  purpose?: ExecutionPurpose;
  evidenceId?: string;
  durationMs?: number;
  deletedOutputFileIds?: string[];
  createdAt: string;
}

export type EvidenceKind =
  | "tool-result"
  | "schema"
  | "navigation"
  | "render"
  | "failed-approah";

export interface EvidenceRecord {
  id: string;
  workspaceId: string;
  chatId: string;
  promptId: string;
  kind: EvidenceKind;
  status: "success" | "failed";
  sourceHashes: string[];
  skillHashes: string[];
  sourceSkillKey: string;
  executionId?: string;
  summary: string;
  payload: string;
  createdAt: string;
}

export interface MethodVersion {
  version: number;
  code: string;
  codeHash: string;
  executionId: string;
  renderRecipe?: ZarrRenderRecipe;
  createdAt: string;
}

export interface InputContract {
  formats: string[];
  requiredFiles: Array<{
    path: string;
    extension: string;
    requiredTables?: string[];
    requiredColumns?: string[];
  }>;
  runtimeVersion: string;
}

export interface ParameterDefinition {
  name: string;
  label: string;
  type: "string" | "number" | "boolean" | "choice";
  defaultValue: string | number | boolean;
  choices?: string[];
  required: boolean;
}

export interface MethodRecord {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  versions: MethodVersion[];
  currentVersion: number;
  inputContract?: InputContract;
  parameters?: ParameterDefinition[];
  requiredCapabilities?: string[];
  workspaceBindings?: Record<string, Record<string, string>>;
  libraryOrigin?: LibraryOrigin;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStep {
  id: string;
  methodId: string;
  methodVersion: number;
  name: string;
  inputBindings: Record<string, string>;
  parameters: Record<string, string | number | boolean>;
}

export interface PipelineRecord {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  version: number;
  steps: PipelineStep[];
  libraryOrigin?: LibraryOrigin;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ArtifactRecord {
  id: string;
  workspaceId: string;
  chatId: string;
  executionId?: string;
  fileId?: string;
  kind: "plot" | "table" | "file" | "report" | "viewer-preview";
  title: string;
  pinned: boolean;
  promptId?: string;
  viewer?: ZarrViewerProvenance;
  createdAt: string;
}

export interface ZarrViewerIntegrationStatus {
  schema_version: 1;
  available: boolean;
  installed: boolean;
  enabled: boolean;
  version: string | null;
  minimum_version: string;
  reason: "ready" | "not-installed" | "incompatible-version" | "app-disabled";
  viewer_url?: string;
  image_capabilities_template?: string;
  plate_capabilities_template?: string;
  skill_catalog_url?: string;
}

export interface ZarrViewerCapability {
  schema_version: 1;
  supported: true;
  image: { id: number; name: string };
  store: { uuid: string; name?: string; roi_url: string; render_url: string };
  kind: "image" | "plate";
  initial_path: string;
  channels: Array<{ index: number; label: string; active: boolean }>;
  labels: Array<{ id: string; name: string; path: string }>;
  plate?: {
    name: string;
    rows: string[];
    columns: string[];
    wells: Array<{
      path: string;
      fields: Array<{ path: string; name: string }>;
    }>;
  };
}

export interface ZarrOverlay {
  labelPath?: string;
  labelChannel?: number;
  values?: number[];
  mode: "outline" | "fill" | "outline-fill";
  color?: string;
  opacity: number;
  outlineWidth: number;
  name?: string;
}

export interface ZarrRenderPanel {
  field: string;
  roi: [number, number, number, number];
  sourceChannels: number[];
  t: number;
  z: number;
  title: string;
  caption?: string;
  overlays: ZarrOverlay[];
  scaleBar?: boolean;
}

export interface ZarrRenderRecipe {
  storeUuid: string;
  title?: string;
  filename?: string;
  layout?: { columns: number };
  panels: ZarrRenderPanel[];
}

export interface ZarrFocusTarget {
  storeUuid: string;
  field: string;
  targetKind: "object" | "point" | "field";
  sizeX: number;
  sizeY: number;
  sizeZ?: number;
  sizeT?: number;
  bbox?: [number, number, number, number];
  centroid?: [number, number];
  sourceChannels: number[];
  labelPath?: string;
  labelChannel?: number;
  labelValue?: number;
  overlays: ZarrOverlay[];
  evidenceIds: string[];
  t: number;
  z: number;
  roi: [number, number, number, number];
  croppedField: boolean;
  title: string;
}

export interface ZarrBinding {
  storeUuid: string;
  objectType: "Image" | "Plate";
  objectId: number;
  groupId: number;
  capabilityImageId: number;
  viewerVersion: string;
  validatedAt: string;
  verified: boolean;
}

export interface ZarrViewerProvenance {
  application: "biomero-zarr-viewer";
  viewerVersion: string;
  storeUuid: string;
  objectType: "Image" | "Plate";
  objectId: number;
  capabilityImageId: number;
  field: string;
  roi: [number, number, number, number];
  sourceChannels: number[];
  labelPath?: string;
  labelChannel?: number;
  labelValue?: number;
  overlays?: ZarrOverlay[];
  evidenceIds?: string[];
  renderRecipe?: ZarrRenderRecipe;
  renderKind?: "roi" | "gallery";
  t: number;
  z: number;
  viewerUrl: string;
  croppedField: boolean;
}

export interface ModelPayload {
  stdoutSummary?: string;
  stderr?: string;
  preview?: unknown;
  generatedFiles: Array<{ name: string; size: number; type: string }>;
  truncated: boolean;
}

export interface OutboundPayloadAudit {
  id: string;
  workspaceId: string;
  chatId: string;
  executionId?: string;
  categories: string[];
  byteLength: number;
  payload: string;
  createdAt: string;
}

export interface DataProfile {
  path: string;
  format: string;
  size: number;
  summary: Record<string, unknown>;
  error?: string;
}

export interface ProviderSettings {
  protocol: "openai" | "anthropic";
  endpoint: string;
  authMode: "none" | "bearer" | "api-key";
  apiKey: string;
  model: string;
  contextWindow: number;
  rememberKey: boolean;
}

export interface AiProfile {
  id: string;
  name: string;
  settings: ProviderSettings;
}

export interface AiProfileStore {
  activeProfileId: string;
  profiles: AiProfile[];
}

export interface CustomSkill {
  id: string;
  name: string;
  description: string;
  filename: string;
  sourceType: "upload" | "url";
  sourceUrl?: string;
  content: string;
  sha256: string;
  extensions: string[];
  enabled: boolean;
  createdAt: string;
}

export interface AnalysisSettingsBundle {
  schema: "nl.bioimaging.analysis.settings.bundle.v1";
    analysis: {
      plotCsv: boolean;
      theme?: "dark" | "light";
    };
  ai: AiProfileStore;
  skills: CustomSkill[];
}

export interface AnalysisSettingsStatus {
  schema: "nl.bioimaging.analysis.settings.bundle.v1";
  synced: boolean;
  projectId?: number;
  datasetId?: number;
  annotationId?: number;
  payload?: AnalysisSettingsBundle | null;
  aiDatasetId?: number;
  skillsDatasetId?: number;
  profileCount?: number;
  skillCount?: number;
}

export interface RuntimeOutput {
  stdout: string;
  stderr: string;
  preview: unknown;
  modelPayload: ModelPayload;
  files: Array<{ name: string; type: string; data: ArrayBuffer }>;
}

export interface RuntimeProgress {
  percent: number;
  message: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  sessionTokens: number;
  estimated: boolean;
  contextWindow: number;
  compactionThreshold: number;
  compactedMessages: number;
  compacted: boolean;
}

export interface AnalysisWorkspace {
  workspace: WorkspaceRecord;
  chats: ChatRecord[];
  files: WorkspaceFile[];
  executions: ExecutionRecord[];
  methods: MethodRecord[];
  pipelines: PipelineRecord[];
  notebooks: NotebookRecord[];
  artifacts: ArtifactRecord[];
  audits: OutboundPayloadAudit[];
  evidence: EvidenceRecord[];
}

export interface NotebookOutput {
  output_type: "stream" | "execute_result" | "display_data" | "error";
  name?: "stdout" | "stderr";
  text?: string | string[];
  data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  execution_count?: number | null;
  ename?: string;
  evalue?: string;
  traceback?: string[];
}

export interface NotebookCell {
  id?: string;
  cell_type: "markdown" | "code" | "raw";
  source: string | string[];
  metadata: Record<string, unknown>;
  execution_count?: number | null;
  outputs?: NotebookOutput[];
}

export interface NotebookDocument {
  nbformat: 4;
  nbformat_minor: number;
  metadata: Record<string, any>;
  cells: NotebookCell[];
}

export interface NotebookRecord {
  id: string;
  workspaceId: string;
  name: string;
  document: NotebookDocument;
  sourceAnnotationId?: number;
  attachmentIds: number[];
  selectedDataFileIds: string[];
  libraryOrigin?: LibraryOrigin;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryOrigin {
  projectId: number;
  datasetId: number;
  workspaceId: string;
  itemKey: string;
  revision: number;
  sha256: string;
}

export type SyncItemKind =
  | "png-image"
  | "result"
  | "template-input"
  | "chat-json"
  | "chat-markdown"
  | "method"
  | "method-python"
  | "pipeline"
  | "notebook";

export interface SyncInventoryItem {
  key: string;
  kind: SyncItemKind;
  name: string;
  mimetype: string;
  size: number;
  sha256: string;
  logicalPath: string;
  metadata: Record<string, unknown>;
}

export interface SyncInventory {
  schema: "nl.bioimaging.analysis.sync.inventory.v1";
  workspace: {
    id: string;
    name: string;
    sourceObjectType: OmeroObjectType;
    sourceObjectId: number;
    sourceObjectName: string;
    userId: number;
    groupId: number;
  };
  items: SyncInventoryItem[];
  digest: string;
}

export interface SyncPayload {
  inventory: SyncInventory;
  bytes: Map<string, Uint8Array>;
}

export interface SyncStatus {
  schema: "nl.bioimaging.analysis.sync.status.v1";
  canSync: boolean;
  reason: string;
  linked: boolean;
  projectId?: number;
  projectName?: string;
  datasetId?: number;
  datasetName?: string;
  manifestAnnotationId?: number;
  remoteRevision: number;
  inventoryDigest: string;
  itemCount: number;
  lastSyncedAt?: string;
}

export interface SyncPlan {
  schema: "nl.bioimaging.analysis.sync.plan.v1";
  planToken: string;
  projectName: string;
  datasetName: string;
  uploadKeys: string[];
  create: number;
  update: number;
  delete: number;
  unchanged: number;
  uploadBytes: number;
  remoteRevision: number;
}

export type LibraryItemKind = "method" | "pipeline" | "notebook";

export interface LibraryItem {
  key: string;
  kind: LibraryItemKind;
  name: string;
  description: string;
  version: number;
  sha256: string;
  size: number;
  annotationId: number;
  mimetype: string;
  requiredCapabilities: string[];
  requiredFormats: string[];
  dependencies: string[];
}

export interface LibraryDataset {
  projectId: number;
  datasetId: number;
  datasetName: string;
  workspaceId: string;
  workspaceName: string;
  sourceObjectType: OmeroObjectType;
  sourceObjectId: number;
  sourceObjectName: string;
  revision: number;
  updatedAt: string;
  items: LibraryItem[];
}

declare global {
  interface Window {
    OMERO_ANALYSIS: Bootstrap;
  }
}
