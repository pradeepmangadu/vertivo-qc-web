import { OVERALL_STATUSES, type DeliveryForm } from '../types';

interface Props { form: DeliveryForm; onChange: (patch: Partial<DeliveryForm>) => void }

export default function SignOffForm({ form, onChange }: Props) {
  return (
    <section className="panel">
      <h2>Sign-off</h2>
      <div className="fields">
        <div><label htmlFor="siteSign">Site in-charge name</label>
          <input id="siteSign" maxLength={120} placeholder="Name" value={form.site_signoff} onChange={(e) => onChange({ site_signoff: e.target.value })} /></div>
        <div><label htmlFor="vertivoSign">Vertivo in-charge name</label>
          <input id="vertivoSign" maxLength={120} placeholder="Name" value={form.vertivo_signoff} onChange={(e) => onChange({ vertivo_signoff: e.target.value })} /></div>
        <div><label htmlFor="date">Inspection date</label>
          <input id="date" type="date" value={form.inspection_date} onChange={(e) => onChange({ inspection_date: e.target.value })} /></div>
        <div><label htmlFor="overall">Overall delivery status</label>
          <select id="overall" value={form.overall_status} onChange={(e) => onChange({ overall_status: e.target.value })}>
            <option value="">Select status</option>
            {OVERALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select></div>
      </div>
    </section>
  );
}
