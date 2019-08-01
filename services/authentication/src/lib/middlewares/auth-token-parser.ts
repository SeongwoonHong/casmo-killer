import {
  NextFunction,
  RequestHandler,
  Response,
} from 'express';

import { TokenModel } from '../../api/token/model';
import { UserInfoRequest } from '~lib/types';
import { UserModel } from '../../api/user.model';
import { configs } from '~config';
import {
  error,
  unauthorized,
} from '~lib/responses';
import { verify } from '~lib/token-utils';

const {
  COOKIE_AUTH_HEADER_NAME: headerName,
  COOKIE_AUTH_KEY_NAME: keyName,
} = configs;

export const authTokenParser = (subject: string = 'user'): RequestHandler => {
  return async (
    req: UserInfoRequest<UserModel>,
    res: Response,
    next: NextFunction,
  ) => {
    const access_token = req.get(headerName);

    if (!access_token) {
      req.user = null;
      return next();
    }

    try {
      const payload = await verify<{ user: UserModel }>(
        // @ts-ignore
        access_token,
      );

      req.user = payload[subject] || null;
    } catch (err) {
      req.user = null;
    }

    return next();
  };
};

export const refreshTokenParser = (subject: string = 'user_id'): RequestHandler => {
  return async (
    req: UserInfoRequest<UserModel>,
    res: Response,
    next: NextFunction,
  ) => {
    const failedResponse = (response) => {
      response.clearCookie(keyName);
      return unauthorized(response);
    };

    if (
      !req.signedCookies ||
      !req.signedCookies[keyName]
    ) {
      return failedResponse(res);
    }

    const token = req.signedCookies[keyName];

    try {
      const payload = await verify<{ [key: string]: string }>(token);

      if (!payload[subject]) {
        return failedResponse(res);
      }

      const refresh_token = await TokenModel
        .query()
        .where('refresh_token', token)
        .first();

      if (!refresh_token || !refresh_token.refresh_token) {
        return failedResponse(res);
      }

      req.refresh_token = refresh_token.refresh_token;

      return next();
    } catch (err) {
      if (
        err.name === 'JsonWebTokenError' ||
        err.name === 'TokenExpiredError'
      ) {
        return failedResponse(res);
      }

      return error(res, err);
    }
  };
};
