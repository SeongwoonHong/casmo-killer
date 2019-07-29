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

    return next();
  };
};

export const parseQs = (
  queryObject: any,
  csvParser = parseCSV,
): QueryParamsObject => {
  const {
    exclude_fields = '',
    search_values = '',
    search_field = 'id',
    return_fields = '',
  } = queryObject || {};

  return {
    exclude_fields: csvParser(exclude_fields),
    return_fields: csvParser(return_fields),
    search_field,
    search_values: csvParser(search_values),
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
