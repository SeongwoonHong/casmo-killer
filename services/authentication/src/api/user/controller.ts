import {
  ValidationResult,
  object as JoiObject,
  validate as JoiValidate,
  string as JoiString,
} from 'joi';
import {
  Request,
  Response,
} from 'express';

import {
  QueryParamsObject,
  UserInfoRequest,
} from '~lib/types';
import { TokenModel } from '../token/model';
import { UserModel } from '../user.model';
import {
  badRequest,
  error,
  invalidRequest,
  notFound,
  success, unauthorized,

} from '~lib/responses';
import { configs } from '~config';
import {
  isValidAvatar,
  validEmail,
  validNull,
} from '~lib/validations';

const {
  COOKIE_AUTH_KEY_NAME: authKeyName,
} = configs;

export const requestUserInfo = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const {
      exclude_fields = [],
      search_values = [],
      search_field = 'id',
      return_fields = [],
    } = req.query as QueryParamsObject;

    if (!UserModel.ALL_FIELDS.includes(search_field)) {
      return badRequest(
        res,
        `${search_field} is not a valid field.`,
      );
    }

    const returnFields = Array.from(
      new Set([
        ...UserModel.BASE_FIELDS,
        ...return_fields.filter((return_field) => {
          return UserModel.ALL_FIELDS.includes(return_field)
            && !exclude_fields.includes(return_field);
        }),
      ]),
    );

    const users: UserModel[] = await UserModel
      .query()
      .where(
        search_field,
        'in',
        search_values,
      )
      .pick(returnFields);

    return success(
      res,
      {
        users,
      },
    );

  } catch (err) {
    return error(
      res,
      err,
    );
  }
};

export const updateUserInfo = async (
  req: UserInfoRequest,
  res: Response,
): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    {
      ...req.params,
      ...req.body,
    },
    JoiObject({
      avatar: validNull,
      display_name: JoiString().required(),
      email: validEmail,
      id: JoiString().guid({
        version: [
          'uuidv4',
        ],
      }),
      user_id: JoiString().guid({
        version: [
          'uuidv4',
        ],
      }),
    }),
  );

  if (validations.error) {
    return invalidRequest(
      res,
      validations.error,
    );
  }

  if (req.body.avatar && !isValidAvatar(req.body.avatar)) {
    return badRequest(
      res,
      'Invalid avatar provided.',
    );
  }

  if (req.params.user_id !== req.body.id) {
    return badRequest(res);
  }

  if (req.user.id !== req.body.id) {
    return unauthorized(res);
  }

  try {
    const {
      params: {
        user_id,
      },
      body: new_user_info,
    } = req;

    const user = await UserModel
      .query()
      .patchAndFetchById(
        user_id,
        new_user_info,
      );

    if (!user) {
      return notFound(
        res,
        'User not found',
      );
    }

    return success(
      res,
      {
        user,
      },
    );
  } catch (err) {
    return error(
      res,
      err,
    );
  }
};

export const logout = async (
  req: UserInfoRequest,
  res: Response,
): Promise<Response> => {
  try {
    const {
      user: {
        id: userId,
      },
      refresh_token,
    } = req;

    await TokenModel
      .query()
      .delete()
      .where('user_id', userId)
      .where('refresh_token', refresh_token);

    return res
      .clearCookie(authKeyName)
      .status(204)
      .send();

  } catch (err) {
    return error(
      res,
      err,
    );
  }
};
