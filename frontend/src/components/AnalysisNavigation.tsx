import type { AppTab } from "../navigation";
import { Button } from "./BlueprintControls";
export function AnalysisNavigation({ activeTab, onNavigate }: { activeTab: AppTab; onNavigate: (tab: AppTab) => void }) {
  return <nav className="analysis-tabs" aria-label="Analysis views">
    {(["inspector", "notebooks", "libraries", "skills"] as const).map(tab =>
      <Button key={tab} icon={false} aria-current={activeTab === tab ? "page" : undefined}
        className={activeTab === tab ? "active" : ""} onClick={() => onNavigate(tab)}>
        {tab[0].toUpperCase() + tab.slice(1)}</Button>)}
  </nav>;
}
