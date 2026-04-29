export interface IAppView {
  app_id: string;
  app_name: string;
  app_code: string;
  api_key?: string;

  is_active: number;
  is_live: number;

  created_date?: string;
  create_by?: string;

  license_private_key?: string;
  license_public_key?: string;
  generated_license?: string;

  authorized_urls?: string;
}
