import type { ZarrRenderRecipe, ZarrViewerCapability } from './types';

export function renderZarrMovie(capability: ZarrViewerCapability, recipe: ZarrRenderRecipe, signal: AbortSignal,
  progress: (completed: number, total: number) => void = () => {}): Promise<{ data: ArrayBuffer; poster: ArrayBuffer; provenance: { fps: number; frameCount: number; recipe: ZarrRenderRecipe } }> {
  if (!capability.features?.includes('zarr-movie-v1') || !capability.store.movie_url) throw new Error('This ZarrViewer does not support browser movie export.');
  const url = new URL(capability.store.movie_url, location.href);
  if (url.origin !== location.origin) throw new Error('Movie rendering requires the authenticated local ZarrViewer.');
  signal.throwIfAborted();
  const nonce = crypto.randomUUID(); url.searchParams.set('movie', '1'); url.searchParams.set('nonce', nonce);
  const iframe = document.createElement('iframe'); iframe.hidden = true; iframe.src = url.href;
  return new Promise((resolve, reject) => {
    let timer: number;
    const cleanup = () => { clearTimeout(timer); window.removeEventListener('message', receive); signal.removeEventListener('abort', abort); iframe.remove(); };
    const fail = (reason: Error) => { cleanup(); reject(reason); };
    const abort = () => {
      iframe.contentWindow?.postMessage({ source: 'analysis-movie', nonce, type: 'cancel' }, location.origin);
      fail(new DOMException('Movie export stopped.', 'AbortError'));
    };
    const refreshTimer = () => { clearTimeout(timer); timer = window.setTimeout(() => fail(new Error('ZarrViewer movie rendering stopped responding.')), 120000); };
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== iframe.contentWindow || event.data?.source !== 'zarr-movie' || event.data.nonce !== nonce) return;
      refreshTimer();
      if (event.data.type === 'ready') iframe.contentWindow?.postMessage({ source: 'analysis-movie', nonce, type: 'render', recipe }, location.origin);
      else if (event.data.type === 'progress') progress(event.data.value.completed, event.data.value.total);
      else if (event.data.type === 'error') fail(new Error(String(event.data.value)));
      else if (event.data.type === 'complete') {
        const result = event.data.value;
        const expectedFps = recipe.sequence?.fps ?? 5;
        const expectedFrames = recipe.sequence ? Math.floor((recipe.sequence.end - recipe.sequence.start) / (recipe.sequence.step ?? 1)) + 1 : 0;
        if (!(result?.data instanceof ArrayBuffer) || !(result?.poster instanceof ArrayBuffer) || result.data.byteLength > (recipe.sequence?.maxBytes || 256 * 1024 * 1024) ||
            result.provenance?.fps !== expectedFps || result.provenance?.frameCount !== expectedFrames || result.data.byteLength === 0) { fail(new Error('ZarrViewer returned an invalid movie.')); return; }
        cleanup(); resolve(result);
      }
    };
    window.addEventListener('message', receive); signal.addEventListener('abort', abort, { once: true });
    iframe.onerror = () => fail(new Error('Unable to open ZarrViewer for movie export.'));
    refreshTimer(); document.body.appendChild(iframe);
  });
}

export function movieRenderRequest(value: unknown, depth = 0): Record<string, unknown> | null {
  if (depth > 8) return null;
  if (typeof value === 'string') { try { return movieRenderRequest(JSON.parse(value), depth + 1); } catch { return null; } }
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (record.omero_analysis_render_format === 'mp4' && record.omero_analysis_render_recipe) return record;
  for (const child of Object.values(record)) { const found = movieRenderRequest(child, depth + 1); if (found) return found; }
  return null;
}
