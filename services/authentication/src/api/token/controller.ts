import {
  Request,
  Response,
} from 'express';

import { success } from '~lib/responses';

export const pong = (req: Request, res: Response): Response => {
  return success(
    res,
    {
      message: 'pong',
    },
  );
};
