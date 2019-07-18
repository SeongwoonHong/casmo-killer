import {
  CookieOptions,
  Response,
} from 'express';

import { configs } from '~config';

export const generateCookie = (
  res: Response,
  data: string,
  cookieOptions?: CookieOptions,
): Response => {
  const {
    maxAge = 1000 * 60 * 60 * 24,
    ...options
  } = cookieOptions || {};

  return res.cookie(
    configs.COOKIE.KEY_NAME,
    data,
    {
      httpOnly: true,
      maxAge,
      secure: configs.COOKIE.IS_SECURE,
      signed: true,
      ...options,
    },
  );
};
