export interface IClientView {
  logo: string;
  client_id: string;
  company_id?: string;
  client_name: string;
  client_address: string;
  contact_fullname: string;
  contact_email: string;
  contact_phone?: string | null;

  country_code: string;
  country_name: string;
  created_date?: Date;
  creator_user_id?: string;
  modified_date?: string;
  modifier_user_id?: string;
}
