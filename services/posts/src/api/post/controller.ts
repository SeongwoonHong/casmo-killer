import { Request, Response } from 'express';

import { PostModel } from '../post.model';
// import { aws } from '~lib/aws';
import { error, notFound, success } from '~lib/responses';

export const getPosts = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const posts: PostModel[] = await PostModel.getPosts();

    if (posts.length === 0) {
      return notFound(res, 'Post not found.');
    }

    return success(res, {
      posts,
    });
  } catch (err) {
    return error(res, err);
  }
};
