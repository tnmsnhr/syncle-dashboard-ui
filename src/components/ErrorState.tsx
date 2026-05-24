interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="error-state">
      <p className="error-state__title">{title}</p>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn--secondary" style={{ marginTop: "1rem" }}>
          Try again
        </button>
      )}
    </div>
  );
}
