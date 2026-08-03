import type { PythonRuntime } from "./runtime";
import type { WorkspaceFile } from "./types";

export const MAX_CHAT_ATTACHMENTS = 10;
export const MAX_CHAT_ATTACHMENT_BYTES = 25 * 1024 * 1024;
export const MAX_MODEL_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_MODEL_IMAGE_EDGE = 2048;
export const ATTACHMENT_EXTRACTOR_VERSION = "chat-attachments-v1-pypdf-6.14.2";

export type SupportedAttachmentKind = "txt" | "docx" | "pdf" | "image";

export interface DerivedTextAttachment {
  kind: "text";
  text: string;
  warnings: string[];
}

export interface DerivedImageAttachment {
  kind: "image";
  mediaType: "image/png" | "image/jpeg" | "image/webp";
  base64: string;
  width: number;
  height: number;
  warnings: string[];
}

export type DerivedAttachment = DerivedTextAttachment | DerivedImageAttachment;

const cache = new Map<string, Promise<DerivedAttachment>>();

function bytesStart(bytes: Uint8Array, expected: number[]): boolean {
  return expected.every((value, index) => bytes[index] === value);
}

export function attachmentKind(
  name: string,
  declaredType: string,
  data: ArrayBuffer
): { kind: SupportedAttachmentKind; type: string } {
  const bytes = new Uint8Array(data, 0, Math.min(data.byteLength, 16));
  const lower = name.toLowerCase();
  if (bytesStart(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d]) && lower.endsWith(".pdf")) {
    return { kind: "pdf", type: "application/pdf" };
  }
  if (bytesStart(bytes, [0x50, 0x4b]) && lower.endsWith(".docx")) {
    return {
      kind: "docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    };
  }
  if (bytesStart(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) && lower.endsWith(".png")) {
    return { kind: "image", type: "image/png" };
  }
  if (bytesStart(bytes, [0xff, 0xd8, 0xff]) && /\.jpe?g$/i.test(lower)) {
    return { kind: "image", type: "image/jpeg" };
  }
  if (
    bytesStart(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP" &&
    lower.endsWith(".webp")
  ) {
    return { kind: "image", type: "image/webp" };
  }
  if (lower.endsWith(".txt") && (!declaredType || /^(text\/plain|application\/octet-stream)$/i.test(declaredType))) {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(data);
    if (text.includes("\0")) throw new Error("TXT attachments cannot contain NUL bytes");
    return { kind: "txt", type: "text/plain" };
  }
  throw new Error("Unsupported attachment. Use UTF-8 TXT, searchable PDF, DOCX, PNG, JPEG, or WebP.");
}

export function safeAttachmentName(value: string): string {
  const name = value
    .replace(/[\\/\u0000-\u001f\u007f]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/^\.+/, "")
    .trim()
    .slice(0, 180);
  return name || "attachment";
}

export function availableAttachmentName(name: string, existing: readonly string[]): string {
  const safe = safeAttachmentName(name);
  const used = new Set(existing.map((value) => value.toLowerCase()));
  if (!used.has(safe.toLowerCase())) return safe;
  const dot = safe.lastIndexOf(".");
  const stem = dot > 0 ? safe.slice(0, dot) : safe;
  const extension = dot > 0 ? safe.slice(dot) : "";
  for (let suffix = 2; suffix < 10_000; suffix += 1) {
    const candidate = `${stem} (${suffix})${extension}`;
    if (!used.has(candidate.toLowerCase())) return candidate;
  }
  throw new Error("Could not create a unique attachment filename");
}

function toBase64(data: Uint8Array): string {
  let result = "";
  for (let offset = 0; offset < data.length; offset += 0x8000) {
    result += String.fromCharCode(...data.subarray(offset, offset + 0x8000));
  }
  return btoa(result);
}

async function canvasBlob(
  canvas: HTMLCanvasElement,
  type: DerivedImageAttachment["mediaType"],
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob(
    (blob) => blob ? resolve(blob) : reject(new Error("The browser could not encode this image")),
    type,
    quality
  ));
}

