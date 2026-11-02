import type { DeliveryForm } from '../types';

interface Props { form: DeliveryForm; onChange: (patch: Partial<DeliveryForm>) => void }

export default function SiteDetailsForm({ form, onChange }: Props) {
  return (
    <section className="panel">
      <h2>Delivery / Site Details</h2>
      <div className="fields">
        <div><label htmlFor="customer">Customer name</label>
          <input id="customer" maxLength={120} placeholder="Enter customer name" value={form.customer} onChange={(e) => onChange({ customer: e.target.value })} /></div>
        <div><label htmlFor="location">Site location</label>
          <input id="location" maxLength={300} placeholder="Project / site address" value={form.location} onChange={(e) => onChange({ location: e.target.value })} /></div>
        <div><label htmlFor="model">Lift model</label>
          <input id="model" maxLength={80} placeholder="Model" value={form.model} onChange={(e) => onChange({ model: e.target.value })} /></div>
        <div><label htmlFor="colour">Colour / finish</label>
          <input id="colour" maxLength={80} placeholder="Colour" value={form.colour} onChange={(e) => onChange({ colour: e.target.value })} /></div>
        <div><label htmlFor="height">Height with pit (mm)</label>
          <input id="height" type="number" min={0} max={100000} placeholder="e.g. 13530" value={form.height_mm} onChange={(e) => onChange({ height_mm: e.target.value })} /></div>
        <div><label htmlFor="width">Shaft width (mm)</label>
          <input id="width" type="number" min={0} max={100000} placeholder="e.g. 1325" value={form.width_mm} onChange={(e) => onChange({ width_mm: e.target.value })} /></div>
        <div><label htmlFor="depth">Shaft depth (mm)</label>
          <input id="depth" type="number" min={0} max={100000} placeholder="e.g. 1300" value={form.depth_mm} onChange={(e) => onChange({ depth_mm: e.target.value })} /></div>
        <div><label htmlFor="inspector">Inspector / in-charge</label>
          <input id="inspector" maxLength={120} placeholder="Name" value={form.inspector} onChange={(e) => onChange({ inspector: e.target.value })} /></div>
      </div>
      <div className="footnote mt10">Changes are saved automatically to the secure server, so this checklist can be opened from any signed-in device.</div>
    </section>
  );
}
