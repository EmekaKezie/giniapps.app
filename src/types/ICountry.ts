export interface ICountry {
  name: {
    common: string;
  };
  cca2: string;
  code: string;
  dialCode: string;
  flag: {
    png: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  currency: any;
}

export interface ICurrentCountry {
  ip: string;
  country: string;
}
