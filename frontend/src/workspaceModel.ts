import type { AnalysisWorkspace, ChatRecord, WorkspaceFile, OmeroContext } from "./types";

export function workspaceSourcePrefix(context: OmeroContext | null): string {
  if (!context) return "";
  return (context.source_path?.length ? context.source_path.map(item => item.name) : [context.name])
    .map(name => name.replace(/[\u0000-\u001f]+/g, " ").replace(/\s+/g, " ").trim())
    .join(" › ");
}

export function workspaceNameSuffix(context: OmeroContext | null, name: string): string {
  const prefix = workspaceSourcePrefix(context);
  return prefix && name.startsWith(`${prefix} — `) ? name.slice(prefix.length + 3) : name;
}

export function scopedWorkspaceName(context: OmeroContext | null, name: string): string {
  const suffix = normalizeWorkspaceName(workspaceNameSuffix(context, name));
  if (!suffix) throw new Error("Workspace name cannot be empty");
  const prefix = workspaceSourcePrefix(context);
  return prefix ? `${prefix} — ${suffix}` : suffix;
}

export function groupChatResults(
  files: WorkspaceFile[],
  chats: ChatRecord[]
): { byChat: Map<string, WorkspaceFile[]>; unassigned: WorkspaceFile[] } {
  const chatIds = new Set(chats.map((chat) => chat.id));
  const byChat = new Map(chats.map((chat) => [chat.id, [] as WorkspaceFile[]]));
  const unassigned: WorkspaceFile[] = [];
  for (const file of files) {
    if (file.chatId && chatIds.has(file.chatId)) {
      byChat.get(file.chatId)!.push(file);
    } else {
      unassigned.push(file);
    }
  }
  return { byChat, unassigned };
}

function workspaceSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 72)
    .toLowerCase() || "analysis";
}

export function normalizeWorkspaceName(value: string): string {
  return value
    .replace(/[\u0000-\u001f\\/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

export function renameAnalysisWorkspace(
  workspace: AnalysisWorkspace,
  requestedName: string,
  updatedAt: string,
  context?: OmeroContext | null
): AnalysisWorkspace {
  const name = context ? scopedWorkspaceName(context, requestedName) : normalizeWorkspaceName(requestedName);
  if (!name) throw new Error("Workspace name cannot be empty");
  const previousRoot = workspace.workspace.rootPath;
  const objectRoot = previousRoot.split("--", 1)[0] || "OMERO/Local";
  // The object ID already scopes this path. Keep the distinguishing label
  // when a long source prefix would otherwise consume the entire slug.
  const rootPath = `${objectRoot}--${workspaceSlug(context ? workspaceNameSuffix(context, name) : name)}`;
  const files = workspace.files.map((file) => ({
    ...file,
    logicalPath: file.logicalPath.startsWith(`${previousRoot}/`)
      ? `${rootPath}${file.logicalPath.slice(previousRoot.length)}`
      : file.logicalPath
  }));
  return {
    ...workspace,
    workspace: {
      ...workspace.workspace,
      name,
      rootPath,
      updatedAt
    },
    files
  };
}

export function trashWorkspaceOutputs(
  workspace: AnalysisWorkspace,
  outputIds: Iterable<string>,
  deletedAt: string
): AnalysisWorkspace {
  const ids = new Set(outputIds);
  return {
    ...workspace,
    files: workspace.files.map((file) =>
      ids.has(file.id) && file.source === "result" && !file.deletedAt
        ? { ...file, deletedAt }
        : file
    )
  };
}
