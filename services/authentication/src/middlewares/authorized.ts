import {
  NextFunction,
  RequestHandler,
  Response,
} from 'express';

import { UserInfoRequest } from '~lib/types';
import { configs } from '~config';
import { unauthorized } from '~lib/responses';

const {
  COOKIE_AUTH_KEY_NAME: keyName,
} = configs;

export const isAuthorized = (
  shouldRevoke = false,
  rejectResponse = unauthorized,
): RequestHandler => {
  return async (
    req: UserInfoRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      if (shouldRevoke) {
        res.clearCookie(keyName);
      }

      return rejectResponse(res);
    }

    return next();
  };
};
