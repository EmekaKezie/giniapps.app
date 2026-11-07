import type { ISmtpBase, TSmtpSecurity } from "@appTypes/ISmtp";

/** Matches what GiniSend's mailer supports. */
export const SECURITY_OPTIONS: { value: TSmtpSecurity; label: string; port: number; hint: string }[] = [
  { value: "starttls", label: "STARTTLS", port: 587, hint: "Most providers (Gmail, SendGrid, Office 365)" },
  { value: "ssl", label: "SSL / TLS", port: 465, hint: "Encrypted from the start (Zoho, many hosts)" },
  { value: "none", label: "None", port: 25, hint: "Unencrypted; only for internal relays" },
];

export const securityLabel = (v: string) =>
  SECURITY_OPTIONS.find((o) => o.value === v)?.label ?? v;

/** Common providers, to pre-fill host/port/security. */
export const PROVIDER_PRESETS: { name: string; host: string; port: number; security: TSmtpSecurity }[] = [
  { name: "gmail", host: "smtp.gmail.com", port: 587, security: "starttls" },
  { name: "zoho", host: "smtp.zoho.com", port: 465, security: "ssl" },
  { name: "office365", host: "smtp.office365.com", port: 587, security: "starttls" },
  { name: "sendgrid", host: "smtp.sendgrid.net", port: 587, security: "starttls" },
  { name: "mailgun", host: "smtp.mailgun.org", port: 587, security: "starttls" },
  { name: "brevo", host: "smtp-relay.brevo.com", port: 587, security: "starttls" },
  { name: "ses", host: "email-smtp.us-east-1.amazonaws.com", port: 587, security: "starttls" },
];

export type TSmtpHealth = { label: string; color: "success" | "error" | "default" };

export const smtpHealth = (s: Pick<ISmtpBase, "is_verified" | "verification_error" | "last_verified_date">): TSmtpHealth => {
  if (s.is_verified) return { label: "Verified", color: "success" };
  if (s.verification_error) return { label: "Failing", color: "error" };
  return { label: "Not tested", color: "default" };
};
