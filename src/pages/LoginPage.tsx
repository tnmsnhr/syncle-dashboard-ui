import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "../hooks/useAuth";
import { fetchAuthStatus } from "../api/auth";
import {
  signInWithGooglePopup,
  signInWithGoogleRedirect,
} from "../auth/googleSignIn";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loginError } = useAuth();
  const [googleReady, setGoogleReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    fetchAuthStatus()
      .then((s) => {
        setStatusError(null);
        setGoogleReady(Boolean(s.googleSignIn && s.browserOAuth));
      })
      .catch((err) => {
        setGoogleReady(false);
        setStatusError(
          err instanceof Error
            ? err.message
            : "Cannot reach syncle-services — is it running on port 3001?"
        );
      })
      .finally(() => setChecking(false));
  }, []);

  const handleGoogleSignIn = async () => {
    setError(null);
    setBusy(true);
    try {
      const { token } = await signInWithGooglePopup();
      await login({ token, persist: true });
      navigate("/", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign-in failed";
      if (message.includes("Popup blocked")) {
        signInWithGoogleRedirect();
        return;
      }
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">
          <Logo />
        </div>

        <h1 className="auth-card__title">Sign in to Syncle</h1>
        <p className="auth-card__desc">
          Use the same Google account as the Chrome extension. A Google sign-in
          window will open — just like in the extension popup.
        </p>

        <div className="auth-card__actions">
          <button
            type="button"
            onClick={() => void handleGoogleSignIn()}
            disabled={checking || !googleReady || busy}
            className="auth-card__google"
          >
            <GoogleIcon />
            {busy
              ? "Signing in…"
              : checking
                ? "Checking…"
                : googleReady
                  ? "Sign in with Google"
                  : "Google sign-in unavailable"}
          </button>

          {!checking && statusError && (
            <p className="alert alert--warning" style={{ marginTop: "0.75rem" }}>
              {statusError}
            </p>
          )}
          {!checking && !statusError && !googleReady && (
            <p className="alert alert--warning" style={{ marginTop: "0.75rem" }}>
              Configure Google OAuth in syncle-services/.env and restart the API.
            </p>
          )}

          {(error || loginError) && (
            <p className="alert alert--error" style={{ marginTop: "0.75rem" }}>
              {error || loginError}
            </p>
          )}
        </div>

        <p className="auth-card__footnote">
          No passwords or tokens to copy — one click, same as the extension.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.083 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 29.082 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 29.082 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export default LoginPage;
