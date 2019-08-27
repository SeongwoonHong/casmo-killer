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

import { UserInfoRequest } from '~lib/types';
import { UserJobs } from '../jobs.model';
import { UserModel } from '../user.model';
import {
  badRequest,
  error,
  forbidden,
  invalidRequest,
  notFound,
  success,
} from '~lib/responses';
import { configs } from '~config';
import { constants } from '~constants';
import {
  isValidAvatar,
  validDisplayName,
  validEmail,
  validNull,
  validPassword,
} from '~lib/validations';
import { mailer } from '~lib/mailer';
import { socialAuth } from '~lib/social-auth';

const {
  MSG_FOR_REQUEST_SIGNUP: confirmMsg,
} = configs;
const {
  SOCIAL_AUTH_PROVIDERS: socialProviders,
} = constants;

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
    return invalidRequest(
      res,
      validations.error,
    );
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

    const verificationCode = await UserJobs.generateJobToken();

    await mailer.sendRegisterConfirmation(
      email,
      verificationCode,
    );

    await UserJobs.registerRegisterConfirm(
      email,
      verificationCode,
    );

    return success(
      res,
      {
        // tslint:disable-next-line:max-line-length
        message: confirmMsg.replace(
          /<email>/,
          email,
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

export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    req.body,
    JoiObject({
      code: JoiString().required(),
      email: validEmail,
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
      code,
      email,
    } = req.body;

    const userJob = await UserJobs.findUserForRegistration(
      code,
      email,
    );

    if (!userJob) {
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
      token: JoiString().required(),
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
      avatar,
      display_name,
      email,
      password,
    } = req.body;

    if (avatar && !isValidAvatar(avatar)) {
      return badRequest(
        res,
        'Invalid avatar provided.',
      );
    }

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

    const registered_job = await UserJobs
      .query()
      .findOne({
        job_name: constants.JOB_NAME_FOR_REGISTRATION,
        token: req.body.token,
        user_id: req.body.email,
      });

    if (!registered_job) {
      return badRequest(
        res,
        'The link has expired.',
      );
    }

    // tslint:disable-next-line:no-object-literal-type-assertion
    const newUser = await UserModel.registerNewUser({
      avatar,
      display_name,
      email,
      password,
      strategy: 'local',
    } as UserModel);

    const {
      response,
      userData,
    } = await newUser.getLogInData(
      res,
      {},
      req,
    );

    await UserJobs.completeRegistrationJob(email);

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

export const localLogin = async (
  req: UserInfoRequest,
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
    return invalidRequest(
      res,
      validations.error,
    );
  }

  try {
    const {
      email,
      password,
    } = req.body;

    const user = await UserModel.findByEmail(email);

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

    const {
      response,
      userData,
    } = await user.getLogInData(
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

export const socialRegister = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    req.body,
    JoiObject({
      avatar: validNull,
      display_name: validDisplayName,
      social_id: JoiString().required(),
      social_token: JoiString().required(),
      strategy: JoiString().valid(...socialProviders),
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
        avatar,
        display_name,
        social_id,
        social_token,
        strategy,
      },
    } = req;

    if (avatar && !isValidAvatar(avatar)) {
      return badRequest(
        res,
        'Invalid avatar provided.',
      );
    }

    const socialProfile = await socialAuth.fetchSocialInfo(
      strategy,
      social_token,
    );

    if (socialProfile.social_id !== social_id) {
      return badRequest(
        res,
        'Incorrect social profile information provided.',
      );
    }

    // tslint:disable-next-line:no-object-literal-type-assertion
    const newUser = await UserModel.registerNewUser({
      avatar,
      display_name,
      social_id,
      strategy,
    } as UserModel);

    const {
      response,
      userData,
    } = await newUser.getLogInData(
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

export const socialLogin = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    req.body,
    JoiObject({
      accessToken: JoiString().required(),
      provider: JoiString().valid(...socialProviders),
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
      accessToken,
      provider,
    } = req.body;

    const socialProfile = await socialAuth.fetchSocialInfo(
      provider,
      accessToken,
    );

    const socialUser = await UserModel.findBySocialProfile(
      socialProfile.strategy,
      socialProfile.social_id,
    );

    if (!socialUser) {
      return success(
        res,
        {
          profile: socialProfile,
          should_register: true,
        },
      );
    }

    const {
      response,
      userData,
    } = await socialUser.getLogInData(
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
