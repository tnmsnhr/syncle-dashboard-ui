import { useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ErrorState } from "../components/ErrorState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useSummary, useTogglePin, useDeleteSummary } from "../hooks/useSummaries";
import { formatDate } from "../utils/format";
import { getApiErrorMessage } from "../api/client";

export function SummaryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: summary, isLoading, isError, error, refetch } = useSummary(id);
  const pinMutation = useTogglePin();
  const deleteMutation = useDeleteSummary();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary.summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!summary || !window.confirm("Delete this summary?")) return;
    await deleteMutation.mutateAsync(summary.id);
    navigate("/summaries");
  };

  if (isLoading) {
    return (
      <div className="page-stack--narrow">
        <LoadingSkeleton lines={8} />
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="page-stack page-stack--narrow">
        <BackLink />
        <ErrorState
          title="Summary not found"
          message={getApiErrorMessage(error)}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="page-stack page-stack--narrow">
      <BackLink />

      <header className="detail-header">
        <div>
          <h1 className="h1">{summary.title}</h1>
          <p className="text-muted" style={{ marginTop: "0.5rem" }}>
            {summary.website} · Created {formatDate(summary.createdAt)}
          </p>
        </div>
        {summary.pinned && <span className="badge badge--primary">Pinned</span>}
      </header>

      <div className="detail-actions">
        <button type="button" onClick={handleCopy} className="btn btn--secondary btn--sm">
          {copied ? "Copied!" : "Copy summary"}
        </button>
        <a
          href={summary.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--secondary btn--sm"
        >
          Open source
        </a>
        <button
          type="button"
          onClick={() => pinMutation.mutate(summary.id)}
          className="btn btn--secondary btn--sm"
        >
          {summary.pinned ? "Unpin" : "Pin"}
        </button>
        <button type="button" onClick={handleDelete} className="btn btn--danger btn--sm">
          Delete
        </button>
      </div>

      {summary.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {summary.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <Section title="AI summary">
        <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }} className="text-muted">
          {summary.summaryText}
        </p>
      </Section>

      <Section title="Original selection">
        <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }} className="text-muted">
          {summary.originalText}
        </p>
      </Section>

      <Section title="Follow-up Q&A">
        {summary.followUps.length === 0 ? (
          <p className="text-muted">No follow-up messages yet.</p>
        ) : (
          <ul className="page-stack" style={{ gap: "0.75rem" }}>
            {summary.followUps.map((msg) => (
              <li
                key={msg.id}
                className={msg.role === "user" ? "chat-bubble chat-bubble--user" : "chat-bubble chat-bubble--assistant"}
              >
                <p className="chat-bubble__role">{msg.role}</p>
                <p>{msg.content}</p>
                <p className="chat-bubble__time">{formatDate(msg.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function BackLink() {
  return (
    <Link to="/summaries" className="link">
      ← Back to summaries
    </Link>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card">
      <h2 className="h3" style={{ marginBottom: "0.75rem" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default SummaryDetailPage;
