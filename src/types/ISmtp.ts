export type TSmtpSecurity = "none" | "starttls" | "ssl";

/** SMTP server config as GiniSend returns it (password is never returned). */
export interface ISmtpBase {
  smtp_id: string;
  smtp_name: string;
  host: string;
  port: number;
  security: TSmtpSecurity | string;
  username?: string | null;
  has_password: boolean;
  sender_email: string;
  sender_name?: string | null;
  reply_to_email?: string | null;
  provider_name: string;
  /** Disabled for every app when false. */
  smtp_is_active: boolean;
  /** Shared platform SMTP: assignable to any app, not editable per app. */
  is_system_defined: boolean;
  is_verified: boolean;
  last_verified_date?: string | null;
  verification_error?: string | null;
  created_date: string;
  /** How many apps this SMTP is assigned to. */
  app_count: number;
}

/** An SMTP assigned to the current app. */
export interface IAppSmtp extends ISmtpBase {
  /** The one SMTP this app sends with. */
  is_default: boolean;
  /** Enabled for this app. */
  is_active: boolean;
  assigned_date: string;
  sent_last_30d: number;
}

/** An SMTP that could be assigned to the current app. */
export type IAvailableSmtp = ISmtpBase;

export interface ISaveSmtpRequest {
  smtp_name: string;
  host: string;
  port: number;
  security: TSmtpSecurity;
  username: string;
  /** Write-only. On update, blank keeps the current password. */
  password: string;
  sender_email: string;
  sender_name: string;
  reply_to_email: string;
  provider_name: string;
  /** Create only. */
  is_default?: boolean;
}

export interface IVerifySmtpResult {
  smtp_id: string;
  verified: boolean;
  test_sent: boolean;
  error: string | null;
}

export interface IRemoveSmtpResult {
  smtp_id: string;
  smtp_deleted: boolean;
  new_default_smtp_id: string | null;
  app_has_default: boolean;
}
