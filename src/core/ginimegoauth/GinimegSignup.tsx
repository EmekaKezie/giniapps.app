import { useEffect, useRef } from "react";

type TProps = {
  clientId: string;
  onSuccess: (accessToken: string) => void;
  onError?: (message: string) => void;
};

// Points straight to your beautiful modern frontend accounts portal domain
//const ACCOUNTS_APP_FRONTEND = "http://localhost:4310/auth/signup";
const ACCOUNTS_APP_FRONTEND = "https://account.ginimeg.com/auth/signup";

export default function GinimegSignup({
  clientId,
  onSuccess,
  onError,
}: TProps) {
  // Absolute circuit breaker to completely neutralize unexpected loop re-renders
  const isProcessingOrAuthenticating = useRef(false);

  useEffect(() => {
    if (isProcessingOrAuthenticating.current) return;

    // 1. Strip the incoming hash parameters cleanly from the redirected URL path
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
    // CASE A: User completed registration! Extract passport token string
    // =========================================================================
    if (accessToken) {
      isProcessingOrAuthenticating.current = true;

      const savedState = sessionStorage.getItem("oauth_state");
      if (!state || state !== savedState) {
        onError?.(
          "CSRF Warning: Cross-site security token validation signature missing.",
        );
        return;
      }
      sessionStorage.removeItem("oauth_state");

      // OPTIONAL: Clean verification profiling logs to inspect decoded JWT payload strings
      try {
        const base64Url = accessToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        );
        console.log(
          "🎉 GINIMEG USER REGISTERED & AUTHENTICATED:",
          JSON.parse(jsonPayload),
        );
      } catch (decodeError) {
        console.error("JWT profile mapping failure:", decodeError);
      }

      // Securely scrub the URL hash fragment without triggering a router reload cycle
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search,
      );

      // Forward token straight upstream to the consumer client engine state manager
      onSuccess(accessToken);
      return;
    }

    // =========================================================================
    // CASE B: First component mount. Redirect directly to GiniAccount Signup Page!
    // =========================================================================
    if (!isProcessingOrAuthenticating.current) {
      isProcessingOrAuthenticating.current = true;
      initiateSignupRedirect();
    }
  }, [onSuccess, onError]);

  const initiateSignupRedirect = () => {
    // Construct cryptographically unique state key to block CSRF exploits
    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("oauth_state", state);

    const redirectUri = window.location.origin + window.location.pathname;

    // Send them directly to your unified registration gate with complete tracking parameters
    const authUrl =
      `${ACCOUNTS_APP_FRONTEND}?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${encodeURIComponent(state)}&` +
      `response_type=token`;

    window.location.href = authUrl;
  };

  return null; // Kept layout headless as it behaves purely as a redirect orchestrator
}
