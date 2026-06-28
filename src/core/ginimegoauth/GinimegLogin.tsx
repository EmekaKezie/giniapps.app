import { useEffect, useRef } from "react";

type TProps = {
  clientId: string;
  onSuccess: (accessToken: string) => void;
  onError?: (message: string) => void;
};

//const ACCOUNTS_APP_FRONTEND = "http://localhost:4310/auth/login";
const ACCOUNTS_APP_FRONTEND = "https://account.ginimeg.com/auth/login";

export default function GinimegLogin({ clientId, onSuccess, onError }: TProps) {
  // 👈 THE ABSOLUTE CIRCUIT BREAKER
  // This persists across re-renders. If it becomes true, the redirect engine is completely dead.
  const isProcessingOrAuthenticating = useRef(false);

  useEffect(() => {
    // If we already handled a success or are in the middle of routing, drop everything.
    if (isProcessingOrAuthenticating.current) return;

    // 1. Strip the hash marker cleanly
    const hashString = window.location.hash.startsWith("#")
      ? window.location.hash.substring(1)
      : window.location.hash;

    const params = new URLSearchParams(hashString);
    const accessToken = params.get("access_token");
    const state = params.get("state");

    const searchParams = new URLSearchParams(window.location.search);
    const errorParam = searchParams.get("error");

    if (errorParam) {
      onError?.(errorParam);
      return;
    }

    // =========================================================================
    // CASE A: Token is in the URL. We are DONE. Stop the world.
    // =========================================================================
    if (accessToken) {
      // Throw the circuit breaker instantly before doing ANYTHING else
      isProcessingOrAuthenticating.current = true;

      const savedState = sessionStorage.getItem("oauth_state");
      if (!state || state !== savedState) {
        onError?.("CSRF Warning: State mismatch!");
        return;
      }
      sessionStorage.removeItem("oauth_state");

      // // DECODE AND LOG YOUR USER PROFILE STRINGS
      // try {
      //   const base64Url = accessToken.split(".")[1];
      //   const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      //   const jsonPayload = decodeURIComponent(
      //     window
      //       .atob(base64)
      //       .split("")
      //       .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      //       .join(""),
      //   );
      //   const decodedProfile = JSON.parse(jsonPayload);

      //   console.log("=========================================");
      //   console.log("🎉 GINIMEG SIGN-ON SUCCESSFUL!");
      //   console.log("Decoded Profile Object:", decodedProfile);
      //   console.log("=========================================");
      // } catch (decodeError) {
      //   console.error("Failed to parse token:", decodeError);
      // }

      // Wipe the URL string cleanly so the token is hidden
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search,
      );

      // Hand the token off to Ginivo's parent container layout
      onSuccess(accessToken);
      return;
    }

    // =========================================================================
    // CASE B: First load, no token in the URL. Go to GiniAccount!
    // =========================================================================
    // Only redirect if our circuit breaker is false (meaning this is a fresh entry)
    if (!isProcessingOrAuthenticating.current) {
      isProcessingOrAuthenticating.current = true; // Lock it down so it can't execute twice
      initiateLoginRedirect();
    }
  }, [onSuccess, onError]); // Explicit stable hooks tracking variables array

  const initiateLoginRedirect = () => {
    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("oauth_state", state);

    const redirectUri = window.location.origin + window.location.pathname;

    const authUrl =
      `${ACCOUNTS_APP_FRONTEND}?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${encodeURIComponent(state)}&` +
      `response_type=token`;

    window.location.href = authUrl;
  };

  return null;
}
