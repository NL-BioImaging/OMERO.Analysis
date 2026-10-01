import type { SyncPayload, SyncStatus } from './types';

/** Cancel stale callbacks and retry contention without weakening the server's locks. */
export function scheduleWorkspaceCheck(options: {
  delay: number; prepare: () => Promise<SyncPayload>; status: () => Promise<SyncStatus>;
  receive: (payload: SyncPayload, remote: SyncStatus, active: () => boolean) => Promise<void>;
  onBusy: () => void; onError: (error: unknown) => void;
}): () => void {
  let cancelled = false, timer: ReturnType<typeof setTimeout>, attempts = 0;
  const active = () => !cancelled;
  const check = async () => {
    try {
      const [payload, remote] = await Promise.all([options.prepare(), options.status()]);
      if (active()) await options.receive(payload, remote, active);
    } catch (error) {
      if (!active()) return;
      if (error && typeof error === 'object' && 'code' in error && error.code === 'sync_busy') {
        options.onBusy(); timer = setTimeout(check, Math.min(30000, 2500 * ++attempts));
      } else options.onError(error);
    }
  };
  timer = setTimeout(check, options.delay);
  return () => { cancelled = true; clearTimeout(timer); };
}
