import * as jwt from 'jsonwebtoken';

import { configs } from '~config';
import { generateRandomNum } from '~lib/miscel';

export const sign = (
  payload: object,
  subject: string,
  expiresIn: string = '7d',
): Promise<string> => {
  const {
    RSA_KEY_PAIRS: rsaKeyPairs,
  } = configs;
  const rsaKeyIndex = generateRandomNum(
    0,
    Object.keys(rsaKeyPairs).length,
  );
  const {
    private: privateKey,
  } = rsaKeyPairs[rsaKeyIndex.toString()];

  return new Promise<string>(
    (resolve, reject) => {
      jwt.sign(
        payload,
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
  const rsaKeyPairs = configs.RSA_KEY_PAIRS;
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
