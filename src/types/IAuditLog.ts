export type TAuditCategory =
  | "auth"
  | "users"
  | "roles"
  | "smtp"
  | "license"
  | "settings";

export interface IAuditLog {
  log_id: string;
  app_id: string;
  actor_name: string;
  actor_email: string;
  category: TAuditCategory;
  action: string;
  target?: string;
  ip_address: string;
  created_date: string;
}
