export type Filter = 'all' | 'pending' | 'ok' | 'issue';
interface Props { query: string; filter: Filter; onQuery: (q: string) => void; onFilter: (f: Filter) => void }

export default function SearchFilterBar({ query, filter, onQuery, onFilter }: Props) {
  return (
    <div className="searchrow no-print">
      <input placeholder="Search materials…" aria-label="Search materials" maxLength={100} value={query} onChange={(e) => onQuery(e.target.value)} />
      <select className="filter-select" aria-label="Filter items" value={filter} onChange={(e) => onFilter(e.target.value as Filter)}>
        <option value="all">All items</option>
        <option value="pending">Not inspected</option>
        <option value="ok">Accepted</option>
        <option value="issue">Issues</option>
      </select>
    </div>
  );
}
