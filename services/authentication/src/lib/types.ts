import { Request } from 'express';
import { UserModel } from '../api/user.model';

export enum AuthStrategies {
  local = 'local',
  facebook = 'facebook',
  google = 'google',
  kakao = 'kakao',
}

export interface DupeValueCheckOption {
  field: string;
  value: string;
  excludeId?: string;
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

export interface RefreshTokenPayload {
  user_id: string;
  uuid: string;
}

export interface QueryParamsObject {
  exclude_fields?: string[];
  search_field?: string;
  search_values?: string[];
  return_fields?: string[];
}

export enum SocialAuthProviders {
  facebook = 'facebook',
  google = 'google',
  kakao = 'kakao',
}

export interface SocialAuthResponse {
  avatar: string;
  display_name: string;
  social_id: string;
  social_token: string;
  strategy: SocialAuthProviders;
}

export interface UserInfoRequest<T = UserModel> extends Request {
  user?: T;
  refresh_token?: string;
}
