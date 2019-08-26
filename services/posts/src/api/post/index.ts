import { Router } from 'express';

import {
  getPosts,
  insertPost,
  deletePost,
  updatePost,
  getComments,
  insertComment,
  updateComment,
  deleteComment,
} from './controller';

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
      .delete('/:id', deletePost)
      .get('/comment/:post_id', getComments)
      .post('/comment', insertComment)
      .patch('/comment', updateComment)
      .delete('/comment/:id', deleteComment);
  }
}
