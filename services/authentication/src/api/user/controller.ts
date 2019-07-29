import {
  Request,
  Response,
} from 'express';

import {
  badRequest,
  error,
  success,
} from '~lib/responses';
import { QueryParamsObject } from '~lib/types';
import { UserModel } from '../user.model';

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
      .where(search_field, 'in', search_values)
      .pick(returnFields);

    return success(
      res,
      {
        users,
      },
    );

  } catch (err) {
    return error(res, {
      ...err,
      message: 'Internal Server Error',
    });
  }
};
