import type { IClientView } from "./IClient";
import type { IFolderView } from "./IFolder";
import type { IPayoutView } from "./IPayout";

export type TInvoiceStatus =
  | "paid"
  | "pending"
  | "draft"
  | "overdue"
  | "archived";

export interface IInvoiceView {
  invoice_id: string;
  company_id?: string;
  title: string;
  logo?: string;
  subtitle: string;
  html: string;
  tmpl: string;
  invoice_no: string;
  invoice_status: string;
  issue_date: string;
  due_date: string;
  note: string;
  currency: string;
  tax_type: string;
  tax_rate: number;
  folder_id?: string;
  client_id?: string;
  payout_id?: string;
  created_date?: string;
  creator_user_id?: string;
  modified_date?: string;
  modifier_user_id?: string;
  items: IInvoiceItemView[];
  styles?: IInvoiceStyles[];
  client?: IClientView;
  payout?: IPayoutView;
  config?: IInvoiceConfig;
  folder?: IFolderView;
}

export interface IInvoiceItemView {
  item_id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  price: number;
  discount: number;
  tax_amount: number;
  total: number;
}

export interface IInvoiceConfig {
  set_recurrency: number;
  recurrency_frequency: "weekly" | "monthly";
  set_reminder: number;

  reminder_start: number;
  reminder_frequency: "daily" | "weekly";

  email_receipients: string; //seperate with comma
  email_message: string;
}

export interface IInvoiceStyles {
  invoice_style_id: string;
  company_id?: string;
  invoice_id: string;
  style_group: string;
  style_property: string;
  style_value: string;
  created_date?: string;
  creator_user_id?: string;
  modified_date?: string;
  modifier_user_id?: string;
}

export type TStyleProps = {
  items_th_bg_color: "items_th_bg_color";
  items_th_text_color: "items_th_text_color";
  items_th_col_width: "items_th_col_width";
};
