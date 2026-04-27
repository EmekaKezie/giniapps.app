import type { IGenerateLicenseRequest } from "@appTypes/ILicense";
import { api } from "./api";

export const apiGenerateLicense = async (param: IGenerateLicenseRequest) => {
  try {
    const url = `${api}/license/generate`;
    const response = await fetch(url, {
      method: "post",
      body: JSON.stringify(param),
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${AUTH_TOKEN()}`,
      },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};
