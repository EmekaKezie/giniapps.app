import type {
  IApplyLicenseRequest,
  IGenerateLicenseRequest,
  IInspectLicenseRequest,
} from "@appTypes/ILicense";
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

export const apiInspectLicense = async (param: IInspectLicenseRequest) => {
  try {
    const url = `${api}/license/inspect`;
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

export const apiApplyLicense = async (
  url: string,
  param: IApplyLicenseRequest,
) => {
  try {
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
