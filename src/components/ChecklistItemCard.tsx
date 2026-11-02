import { useMemo, useRef, useState } from 'react';
import { saveRecord } from '../api/records';
import { useAutosave, type SaveStatus } from '../hooks/useAutosave';
import { INSPECTION_STATUSES, type ChecklistItem, type InspectionRecord } from '../types';
import PhotoUploader from './PhotoUploader';

interface Props {
  deliveryId: string;
  item: ChecklistItem;
  record: InspectionRecord | undefined;
  onSaved: (r: InspectionRecord) => void;
}

const MESSAGES: Record<SaveStatus, string> = {
  idle: '', saving: 'Saving…', saved: 'Saved', error: 'Not saved — check your connection and edit again to retry.',
  conflict: 'Changed on another device. Reload this page to continue.',
};

export default function ChecklistItemCard({ deliveryId, item, record, onSaved }: Props) {
  const [qty, setQty] = useState(record?.qty_sent?.toString() ?? '');
  const [actual, setActual] = useState(record?.actual_condition ?? '');
  const [inspection, setInspection] = useState<string>(record?.inspection ?? '');
  const [remarks, setRemarks] = useState(record?.remarks ?? '');
  const versionRef = useRef<number | undefined>(record?.version);

  const value = useMemo(() => ({ qty, actual, inspection, remarks }), [qty, actual, inspection, remarks]);
  const status = useAutosave(value, async (v) => {
    const n = Number(v.qty);
    const saved = await saveRecord(deliveryId, item.id, {
      qty_sent: v.qty === '' || !Number.isFinite(n) || n < 0 ? null : Math.trunc(n),
      actual_condition: v.actual,
      inspection: v.inspection === '' ? null : v.inspection,
      remarks: v.remarks,
      ...(versionRef.current ? { version: versionRef.current } : {}),
    });
    versionRef.current = saved.version;
    onSaved(saved);
  });

  const sub = [
    item.size ? `Size: ${item.size}` : '',
    item.material ? ` · Material: ${item.material}` : '',
    item.required_qty !== null ? ` · Required: ${item.required_qty}` : ' · Required qty not specified in source',
  ].join('');

  return (
    <article className="item">
      <div className="itemtop">
        <div className="itemname">{item.name}</div>
        <span className="sno">S.No {item.sno || '—'}</span>
      </div>
      <div className="sub">{sub}</div>
      <div className="itemfields">
        <div><label>Qty sent to site</label>
          <input type="number" min={0} max={1000000} value={qty} placeholder="Qty" onChange={(e) => setQty(e.target.value)} /></div>
        <div><label>Actual size / condition</label>
          <input value={actual} maxLength={200} placeholder="Measured size" onChange={(e) => setActual(e.target.value)} /></div>
        <div><label>Visual inspection</label>
          <select value={inspection} onChange={(e) => setInspection(e.target.value)}>
            <option value="">Not inspected</option>
            {INSPECTION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select></div>
        <div className="remarks"><label>Remarks</label>
          <input value={remarks} maxLength={500} placeholder="Notes / discrepancy" onChange={(e) => setRemarks(e.target.value)} /></div>
        <PhotoUploader deliveryId={deliveryId} itemId={item.id} photoUrl={record?.photo_url ?? null} onChange={onSaved} />
      </div>
      <div className={`savestate no-print${status === 'error' || status === 'conflict' ? ' bad' : ''}`} aria-live="polite">{MESSAGES[status]}</div>
    </article>
  );
}
