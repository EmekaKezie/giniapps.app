import type { IInvoiceView } from "./IInvoice";

export interface IFolderView {
  folder_id: string;
  title: string;
  company_id?: string;
  created_date?: Date;
  creator_user_id?: string;
  modified_date?: Date;
  modifier_user_id?: string;

  invoices?: IInvoiceView[];
}

export interface IFolderInput {
  title: string;
}
