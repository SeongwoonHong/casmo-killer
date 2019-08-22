import { Router } from 'express';

import { getPosts, insertPost, deletePost, updatePost } from './controller';

export class PostController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.configure();
  }

  private configure(): void {
    this.router
      .get('/', getPosts)
      .post('/', insertPost)
      .patch('/', updatePost)
      .delete('/:post_id', deletePost);
  }
}
