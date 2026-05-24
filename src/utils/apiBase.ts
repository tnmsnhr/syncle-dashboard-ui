/**
 * Backend origin for API calls.
 * In dev, defaults to same-origin so Vite proxies /api and /auth to :3001.
 */
export function getServicesBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (fromEnv?.trim()) return fromEnv.replace(/\/$/, "");
  if (import.meta.env.DEV) return "";
  return "http://localhost:3001";
}

/** Always absolute — used for OAuth popup/redirect navigation. */
export function getOAuthBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (fromEnv?.trim()) return fromEnv.replace(/\/$/, "");
  return "http://localhost:3001";
}

export function getGoogleSignInUrl(): string {
  return `${getOAuthBaseUrl()}/auth/google/dashboard/start`;
}
