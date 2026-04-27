import type { IAccountView } from "./IAccount";

export interface ILoginReq {
  user_id: string;
}

export interface ILoginRes extends IAccountView {
  token: string;
}

export interface ISwitchAccountReq {
  user_id: string;
  target_company_id: string;
}
