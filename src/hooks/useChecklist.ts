import { useEffect, useState } from 'react';
import { getChecklist } from '../api/records';
import type { ChecklistSection } from '../types';

let cached: Promise<ChecklistSection[]> | null = null;

export function useChecklist() {
  const [sections, setSections] = useState<ChecklistSection[] | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    cached ??= getChecklist();
    cached.then(setSections).catch(() => { cached = null; setError('Could not load the checklist.'); });
  }, []);
  return { sections, error };
}
