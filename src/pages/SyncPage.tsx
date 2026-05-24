import { ErrorState } from "../components/ErrorState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useSyncStatus, useManualSync } from "../hooks/useSync";
import { formatDate } from "../utils/format";
import { getApiErrorMessage } from "../api/client";
import clsx from "clsx";

export function SyncPage() {
  const { data, isLoading, isError, error, refetch } = useSyncStatus();
  const manualSync = useManualSync();

  if (isLoading) {
    return (
      <div className="page-stack page-stack--narrow">
        <PageHeader />
        <LoadingSkeleton lines={5} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="page-stack page-stack--narrow">
        <PageHeader />
        <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="page-stack page-stack--narrow">
      <PageHeader />

      <section className="card">
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <p className="text-muted text-small" style={{ marginBottom: "0.5rem" }}>
              Sync status
            </p>
            <span
              className={clsx(
                "status-badge",
                `status-badge--${data.status}`
              )}
            >
              {data.status}
            </span>
            {data.message && (
              <p className="text-muted" style={{ marginTop: "0.5rem" }}>
                {data.message}
              </p>
            )}
            <p className="text-xs" style={{ marginTop: "0.5rem" }}>
              Last synced: {formatDate(data.lastSyncedAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => manualSync.mutate()}
            disabled={manualSync.isPending || data.status === "syncing"}
            className="btn btn--primary"
          >
            {manualSync.isPending || data.status === "syncing" ? "Syncing…" : "Sync now"}
          </button>
        </div>

        {manualSync.error && (
          <p className="alert alert--error" style={{ marginTop: "0.75rem" }}>
            {getApiErrorMessage(manualSync.error)}
          </p>
        )}
      </section>

      <section className="card">
        <h2 className="h3" style={{ marginBottom: "1rem" }}>
          Connected devices
        </h2>
        {data.devices.length === 0 ? (
          <p className="text-muted">No devices registered yet.</p>
        ) : (
          <ul className="activity-list">
            {data.devices.map((device) => (
              <li key={device.id} className="activity-list__item">
                <div>
                  <p className="activity-list__title">{device.name}</p>
                  <p className="activity-list__action">{device.platform}</p>
                </div>
                <time className="activity-list__time">{formatDate(device.lastSeenAt)}</time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function PageHeader() {
  return (
    <header className="page-header">
      <h1 className="h1">Sync</h1>
      <p className="page-header__desc">
        Keep summaries and settings in sync across your devices.
      </p>
    </header>
  );
}

export default SyncPage;
