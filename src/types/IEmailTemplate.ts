export interface IEmailTemplate {
  template_id: string;
  app_id: string;
  key: string; // stable identifier the app code uses, e.g. "password_reset"
  name: string;
  subject: string;
  body_html: string;
  variables: string[];
  smtp_id?: string | null; // null = use default SMTP
  is_active: boolean;
  updated_date: string;
}

export interface ISaveEmailTemplateRequest {
  subject: string;
  body_html: string;
  smtp_id?: string | null;
  is_active: boolean;
}
