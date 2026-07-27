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
  kind: "attachment" | "result" | "project" | "workflow";
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
  selected_project_snapshot?: Attachment | null;
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
  workflowTemplatesTemplate: string;
  workflowDownloadTemplate: string;
  workflowSkillsUrl: string;
  zarrViewerStatusUrl: string;
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
  applications?: WorkflowSkillEntry[];
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

export interface ProjectRecord {
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
  sourceSnapshotAnnotationId?: number;
  origin?: {
    contextKey: string;
    userId: number;
    groupId: number;
    snapshotAnnotationId?: number;
  };
  zarrBindings?: Record<string, ZarrBinding>;
  revision?: number;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRecord {
  id: string;
  projectId: string;
  title: string;
  summary: string;
  archived: boolean;
  pinnedMessageIds?: string[];
  deletedAt?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceFile {
  id: string;
  projectId: string;
  chatId?: string;
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
  kind?: "text" | "error" | "execution" | "viewer-preview";
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
  createdAt: string;
}

export type ExecutionPurpose = "inspection" | "analysis" | "script";

export interface ExecutionRecord {
  id: string;
  projectId: string;
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
  | "failed-approach";

export interface EvidenceRecord {
  id: string;
  projectId: string;
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

export interface ScriptVersion {
  version: number;
  code: string;
  codeHash: string;
  executionId: string;
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

export interface ScriptRecord {
  id: string;
  projectId: string;
  name: string;
  description: string;
  versions: ScriptVersion[];
  currentVersion: number;
  inputContract?: InputContract;
  parameters?: ParameterDefinition[];
  projectBindings?: Record<string, Record<string, string>>;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  scriptId: string;
  scriptVersion: number;
  name: string;
  inputBindings: Record<string, string>;
  parameters: Record<string, string | number | boolean>;
}

export interface WorkflowRecord {
  id: string;
  projectId: string;
  name: string;
  description: string;
  version: number;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ArtifactRecord {
  id: string;
  projectId: string;
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
}

export interface ZarrViewerCapability {
  schema_version: 1;
  supported: true;
  image: { id: number; name: string };
  store: { uuid: string; roi_url: string; render_url: string };
  kind: "image" | "plate";
  initial_path: string;
  channels: Array<{ index: number; label: string; active: boolean }>;
  labels: Array<{ id: string; name: string; path: string }>;
  plate?: {
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
  projectId: string;
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
  apiKey: string;
  model: string;
  contextWindow: number;
  rememberKey: boolean;
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
}

export interface ProjectWorkspace {
  project: ProjectRecord;
  chats: ChatRecord[];
  files: WorkspaceFile[];
  executions: ExecutionRecord[];
  scripts: ScriptRecord[];
  workflows: WorkflowRecord[];
  artifacts: ArtifactRecord[];
  audits: OutboundPayloadAudit[];
  evidence: EvidenceRecord[];
}

declare global {
  interface Window {
    OMERO_ANALYSIS_CHAT: Bootstrap;
  }
}
