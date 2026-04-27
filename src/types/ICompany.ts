import type { IAccountView } from "./IAccount";

export interface ICurrency {
  currency_id: string;
  code: string;
  name: string;
}

export interface ITax {
  tax_id: string;
  tax_type: string;
  tax_rate: number;
}

export interface ICompanyView {
  company_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  country?: string | null;
  website?: string | null;
  tax_no?: string | null;
  created_date: Date;
  creator_user_id: string;
  modified_date: Date;
  modifier_user_id: string;
  country_code?: string | null;

  // RELATION: Array of users who have access to this company
  accounts?: IAccountView[];
}
