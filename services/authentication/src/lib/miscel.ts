import * as crypto from 'crypto';

export const generateRandomNum = (from: number, to: number): number => {
  return Math.floor(Math.random() * (to - from) + from);
};

export const generateRandomStr = (num: number = generateRandomNum(4, 10)): string => {
  return crypto.randomBytes(num).toString('hex');
};
