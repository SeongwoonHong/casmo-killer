import {
  ValidationResult,
  object as JoiObject,
  validate as JoiValidate,
  string as JoiString,
} from 'joi';
import {
  Request,
  Response,
} from 'express';

import { UserInfoRequest } from '~lib/types';
import { UserModel } from '../user.model';
import {
  badRequest,
  error,
  invalidRequest,
  success,
} from '~lib/responses';
import { configs } from '~config';
import { verify } from '~lib/token-utils';

const {
  RSA_KEY_PAIRS: rsaKeyPairs,
} = configs;

export const getPublicRsaKey = (
  req: Request,
  res: Response,
): Response => {
  const validations: ValidationResult<any> = JoiValidate(
    req.params,
    JoiObject({
      key_id: JoiString().guid({
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

  const {
    key_id,
  } = req.params;

  if (!rsaKeyPairs[key_id] || !rsaKeyPairs[key_id].public) {
    return badRequest(res);
  }

  return success(
    res,
    {
      public_key: rsaKeyPairs[key_id].public,
    },
  );
};

export const refreshTokens = async (
  req: UserInfoRequest,
  res: Response,
): Promise<Response> => {
  const {
    refresh_token,
    user: {
      id,
    },
  } = req;

  try {
    const {
      user,
      tokens,
    } = await UserModel.refreshTokens(
      id,
      refresh_token,
    );

    return await user.logIn(
      res,
      tokens,
    );
  } catch (err) {
    return error(
      res,
      err,
    );
  }
};

export const verifyToken = async (
  req: UserInfoRequest,
  res: Response,
): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    req.body,
    JoiObject({
      subject: JoiString().required(),
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
      subject,
      token,
    } = req.body;

    const payload = await verify<object>(token);

    if (!payload.hasOwnProperty(subject)) {
      return badRequest(res);
    }

    return success(
      res,
      payload[subject],
    );
  } catch (err) {
    if (
      err.name === 'JsonWebTokenError' ||
      err.name === 'TokenExpiredError'
    ) {
      return badRequest(res);
    }

    return error(
      res,
      err,
    );
  }
};
