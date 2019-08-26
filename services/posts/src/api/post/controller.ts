import {
  ValidationResult,
  object as JoiObject,
  validate as JoiValidate,
  string as JoiString,
} from 'joi';
import { Request, Response } from 'express';

import { PostModel } from '../post.model';
import { CommentModel } from '../comment.model';
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

export const updatePost = async (
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
      id: JoiString().guid({
        version: ['uuidv4'],
      }),
    }),
  );

  if (validations.error) {
    return invalidRequest(res, validations.error);
  }

  // if (req.params.id !== req.body.id) {
  //   return badRequest(res);
  // }

  // if (req.user.id !== req.body.user_id) {
  //   return unauthorized(res);
  // }

  try {
    const { id, title, thumnail, body } = req.body;
    const post = await PostModel.query().findById(id);

    if (!post) {
      return notFound(res, 'Post not found');
    }

    const newPayload = {
      title,
      thumnail,
      body,
    };

    const updatedPost = await PostModel.query().patchAndFetchById(
      id,
      newPayload,
    );

    return success(res, { updatedPost });
  } catch (err) {
    return error(res, err);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
): Promise<Response> => {
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
  try {
    const { id } = req.params;

    const deletedPost = await PostModel.query().patchAndFetchById(id, {
      deleted_at: new Date().toISOString(),
    });

    return success(res, { deletedPost });
  } catch (err) {
    return error(res, err);
  }
};

export const getComments = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    {
      ...req.params,
      ...req.body,
    },
    JoiObject({
      post_id: JoiString().guid({
        version: ['uuidv4'],
      }),
    }),
  );

  if (validations.error) {
    return invalidRequest(res, validations.error);
  }
  try {
    const { post_id } = req.params;

    const comments: CommentModel[] = await CommentModel.getComments(post_id);

    if (comments.length === 0) {
      return notFound(res, 'Comment not found.');
    }

    return success(res, {
      comments,
    });
  } catch (err) {
    return error(res, err);
  }
};

export const insertComment = async (
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
      post_id: JoiString().guid({
        version: ['uuidv4'],
      }),
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
        ...CommentModel.BASE_FIELDS,
        ...return_fields.filter((return_field) => {
          return (
            CommentModel.ALL_FIELDS.includes(return_field) &&
            !exclude_fields.includes(return_field)
          );
        }),
      ]),
    );
    const newComment: CommentModel = await CommentModel.query()
      .insert({
        ...req.body,
      })
      .pick(returnFields)
      .first();

    return success(res, {
      newComment,
    });
  } catch (err) {
    return error(res, err);
  }
};

export const updateComment = async (
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
      post_id: JoiString().guid({
        version: ['uuidv4'],
      }),
      user_id: JoiString().guid({
        version: ['uuidv4'],
      }),
      id: JoiString().guid({
        version: ['uuidv4'],
      }),
    }),
  );

  if (validations.error) {
    return invalidRequest(res, validations.error);
  }

  // if (req.params.id !== req.body.id) {
  //   return badRequest(res);
  // }

  // if (req.user.id !== req.body.user_id) {
  //   return unauthorized(res);
  // }

  try {
    const { id, body } = req.body;
    const comment = await CommentModel.query().findById(id);

    if (!comment) {
      return notFound(res, 'Comment not found');
    }

    const newPayload = {
      body,
    };

    const updatedComment = await CommentModel.query().patchAndFetchById(
      id,
      newPayload,
    );

    return success(res, { updatedComment });
  } catch (err) {
    return error(res, err);
  }
};

export const deleteComment = async (
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

    const { id } = req.params;

    const deletedComment = await CommentModel.query().patchAndFetchById(id, {
      deleted_at: new Date().toISOString(),
    });

    return success(res, { deletedComment });
  } catch (err) {
    return error(res, err);
  }
};
