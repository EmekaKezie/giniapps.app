import LoadingCircular from "@core/loaders/LoadingCircular";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type TProps = {
  clientId: string;
  onSuccess: (response: any) => void;
  onError?: (response: any) => void;
};

//const oauthApi = "http://localhost:4300/api";
const oauthApi = "https://account-api.ginimeg.com/api";


interface IOAuthAuthorizeSignupRequest {
  client_id: string;
  //domain_url: string;
  return_url: string;
}

export interface IOAuthAuthorizeSignupResponse {
  domain_url: string;
  return_url: string;
  signup_url: string;
}

type TResponseStatus = "success" | "failed" | "error";

interface IResponse<T> {
  status: TResponseStatus;
  message: string;
  data: T;
}

export const OAuthAuthorizeApi = async (
  param: IOAuthAuthorizeSignupRequest,
) => {
  try {
    const url = `${oauthApi}/oauth/authorize/signup`;
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

export default function GinimegSignup(props: TProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const user_id = searchParams.get("user_id");
  const email = searchParams.get("email");
  const firstname = searchParams.get("firstname");
  const lastname = searchParams.get("lastname");
  const phone_no = searchParams.get("phone_no");
  const is_verified = searchParams.get("is_verified");
  const is_temporal_password = searchParams.get("is_temporal_password");
  const country_name = searchParams.get("country_name");
  const country_code = searchParams.get("country_code");
  const authed = searchParams.get("authed");

  const returnUrl = window.location.href;
  //const initSessionToken = localStorage.getItem(sessionStorageKey);

  const [authorizeLoading, setAuthorizeLoading] = useState(false);

  useEffect(() => {
    if (!authed || authed === "0") {
      handleAuthorize();
    } else {
      handleSuccess();
    }
  }, [authed]);

  const handleSuccess = () => {
    const res_data = {
      user_id: user_id,
      email: email,
      firstname: firstname,
      lastname: lastname,
      phone_no: phone_no,
      is_verified: is_verified,
      is_temporal_password: is_temporal_password,
      country_name: country_name,
      country_code: country_code,
    };

    props.onSuccess(res_data);

    const newParams = new URLSearchParams(searchParams);
    newParams.delete("user_id");
    newParams.delete("email");
    newParams.delete("firstname");
    newParams.delete("lastname");
    newParams.delete("phone_no");
    newParams.delete("is_verified");
    newParams.delete("is_temporal_password");
    newParams.delete("country_name");
    newParams.delete("country_code");

    setSearchParams(newParams);
  };

  const handleAuthorize = async () => {
    setAuthorizeLoading(true);
    try {
      const payload: IOAuthAuthorizeSignupRequest = {
        client_id: props.clientId,
        //domain_url: domainUrl,
        return_url: returnUrl,
      };
      const res: IResponse<IOAuthAuthorizeSignupResponse> =
        await OAuthAuthorizeApi(payload);
      if (res.status) {
        if (res?.data?.signup_url) {
          window.location.href = res.data.signup_url;
        }
      } else {
        props.onError && props.onError(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAuthorizeLoading(false);
    }
  };

  return <Box>{authorizeLoading && <LoadingCircular />}</Box>;
}
