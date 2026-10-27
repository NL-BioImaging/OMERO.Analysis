import { renderZarrMovie } from './zarrMovie';
import type { ZarrRenderRecipe, ZarrViewerCapability } from './types';

const capability = {features:['zarr-movie-v1'], store:{movie_url:'/viewer?image=1'}} as ZarrViewerCapability;
const recipe = {storeUuid:'00000000-0000-4000-8000-000000000001',sequence:{version:1,start:0,end:1,fps:5},panels:[]} as ZarrRenderRecipe;
afterEach(() => { document.querySelectorAll('iframe').forEach(frame=>frame.remove()); vi.useRealTimers(); });

it('starts a loadable frame and accepts only its authenticated ready message', async () => {
  vi.useFakeTimers();
  const controller = new AbortController();
  const result = renderZarrMovie(capability,recipe,controller.signal);
  const rejected = expect(result).rejects.toThrow('Movie export stopped');
  const frame = document.querySelector('iframe')!;
  const posted = vi.spyOn(frame.contentWindow!, 'postMessage');
  const nonce = new URL(frame.src).searchParams.get('nonce');
  expect(frame.hidden).toBe(false); expect(frame.loading).toBe('eager');
  expect(frame.getAttribute('aria-hidden')).toBe('true');
  const data = {source:'zarr-movie',nonce,type:'ready'};
  window.dispatchEvent(new MessageEvent('message',{source:window,origin:location.origin,data}));
  window.dispatchEvent(new MessageEvent('message',{source:frame.contentWindow,origin:'https://wrong.example',data}));
  window.dispatchEvent(new MessageEvent('message',{source:frame.contentWindow,origin:location.origin,data:{...data,nonce:'wrong'}}));
  expect(posted).not.toHaveBeenCalled();
  window.dispatchEvent(new MessageEvent('message',{source:frame.contentWindow,origin:location.origin,data}));
  expect(posted).toHaveBeenCalledWith({source:'analysis-movie',nonce,type:'render',recipe},location.origin);
  await vi.advanceTimersByTimeAsync(5000);
  expect(new URL(frame.src).searchParams.has('startup_retry')).toBe(false);
  controller.abort(); await rejected;
  expect(document.querySelector('iframe')).toBeNull();
});

it('retries a stalled document once, then cleans up on timeout', async () => {
  vi.useFakeTimers();
  const result = renderZarrMovie(capability,recipe,new AbortController().signal);
  const failed = expect(result).rejects.toThrow('movie page did not load');
  const frame = document.querySelector('iframe')!;
  await vi.advanceTimersByTimeAsync(5000);
  expect(new URL(frame.src).searchParams.has('startup_retry')).toBe(true);
  await vi.advanceTimersByTimeAsync(10000); await failed;
  expect(document.querySelector('iframe')).toBeNull();
});



it('validates a separate renderer window and closes only that window on success', async () => {
  const popup = {postMessage:vi.fn(),close:vi.fn(),closed:false};
  const open = vi.spyOn(window,'open').mockReturnValue(popup as unknown as Window);
  const result = renderZarrMovie(capability,recipe,new AbortController().signal,()=>{},'window');
  const nonce = new URL(open.mock.calls[0][0] as string).searchParams.get('nonce');
  const ready = {source:'zarr-movie',nonce,type:'ready'};
  window.dispatchEvent(new MessageEvent('message',{source:window,origin:location.origin,data:ready}));
  expect(popup.postMessage).not.toHaveBeenCalled();
  window.dispatchEvent(new MessageEvent('message',{source:popup as unknown as Window,origin:location.origin,data:ready}));
  expect(popup.postMessage).toHaveBeenCalledWith({source:'analysis-movie',nonce,type:'render',recipe},location.origin);
  const value={data:new ArrayBuffer(4),poster:new ArrayBuffer(2),provenance:{fps:5,frameCount:2,recipe}};
  window.dispatchEvent(new MessageEvent('message',{source:popup as unknown as Window,origin:location.origin,data:{source:'zarr-movie',nonce,type:'complete',value}}));
  await expect(result).resolves.toEqual(value);
  expect(popup.close).toHaveBeenCalledTimes(1); open.mockRestore();
});
