import { Router } from 'express';

import {
  requestUserInfo,
  logout,
} from './controller';

import { csurferify } from '~lib/seesurf';
import { isAuthorized } from '~lib/middlewares/authorized';
import { refreshTokenParser } from '~lib/middlewares/auth-token-parser';

export class UserRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.configure();
  }

  private configure(): void {
    this
      .router
      .get(
        '/',
        requestUserInfo,
      )
      .post(
        '/logout',
        csurferify(),
        isAuthorized(),
        refreshTokenParser(),
        logout,
      );
  }
}
