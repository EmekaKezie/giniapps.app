import { api } from "@api/api";
import type { ILoginReq } from "@appTypes/IAuth";

export const loginApi = async (param: ILoginReq) => {
  try {
    const url = `${api}/auth/login`;
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
