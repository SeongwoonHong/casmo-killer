import {
  Request,
  Response,
} from 'express';

import { configs } from '~config';
import {
  invalidRequest,
  success,
} from '~lib/responses';
import {
  object as JoiObject,
  validate as JoiValidate,
  string as JoiString,
  ValidationResult,
} from 'joi';

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

  const public_key = configs.RSA_KEY_PAIRS[req.params.key_id]
    ? configs.RSA_KEY_PAIRS[req.params.key_id].public || ''
    : '';

  return success(
    res,
    {
      public_key,
    },
  );
};

export const refreshTokens = (
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

  const public_key = configs.RSA_KEY_PAIRS[req.params.key_id]
    ? configs.RSA_KEY_PAIRS[req.params.key_id].public || ''
    : '';

  return success(
    res,
    {
      public_key,
    },
  );
};
