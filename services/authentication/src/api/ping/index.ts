import { Router } from 'express';

import { pong } from './controller';

export class PingRoutes {
  public router: Router = Router();

  constructor() {
    this.router = Router();
    this.configure();
  }

  private configure(): void {
    this.router.get('/', pong);
  }
}
