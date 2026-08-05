import type { MethodRecord, NotebookRecord, PipelineRecord } from "../types";
import { ActionIcon } from "./ActionIcon";
import { Button } from "./BlueprintControls";

interface AnalysisHomeProps {
  methods: MethodRecord[];
  pipelines: PipelineRecord[];
  notebooks: NotebookRecord[];
  methodId: string;
  pipelineId: string;
  notebookId: string;
  notebookPipelineId: string;
  busy: boolean;
  editorEnabled: boolean;
  providerReady: boolean;
  onMethodIdChange: (id: string) => void;
  onPipelineIdChange: (id: string) => void;
  onNotebookIdChange: (id: string) => void;
  onNotebookPipelineIdChange: (id: string) => void;
  onRunMethod: (method: MethodRecord) => void;
  onRunPipeline: (pipeline: PipelineRecord) => void;
  onRunNotebook: (notebook: NotebookRecord) => void;
  onOpenAssistant: () => void;
  onNewMethod: () => void;
  onCreatePipeline: () => void;
  onPipelineToNotebook: (pipeline: PipelineRecord) => void;
  onNewNotebook: () => void;
}

export function AnalysisHome({
  methods,
  pipelines,
  notebooks,
  methodId,
  pipelineId,
  notebookId,
  notebookPipelineId,
  busy,
  editorEnabled,
  providerReady,
  onMethodIdChange,
  onPipelineIdChange,
  onNotebookIdChange,
  onNotebookPipelineIdChange,
  onRunMethod,
  onRunPipeline,
  onRunNotebook,
  onOpenAssistant,
  onNewMethod,
  onCreatePipeline,
  onPipelineToNotebook,
  onNewNotebook
}: AnalysisHomeProps) {
  const selectedMethod = methods.find((item) => item.id === (methodId || methods[0]?.id));
  const selectedPipeline = pipelines.find((item) => item.id === (pipelineId || pipelines[0]?.id));
  const selectedNotebook = notebooks.find((item) => item.id === (notebookId || notebooks[0]?.id));
  const notebookPipeline = pipelines.find(
    (item) => item.id === (notebookPipelineId || pipelines[0]?.id)
  );

  return (
    <section className="analysis-home" aria-labelledby="analysis-home-title">
      <header className="analysis-home-header">
        <span className="eyebrow">Reusable browser-local analysis</span>
        <h2 id="analysis-home-title">What would you like to do?</h2>
        <p>Run a saved analysis or create a reusable Method, Pipeline, or Notebook.</p>
      </header>

      <section className="analysis-home-group" aria-labelledby="run-analysis-title">
        <header><h3 id="run-analysis-title">Run a saved analysis</h3></header>
        <div className="analysis-home-grid">
          <article className="analysis-start-card">
            <ActionIcon name="run" />
            <h3>Run a Method</h3>
            <p>Execute the current saved version with inputs from this Workspace.</p>
            <div className="analysis-card-controls">
              <select aria-label="Method to run" value={methodId || methods[0]?.id || ""}
                onChange={(event) => onMethodIdChange(event.target.value)} disabled={!methods.length}>
                {methods.map((method) => (
                  <option key={method.id} value={method.id}>{method.name} · v{method.currentVersion}</option>
                ))}
              </select>
              <Button disabled={!selectedMethod || busy}
                onClick={() => selectedMethod && onRunMethod(selectedMethod)}>
                <ActionIcon name="run" />Run Method
              </Button>
              {!methods.length && <small>Create or import a Method first.</small>}
            </div>
          </article>

          <article className="analysis-start-card">
            <ActionIcon name="pipeline" />
            <h3>Run a Pipeline</h3>
            <p>Run an ordered collection of pinned Method versions.</p>
            <div className="analysis-card-controls">
              <select aria-label="Pipeline to run" value={pipelineId || pipelines[0]?.id || ""}
                onChange={(event) => onPipelineIdChange(event.target.value)} disabled={!pipelines.length}>
                {pipelines.map((pipeline) => (
                  <option key={pipeline.id} value={pipeline.id}>{pipeline.name} · v{pipeline.version}</option>
                ))}
              </select>
              <Button disabled={!selectedPipeline || busy}
                onClick={() => selectedPipeline && onRunPipeline(selectedPipeline)}>
                <ActionIcon name="run" />Run Pipeline
              </Button>
              {!pipelines.length && <small>Create a Pipeline from saved Methods first.</small>}
            </div>
          </article>

          <article className="analysis-start-card">
            <ActionIcon name="notebook" />
            <h3>Run a Notebook</h3>
            <p>Reattach current inputs, reset stale outputs, and run all cells.</p>
            <div className="analysis-card-controls">
              <select aria-label="Notebook to run" value={notebookId || notebooks[0]?.id || ""}
                onChange={(event) => onNotebookIdChange(event.target.value)} disabled={!notebooks.length}>
                {notebooks.map((notebook) => (
                  <option key={notebook.id} value={notebook.id}>{notebook.name}</option>
                ))}
              </select>
              <Button disabled={!selectedNotebook}
                onClick={() => selectedNotebook && onRunNotebook(selectedNotebook)}>
                <ActionIcon name="run" />Run Notebook
              </Button>
              {!notebooks.length && <small>Create, upload, or import a Notebook first.</small>}
            </div>
          </article>
        </div>
      </section>

      <section className="analysis-home-group" aria-labelledby="create-analysis-title">
        <header><h3 id="create-analysis-title">Create a reusable analysis</h3></header>
        <div className="analysis-home-grid">
          <article className="analysis-start-card method-assistant-card">
            <ActionIcon name="chat" />
            <h3>Create a Method</h3>
            <p>Develop a validated Method with the Assistant, or start from an input-ready template.</p>
            <div className="analysis-card-controls">
              <div className="analysis-card-actions">
                <Button aria-label="Create Method with Assistant" onClick={onOpenAssistant}>
                  <ActionIcon name="chat" />With Assistant
                </Button>
                <Button aria-label="Create new Method" disabled={!editorEnabled}
                  title={editorEnabled ? "Create a new Method" : "Enable the artifact editor in Analysis Settings"}
                  onClick={onNewMethod}>
                  <ActionIcon name="add" />New Method
                </Button>
              </div>
              {!providerReady && <small>Configure an AI provider before using the Assistant.</small>}
              {!editorEnabled && <small>Enable the artifact editor to create a Method directly.</small>}
            </div>
          </article>

          <article className="analysis-start-card create-pipeline-card">
            <ActionIcon name="pipeline" />
            <h3>Create a Pipeline</h3>
            <p>Select saved Methods and arrange them into an ordered reusable Pipeline.</p>
            <div className="analysis-card-controls">
              <Button aria-label="Create new Pipeline" disabled={!methods.length} onClick={onCreatePipeline}>
                <ActionIcon name="pipeline" />Choose Methods
              </Button>
              {methods.length < 2 && <small>Create or import at least two Methods to complete a Pipeline.</small>}
            </div>
          </article>

          <article className="analysis-start-card create-notebook-card">
            <ActionIcon name="notebook" />
            <h3>Create a Notebook</h3>
            <p>Convert a saved Pipeline, or start with current Workspace inputs attached.</p>
            <div className="analysis-card-controls">
              <select aria-label="Pipeline to convert to Notebook"
                value={notebookPipelineId || pipelines[0]?.id || ""}
                onChange={(event) => onNotebookPipelineIdChange(event.target.value)}
                disabled={!pipelines.length}>
                {pipelines.map((pipeline) => (
                  <option key={pipeline.id} value={pipeline.id}>{pipeline.name} · v{pipeline.version}</option>
                ))}
              </select>
              <div className="analysis-card-actions">
                <Button aria-label="Create Notebook from Pipeline" disabled={!notebookPipeline}
                  onClick={() => notebookPipeline && onPipelineToNotebook(notebookPipeline)}>
                  <ActionIcon name="pipeline" />From Pipeline
                </Button>
                <Button aria-label="Create new Notebook" disabled={!editorEnabled}
                  title={editorEnabled ? "Create a new Notebook" : "Enable the artifact editor in Analysis Settings"}
                  onClick={onNewNotebook}>
                  <ActionIcon name="add" />New Notebook
                </Button>
              </div>
              {!editorEnabled && <small>Enable the artifact editor to create a new Notebook directly.</small>}
            </div>
          </article>
        </div>
      </section>
    </section>
  );
}
