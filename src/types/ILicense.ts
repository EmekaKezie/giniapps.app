export interface IGenerateLicenseRequest {
  app_code: string;
  valid_days: number;
  is_permanent: boolean;
}

export interface IGenerateLicenseResponse {
  license: string;
}

export interface IInspectLicenseRequest {
  license: string;
}

export interface IInspectLicenseResponse {
  app_code: string;
  expiry: string;
}

export interface IApplyLicenseRequest {
  license: string;
}

export interface IApplyLicenseResponse {
  is_valid: boolean;
}
