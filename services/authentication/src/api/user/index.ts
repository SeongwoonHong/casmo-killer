import { Router } from 'express';

import {
  requestUserInfo,
  logout,
  updateUserInfo,
  updateUserPassword,
  requestNewEmail,
  verifyNewEmail,
} from './controller';

import { csurferify } from '~middlewares/seesurf';
import { isAuthorized } from '~middlewares/authorized';
import { refreshTokenParser } from '~middlewares/token-parser';

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
        '/:user_id/request/email',
        csurferify(),
        isAuthorized(),
        requestNewEmail,
      )
      .post(
        '/:user_id/verify/email',
        csurferify(),
        isAuthorized(),
        verifyNewEmail,
      )
      .patch(
        '/:user_id/password',
        csurferify(),
        isAuthorized(),
        updateUserPassword,
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
