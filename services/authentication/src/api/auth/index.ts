import { Router } from 'express';

import { csurfify } from '~lib/seesurf';

import {
  initialize,
  requestSignup,
  localRegister,
  localLogin,
} from './controller';
import { refreshTokenParser } from '~lib/middlewares/auth-token-parser';

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
        initialize,
      )
      .post(
        '/local/request',
        requestSignup,
      )
      .post(
        '/local/register',
        localRegister,
      )
      .post(
        '/local/login',
        localLogin,
      );
  }
}
