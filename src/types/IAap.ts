import type { ReactNode } from "react";

export interface IAppMenuItem {
  id: string;
  /** Relative to `/apps/:app_id`. Empty string = index page. */
  path: string;
  label: string;
  icon: ReactNode;
  component: ReactNode;
  /** Page runs on mock data until its API is ready. */
  preview?: boolean;
}

export interface IAppMenuGroup {
  label?: string;
  items: IAppMenuItem[];
}

export interface IApiRes<T> {
  status:
    | "success"
    | "failed"
    | "invalid_token"
    | "error"
    | "permission_denied"
    | "failed_show_errors"
    | "signup_account_exists";
  message: string;
  data: T | null;
  total?: number;
  errors?: string[];
}
