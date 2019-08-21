import {
  NextFunction,
  RequestHandler,
  Response,
} from 'express';

import { UserInfoRequest } from '~lib/types';

export const userAgentMapper = (): RequestHandler => {
  return async (
    req: UserInfoRequest,
    res: Response,
    next: NextFunction,
  ) => {
    req.user_agent = req.headers['user-agent'] || null;

    next();
  };
};
