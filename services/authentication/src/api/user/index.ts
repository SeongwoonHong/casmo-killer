import { Router } from 'express';

import {
  requestUserInfo,
  logout,
  updateUserInfo,
} from './controller';

import { csurferify } from '~lib/middlewares/seesurf';
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
      .patch(
        '/:user_id',
        csurferify(),
        isAuthorized(),
        updateUserInfo,
      )
      .post(
        '/logout',
        csurferify(),
        refreshTokenParser(),
        isAuthorized(),
        logout,
      );
  }
}
