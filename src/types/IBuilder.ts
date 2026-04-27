export type TBuilderMode = "thumbnail" | "preview" | "builder" | "thumbnail2";

export interface IBuilder {
  html: string;
  template: Partial<IBuilderTemplate>;
  document: Partial<IBuilderDocument>;
  styling: Partial<IBuilderStyling>;
}

export interface IBuilderTemplate {
  id: string;
  title: string;
  html: string;
  items: IBuilderDocumentItems[];
  document: IBuilderDocument;
  styling: IBuilderStyling;
}

export interface IBuilderDocument {
  definition: IBuilderDocumentDefinition;
  client: IBuilderDocumentClient;
  issuer: IBuilderDocumentIssuer;
  items: IBuilderDocumentItems[];
  summary: IBuilderDocumentSummary;
  payout: IBuilderDocumentPayout;
  config: IBuilderDocumentConfig;
}

export interface IBuilderDocumentDefinition {
  title: string;
  subtitle: string;
  invoice_number: string;
  currency: string;
  issue_date: Date;
  due_date: Date;
  note: string;
}

export interface IBuilderDocumentClient {
  client_id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  tax_no: string;
}

export interface IBuilderDocumentIssuer {
  logo: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  tax_no: string;
}

export interface IBuilderDocumentItems {
  description: string;
  quantity: number;
  price: number;
  //discount_method: "fixed" | "percentage";
  discount: number;
  total: number;
}

export interface IBuilderDocumentSummary {
  subtotal: number;
  tax_type: string;
  tax_rate: number;
  tax_amount: number;
  grand_total: number;
}

export interface IBuilderDocumentPayout {
  account_no: string;
  account_name: string;
  bank_name: string;
}

export interface IBuilderDocumentConfig {
  set_recurrency?: number;
  recurrency_frequency?: "weekly" | "monthly";
  set_reminder?: number;
  reminder_start?: number;
  reminder_frequency?: "daily" | "weekly";
  email_receipients?: string;
  email_message?: string;
}

export interface IBuilderStyling {
  header_logo: string;
  header_title: string;
  header_subtitle: string;
  items_th_bgcolor: string;

  items: IBuilderStylingProperty;
}

export interface IBuilderStylingProperty {
  background_color: string;
  text_align: string;
  color: string;
}
