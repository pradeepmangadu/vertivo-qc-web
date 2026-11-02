import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../api/client';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'conflict';

/**
 * Debounced autosave. Saves are serialised (each waits for the previous one) so version
 * numbers returned by the server are always used for the next request. Pending edits are
 * flushed when the component unmounts. `value` must be a new object reference when it changes.
 */
export function useAutosave<T>(value: T, save: (v: T) => Promise<void>, delay = 700): SaveStatus {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const lastSeen = useRef(value);
  const latest = useRef(value);
  const saveRef = useRef(save);
  const timer = useRef<number | undefined>(undefined);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const dirty = useRef(false);
  saveRef.current = save;
  latest.current = value;

  const run = useCallback(() => {
    if (!dirty.current) return;
    dirty.current = false;
    const v = latest.current;
    setStatus('saving');
    queue.current = queue.current.then(async () => {
      try { await saveRef.current(v); setStatus(dirty.current ? 'saving' : 'saved'); }
      catch (e) { setStatus(e instanceof ApiError && e.status === 409 ? 'conflict' : 'error'); }
    });
  }, []);

  useEffect(() => {
    if (Object.is(value, lastSeen.current)) return;
    lastSeen.current = value;
    dirty.current = true;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(run, delay);
  }, [value, delay, run]);

  useEffect(() => () => { window.clearTimeout(timer.current); run(); }, [run]);

  return status;
}
