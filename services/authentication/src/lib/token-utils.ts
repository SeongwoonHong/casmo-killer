import * as jwt from 'jsonwebtoken';

import { configs } from '~config';
import { generateRandomNum } from '~lib/miscel';

const {
  RSA_KEY_PAIRS: rsaKeyPairs,
} = configs;

export const sign = (
  payload: object,
  subject: string,
  expiresIn: string = '7d',
): Promise<string> => {
  const keyIds = Object.keys(rsaKeyPairs);
  const rsaKeyIndex = generateRandomNum(
    0,
    keyIds.length,
  );
  const {
    private: privateKey,
  } = rsaKeyPairs[keyIds[rsaKeyIndex]];

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
            kid: rsaKeyIndex,
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
    jwt.verify(
      token,
      rsaKeyPairs[tokenHeader.kid || 0].publicKey,
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
  const buffHeader = new Buffer(
    token.split('.')[0],
    'base64',
  );
  const strHeader = buffHeader.toString();

  try {
    return JSON.parse(strHeader);
  } catch (error) {
    // tslint:disable-next-line:no-object-literal-type-assertion
    return {} as T;
  }
};
