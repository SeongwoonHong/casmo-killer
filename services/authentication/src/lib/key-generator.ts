import { generateKeyPair } from 'crypto';

import { RsaKeyPair } from '~lib/types';

export const generateRsaPair = (): Promise<RsaKeyPair> => {
  return new Promise((resolve, reject) => {
    return generateKeyPair(
      'rsa',
      {
        modulusLength: 2048,
        privateKeyEncoding: {
          format: 'pem',
          type: 'pkcs8',
        },
        publicKeyEncoding: {
          format: 'pem',
          type: 'spki',
        },
      },
      (err: Error, publicKey: string, privateKey: string) => {
        if (err) {
          return reject({
            ...err,
            message: 'Failed to generate RSA key pair',
          });
        }
        return resolve({
          privateKey,
          publicKey,
        });
      });
  });
};

export const loadRsaKeys = (
  count: number = 7,
  generator = generateRsaPair,
): Promise<RsaKeyPair[]> => {
  return Promise.resolve([]);
};

export const saveRsaKeys = () => {
  return '';
};
