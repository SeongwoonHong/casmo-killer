import * as Csrf from 'csrf';

import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';

import { badRequest } from '~lib/responses';
import { configs } from '~config';
import { constants } from '~constants';

const {
  COOKIE_CSRF_KEY_NAME: keyName,
} = configs;
const {
  HEADER_NAME_FOR_CSRF_TOKEN: csrfHeaderName,
} = constants;

export const csurferify = (
  rejectResponse = badRequest,
): RequestHandler => {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (req.method !== 'GET') {
      const errorResponse = (response) => {
        response.clearCookie(keyName);
        return rejectResponse(res);
      };

      if (
        !req.signedCookies ||
        !req.signedCookies[keyName] ||
        !req.get(csrfHeaderName)
      ) {
        return errorResponse(res);
      }

      const Token = new Csrf();
      const secret = req.signedCookies[keyName];
      const token = req.get(csrfHeaderName);

      // @ts-ignore
      if (!Token.verify(secret, token)) {
        return errorResponse(res);
      }
    }

    return next();
  };
};
