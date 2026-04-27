import type { ReactNode } from "react";

type TMenuGroup = "explore" | "admin" | "ungrouped";

export interface ISubMenu {
  value: string;
  name: string;
  visible: boolean;
  icon?: any;
  component?: ReactNode;
  url?: string;
}

export interface IMenu {
  id: string;
  url: string;
  displayName: string;
  icon?: any;
  component: ReactNode;
  visible: boolean;
  group: TMenuGroup;
  subMenu: ISubMenu[];
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
