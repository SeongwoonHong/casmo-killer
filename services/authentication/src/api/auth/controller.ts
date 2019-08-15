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

import {
  SocialAuthResponse,
  UserInfoRequest,
} from '~lib/types';
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
import { mailer } from '~lib/mailer';
import { sign } from '~lib/token-utils';
import { socialAuth } from '~lib/social-auth';
import {
  validDisplayName,
  validEmail,
  validNull,
  validPassword,
} from '~lib/validations';

const {
  SOCIAL_AUTH_PROVIDERS: socialProviders,
} = configs;

export const initialize = (
  req: UserInfoRequest,
  res: Response,
): Response => {
  return res
    .status(204)
    .send();
};

export const requestSignup = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    req.body,
    JoiObject({
      email: validEmail,
      redirect_url: JoiString()
        .regex(/<email>/)
        .required(),
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
      redirect_url,
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

    await mailer.sendRegisterConfirmation(
      email,
      redirect_url.replace(
        /<email>/,
        token,
      ),
    );

    return success(
      res,
      {
        // tslint:disable-next-line:max-line-length
        message: `Verification email has been sent to ${email}. Please click the link in the email to sign up.`,
      },
    );

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

    const newUser = await UserModel.registerNewUser(
      req.body,
      req.query,
    );

    return await newUser.logIn(res);
  } catch (err) {
    return error(
      res,
      err,
    );
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

    return await user.logIn(res);
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
      email: validEmail,
      password: validNull,
      social_id: JoiString().required(),
      social_token: JoiString().required(),
      strategy: JoiString().valid(socialProviders),
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
      strategy,
      email,
      social_id,
      social_token,
    } = req.body;

    const profile = await socialAuth.fetchSocialInfo(
      strategy,
      social_token,
    );

    if (
      profile.social_id !== social_id ||
      profile.email !== email
    ) {
      return badRequest(
        res,
        'Incorrect social profile information provided.',
      );
    }

  } catch (err) {
    return error(
      res,
      {
        ...err,
        message: 'Failed to retrieve your social profile.',
      },
    );
  }

  try {
    const newUser = await UserModel.registerNewUser(
      req.body,
      req.query,
    );

    return await newUser.logIn(res);
  } catch (err) {
    return error(res, err);
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
      provider: JoiString().valid(socialProviders),
    }),
  );

  if (validations.error) {
    return invalidRequest(
      res,
      validations.error,
    );
  }

  let socialProfile: SocialAuthResponse;

  try {
    const {
      accessToken,
      provider,
    } = req.body;

    socialProfile = await socialAuth.fetchSocialInfo(
      provider,
      accessToken,
    );
  } catch (err) {
    return error(
      res,
      {
        ...err,
        message: 'Failed to retrieve user profile',
      },
    );
  }

  try {
    const {
      email,
      social_id,
      strategy,
    } = socialProfile;
    const emailDup = await UserModel.findByEmail(email);

    if (emailDup) {
      if (
        emailDup.strategy === strategy &&
        emailDup.social_id === social_id
      ) {
        return await emailDup.logIn(res);
      }

      return forbidden(
        res,
        'Your email address is already registered with a different provider.',
      );
    }

    let socialUser = await UserModel.findBySocialProfile(
      strategy,
      social_id,
    );

    if (!socialUser) {
      return success(
        res,
        {
          profile: socialProfile,
          shouldRegister: true,
        },
      );
    }

    if (socialUser.email !== socialProfile.email) {
      socialUser = await socialUser.updateEmail(socialProfile.email);
    }

    return await socialUser.logIn(res);
  } catch (err) {
    return error(
      res,
      err,
    );
  }
};
