// SMTP setup for an app: giniapps API `/app/:app_id/smtp...`, backed by GiniSend.
import { AUTH_TOKEN } from "@core/storage/authstorage";
import { api } from "./api";
import type { IApiRes } from "@appTypes/IAap";
import type {
  IAppSmtp,
  IAvailableSmtp,
  IRemoveSmtpResult,
  ISaveSmtpRequest,
  IVerifySmtpResult,
} from "@appTypes/ISmtp";

const request = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
): Promise<IApiRes<T>> => {
  try {
    const response = await fetch(`${api}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN()}`,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return await response.json();
  } catch {
    return {
      status: "error",
      message: "Could not reach the server. Please check your internet",
      data: null,
    };
  }
};

const base = (app_id: string) => `/app/${encodeURIComponent(app_id)}/smtp`;
const one = (app_id: string, smtp_id: string) =>
  `${base(app_id)}/${encodeURIComponent(smtp_id)}`;

export const apiGetSmtps = (app_id: string) =>
  request<IAppSmtp[]>("GET", base(app_id));

export const apiGetAvailableSmtps = (app_id: string) =>
  request<IAvailableSmtp[]>("GET", `${base(app_id)}/available`);

export const apiCreateSmtp = (app_id: string, param: ISaveSmtpRequest) =>
  request<{ smtp_id: string; is_default: boolean }>("POST", base(app_id), param);

export const apiAssignSmtp = (app_id: string, smtp_id: string, is_default: boolean) =>
  request<{ smtp_id: string; is_default: boolean }>("POST", `${one(app_id, smtp_id)}/assign`, { is_default });

export const apiUpdateSmtp = (app_id: string, smtp_id: string, param: ISaveSmtpRequest) =>
  request<{ smtp_id: string; verification_reset: boolean }>("PUT", one(app_id, smtp_id), param);

export const apiSetDefaultSmtp = (app_id: string, smtp_id: string) =>
  request<{ smtp_id: string }>("PUT", `${one(app_id, smtp_id)}/default`);

export const apiSetSmtpStatus = (app_id: string, smtp_id: string, is_active: boolean) =>
  request<{ smtp_id: string; is_active: boolean }>("PUT", `${one(app_id, smtp_id)}/status`, { is_active });

export const apiRemoveSmtp = (app_id: string, smtp_id: string) =>
  request<IRemoveSmtpResult>("DELETE", one(app_id, smtp_id));

/** Tests the connection; with a recipient, also sends a test email. */
export const apiVerifySmtp = (app_id: string, smtp_id: string, test_recipient?: string) =>
  request<IVerifySmtpResult>("POST", `${one(app_id, smtp_id)}/verify`, { test_recipient });
