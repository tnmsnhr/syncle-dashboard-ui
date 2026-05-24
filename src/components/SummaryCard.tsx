import { Link } from "react-router-dom";
import type { Summary } from "../types";
import { formatDate, truncate } from "../utils/format";
import clsx from "clsx";

interface SummaryCardProps {
  summary: Summary;
  onPin?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function SummaryCard({ summary, onPin, onDelete }: SummaryCardProps) {
  return (
    <article className="summary-card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
        <Link to={`/summaries/${summary.id}`} className="summary-card__title">
          {summary.title}
        </Link>
        {summary.pinned && <span className="badge badge--primary">Pinned</span>}
      </div>

      <p className="summary-card__body">{truncate(summary.summaryText, 160)}</p>

      <div className="summary-card__meta">
        <span>{summary.website}</span>
        <span aria-hidden>·</span>
        <span>{formatDate(summary.createdAt)}</span>
      </div>

      {summary.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.75rem" }}>
          {summary.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="summary-card__footer">
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
        <Link
          to={`/summaries/${summary.id}`}
          className="btn btn--sm btn--ghost"
          style={{ marginLeft: "auto" }}
        >
          View
        </Link>
      </div>
    </article>
  );
}
