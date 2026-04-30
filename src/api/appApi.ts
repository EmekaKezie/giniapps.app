import { AUTH_TOKEN } from "@core/storage/authstorage";
import { api } from "./api";
import type { ICreateAppRequest } from "@appTypes/IApp";

export const apiGetApps = async () => {
  try {
    const url = `${api}/app`;
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

export const apiGetAppById = async (app_id: string) => {
  try {
    const url = `${api}/app/${app_id}/get_id`;
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

export const apiGenerateAppApiKey = async (app_id: string) => {
  try {
    const url = `${api}/app/${app_id}/get_id`;
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

export const apiCreateApp = async (param: ICreateAppRequest) => {
  try {
    const url = `${api}/app/create`;
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
