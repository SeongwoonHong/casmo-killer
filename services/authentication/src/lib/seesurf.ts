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
  COOKIE_IS_SECURE: isSecure,
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

    res
      .cookie(keyName, secret, {
        httpOnly: true,
        secure: isSecure,
        signed: true,
      })
      .setHeader(headerName, token);

    next();
  };
};

export const csurferify = (): RequestHandler => {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const errorResponse = badRequest(
      res,
      'Malformed Request',
    );

    if (
      !req.signedCookies ||
      !req.signedCookies[keyName] ||
      !req.get(headerName)
    ) {
      return errorResponse;
    }

    const Token = new Csrf();
    const secret = req.signedCookies[keyName];
    const token = req.get(headerName);

    // @ts-ignore
    if (!Token.verify(secret, token)) {
      return errorResponse;
    }

    return next();
  };
};
