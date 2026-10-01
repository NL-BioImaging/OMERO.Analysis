import type { WorkspaceFile } from './types';

export const RESULT_MIME_TYPES: Record<string, string> = {
  png: 'image/png', svg: 'image/svg+xml', mp4: 'video/mp4', csv: 'text/csv', tsv: 'text/tab-separated-values',
  json: 'application/json', pdf: 'application/pdf', txt: 'text/plain', md: 'text/markdown',
  parquet: 'application/vnd.apache.parquet', npy: 'application/octet-stream', npz: 'application/octet-stream'
};
export function resultMime(name: string): string {
  return RESULT_MIME_TYPES[name.split('.').at(-1)?.toLowerCase() || ''] || 'application/octet-stream';
}
export function previewable(file: Pick<WorkspaceFile, 'type'>): boolean {
  return ['image/png', 'image/svg+xml', 'video/mp4'].includes(file.type);
}
export function localResultBlob(file: WorkspaceFile): Blob | undefined {
  return file.mediaBlob || (file.data ? new Blob([file.data], { type: file.type }) : undefined);
}
export async function resultBytes(file: WorkspaceFile): Promise<ArrayBuffer | undefined> {
  return file.data || (file.mediaBlob ? file.mediaBlob.arrayBuffer() : undefined);
}
