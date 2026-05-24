import { getGoogleSignInUrl } from "../utils/apiBase";

export interface GoogleSignInResult {
  token: string;
  email?: string;
}

/**
 * Same flow as the Chrome extension: open Google OAuth in a popup,
 * then receive the session token from /login/callback (no manual paste).
 */
export function signInWithGooglePopup(): Promise<GoogleSignInResult> {
  return new Promise((resolve, reject) => {
    const url = getGoogleSignInUrl();
    const popup = window.open(
      url,
      "syncle-google-signin",
      "width=520,height=640,left=100,top=100"
    );

    if (!popup) {
      reject(new Error("Popup blocked — allow popups for this site or sign in via redirect."));
      return;
    }

    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Sign-in timed out. Please try again."));
    }, 5 * 60 * 1000);

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as {
        type?: string;
        token?: string;
        email?: string;
        error?: string;
      };
      if (data?.type !== "SYNCLE_AUTH_CALLBACK") return;

      cleanup();
      if (data.error) {
        reject(new Error(data.error));
        return;
      }
      if (!data.token) {
        reject(new Error("Sign-in did not return a session."));
        return;
      }
      resolve({ token: data.token, email: data.email });
    };

    const pollClosed = window.setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error("Sign-in window was closed before completing."));
      }
    }, 500);

    function cleanup() {
      window.clearTimeout(timeout);
      window.clearInterval(pollClosed);
      window.removeEventListener("message", onMessage);
      try {
        popup?.close();
      } catch {
        /* ignore */
      }
    }

    window.addEventListener("message", onMessage);
  });
}

/** Full-page redirect fallback if popups are blocked. */
export function signInWithGoogleRedirect(): void {
  window.location.href = getGoogleSignInUrl();
}
