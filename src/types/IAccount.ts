import type { ICompanyView } from "./ICompany";

export interface IAccountView {
  account_id: string;
  company_id: string; // The "Home/Primary" company ID
  user_id: string;
  firstname?: string | null;
  lastname?: string | null;
  email: string;
  phone?: string | null;
  account_status: string;
  created_date: Date;
  creator_user_id: string;
  modified_date: Date;
  modifier_user_id: string;
  last_accessed_company_id: string;

  // RELATION: Array of company memberships
  company?: ICompanyView;
}


