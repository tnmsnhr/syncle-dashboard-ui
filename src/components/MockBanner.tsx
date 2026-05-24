import { useSyncExternalStore } from "react";
import { isUsingMockFallback } from "../api/client";

function subscribe(cb: () => void) {
  const id = setInterval(cb, 500);
  return () => clearInterval(id);
}

export function MockBanner() {
  const visible = useSyncExternalStore(subscribe, isUsingMockFallback, () => false);
  if (!visible) return null;

  return (
    <div role="status" className="mock-banner">
      Cannot reach syncle-services — start the API on port 3001.
    </div>
  );
}
