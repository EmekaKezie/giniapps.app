import { api } from "./api";

export const apiGetApps = async () => {
  try {
    const url = `${api}/app`;
    const response = await fetch(url, {
      method: "get",
      //   body: JSON.stringify(param),
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

export const apiGetAppById = async (app_id: string) => {
  try {
    const url = `${api}/app/${app_id}/get_id`;
    const response = await fetch(url, {
      method: "get",
      //   body: JSON.stringify(param),
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

export const apiGenerateAppApiKey = async (app_id: string) => {
  try {
    const url = `${api}/app/${app_id}/get_id`;
    const response = await fetch(url, {
      method: "get",
      //   body: JSON.stringify(param),
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
