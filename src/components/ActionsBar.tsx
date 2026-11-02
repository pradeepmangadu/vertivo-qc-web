import { useState } from 'react';
import { downloadBackup, exportCsv } from '../api/deliveries';
import { useAuth } from '../auth/AuthProvider';

interface Props { deliveryId: string; onDelete: () => Promise<void> }

export default function ActionsBar({ deliveryId, onDelete }: Props) {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<void>) {
    setBusy(true); setError('');
    try { await fn(); } catch { setError('That action failed. Please try again.'); } finally { setBusy(false); }
  }

  return (
    <>
      {error && <div className="error no-print" role="alert">{error}</div>}
      <div className="actions no-print mb24">
        <button className="primary" disabled={busy} onClick={() => run(() => exportCsv(deliveryId))}>Export checklist CSV</button>
        <button className="secondary" onClick={() => window.print()}>Print / Save PDF</button>
        <button className="secondary" disabled={busy} onClick={() => run(() => downloadBackup(deliveryId))}>Download backup</button>
        {user?.role === 'admin' && (
          <button className="danger" disabled={busy}
            onClick={() => { if (window.confirm('Delete this delivery? It will be removed from the list.')) void run(onDelete); }}>
            Delete delivery
          </button>
        )}
      </div>
    </>
  );
}
