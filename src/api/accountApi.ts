import { api } from "@api/api";
import type { ISwitchAccountReq } from "@appTypes/IAuth";
import { AUTH_TOKEN } from "@core/storage/authstorage";

export const apiGetAccountByUserId = async (user_id: string) => {
  try {
    const url = `${api}/account/${user_id}/user_accounts`;
    const response = await fetch(url, {
      method: "get",
      //   body: JSON.stringify(param),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN()}`,
      },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const apiSwitchAccount = async (param: ISwitchAccountReq) => {
  try {
    const url = `${api}/auth/account/switch`;
    const response = await fetch(url, {
      method: "post",
      body: JSON.stringify(param),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN()}`,
      },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};
