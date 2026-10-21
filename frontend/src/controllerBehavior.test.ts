import { scheduleWorkspaceCheck } from "./workspaceSyncController";
import type { SyncPayload, SyncStatus } from "./types";
test('workspace controller retries contention and cancels stale callbacks', async () => {
  vi.useFakeTimers();
  try {
    const prepare = vi.fn().mockRejectedValueOnce({ code: 'sync_busy' }).mockResolvedValue({} as SyncPayload);
    const receive = vi.fn(async () => {}), busy = vi.fn();
    const cancel = scheduleWorkspaceCheck({ delay: 0, prepare, status: async () => ({} as SyncStatus), receive, onBusy: busy, onError: vi.fn() });
    await vi.advanceTimersByTimeAsync(0); expect(busy).toHaveBeenCalledOnce();
    cancel(); await vi.advanceTimersByTimeAsync(5000); expect(receive).not.toHaveBeenCalled();
  } finally { vi.useRealTimers(); }
});
