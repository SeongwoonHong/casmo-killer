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
import { TokenModel } from './model';
import {
  badRequest,
  error,
  invalidRequest,
  notFound,
  success,
} from '~lib/responses';
import { configs } from '~config';
import { verify } from '~lib/token-utils';
import { logger } from '~lib/logger';

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
    return invalidRequest(res, validations.error);
  }

  const {
    key_id,
  } = req.params;

  if (!rsaKeyPairs[key_id] || !rsaKeyPairs[key_id].public) {
    return badRequest(
      res,
      'Malformed request',
    );
  }

  return success(
    res,
    {
      public_key: rsaKeyPairs[key_id].public,
    },
  );
};

export const refreshTokens = async (
  req: UserInfoRequest<UserModel>,
  res: Response,
): Promise<Response> => {
  const refresh_token = req.refresh_token;

  if (!refresh_token) {
    return badRequest(
      res,
      'Malformed request',
    );
  }

  const tokenData = await TokenModel
    .query()
    .findOne('refresh_token', refresh_token);

  if (!tokenData) {
    return notFound(
      res,
      'User not found',
    );
  }

  const shit = await tokenData.refreshToken();
  logger.info(shit);

  return success(
    res,
    {
      public_key: 'rsaKeyPairs[key_id]',
    },
  );
};

export const verifyToken = async (
  req: UserInfoRequest<UserModel>,
  res: Response,
): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    req.body,
    JoiObject({
      token: JoiString().required(),
    }),
  );

  if (validations.error) {
    return invalidRequest(res, validations.error);
  }

  try {
    const {
      token,
    } = req.body;

    const payload = await verify<object>(token);

    return success(res, payload);
  } catch (err) {
    if (
      err.name === 'JsonWebTokenError' ||
      err.name === 'TokenExpiredError'
    ) {
      return badRequest(
        res,
        'Malformed request',
      );
    }

    return error(res, err);
  }
};
