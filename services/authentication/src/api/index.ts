import { Router } from 'express';

import { AuthRoutes } from './auth';
import { PingRoutes } from './ping';
import { TokenRoutes } from './token';
import { UserRoutes } from './user';

export class RootRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.configure();
  }

  private configure(): void {
    this
      .router
      .use(
        '/auth',
        new AuthRoutes().router,
      )
      .use(
        '/ping',
        new PingRoutes().router,
      )
      .use(
        '/token',
        new TokenRoutes().router,
      )
      .use(
        '/user',
        new UserRoutes().router,
      );
  }
}
