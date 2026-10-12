import { parseNotebook, clearNotebookInlineState } from "./NotebookView";
import { parseNotebookProtocol } from "./notebookProtocol";
import { sha256 } from "./storage";
import type { NotebookRecord, NotebookDocument } from "./types";

export const NOTEBOOK_SOURCE_SCHEMA = "nl.bioimaging.notebook-source.v1";
const MAX_SOURCE_BYTES = 32 * 1024 * 1024;

function sourceDocument(document: NotebookDocument): NotebookDocument {
  const clean = clearNotebookInlineState(document);
  const { widgets: _widgets, ...metadata } = clean.metadata || {};
  return { ...clean, metadata };
}

async function revision(record: NotebookRecord): Promise<string> {
  return sha256(new TextEncoder().encode(JSON.stringify({ id: record.id, document: sourceDocument(record.document) })).buffer);
}

/** Draft-aware, source-only transport. No save, execution or network side effects. */
export async function exportNotebookSource(record: NotebookRecord): Promise<string> {
  return JSON.stringify({ schema: NOTEBOOK_SOURCE_SCHEMA, notebook_id: record.id,
    base_revision: await revision(record), document: sourceDocument(record.document) }, null, 2);
}

export async function applyNotebookSource(record: NotebookRecord, source: string): Promise<NotebookDocument> {
  if (new TextEncoder().encode(source).byteLength > MAX_SOURCE_BYTES) throw new Error("Notebook source exceeds 32 MiB");
  let value;
  try { value = JSON.parse(source); } catch { throw new Error("Notebook source must be valid JSON"); }
  if (!value || value.schema !== NOTEBOOK_SOURCE_SCHEMA || value.notebook_id !== record.id) {
    throw new Error("Source belongs to a different notebook or uses an unsupported schema");
  }
  if (value.base_revision !== await revision(record)) throw new Error("The notebook draft changed. Close and reopen Whole notebook before applying edits.");
  const document = sourceDocument(parseNotebook(new TextEncoder().encode(JSON.stringify(value.document)).buffer));
  parseNotebookProtocol(document);
  return document;
}
