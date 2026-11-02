import { useRef, useState } from 'react';
import { deletePhoto, uploadPhoto } from '../api/records';
import type { InspectionRecord } from '../types';

const MAX_INPUT_BYTES = 25 * 1024 * 1024;

async function resize(file: File, max = 1200): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bmp.width * scale));
  canvas.height = Math.max(1, Math.round(bmp.height * scale));
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('encode'))), 'image/jpeg', 0.72));
}

interface Props { deliveryId: string; itemId: number; photoUrl: string | null; onChange: (r: InspectionRecord) => void }

export default function PhotoUploader({ deliveryId, itemId, photoUrl, onChange }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function pick(file: File | undefined) {
    if (!file) return;
    setError('');
    if (!file.type.startsWith('image/')) return setError('Please choose an image file.');
    if (file.size > MAX_INPUT_BYTES) return setError('This image is too large (max 25 MB).');
    setBusy(true);
    try { onChange(await uploadPhoto(deliveryId, itemId, await resize(file))); }
    catch { setError('Could not upload this photo. Try another image.'); }
    finally { setBusy(false); if (input.current) input.current.value = ''; }
  }

  async function remove() {
    setBusy(true); setError('');
    try { onChange(await deletePhoto(deliveryId, itemId)); }
    catch { setError('Could not remove the photo.'); }
    finally { setBusy(false); }
  }

  return (
    <div className="full">
      <label>Picture reference (optional)</label>
      <div className="photoarea">
        <div>
          <input ref={input} type="file" accept="image/*" capture="environment" disabled={busy} onChange={(e) => pick(e.target.files?.[0])} />
          <div className="photo-label">{busy ? 'Working…' : 'Take a site photo or choose an image'}</div>
        </div>
        <div className="photo-tools">
          {photoUrl ? (
            <>
              <img className="photo-preview" src={photoUrl} alt="Inspection picture reference" referrerPolicy="no-referrer" />
              <button type="button" className="secondary" disabled={busy} onClick={remove}>Remove photo</button>
            </>
          ) : <span className="photo-label">No picture attached</span>}
        </div>
      </div>
      {error && <div className="error mt10" role="alert">{error}</div>}
    </div>
  );
}
