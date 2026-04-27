export interface IGenerateLicenseRequest {
  app_code: string;
  valid_days: number;
}

export interface IGenerateLicenseResponse {
  license: string;
}
