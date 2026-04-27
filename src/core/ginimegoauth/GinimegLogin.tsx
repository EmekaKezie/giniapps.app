import { Box } from "@mui/material";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

type TProps = {
  clientId: string;
  onSuccess: (response: any) => void;
  onError?: (response: any) => void;
};

//const oauthApi = "http://localhost:4300/api";
const oauthApi = "https://account-api.ginimeg.com/api";

interface IOauthAuthorizeRequest {
  client_id: string;
  //domain_url: string;
  return_url: string;
  session_token: string;
}

export interface IOAuthAuthorizeResponse {
  access_token: string;
  domain_url: string;
  return_url: string;
  login_url: string;
  session_token: string;
}

const sessionStorageKey = "ginimeg_oauth_session";

type TResponseStatus = "success" | "failed" | "error";

interface IResponse<T> {
  status: TResponseStatus;
  message: string;
  data: T;
}

export const OAuthAuthorizeApi = async (param: IOauthAuthorizeRequest) => {
  try {
    const url = `${oauthApi}/oauth/authorize/login`;
    const response = await fetch(url, {
      method: "post",
      body: JSON.stringify(param),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export default function GinimegLogin(props: TProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const accessToken = searchParams.get("access_token");
  const sessionToken = searchParams.get("session_token");
  const authed = searchParams.get("authed");

  const returnUrl = window.location.href;
  //const initSessionToken = localStorage.getItem(sessionStorageKey);

  useEffect(() => {
    if (!authed || authed === "0") {
      handleAuthorize();
    } else {
      handleAuthToken();
    }
  }, [authed]);

  const handleAuthToken = () => {
    const res_data = {
      access_token: accessToken,
    };

    props.onSuccess(res_data);

    if (sessionToken) {
      localStorage.setItem(sessionStorageKey, sessionToken);
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.delete("access_token");
    newParams.delete("session_token");

    setSearchParams(newParams);
  };

  const handleAuthorize = async () => {
    try {
      const payload: IOauthAuthorizeRequest = {
        client_id: props.clientId,
        //domain_url: domainUrl,
        return_url: returnUrl,
        session_token: "", //initSessionToken || "",
      };
      const res: IResponse<IOAuthAuthorizeResponse> =
        await OAuthAuthorizeApi(payload);
      if (res.status) {
        if (res?.data?.login_url) {
          window.location.href = res.data.login_url;
        }
      } else {
        props.onError && props.onError(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return <Box></Box>;
}
