import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createDelivery, listDeliveries } from '../api/deliveries';
import Header from '../components/Header';
import type { Delivery } from '../types';

export default function DeliveryListPage() {
  const nav = useNavigate();
  const [rows, setRows] = useState<Delivery[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { listDeliveries().then(setRows).catch(() => setError('Could not load deliveries.')); }, []);

  async function create() {
    setBusy(true); setError('');
    try { nav(`/deliveries/${(await createDelivery()).id}`); }
    catch { setError('Could not start a new delivery. Please try again.'); setBusy(false); }
  }

  return (
    <>
      <Header />
      <main>
        <section className="panel">
          <div className="itemtop">
            <h2>Deliveries</h2>
            <button className="primary" disabled={busy} onClick={create}>New delivery</button>
          </div>
          {error && <div className="error" role="alert">{error}</div>}
          {rows === null && !error && <div className="loading">Loading…</div>}
          {rows?.length === 0 && <div className="empty">No deliveries yet. Start a new delivery to begin an inspection.</div>}
          <div className="list">
            {rows?.map((d) => (
              <Link key={d.id} className="delivery-row" to={`/deliveries/${d.id}`}>
                <div>
                  <strong>{d.customer || 'Untitled delivery'}</strong>
                  <span>{[d.location, d.model].filter(Boolean).join(' · ') || 'No site details yet'}</span>
                </div>
                <span className="sno">{d.overall_status ?? 'Pending inspection'}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
