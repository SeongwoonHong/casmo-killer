export interface DupeValueCheckOption {
  field: string;
  value: string;
  exclude?: string;
}

export interface DupeValueCheckResult {
  field?: string;
  isTaken: boolean;
}

export interface EmailTemplateParams {
  body: string;
  buttonText: string;
  buttonUrl: string;
  clientUrl?: string;
  footerText: string;
  heading: string;
  logoAlt?: string;
  logoUrl?: string;
  themeColor?: string;
  title: string;
}

export interface ErrorData {
  message: string;
  success?: boolean;
}

export interface ErrorWithStatus extends Error {
  status?: number;
}

export interface QueryParamsObject {
  exclude_fields: string[];
  ids: string[];
  return_fields: string[];
}

export interface RsaKeyPair {
  privateKey: string;
  publicKey: string;
}
