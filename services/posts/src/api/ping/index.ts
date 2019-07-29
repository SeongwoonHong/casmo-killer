import { Router } from 'express';

import * as controllers from './controller';

class AuthController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.configure();
  }

  private configure() {
    this
      .router
      .get(
        '/',
        controllers.pong,
      );
  }
}

export default new AuthController().router;