async function deriveImage(file: WorkspaceFile): Promise<DerivedImageAttachment> {
  const bitmap = await createImageBitmap(new Blob([file.data!], { type: file.type }));
  try {
    let scale = Math.min(1, MAX_MODEL_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
    let quality = 0.92;
    let blob: Blob | null = null;
    let width = 0;
    let height = 0;
    const warnings: string[] = [];
    for (let attempt = 0; attempt < 8; attempt += 1) {
      width = Math.max(1, Math.round(bitmap.width * scale));
      height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { alpha: file.type === "image/png" });
      if (!context) throw new Error("The browser cannot create an image canvas");
      context.drawImage(bitmap, 0, 0, width, height);
      blob = await canvasBlob(canvas, file.type as DerivedImageAttachment["mediaType"], quality);
      if (blob.size <= MAX_MODEL_IMAGE_BYTES) break;
      scale *= 0.82;
      quality = Math.max(0.6, quality - 0.08);
    }
    if (!blob || blob.size > MAX_MODEL_IMAGE_BYTES) {
      throw new Error("The derived image cannot fit the 8 MiB model-input limit");
    }
    const mediaType = ["image/png", "image/jpeg", "image/webp"].includes(blob.type)
      ? blob.type as DerivedImageAttachment["mediaType"]
      : "image/png";
    if (width !== bitmap.width || height !== bitmap.height) {
      warnings.push(`Model copy was resized from ${bitmap.width}×${bitmap.height} to ${width}×${height}.`);
    }
    warnings.push("Image metadata was removed from the model copy.");
    return {
      kind: "image",
      mediaType,
      base64: toBase64(new Uint8Array(await blob.arrayBuffer())),
      width,
      height,
      warnings
    };
  } finally {
    bitmap.close();
  }
}

export function deriveAttachment(
  file: WorkspaceFile,
  runtime: PythonRuntime
): Promise<DerivedAttachment> {
  if (file.role !== "chat-attachment" || !file.data || file.state !== "ready") {
    return Promise.reject(new Error(`${file.name} is missing; reselect or remove it before sending`));
  }
  const key = `${file.sha256}:${ATTACHMENT_EXTRACTOR_VERSION}`;
  const existing = cache.get(key);
  if (existing) return existing;
  const pending = (async (): Promise<DerivedAttachment> => {
    const detected = attachmentKind(file.name, file.type, file.data!);
    if (detected.kind === "image") return deriveImage({ ...file, type: detected.type });
    if (detected.kind === "txt") {
      const text = new TextDecoder("utf-8", { fatal: true }).decode(file.data!).trim();
      if (!text) throw new Error("TXT attachment contains no text");
      return { kind: "text", text, warnings: [] };
    }
    const extracted = await runtime.extractAttachment(file.name, detected.kind, file.data!);
    return { kind: "text", text: extracted.text, warnings: extracted.warnings || [] };
  })();
  cache.set(key, pending);
  pending.catch(() => cache.delete(key));
  return pending;
}

export function attachmentTextBudget(contextWindow: number): number {
  return contextWindow > 0 ? Math.min(16_000, Math.floor(contextWindow * 0.25)) : 6_000;
}

function dispositionFilename(value: string | null): string {
  if (!value) return "";
  const encoded = value.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encoded) {
    try { return decodeURIComponent(encoded.replace(/^"|"$/g, "")); } catch { return ""; }
  }
  return value.match(/filename="?([^";]+)"?/i)?.[1]?.trim() || "";
}

export async function fetchPublicAttachment(urlValue: string): Promise<File> {
  const url = new URL(urlValue.trim());
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("Attachment URLs must be public HTTPS URLs without credentials");
  }
  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      credentials: "omit",
      mode: "cors",
      cache: "no-store",
      redirect: "follow"
    });
  } catch (error) {
    throw new Error(`The URL could not be fetched without credentials. Check CORS and access permissions. ${String(error)}`);
  }
  if (!response.ok || !response.body) throw new Error(`URL fetch failed with HTTP ${response.status}`);
  const declared = response.headers.get("content-type")?.split(";", 1)[0].trim() || "";
  if (/text\/html|application\/xhtml\+xml/i.test(declared)) {
    throw new Error("Webpages are not supported; provide a direct file URL");
  }
  const length = Number(response.headers.get("content-length") || 0);
  if (length > MAX_CHAT_ATTACHMENT_BYTES) throw new Error("Attachment exceeds 25 MiB");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > MAX_CHAT_ATTACHMENT_BYTES) {
      await reader.cancel();
      throw new Error("Attachment exceeds 25 MiB");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  chunks.forEach((chunk) => { bytes.set(chunk, offset); offset += chunk.byteLength; });
  const pathName = decodeURIComponent(new URL(response.url || url).pathname.split("/").at(-1) || "");
  const name = safeAttachmentName(dispositionFilename(response.headers.get("content-disposition")) || pathName);
  const detected = attachmentKind(name, declared, bytes.buffer);
  return new File([bytes], name, { type: detected.type });
}
