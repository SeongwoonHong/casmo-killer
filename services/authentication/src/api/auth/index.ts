import { Router } from 'express';

import {
  csurferify,
  csurfify,
} from '~lib/middlewares/seesurf';

import {
  initialize,
  requestSignup,
  localRegister,
  localLogin,
} from './controller';
import { refreshTokenParser } from '~lib/middlewares/auth-token-parser';
import { isAuthorized } from '~lib/middlewares/authorized';

export class AuthRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.configure();
  }

  private configure(): void {
    this
      .router
      .post(
        '/initialize',
        csurfify(),
        refreshTokenParser(),
        isAuthorized(),
        initialize,
      )
      .post(
        '/local/request',
        csurferify(),
        requestSignup,
      )
      .post(
        '/local/register',
        csurferify(),
        localRegister,
      )
      .post(
        '/local/login',
        localLogin,
      );
  }
}
