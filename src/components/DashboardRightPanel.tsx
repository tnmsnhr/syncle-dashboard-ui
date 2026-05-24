import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { DashboardStats } from "../types";
import { getInitials, getTimeGreeting } from "../utils/greeting";

interface DashboardRightPanelProps {
  stats: DashboardStats;
}

const CHART_PERIODS = ["Week 1", "Week 2", "Week 3"];

export function DashboardRightPanel({ stats }: DashboardRightPanelProps) {
  const { user, plan, usage } = useAuth();
  const displayName = user?.name?.split(" ")[0] ?? "there";
  const initials = getInitials(user?.name, user?.email);
  const usagePercent = stats.usagePercent ?? 0;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (usagePercent / 100) * circumference;

  const barHeights = [
    [Math.min(stats.totalSummaries, 12), Math.min(stats.pinnedCount, 8)],
    [Math.min(stats.websitesThisWeek, 10), Math.min(stats.summariesThisMonth ?? 0, 12)],
    [
      Math.min(stats.quickStats?.avgSummariesPerDay ?? 0, 8) * 2,
      Math.min(stats.recentActivity.length, 10),
    ],
  ];

  return (
    <aside className="right-panel" aria-label="Statistics">
      <div className="right-panel__card">
        <div className="right-panel__progress-wrap">
          <div className="right-panel__ring">
            <svg viewBox="0 0 120 120" aria-hidden>
              <circle className="right-panel__ring-track" cx="60" cy="60" r="52" />
              <circle
                className="right-panel__ring-fill"
                cx="60"
                cy="60"
                r="52"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="right-panel__ring-label">
              <span className="right-panel__ring-percent">{usagePercent}%</span>
              <div className="right-panel__avatar">{initials}</div>
            </div>
          </div>

          <p className="right-panel__greeting">
            {getTimeGreeting()}, {displayName}
          </p>
          <p className="right-panel__subtitle">
            {usage
              ? `${usage.summariesThisMonth} of ${usage.limit} summaries used this month.`
              : "Continue capturing insights to reach your goals."}
          </p>

          <div className="right-panel__chart" aria-hidden>
            {CHART_PERIODS.map((label, i) => (
              <div key={label} className="right-panel__bar-group">
                <div className="right-panel__bars">
                  <div
                    className="right-panel__bar right-panel__bar--primary"
                    style={{ height: `${Math.max(barHeights[i][0] * 4, 8)}%` }}
                  />
                  <div
                    className="right-panel__bar right-panel__bar--secondary"
                    style={{ height: `${Math.max(barHeights[i][1] * 4, 6)}%` }}
                  />
                </div>
                <span className="right-panel__bar-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="right-panel__card">
        <h2 className="right-panel__section-title">Quick links</h2>
        <div className="right-panel__quick-links">
          <Link to="/summaries" className="right-panel__quick-link">
            Browse summaries
            <span aria-hidden>→</span>
          </Link>
          <Link to="/memory" className="right-panel__quick-link">
            Edit memory
            <span aria-hidden>→</span>
          </Link>
          <Link to="/sync" className="right-panel__quick-link">
            Sync devices
            <span aria-hidden>→</span>
          </Link>
          <Link to="/settings" className="right-panel__quick-link">
            {plan ?? "Account"} settings
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
