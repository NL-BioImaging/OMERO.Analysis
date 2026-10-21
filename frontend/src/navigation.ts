export type AppTab = "inspector" | "notebooks" | "libraries" | "skills";
export function appTabFromRoute(value: string | null): AppTab {
  if (value === "notebooks" || value === "libraries" || value === "skills") return value;
  if (value === "editor") return "notebooks";
  return "inspector";
}
