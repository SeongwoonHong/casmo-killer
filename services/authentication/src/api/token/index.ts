import { Router } from 'express';

import { csurferify } from '~middlewares/seesurf';
import {
  getCsrfToken,
  getPublicRsaKey,
  refreshTokens,
  verifyToken,
} from './controller';
import { isAuthorized } from '~middlewares/authorized';
import { refreshTokenParser } from '~middlewares/token-parser';

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
        '/csrf',
        getCsrfToken,
      )
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
