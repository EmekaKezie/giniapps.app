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


export interface ICreateAppRequest {
  app_name: string;
  app_code: string;

  is_active: boolean;
  is_live: boolean;

  // license_private_key?: string | null;
  // license_public_key?: string | null;
  // generated_license?: string | null;

  authorized_urls: string[];
  app_logo?: string | null;
}