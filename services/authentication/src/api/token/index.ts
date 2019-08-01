import { Router } from 'express';

import {
  getPublicRsaKey,
  refreshTokens,
  verifyToken,
} from './controller';
import { refreshTokenParser } from '~lib/middlewares/auth-token-parser';
import { isAuthorized } from '~lib/middlewares/authorized';

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
        isAuthorized(),
        refreshTokenParser(),
        refreshTokens,
      )
      .post(
        '/verify',
        verifyToken,
      );
  }
}
