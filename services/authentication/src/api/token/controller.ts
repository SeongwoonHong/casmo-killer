import * as Csrf from 'csrf';
import {
  JsonWebTokenError,
  TokenExpiredError,
} from 'jsonwebtoken';
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
import { constants } from '~constants';
import { verify } from '~lib/token-utils';

const {
  COOKIE_CSRF_KEY_NAME: keyName,
  RSA_KEY_PAIRS: rsaKeyPairs,
} = configs;
const {
  COOKIE_OPTIONS: cookieOptions,
  HEADER_NAME_FOR_CSRF_TOKEN: csrfHeaderName,
} = constants;

export const getCsrfToken = (
  req: UserInfoRequest,
  res: Response,
): Response => {
  const Token = new Csrf();
  const secret = Token.secretSync();
  const token = Token.create(secret);

  res
    .cookie(
      keyName,
      secret,
      cookieOptions,
    )
    .setHeader(
      csrfHeaderName,
      token,
    );

  return res
    .status(204)
    .send();
};

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

    const {
      response,
      userData,
    } = await user.getLogInData(
      res,
      tokens,
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

export const verifyToken = async (
  req: UserInfoRequest,
  res: Response,
): Promise<Response> => {
  const validations: ValidationResult<any> = JoiValidate(
    req.body,
    JoiObject({
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
      token,
    } = req.body;

    const data = await verify<object>(token);

    if (!data) {
      return badRequest(res);
    }

    return success(
      res,
      {
        data,
      },
    );
  } catch (err) {
    if (
      err instanceof JsonWebTokenError ||
      err instanceof TokenExpiredError
    ) {
      return badRequest(res);
    }

    return error(
      res,
      err,
    );
  }
};
