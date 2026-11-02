import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteDelivery, getDelivery, updateDelivery } from '../api/deliveries';
import { getRecords } from '../api/records';
import ActionsBar from '../components/ActionsBar';
import ChecklistItemCard from '../components/ChecklistItemCard';
import Header from '../components/Header';
import SearchFilterBar, { type Filter } from '../components/SearchFilterBar';
import SectionTabs from '../components/SectionTabs';
import SignOffForm from '../components/SignOffForm';
import SiteDetailsForm from '../components/SiteDetailsForm';
import StatsBar from '../components/StatsBar';
import { useAutosave } from '../hooks/useAutosave';
import { useChecklist } from '../hooks/useChecklist';
import { useDeliveryStats } from '../hooks/useDeliveryStats';
import { ISSUE_STATUSES, type ChecklistSection, type Delivery, type DeliveryForm, type InspectionRecord } from '../types';

const toForm = (d: Delivery): DeliveryForm => ({
  customer: d.customer, location: d.location, model: d.model, colour: d.colour,
  height_mm: d.height_mm?.toString() ?? '', width_mm: d.width_mm?.toString() ?? '', depth_mm: d.depth_mm?.toString() ?? '',
  inspector: d.inspector, site_signoff: d.site_signoff, vertivo_signoff: d.vertivo_signoff,
  inspection_date: d.inspection_date ?? '', overall_status: d.overall_status ?? '',
});

const num = (s: string) => { const n = Number(s); return s === '' || !Number.isFinite(n) || n < 0 ? null : Math.trunc(n); };
const toPayload = (f: DeliveryForm) => ({
  customer: f.customer, location: f.location, model: f.model, colour: f.colour,
  height_mm: num(f.height_mm), width_mm: num(f.width_mm), depth_mm: num(f.depth_mm),
  inspector: f.inspector, site_signoff: f.site_signoff, vertivo_signoff: f.vertivo_signoff,
  inspection_date: f.inspection_date || null, overall_status: f.overall_status || null,
});

/** Loads everything first so the workspace can initialise its form state once. */
export default function DeliveryPage() {
  const { id = '' } = useParams();
  const { sections, error: checklistError } = useChecklist();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [records, setRecords] = useState<InspectionRecord[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getDelivery(id), getRecords(id)])
      .then(([d, r]) => { setDelivery(d); setRecords(r); })
      .catch(() => setError('This delivery could not be found.'));
  }, [id]);

  if (error || checklistError) return <><Header back /><main><div className="error" role="alert">{error || checklistError}</div></main></>;
  if (!delivery || !records || !sections) return <><Header back /><div className="loading">Loading…</div></>;
  return <Workspace delivery={delivery} initialRecords={records} sections={sections} />;
}

function Workspace({ delivery, initialRecords, sections }: { delivery: Delivery; initialRecords: InspectionRecord[]; sections: ChecklistSection[] }) {
  const nav = useNavigate();
  const [form, setForm] = useState<DeliveryForm>(() => toForm(delivery));
  const [records, setRecords] = useState<Record<number, InspectionRecord>>(() => Object.fromEntries(initialRecords.map((r) => [r.item_id, r])));
  const [active, setActive] = useState(sections[0].id);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const { stats, refresh } = useDeliveryStats(delivery.id);

  // Delivery autosave (site details + sign-off share one version)
  const version = useRef(delivery.version);
  const saveStatus = useAutosave(form, async (f) => {
    const updated = await updateDelivery(delivery.id, { ...toPayload(f), version: version.current });
    version.current = updated.version;
  });
  const patch = useCallback((p: Partial<DeliveryForm>) => setForm((f) => ({ ...f, ...p })), []);

  const onSaved = useCallback((r: InspectionRecord) => { setRecords((prev) => ({ ...prev, [r.item_id]: r })); refresh(); }, [refresh]);

  // The visible list is re-evaluated only when tab/search/filter change — not on every keystroke
  // inside a card — so a card never vanishes from under the user while they are editing it.
  const recordsRef = useRef(records);
  recordsRef.current = records;
  const section = sections.find((s) => s.id === active) ?? sections[0];
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return section.items.filter((x) => {
      if (q && !`${x.name} ${x.size} ${x.material}`.toLowerCase().includes(q)) return false;
      const st = recordsRef.current[x.id]?.inspection ?? null;
      return filter === 'all' || (filter === 'pending' && !st) || (filter === 'ok' && st === 'Accepted') || (filter === 'issue' && !!st && ISSUE_STATUSES.includes(st));
    });
  }, [section, query, filter]);

  const sectionStats = stats?.by_section.find((s) => s.section_id === section.id);

  return (
    <>
      <Header back />
      <main>
        {saveStatus === 'conflict' && <div className="notice">This delivery was changed on another device. Reload the page to continue.</div>}
        {saveStatus === 'error' && <div className="error">Site details could not be saved. Check your connection and edit again to retry.</div>}
        <SiteDetailsForm form={form} onChange={patch} />
        <StatsBar stats={stats} />
        <SectionTabs sections={sections} active={active} onSelect={setActive} stats={stats} />
        <section className="panel">
          <div className="itemtop">
            <h2>{section.name}</h2>
            <span className="sno">{sectionStats ? `${sectionStats.checked} / ${sectionStats.total}` : `– / ${section.items.length}`} inspected</span>
          </div>
          <SearchFilterBar query={query} filter={filter} onQuery={setQuery} onFilter={setFilter} />
          {items.length === 0 && <div className="empty">No matching items.</div>}
          {items.map((item) => (
            <ChecklistItemCard key={item.id} deliveryId={delivery.id} item={item} record={records[item.id]} onSaved={onSaved} />
          ))}
        </section>
        <SignOffForm form={form} onChange={patch} />
        <ActionsBar deliveryId={delivery.id} onDelete={async () => { await deleteDelivery(delivery.id); nav('/', { replace: true }); }} />
        <p className="footnote">Verify quantities and technical dimensions against the approved project documents before dispatch or installation. This tool records delivery QC only; it does not certify elevator safety or installation compliance.</p>
      </main>
    </>
  );
}
