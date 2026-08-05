import type { AppTab } from "../navigation";
import { ActionIcon } from "./ActionIcon";
import { Button } from "./BlueprintControls";

const iconForTab = (tab: AppTab) =>
  tab === "home" ? "home" as const
    : tab === "methods" ? "run" as const
      : tab === "pipelines" ? "pipeline" as const
        : tab === "assistant" ? "chat" as const
          : tab === "notebooks" ? "notebook" as const
            : "edit" as const;

export function AnalysisNavigation({
  activeTab,
  editorEnabled,
  onNavigate
}: {
  activeTab: AppTab;
  editorEnabled: boolean;
  onNavigate: (tab: AppTab) => void;
}) {
  const tabs: AppTab[] = [
    "home", "methods", "pipelines", "notebooks", "assistant",
    ...(editorEnabled ? ["editor" as const] : [])
  ];
  return (
    <nav className="analysis-tabs" aria-label="Analysis views">
      {tabs.map((tab) => (
        <Button key={tab} className={activeTab === tab ? "active" : ""}
          aria-current={activeTab === tab ? "page" : undefined}
          onClick={() => onNavigate(tab)}>
          <ActionIcon name={iconForTab(tab)} />
          {tab[0].toUpperCase() + tab.slice(1)}
        </Button>
      ))}
    </nav>
  );
}
