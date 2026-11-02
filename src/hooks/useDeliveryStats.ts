import { useCallback, useEffect, useRef, useState } from 'react';
import { getStats } from '../api/deliveries';
import type { Stats } from '../types';

/** Server-computed stats; `refresh` is debounced so rapid edits cause one request. */
export function useDeliveryStats(deliveryId: string) {
  const [stats, setStats] = useState<Stats | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const load = useCallback(() => { getStats(deliveryId).then(setStats).catch(() => undefined); }, [deliveryId]);
  useEffect(() => { load(); return () => window.clearTimeout(timer.current); }, [load]);
  const refresh = useCallback(() => { window.clearTimeout(timer.current); timer.current = window.setTimeout(load, 400); }, [load]);

  return { stats, refresh };
}
