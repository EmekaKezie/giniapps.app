import { useEffect, useRef } from "react";

type TProps = {
  clientId: string;
  onSuccess: (accessToken: string) => void;
  onError?: (message: string) => void;
};

//ACCOUNTS IDENTITY ENGINE ENDPOINTS
const ACCOUNTS_APP_FRONTEND = "https://account.ginimeg.com/auth/login";
const ACCOUNTS_API_TOKEN_ENDPOINT =
  "https://account-api.ginimeg.com/api/oauth/authorize/token";

// const ACCOUNTS_APP_FRONTEND = "http://localhost:4310/auth/login";
// const ACCOUNTS_API_TOKEN_ENDPOINT =
//   "http://localhost:4300/api/oauth/authorize/token";

// Helper: Web Cryptography API SHA-256 PKCE Generator
async function generatePKCE() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  const codeVerifier = btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return { codeVerifier, codeChallenge };
}

export default function GinimegLogin({ clientId, onSuccess, onError }: TProps) {
  const isProcessingOrAuthenticating = useRef(false);

  useEffect(() => {
    if (isProcessingOrAuthenticating.current) return;

    const searchParams = new URLSearchParams(window.location.search);
    const authCode = searchParams.get("code");
    const state = searchParams.get("state");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      isProcessingOrAuthenticating.current = true;
      onError?.(errorParam);
      return;
    }

    // =========================================================================
    // CASE A: Authorization Code Received in Query Parameters
    // =========================================================================
    if (authCode) {
      isProcessingOrAuthenticating.current = true;

      const savedState = sessionStorage.getItem("oauth_state");
      const codeVerifier = sessionStorage.getItem("oauth_code_verifier");

      if (!state || state !== savedState) {
        onError?.("CSRF Security Failure: State parameter mismatch.");
        return;
      }

      if (!codeVerifier) {
        onError?.(
          "PKCE Validation Error: Code verifier missing from session storage.",
        );
        return;
      }

      // Clear OAuth session state variables immediately
      sessionStorage.removeItem("oauth_state");
      sessionStorage.removeItem("oauth_code_verifier");

      // Exchange short-lived Auth Code for Access Token
      exchangeCodeForToken(authCode, codeVerifier);
      return;
    }

    // =========================================================================
    // CASE B: First Load -> Initiate Authorization Code + PKCE Flow
    // =========================================================================
    if (!isProcessingOrAuthenticating.current) {
      isProcessingOrAuthenticating.current = true;
      initiatePKCELoginRedirect();
    }
  }, [onSuccess, onError]);

  const initiatePKCELoginRedirect = async () => {
    try {
      const state = Math.random().toString(36).substring(2, 15);
      const { codeVerifier, codeChallenge } = await generatePKCE();

      sessionStorage.setItem("oauth_state", state);
      sessionStorage.setItem("oauth_code_verifier", codeVerifier);

      const redirectUri = window.location.origin + window.location.pathname;

      const authUrl =
        `${ACCOUNTS_APP_FRONTEND}?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `state=${encodeURIComponent(state)}&` +
        `response_type=code&` +
        `code_challenge=${encodeURIComponent(codeChallenge)}&` +
        `code_challenge_method=S256`;

      window.location.href = authUrl;
    } catch {
      onError?.("Failed to compute PKCE security challenges.");
    }
  };

  const exchangeCodeForToken = async (code: string, verifier: string) => {
    try {
      const redirectUri = window.location.origin + window.location.pathname;

      const response = await fetch(ACCOUNTS_API_TOKEN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: clientId,
          code: code,
          redirect_uri: redirectUri,
          code_verifier: verifier,
        }),
      });

      const res = await response.json();

      if (res?.status === "success" && res.data?.access_token) {
        // Strip ?code=... and ?state=... cleanly from address bar
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );

        // Deliver token to parent application layout
        onSuccess(res.data.access_token);
      } else {
        onError?.(
          res?.message || "Failed to exchange authorization code for token.",
        );
      }
    } catch {
      onError?.("Network error exchanging authorization code.");
    }
  };

  return null;
}
