import { Router } from 'express';

import {
  requestSignup,
  localRegister,
  localLogin,
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
      .post('/local/request', requestSignup)
      .post('/local/register', localRegister)
      .post('/local/login', localLogin);
  }
}
