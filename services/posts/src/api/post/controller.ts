import {
  ValidationResult,
  object as JoiObject,
  validate as JoiValidate,
  string as JoiString,
} from 'joi';
import { Request, Response } from 'express';

import { PostModel } from '../post.model';
import { error, notFound, success, invalidRequest } from '~lib/responses';
import { QueryParamsObject } from '~lib/types';
import { validNotNull, validNull } from '~lib/validations';

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
  const validations: ValidationResult<any> = JoiValidate(
    {
      ...req.params,
      ...req.body,
    },
    JoiObject({
      body: validNotNull,
      thumnail: validNull,
      title: validNotNull,
      user_id: JoiString().guid({
        version: ['uuidv4'],
      }),
    }),
  );

  if (validations.error) {
    return invalidRequest(res, validations.error);
  }
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

export const deletePost = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const validations: ValidationResult<any> = JoiValidate(
      {
        ...req.params,
        ...req.body,
      },
      JoiObject({
        id: JoiString().guid({
          version: ['uuidv4'],
        }),
      }),
    );

    if (validations.error) {
      return invalidRequest(res, validations.error);
    }

    const { id } = req.body;

    const deletedPost: number = await PostModel.query().deleteById(id);

    if (deletedPost === 1) {
      return success(res, {
        result: req.body,
      });
    }

    throw new Error('Error');
  } catch (err) {
    return error(res, err);
  }
};
