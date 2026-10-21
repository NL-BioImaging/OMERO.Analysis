import { useEffect, useRef, useState } from "react";
import { Icon } from "@blueprintjs/core";
import { Button } from "./components/BlueprintControls";
import { OmeroBridge } from "./api";
import { compatibilityLabel, type Compatibility } from "./notebookCompatibility";
import { NOTEBOOK_PROTOCOL_SCHEMA, validateNotebookContract, type NotebookProtocolContract } from "./notebookProtocol";
import type { NotebookRecord, WorkflowSkillCatalog } from "./types";
export interface WorkflowNotebookAsset {
  name: string; title: string; sha256: string; resolved_commit: string; workflow_key: string;
  compatibility: { inputs: unknown[]; requirements: string[] };
}
export function WorkflowExamples({catalog, bridge, inputKey, check, onImport, onGeneric, notebooks = [], localMatches = {}, onOpenLocal}: {
  notebooks?: NotebookRecord[]; localMatches?: Record<string, Compatibility>; onOpenLocal?: (id: string) => void;
  catalog: WorkflowSkillCatalog | null; bridge: OmeroBridge; inputKey: string;
  check: (contract: NotebookProtocolContract) => Promise<Compatibility>;
  onImport: (file: File) => Promise<void>; onGeneric: () => void;
}) {
  const localExamples = notebooks.filter(notebook => !notebook.deletedAt && notebook.document.metadata?.["biomero.workflow_example"] && typeof notebook.document.metadata["biomero.workflow_example"] === "object");
  const examples = (catalog?.workflows || []).flatMap(entry => entry.notebooks || []);
  const [matches, setMatches] = useState<Record<string, Compatibility>>({});
  const [error, setError] = useState(""), [busy, setBusy] = useState("");
  const checker = useRef(check); checker.current = check;
  const key = (asset: WorkflowNotebookAsset) => `${asset.workflow_key}/${asset.name}`;
  useEffect(() => {
    let alive = true;
    void (async () => {
      const result: Record<string, Compatibility> = {};
      for (const asset of examples) {
        try {
          const contract = validateNotebookContract({schema: NOTEBOOK_PROTOCOL_SCHEMA, ...asset.compatibility, results: {path:"results"}, parameters:[]}, true);
          result[key(asset)] = await checker.current(contract);
        } catch (e) { result[key(asset)] = {status:"unchecked", reasons:[String(e)]}; }
      }
      if (alive) setMatches(result);
    })();
    return () => { alive = false; };
  }, [JSON.stringify(examples), inputKey]);
  return <div className="workflow-notebook-tree analysis-library-tree" aria-label="Notebook examples">
    <details className="library-panel" open><summary><Icon icon="folder-open" /><strong>Starter notebooks</strong><small>1</small></summary>
      <div className="library-panel-body"><div className="workflow-example-row"><Icon icon="manual" /><span className="workflow-example-copy"><strong>Explore selected input</strong><small>A bounded CSV/database preview with portable input bindings. Edit its query in Notebooks.</small></span><Button onClick={onGeneric}>Create a copy</Button></div></div>
    </details>
    <details className="library-panel" open><summary><Icon icon="folder-open" /><strong>Workflow examples</strong><small>{examples.length + localExamples.length}</small></summary>
      <div className="library-panel-body">
        {!examples.length && !localExamples.length && <p>No examples are published at the configured workflow revisions. Upload unreleased local .ipynb examples through Notebooks; workflow execution pins stay unchanged.</p>}
        {error && <p role="alert">{error}</p>}
        {localExamples.length > 0 && <details className="library-tree-group" open><summary><Icon icon="folder-close" /><strong>Uploaded workflow examples</strong></summary>
          {localExamples.map(notebook => <div className="workflow-example-row" key={notebook.id}><Icon icon="manual" /><span className="workflow-example-copy"><strong>{notebook.name}</strong>
            <small>Local workspace copy · unreleased · {compatibilityLabel[localMatches[notebook.id]?.status || "unchecked"]}</small>
            <small>{localMatches[notebook.id]?.reasons.join("; ")}</small></span><Button onClick={() => onOpenLocal?.(notebook.id)}>Open</Button></div>)}
        </details>}
        {[...new Set(examples.map(asset => asset.workflow_key))].map(workflow => <details className="library-tree-group" key={workflow} open>
          <summary><Icon icon="folder-close" /><strong>{workflow}</strong></summary>
          {examples.filter(asset => asset.workflow_key === workflow).map(asset => <div className="workflow-example-row" key={key(asset)}>
            <Icon icon="manual" /><span className="workflow-example-copy"><strong>{asset.title}</strong>
              <small className={`compatibility ${matches[key(asset)]?.status || "unchecked"}`} title={matches[key(asset)]?.reasons.join("; ")}>{compatibilityLabel[matches[key(asset)]?.status || "unchecked"]}: {matches[key(asset)]?.reasons.join("; ")}</small>
              <small title={`Source commit: ${asset.resolved_commit}\nSHA-256: ${asset.sha256}`}>Source and checksum verified · imported as a copy</small></span>
            <Button disabled={!!busy} onClick={() => { setBusy(key(asset)); setError(""); void bridge.loadWorkflowNotebook(asset).then(onImport).catch(e => setError(String(e))).finally(() => setBusy("")); }}>{busy === key(asset) ? "Importing…" : "Import a copy"}</Button>
          </div>)}
        </details>)}
      </div>
    </details>
  </div>;
}
