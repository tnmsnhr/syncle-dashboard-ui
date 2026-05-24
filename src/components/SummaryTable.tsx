import { Link } from "react-router-dom";
import type { Summary } from "../types";
import { formatDate, truncate } from "../utils/format";
import clsx from "clsx";

interface SummaryTableProps {
  items: Summary[];
  onPin?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function SummaryTable({ items, onPin, onDelete }: SummaryTableProps) {
  if (items.length === 0) return null;

  return (
    <div className="data-table-wrap">
      <div className="data-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th className="col-hide-sm">Website</th>
              <th className="col-hide-md">Summary</th>
              <th>Created</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((summary) => (
              <tr key={summary.id}>
                <td>
                  <Link to={`/summaries/${summary.id}`} className="data-table__link">
                    {summary.title}
                  </Link>
                  {summary.pinned && (
                    <span className="badge badge--primary" style={{ marginLeft: "0.5rem" }}>
                      Pinned
                    </span>
                  )}
                </td>
                <td className="col-hide-sm text-muted">{summary.website}</td>
                <td className="col-hide-md text-muted">
                  {truncate(summary.summaryText, 80)}
                </td>
                <td className="text-small text-muted">{formatDate(summary.createdAt)}</td>
                <td>
                  <div className="data-table__actions">
                    {onPin && (
                      <button
                        type="button"
                        onClick={() => onPin(summary.id)}
                        className={clsx(
                          "btn btn--sm",
                          summary.pinned ? "btn--ghost" : "btn--secondary"
                        )}
                      >
                        {summary.pinned ? "Unpin" : "Pin"}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(summary.id)}
                        className="btn btn--sm btn--danger"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
