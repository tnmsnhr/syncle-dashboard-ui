import clsx from "clsx";

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={clsx("skeleton-lines", className)} aria-busy>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton skeleton--line" />
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skeleton--card">
          <div className="skeleton skeleton--card-label" />
          <div className="skeleton skeleton--card-value" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="data-table-wrap" aria-busy>
      <div className="skeleton" style={{ height: 40, margin: "1rem" }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 48, margin: "0 1rem 0.75rem" }} />
      ))}
    </div>
  );
}
