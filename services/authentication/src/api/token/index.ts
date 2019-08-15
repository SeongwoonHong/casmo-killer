import { Router } from 'express';

import {
  getPublicRsaKey,
  refreshTokens,
  verifyToken,
} from './controller';
import { csurferify } from '~lib/middlewares/seesurf';
import { isAuthorized } from '~lib/middlewares/authorized';
import { refreshTokenParser } from '~lib/middlewares/token-parser';

export class TokenRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.configure();
  }

  private configure(): void {
    this
      .router
      .get(
        '/secret/:key_id',
        isAuthorized(),
        getPublicRsaKey,
      )
      .post(
        '/refresh',
        csurferify(),
        refreshTokenParser(),
        isAuthorized(true),
        refreshTokens,
      )
      .post(
        '/verify',
        csurferify(),
        verifyToken,
      );
  }
}
