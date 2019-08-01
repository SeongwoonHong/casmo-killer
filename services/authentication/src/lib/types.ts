import { Request } from 'express';

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
  bodyTitle: string;
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
  search_field: string;
  search_values: string[];
  return_fields: string[];
}

export interface RsaKeyPair {
  privateKey: string;
  publicKey: string;
}

export interface UserInfoRequest<T> extends Request {
  user?: T;
  refresh_token?: string;
}
