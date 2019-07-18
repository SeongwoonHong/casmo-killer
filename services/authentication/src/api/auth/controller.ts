import {
  ValidationResult,
  object as JoiObject,
  string as JoiString,
  validate as JoiValidate,
} from 'joi';
import {
  Request,
  Response,
} from 'express';

import { UserModel } from '../user.model';
import {
  badRequest,
  error,
  invalidRequest,
  success,
} from '~lib/responses';
import {
  validDisplayName,
  validEmail,
  validNull,
  validPasswod,
} from '~lib/validations';
import { QueryParamsObject } from '~lib/types';

export const requestSignup = async (req: Request, res: Response): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    req.body,
    JoiObject({
      email: validEmail,
    }),
  );

  if (validations.error) {
    return invalidRequest(res, validations.error);
  }

  try {
    const {
      email,
    } = req.body;

    const {
      isTaken,
    } = await UserModel.isValueTaken({
      field: 'email',
      value: email,
    });

    if (isTaken) {
      return badRequest(
        res,
        'The email address is already taken.',
      );
    }

  } catch (err) {
    return error(res, err);
  }

  return success(
    res,
    {
      message: 'pong',
    },
  );
};

export const localRegister = async (req: Request, res: Response): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    req.body,
    JoiObject({
      avatar: validNull,
      display_name: validDisplayName,
      email: validEmail,
      password: validPasswod,
    }),
  );

  if (validations.error) {
    return invalidRequest(res, validations.error);
  }

  try {
    const {
      display_name,
      email,
    } = req.body;
    const {
      field,
      isTaken,
    } = await UserModel.isValueTaken([
      {
        field: 'email',
        value: email,
      },
      {
        field: 'display_name',
        value: display_name,
      },
    ]);

    if (isTaken) {
      return badRequest(
        res,
        `The value for ${field} is already taken.`,
      );
    }

    const {
      exclude_fields = [],
      return_fields = [],
    } = req.query as QueryParamsObject;
    const returnFields = Array.from(
      new Set([
        ...UserModel.BASE_FIELDS,
        ...return_fields.filter((return_field) => {
          return UserModel.AVAILABLE_FIELDS.includes(return_field)
            && !UserModel.PRIVATE_FIELDS.includes(return_field)
            && !exclude_fields.includes(return_field);
        }),
      ]),
    );

    const newUser: UserModel = await UserModel
      .query()
      .insert({
        ...req.body,
      })
      .pick(returnFields)
      .first();

    return success(res, newUser);
  } catch (err) {
    return error(res, err);
  }
};

export const localLogin = async (req: Request, res: Response): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    req.body,
    JoiObject({
      email: JoiString().required(),
      password: JoiString().required(),
    }),
  );

  if (validations.error) {
    return invalidRequest(res, validations.error);
  }

  try {
    const {
      email,
      // password,
    } = req.body;

    // const user = await UserModel.findByEmail(email);
    const user = await UserModel.isValueTaken({
      field: 'email',
      value: email,
    });
    return success(res, {
      user,
    });
  } catch (err) {
    return error(res, err);
  }
};
