import { useEffect, useState } from "react";
import type { OmeroBridge, QuerySaveReceipt } from "../api";

type Entry = QuerySaveReceipt & { saving?: boolean; saved?: number; error?: string };

/** Receipts live only here, never in workspace storage, Methods or notebook metadata. */
export function QueryResultSaves({ bridge, enabled, contextKey, canAnnotate, ttlSeconds }: {
  bridge: OmeroBridge;
  enabled: boolean;
  contextKey: string;
  canAnnotate: boolean;
  ttlSeconds: number;
}) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    setEntries([]);
    if (!enabled) return;
    return bridge.subscribeQueryResults((entry) => setEntries((current) => [entry, ...current].slice(0, 8)));
  }, [bridge, enabled, contextKey]);
  useEffect(() => {
    if (!entries.length) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [entries.length]);
  if (!enabled || !entries.length) return null;

  function update(token: string, change: Partial<Entry>) {
    setEntries((current) => current.map((entry) => entry.resultToken === token ? { ...entry, ...change } : entry));
  }
  async function save(entry: Entry) {
    update(entry.resultToken, { saving: true, error: undefined });
    try {
      const result = await bridge.promoteRemoteResult(entry);
      update(entry.resultToken, { saved: Number(result.result.annotation_id) });
    } catch (error) {
      update(entry.resultToken, { error: error instanceof Error ? error.message : String(error) });
    } finally {
      update(entry.resultToken, { saving: false });
    }
  }
  return <details className="query-result-saves" open>
    <summary>Recent query results</summary>
    {entries.map((entry) => {
      const expired = now >= entry.completedAt + ttlSeconds * 1000;
      return <div key={entry.resultToken}>
        <small>Source attachment {entry.annotationId} · {entry.rowCount.toLocaleString()} rows</small>
        {entry.saved ? <span role="status">Saved CSV and provenance · attachment {entry.saved}</span> : <>
          <button disabled={!canAnnotate || expired || entry.saving} onClick={() => void save(entry)}>
            {entry.saving ? "Saving…" : "Save query result to OMERO"}
          </button>
          {expired && <small>Result access expired. Rerun the query to save it.</small>}
          {!canAnnotate && <small>You cannot attach results to this OMERO object.</small>}
        </>}
        {entry.error && <small role="alert">{entry.error}</small>}
      </div>;
    })}
  </details>;
}
