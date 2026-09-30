export type AppTab =
  | "home"
  | "methods"
  | "pipelines"
  | "notebooks"
  | "results"
  | "assistant"
  | "editor"
  | "settings";

export function appTabFromRoute(value: string | null): AppTab {
  if (
    value === "methods" || value === "pipelines" || value === "notebooks" ||
    value === "assistant" || value === "editor" || value === "settings" || value === "results"
  ) return value;
  return "home";
}

export function runKindForTab(tab: AppTab): "method" | "pipeline" | null {
  if (tab === "methods") return "method";
  if (tab === "pipelines") return "pipeline";
  return null;
}
