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
  socialRegister,
  socialLogin,
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
        '/initialize',
        csurfify(),
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
