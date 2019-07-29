import { Router } from 'express';

import PingController from './ping';

class RootRoutes {

  public router: Router;

  constructor() {
    this.router = Router();
  }

  public configure(): Router {
    return this
      .router
      .use(
        '/ping',
        PingController,
      );
  }
}

export default new RootRoutes().configure();
