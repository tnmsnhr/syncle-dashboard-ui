import type { SummaryFilters } from "../types";

interface FilterBarProps {
  filters: SummaryFilters;
  onChange: (patch: Partial<SummaryFilters>) => void;
  websites?: string[];
}

export function FilterBar({ filters, onChange, websites = [] }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="field">
        <label htmlFor="filter-status" className="field__label">
          Status
        </label>
        <select
          id="filter-status"
          value={filters.status ?? "all"}
          onChange={(e) =>
            onChange({
              status: e.target.value as SummaryFilters["status"],
              page: 1,
            })
          }
          className="select"
        >
          <option value="all">All</option>
          <option value="pinned">Pinned</option>
          <option value="unpinned">Unpinned</option>
        </select>
      </div>

      {websites.length > 0 && (
        <div className="field">
          <label htmlFor="filter-website" className="field__label">
            Website
          </label>
          <select
            id="filter-website"
            value={filters.website ?? ""}
            onChange={(e) =>
              onChange({ website: e.target.value || undefined, page: 1 })
            }
            className="select"
          >
            <option value="">All sites</option>
            {websites.map((site) => (
              <option key={site} value={site}>
                {site}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="field">
        <label htmlFor="filter-from" className="field__label">
          From
        </label>
        <input
          id="filter-from"
          type="date"
          value={filters.from ?? ""}
          onChange={(e) => onChange({ from: e.target.value || undefined, page: 1 })}
          className="input"
        />
      </div>

      <div className="field">
        <label htmlFor="filter-to" className="field__label">
          To
        </label>
        <input
          id="filter-to"
          type="date"
          value={filters.to ?? ""}
          onChange={(e) => onChange({ to: e.target.value || undefined, page: 1 })}
          className="input"
        />
      </div>
    </div>
  );
}
