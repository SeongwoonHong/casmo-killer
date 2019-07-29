import { Router } from 'express';

import {
  requestUserInfo,
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
      .get('/', requestUserInfo);
  }
}
