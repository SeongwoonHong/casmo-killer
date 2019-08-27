import {
  object as JoiObject,
  string as JoiString,
  validate as JoiValidate,
  ValidationResult,
} from 'joi';
import {
  Request,
  Response,
} from 'express';

import {
  AuthStrategies,
  QueryParamsObject,
  UserInfoRequest,
} from '~lib/types';
import { TokenModel } from '../token/model';
import { UserJobs } from '../jobs.model';
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
import { constants } from '~constants';
import { hash } from '~lib/bcrypt';
import {
  isValidAvatar,
  validEmail,
  validNull,
  validPassword,
} from '~lib/validations';
import { mailer } from '~lib/mailer';
import { verify } from '~lib/token-utils';

const {
  COOKIE_AUTH_KEY_NAME: authKeyName,
  MSG_FOR_REQUEST_EMAIL_CHANGE: confirmMsg,
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
      email: req.body.strategy === AuthStrategies.local
        ? validEmail
        : validNull,
      id: JoiString().guid({
        version: [
          'uuidv4',
        ],
      }),
      password: req.body.strategy === AuthStrategies.local
        ? validPassword
        : validNull,
      strategy: JoiString().valid(...constants.AUTH_STRATEGIES),
      token: validNull,
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

  try {
    const {
      params: {
        user_id,
      },
      body: {
        avatar,
        display_name,
        email,
        id,
        password,
        token,
      },
      user: {
        id: auth_id,
      },
    } = req;

    if (avatar && !isValidAvatar(avatar)) {
      return badRequest(
        res,
        'Invalid avatar provided.',
      );
    }

    if (
      user_id !== id ||
      user_id !== auth_id ||
      id !== auth_id
    ) {
      return badRequest(res);
    }

    const user = await UserModel
      .query()
      .findById(user_id);

    if (!user) {
      return notFound(
        res,
        'User not found',
      );
    }

    const shouldUpdateEmail = user.strategy === AuthStrategies.local &&
      user.email !== email &&
      email;

    const {
      isTaken,
      field,
    } = await UserModel.isValueTaken([
      user.display_name !== display_name && {
        excludeId: user_id,
        field: 'display_name',
        value: display_name,
      },
      shouldUpdateEmail && {
        excludeId: user_id,
        field: 'email',
        value: email,
      },
    ]);

    if (isTaken) {
      return badRequest(
        res,
        `The ${field.replace(/_/, ' ')} is already taken.`,
      );
    }

    if (shouldUpdateEmail) {
      const jobData = await UserJobs.findUserForEmailUpdate(
        token,
        user_id,
      );

      if (!jobData) {
        return badRequest(
          res,
          'Please confirm your new email address.',
        );
      }
    }

    const isPwdSame = await user.verifyPassword(password);

    if (!isPwdSame) {
      const hasPwdBeenUsed = await user.hasPwdBeenUsed(password);

      if (hasPwdBeenUsed) {
        return badRequest(
          res,
          'The new password cannot be one of previously used passwords.',
        );
      }
    }

    const newPayload = {
      ...user,
      avatar: avatar && user.avatar !== avatar
        ? await UserModel.uploadAvatar(
          user_id,
          avatar,
        )
        : user.avatar,
      display_name,
      ...(!isPwdSame && ((newPassword) => ({
        password: newPassword,
        prev_passwords: user.prev_passwords.concat(user.password),
      }))(await hash(password))),
      email,
    };

    const updatedUser = await user
      .$query()
      .patchAndFetch(newPayload);

    const {
      response,
      userData,
    } = await updatedUser.getLogInData(
      res,
      {},
      req,
    );

    if (shouldUpdateEmail) {
      await UserJobs.completeEmailUpdate(
        user_id,
      );
    }

    return success(
      response,
      {
        ...(shouldUpdateEmail && {
          message: confirmMsg.replace(/<email>/, email),
        }),
        user: userData,
      },
    );
  } catch (err) {
    return error(
      res,
      err,
    );
  }
};

