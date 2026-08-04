import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@blueprintjs/core/lib/css/blueprint.css";
import "./style.css";

const root = document.getElementById("root")!;
const contextNode = document.getElementById("omero-analysis-context");
const value = (name: string) => root.dataset[name] || "";
const existing = window.OMERO_ANALYSIS;
window.OMERO_ANALYSIS = existing?.runtimeBase ? existing : {
  context: contextNode ? JSON.parse(contextNode.textContent || "null") : null,
  tokenUrl: value("tokenUrl"),
  contextTemplate: value("contextTemplate"),
  attachmentsTemplate: value("attachmentsTemplate"),
  hierarchyTemplate: value("hierarchyTemplate"),
  downloadTemplate: value("downloadTemplate"),
  uploadTemplate: value("uploadTemplate"),
  snapshotsTemplate: value("snapshotsTemplate"),
  snapshotUploadTemplate: value("snapshotUploadTemplate"),
  snapshotDownloadTemplate: value("snapshotDownloadTemplate"),
  pipelineTemplatesTemplate: value("pipelineTemplatesTemplate"),
  pipelineDownloadTemplate: value("pipelineDownloadTemplate"),
  notebookDownloadTemplate: value("notebookDownloadTemplate"),
  notebookUploadTemplate: value("notebookUploadTemplate"),
  workspaceSyncStatusTemplate: value("workspaceSyncStatusTemplate"),
  workspaceSyncPlanTemplate: value("workspaceSyncPlanTemplate"),
  workspaceSyncApplyTemplate: value("workspaceSyncApplyTemplate"),
  workspaceSyncRemoveTemplate: value("workspaceSyncRemoveTemplate"),
  workspaceLibraryTemplate: value("workspaceLibraryTemplate"),
  workspaceLibraryDownloadTemplate: value("workspaceLibraryDownloadTemplate"),
  analysisSettingsTemplate: value("analysisSettingsTemplate"),
  workflowSkillsUrl: value("workflowSkillsUrl"),
  zarrViewerStatusUrl: value("zarrViewerStatusUrl"),
  keepaliveUrl: value("keepaliveUrl"),
  keepaliveInterval: Number(value("keepaliveInterval")) || 0,
  styleNonce: value("styleNonce"),
  runtimeBase: value("runtimeBase").replace(/ASSET$/, "")
};

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
