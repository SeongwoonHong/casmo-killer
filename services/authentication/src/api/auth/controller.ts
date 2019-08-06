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

import { TokenModel } from '../token/model';
import { UserModel } from '../user.model';
import {
  QueryParamsObject,
  UserInfoRequest,
} from '~lib/types';
// import { aws } from '~lib/aws';
import {
  badRequest,
  error, forbidden,
  invalidRequest, notFound,
  success,
} from '~lib/responses';
// import { sendSignupConfirmation } from '~lib/mail';
import {
  validDisplayName,
  validEmail,
  validNull,
  validPassword,
} from '~lib/validations';
// import { sign } from '~lib/token-utils';

export const initialize = async (
  req: UserInfoRequest,
  res: Response,
): Promise<Response> => {
  const {
    refresh_token,
    user: {
      id: userId,
    },
  } = req;

  if (!refresh_token) {
    return badRequest(res);
  }

  try {
    const {
      user,
      tokens,
    } = await UserModel.refreshTokens(
      userId,
      refresh_token,
    );

    return user.logIn(res, tokens);
  } catch (err) {
    return error(res, err);
  }
};

export const requestSignup = async (
  req: Request,
  res: Response,
): Promise<Response> => {
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

    // const token = await sign(
    //   {
    //     email,
    //   },
    //   'email',
    // );
    //
    // await aws.sendEmail(
    //   email,
    //   sendSignupConfirmation(''),
    // );

    return success(
      res,
      {
        // tslint:disable-next-line:max-line-length
        message: `Verification email has been sent to ${email}. Please click the link in the email to sign up.`,
      },
    );

  } catch (err) {
    return error(res, err);
  }
};

export const localRegister = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    req.body,
    JoiObject({
      avatar: validNull,
      display_name: validDisplayName,
      email: validEmail,
      password: validPassword,
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
      const takenField = field.replace(/_/, ' ');

      return badRequest(
        res,
        `The value for ${takenField} is already taken.`,
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
          return UserModel.ALL_FIELDS.includes(return_field)
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

    const tokens = await newUser.generateTokens();

    await TokenModel
      .query()
      .insert({
        refresh_token: tokens.refresh_token,
        user_id: newUser.id,
      });

    return newUser.logIn(
      res,
      tokens,
    );
  } catch (err) {
    return error(res, err);
  }
};

export const localLogin = async (
  req: Request,
  res: Response,
): Promise<Response> => {
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
      password,
    } = req.body;

    const user: UserModel = await UserModel.findByEmail(
      email,
      ['password'],
    );

    if (!user) {
      return notFound(
        res,
        'User not found.',
      );
    }

    const isPwdCorrect = await user.verifyPassword(password);

    if (!isPwdCorrect) {
      return forbidden(
        res,
        'Password is incorrect.',
      );
    }

    const tokens = await user.generateTokens();

    await TokenModel
      .query()
      .insert({
        refresh_token: tokens.refresh_token,
        user_id: user.id,
      });

    return user.logIn(
      res,
      tokens,
    );
  } catch (err) {
    return error(res, err);
  }
};
