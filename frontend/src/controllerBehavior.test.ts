import { AssistantSkillLoader } from './assistantSkillLoader';
import { createSavedMethodExecutor } from './artifactExecutionController';
import { scheduleWorkspaceCheck } from './workspaceSyncController';
import type { MethodRecord, MethodVersion, SyncPayload, SyncStatus, WorkflowSkillPackage } from './types';

test('Assistant package cache shares requests and invalidates revisions', async () => {
  const loader = new AssistantSkillLoader(), fetch = vi.fn(async () => ({ skill: { sha256: 'a' } }) as WorkflowSkillPackage);
  await Promise.all([loader.load('source', 'skill', 'a', fetch), loader.load('source', 'skill', 'a', fetch)]);
  expect(fetch).toHaveBeenCalledTimes(1);
  await expect(loader.load('source', 'skill', 'b', fetch)).rejects.toThrow('revision');
  await expect(loader.load('source', 'skill', 'b', fetch)).rejects.toThrow('revision');
  expect(fetch).toHaveBeenCalledTimes(3);
});
test('saved Method controller renders only after execution completes', async () => {
  const events: string[] = [];
  const execute = vi.fn(async () => { events.push('execute'); return '{"ok":true}'; });
  const render = vi.fn(async () => { events.push('render'); return 'rendered'; });
  const runner = createSavedMethodExecutor(execute, render);
  const result = await runner({ name: 'method' } as MethodRecord, {} as MethodVersion, 'result=1', { kind: 'run', runId: 'run' });
  expect(events).toEqual(['execute', 'render']); expect(result.renderResult).toBe('rendered');
});
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
