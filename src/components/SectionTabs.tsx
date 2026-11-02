import type { ChecklistSection, Stats } from '../types';

interface Props { sections: ChecklistSection[]; active: number; onSelect: (id: number) => void; stats: Stats | null }

export default function SectionTabs({ sections, active, onSelect }: Props) {
  return (
    <nav className="nav" aria-label="Checklist sections">
      {sections.map((s) => (
        <button key={s.id} type="button" className={`tab${s.id === active ? ' active' : ''}`} aria-pressed={s.id === active} onClick={() => onSelect(s.id)}>
          {s.name}
        </button>
      ))}
    </nav>
  );
}
