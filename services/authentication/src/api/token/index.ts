import { Router } from 'express';

import {
  getPublicRsaKey,
  refreshTokens,
  verifyToken,
} from './controller';
import { csurferify } from '~lib/seesurf';
import { isAuthorized } from '~lib/middlewares/authorized';
import { refreshTokenParser } from '~lib/middlewares/auth-token-parser';

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
        isAuthorized(),
        refreshTokenParser(),
        refreshTokens,
      )
      .post(
        '/verify',
        csurferify(),
        verifyToken,
      );
  }
}
