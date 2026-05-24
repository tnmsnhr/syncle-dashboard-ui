import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "../hooks/useAuth";
import { setAccessToken } from "../utils/storage";

function parseOAuthHash(): { token?: string; email?: string; error?: string } {
  const params = new URLSearchParams(window.location.hash.slice(1));
  return {
    token: params.get("token") ?? undefined,
    email: params.get("email") ?? undefined,
    error: params.get("error") ?? params.get("error_description") ?? undefined,
  };
}

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { token, email, error: oauthError } = parseOAuthHash();

    if (oauthError) {
      const msg = oauthError;
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          { type: "SYNCLE_AUTH_CALLBACK", error: msg },
          window.location.origin
        );
        window.close();
        return;
      }
      setError(msg);
      return;
    }

    if (!token) {
      const msg = "Google sign-in did not complete. Please try again.";
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          { type: "SYNCLE_AUTH_CALLBACK", error: msg },
          window.location.origin
        );
        window.close();
        return;
      }
      setError(msg);
      return;
    }

    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(
        { type: "SYNCLE_AUTH_CALLBACK", token, email },
        window.location.origin
      );
      window.close();
      return;
    }

    setAccessToken(token, true);
    void login({ token, persist: true })
      .then(() => navigate("/", { replace: true }))
      .catch((err: Error) => setError(err.message || "Sign-in failed"));
  }, [login, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">
          <Logo />
        </div>
        {error ? (
          <>
            <p className="alert alert--error">{error}</p>
            <button
              type="button"
              onClick={() => navigate("/login", { replace: true })}
              className="link"
              style={{ marginTop: "1rem", display: "inline-block" }}
            >
              Back to sign in
            </button>
          </>
        ) : (
          <p className="text-muted">Completing Google sign-in…</p>
        )}
      </div>
    </div>
  );
}

export default AuthCallbackPage;
