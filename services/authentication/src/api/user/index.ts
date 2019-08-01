import { Router } from 'express';

import { isAuthorized } from '~lib/middlewares/authorized';
import { csurfify } from '~lib/seesurf';
import {
  requestUserInfo,
  logout,
  verify,
} from './controller';

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
        '/verify',
        verify,
      )
      .post(
        '/logout',
        csurfify(),
        isAuthorized(),
        logout,
      );
  }
}
