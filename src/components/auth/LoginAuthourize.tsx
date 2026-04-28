import GinimegLogin from "@core/ginimegoauth/GinimegLogin";
import { Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { IApiRes } from "@appTypes/IAap";
import type { ILoginRes } from "@appTypes/IAuth";
import { loginApi } from "@api/authApi";
import {
  SET_AUTH_ACCOUNT_ID,
  SET_AUTH_EMAIL,
  SET_AUTH_FIRSTNAME,
  SET_AUTH_LASTNAME,
  SET_AUTH_TOKEN,
  SET_AUTH_USER_ID,
} from "@core/storage/authstorage";
import type { IAccountView } from "@appTypes/IAccount";
import { apiGetAccountByUserId } from "@api/accountApi";
import LoadingAlpha from "@core/loaders/LoadingAlpha";

interface ITokenValue {
  firstname: string;
  email: string;
  lastname: string;
  user_id: string;
  is_temporal_password: boolean;
  is_verified: boolean;
  username: string;
}

export default function LoginAuthourize() {
  const clientId = import.meta.env.VITE_OUTH_CLIENT_ID;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("Loading . . . Please wait");

  const fetchAccountList = async (user_id: string): Promise<IAccountView[]> => {
    try {
      const res: IApiRes<IAccountView[]> = await apiGetAccountByUserId(user_id);
      if (res?.status === "success") {
        return res?.data!;
      } else {
        return [];
      }
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  };

  const handleLoginAsync = async (token: ITokenValue) => {
    setLoading(true);
    setLoadingMsg("Authorizing . . . Please wait");

    try {
      const payload = {
        user_id: token.user_id,
      };
      const res: IApiRes<ILoginRes> = await loginApi(payload);
      if (res?.status === "success") {
        SET_AUTH_TOKEN(res.data?.token!);
        SET_AUTH_USER_ID(res.data?.user_id!);
        SET_AUTH_ACCOUNT_ID(res.data?.account_id!);
        // SET_AUTH_COMPANY_ID(res.data?.company_id!);
        // SET_AUTH_COMPANY_NAME(res?.data?.company?.name!);
        SET_AUTH_FIRSTNAME(res.data?.firstname!);
        SET_AUTH_LASTNAME(res.data?.lastname!);
        SET_AUTH_EMAIL(res.data?.email!);

        const accounts = await fetchAccountList(res?.data?.user_id!);
        console.log(accounts);

        navigate("../apps");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setLoadingMsg("Something went wrong...please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <GinimegLogin
        clientId={clientId}
        onSuccess={(res) => {
          const jwtToken = res?.access_token;
          const tokenValue: ITokenValue = jwtDecode(jwtToken);
          handleLoginAsync(tokenValue);
        }}
        onError={(res) => {
          console.log("err", res);
        }}
      />
      {loading && <LoadingAlpha message={loadingMsg} />}
    </Box>
  );
}