export const requestNewEmail = async (
  req: UserInfoRequest,
  res: Response,
): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    {
      ...req.params,
      ...req.body,
    },
    JoiObject({
      new_email: validEmail,
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

  try {
    const {
      body: {
        new_email,
      },
      params: {
        user_id,
      },
      user: {
        id: userId,
      },
    } = req;

    if (user_id !== userId) {
      return badRequest(res);
    }

    const user = await UserModel
      .query()
      .findById(user_id);

    if (!user) {
      return notFound(
        res,
        'User not found.',
      );
    }

    if (user.email === new_email) {
      return badRequest(
        res,
        'New email must be different from the current email.',
      );
    }

    const {
      isTaken,
    } = await UserModel.isValueTaken({
      excludeId: user_id,
      field: 'email',
      value: new_email,
    });

    if (isTaken) {
      return badRequest(
        res,
        'The email address is already taken.',
      );
    }

    const verificationCode = await UserModel.generateJobToken();

    await mailer.sendRegisterConfirmation(
      new_email,
      verificationCode,
    );

    await UserJobs.registerEmailUpdate(
      user_id,
      verificationCode,
    );

    return success(
      res,
      {
        // tslint:disable-next-line:max-line-length
        message: confirmMsg.replace(
          /<email>/,
          new_email,
        ),
      },
    );
  } catch (err) {
    return error(
      res,
      err,
    );
  }
};

export const verifyNewEmail = async (
  req: UserInfoRequest,
  res: Response,
): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    {
      ...req.params,
      ...req.body,
    },
    JoiObject({
      new_email: validEmail,
      token: JoiString().required(),
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

  try {
    const {
      body: {
        new_email,
        token,
      },
      params: {
        user_id,
      },
      user: {
        id: userId,
      },
    } = req;

    if (user_id !== userId) {
      return badRequest(res);
    }

    const user = await UserModel
      .query()
      .findById(user_id);

    if (!user) {
      return notFound(
        res,
        'User not found.',
      );
    }

    if (user.email === new_email) {
      return badRequest(
        res,
        'New email must be different from the current email.',
      );
    }

    const {
      isTaken,
    } = await UserModel.isValueTaken({
      excludeId: user_id,
      field: 'email',
      value: new_email,
    });

    if (isTaken) {
      return badRequest(
        res,
        'The email address is already taken.',
      );
    }

    const jobData = await UserJobs
      .query()
      .findOne({
        job_name: constants.JOB_NAME_FOR_EMAIL_UPDATE,
        token,
        user_id,
      });

    if (!jobData) {
      return badRequest(
        res,
        'Incorrect verification code provided.',
      );
    }

    return res
      .status(204)
      .send();
  } catch (err) {
    return error(
      res,
      err,
    );
  }
};

export const updateUserPassword = async (
  req: UserInfoRequest,
  res: Response,
): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    {
      ...req.params,
      ...req.body,
    },
    JoiObject({
      confirm_password: validPassword,
      new_password: validEmail,
      token: JoiString().required(),
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

  try {
    const {
      body: {
        confirm_password,
        new_password,
        token,
      },
      params: {
        user_id,
      },
      user: {
        id: userId,
        email: user_email,
      },
    } = req;

    if (user_id !== userId) {
      return unauthorized(res);
    }

    if (confirm_password !== new_password) {
      return badRequest(
        res,
        'Passwords do not match.',
      );
    }

    const user = await UserModel
      .query()
      .findById(user_id);

    if (!user) {
      return notFound(
        res,
        'User not found.',
      );
    }

    const userJob = await UserJobs
      .query()
      .findOne({
        job_name: constants.JOB_NAME_FOR_PWD_UPDATE,
        token,
        user_id,
      });

    if (!userJob) {
      return badRequest(
        res,
        'The link has expired.',
      );
    }

    const registeredEmail = await verify<{
      email: string,
    }>(token);

    if (
      !registeredEmail ||
      !registeredEmail.email ||
      registeredEmail.email !== user_email
    ) {
      return badRequest(
        res,
        'The link has expired.',
      );
    }

    const hasPwdBeenUsed = await user.hasPwdBeenUsed(new_password);

    if (hasPwdBeenUsed) {
      return badRequest(
        res,
        'The new password cannot be one of previously used passwords.',
      );
    }

    const updatedUser = await user.updatePassword(new_password);

    const {
      response,
      userData,
    } = await updatedUser.getLogInData(
      res,
      {},
      req,
    );

    return success(
      response,
      {
        user: userData,
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
