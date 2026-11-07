export type TAppUserStatus = "active" | "invited" | "suspended";

export interface IAppUser {
  user_id: string;
  app_id: string;
  firstname: string;
  lastname: string;
  email: string;
  role_id: string;
  status: TAppUserStatus;
  last_active?: string | null;
  invited_by?: string;
  created_date: string;
}

export interface IInviteAppUserRequest {
  email: string;
  role_id: string;
}
