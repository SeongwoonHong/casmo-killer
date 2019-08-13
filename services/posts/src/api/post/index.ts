import { Router } from 'express';

import { getPosts } from './controller';

export class PostController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.configure();
  }

  private configure(): void {
    this.router.get('/', getPosts);
  }
}
