import * as Joi from 'joi';

export const isUrl = (url: string): boolean => {
  return /^https?:\/\//.test(url);
};

export const isBase64 = (encoded: string): boolean => {
  return /^data:image\/([a-zA-Z]*);base64,([^\"]*)/.test(encoded);
};

export const isValidAvatar = (avatar: string): boolean => {
  return avatar === '' ||
    avatar === null ||
    isUrl(avatar) ||
    isBase64(avatar);
};

export const validEmail = Joi
  .string()
  .email()
  .required();

export const validPassword = Joi
  .string()
  .min(6)
  .max(20)
  .required();

export const validDisplayName = Joi
  .string()
  .regex(/^\S*$/)
  .regex(/^[a-zA-Z0-9ㄱ-ㅎ가-힣\-\_]{4,20}/)
  .required();

export const validNull = Joi
  .any()
  .allow('', null);
