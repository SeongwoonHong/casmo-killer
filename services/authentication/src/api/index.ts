import { Router } from 'express';

import { AuthRoutes } from './auth';
import { PingRoutes } from './ping';
import { TokenRoutes } from './token';

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
        '/token',
        new TokenRoutes().router,
      )
      .use(
        '/ping',
        new PingRoutes().router,
      );
  }
}
