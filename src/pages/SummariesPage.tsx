import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { FilterBar } from "../components/FilterBar";
import { TableSkeleton } from "../components/LoadingSkeleton";
import { SearchInput } from "../components/SearchInput";
import { SummaryCard } from "../components/SummaryCard";
import { SummaryTable } from "../components/SummaryTable";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useSummaries, useTogglePin, useDeleteSummary } from "../hooks/useSummaries";
import type { SummaryFilters } from "../types";
import { getApiErrorMessage } from "../api/client";
import clsx from "clsx";

type ViewMode = "table" | "cards";

export function SummariesPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<SummaryFilters>({ page: 1, limit: 20 });
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const debouncedSearch = useDebouncedValue(search, 300);

  const queryFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch || undefined }),
    [filters, debouncedSearch]
  );

  const { data, isLoading, isError, error, refetch } = useSummaries(queryFilters);
  const pinMutation = useTogglePin();
  const deleteMutation = useDeleteSummary();

  const websites = useMemo(() => {
    const set = new Set(data?.items.map((s) => s.website) ?? []);
    return Array.from(set).sort();
  }, [data?.items]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this summary? This cannot be undone.")) return;
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <header className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="h1">Summaries</h1>
          <p className="page-header__desc">
            Search and manage your extracted summaries.
          </p>
        </header>
        <div className="btn-group">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={clsx(
              "btn-group__item",
              viewMode === "table" && "btn-group__item--active"
            )}
          >
            Table
          </button>
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={clsx(
              "btn-group__item",
              viewMode === "cards" && "btn-group__item--active"
            )}
          >
            Cards
          </button>
        </div>
      </div>

      <div className="filters-panel">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search title, summary, or URL…"
        />
        <FilterBar
          filters={filters}
          onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
          websites={websites}
        />
      </div>

      {isLoading && <TableSkeleton />}

      {isError && (
        <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
      )}

      {!isLoading && !isError && data?.items.length === 0 && (
        <EmptyState
          title="No summaries found"
          description="Try adjusting your search or filters, or create summaries from the extension."
          action={
            <Link to="/" className="link">
              Back to overview
            </Link>
          }
        />
      )}

      {!isLoading && !isError && data && data.items.length > 0 && (
        <>
          {viewMode === "table" ? (
            <SummaryTable
              items={data.items}
              onPin={(id) => pinMutation.mutate(id)}
              onDelete={handleDelete}
            />
          ) : (
            <div className="summary-grid">
              {data.items.map((summary) => (
                <SummaryCard
                  key={summary.id}
                  summary={summary}
                  onPin={(id) => pinMutation.mutate(id)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {data.pagination.totalPages > 1 && (
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              total={data.pagination.total}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          )}
        </>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="pagination">
      <p className="pagination__info">
        Page {page} of {totalPages} · {total} total
      </p>
      <div className="pagination__actions">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="btn btn--secondary btn--sm"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="btn btn--secondary btn--sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default SummariesPage;
