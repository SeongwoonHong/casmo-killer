import { Response } from 'express';
import { ValidationError } from 'joi';

import logger from './logger';

import { ErrorData } from './types';

export const unauthorized = (res: Response, message: string): Response => {
  return error(res, message, 401);
};

export const badRequest = (res: Response, message: string): Response => {
  return error(res, message, 400);
};

export const error = (
  res: Response,
  err: ErrorData | string,
  code: number = 500,
): Response => {
  let _err = err;
  const message = typeof err === 'string'
    ? err
    : (err as ErrorData).message || JSON.stringify(err);

  logger.error(message);

  if (typeof err !== 'object') {
    _err = {
      message,
      success: false,
    };
  }

  return res.status(code).json(_err);
};

export const forbidden = (res: Response, message: string): Response => {
  return error(res, message, 403);
};

export const invalidRequest = (res: Response, errorObj: ValidationError): Response => {
  const type = errorObj.details[0].type.indexOf('required') > -1
    ? 'required'
    : 'invalid';
  const message = `The ${errorObj.details[0].path[0]} is ${type}.`;

  return badRequest(res, message);
};

export const notFound = (res: Response, message: string): Response => {
  return error(res, message, 404);
};

export const redirect = (res: Response, url: string): void => {
  return res.redirect(url);
};

export const success = (res: Response, data: object): Response => {
  return res.status(200).json(data);
};
