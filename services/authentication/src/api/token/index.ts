import { Router } from 'express';

import {
  getPublicRsaKey,
} from './controller';

export class TokenRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.configure();
  }

  private configure(): void {
    this
      .router
      .get('/secret/:key_id', getPublicRsaKey)
      .post('/refresh', getPublicRsaKey);
  }
}
