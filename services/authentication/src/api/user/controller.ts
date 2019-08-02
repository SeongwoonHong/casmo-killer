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
  success,
} from '~lib/responses';
import { configs } from '~config';

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
    return error(res, err);
  }
};

export const logout = async (
  req: UserInfoRequest<UserModel>,
  res: Response,
): Promise<Response> => {
  try {
    const {
      user: {
        id: userId,
      },
      refresh_token,
    } = req;

    if (!userId || !refresh_token) {
      return badRequest(res);
    }

    await TokenModel
      .query()
      .delete()
      .where('user_id',  userId)
      .where('refresh_token', refresh_token);

    return res
      .clearCookie(authKeyName)
      .status(204)
      .send();

  } catch (err) {
    return error(res, err);
  }
};
