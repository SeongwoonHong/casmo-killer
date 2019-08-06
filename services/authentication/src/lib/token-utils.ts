import * as jwt from 'jsonwebtoken';

import { configs } from '~config';
import { generateRandomNum } from '~lib/miscel';

const {
  RSA_KEY_PAIRS: rsaKeyPairs,
} = configs;

export const sign = (
  payload: object | string,
  subject: string,
  expiresIn: number | string = '7d',
): Promise<string> => {
  const keyIds = Object.keys(rsaKeyPairs);
  const rsaKeyIndex = generateRandomNum(
    0,
    keyIds.length,
  );
  const kid = keyIds[rsaKeyIndex];
  const {
    private: privateKey,
  } = rsaKeyPairs[kid];

  return new Promise<string>(
    (resolve, reject) => {
      jwt.sign(
        {
          [subject]: payload,
        },
        privateKey,
        {
          algorithm: 'RS256',
          expiresIn,
          header: {
            kid,
          },
          issuer: configs.TOKEN_ISSUER,
          subject,
        },
        (error: Error, token: string) => {
          if (error) {
            reject(error);
          }

          resolve(token);
        },
      );
    });
};

export const verify = <T>(token: string): Promise<T> => {
  const tokenHeader = extPrsHeader<{ kid: string }>(token);

  return new Promise((resolve, reject) => {
    if (
      !tokenHeader.kid ||
      !rsaKeyPairs[tokenHeader.kid] ||
      !rsaKeyPairs[tokenHeader.kid].public
    ) {
      return reject({
        message: 'Malformed token',
      });
    }

    jwt.verify(
      token,
      rsaKeyPairs[tokenHeader.kid].public,
      (error: jwt.JsonWebTokenError, decoded) => {
        if (error) {
          reject(error);
        }

        resolve(decoded);
      },
    );
  });
};

export const extPrsHeader = <T>(token: string): T => {
  if (!token) {
    // tslint:disable-next-line:no-object-literal-type-assertion
    return {} as T;
  }

  const buffHeader = Buffer.from(
    token.split('.')[0],
    'base64',
  );
  const strHeader = buffHeader.toString('ascii');

  try {
    return JSON.parse(strHeader);
  } catch (error) {
    // tslint:disable-next-line:no-object-literal-type-assertion
    return {} as T;
  }
};
