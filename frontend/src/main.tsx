import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";

const root = document.getElementById("root")!;
const contextNode = document.getElementById("omero-analysis-chat-context");
const value = (name: string) => root.dataset[name] || "";
const existing = window.OMERO_ANALYSIS_CHAT;
window.OMERO_ANALYSIS_CHAT = existing?.runtimeBase ? existing : {
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
  workflowTemplatesTemplate: value("workflowTemplatesTemplate"),
  workflowDownloadTemplate: value("workflowDownloadTemplate"),
  workflowSkillsUrl: value("workflowSkillsUrl"),
  runtimeBase: value("runtimeBase").replace(/ASSET$/, "")
};

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
