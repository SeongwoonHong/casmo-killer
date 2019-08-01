import {
  NextFunction,
  RequestHandler,
  Response,
} from 'express';

import { UserInfoRequest } from '~lib/types';
import { UserModel } from '../../api/user.model';
import { unauthorized } from '~lib/responses';

export const isAuthorized = (): RequestHandler => {
  return async (
    req: UserInfoRequest<UserModel>,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      return unauthorized(res);
    }

    return next();
  };
};
