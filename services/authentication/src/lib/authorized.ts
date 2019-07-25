import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';

import { configs } from '~config';
import { verify } from '~lib/token-utils';
import {
  error,
  unauthorized,
} from '~lib/responses';

const {
  COOKIE_AUTH_KEY_NAME: keyName,
} = configs;

export const authorized = (): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const access_token = req.get(keyName);

    if (!access_token) {
      return unauthorized(res);
    }

    try {
      // @ts-ignore
      await verify(access_token);
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return unauthorized(res, 'Malformed Token');
      }

      if (err.name === 'TokenExpiredError') {
        return unauthorized(res, 'Token has expired.');
      }

      return error(res, err);
    }

    return next();
  };
};

export const authorizable = (): RequestHandler => {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {

    return next();
    // const errorResponse = badRequest(
    //   res,
    //   'Malformed Request',
    // );
    //
    // if (
    //   !req.signedCookies ||
    //   !req.signedCookies[keyName] ||
    //   !req.get(headerName)
    // ) {
    //   return errorResponse;
    // }
  };
};
