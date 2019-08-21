import { Router } from 'express';

import {
  requestUserInfo,
  logout,
  updateUserInfo,
  updateUserEmail,
  updateUserPassword,
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
      .patch(
        '/:user_id/email',
        csurferify(),
        isAuthorized(),
        updateUserEmail,
      )
      .patch(
        '/:user_id/password                                     ',
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
