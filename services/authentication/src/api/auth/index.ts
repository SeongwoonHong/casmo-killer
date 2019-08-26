import { Router } from 'express';

import { csurferify } from '~middlewares/seesurf';
import { refreshTokenParser } from '~middlewares/token-parser';
import {
  requestSignup,
  localRegister,
  localLogin,
  socialRegister,
  socialLogin,
  verifyEmail,
} from './controller';

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
        '/local/request',
        csurferify(),
        requestSignup,
      )
      .post(
        '/local/verify',
        csurferify(),
        verifyEmail,
      )
      .post(
        '/local/register',
        csurferify(),
        localRegister,
      )
      .post(
        '/local/login',
        refreshTokenParser(
          'user_id',
          false,
        ),
        localLogin,
      )
      .post(
        '/social/register',
        csurferify(),
        socialRegister,
      )
      .post(
        '/social/login',
        csurferify(),
        socialLogin,
      );
  }
}
