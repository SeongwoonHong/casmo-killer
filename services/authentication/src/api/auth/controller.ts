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
import { QueryParamsObject } from '~lib/types';
// import { aws } from '~lib/aws';
import {
  badRequest,
  error, forbidden,
  invalidRequest, notFound,
  success,
} from '~lib/responses';
import { configs } from '~config';
// import { sendSignupConfirmation } from '~lib/mail';
import {
  validDisplayName,
  validEmail,
  validNull,
  validPasswod,
} from '~lib/validations';
import { logger } from '~lib/logger';
import { sign } from '~lib/token-utils';

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

    const token = await sign(
      {
        email,
      },
      'email',
    );

    logger.info(token);
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

    const {
      access_token,
      refresh_token,
    } = await newUser.generateTokens();

    res
      .cookie(
        configs.COOKIE_AUTH_KEY_NAME,
        refresh_token,
        configs.COOKIE_OPTIONS,
      )
      .setHeader(
        configs.COOKIE_AUTH_HEADER_NAME,
        access_token,
      );

    return success(
      res,
      newUser,
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
        'User not found,',
      );
    }

    const isPwdCorrect = await user.verifyPassword(password);

    if (!isPwdCorrect) {
      return forbidden(
        res,
        'Password is incorrect.',
      );
    }

    return success(res, {
      user,
    });
  } catch (err) {
    return error(res, err);
  }
};
