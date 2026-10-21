import { useEffect, useRef, useState } from "react";
import { compatibilityLabel, type Compatibility } from "../notebookCompatibility";
import type { LibraryDataset, LibraryItem } from "../types";

const KIND_ORDER = ["notebook"] as const;
const KIND_LABELS = { notebook: "Notebooks" };

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
  inputKey = "",
  checkNotebook,
  query,
  selected,
  openDatasets,
  availableFormats,
  zarrViewerAvailable,
  onToggleDataset,
  onToggleItem
}: {
  datasets: LibraryDataset[];
  inputKey?: string;
  checkNotebook?: (item: LibraryItem) => Promise<Compatibility>;
  query: string;
  selected: Set<string>;
  openDatasets: Set<number>;
  availableFormats: Set<string>;
  zarrViewerAvailable: boolean;
  onToggleDataset: (datasetId: number, open: boolean) => void;
  onToggleItem: (key: string) => void;
}) {
  const [checks, setChecks] = useState<Record<string, Compatibility>>({});
  const checker = useRef(checkNotebook); checker.current = checkNotebook;
  const sourceKey = JSON.stringify(datasets.flatMap(dataset => dataset.items
    .filter(item => item.kind === "notebook").map(item => [dataset.datasetId, item.key, item.sha256])));
  useEffect(() => {
    let cancelled = false;
    setChecks({});
    void (async () => {
      for (const dataset of datasets) for (const item of dataset.items) {
        if (item.kind !== "notebook" || !checker.current || cancelled) continue;
        let result: Compatibility;
        try { result = await checker.current(item); }
        catch (error) { result = { status: "unchecked", reasons: [String(error)] }; }
        if (!cancelled) setChecks(current => ({ ...current, [`${dataset.datasetId}:${item.key}`]: result }));
      }
    })();
    return () => { cancelled = true; };
  }, [sourceKey, inputKey]);
  const [rootOpen, setRootOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set(
    datasets.flatMap((dataset) => KIND_ORDER.map((kind) => `${dataset.datasetId}:${kind}`))
  ));
  const normalizedQuery = query.trim().toLowerCase();
  const visibleDatasets = datasets.map((dataset) => ({
    dataset,
    items: dataset.items.filter((item) =>
      item.kind === "notebook" && itemMatches(dataset, item, normalizedQuery)
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
                          const match: Compatibility = checks[key] || (needsSetup
                            ? { status: "incompatible", reasons: [...missingFormats.map(value => `Missing format: ${value}`), ...missingCapabilities.map(value => `Missing capability: ${value}`)] }
                            : { status: "unchecked", reasons: ["Checking notebook requirements against the selected inputs"] });
                          return (
                            <li key={key} role="treeitem">
                              <label>
                                <input
                                  type="checkbox"
                                  checked={selected.has(key)}
                                  onChange={() => onToggleItem(key)}
                                />
                                <span className={`library-item-icon ${item.kind}`}>
                                  NB
                                </span>
                                <span className="library-item-copy">
                                  <strong>{item.name}</strong>
                                  <small>
                                    v{item.version} · {bytesLabel(item.size)}
                                    {item.description ? ` · ${item.description}` : ""}
                                  </small>
                                </span>
                                <span title={match.reasons.join("; ")} className={`compatibility ${match.status}`}>
                                  {compatibilityLabel[match.status]}
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
