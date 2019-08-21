import {
  JsonWebTokenError,
  TokenExpiredError,
} from 'jsonwebtoken';
import {
  NextFunction,
  RequestHandler,
  Response,
} from 'express';

import { TokenModel } from '../api/token/model';
import {
  RefreshTokenPayload,
  UserInfoRequest,
} from '~lib/types';
import { UserModel } from '../api/user.model';
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
    req: UserInfoRequest,
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

      req.access_token = access_token as unknown as string;
      req.user = payload[subject] || null;
    } catch (err) {
      req.user = null;
    }

    return next();
  };
};

export const refreshTokenParser = (
  subject: string = 'user_id',
  shouldRevoke: boolean = true,
): RequestHandler => {
  return async (
    req: UserInfoRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const failedResponse = (response) => {
      if (shouldRevoke) {
        response.clearCookie(keyName);
        return unauthorized(response);
      }

      req.refresh_token = null;
      return next();
    };

    if (
      !req.signedCookies ||
      !req.signedCookies[keyName]
    ) {
      return failedResponse(res);
    }

    try {
      const token = req.signedCookies[keyName];
      const payload = await verify<{
        [key: string]: RefreshTokenPayload,
      }>(token);

      if (!payload || !payload[subject]) {
        return failedResponse(res);
      }

      const refresh_token = await TokenModel
        .query()
        .findOne('refresh_token', token);

      if (!refresh_token || !refresh_token.refresh_token) {
        return failedResponse(res);
      }

      const _payload = payload[subject];
      // @ts-ignore
      req.user = {
        ...(req.user || {}),
        ...(_payload.user_id && {
          id: _payload.user_id,
        }),
      };
      req.refresh_token = refresh_token.refresh_token;

      return next();
    } catch (err) {
      if (
        err instanceof JsonWebTokenError ||
        err instanceof TokenExpiredError
      ) {
        return failedResponse(res);
      }

      return error(
        res,
        err,
      );
    }
  };
};
