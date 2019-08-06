import * as Csrf from 'csrf';

import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';

import { badRequest } from '~lib/responses';
import { configs } from '~config';

const {
  COOKIE_CSRF_KEY_NAME: keyName,
  COOKIE_CSRF_HEADER_NAME: headerName,
  COOKIE_OPTIONS: cookieOptions,
} = configs;

export const csurfify = (): RequestHandler => {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const Token = new Csrf();
    const secret = Token.secretSync();
    const token = Token.create(secret);

    if (
      !req.signedCookies ||
      !req.signedCookies[keyName] ||
      !req.get(headerName)
    ) {
      res
        .cookie(
          keyName,
          secret,
          cookieOptions,
        )
        .setHeader(
          headerName,
          token,
        );
    }

    next();
  };
};

export const csurferify = (): RequestHandler => {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (req.method !== 'GET') {
      const errorResponse = (response) => {
        response.clearCookie(keyName);
        return badRequest(res);
      };

      if (
        !req.signedCookies ||
        !req.signedCookies[keyName] ||
        !req.get(headerName)
      ) {
        return errorResponse(res);
      }

      const Token = new Csrf();
      const secret = req.signedCookies[keyName];
      const token = req.get(headerName);

      // @ts-ignore
      if (!Token.verify(secret, token)) {
        return errorResponse(res);
      }
    }

    return next();
  };
};