import { Request, Response } from 'express';

import { PostModel } from '../post.model';
import { error, notFound, success } from '~lib/responses';
import { QueryParamsObject } from '~lib/types';

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

export const insertPost = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const {
      exclude_fields = [],
      return_fields = [],
    } = req.query as QueryParamsObject;

    const returnFields = Array.from(
      new Set([
        ...PostModel.BASE_FIELDS,
        ...return_fields.filter((return_field) => {
          return (
            PostModel.ALL_FIELDS.includes(return_field) &&
            !exclude_fields.includes(return_field)
          );
        }),
      ]),
    );
    const newPost: PostModel = await PostModel.query()
      .insert({
        ...req.body,
      })
      .pick(returnFields)
      .first();

    return success(res, {
      newPost,
    });
  } catch (err) {
    return error(res, err);
  }
};
