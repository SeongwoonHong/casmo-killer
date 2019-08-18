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
  isValidAvatar,
  validDisplayName,
  validEmail,
  validNull,
  validPassword,
} from '~lib/validations';

const {
  SOCIAL_AUTH_PROVIDERS: socialProviders,
} = configs;

export const requestSignup = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    req.body,
    JoiObject({
      email: validEmail,
      redirect_url: JoiString()
        .regex(/<token>/)
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
        /<token>/,
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

  if (req.body.avatar && !isValidAvatar(req.body.avatar)) {
    return badRequest(
      res,
      'Invalid avatar provided.',
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
    );

    const {
      response,
      userData,
    } = await newUser.getLogInData(
      res,
      {},
      req.query,
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

    const user: UserModel = await UserModel.findByEmail(email);

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
      req.query,
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
      strategy: JoiString().valid(socialProviders),
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

  try {
    const {
      body: {
        avatar,
        display_name,
        social_id,
        social_token,
        strategy,
      },
      // query,
    } = req;

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

    const newUser = await UserModel.registerNewUser(
      // tslint:disable-next-line:no-object-literal-type-assertion
      {
        avatar,
        display_name,
        social_id,
        strategy,
      } as UserModel,
    );

    const {
      response,
      userData,
    } = await newUser.getLogInData(
      res,
      {},
      req.query,
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
      provider: JoiString().valid(socialProviders),
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
      req.query,
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
