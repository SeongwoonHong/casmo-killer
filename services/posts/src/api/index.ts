import { Router } from 'express';

import { PostController } from './post';
import PingController from './ping';

class RootRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  public configure(): Router {
    return this.router
      .use('/post', new PostController().router)
      .use('/ping', PingController);
  }
}

export default new RootRoutes().configure();
