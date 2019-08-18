import {
  object as JoiObject,
  string as JoiString,
  validate as JoiValidate,
  ValidationResult,
} from 'joi';
import { Request, Response } from 'express';

import { AuthStrategies, QueryParamsObject, UserInfoRequest } from '~lib/types';
import { TokenModel } from '../token/model';
import { UserModel } from '../user.model';
import {
  badRequest,
  error,
  invalidRequest,
  notFound,
  success,
  unauthorized,
} from '~lib/responses';
import { configs } from '~config';
import { isValidAvatar, validEmail, validNull } from '~lib/validations';
import { mailer } from '~lib/mailer';
import { sign } from '~lib/token-utils';

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

    if (
      !UserModel.ALL_FIELDS.includes(search_field) ||
      UserModel.PRIVATE_FIELDS.includes(search_field)
    ) {
      return badRequest(
        res,
        `${search_field} is not a valid field.`,
      );
    }

    const returnFields = UserModel.getReturnFields({
      exclude_fields,
      return_fields,
    });

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
      email: validNull,
      id: JoiString().guid({
        version: [
          'uuidv4',
        ],
      }),
      redirect_url: JoiString()
        .regex(/<token>/)
        .required(),
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
      body: {
        avatar,
        display_name,
        email,
        redirect_url,
      },
      // body: new_user_info,
    } = req;

    const user = await UserModel
      .query()
      .findById(user_id);

    if (!user) {
      return notFound(
        res,
        'User not found',
      );
    }

    if (user.strategy === AuthStrategies.local) {
      const emailValidation: ValidationResult<any> = JoiValidate(
        {
          email,
        },
        JoiObject({
          email: validEmail,
        }),
      );

      if (emailValidation.error) {
        return invalidRequest(
          res,
          emailValidation.error,
        );
      }
    }

    const shouldUpdateEmail = email &&
      user.email !== email &&
      user.strategy === AuthStrategies.local;

    if (shouldUpdateEmail) {
      const token = await sign(
        {
          email,
        },
        'email',
      );
      await mailer.sendEmailConfirmation(
        email,
        redirect_url.replace(
          /<token>/,
          token,
        ),
      );
    }

    const {
      isTaken,
    } = await UserModel.isValueTaken({
      excludeId: user_id,
      field: 'display_name',
      value: display_name,
    });

    if (isTaken) {
      return badRequest(
        res,
        'The display_name is already taken.',
      );
    }

    const newPayload = {
      avatar: avatar && user.avatar !== avatar
        ? await UserModel.uploadAvatar(
          user_id,
          avatar,
        )
        : user.avatar,
      display_name,
    };
    const updatedUser = await UserModel
      .query()
      .patchAndFetchById(
        user_id,
        newPayload,
      );

    return success(
      res,
      {
        ...(shouldUpdateEmail && {
          // tslint:disable-next-line:max-line-length
          message: `Verification email has been sent to ${email}. Please click the link in the email to confirm your new email address.`,
        }),
        user: updatedUser,
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
