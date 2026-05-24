import { Link } from "react-router-dom";
import { DashboardRightPanel } from "../components/DashboardRightPanel";
import { CardSkeleton } from "../components/LoadingSkeleton";
import { ErrorState } from "../components/ErrorState";
import { StatCard } from "../components/StatCard";
import { IconArrowRight } from "../components/NavIcons";
import { useDashboardStats } from "../hooks/useDashboard";
import { formatDate, formatRelative } from "../utils/format";
import { getApiErrorMessage } from "../api/client";

export function OverviewPage() {
  const { data, isLoading, isError, error, refetch } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="dashboard__content-inner">
        <div className="dashboard__primary page-stack">
          <div className="skeleton skeleton--card" style={{ minHeight: 160 }} />
          <div className="skeleton-grid">
            <CardSkeleton count={4} />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="page-stack">
        <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="dashboard__content-inner">
      <div className="dashboard__primary page-stack">
        <section className="hero-banner" aria-labelledby="hero-title">
          <svg className="hero-banner__decor" viewBox="0 0 100 100" aria-hidden>
            <path fill="currentColor" d="M50 5l8 24h26l-21 15 8 24-21-15-21 15 8-24-21-15h26z" />
          </svg>
          <p className="hero-banner__eyebrow">Syncle Dashboard</p>
          <h1 id="hero-title" className="hero-banner__title">
            Capture and revisit what matters across the web
          </h1>
          <div className="hero-banner__actions">
            <Link to="/summaries" className="btn btn--primary">
              View summaries
              <IconArrowRight />
            </Link>
          </div>
        </section>

        <div className="stat-chips-row">
          <div className="stat-chip">
            <div className="stat-chip__icon stat-chip__icon--purple" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              </svg>
            </div>
            <div>
              <p className="stat-chip__label">Total summaries</p>
              <p className="stat-chip__meta">{data.totalSummaries} saved</p>
            </div>
          </div>
          <div className="stat-chip">
            <div className="stat-chip__icon stat-chip__icon--pink" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 17l-5 3 1.9-5.7L4 9h5.9L12 3l2.1 6H20l-4.9 5.3L17 20z" />
              </svg>
            </div>
            <div>
              <p className="stat-chip__label">Pinned</p>
              <p className="stat-chip__meta">{data.pinnedCount} highlighted</p>
            </div>
          </div>
          <div className="stat-chip">
            <div className="stat-chip__icon stat-chip__icon--blue" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </div>
            <div>
              <p className="stat-chip__label">Sites this week</p>
              <p className="stat-chip__meta">{data.websitesThisWeek} domains</p>
            </div>
          </div>
        </div>

        <div className="stat-grid">
          <StatCard label="Total summaries" value={data.totalSummaries} />
          <StatCard label="Pinned" value={data.pinnedCount} />
          <StatCard label="Websites this week" value={data.websitesThisWeek} />
          <StatCard
            label="Usage this month"
            value={
              data.summariesThisMonth != null
                ? `${data.summariesThisMonth}${data.usagePercent != null ? ` (${data.usagePercent}%)` : ""}`
                : "—"
            }
          />
        </div>

        <section className="card">
          <div className="section-header">
            <h2 className="h2">Recent activity</h2>
            <Link to="/summaries" className="link">
              View all
            </Link>
          </div>

          {data.recentActivity.length === 0 ? (
            <p className="text-muted">No recent activity yet.</p>
          ) : (
            <ul className="activity-list">
              {data.recentActivity.map((item) => (
                <li key={item.id} className="activity-list__item">
                  <div>
                    <p className="activity-list__title">{item.title}</p>
                    <p className="activity-list__action">{item.action}</p>
                  </div>
                  <time className="activity-list__time">{formatRelative(item.at)}</time>
                </li>
              ))}
            </ul>
          )}
        </section>

        {data.recentActivity.length > 0 && (
          <section className="card">
            <div className="section-header">
              <h2 className="h2">Latest summaries</h2>
            </div>
            <ul className="lesson-table">
              {data.recentActivity.slice(0, 5).map((item) => (
                <li key={item.id} className="lesson-table__row">
                  <div className="lesson-table__mentor">
                    <div className="lesson-table__avatar" aria-hidden>
                      {item.title.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="lesson-table__name">{item.title}</p>
                      <p className="lesson-table__date">{formatDate(item.at)}</p>
                    </div>
                  </div>
                  <div>
                    <span className="badge badge--primary">{item.action}</span>
                  </div>
                  <p className="text-small text-muted">{formatRelative(item.at)}</p>
                  <Link
                    to="/summaries"
                    className="lesson-table__action-btn"
                    aria-label={`View ${item.title}`}
                  >
                    <IconArrowRight />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="quick-actions">
          <Link to="/summaries" className="quick-action">
            Browse summaries
          </Link>
          <Link to="/memory" className="quick-action">
            Edit memory
          </Link>
          <Link to="/sync" className="quick-action">
            Sync devices
          </Link>
        </div>
      </div>

      <DashboardRightPanel stats={data} />
    </div>
  );
}

export default OverviewPage;
