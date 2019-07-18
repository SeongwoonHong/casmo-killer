import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { QueryParamsObject } from './types';

export const queryStringMapper = (
  queryParser = parseQs,
  csvParser = parseCSV,
): RequestHandler => {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    req.query = queryParser(
      {
        ...req.query,
      },
      csvParser,
    );

    next();
  };
};

export const parseQs = (
  queryObject: any,
  csvParser = parseCSV,
): QueryParamsObject => {
  const {
    exclude_fields = '',
    ids = '',
    return_fields = '',
  } = queryObject || {};

  return {
    exclude_fields: csvParser(exclude_fields),
    ids: csvParser(ids),
    return_fields: csvParser(return_fields),
  };
};

export const parseCSV = (queryString: string = ''): string[] => {
  if (!queryString) {
    return [];
  }

  if (queryString.indexOf(',') > -1) {
    return queryString
      .split(',')
      .filter(q => q.length > 0);
  }

  return [queryString];
};
