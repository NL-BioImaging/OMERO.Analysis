import { useState } from "react";
import type { LibraryDataset, LibraryItem } from "../types";

const KIND_ORDER: LibraryItem["kind"][] = ["method", "pipeline", "notebook"];
const KIND_LABELS: Record<LibraryItem["kind"], string> = {
  method: "Methods",
  pipeline: "Pipelines",
  notebook: "Notebooks"
};

function bytesLabel(size: number): string {
  if (size < 1024) return `${size} bytes`;
  if (size < 1024 ** 2) return `${(size / 1024).toFixed(1)} KiB`;
  return `${(size / 1024 ** 2).toFixed(1)} MiB`;
}

function itemMatches(dataset: LibraryDataset, item: LibraryItem, query: string) {
  if (!query) return true;
  return [
    dataset.datasetName,
    dataset.sourceObjectName,
    dataset.sourceObjectType,
    dataset.workspaceName,
    item.name,
    item.kind,
    item.description
  ].some((value) => String(value).toLowerCase().includes(query));
}

export function WorkspaceLibraryTree({
  datasets,
  query,
  selected,
  openDatasets,
  availableFormats,
  zarrViewerAvailable,
  onToggleDataset,
  onToggleItem
}: {
  datasets: LibraryDataset[];
  query: string;
  selected: Set<string>;
  openDatasets: Set<number>;
  availableFormats: Set<string>;
  zarrViewerAvailable: boolean;
  onToggleDataset: (datasetId: number, open: boolean) => void;
  onToggleItem: (key: string) => void;
}) {
  const [rootOpen, setRootOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set(
    datasets.flatMap((dataset) => KIND_ORDER.map((kind) => `${dataset.datasetId}:${kind}`))
  ));
  const normalizedQuery = query.trim().toLowerCase();
  const visibleDatasets = datasets.map((dataset) => ({
    dataset,
    items: dataset.items.filter((item) =>
      itemMatches(dataset, item, normalizedQuery)
    )
  })).filter(({ items }) => items.length > 0);

  return (
    <div className="analysis-library-tree" role="tree" aria-label="AnalysisWorkspaces library">
      <details className="library-tree-root-node" open={Boolean(normalizedQuery) || rootOpen}>
        <summary
          className="library-tree-root"
          role="treeitem"
          aria-expanded={Boolean(normalizedQuery) || rootOpen}
          onClick={(event) => {
            if (normalizedQuery) return;
            event.preventDefault();
            setRootOpen((open) => !open);
          }}
        >
          <span className="library-tree-chevron">›</span>
          <img
            className="library-tree-folder"
            src="/static/webclient/image/folder16.png"
            alt=""
          />
          <strong>+AnalysisWorkspaces</strong>
          <small>{visibleDatasets.length} Dataset{visibleDatasets.length === 1 ? "" : "s"}</small>
        </summary>
        <div className="library-tree-children">
        {visibleDatasets.map(({ dataset, items }) => {
          const datasetOpen = Boolean(normalizedQuery) || openDatasets.has(dataset.datasetId);
          return (
            <details
              key={dataset.datasetId}
              className="library-tree-dataset"
              open={datasetOpen}
            >
              <summary onClick={(event) => {
                if (normalizedQuery) return;
                event.preventDefault();
                onToggleDataset(dataset.datasetId, !datasetOpen);
              }}>
                <span className="library-tree-chevron">›</span>
                <img
                  className="library-tree-folder"
                  src="/static/webclient/image/folder_image16.png"
                  alt=""
                />
                <span>
                  <strong>{dataset.datasetName}</strong>
                  <small>
                    {dataset.sourceObjectType}-{dataset.sourceObjectId} · revision {dataset.revision}
                  </small>
                </span>
                <small>{items.length}</small>
              </summary>
              <div className="library-tree-children">
                {KIND_ORDER.map((kind) => {
                  const kindItems = items.filter((item) => item.kind === kind);
                  if (!kindItems.length) return null;
                  const groupKey = `${dataset.datasetId}:${kind}`;
                  const groupOpen = Boolean(normalizedQuery) || openGroups.has(groupKey);
                  return (
                    <details className="library-tree-group" open={groupOpen} key={kind}>
                      <summary onClick={(event) => {
                        if (normalizedQuery) return;
                        event.preventDefault();
                        setOpenGroups((current) => {
                          const next = new Set(current);
                          if (groupOpen) next.delete(groupKey); else next.add(groupKey);
                          return next;
                        });
                      }}>
                        <span className="library-tree-chevron">›</span>
                        <img
                          className="library-tree-folder"
                          src="/static/webclient/image/folder_yellow16.png"
                          alt=""
                        />
                        <strong>{KIND_LABELS[kind]}</strong>
                        <small>{kindItems.length}</small>
                      </summary>
                      <ul>
                        {kindItems.map((item) => {
                          const key = `${dataset.datasetId}:${item.key}`;
                          const missingFormats = item.requiredFormats.filter(
                            (format) => !availableFormats.has(
                              format.replace(/^\./, "").toLowerCase()
                            )
                          );
                          const missingCapabilities = item.requiredCapabilities.filter(
                            (capability) => capability.includes("zarr") &&
                              !zarrViewerAvailable
                          );
                          const needsSetup = missingFormats.length > 0 ||
                            missingCapabilities.length > 0;
                          return (
                            <li key={key} role="treeitem">
                              <label>
                                <input
                                  type="checkbox"
                                  checked={selected.has(key)}
                                  onChange={() => onToggleItem(key)}
                                />
                                <span className={`library-item-icon ${item.kind}`}>
                                  {item.kind === "method" ? "Py" :
                                    item.kind === "pipeline" ? "PL" : "NB"}
                                </span>
                                <span className="library-item-copy">
                                  <strong>{item.name}</strong>
                                  <small>
                                    v{item.version} · {bytesLabel(item.size)}
                                    {item.description ? ` · ${item.description}` : ""}
                                  </small>
                                </span>
                                <span className={needsSetup ? "compatibility needs-setup" : "compatibility"}>
                                  {needsSetup ? "Needs setup" : "Compatible"}
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  );
                })}
              </div>
            </details>
          );
        })}
        {!visibleDatasets.length && (
          <p className="library-tree-empty">
            {normalizedQuery
              ? "No matching reusable items."
              : "No synchronized Workspaces are available in this OMERO group."}
          </p>
        )}
        </div>
      </details>
    </div>
  );
}
