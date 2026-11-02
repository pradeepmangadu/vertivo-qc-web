import type { Stats } from '../types';

export default function StatsBar({ stats }: { stats: Stats | null }) {
  return (
    <section className="panel">
      <div className="stats">
        <div className="stat"><strong>{stats?.total ?? '–'}</strong><span>Total checklist items</span></div>
        <div className="stat"><strong>{stats?.checked ?? '–'}</strong><span>Inspected</span></div>
        <div className="stat"><strong>{stats?.issues ?? '–'}</strong><span>Needs attention</span></div>
      </div>
    </section>
  );
}
